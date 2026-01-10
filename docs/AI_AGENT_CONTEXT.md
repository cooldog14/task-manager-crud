# AI AGENT CONTEXT & INSTRUCTIONS
## READ THIS CAREFULLY

**Role:** You are an assisting AI Agent helping a developer contribute to this specific "Task Manager" project.
**Context:** This is a student group project requiring strict adherence to TDD (Test Driven Development), BDD (Behavior Driven Development), and High Test Coverage (>70%).

---

### 1. PROJECT ARCHITECTURE & STACK
*   **Type:** Vanilla JavaScript Web Application (No React/Vue/Angular).
*   **Data Source:** Browser `localStorage` (Wrapped in `js/storage.js`).
*   **Testing Stack:** Jest (Unit/Integration), Selenium WebDriver (UI), Jest-Cucumber (BDD).
*   **Key Modules:**
    *   `js/app.js`: Entry point. Initializes managers.
    *   `js/taskManager.js`: Core business logic (CRUD). **Current bottleneck: Needs better test coverage.**
    *   `js/storage.js`: Handles JSON parsing/saving to localStorage.
    *   `js/validators.js` (New): Contains validation logic. **Note:** Currently isolated, needs integration.
    *   `js/advancedFilters.js` (New): Complex filtering logic. **Note:** Currently isolated.

### 2. THE CURRENT STATE (CRITICAL)
The project is in a "Phase 2/3" transition.
*   **DONE:** Basic CRUD works. Manual test plans are written.
*   **THE PROBLEM:** We have created new "Feature Modules" (`validators.js`, `advancedFilters.js`) to satisfy TDD requirements, but they are **not yet fully connected** to the UI or the main `taskManager`.
*   **THE GOAL:** We need to finish the UI, connect the plumbing (Logic), and prove it works with tests (Coverage & BDD).

---

### 3. YOUR SPECIFIC MISSION
Identify which member your user is (A, B, or C) and follow these precise technical instructions.

#### 👤 IF USER IS MEMBER A (Frontend/UI)
*   **Goal:** Update `index.html` to expose the new features.
*   **Context:** The backend logic for "Advanced Filters" exists, but the user has no way to click them.
*   **Action:**
    1.  Analyze `index.html`.
    2.  Insert a new `<section>` for filters containing:
        *   Input text (Search).
        *   Select dropdown (Priority: Low/Medium/High).
        *   Select dropdown (Date: Today/Overdue).
    3.  Ensure IDs match what the logic expects (e.g., `id="filter-priority"`).

#### 👤 IF USER IS MEMBER B (Unit Tests & Coverage)
*   **Goal:** Raise Code Coverage from ~27% to >70%.
*   **Context:** `js/taskManager.js` and `js/storage.js` are the core files but are poorly tested.
*   **Action:**
    1.  Create `tests/taskManagerFull.test.js`.
    2.  **Crucial:** You MUST mock `localStorage` because Jest runs in Node.js, not a browser. Use this pattern:
        ```javascript
        const localStorageMock = (function() { ... })();
        Object.defineProperty(window, 'localStorage', { value: localStorageMock });
        ```
    3.  Write tests for:
        *   `addTask()`: Verify it calls storage.save.
        *   `deleteTask()`: Verify item count decreases.
        *   `updateTask()`: Verify status changes.
        *   Edge cases: Deleting non-existent ID, adding empty title.

#### 👤 IF USER IS MEMBER C (BDD/Gherkin)
*   **Goal:** Make the `.feature` files executable.
*   **Context:** We have text files in `features/*.feature`. We have `jest-cucumber` installed. We lack the "Step Definitions" (the glue code).
*   **Action:**
    1.  Look at `features/task_validation.feature`.
    2.  Create `tests/steps/validation.steps.js`.
    3.  Use `defineFeature` from `jest-cucumber`.
    4.  Map the sentences to code.
        *   *Given I have valid task data* -> Create a JSON object.
        *   *When I validate* -> Call `validators.validateTask(obj)`.
        *   *Then it should pass* -> `expect(result.isValid).toBe(true)`.

---

### 4. COMMON PITFALLS TO AVOID
*   **Do not use `import/export` (ES6 Modules) inside the main `.js` files** unless you see a `package.json` with `"type": "module"` or a Webpack setup. This project uses script tags.
*   **For Tests (Jest):** You *do* need `module.exports` in the JS files to test them, but this breaks the browser.
    *   *Solution:* Use this pattern at the bottom of JS files:
        ```javascript
        if (typeof module !== 'undefined' && module.exports) {
            module.exports = TaskManager;
        }
        ```
*   **Do not over-engineer.** Stick to Vanilla JS. No React, No jQuery.
