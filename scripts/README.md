# Scripts

This folder contains helper PowerShell scripts to assist with environment setup and running tests on Windows.

- `check-node.ps1`: Detects whether `npm` is available and offers to install Node.js LTS using `winget` or `choco` if present. Run this script as Administrator if you want it to perform the installation.
- `run-tests.ps1`: Runs `npm run test:coverage` if `npm` is available; otherwise, it calls `check-node.ps1` to help you install Node.

Usage examples (PowerShell):

```powershell
# Check and install Node.js (interactive)
.\scripts\check-node.ps1

# Run tests with coverage (will prompt to install Node if npm missing)
.\scripts\run-tests.ps1
```
