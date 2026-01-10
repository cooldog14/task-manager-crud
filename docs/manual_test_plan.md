# Manual Test Plan for Task Manager Application

## 1. Introduction

### 1.1 Purpose
This test plan outlines the manual testing strategy for the Task Manager web application, a CRUD-based system for managing tasks and categories. The plan ensures comprehensive coverage of all functional and non-functional requirements.

### 1.2 Scope
The testing scope includes:
- **In Scope:**
  - Task CRUD operations (Create, Read, Update, Delete)
  - Category CRUD operations
  - Filtering and searching functionality
  - Sorting capabilities
  - Form validation and error handling
  - UI responsiveness and user interactions
  - Data persistence using localStorage
  - Modal dialogs and confirmations

- **Out of Scope:**
  - Browser compatibility testing (assuming modern browsers)
  - Performance testing under load
  - Security testing
  - Accessibility testing (WCAG compliance)
  - Cross-device testing beyond responsive design

### 1.3 Test Objectives
- Verify all CRUD operations work correctly
- Ensure data integrity and persistence
- Validate user interface functionality
- Confirm proper error handling and validation
- Test filtering, searching, and sorting features

### 1.4 Test Environment
- Browser: Chrome (latest version)
- Operating System: Linux/Windows/macOS
- No backend server required (frontend-only application)

## 2. Test Strategy

### 2.1 Test Levels
- **Unit Testing:** Individual functions and methods (to be automated later)
- **Integration Testing:** Component interactions
- **System Testing:** End-to-end user workflows
- **User Acceptance Testing:** Business requirement validation

### 2.2 Test Types
- Functional Testing
- UI/UX Testing
- Validation Testing
- Error Handling Testing

### 2.3 Test Data
- Valid task data with all fields
- Invalid data for negative testing
- Edge cases (empty fields, long text, special characters)
- Boundary values for dates and text lengths

## 3. Test Cases

### 3.1 Task Management Test Cases

#### TC-TASK-001: Create New Task - Positive
**Priority:** High  
**Description:** Verify that a user can successfully create a new task with all required fields.  
**Preconditions:** Application is loaded, at least one category exists.  
**Steps:**
1. Click the "+ Add Task" button
2. Fill in all required fields:
   - Title: "Complete project report"
   - Description: "Write and submit the quarterly project report"
   - Category: Select existing category
   - Priority: Medium
   - Status: Pending
   - Due Date: Tomorrow's date
3. Click "Save Task" button
**Expected Result:** Task is created and appears in the task list with correct details. Success toast message appears. Modal closes.

#### TC-TASK-002: Create New Task - Validation
**Priority:** High  
**Description:** Verify validation when required fields are missing.  
**Preconditions:** Application is loaded.  
**Steps:**
1. Click the "+ Add Task" button
2. Leave Title field empty
3. Fill other fields
4. Click "Save Task" button
**Expected Result:** Form validation prevents submission, error message appears for required field.

#### TC-TASK-003: Update Existing Task
**Priority:** High  
**Description:** Verify that a user can edit and update an existing task.  
**Preconditions:** At least one task exists.  
**Steps:**
1. Click the edit button (✏️) on an existing task
2. Modify task details (title, description, priority, etc.)
3. Click "Save Task" button
**Expected Result:** Task is updated with new details. Success toast appears. Changes persist after page refresh.

#### TC-TASK-004: Delete Task
**Priority:** High  
**Description:** Verify that a user can delete an existing task.  
**Preconditions:** At least one task exists.  
**Steps:**
1. Click the delete button (🗑️) on an existing task
2. Confirm deletion in the dialog
**Expected Result:** Task is removed from the list. Success toast appears. Task count updates.

#### TC-TASK-005: Toggle Task Status
**Priority:** Medium  
**Description:** Verify status cycling through pending → in-progress → completed.  
**Preconditions:** Task exists with pending status.  
**Steps:**
1. Click the status toggle button (✅) on a pending task
2. Observe status change
3. Click again to cycle through statuses
**Expected Result:** Status cycles correctly: pending → in-progress → completed → pending.

