/**
 * Advanced Filtering Tests - TDD Red Phase
 * Writing failing tests first for complex filtering logic
 */

const { filterTasksAdvanced } = require('../js/advancedFilters');


describe('Advanced Task Filtering', () => {
  let mockTasks;
  const mockToday = new Date('2025-12-08T12:00:00Z'); // Monday
  const originalDate = global.Date;

  beforeAll(() => {
    global.Date = class extends originalDate {
      constructor(...args) {
        if (args.length === 0) {
          return new originalDate(mockToday);
        }
        return new originalDate(...args);
      }
      static now() {
        return mockToday.getTime();
      }
    };
  });

  afterAll(() => {
    global.Date = originalDate;
  });

  beforeEach(() => {
    const today = new Date();
    const future1 = new Date(today);
    future1.setDate(today.getDate() + 10);
    const future2 = new Date(today);
    future2.setDate(today.getDate() + 11);
    const past = new Date(today);
    past.setDate(today.getDate() - 30);

    mockTasks = [
      {
        id: '1',
        title: 'Work Task 1',
        categoryId: 'work',
        priority: 'high',
        status: 'pending',
        dueDate: null
      },
      {
        id: '2',
        title: 'Work Task 2',
        categoryId: 'work',
        priority: 'medium',
        status: 'in-progress',
        dueDate: future1.toISOString().split('T')[0]
      },
      {
        id: '3',
        title: 'Personal Task',
        categoryId: 'personal',
        priority: 'low',
        status: 'completed',
        dueDate: future2.toISOString().split('T')[0]
      },
      {
        id: '4',
        title: 'Shopping Task',
        categoryId: 'shopping',
        priority: 'high',
        status: 'pending',
        dueDate: past.toISOString().split('T')[0] // Past date - overdue
      }
    ];
  });

  describe('filterTasksAdvanced', () => {
    test('should filter tasks by multiple priorities with AND logic', () => {
      const filters = {
        priorities: ['high', 'medium'],
        operator: 'AND'
      };

      const result = filterTasksAdvanced(mockTasks, filters);
      expect(result).toHaveLength(3);
      expect(result.map(t => t.id).sort()).toEqual(['1', '2', '4']);
    });

    test('should filter tasks by category and status combination', () => {
      const filters = {
        categories: ['work'],
        statuses: ['pending'],
        operator: 'AND'
      };

      const result = filterTasksAdvanced(mockTasks, filters);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    test('should filter overdue tasks', () => {
      const filters = {
        overdue: true
      };

      const result = filterTasksAdvanced(mockTasks, filters);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('4'); // Shopping task with past due date
    });

    test('should filter tasks due today', () => {
      const today = new Date().toISOString().split('T')[0];
      // Mock task due today
      const tasksWithToday = [
        ...mockTasks,
        {
          id: '5',
          title: 'Today Task',
          categoryId: 'work',
          priority: 'high',
          status: 'pending',
          dueDate: today
        }
      ];

      const filters = {
        dueToday: true
      };

      const result = filterTasksAdvanced(tasksWithToday, filters);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('5');
    });

    test('should filter tasks due this week', () => {
      // Create a date that's definitely this week
      // Since we mocked today as Monday (2025-12-08), Thursday is 2025-12-11
      const thursday = new Date('2025-12-11');
      const thursdayStr = thursday.toISOString().split('T')[0];

      const tasksWithWeek = [
        ...mockTasks,
        {
          id: '6',
          title: 'Week Task',
          categoryId: 'work',
          priority: 'medium',
          status: 'pending',
          dueDate: thursdayStr
        }
      ];

      const filters = {
        dueThisWeek: true
      };

      const result = filterTasksAdvanced(tasksWithWeek, filters);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('6');
    });

    test('should combine multiple filter criteria with AND logic', () => {
      const filters = {
        categories: ['work'],
        priorities: ['high', 'medium'],
        statuses: ['pending', 'in-progress'],
        operator: 'AND'
      };

      const result = filterTasksAdvanced(mockTasks, filters);
      expect(result).toHaveLength(2);
      expect(result.map(t => t.id).sort()).toEqual(['1', '2']);
    });

    test('should support OR logic for multiple criteria', () => {
      const filters = {
        categories: ['work', 'personal'],
        operator: 'OR'
      };

      const result = filterTasksAdvanced(mockTasks, filters);
      expect(result).toHaveLength(3);
      expect(result.map(t => t.id).sort()).toEqual(['1', '2', '3']);
    });

    test('should handle empty filters (return all tasks)', () => {
      const filters = {};
      const result = filterTasksAdvanced(mockTasks, filters);
      expect(result).toHaveLength(mockTasks.length);
    });

    test('should handle search term filtering', () => {
      const filters = {
        searchTerm: 'Work'
      };

      const result = filterTasksAdvanced(mockTasks, filters);
      expect(result).toHaveLength(2);
      expect(result.map(t => t.id).sort()).toEqual(['1', '2']);
    });

    test('should combine search with other filters', () => {
      const filters = {
        searchTerm: 'Task',
        categories: ['work'],
        operator: 'AND'
      };

      const result = filterTasksAdvanced(mockTasks, filters);
      expect(result).toHaveLength(2);
      expect(result.map(t => t.id).sort()).toEqual(['1', '2']);
    });
  });
});