# Installs the Craft desktop apps whose CLIs back the MCP servers in .mcp.json.
# Downloads the latest x64 MSI for each app from the official storytold GitHub releases
# (requires the gh CLI, logged in) and installs it to the default Program Files folder.
#
#   .\enigma\install-craft-apps.ps1                     # all apps
#   .\enigma\install-craft-apps.ps1 photocraft,vectorcraft

param(
    [string[]]$Apps = @('photocraft', 'designcraft', 'vectorcraft', 'filmcraft', 'lightcraft', 'effectcraft')
)

$ErrorActionPreference = 'Stop'
$download = Join-Path $env:TEMP 'enigma-craft-msi'
New-Item -ItemType Directory -Force $download | Out-Null

foreach ($app in $Apps) {
    Write-Host "== $app"
    $dest = Join-Path $download $app
    if (Test-Path $dest) { Remove-Item -Recurse -Force $dest }
    New-Item -ItemType Directory -Force $dest | Out-Null

    gh release download -R "storytold/$app" --pattern '*-windows-x64.msi' --dir $dest
    if ($LASTEXITCODE -ne 0) { Write-Warning "No x64 MSI found for $app"; continue }

    $msi = Get-ChildItem $dest -Filter '*.msi' | Select-Object -First 1
    Write-Host "Installing $($msi.Name)"
    $p = Start-Process msiexec.exe -ArgumentList '/i', "`"$($msi.FullName)`"", '/passive', '/norestart' -Wait -PassThru
    if ($p.ExitCode -ne 0) { Write-Warning "$app installer exited with $($p.ExitCode)" }
}

Write-Host "`nInstalled CLIs:"
Get-ChildItem 'C:\Program Files\*Craft\*-cli.exe' -ErrorAction SilentlyContinue | ForEach-Object { "  $($_.FullName)" }
Write-Host "Restart Claude (or run /mcp) to connect the servers."
