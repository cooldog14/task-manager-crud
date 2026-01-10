// High-ROI test for filters.js
beforeAll(() => {
  global.window = global.window || {};
  global.window.TaskManagerStorage = {
    getSettings: jest.fn(() => ({ sortBy: 'priority' })),
    saveSettings: jest.fn()
  };
  require('../js/filters');
});
describe('filters.js', () => {
  test('loads saved settings', () => {
    const filtersManager = global.window.filtersManager;
    expect(filtersManager && filtersManager.loadSavedSettings).toBeDefined();
    // Should not throw
    if (filtersManager && typeof filtersManager.loadSavedSettings === 'function') {
      filtersManager.loadSavedSettings();
      expect(global.window.TaskManagerStorage.getSettings).toHaveBeenCalled();
    }
  });
  test('getActiveFiltersSummary returns correct summary', () => {
    const filtersManager = global.window.filtersManager;
    document.body.innerHTML = `
      <input id="searchInput" value="foo" />
      <input type="checkbox" class="category-filter" value="cat1" checked />
      <input type="checkbox" class="priority-filter" value="high" checked />
      <input type="checkbox" class="status-filter" value="pending" checked />
      <input id="overdueFilter" type="checkbox" checked />
      <input id="todayFilter" type="checkbox" />
      <input id="weekFilter" type="checkbox" />
    `;
    const summary = filtersManager.getActiveFiltersSummary();
    expect(summary.search).toBe('foo');
    expect(summary.categories).toContain('cat1');
    expect(summary.priorities).toContain('high');
    expect(summary.statuses).toContain('pending');
    expect(summary.overdue).toBe(true);
  });

  test('hasActiveFilters returns true if any filter is active', () => {
    const filtersManager = global.window.filtersManager;
    document.body.innerHTML = `<input id="searchInput" value="bar" />`;
    expect(filtersManager.hasActiveFilters()).toBe(true);
  });

  test('updateClearFiltersVisibility shows/hides button', () => {
    const filtersManager = global.window.filtersManager;
    document.body.innerHTML = `<button id="clearFilters" style="display:none"></button><input id="searchInput" value="baz" />`;
    filtersManager.updateClearFiltersVisibility();
    const btn = document.getElementById('clearFilters');
    expect(btn.style.display).toBe('block');
    document.getElementById('searchInput').value = '';
    filtersManager.updateClearFiltersVisibility();
    expect(btn.style.display).toBe('none');
  });

  test('updateFilterCounts does not throw', () => {
    const filtersManager = global.window.filtersManager;
    global.window.taskManager = { getTasks: () => [] };
    document.body.innerHTML = `
      <input class="category-filter" value="cat1" />
      <input class="priority-filter" value="high" />
      <input class="status-filter" value="pending" />
    `;
    expect(() => filtersManager.updateFilterCounts()).not.toThrow();
  });
});
