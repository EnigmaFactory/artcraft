// Builds a one-page Adrullan brand sheet in DesignCraft (headless MCP) and exports a 1920x1080 PNG.
//   node enigma/flows/adrullan-brand-sheet.js [outDir]
// Tokens come from aoa-web/src/styles.css and src/content/world.ts (see enigma/guides/adrullan-style-guide.md).
const fs = require('fs');
const path = require('path');
const { McpClient } = require('./mcp-client');

const OUT = path.resolve(process.argv[2] || path.join(__dirname, '../../concepts/Adrullan'));
const CLI = process.env.DESIGNCRAFT_CLI || 'C:/Program Files/DesignCraft/designcraft-cli.exe';
const SCENE = process.env.ADRULLAN_SCENE || 'E:/EverCraft Online/aoa-web/art/scenes/leont-city-gates.webp';
const DISPLAY = process.env.ADRULLAN_DISPLAY_FONT || 'Georgia';   // brand: Suez One (CSS fallback: Georgia)
const BODY = process.env.ADRULLAN_BODY_FONT || 'Segoe UI';        // brand: Merriweather Sans (fallback: system-ui)
const W = 1280, H = 720, M = 64;

const CORE = [
  ['ink', '#0e0c12', 'page'], ['night', '#16131d', 'footer'], ['stone', '#221d2b', 'tiles'],
  ['parch', '#f4ead5', 'body text'], ['mist', '#b8ab93', 'muted'], ['gold', '#ffcf00', 'accent'],
  ['ember', '#d99a1e', 'gold end'], ['crimson', '#b3302a', 'danger'], ['moss', '#74b04f', 'live'],
];
const ASPECTS = [
  ['Fire', '#ff8a4c', '#e25822'], ['Water', '#5aa2ff', '#3b7dd8'], ['Earth', '#cfa261', '#8a6b3d'],
  ['Air', '#8fd8f2', '#7ec8e3'], ['Light', '#f6dc6e', '#f0d264'], ['Dark', '#a993f2', '#3d3160'],
];
const EXTRA = [['tint', '#e6dcc6'], ['onGold', '#1b1405'], ['onCrimson', '#fff7ea'], ['line', '#3a3430']];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const mcp = await McpClient.start(CLI, ['mcp']);
  await mcp.call('new_document', { width: W, height: H, margins: 0, title: 'Adrullan brand sheet' });

  // Pass 1: swatches, page, hero frame (the image goes in between passes; place_image is a tool, not a command)
  const p1 = new Batch();
  for (const [name, hex] of [...CORE, ...EXTRA]) p1.run('swatch.create', { name, color: hex });
  p1.rect([0, 0, W, H], 'ink');
  const hero = p1.run('frame.create', { rect: [0, 0, W, 300], content: 'graphic' });
  p1.run('object.stroke', { weight: 0, ids: [p1.ref(hero, 'id')] });
  const r1 = await mcp.json('batch', { commands: p1.cmds });
  const heroId = results(r1)[hero].id;
  await mcp.call('place_image', { path: SCENE, frame: heroId });
  await mcp.call('execute', { command: 'object.fit', params: { mode: 'fillProportionally', ids: [heroId] } });

  // Pass 2: everything else
  const b = new Batch();
  // Scene veil (home.css .scened): fade the painting into ink, plus the gold radial glow of .page-head
  b.gradientRect([0, 0, W, 302], [
    { location: 0, color: '#0e0c12', opacity: 30 }, { location: 60, color: '#0e0c12', opacity: 60 },
    { location: 100, color: '#0e0c12', opacity: 100 }], -90);
  b.gradientRect([W / 2 - 560, -280, W / 2 + 560, 280], [
    { location: 0, color: '#ffcf00', opacity: 14 }, { location: 100, color: '#ffcf00', opacity: 0 }], 0, 0, 'radial');

  b.text([M, 108, 1000, 124], 'Brand sheet  ·  v0.1  ·  Enigma Factory concepting', eyebrow());
  b.text([M, 130, 1180, 204], 'Adrullan Online Adventures', display(58));
  b.text([M, 212, 1100, 236], 'A voxel MMORPG that remembers what made the genre great.', body(17, 'tint', true));

  // Core palette chips with voxel corners (--step 6)
  const chipY = 340, chipW = 118, chipH = 80, gap = 13;
  b.text([M, chipY - 24, 700, chipY - 10], 'Firelit night  ·  core tokens', eyebrow('mist'));
  CORE.forEach(([name, hex, use], k) => {
    const x = M + k * (chipW + gap);
    const chip = b.rect([x, chipY, x + chipW, chipY + chipH], name, 6);
    if (name === 'ink' || name === 'night' || name === 'stone') b.run('object.stroke', { swatch: 'line', weight: 1, ids: [b.ref(chip, 'id')] });
    b.text([x, chipY + chipH + 8, x + chipW, chipY + chipH + 24], name, body(12, 'parch', true));
    b.text([x, chipY + chipH + 25, x + chipW, chipY + chipH + 39], `${hex}  ${use}`, body(9, 'mist'));
  });

  // Aspect gems: 135deg --a -> --deep, voxel step 4
  const gemY = 510, gem = 44;
  b.text([M, gemY - 24, 600, gemY - 10], 'The six Aspects', eyebrow('mist'));
  ASPECTS.forEach(([name, a, deep], k) => {
    const x = M + k * 100;
    b.gradientRect([x, gemY, x + gem, gemY + gem], [{ location: 0, color: a }, { location: 100, color: deep }], 135, 4);
    b.text([x + gem + 8, gemY + 6, x + 98, gemY + 22], name, body(12, 'parch', true));
    b.text([x + gem + 8, gemY + 23, x + 98, gemY + 37], a, body(9, 'mist'));
  });

  // Type specimen
  const tx = 720;
  b.text([tx, gemY - 24, 1230, gemY - 10], 'Type  ·  Suez One display  ·  Merriweather Sans body', eyebrow('mist'));
  b.text([tx, gemY - 2, 1230, gemY + 40], 'Fresh from the forge', display(36));
  b.text([tx, gemY + 46, 1200, gemY + 84], 'Returning to the classic roots of the MMORPG genre: a demanding yet rewarding multiplayer adventure awaits you in Adrullan.', body(12, 'tint'));

  // Buttons: .btn-gold / .btn-crimson / .btn-ghost (step 4) and the Closed Alpha badge (step 3)
  const by = 626, bh = 44;
  b.gradientRect([M, by, M + 220, by + bh], [{ location: 0, color: '#ffcf00' }, { location: 100, color: '#d99a1e' }], -90, 4);
  b.text([M, by, M + 220, by + bh], 'Join the Closed Alpha →', body(14, 'onGold', true), { align: 'center', vcenter: true });
  b.gradientRect([M + 236, by, M + 396, by + bh], [{ location: 0, color: '#cf3d34' }, { location: 100, color: '#b3302a' }], -90, 4);
  b.text([M + 236, by, M + 396, by + bh], 'Abandon quest', body(14, 'onCrimson', true), { align: 'center', vcenter: true });
  const ghost = b.rect([M + 412, by, M + 572, by + bh], 'stone', 4);
  b.run('object.stroke', { swatch: 'line', weight: 1, ids: [b.ref(ghost, 'id')] });
  b.text([M + 412, by, M + 572, by + bh], 'Read the lore', body(14, 'parch', true), { align: 'center', vcenter: true });
  b.rect([M + 594, by + 10, M + 706, by + 34], 'moss', 3);
  b.text([M + 594, by + 10, M + 706, by + 34], 'Closed Alpha', { ...eyebrow('ink'), size: 9, tracking: 120 }, { align: 'center', vcenter: true });
  b.text([tx, gemY + 96, 1220, gemY + 112], 'Stepped “voxel” corners are the house motif: notches, hairlines and bevels, never rounded radii.', body(11, 'mist'));

  await mcp.json('batch', { commands: b.cmds });
  const png = path.join(OUT, 'adrullan-brand-sheet.png');
  const out = await mcp.json('export_png', { path: png, scale: 1.5 });
  await mcp.call('save_document', { path: path.join(OUT, 'adrullan-brand-sheet.designcraft') });
  console.log(JSON.stringify(out));
  mcp.close();
})().catch(e => { console.error(e.message || e); process.exit(1); });

