/**
 * Extended TaskManager Tests (Member B)
 * These tests focus on storage interactions and edge cases using a localStorage mock
 */

// Mock validators before requiring taskManager
jest.mock('../js/validators.js', () => ({
  validateTask: jest.fn()
}));

describe('TaskManager Full - Storage & Edge Cases', () => {
  let localStorageMock;
  let TaskManagerClass;
  let storageInstance;
  let validators;

  beforeEach(() => {
    // Reset modules to ensure fresh instances per test
    jest.resetModules();

    // Minimal localStorage mock
    localStorageMock = (function () {
      let store = {};
      return {
        getItem: jest.fn((key) => (store.hasOwnProperty(key) ? store[key] : null)),
        setItem: jest.fn((key, value) => { store[key] = value; }),
        removeItem: jest.fn((key) => { delete store[key]; }),
        clear: jest.fn(() => { store = {}; })
      };
    })();

    // Ensure window exists and set localStorage
    global.window = global.window || {};
    Object.defineProperty(global.window, 'localStorage', { value: localStorageMock });

    // Provide basic TaskManagerUtils and categoryManager used by TaskManager
    global.window.TaskManagerUtils = {
      generateId: jest.fn(() => 'generated-id-1'),
      sortTasks: jest.fn((tasks) => tasks),
      getPriorityClass: jest.fn(() => 'prio'),
      priorityToText: jest.fn((p) => p),
      statusToText: jest.fn((s) => s),
      getStatusClass: jest.fn(() => 'stat'),
      getDueDateClass: jest.fn(() => ''),
      formatDate: jest.fn(() => 'formatted'),
      showToast: jest.fn(),
      clearForm: jest.fn(),
      setFormData: jest.fn(),
      getFormData: jest.fn(() => ({}))
    };

    global.window.categoryManager = {
      getCategoryById: jest.fn(() => null),
      renderCategoryOptions: jest.fn()
    };

    // Require storage to create instance that uses our localStorage mock
    storageInstance = require('../js/storage.js');
    // Make sure storage instance is also available on window for TaskManager
    global.window.TaskManagerStorage = storageInstance;

    // Get validators mock
    validators = require('../js/validators.js');

    // Require TaskManager class (exported as TaskManager)
    TaskManagerClass = require('../js/taskManager.js').TaskManager;
  });

  test('addTask calls localStorage.setItem (via storage.saveTasks)', () => {
    const manager = new TaskManagerClass();

    // initialization writes to storage (defaults). Clear initial calls to assert on later behavior only
    localStorageMock.setItem.mockClear();

    const task = manager.addTask({ title: 'New Task', description: 'desc' });

    expect(task.id).toBe('generated-id-1');
    expect(manager.tasks).toHaveLength(1);
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  test('deleteTask decreases task count and persists', () => {
    const manager = new TaskManagerClass();
    const task = manager.addTask({ title: 'To Delete' });

    expect(manager.tasks).toHaveLength(1);

    const result = manager.deleteTask(task.id);

    expect(result).toBe(true);
    expect(manager.tasks).toHaveLength(0);
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  test('updateTask changes status and persists', () => {
    const manager = new TaskManagerClass();
    const task = manager.addTask({ title: 'To Update', status: 'pending' });

    const updated = manager.updateTask(task.id, { status: 'in-progress' });

    expect(updated.status).toBe('in-progress');
    expect(manager.getTaskById(task.id).status).toBe('in-progress');
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  test('deleteTask on non-existent id throws', () => {
    const manager = new TaskManagerClass();
    expect(() => manager.deleteTask('nope')).toThrow('Task not found');
  });

  test('handleTaskSubmit with validation failure shows errors and does not add', () => {
    const manager = new TaskManagerClass();

    // initialization writes to storage (defaults). Clear initial calls so we can assert later behavior
    localStorageMock.setItem.mockClear();

    // Setup form and validation to fail
    const fakeForm = { dataset: {} };
    const event = { preventDefault: jest.fn(), target: fakeForm };

    // make getFormData return an empty title
    global.window.TaskManagerUtils.getFormData = jest.fn(() => ({ title: '' }));

    validators.validateTask.mockReturnValue({ isValid: false, errors: ['Title is required'] });

    manager.handleTaskSubmit(event);

    expect(global.window.TaskManagerUtils.showToast).toHaveBeenCalledWith('Title is required', 'error');
    // Ensure no save to localStorage happened after initialization
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
  });
});
