/**
 * Advanced Filtering Tests - TDD Red Phase
 * Writing failing tests first for complex filtering logic
 */

const { filterTasksAdvanced } = require('../js/advancedFilters');

describe('Advanced Task Filtering', () => {
  // Sample test data
  const mockTasks = [
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
      dueDate: '2025-12-20' // Future date
    },
    {
      id: '3',
      title: 'Personal Task',
      categoryId: 'personal',
      priority: 'low',
      status: 'completed',
      dueDate: '2025-12-18' // Future date
    },
    {
      id: '4',
      title: 'Shopping Task',
      categoryId: 'shopping',
      priority: 'high',
      status: 'pending',
      dueDate: '2024-12-08' // Past date - overdue
    }
  ];

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
      const today = new Date().toISOString().split('T')[0];
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
      // Create a date that's definitely this week (Thursday of current week)
      const today = new Date();
      const daysUntilThursday = (4 - today.getDay() + 7) % 7; // 4 = Thursday
      const thursday = new Date(today);
      thursday.setDate(today.getDate() + daysUntilThursday);
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