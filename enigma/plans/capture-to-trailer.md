# Capture → compile → trailer pipeline

Status: plan, 2026-10-14. Covers the Unity client (`E:\EverCraft Online\EverCraftOnlineClient`), this repo's
`enigma/flows/`, and the Craft apps over MCP. The goal is an **optional** system that turns Character Studio
captures into finished, on-brand video, working toward trailers that Claude can assemble from a recipe.

## Where things stand

**Character Studio** (client, `Assets/__Project/Scripts/CharacterStudio/`, namespace `EverCraft.Capture`; editor
windows under `Assets/__Project/Editor/CharacterStudio/`) already does a lot:

| Capability         | State                                                                                                       |
|--------------------|-------------------------------------------------------------------------------------------------------------|
| Isolated stage     | `StudioStage` at y=5000, own layer, alpha-safe URP renderer, manual camera render                           |
| Posing             | Animator state or clip at a normalized time, parameter overrides, bone offsets                              |
| Framing            | Bone-aware presets plus alpha-probe refinement (`StudioFraming`)                                            |
| Lighting           | Light-rig specs and six presets (`StudioLightRigPresets`)                                                   |
| Stills             | Supersampled PNG, opaque / direct / matte alpha, trim, per-folder `manifest.json`                           |
| Batches            | Looks × races × bodies × shots; generic creatures with angle, pose and contact sheets                       |
| Video takes        | In-world camera moves (orbit, dolly, crane, …, timelapse), 1080p30 PNG frames, ffmpeg to H.264 + ProRes 422 |
| Offline encode     | `Tools/Compile-Capture.ps1`                                                                                 |
| Headless scripting | Pattern exists: `Tools/Agents/export-creature-glb.ps1` → `unity command run_script`                         |

**Gaps** that block a pipeline:

1. No job-file entry point. Studio runs only from editor windows or GM menus.
2. Stage captures are stills only. There are no turntables, animated plates, or `{frame}` token.
3. Video moves are hardcoded enums at fixed 1920×1080 / 30 fps. Takes are real-time-coupled to the in-world camera
   clone, and there is no data-driven camera path.
4. Outputs are split: editor stills go to `<repo>/Captures/Studio`, while video and target packs go to
   `persistentDataPath`, even in the editor.
5. Metadata is thin. The still manifests lack camera, lighting and framing; video JSON lacks subject, zone, time of
   day, weather and path.
6. The synchronous `ReadPixels` + `EncodeToPNG` per frame stalls the main thread.
7. Nothing downstream of ffmpeg: no edit, titles, music or alpha-capable codec.

Installed but unused: `com.unity.recorder` 5.1.2, `com.unity.timeline` 1.8.9, `com.unity.splines` 2.8.2,
`CameraPathCreator`, `PathCreator`.

## Architecture

```
 ┌────────────── Unity client (capture) ──────────────┐     ┌──────── ArtCraft repo (compile) ────────┐
 job.json ──► StudioJobRunner ──► stills / turntables /  ──► Captures/Takes/<takeId>/   ──► enigma/flows
 (Claude      (RunJobFile via      plates / camera shots       frames/ + take.json            compile-take  → mp4 / mov
  writes it)   run_script)                                     + takes.json index             build-edit    → FilmCraft project
                                                                                              titles        → DesignCraft / EffectCraft PNG/MOV
                                                                                              trailer.json  → render + OTIO export
```

One contract joins the halves: **`take.json`**, one per take folder, plus a project-level **`takes.json`** index
that Claude searches by tag when cutting an edit.

### `take.json` (schema v1)

```json
{
  "schema": "aoa.take/1",
  "id": "2026-10-14_wolf-grey_turntable_a",
  "kind": "still | turntable | plate | shot | timelapse",
  "subject": { "type": "generic | npc | player", "name": "Wolf Grey", "race": 107, "look": "default", "class": null },
  "pose": { "clip": "Run", "loop": true },
  "camera": { "preset": "ThreeQuarter", "fov": 30, "path": "shots/wolf-orbit.json" },
  "lighting": { "rig": "Heroic Low" },
  "world": { "zone": "greenwood", "timeOfDay": 19.5, "weather": "clear", "stage": false },
  "video": { "fps": 30, "frames": 180, "width": 1920, "height": 1080, "alpha": "straight" },
  "files": { "frames": "frames/frame_%05d.png", "preview": "preview.mp4", "master": "master.mov" },
  "tags": ["creature", "wolf", "earth", "action", "hero-shot"],
  "created": "2026-10-14T21:30:00Z",
  "client": { "commit": "fc045485e", "build": "editor" }
}
```

It extends the existing `CaptureManifestEntry` (`StudioSpecs.cs`) and `StudioVideoWriter.Meta`; existing
`manifest.json` files can be migrated by a script.

## Phases

### Phase 1 — Scriptable capture (client)

Make every Studio capture runnable from a file, deterministic, and landed in one place.

1. **`StudioJob` + `StudioJobRunner`** (runtime; GM_BUILD or editor). A job is a list of entries: `still`,
   `turntable`, `plate`, `shot`. Each reuses the existing `SubjectSpec` / `PoseSpec` / `FramingSpec` /
   `LightRigSpec` / `OutputSpec`. The runner queues above `CharacterStudio.RunJob`, since only one job can capture
   at a time.
2. **Headless entry:** `StudioJobRunner.RunJobFile(path)` exposed to `unity command run_script`, the same way
   `StudioGlbExport` is. Add `Tools/Agents/run-studio-job.ps1` alongside `export-creature-glb.ps1`.
