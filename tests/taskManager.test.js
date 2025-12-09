/**
 * Task Manager Tests
 * Tests for task CRUD operations and business logic
 */

// Mock dependencies
jest.mock('../js/storage.js', () => ({
  getTasks: jest.fn(),
  saveTasks: jest.fn(),
  getCategories: jest.fn(),
  updateSetting: jest.fn()
}));

jest.mock('../js/utils.js', () => ({
  generateId: jest.fn(() => 'test-id-123'),
  filterTasks: jest.fn(),
  sortTasks: jest.fn(),
  priorityToText: jest.fn(),
  statusToText: jest.fn(),
  formatDate: jest.fn(),
  getPriorityClass: jest.fn(),
  getStatusClass: jest.fn(),
  getDueDateClass: jest.fn(),
  showToast: jest.fn(),
  confirmDialog: jest.fn(),
  clearForm: jest.fn(),
  setFormData: jest.fn(),
  getFormData: jest.fn()
}));

jest.mock('../js/categoryManager.js', () => ({
  getCategoryById: jest.fn(),
  renderCategoryOptions: jest.fn()
}));

// Mock window and DOM
global.window = {
  TaskManagerStorage: require('../js/storage.js')
};

global.document = {
  getElementById: jest.fn((id) => ({
    innerHTML: '',
    style: {},
    textContent: '',
    classList: {
      add: jest.fn(),
      remove: jest.fn(),
      contains: jest.fn()
    },
    addEventListener: jest.fn(),
    querySelector: jest.fn(),
    querySelectorAll: jest.fn(() => []),
    getAttribute: jest.fn(),
    setAttribute: jest.fn()
  })),
  addEventListener: jest.fn()
};

