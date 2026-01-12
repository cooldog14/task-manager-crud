/**
 * Task Validation Utilities
 * Provides comprehensive validation for task data with detailed error reporting
 */

// Validation constants
const VALIDATION_RULES = {
  TITLE_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 500,
  VALID_PRIORITIES: ['low', 'medium', 'high'],
  VALID_STATUSES: ['pending', 'in-progress', 'completed']
};

/**
 * Validates task data comprehensively
 * @param {Object} taskData - The task data to validate
 * @param {string} taskData.title - Task title (required, max 100 chars)
 * @param {string} [taskData.description] - Task description (optional, max 500 chars)
 * @param {string} taskData.categoryId - Category ID (required)
 * @param {string} taskData.priority - Priority level (low/medium/high)
 * @param {string} taskData.status - Task status (pending/in-progress/completed)
 * @param {string} [taskData.dueDate] - Due date in YYYY-MM-DD format
 * @returns {Object} Validation result
 * @returns {boolean} result.isValid - Whether validation passed
 * @returns {string[]} result.errors - Array of error messages
 */
function validateTask(taskData) {
  if (!taskData || typeof taskData !== 'object') {
    return {
      isValid: false,
      errors: ['Task data must be a valid object']
    };
  }

  const errors = [];

  // Title validation with sanitization
  const title = taskData.title?.trim();
  if (!title) {
    errors.push('Title is required and cannot be empty');
  } else if (title.length > VALIDATION_RULES.TITLE_MAX_LENGTH) {
    errors.push(`Title must be ${VALIDATION_RULES.TITLE_MAX_LENGTH} characters or less (current: ${title.length})`);
  }

  // Description validation with sanitization
  const description = taskData.description?.trim();
  if (description && description.length > VALIDATION_RULES.DESCRIPTION_MAX_LENGTH) {
    errors.push(`Description must be ${VALIDATION_RULES.DESCRIPTION_MAX_LENGTH} characters or less (current: ${description.length})`);
  }

  // Category validation
  if (!taskData.categoryId || typeof taskData.categoryId !== 'string') {
    errors.push('Valid category is required');
  }

  // Priority validation
  if (!VALIDATION_RULES.VALID_PRIORITIES.includes(taskData.priority)) {
    errors.push(`Priority must be one of: ${VALIDATION_RULES.VALID_PRIORITIES.join(', ')}`);
  }

  // Status validation
  if (!VALIDATION_RULES.VALID_STATUSES.includes(taskData.status)) {
    errors.push(`Status must be one of: ${VALIDATION_RULES.VALID_STATUSES.join(', ')}`);
  }

  // Due date validation with comprehensive checks
  if (taskData.dueDate) {
    const dueDateValidation = validateDueDate(taskData.dueDate);
    if (!dueDateValidation.isValid) {
      errors.push(...dueDateValidation.errors);
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Validates due date specifically
 * @param {string} dueDateString - Due date string in YYYY-MM-DD format
 * @returns {Object} Validation result
 */
function validateDueDate(dueDateString) {
  const errors = [];

  if (typeof dueDateString !== 'string') {
    errors.push('Due date must be a string');
    return { isValid: false, errors };
  }

  const dueDate = new Date(dueDateString);
  if (isNaN(dueDate.getTime())) {
    errors.push('Due date must be a valid date in YYYY-MM-DD format');
    return { isValid: false, errors };
  }

  // Check if date is in the past (ignoring time)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDateOnly = new Date(dueDate);
  dueDateOnly.setHours(0, 0, 0, 0);

  if (dueDateOnly < today) {
    errors.push('Due date cannot be in the past');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

if (typeof window !== 'undefined') {
  window.validateTask = validateTask;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    validateTask
  };
}