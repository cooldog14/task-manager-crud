<#
  Check and optionally install Node.js (and npm) on Windows
  Usage: Open PowerShell as Administrator and run:
    .\scripts\check-node.ps1
#>

Write-Host "Checking for npm..."

$npm = Get-Command npm -ErrorAction SilentlyContinue
if ($npm) {
    $version = npm -v
    Write-Host "npm is available (version $version)."
    Exit 0
}

Write-Host "npm not found on PATH."

# Try winget
$winget = Get-Command winget -ErrorAction SilentlyContinue
if ($winget) {
    Write-Host "winget detected. You can install Node.js LTS via winget."
    $resp = Read-Host "Install Node.js LTS using winget now? (Y/N)"
    if ($resp -match '^[Yy]') {
        winget install --id OpenJS.NodeJS.LTS -e
        Write-Host "If installation succeeded, please restart your terminal."
        Exit 0
    } else {
        Write-Host "Installation skipped by user."
        Exit 1
    }
}

# Try Chocolatey
$choco = Get-Command choco -ErrorAction SilentlyContinue
if ($choco) {
    Write-Host "Chocolatey detected. You can install Node.js LTS via choco."
    $resp = Read-Host "Install Node.js LTS using choco now? (Y/N)"
    if ($resp -match '^[Yy]') {
        choco install nodejs-lts -y
        Write-Host "If installation succeeded, please restart your terminal."
        Exit 0
    } else {
        Write-Host "Installation skipped by user."
        Exit 1
    }
}

Write-Host "No automatic installer found. Please download and install Node.js from https://nodejs.org/en/download/"
Write-Host "After installation, re-open PowerShell and run: npm -v to verify."
Exit 2
