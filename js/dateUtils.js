/**
 * Due Date Utilities
 * Comprehensive utilities for working with task due dates
 */

// Constants for date calculations
const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

/**
 * Checks if a due date is overdue (past due date)
 * @param {string} dueDateString - Due date string in YYYY-MM-DD format
 * @returns {boolean} True if the due date is in the past, false otherwise
 * @example
 * isOverdue('2025-12-08') // true (if today is 2025-12-09)
 * isOverdue('2025-12-10') // false
 */
function isOverdue(dueDateString) {
  if (!isValidDateString(dueDateString)) return false;

  const today = getStartOfDay(new Date());
  const dueDate = getStartOfDay(new Date(dueDateString));

  return dueDate < today;
}

/**
 * Checks if a due date is today
 * @param {string} dueDateString - Due date string in YYYY-MM-DD format
 * @returns {boolean} True if the due date is today, false otherwise
 */
function isDueToday(dueDateString) {
  if (!isValidDateString(dueDateString)) return false;

  const todayString = new Date().toISOString().split('T')[0];
  return dueDateString === todayString;
}

/**
 * Checks if a due date falls within the current week (Monday to Saturday)
 * @param {string} dueDateString - Due date string in YYYY-MM-DD format
 * @returns {boolean} True if the due date is within this week, false otherwise
 */
function isDueThisWeek(dueDateString) {
  if (!isValidDateString(dueDateString)) return false;

  const today = getStartOfDay(new Date());
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + (6 - today.getDay())); // Saturday of current week

  const dueDate = getStartOfDay(new Date(dueDateString));

  return dueDate >= today && dueDate <= endOfWeek;
}

/**
 * Calculates the number of days until the due date
 * @param {string} dueDateString - Due date string in YYYY-MM-DD format
 * @returns {number|null} Days until due date (positive for future, negative for past, null for invalid)
 * @example
 * daysUntilDue('2025-12-10') // 1 (if today is 2025-12-09)
 * daysUntilDue('2025-12-08') // -1 (if today is 2025-12-09)
 */
function daysUntilDue(dueDateString) {
  if (!isValidDateString(dueDateString)) return null;

  const today = getStartOfDay(new Date());
  const dueDate = getStartOfDay(new Date(dueDateString));

  const diffTime = dueDate.getTime() - today.getTime();
  return Math.ceil(diffTime / MILLISECONDS_PER_DAY);
}

/**
 * Formats a due date for user-friendly display
 * @param {string} dueDateString - Due date string in YYYY-MM-DD format
 * @returns {string} Formatted due date string for display
 * @example
 * formatDueDate('2025-12-09') // "Due Today"
 * formatDueDate('2025-12-10') // "Due Tomorrow"
 * formatDueDate('2025-12-15') // "Due Dec 15, 2025"
 */
function formatDueDate(dueDateString) {
  if (!isValidDateString(dueDateString)) {
    return dueDateString ? 'Invalid Date' : 'No Due Date';
  }

  const dueDate = getStartOfDay(new Date(dueDateString));
  const today = getStartOfDay(new Date());
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (dueDate < today) {
    return 'Overdue';
  } else if (dueDate.getTime() === today.getTime()) {
    return 'Due Today';
  } else if (dueDate.getTime() === tomorrow.getTime()) {
    return 'Due Tomorrow';
  } else {
    return `Due ${dueDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })}`;
  }
}

/**
 * Gets a CSS class name representing the due date status for styling
 * @param {string} dueDateString - Due date string in YYYY-MM-DD format
 * @returns {string} CSS class name for due date status
 * @example
 * getDueDateStatus('2025-12-08') // "overdue" (if today is 2025-12-09)
 * getDueDateStatus('2025-12-09') // "due-today"
 * getDueDateStatus('2025-12-13') // "due-this-week"
 */
function getDueDateStatus(dueDateString) {
  if (!isValidDateString(dueDateString)) return 'no-date';

  const dueDate = getStartOfDay(new Date(dueDateString));
  const today = getStartOfDay(new Date());
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (dueDate < today) {
    return 'overdue';
  } else if (dueDate.getTime() === today.getTime()) {
    return 'due-today';
  } else if (dueDate.getTime() === tomorrow.getTime()) {
    return 'due-tomorrow';
  } else if (isDueThisWeek(dueDateString)) {
    return 'due-this-week';
  } else {
    return 'due-future';
  }
}

/**
 * Validates if a string is a valid date string in YYYY-MM-DD format
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if valid date string, false otherwise
 * @private
 */
function isValidDateString(dateString) {
  if (!dateString || typeof dateString !== 'string') return false;

  const date = new Date(dateString);
  return !isNaN(date.getTime()) && dateString.match(/^\d{4}-\d{2}-\d{2}$/);
}

/**
 * Gets a Date object set to the start of the day (00:00:00.000)
 * @param {Date} date - Date object to normalize
 * @returns {Date} New Date object set to start of day
 * @private
 */
function getStartOfDay(date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    isOverdue,
    isDueToday,
    isDueThisWeek,
    daysUntilDue,
    formatDueDate,
    getDueDateStatus
  };
}