let utils;
beforeAll(() => {
  global.window = global.window || {};
  utils = require('../js/utils');
  if (global.window && !global.window.utils) {
    global.window.utils = utils;
  }
});

describe('utils.js', () => {
  test('generateId returns a string', () => {
    const fn = utils.generateId || (global.window.utils && global.window.utils.generateId);
    expect(typeof fn()).toBe('string');
  });

  test('formatDate returns formatted date', () => {
    const fn = utils.formatDate || (global.window.utils && global.window.utils.formatDate);
    expect(fn('2022-01-01')).toMatch(/2022/);
    expect(fn()).toBe('No due date');
  });

  test('isOverdue returns correct boolean', () => {
    const fn = utils.isOverdue || (global.window.utils && global.window.utils.isOverdue);
    expect(fn('1900-01-01')).toBe(true);
    expect(fn('2999-01-01')).toBe(false);
    expect(fn()).toBe(false);
  });

  test('isDueSoon returns correct boolean', () => {
    const fn = utils.isDueSoon || (global.window.utils && global.window.utils.isDueSoon);
    const today = new Date();
    const soon = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString();
    expect(fn(soon)).toBe(true);
    expect(fn('2999-01-01')).toBe(false);
    expect(fn()).toBe(false);
  });

  test('getPriorityClass returns correct class', () => {
    const fn = utils.getPriorityClass || (global.window.utils && global.window.utils.getPriorityClass);
    expect(fn('high')).toBe('high');
    expect(fn('medium')).toBe('medium');
    expect(fn('low')).toBe('low');
    expect(fn('other')).toBe('medium');
  });

  test('getStatusClass returns correct class', () => {
    const fn = utils.getStatusClass || (global.window.utils && global.window.utils.getStatusClass);
    expect(fn('pending')).toBe('pending');
    expect(fn('in-progress')).toBe('in-progress');
    expect(fn('completed')).toBe('completed');
    expect(fn('other')).toBe('pending');
  });

  test('getDueDateClass returns correct class', () => {
    const fn = utils.getDueDateClass || (global.window.utils && global.window.utils.getDueDateClass);
    expect(fn('1900-01-01')).toBe('overdue');
    expect(fn()).toBe('on-time');
  });

  test('capitalize returns capitalized string', () => {
    const fn = utils.capitalize || (global.window.utils && global.window.utils.capitalize);
    expect(fn('test')).toBe('Test');
  });

  test('statusToText returns correct text', () => {
    const fn = utils.statusToText || (global.window.utils && global.window.utils.statusToText);
    expect(fn('pending')).toBe('Pending');
    expect(fn('in-progress')).toBe('In Progress');
    expect(fn('completed')).toBe('Completed');
    expect(fn('other')).toBe('Pending');
  });

  test('priorityToText returns correct text', () => {
    const fn = utils.priorityToText || (global.window.utils && global.window.utils.priorityToText);
    expect(fn('high')).toBe('High');
    expect(fn('medium')).toBe('Medium');
    expect(fn('low')).toBe('Low');
    expect(fn('other')).toBe('Medium');
  });

  test('isValidEmail validates email', () => {
    const fn = utils.isValidEmail || (global.window.utils && global.window.utils.isValidEmail);
    expect(fn('test@example.com')).toBe(true);
    expect(fn('bad-email')).toBe(false);
  });

  test('debounce returns a function', () => {
    const fn = utils.debounce || (global.window.utils && global.window.utils.debounce);
    const debounced = fn(() => {}, 10);
    expect(typeof debounced).toBe('function');
  });

  test('sortTasks sorts by created-desc', () => {
    const fn = utils.sortTasks || (global.window.utils && global.window.utils.sortTasks);
    const tasks = [
      { id: 1, createdAt: '2022-01-01', dueDate: '2022-01-02', priority: 'high', status: 'pending' },
      { id: 2, createdAt: '2022-01-02', dueDate: '2022-01-01', priority: 'low', status: 'completed' },
    ];
    expect(Array.isArray(fn(tasks, 'created-desc'))).toBe(true);
    expect(fn(tasks, 'created-desc')[0].id).toBe(2);
    expect(fn(tasks, 'created-asc')[0].id).toBe(1);
    expect(fn(tasks, 'due-desc')[0].id).toBe(1);
    expect(fn(tasks, 'due-asc')[0].id).toBe(2);
    expect(fn(tasks, 'priority-desc')[0].priority).toBe('high');
    expect(fn(tasks, 'priority-asc')[0].priority).toBe('low');
    expect(fn(tasks, 'status-desc')[0].status).toBe('completed');
    expect(fn(tasks, 'status-asc')[0].status).toBe('pending');
  });
});