3. **Turntables:** N frames stepping `FramingSpec.subjectYaw` through 360°, with optional `clipTime` stepping so
   the subject walks or idles while turning. Add a `{frame}` token to `BuildFileName`.
4. **Animated plates:** step `PoseSpec.clipTime` per frame under `Time.captureDeltaTime`, keeping supersampling and
   matte alpha. This gives transparent character loops for compositing.
5. **One output root:** in the editor, `<repo>/Captures/Takes/<takeId>/` for every kind, video included; in
   players, `persistentDataPath/Captures/Takes/`. Keep `Captures/Studio` for legacy stills.
6. **`take.json` v1** writer, plus `takes.json` index append.

Done when Claude can write a `job.json` (for example "turntables of all 17 spot-check creatures, Heroic Low,
transparent, 120 frames"), run it headless, and get take folders with `take.json` files.

### Phase 2 — Data-driven shots (client)

Make in-world camera work authored as data instead of enums.

1. **`ShotSpec`:** a camera path as keyframes (position, rotation or look-at target, FOV, time) or a reference to a
   Unity Splines container in the scene, plus easing. It is evaluated **per captured frame** from the frame index,
   never from real time, so every render of a shot is identical.
2. Make resolution and fps parameters (now constants in `StudioVideoWriter`), and expose the hardcoded orbit and
   dolly amounts. The existing moves become built-in `ShotSpec` presets.
3. Record world state into the take: zone, time of day, weather. Use the `EnvironmentManager.BeginCaptureTimeOverride`
   / `BeginCaptureWeather` hooks to set them from the job.
4. **Async readback:** `AsyncGPUReadback` into a ring buffer, with PNG encode on worker threads. This removes the
   per-frame stall and makes 4K takes practical.
5. **Shot authoring helper** (editor): a gizmo window that records keyframes from the scene view camera into a
   `shots/*.json` file. This is optional; Claude can also write paths numerically.

Done when a job can say "at Leont City Gates, 19:30, clear, fly this path at 4K30" and produce a reproducible take.

### Phase 3 — Compile (this repo, `enigma/flows/`)

Node scripts over `mcp-client.js`, driving ffmpeg and the Craft apps. They run anywhere the Craft CLIs are installed.

1. **`compile-take.js <takeDir>`:** H.264 preview (CRF 18), plus a master in ProRes 4444
   (`-profile:v 4 -pix_fmt yuva444p10le`) when the take has alpha, otherwise ProRes 422 HQ. It replaces the
   PowerShell compile script for the take format, and updates `take.json` `files`.
2. **`brand-kit/`:** title cards, lower thirds, chapter cards and end cards as DesignCraft templates built from the
   style guide, the same way `adrullan-brand-sheet.js` builds the sheet. They export transparent PNGs. Animated
   versions go through EffectCraft (`comp.new`, `layer.newText`, keyframes, `renderQueue.render`) and come out as
   ProRes 4444 overlays.
3. **`build-edit.js <edit.json>`:** imports takes and overlays into FilmCraft (`media_import`, `timeline.place`,
   `sequence.applyVideoTransition`, `markers.add`), lays out an edit, renders through `export.queue`, and also
   writes `file.exportOtio` so the cut can open in Resolve or Premiere.
4. **Contact and review sheets:** a DesignCraft page of take thumbnails plus metadata, for picking shots and for
   Claude to look at when choosing.

Done when `edit.json` (a list of takes with in/out points, overlays and a music bed) renders to a branded MP4 with
no manual steps.

### Phase 4 — Trailer recipes

Claude writes the `edit.json`; you direct.

1. **`trailer.json` recipes:** named beats with durations and rules, for example:
   - Cold open: 6s, `tags:[landscape, golden-hour]`, slow push.
   - Logo sting: 3s, EffectCraft.
   - Aspect chapters: 4 × 5s, one Aspect each, its chapter card.
   - Class montage: 8 × 1s, `kind:turntable`, cut on beats.
   - End card: 5s, Closed Alpha CTA.
2. **Beat sync:** music markers (FilmCraft markers or a `beats.json` from the soundtrack) drive cut points.
3. **Gaps become jobs.** When a recipe needs a shot that `takes.json` doesn't have, Claude writes the Phase 1/2 job
   to capture it, runs it, and re-cuts.
4. **Review loop:** a 540p proxy plus a contact sheet each pass; you comment; Claude edits the recipe or the shots.
5. **Variants from one recipe:** 16:9 trailer, 9:16 social cut (FilmCraft auto-reframe or 9:16 shot variants),
   21:9 site hero loop for aoa-web (`art/scenes` format), and stills for store pages.

## Decisions to make

| Question                      | Options                                               | Lean                                                              |
|-------------------------------|-------------------------------------------------------|-------------------------------------------------------------------|
| Editor-only or GM builds too? | Editor only / editor + GM                             | Editor + GM, as video is today                                    |
| Hero shots: data or Timeline? | `ShotSpec` only / also Timeline + Recorder            | `ShotSpec` first; Timeline later for authored cinematics          |
| Where compile runs            | Unity side / this repo                                | This repo: keeps the client lean and reuses the Craft MCP servers |
| Take storage                  | Repo `Captures/` (gitignored) / a shared drive        | Repo `Captures/Takes`, with an env override                       |
| Fonts in renders              | Stand-ins / bundle Suez One + Merriweather Sans (OFL) | Bundle them in `enigma/brand-kit/fonts`                           |

## First milestone

Phase 1 steps 1–3 and 6: a job file that captures **transparent turntables for the 17 spot-check creatures**, then
`compile-take.js` and a DesignCraft contact sheet. It's small, exercises the whole capture → compile path, and the
output is directly useful (site roster, Discord, store page).
