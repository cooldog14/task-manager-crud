# Test Coverage Analysis - Member B (Test Coverage)

## Executive Summary

As Member B, your goal is to reach **70% test coverage** across all JavaScript modules. Based on the current coverage report, here's the analysis of what needs to be improved.

## Current Coverage Status

### Files with CRITICAL Coverage Gaps (<10%):

| File | Current Coverage | Impact |
|------|-----------------|---------|
| `utils.js` | ~0% | **HIGH** - Used throughout the application |
| `categoryManager.js` | ~0% | **HIGH** - Core category management |

### Files with MEDIUM Coverage Gaps (30-60%):

| File | Current Coverage | Gaps |
|------|-----------------|-------|
| `filters.js` | ~50% | Some conditional branches not covered |
| `taskManager.js` | ~60% | Some edge cases and UI methods not tested |

### Files with GOOD Coverage (>70%):

| File | Coverage | Status |
|------|-----------|--------|
| `dateUtils.js` | ~80% | ✅ Good |
| `storage.js` | ~75% | ✅ Good |
| `validators.js` | ~75% | ✅ Good |
| `advancedFilters.js` | ~70% | ✅ Good |

---

## Detailed Coverage Gaps

### 1. utils.js - Priority: CRITICAL

**Current Status**: Only `capitalize()` function has a basic test. All other functions are untested.

**Functions to Test**:

#### Date/Time Functions (High ROI)
- `formatDate(dateString)` - Format dates for display
  - Test with valid date
  - Test with null/undefined (should return 'No due date')
  - Test with invalid date string

- `isOverdue(dateString)` - Check if task is overdue
  - Test with past date (should return true)
  - Test with future date (should return false)
  - Test with null/undefined (should return false)

- `isDueSoon(dateString)` - Check if task is due within 3 days
  - Test with today's date
  - Test with date 2 days from now
  - Test with date 4 days from now (should return false)
  - Test with null/undefined

#### Classification Functions (High ROI)
- `getPriorityClass(priority)` - Return CSS class for priority
  - Test with 'high', 'medium', 'low'
  - Test with invalid value (should default to 'medium')

- `getStatusClass(status)` - Return CSS class for status
  - Test with 'pending', 'in-progress', 'completed'
  - Test with invalid value (should default to 'pending')

- `getDueDateClass(dateString)` - Return CSS class based on due date
  - Test with null (should return 'on-time')
  - Test with overdue date
  - Test with due-soon date
  - Test with on-time date

#### Text/Display Functions (Medium ROI)
- `capitalize(str)` - Capitalize first letter
  - Already tested, but add edge cases (empty string, single char)

- `statusToText(status)` - Convert status to display text
  - Test all status values
  - Test with invalid value

- `priorityToText(priority)` - Convert priority to display text
  - Test all priority values
  - Test with invalid value

#### Utility Functions (High ROI)
- `isValidEmail(email)` - Validate email format
  - Test with valid email
  - Test with invalid email
  - Test with empty string

- `generateId()` - Generate unique IDs
  - Test that it returns a string
  - Test that multiple calls return different values

- `debounce(func, wait)` - Debounce function calls
  - Test that function is called after delay
  - Test that multiple rapid calls only execute once

#### Sorting/Filtering Functions (High ROI)
- `sortTasks(tasks, sortBy)` - Sort tasks by various criteria
  - Test all sort options: 'created-desc', 'created-asc', 'due-asc', 'due-desc', 'priority-desc', 'priority-asc', 'title-asc', 'title-desc'
  - Test with null/undefined due dates
  - Test with empty array

- `filterTasks(tasks, filters)` - Filter tasks by criteria
  - Test search filter (title and description)
  - Test category filter
  - Test priority filter
  - Test status filter
  - Test overdue filter
  - Test today filter
  - Test week filter
  - Test combination of filters

#### Form/DOM Functions (Medium ROI)
- `showToast(message, type, duration)` - Show toast notification
  - Test with default parameters
  - Test with custom type and duration
  - Test when toastContainer doesn't exist

