/**
 * Due Date Utilities Tests - TDD Red Phase
 * Writing failing tests first for date utility functions
 */

const {
  isOverdue,
  isDueToday,
  isDueThisWeek,
  daysUntilDue,
  formatDueDate,
  getDueDateStatus
} = require('../js/dateUtils');

describe('Due Date Utilities', () => {
  // Mock current date for consistent testing
  const mockToday = new Date('2025-12-09');
  const originalDate = global.Date;

  beforeAll(() => {
    // Mock Date constructor
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

  describe('isOverdue', () => {
    test('should return true for past dates', () => {
      expect(isOverdue('2025-12-08')).toBe(true); // Yesterday
      expect(isOverdue('2025-12-01')).toBe(true); // Last week
    });

    test('should return false for today and future dates', () => {
      expect(isOverdue('2025-12-09')).toBe(false); // Today
      expect(isOverdue('2025-12-10')).toBe(false); // Tomorrow
      expect(isOverdue('2025-12-15')).toBe(false); // Next week
    });

    test('should return false for null/undefined dates', () => {
      expect(isOverdue(null)).toBe(false);
      expect(isOverdue(undefined)).toBe(false);
      expect(isOverdue('')).toBe(false);
    });

    test('should return false for invalid date strings', () => {
      expect(isOverdue('invalid-date')).toBe(false);
      expect(isOverdue('2025-13-45')).toBe(false);
    });
  });

  describe('isDueToday', () => {
    test('should return true for today\'s date', () => {
      expect(isDueToday('2025-12-09')).toBe(true);
    });

    test('should return false for other dates', () => {
      expect(isDueToday('2025-12-08')).toBe(false); // Yesterday
      expect(isDueToday('2025-12-10')).toBe(false); // Tomorrow
      expect(isDueToday('2025-12-15')).toBe(false); // Next week
    });

    test('should return false for null/undefined dates', () => {
      expect(isDueToday(null)).toBe(false);
      expect(isDueToday(undefined)).toBe(false);
    });
  });

  describe('isDueThisWeek', () => {
    test('should return true for dates within current week', () => {
      expect(isDueThisWeek('2025-12-09')).toBe(true); // Monday (today)
      expect(isDueThisWeek('2025-12-10')).toBe(true); // Tuesday
      expect(isDueThisWeek('2025-12-13')).toBe(true); // Friday
    });

    test('should return false for dates outside current week', () => {
      expect(isDueThisWeek('2025-12-08')).toBe(false); // Last Sunday
      expect(isDueThisWeek('2025-12-15')).toBe(false); // Next Sunday
      expect(isDueThisWeek('2025-12-22')).toBe(false); // Week after
    });

    test('should return false for null/undefined dates', () => {
      expect(isDueThisWeek(null)).toBe(false);
      expect(isDueThisWeek(undefined)).toBe(false);
    });
  });

  describe('daysUntilDue', () => {
    test('should return 0 for today', () => {
      expect(daysUntilDue('2025-12-09')).toBe(0);
    });

    test('should return positive numbers for future dates', () => {
      expect(daysUntilDue('2025-12-10')).toBe(1); // Tomorrow
      expect(daysUntilDue('2025-12-15')).toBe(6); // Next week
    });

    test('should return negative numbers for past dates', () => {
      expect(daysUntilDue('2025-12-08')).toBe(-1); // Yesterday
      expect(daysUntilDue('2025-12-01')).toBe(-8); // Last week
    });

    test('should return null for invalid dates', () => {
      expect(daysUntilDue('invalid')).toBe(null);
      expect(daysUntilDue(null)).toBe(null);
      expect(daysUntilDue('')).toBe(null);
    });
  });

  describe('formatDueDate', () => {
    test('should format today as "Due Today"', () => {
      expect(formatDueDate('2025-12-09')).toBe('Due Today');
    });

    test('should format tomorrow as "Due Tomorrow"', () => {
      expect(formatDueDate('2025-12-10')).toBe('Due Tomorrow');
    });

    test('should format past dates as "Overdue"', () => {
      expect(formatDueDate('2025-12-08')).toBe('Overdue');
    });

    test('should format future dates with date', () => {
      expect(formatDueDate('2025-12-15')).toBe('Due Dec 15, 2025');
      expect(formatDueDate('2025-12-25')).toBe('Due Dec 25, 2025');
    });

    test('should handle invalid dates', () => {
      expect(formatDueDate('invalid')).toBe('Invalid Date');
      expect(formatDueDate(null)).toBe('No Due Date');
    });
  });

  describe('getDueDateStatus', () => {
    test('should return "overdue" for past dates', () => {
      expect(getDueDateStatus('2025-12-08')).toBe('overdue');
    });

    test('should return "due-today" for today', () => {
      expect(getDueDateStatus('2025-12-09')).toBe('due-today');
    });

    test('should return "due-tomorrow" for tomorrow', () => {
      expect(getDueDateStatus('2025-12-10')).toBe('due-tomorrow');
    });

    test('should return "due-this-week" for this week', () => {
      expect(getDueDateStatus('2025-12-13')).toBe('due-this-week');
    });

    test('should return "due-future" for future dates', () => {
      expect(getDueDateStatus('2025-12-20')).toBe('due-future');
    });

    test('should return "no-date" for null/undefined', () => {
      expect(getDueDateStatus(null)).toBe('no-date');
      expect(getDueDateStatus(undefined)).toBe('no-date');
    });
  });
});