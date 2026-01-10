# Task Manager

A simple JavaScript web application for managing tasks.

## Features
- Create, read, update, and delete tasks.
- Filter tasks by various criteria.
- Tasks are saved in your browser's local storage.

## Setup

1.  **Clone the repository:**
    `git clone <repository-url>`
2.  **Navigate to the project:**
    `cd task-manager`
3.  **Install dependencies:**
    `npm install`

## Usage

### Run the application
Open `index.html` in your web browser, or start a local server:
`npx serve .`

### Run tests
`npm test`

## Windows: Node.js / npm helper

If `npm` is not available on your system (common on some Windows setups), use the included PowerShell helpers to detect and optionally install Node.js LTS:

1. Open PowerShell as Administrator.
2. Run: `.\	ools\check-node.ps1` or `.\scripts\check-node.ps1` (depending on your current folder).
3. Or run `.\scripts\run-tests.ps1` to attempt running tests and get guided installation if `npm` is missing.

Note: The scripts will attempt to use `winget` or `choco` if available; otherwise, they will direct you to https://nodejs.org/en/download/ to install Node.js manually.