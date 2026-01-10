// High-ROI test for categoryManager.js
beforeAll(() => {
  global.window = global.window || {};
  global.window.TaskManagerStorage = {
    getCategories: jest.fn(() => [{ id: 1, name: 'Work' }]),
    saveCategories: jest.fn(),
    getSettings: jest.fn(() => ({})),
    saveSettings: jest.fn()
  };
  require('../js/categoryManager');
});
describe('categoryManager.js', () => {
  test('loads categories from storage', () => {
    const categoryManager = global.window.categoryManager;
    categoryManager.loadCategories();
    expect(categoryManager.categories[0].name).toBe('Work');
  });
});
