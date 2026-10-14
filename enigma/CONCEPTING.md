# Enigma Factory concepting setup

This is Enigma Factory's personal fork of [storytold/artcraft](https://github.com/storytold/artcraft), used to
concept art, layouts, and motion for Enigma Factory projects with Claude. Upstream is the `upstream` remote. Keep
Enigma-specific files in `enigma/`, `concepts/`, and `.mcp.json` so upstream merges stay clean.

## MCP servers (`.mcp.json`)

| Server        | What it's for                                            | Needs                                 |
|---------------|----------------------------------------------------------|---------------------------------------|
| `photocraft`  | Raster painting and photo editing for concept paintovers | PhotoCraft installed                  |
| `designcraft` | Page layout: pitch sheets, style guides, UI mockups      | DesignCraft installed                 |
| `vectorcraft` | Vector art: logos, icons, UI shapes                      | VectorCraft installed                 |
| `filmcraft`   | Video editing: animatics and trailers                    | FilmCraft installed                   |
| `lightcraft`  | Non-destructive photo grading of renders and references  | LightCraft installed                  |
| `effectcraft` | Motion graphics and compositing                          | EffectCraft installed                 |
| `coplay-mcp`  | Push concepts into Unity (materials, prefabs, scenes)    | `uv`, Unity with Coplay               |
| `UnityMCP`    | MCP for Unity bridge used by the Enigma game projects    | Unity running the MCP bridge on :8080 |
| `MCP_DOCKER`  | Docker MCP gateway (profile `dokcer_mcp`)                | Docker Desktop                        |

Run `enigma/install-craft-apps.ps1` once per machine to install the Craft apps. Servers whose tools aren't present
simply fail to connect; nothing else breaks.

### Per-environment overrides

Every machine-specific value is an env var with a Windows default, so the same `.mcp.json` works on other machines
and in cloud sessions:

- `CONCEPTS_DIR`: read/write root for file-based tools (default `N:/Enigma Factory/ArtCraft/concepts`)
- `PHOTOCRAFT_CLI`, `DESIGNCRAFT_CLI`, `VECTORCRAFT_CLI`, `FILMCRAFT_CLI`, `LIGHTCRAFT_CLI`, `EFFECTCRAFT_CLI`:
  CLI paths (for example `/usr/bin/photocraft-cli` on Linux)
- `UNITY_MCP_URL`, `DOCKER_MCP_PROFILE`

### Driving the desktop apps live

The servers above run headless. To watch Claude work in a desktop window, start the app with a control port and
add a connected server locally (not checked in), for example:

```sh
claude mcp add -s local designcraft-app -- "C:/Program Files/DesignCraft/designcraft-cli.exe" mcp --connect 7979
```

## Working conventions

- Put concept output in `concepts/<project-name>/` (gitignored), named after the Enigma Factory project folder,
  such as `concepts/Hollowlight Carnival/`.
- Hand finished assets to a game project through `coplay-mcp`/`UnityMCP`, or copy them into that project's folder.
- ArtCraft itself (AI image/video/3D generation) runs as the desktop app: `script/artcraft/windows_frontend_dev.ps1`
  plus `windows_rust_dev.ps1`, or the release build from getartcraft.com. It doesn't expose an MCP server yet.