describe('TaskManager', () => {
  let taskManager;
  let mockStorage;
  let mockUtils;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Import modules after mocking
    delete require.cache[require.resolve('../js/taskManager.js')];
    delete require.cache[require.resolve('../js/storage.js')];
    delete require.cache[require.resolve('../js/utils.js')];

    mockStorage = require('../js/storage.js');
    mockUtils = require('../js/utils.js');

    // Mock return values
    mockStorage.getTasks.mockReturnValue([]);
    mockStorage.saveTasks.mockReturnValue(true);
    mockUtils.filterTasks.mockImplementation((tasks) => tasks);
    mockUtils.sortTasks.mockImplementation((tasks) => tasks);

    taskManager = require('../js/taskManager.js');
  });

  describe('Initialization', () => {
    test('should load tasks on initialization', () => {
      const mockTasks = [{ id: '1', title: 'Test Task' }];
      mockStorage.getTasks.mockReturnValue(mockTasks);

      const manager = new (require('../js/taskManager.js'))();

      expect(mockStorage.getTasks).toHaveBeenCalled();
      expect(manager.tasks).toEqual(mockTasks);
    });

    test('should initialize with default filters', () => {
      const manager = new (require('../js/taskManager.js'))();

      expect(manager.currentFilters).toEqual({
        search: '',
        categories: [],
        priorities: [],
        statuses: [],
        overdue: false,
        today: false,
        week: false
      });
    });
  });

  describe('Task CRUD Operations', () => {
    let manager;

    beforeEach(() => {
      manager = new (require('../js/taskManager.js'))();
      mockStorage.getTasks.mockReturnValue([]);
    });

    test('should add new task', () => {
      const taskData = {
        title: 'New Task',
        description: 'Description',
        categoryId: 'work',
        priority: 'high',
        status: 'pending',
        dueDate: '2025-12-15'
      };

      const result = manager.addTask(taskData);

      expect(result.id).toBe('test-id-123');
      expect(result.title).toBe('New Task');
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
      expect(mockStorage.saveTasks).toHaveBeenCalled();
    });

    test('should update existing task', () => {
      const existingTask = {
        id: 'existing-id',
        title: 'Old Title',
        updatedAt: '2025-12-08T10:00:00.000Z'
      };

      manager.tasks = [existingTask];
      mockStorage.getTasks.mockReturnValue([existingTask]);

      const updateData = { title: 'New Title' };
      const result = manager.updateTask('existing-id', updateData);

      expect(result.title).toBe('New Title');
      expect(result.updatedAt).not.toBe(existingTask.updatedAt);
      expect(mockStorage.saveTasks).toHaveBeenCalled();
    });

    test('should throw error when updating non-existent task', () => {
      expect(() => {
        manager.updateTask('non-existent', {});
      }).toThrow('Task not found');
    });

    test('should delete existing task', () => {
      const existingTask = { id: 'existing-id', title: 'Test' };
      manager.tasks = [existingTask];

      const result = manager.deleteTask('existing-id');

      expect(result).toBe(true);
      expect(manager.tasks).toHaveLength(0);
      expect(mockStorage.saveTasks).toHaveBeenCalled();
    });

    test('should throw error when deleting non-existent task', () => {
      expect(() => {
        manager.deleteTask('non-existent');
      }).toThrow('Task not found');
    });

    test('should toggle task status', () => {
      const task = {
        id: 'test-id',
        status: 'pending'
      };
      manager.tasks = [task];

      const result = manager.toggleTaskStatus('test-id');

      expect(result.status).toBe('in-progress');
      expect(mockStorage.saveTasks).toHaveBeenCalled();
    });

    test('should get task by ID', () => {
      const task = { id: 'test-id', title: 'Test' };
      manager.tasks = [task];

      const result = manager.getTaskById('test-id');
      expect(result).toEqual(task);
    });
  });

  describe('Filtering and Sorting', () => {
    let manager;

    beforeEach(() => {
      manager = new (require('../js/taskManager.js'))();
    });

    test('should apply filters and sorting', () => {
      const mockTasks = [{ id: '1' }, { id: '2' }];
      manager.tasks = mockTasks;

      manager.applyFiltersAndSort();

      expect(mockUtils.filterTasks).toHaveBeenCalledWith(mockTasks, manager.currentFilters);
      expect(mockUtils.sortTasks).toHaveBeenCalled();
    });

    test('should set search filter', () => {
      manager.setSearchFilter('test search');

      expect(manager.currentFilters.search).toBe('test search');
    });

    test('should set category filters', () => {
      const categories = ['work', 'personal'];
      manager.setCategoryFilters(categories);

      expect(manager.currentFilters.categories).toEqual(categories);
    });

    test('should set priority filters', () => {
      const priorities = ['high', 'medium'];
      manager.setPriorityFilters(priorities);

      expect(manager.currentFilters.priorities).toEqual(priorities);
    });

    test('should set status filters', () => {
      const statuses = ['pending', 'in-progress'];
      manager.setStatusFilters(statuses);

      expect(manager.currentFilters.statuses).toEqual(statuses);
    });

    test('should set date filters', () => {
      const dateFilters = { overdue: true, today: false, week: true };
      manager.setDateFilters(dateFilters);

      expect(manager.currentFilters.overdue).toBe(true);
      expect(manager.currentFilters.today).toBe(false);
      expect(manager.currentFilters.week).toBe(true);
    });

    test('should set sorting', () => {
      manager.setSorting('due-asc');

      expect(manager.currentSort).toBe('due-asc');
      expect(mockStorage.updateSetting).toHaveBeenCalledWith('sortBy', 'due-asc');
    });

    test('should clear all filters', () => {
      manager.currentFilters = {
        search: 'test',
        categories: ['work'],
        priorities: ['high'],
        statuses: ['pending'],
        overdue: true,
        today: true,
        week: true
      };

      manager.clearFilters();

      expect(manager.currentFilters).toEqual({
        search: '',
        categories: [],
        priorities: [],
        statuses: [],
        overdue: false,
        today: false,
        week: false
      });
    });
  });

  describe('UI Rendering', () => {
    let manager;

    beforeEach(() => {
      manager = new (require('../js/taskManager.js'))();
    });

    test('should render tasks', () => {
      const mockTasks = [
        {
          id: '1',
          title: 'Test Task',
          description: 'Description',
          categoryId: 'work',
          priority: 'high',
          status: 'pending',
          dueDate: '2025-12-15'
        }
      ];

      manager.tasks = mockTasks;
      manager.filteredTasks = mockTasks;

      manager.renderTasks();

      // Verify DOM manipulation calls were made
      expect(document.getElementById).toHaveBeenCalledWith('taskList');
      expect(document.getElementById).toHaveBeenCalledWith('noTasks');
    });

    test('should update task count', () => {
      manager.filteredTasks = [{ id: '1' }, { id: '2' }];

      manager.updateTaskCount();

      expect(document.getElementById).toHaveBeenCalledWith('taskCount');
    });
  });
});