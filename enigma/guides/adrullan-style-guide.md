# Adrullan Online Adventures — style guide

The visual and verbal identity of Adrullan Online Adventures (formerly EverCraft Online), drawn from the live site
in `E:\EverCraft Online\aoa-web`. Use it for concept art, key art, store pages, trailers, social posts and in-game
UI. Where this guide and the site disagree, the site's code wins; update this guide.

Source of truth in aoa-web:

| What                          | File                                                                           |
|-------------------------------|--------------------------------------------------------------------------------|
| Tokens and global components  | `src/styles.css` (`@theme` block)                                              |
| Header, nav, footer           | `src/app/app.css`, `src/app/app.html`                                          |
| Fonts, theme-color, favicon   | `src/index.html`                                                               |
| Every image source            | `src/app/core/media.ts`, `src/content/cdn.generated.json`                      |
| Aspect, role and event colors | `src/content/world.ts`, `src/content/classes.ts`, `src/content/alpha-tests.ts` |

Reference render: `concepts/Adrullan/adrullan-brand-sheet.png`, built by `enigma/flows/adrullan-brand-sheet.js`.

## 1. Brand

- **Name:** Adrullan Online Adventures. Short form: **Adrullan**. Abbreviation for files and tags: `aoa`.
- **What it is:** a voxel MMORPG in the classic tradition, currently in closed alpha.
- **Studio:** h1ddentree Entertainment.
- **Former name:** EverCraft Online. Treat it as history ("Same world, same team, same community."), not as a second
  brand. The Unity client repo and some CDN paths still carry the old name.
- **Positioning lines** (use these verbatim before inventing new ones):
  - "A voxel MMORPG that remembers what made the genre great." (default one-liner)
  - "Returning to the classic roots of the MMORPG genre: a demanding yet rewarding multiplayer adventure awaits you
    in Adrullan." (long form)
  - "A world of adventure, one block at a time." (playful)

## 2. Voice

Warm, plain-spoken fantasy with a light wit. The narrator is a well-travelled innkeeper, not a herald.

- **Short sentences.** Kickers are fragments: "Fresh from the forge", "Every swing counts", "Find your place in the
  party".
- **Concrete over epic.** "From riverbed clay to finished blade" beats "Forge your destiny".
- **Speak the community's words.** "Open the gates", "the party", "a test"; the players are adventurers.
- **Wit is allowed, smugness isn't.** "You wandered off the map." (404). Alpha recaps can tease the players gently.
- **Respect the difficulty.** "Demanding yet rewarding" is the promise; never promise ease.
- **Typography in copy:** curly quotes and apostrophes (’ “ ”), the → arrow on link-style calls to action, the
  middle dot · as a separator.

Avoid: "epic", "unleash", "next-gen", exclamation marks in headings, emoji in brand surfaces, all-caps sentences.

## 3. Color

Dark only. The site sets `color-scheme: dark` and has no light theme. The palette in the site's own words:
**firelit night, parchment text, the logo's gold and crimson, and voxel-grass green.**

### 3.1 Core tokens

| Token     | Hex       | RGB         | Role                                                         |
|-----------|-----------|-------------|--------------------------------------------------------------|
| `ink`     | `#0e0c12` | 14 12 18    | Page background; every veil and overlay is ink at some alpha |
| `night`   | `#16131d` | 22 19 29    | Footer, page-head gradient start, lightbox, music dock       |
| `stone`   | `#221d2b` | 34 29 43    | Tiles, raised cards, ghost surfaces                          |
| `parch`   | `#f4ead5` | 244 234 213 | Primary text                                                 |
| `mist`    | `#b8ab93` | 184 171 147 | Muted text, labels, hints                                    |
| `gold`    | `#ffcf00` | 255 207 0   | Primary accent: links, focus, eyebrows, selection, CTA       |
| `ember`   | `#d99a1e` | 217 154 30  | Gold gradient end, bullets, scrollbar, icon rings            |
| `crimson` | `#b3302a` | 179 48 42   | Destructive buttons, errors, the logo's red                  |
| `moss`    | `#74b04f` | 116 176 79  | Live and success states, Closed Alpha badge, Healer role     |

