// Pads Markdown tables so columns align in plain text (repo rule, AGENTS.md).
//   node enigma/flows/pad-md-tables.js <file.md> [...]
const fs = require('fs');

for (const file of process.argv.slice(2)) {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  const out = [];
  for (let i = 0; i < lines.length;) {
    if (!isRow(lines[i])) { out.push(lines[i++]); continue; }
    const block = [];
    while (i < lines.length && isRow(lines[i])) block.push(lines[i++]);
    out.push(...pad(block));
  }
  fs.writeFileSync(file, out.join('\n'));
}

function pad(block) {
  const rows = block.map(cells);
  const widths = [];
  rows.forEach((r, k) => r.forEach((c, j) => { if (k !== 1) widths[j] = Math.max(widths[j] || 3, len(c)); }));
  return rows.map((r, k) => k === 1
    ? '|' + widths.map(w => '-'.repeat(w + 2)).join('|') + '|'
    : '| ' + widths.map((w, j) => (r[j] || '') + ' '.repeat(w - len(r[j] || ''))).join(' | ') + ' |');
}

function cells(line) { return line.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim()); }
function isRow(line) { return /^\s*\|.*\|\s*$/.test(line); }
function len(s) { return [...s].length; }