- `confirmDialog(message)` - Show confirmation dialog
  - Test with user confirmation
  - Test with user cancellation

- `getFormData(form)` - Extract form data
  - Test with simple form
  - Test with multiple fields

- `setFormData(form, data)` - Populate form
  - Test with various data types

- `clearForm(form)` - Reset form
  - Test that form.reset() is called

- `validateForm(form)` - Validate required fields
  - Test with valid form
  - Test with missing required fields

---

### 2. categoryManager.js - Priority: CRITICAL

**Current Status**: Only basic smoke test exists. Almost all functionality is untested.

**Methods to Test**:

#### CRUD Operations (High ROI)
- `loadCategories()` - Load categories from storage
  - Test that categories are loaded from storage
  - Test with empty storage

- `saveCategories()` - Save categories to storage
  - Test that saveCategories is called

- `getCategories()` - Get all categories
  - Test returns copy of categories array

- `getCategoryById(id)` - Find category by ID
  - Test with existing ID
  - Test with non-existent ID (should return undefined)

- `addCategory(categoryData)` - Add new category
  - Test successful addition
  - Test that ID is generated
  - Test with custom color
  - Test with default color
  - Test that category name is trimmed
  - Test error when name already exists

- `updateCategory(id, categoryData)` - Update existing category
  - Test successful update
  - Test that name is trimmed
  - Test color preservation if not provided
  - Test error when category not found
  - Test error when name conflicts with other category

- `deleteCategory(id)` - Delete category
  - Test successful deletion
  - Test error when category not found
  - Test error when category is being used by tasks

#### Helper Methods (Medium ROI)
- `getCategoryName(id)` - Get category name
  - Test with existing ID
  - Test with non-existent ID (should return 'Unknown Category')

- `getCategoryColor(id)` - Get category color
  - Test with existing ID
  - Test with non-existent ID (should return '#6c757d')

#### UI Rendering Methods (Medium ROI)
- `renderCategories()` - Render categories in sidebar
  - Test with categories
  - Test with empty categories
  - Test when categoriesList element doesn't exist

- `renderCategoryOptions(selectElement)` - Render options in dropdown
  - Test with categories
  - Test with empty categories
  - Test when selectElement doesn't exist

- `renderCategoryFilters()` - Render category filter checkboxes
  - Test with categories
  - Test when categoryFilters element doesn't exist

#### Modal Methods (Medium ROI)
- `showCategoryModal(category)` - Show add/edit modal
  - Test with null (add mode)
  - Test with category (edit mode)
  - Test that form is cleared
  - Test that form is populated for edit
  - Test that modal is shown
  - Test when elements don't exist

- `hideCategoryModal()` - Hide modal
  - Test that modal is hidden
  - Test when modal doesn't exist

#### Event Handlers (High ROI)
- `handleCategorySubmit(event)` - Handle form submission
  - Test adding new category
  - Test updating existing category
  - Test validation error (duplicate name)
  - Test that UI is refreshed
  - Test that toast is shown on success/error

- `handleCategoryDelete(categoryId)` - Handle deletion
  - Test successful deletion
  - Test cancellation by user
  - Test error when category is in use
  - Test that UI is refreshed
  - Test that toast is shown

#### Event Binding (Low ROI)
- `bindEvents()` - Bind all category-related events
- `bindCategoryEvents()` - Bind edit/delete button events
- `init()` - Initialize category manager

---

### 3. taskManager.js - Priority: MEDIUM

**Current Status**: Good coverage on core CRUD, but some edge cases and UI methods missing.

**Methods/Scenarios to Add**:

#### Edge Cases (High ROI)
- `toggleTaskStatus(id)` - Test all status transitions
  - pending → in-progress
  - in-progress → completed
  - completed → pending (cycle)
  - Test with non-existent task ID (should return false)

- `updateTask(id, taskData)` - Test partial updates
  - Update only title
  - Update only description
  - Update only status
  - Test with empty description (should become empty string)

#### UI Methods (Medium ROI)
- `showTaskModal(task)` - Show add/edit modal
  - Test with null (add mode)
  - Test with task (edit mode)
  - Test form clearing
  - Test form population