**Proportions.** Ink and night cover roughly 80% of any surface, parch text and art about 15%, and gold at most 5%.
Crimson and moss are signals, not decoration. A gold-heavy frame stops reading as "firelit".

### 3.2 Supporting tints

| Use                        | Value                                                    |
|----------------------------|----------------------------------------------------------|
| Secondary body text        | `#e6dcc6` (most common), `#d9ceb6`, `#efe5cf`, `#d8ccb3` |
| Text on gold               | `#1b1405`                                                |
| Text on crimson            | `#fff7ea`                                                |
| Text on moss               | `#0e1a07`                                                |
| Error text / error surface | `#ff9b8f` / `#ffd2cc`                                    |
| Success text               | `#a9dc8c`                                                |
| Hairline (`--line`)        | `rgb(255 226 170 / 0.12)`                                |
| Gold "lit" surface         | `rgb(255 207 0 / 0.08–0.14)`                             |
| Warm glass surface         | `rgb(255 240 210 / 0.05–0.08)`                           |
| Deepest black (lightbox)   | `#07060a`                                                |

### 3.3 The six Aspects

The world's elemental Aspects. Each has an accent (`--a`) and a deep tone (`--deep`), and they are the only
saturated hues besides the core accents. Use them to color-code lore, zones, gods, and trailer chapters.

| Aspect | Accent    | Deep      | Pixel ramp, dark → light (`cube-textures.ts`)     |
|--------|-----------|-----------|---------------------------------------------------|
| Fire   | `#ff8a4c` | `#e25822` | `#1c1210 #421d12 #7a2f14 #b8501a #e57d22 #ffb44c` |
| Water  | `#5aa2ff` | `#3b7dd8` | `#061a2a #0b2f47 #124a63 #1d6c80 #3591a0 #66b9c0` |
| Earth  | `#cfa261` | `#8a6b3d` | `#1d1710 #372a1a #54402a #705a34 #8f7647 #b39b68` |
| Air    | `#8fd8f2` | `#7ec8e3` | `#2a3742 #485b69 #66809a #8aa3b5 #b0c6d3 #d8e5ec` |
| Light  | `#f6dc6e` | `#f0d264` | `#3a3220 #65552d #96793b #c4a34d #e8c96c #fff0a8` |
| Dark   | `#a993f2` | `#3d3160` | `#08070d #141125 #221d38 #322b50 #463d6b #5f5488` |

The "gem" swatch for an Aspect is a 135° linear gradient from accent to deep, with voxel corners.

### 3.4 Roles

| Role    | Color     |
|---------|-----------|
| Tank    | `#7fb3ff` |
| Healer  | `#74b04f` |
| Damage  | `#ff7b6b` |
| Support | `#d7a4ff` |

### 3.5 Event themes

Each alpha test ("cat-N") gets its own accent and glow, which tints its herald card, countdown and fog. Use the
current test's theme for anything promoting that test.

| Test  | Accent    | Glow                    | Fog |
|-------|-----------|-------------------------|-----|
| cat-8 | `#b98cff` | `rgb(150 90 255 / .45)` | yes |
| cat-7 | `#ff6b5a` | `rgb(255 100 80 / .40)` | no  |
| cat-6 | `#e8c55a` | —                       | no  |
| cat-5 | `#ff9a3c` | —                       | yes |
| cat-4 | `#9fd4ff` | —                       | no  |
| cat-3 | `#8fd16a` | —                       | no  |
| cat-2 | `#f2a3c0` | —                       | no  |

Sub-brands with their own palettes (for example Tibolt's Bounty: green vale `#1a2218 #12100e #2a3824`, text
`#c8e6a8 #d8f0c4`) stay inside their own pages; don't mix them into core brand pieces.

