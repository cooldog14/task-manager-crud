/**
 * Advanced Task Filtering Logic
 * Provides complex filtering capabilities with configurable AND/OR logic
 */

// Filter operators
const FILTER_OPERATORS = {
  AND: 'AND',
  OR: 'OR'
};

/**
 * Filters tasks using advanced criteria with support for AND/OR logic
 * @param {Array} tasks - Array of task objects to filter
 * @param {Object} filters - Filter criteria object
 * @param {string[]} [filters.categories] - Array of category IDs to include
 * @param {string[]} [filters.priorities] - Array of priority levels to include
 * @param {string[]} [filters.statuses] - Array of status values to include
 * @param {string} [filters.searchTerm] - Search term for title/description
 * @param {boolean} [filters.overdue] - Include overdue tasks
 * @param {boolean} [filters.dueToday] - Include tasks due today
 * @param {boolean} [filters.dueThisWeek] - Include tasks due this week
 * @param {string} [filters.operator='AND'] - Logic operator ('AND' or 'OR')
 * @returns {Array} Filtered array of tasks
 */
function filterTasksAdvanced(tasks, filters = {}) {
  // Input validation
  if (!Array.isArray(tasks)) {
    console.warn('filterTasksAdvanced: tasks parameter must be an array');
    return [];
  }

  // Return all tasks if no filters specified
  if (!filters || Object.keys(filters).length === 0) {
    return [...tasks];
  }

  // Validate operator
  const operator = filters.operator || FILTER_OPERATORS.AND;
  if (![FILTER_OPERATORS.AND, FILTER_OPERATORS.OR].includes(operator)) {
    console.warn(`filterTasksAdvanced: invalid operator '${operator}', defaulting to AND`);
    filters.operator = FILTER_OPERATORS.AND;
  }

  return tasks.filter(task => matchesAdvancedFilters(task, filters));
}

/**
 * Checks if a single task matches the advanced filter criteria
 * @param {Object} task - Task object to evaluate
 * @param {Object} filters - Filter criteria (same as filterTasksAdvanced)
 * @returns {boolean} Whether the task matches all filter criteria
 */
function matchesAdvancedFilters(task, filters) {
  // Early validation
  if (!task || typeof task !== 'object') {
    return false;
  }

  const { operator = FILTER_OPERATORS.AND } = filters;
  const criteriaResults = [];

  // Category filtering
  if (filters.categories && Array.isArray(filters.categories) && filters.categories.length > 0) {
    criteriaResults.push(filters.categories.includes(task.categoryId));
  }

  // Priority filtering
  if (filters.priorities && Array.isArray(filters.priorities) && filters.priorities.length > 0) {
    criteriaResults.push(filters.priorities.includes(task.priority));
  }

  // Status filtering
  if (filters.statuses && Array.isArray(filters.statuses) && filters.statuses.length > 0) {
    criteriaResults.push(filters.statuses.includes(task.status));
  }

  // Text search filtering
  if (filters.searchTerm && typeof filters.searchTerm === 'string') {
    const searchLower = filters.searchTerm.toLowerCase().trim();
    if (searchLower) {
      const titleMatch = task.title && task.title.toLowerCase().includes(searchLower);
      const descriptionMatch = task.description && task.description.toLowerCase().includes(searchLower);
      criteriaResults.push(titleMatch || descriptionMatch);
    }
  }

  // Date-based filters (OR logic within date filters)
  const dateCriteria = [];
  if (filters.overdue === true) {
    dateCriteria.push(isOverdue(task.dueDate));
  }
  if (filters.dueToday === true) {
    dateCriteria.push(isDueToday(task.dueDate));
  }
  if (filters.dueThisWeek === true) {
    dateCriteria.push(isDueThisWeek(task.dueDate));
  }

  // If any date filters specified, at least one must match
  if (dateCriteria.length > 0) {
    criteriaResults.push(dateCriteria.some(result => result));
  }

  // Return true if no criteria specified (matches everything)
  if (criteriaResults.length === 0) {
    return true;
  }

  // Apply the specified logical operator
  return operator === FILTER_OPERATORS.OR
    ? criteriaResults.some(result => result)
    : criteriaResults.every(result => result);
}

/**
 * Checks if a due date is overdue
 * @param {string} dueDate - Due date string
 * @returns {boolean} Whether the date is overdue
 */
function isOverdue(dueDate) {
  if (!dueDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  return due < today;
}

/**
 * Checks if a due date is today
 * @param {string} dueDate - Due date string
 * @returns {boolean} Whether the date is today
 */
function isDueToday(dueDate) {
  if (!dueDate) return false;

  const today = new Date().toISOString().split('T')[0];
  return dueDate === today;
}

/**
 * Checks if a due date is within this week
 * @param {string} dueDate - Due date string
 * @returns {boolean} Whether the date is this week
 */
function isDueThisWeek(dueDate) {
  if (!dueDate) return false;

  const today = new Date();
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + (6 - today.getDay())); // End of current week (Saturday)

  const due = new Date(dueDate);
  return due >= today && due <= endOfWeek;
}

if (typeof window !== 'undefined') {
  window.filterTasksAdvanced = filterTasksAdvanced;
  window.matchesAdvancedFilters = matchesAdvancedFilters;
  // We can attach others if needed, but filterTasksAdvanced is the main one used by TaskManager
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    filterTasksAdvanced,
    matchesAdvancedFilters,
    isOverdue,
    isDueToday,
    isDueThisWeek
  };
}