<#
  Run tests with coverage if npm is available. If not, run the node check helper.
  Usage: Open PowerShell and run:
    .\scripts\run-tests.ps1
#>

Write-Host "Checking for npm..."

$npm = Get-Command npm -ErrorAction SilentlyContinue
$nodeCmd = Join-Path ${env:ProgramFiles} 'nodejs\npm.cmd'

if ($npm) {
    $npmExec = "npm"
} elseif (Test-Path $nodeCmd) {
    Write-Host "npm found at $nodeCmd (not on PATH). Using that executable..."
    $npmExec = $nodeCmd
} else {
    Write-Host "npm not found. Running check script to help install Node/npm."
    & "$PSScriptRoot\check-node.ps1"
    Exit 1
}

# Ensure dev dependencies are installed (look for jest)
$jestCmdPath = Join-Path $PSScriptRoot '..\node_modules\.bin\jest.cmd'
if (!(Test-Path $jestCmdPath)) {
    $resp = Read-Host "Project dependencies appear missing. Run '$npmExec install' now? (Y/N)"
    if ($resp -match '^[Yy]') {
        & $npmExec install
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Dependency installation failed. This can happen if Node was just installed and your terminal session does not have updated PATH entries."
            Write-Host "Please close and reopen your terminal (or sign out / sign in), then re-run .\scripts\run-tests.ps1. If the problem persists, run .\scripts\check-node.ps1 and follow the instructions."
            Exit $LASTEXITCODE
        }
    } else {
        Write-Host "Skipping installation. Cannot run tests without dependencies."
        Exit 2
    }
}

Write-Host "Running tests with coverage..."
& $npmExec run test:coverage
Exit $LASTEXITCODE