// Collects DesignCraft commands for one `batch` call; refs ("$N.key") point at earlier steps of the same batch.
class Batch {
  constructor() { this.cmds = []; }

  run(command, params = {}) { this.cmds.push({ command, params }); return this.cmds.length - 1; }

  ref(i, key) { return `$${i}.${key}`; }

  rect(r, fill, step = 0) {
    const i = this.run('frame.create', { rect: r, content: 'unassigned' });
    const ids = [this.ref(i, 'id')];
    this.run('object.fill', { swatch: fill, ids });
    this.run('object.stroke', { weight: 0, ids });
    if (step) this.run('object.cornerOptions', { shape: 'inset', size: step, ids });
    return i;
  }

  gradientRect(r, stops, angle, step = 0, kind = 'linear') {
    const i = this.rect(r, 'ink', step);
    this.run('object.gradient', { kind, angle, stops, ids: [this.ref(i, 'id')] });
    return i;
  }

  text(r, str, chars, para = {}) {
    const i = this.run('frame.create', { rect: r, content: 'text', text: str });
    const ids = [this.ref(i, 'id')];
    this.run('object.stroke', { weight: 0, ids });
    this.run('object.textFrameOptions', { inset: 0, ids, ...(para.vcenter ? { verticalJustification: 'center' } : {}) });
    this.run('text.select', { story: this.ref(i, 'story'), anchor: 0, focus: Buffer.byteLength(str, 'utf8') });
    this.run('type.char', { attrs: chars });
    this.run('type.para', { attrs: { hyphenate: false } });
    if (para.align) this.run('type.align', { align: para.align });
    this.run('text.exitToFrame');
    return i;
  }
}

function results(r) { return r.results || r; }
function display(size, fill = 'parch') { return { fontFamily: DISPLAY, size, fill, leading: { kind: 'points', value: size * 1.1 } }; }
function body(size, fill = 'parch', bold = false) { return { fontFamily: BODY, fontStyle: bold ? 'Bold' : 'Regular', size, fill }; }
function eyebrow(fill = 'gold') { return { fontFamily: BODY, fontStyle: 'Bold', size: 10, fill, tracking: 220, capitalization: 'allCaps' }; }
