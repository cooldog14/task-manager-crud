/**
 * Task Validation Tests - TDD Red Phase
 * Writing failing tests first
 */

const { validateTask } = require('../js/validators');

describe('Task Validation', () => {
  describe('validateTask', () => {
    test('should pass validation for valid task data', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7); // 7 days from now

      const validTask = {
        title: 'Complete project report',
        description: 'Write and submit the quarterly project report',
        categoryId: 'default-work',
        priority: 'medium',
        status: 'pending',
        dueDate: futureDate.toISOString().split('T')[0]
      };

      const result = validateTask(validTask);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    test('should fail validation for task with empty title', () => {
      const invalidTask = {
        title: '',
        description: 'Some description',
        categoryId: 'default-work',
        priority: 'medium',
        status: 'pending'
      };

      const result = validateTask(invalidTask);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Title is required and cannot be empty');
    });

    test('should fail validation for task with title too long', () => {
      const longTitle = 'a'.repeat(101);
      const invalidTask = {
        title: longTitle,
        description: 'Some description',
        categoryId: 'default-work',
        priority: 'medium',
        status: 'pending'
      };

      const result = validateTask(invalidTask);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Title must be 100 characters or less (current: 101)');
    });

    test('should fail validation for task with description too long', () => {
      const longDescription = 'a'.repeat(501);
      const invalidTask = {
        title: 'Valid title',
        description: longDescription,
        categoryId: 'default-work',
        priority: 'medium',
        status: 'pending'
      };

      const result = validateTask(invalidTask);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Description must be 500 characters or less (current: 501)');
    });

    test('should fail validation for invalid priority', () => {
      const invalidTask = {
        title: 'Valid title',
        description: 'Valid description',
        categoryId: 'default-work',
        priority: 'invalid',
        status: 'pending'
      };

      const result = validateTask(invalidTask);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Priority must be one of: low, medium, high');
    });

    test('should fail validation for invalid status', () => {
      const invalidTask = {
        title: 'Valid title',
        description: 'Valid description',
        categoryId: 'default-work',
        priority: 'medium',
        status: 'invalid'
      };

      const result = validateTask(invalidTask);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Status must be one of: pending, in-progress, completed');
    });

    test('should fail validation for invalid due date format', () => {
      const invalidTask = {
        title: 'Valid title',
        description: 'Valid description',
        categoryId: 'default-work',
        priority: 'medium',
        status: 'pending',
        dueDate: 'invalid-date'
      };

      const result = validateTask(invalidTask);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Due date must be a valid date in YYYY-MM-DD format');
    });

    test('should fail validation for past due date', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      const invalidTask = {
        title: 'Valid title',
        description: 'Valid description',
        categoryId: 'default-work',
        priority: 'medium',
        status: 'pending',
        dueDate: pastDate.toISOString().split('T')[0]
      };

      const result = validateTask(invalidTask);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Due date cannot be in the past');
    });

    test('should handle multiple validation errors', () => {
      const invalidTask = {
        title: '',
        description: 'a'.repeat(501),
        categoryId: 'default-work',
        priority: 'invalid',
        status: 'invalid',
        dueDate: 'invalid-date'
      };

      const result = validateTask(invalidTask);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });
});