## 4. Typography

| Role    | Family            | Fallback              | Weights                   | Source             |
|---------|-------------------|-----------------------|---------------------------|--------------------|
| Display | Suez One          | Georgia, serif        | 400 only                  | Google Fonts (OFL) |
| Body/UI | Merriweather Sans | system-ui, sans-serif | 400, 700, 800, 400 italic | Google Fonts (OFL) |

**Display (Suez One).** Headings h1–h3, big numbers (countdowns, version), card and class names, track titles.
Line height 1.1, tracking +0.005em, balanced wrapping. Never bold it (it has one weight), never set it in all caps,
never use it below about 18px.

**Body (Merriweather Sans).** Line height 1.65. 400 for reading, 700 for ledes and fields, 800 for buttons, nav and
labels.

**Scale (web):**

| Style           | Size                             | Notes                                  |
|-----------------|----------------------------------|----------------------------------------|
| Page title      | `clamp(2.4rem, 6vw, 4rem)`       | Suez One                               |
| Class name      | `clamp(2.6rem, 6vw, 4.4rem)`     | Suez One                               |
| Section heading | `clamp(2rem, 4.2vw, 3.2rem)`     | Suez One                               |
| Hero lede       | `clamp(1.05rem, 2vw, 1.3rem)`    | Merriweather Sans 700                  |
| Prose h2 / h3   | 1.7rem parch / 1.2rem gold       |                                        |
| Body            | 1–1.1rem                         |                                        |
| Eyebrow         | .75rem, 700, +.22em, caps        | Gold. Sits above every section heading |
| Small label     | .62–.72rem, 800, +.12–.2em, caps |                                        |

Numbers in UI use tabular figures.

**For video and print,** scale from a 1080p frame: display 72–120px for titles, 48–64px for chapter cards; body
28–36px; eyebrows 18–22px with +22% tracking. Keep text inside the 90% title-safe area.

## 5. The voxel corner

**Stepped ("voxel") corners are the house motif.** Corners are cut with a square notch, never rounded. On the web
this is a `clip-path` polygon sized by `--step`; in DesignCraft it's `object.cornerOptions {shape: "inset"}`.

| Element                                  | Step |
|------------------------------------------|------|
| Gems                                     | 2px  |
| Badges, inputs                           | 3px  |
| Buttons, rail and lightbox nav buttons   | 4px  |
| Herald card, music dock, track list      | 5px  |
| Default, roster cards, FAQ items         | 6px  |
| Ability boxes, account tiles, news cards | 8px  |
| Auth card, lightbox                      | 10px |
| Final CTA panel                          | 12px |

Rules: bigger surfaces get bigger steps; the step never exceeds about 5% of the element's short side. Rounded
corners appear only on true circles (track icons, spinners) and the scroll cue.

## 6. Surfaces, lines and light

- **Borders are hairlines drawn inside,** never outside: `inset 0 0 0 1px var(--line)`. Hover or active state
  becomes a 2px gold inset. A 3px left bar in crimson, moss or an Aspect color marks a category.
- **Panels** are a barely-warm glass: `linear-gradient(180deg, rgb(255 240 210 / .05), rgb(255 240 210 / .02))`
  over ink.
- **Buttons** have a bottom bevel: `inset 0 -4px 0 rgb(0 0 0 / .22–.25)`.
  - Gold: `#ffcf00 → #d99a1e`, top to bottom, text `#1b1405`.
  - Crimson: `#cf3d34 → #b3302a`, text `#fff7ea`.
  - Ghost: `rgb(255 240 210 / .08)` with a hairline.
  - Hover lifts 2px and brightens 8%. Press drops 1px.
- **Shadows are deep and soft:** menus `0 18px 40px rgb(0 0 0 / .5)`, floating art
  `drop-shadow(0 24px 36px rgb(0 0 0 / .6))`, text over art `0 2px 12px rgb(0 0 0 / .8)`.
