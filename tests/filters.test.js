// Basic smoke test for filters.js
describe('filters', () => {
  let filters;
  beforeEach(() => {
    jest.useFakeTimers();
    document.body.innerHTML = `
      <input id="searchInput" />
      <button id="clearSearch"></button>
      <div class="filter-option"><input type="checkbox" class="category-filter" value="cat1" /></div>
      <div class="filter-option"><input type="checkbox" class="priority-filter" value="high" /></div>
      <div class="filter-option"><input type="checkbox" class="status-filter" value="pending" /></div>
      <button id="clearFilters"></button>
      <select id="sortSelect"><option value="created-desc">Desc</option></select>
    `;
    
    global.window = global.window || {};
    global.window.TaskManagerStorage = {
      getSettings: jest.fn(() => ({})),
      saveSettings: jest.fn()
    };
    global.window.TaskManagerUtils = {
      debounce: jest.fn((fn) => fn) // Simple pass-through for testing
    };
    global.window.taskManager = {
      setSearchFilter: jest.fn(),
      setCategoryFilters: jest.fn(),
      setPriorityFilters: jest.fn(),
      setStatusFilters: jest.fn(),
      clearFilters: jest.fn(),
      setSorting: jest.fn(),
      getTasks: jest.fn(() => [])
    };

    jest.resetModules();
    filters = require('../js/filters');
    if (filters.init) filters.init();
  });

  test('module should be defined', () => {
    expect(filters).toBeDefined();
  });

  it('should call setSearchFilter on input', () => {
    const input = document.getElementById('searchInput');
    input.value = 'abc';
    input.dispatchEvent(new window.Event('input', { bubbles: true }));
    expect(window.taskManager.setSearchFilter).toHaveBeenCalledWith('abc');
  });

  it('should call setCategoryFilters on category filter change', () => {
    const checkbox = document.querySelector('.category-filter');
    checkbox.checked = true;
    checkbox.dispatchEvent(new window.Event('change', { bubbles: true }));
    expect(window.taskManager.setCategoryFilters).toHaveBeenCalledWith(['cat1']);
  });

  it('should call setPriorityFilters on priority filter change', () => {
    const checkbox = document.querySelector('.priority-filter');
    checkbox.checked = true;
    checkbox.dispatchEvent(new window.Event('change', { bubbles: true }));
    expect(window.taskManager.setPriorityFilters).toHaveBeenCalledWith(['high']);
  });

  it('should call setStatusFilters on status filter change', () => {
    const checkbox = document.querySelector('.status-filter');
    checkbox.checked = true;
    checkbox.dispatchEvent(new window.Event('change', { bubbles: true }));
    expect(window.taskManager.setStatusFilters).toHaveBeenCalledWith(['pending']);
  });

  it('should call clearFilters on clearFiltersBtn click', () => {
    const btn = document.getElementById('clearFilters');
    btn.click();
    expect(window.taskManager.clearFilters).toHaveBeenCalled();
  });
});