#### TC-TASK-006: Search Tasks
**Priority:** Medium  
**Description:** Verify search functionality filters tasks by title and description.  
**Preconditions:** Multiple tasks exist with different titles.  
**Steps:**
1. Enter search term in search input
2. Press Enter or wait for auto-filter
**Expected Result:** Only tasks containing the search term are displayed. Task count updates.

#### TC-TASK-007: Filter by Category
**Priority:** Medium  
**Description:** Verify filtering tasks by category.  
**Preconditions:** Tasks exist in different categories.  
**Steps:**
1. Check one or more category checkboxes in sidebar
2. Observe task list changes
**Expected Result:** Only tasks from selected categories are shown.

#### TC-TASK-008: Filter by Priority
**Priority:** Medium  
**Description:** Verify filtering tasks by priority level.  
**Preconditions:** Tasks exist with different priorities.  
**Steps:**
1. Check priority checkboxes (High, Medium, Low)
2. Observe task list changes
**Expected Result:** Only tasks with selected priorities are shown.

#### TC-TASK-009: Filter by Status
**Priority:** Medium  
**Description:** Verify filtering tasks by status.  
**Preconditions:** Tasks exist with different statuses.  
**Steps:**
1. Check status checkboxes (Pending, In Progress, Completed)
2. Observe task list changes
**Expected Result:** Only tasks with selected statuses are shown.

#### TC-TASK-010: Filter by Due Date
**Priority:** Medium  
**Description:** Verify filtering tasks by due date criteria.  
**Preconditions:** Tasks exist with various due dates.  
**Steps:**
1. Check date filter checkboxes (Overdue, Due Today, Due This Week)
2. Observe task list changes
**Expected Result:** Tasks are filtered correctly based on due date criteria.

#### TC-TASK-011: Sort Tasks
**Priority:** Medium  
**Description:** Verify sorting functionality works for all sort options.  
**Preconditions:** Multiple tasks exist.  
**Steps:**
1. Select different sort options from dropdown
2. Observe task order changes
**Expected Result:** Tasks are sorted correctly by selected criteria (newest first, oldest first, due date, priority, title).

#### TC-TASK-012: Clear All Filters
**Priority:** Low  
**Description:** Verify clearing all filters resets the view.  
**Preconditions:** Filters are applied.  
**Steps:**
1. Click "Clear All Filters" button
**Expected Result:** All filters are unchecked, all tasks are displayed.

### 3.2 Category Management Test Cases

#### TC-CAT-001: Create New Category - Positive
**Priority:** High  
**Description:** Verify creating a new category with valid data.  
**Preconditions:** Application is loaded.  
**Steps:**
1. Click "Manage Categories" button
2. Click "+ Add Category" (implied by modal opening)
3. Enter category name: "Health"
4. Select color
5. Click "Save Category"
**Expected Result:** Category is created and appears in sidebar and dropdowns.

#### TC-CAT-002: Create Category - Duplicate Name
**Priority:** Medium  
**Description:** Verify validation prevents duplicate category names.  
**Preconditions:** Category "Work" exists.  
**Steps:**
1. Attempt to create category with name "Work"
2. Click "Save Category"
**Expected Result:** Error message appears, category not created.

#### TC-CAT-003: Update Category
**Priority:** Medium  
**Description:** Verify editing an existing category.  
**Preconditions:** Category exists.  
**Steps:**
1. Click edit button on a category in sidebar
2. Modify name and/or color
3. Click "Save Category"
**Expected Result:** Category is updated, changes reflected in UI.

#### TC-CAT-004: Delete Category - No Tasks
**Priority:** Medium  
**Description:** Verify deleting a category with no associated tasks.  
**Preconditions:** Category exists with no tasks.  
**Steps:**
1. Click delete button on category
2. Confirm deletion
**Expected Result:** Category is removed from sidebar and dropdowns.