- `hideTaskModal()` - Hide modal
  - Test that modal is hidden

- `createTaskElement(task)` - Create DOM element for task
  - Test with complete task
  - Test with task without description
  - Test with task without due date
  - Test with unknown category

#### Event Handlers (High ROI)
- `handleTaskSubmit(event)` - Test validation scenarios
  - Test with valid task (add)
  - Test with valid task (edit)
  - Test with validation errors
  - Test that form is cleared on add
  - Test that modal is hidden

- `handleTaskDelete(taskId)` - Test deletion flow
  - Test with confirmation
  - Test with cancellation
  - Test error handling

#### Filter Methods (Medium ROI)
- `setSearchFilter(searchTerm)` - Test search filter
- `setCategoryFilters(categoryIds)` - Test category filter
- `setPriorityFilters(priorities)` - Test priority filter
- `setStatusFilters(statuses)` - Test status filter
- `setDateFilters(filters)` - Test date filters
- `clearFilters()` - Test clearing all filters
  - Test that DOM elements are cleared
  - Test that filters object is reset

---

### 4. filters.js - Priority: MEDIUM

**Current Status**: Good basic coverage, but some conditional branches not covered.

**Test Scenarios to Add**:

#### Filter Scenarios (High ROI)
- `getActiveFiltersSummary()` - Test all combinations
  - Only search active
  - Only categories active
  - Only priorities active
  - Only statuses active
  - Only date filters active
  - Multiple filters active
  - No filters active

- `hasActiveFilters()` - Test detection
  - With search term
  - With category selected
  - With priority selected
  - With status selected
  - With date filter
  - With no filters

- `updateClearFiltersVisibility()` - Test button visibility
  - Show button when filters active
  - Hide button when no filters

- `updateFilterCounts()` - Test count updates
  - With tasks
  - With empty tasks
  - Test that counts are displayed

---

## Test Implementation Strategy

### Phase 1: Critical Coverage (Target: 40% overall)
1. **utils.js** - Add tests for all utility functions (highest impact)
2. **categoryManager.js** - Add tests for CRUD operations

### Phase 2: Medium Coverage (Target: 60% overall)
3. **taskManager.js** - Add edge case tests
4. **filters.js** - Add missing branch coverage

### Phase 3: Polish (Target: 70% overall)
5. Review coverage report
6. Add any remaining high-impact tests
7. Document test patterns

---

## Mocking Patterns

### Mocking localStorage
```javascript
beforeEach(() => {
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  };
  global.localStorage = localStorageMock;
});
```

### Mocking DOM elements
```javascript
beforeEach(() => {
  document.getElementById = jest.fn((id) => ({
    innerHTML: '',
    style: {},
    classList: { add: jest.fn(), remove: jest.fn() },
    addEventListener: jest.fn()
  }));
});
```

### Mocking window dependencies
```javascript
global.window = {
  TaskManagerStorage: mockStorage,
  TaskManagerUtils: mockUtils,
  categoryManager: mockCategoryManager
};
```

---

## Running Coverage

```bash
# Run all tests with coverage
npm run test:coverage

# View detailed HTML report
open coverage/lcov-report/index.html
```

---

## Coverage Thresholds

The project requires:
- **70%** statements
- **70%** branches
- **70%** functions
- **70%** lines

---

## Next Steps

1. Start with **utils.js** tests - this will have the biggest impact
2. Move to **categoryManager.js** CRUD operations
3. Add **taskManager.js** edge cases
4. Fill in **filters.js** gaps
5. Run coverage report and address remaining gaps

---

## Tips for Success

1. **Test one function at a time** - Don't try to test everything at once
2. **Focus on happy paths first** - Get basic functionality working
3. **Add edge cases** - Test null, undefined, empty strings
4. **Use describe blocks** - Group related tests together
5. **Use beforeEach** - Set up fresh state for each test
6. **Mock external dependencies** - Don't test other modules
7. **Test both success and failure** - Ensure error handling works