- **Glows** come only from accents: herald and accent buttons `0 0 30–34px` in the event glow; gems `0 0 10px` at
  55% of the Aspect color; reader titles a 40px text glow at 35%.
- **Page heads** carry a gold radial glow: `radial-gradient(ellipse at 50% 0%, rgb(255 207 0 / .1), transparent 60%)`
  over a night → ink gradient.
- **Glass:** `backdrop-filter: blur(4–10px)` over ink at 55–92%.
- **Fog** (event pages only): radial blobs of the event glow, `blur(30px)`, `mix-blend-mode: screen`. It's the only
  blend mode in the system.
- **Starfield:** sparse dots in `#fff`, `#ffe9b0` and `#cfe6ff`.

## 7. Imagery

### 7.1 Scene treatment ("scened")

Every painting or in-game shot used as a backdrop follows the same recipe:

1. Full bleed, `object-fit: cover`.
2. Fade the top and bottom into ink: `linear-gradient(180deg, ink, transparent 22%, transparent 78%, ink)`.
3. A flat ink veil at 45–72% alpha (`--veil`) so parch text reads at AA contrast.
4. Optional side darkening, 0.25 → 0.88 at 55%, when text sits on one side.
5. Optional slow drift: scale 1.04 → 1.14 over 28s, alternating.

### 7.2 Art sources

| Kind              | Where                                                               | Format and naming                         |
|-------------------|---------------------------------------------------------------------|-------------------------------------------|
| In-game scenes    | `aoa-web/art/scenes/`                                               | 21:9, 2560×1072 WebP, `<place>-<subject>` |
| Event key art     | `aoa-web/art/alpha/cat-N/`                                          | banner, key-art, location shots           |
| Built web images  | `aoa-web/public/img/**` (`npm run images`)                          | 640 / 1280 / 1920 WebP                    |
| CDN library       | `adrullanonline` Space, `web-assets/images/` (`cdn-drop/README.md`) | lower-kebab-case, by type                 |
| Raw drops         | `aoa-web/inbox/` → processed into `inbox/_done/`                    | anything                                  |
| Character renders | Unity client Character Studio → `Captures/Studio/`                  | PNG + `manifest.json`                     |
| Creature models   | CDN `models/creatures/*.glb`, client `Captures/Studio/Models/`      | GLB                                       |

Safe-area guide for ultrawide crops: `aoa-web/inbox/_guides/ultrawide-safe-areas-3440x1440.png`.

### 7.3 Composition

- Voxel worlds read best at golden hour or night, with warm practical lights (torches, windows, campfires) against
  cool shadow. That's the "firelit night".
- Characters: three-quarter view, lit warm-key / cool-rim, on transparent or ink backgrounds.
- Pixel art (class icons, ability icons) is shown at whole-number scale with `image-rendering: pixelated`. Never
  smooth-scale it.
- The only ornate frame is the gold screenshot frame (`ui/screenshot-frame-gold.webp`, 16:9, 14px band). Use it for
  screenshots presented as screenshots, not for key art.

### 7.4 Logo

- Primary logo: the gold-and-crimson wordmark (currently a Wix-hosted PNG, 3386×2041; see `media.ts`). Give it at
  least its own cap height of clear space. Place it on ink or on a veiled scene, never on bright, busy art.
- Favicon / small mark: the round 32px pixel logo.
- Header lockup: "Adrullan" set in Suez One.
- `cdn-drop/logo/` is empty. Exporting a clean master (SVG plus transparent PNG at 4K) is an open task.

## 8. Iconography

There is no icon library. Use, in order of preference:

1. **Unicode glyphs:** → ‹ › ⤢ ✕ +
2. **CSS or vector shapes:** carets, squares, bars. A small square (not a circle) is the status dot: moss for live,
   `#b98cff` for alpha.