#### TC-CAT-005: Delete Category - With Tasks
**Priority:** High  
**Description:** Verify preventing deletion of category used by tasks.  
**Preconditions:** Category has associated tasks.  
**Steps:**
1. Attempt to delete category with tasks
2. Confirm deletion
**Expected Result:** Error message appears, category not deleted.

### 3.3 UI and UX Test Cases

#### TC-UI-001: Modal Behavior
**Priority:** Medium  
**Description:** Verify modal opening, closing, and overlay behavior.  
**Preconditions:** Application loaded.  
**Steps:**
1. Open task or category modal
2. Try closing via X button, Cancel button, outside click, Escape key
**Expected Result:** Modal closes correctly in all scenarios.

#### TC-UI-002: Form Reset
**Priority:** Low  
**Description:** Verify forms reset when reopened.  
**Preconditions:** Form was previously filled.  
**Steps:**
1. Fill form, close without saving
2. Reopen same form
**Expected Result:** Form fields are empty/reset.

#### TC-UI-003: Responsive Design
**Priority:** Medium  
**Description:** Verify application works on different screen sizes.  
**Preconditions:** Browser window resizable.  
**Steps:**
1. Resize browser window to mobile size (< 768px)
2. Test all functionality
**Expected Result:** Layout adapts, all features work on mobile.

#### TC-UI-004: Keyboard Shortcuts
**Priority:** Low  
**Description:** Verify keyboard shortcuts work.  
**Preconditions:** Application loaded.  
**Steps:**
1. Press Ctrl+N to add task
2. Press Ctrl+F to focus search
3. Press Escape to close modals
**Expected Result:** Shortcuts trigger correct actions.

#### TC-UI-005: Toast Notifications
**Priority:** Low  
**Description:** Verify success and error messages appear correctly.  
**Preconditions:** Various operations performed.  
**Steps:**
1. Perform actions that trigger toasts (create, update, delete)
2. Observe toast appearance and auto-dismissal
**Expected Result:** Toasts appear with correct messages and styling.

### 3.4 Data Persistence Test Cases

#### TC-DATA-001: Data Persistence on Refresh
**Priority:** High  
**Description:** Verify data persists after page refresh.  
**Preconditions:** Tasks and categories exist.  
**Steps:**
1. Create/modify data
2. Refresh the page
**Expected Result:** All data remains intact.

#### TC-DATA-002: Data Export/Import
**Priority:** Low  
**Description:** Verify data export and import functionality (if implemented).  
**Preconditions:** Data exists.  
**Steps:**
1. Export data
2. Clear data
3. Import data back
**Expected Result:** Data is correctly exported and imported.

## 4. Test Execution

### 4.1 Entry Criteria
- Application code is complete and deployable
- Test environment is set up
- Test cases are reviewed and approved

### 4.2 Exit Criteria
- All high-priority test cases pass
- No critical defects remain open
- Test coverage meets requirements
- Test summary report is complete

### 4.3 Test Deliverables
- Test execution results
- Defect reports
- Test summary report
- Test metrics

## 5. Defect Management

### 5.1 Defect Severity Levels
- **Critical:** Application crash, data loss, major functionality broken
- **High:** Major feature not working, incorrect data handling
- **Medium:** Minor functionality issues, UI inconsistencies
- **Low:** Cosmetic issues, minor usability problems

### 5.2 Defect Priority Levels
- **High:** Must fix before release
- **Medium:** Should fix if time permits
- **Low:** Nice to fix, minor improvements

## 6. Risks and Mitigations

### 6.1 Risks
- Browser compatibility issues
- localStorage limitations (5MB limit)
- Mobile responsiveness issues

### 6.2 Mitigations
- Test on primary browser (Chrome)
- Monitor storage usage
- Test responsive design thoroughly

## 7. Test Metrics

### 7.1 Test Coverage Metrics
- Number of test cases executed
- Test case pass/fail rate
- Defects found and fixed
- Requirements coverage

### 7.2 Test Execution Metrics
- Test execution time
- Defect density
- Test effectiveness