3. **Pixel PNGs:** the 16 class icons at 16 or 32px (`icons/classes/{16,32}/<slug>.png`).

List bullets are 7px ember squares.

## 9. Motion

| Use                  | Value                                                               |
|----------------------|---------------------------------------------------------------------|
| Default easing       | `cubic-bezier(0.2, 0.7, 0.2, 1)`                                    |
| Cards, lightbox      | `cubic-bezier(0.2, 0.8, 0.2, 1)`                                    |
| Micro (hover, press) | 150–200ms                                                           |
| Scroll reveal        | 24px rise + fade, 700ms                                             |
| Hero entrance        | `rise` 1s, staggered 0 / .15 / .3 / .45s (logo, lede, CTAs, herald) |
| Backdrop crossfade   | 1s fade + 6s scale 1.08 → 1                                         |
| Ambient drift        | 26–61s loops; fog layers out of phase (43s/11s, 61s/17s)            |
| Pixel animation      | `steps(4)` (EQ bars), never eased                                   |

Always honor `prefers-reduced-motion`; on the site it turns off every animation.

**In video,** carry the same feel: slow push-ins (1.04 → 1.14 scale over a shot), soft eased rises for titles,
1s crossfades, nothing snappy or bouncy. Pixel elements move in steps.

## 10. Layout

- Content width `min(1160px, 100% − 2rem)`. Header 1240px wide, 68px tall, transparent until scrolled, then ink at
  92% with a 10px blur.
- Breakpoints: 860px, 760px, 700px.
- Sections open with an eyebrow, then a Suez One heading, then a lede. Alternate left/right for long chapter lists
  (class pages).
- Cards: roster 168×240, 16:9 screenshots, rails that scroll-snap with masked edges.

## 11. Applying it outside the web

### Concept sheets and print (DesignCraft, VectorCraft, PhotoCraft)

- Start every document with the core swatches named exactly as the tokens (`ink`, `gold`, …) so commands and scripts
  can refer to them.
- Ink page, scened hero at the top, eyebrow → display title → lede, then content on an 8-column grid.
- Voxel corners via `object.cornerOptions {shape: "inset", size: step}`.
- Until the brand fonts are loaded, Georgia and Segoe UI stand in. Drop `SuezOne-Regular.ttf` and the Merriweather
  Sans files into a `Document Fonts/` folder beside the `.designcraft` file to use the real faces.

### Video (FilmCraft, EffectCraft, the client's video takes)

- **Title card:** ink background (or veiled scene), gold eyebrow, Suez One title in parch, optional Aspect-colored
  underline.
- **Lower third:** 4px-step voxel panel in ink at 85%, 1px hairline, gold eyebrow (zone or class) over a parch name.
- **Chapter cards:** one Aspect per chapter; its gem and accent tint the card.
- **End card:** logo, "Closed Alpha" moss badge, gold CTA button, URL in mist.
- **Grade:** warm highlights, cool shadows, slightly lifted blacks to `#0e0c12`; never crush to pure black.
- **Safe areas:** 90% title-safe at 16:9; check 21:9 crops against the ultrawide guide.
- **Music:** the official soundtrack on the CDN (`music/*.mp3`: main-theme, whispers-of-grixius, halfling-city,
  dwarf-city…).

### In-game UI

The site and the client share a palette but the client has its own UI kit. When concepting client UI, use these
tokens and voxel steps so the two stay one family.

## 12. Checklist

- [ ] Background is ink or a veiled scene; no light themes.
- [ ] One gold accent per view; crimson and moss used only as signals.
- [ ] Display text in Suez One (or Georgia stand-in), never bold, never caps.
- [ ] Eyebrow above the heading, gold, tracked +22%, caps.
- [ ] Corners are voxel-stepped; borders are inset hairlines.
- [ ] Copy is short, warm and concrete; curly quotes; → on CTAs.
- [ ] Pixel art at whole-number scale.
- [ ] Motion is slow and eased; reduced motion respected.
