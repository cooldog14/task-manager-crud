const { defineFeature, loadFeature } = require('jest-cucumber');
const feature = loadFeature('./features/due_date_utilities.feature');
const dateUtils = require('../../js/dateUtils'); 

defineFeature(feature, test => {
    let testDate;
    let result;

    const mockToday = new Date('2025-12-09');
    
    beforeAll(() => {
        jest.useFakeTimers().setSystemTime(mockToday);
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    const givenCurrentDate = (given) => {
        given('the current date is known', () => {
        });
    };

    test('Check if task is overdue', ({ given, when, then }) => {
        givenCurrentDate(given);
        given('a task with a due date in the past', () => { testDate = '2025-12-08'; });
        when("I check if it's overdue", () => { result = dateUtils.isOverdue(testDate); });
        then('it should be marked as overdue', () => { expect(result).toBe(true); });
    });

    test('Check if task is due today', ({ given, when, then }) => {
        givenCurrentDate(given);
        given("a task with today's due date", () => { testDate = '2025-12-09'; });
        when("I check if it's due today", () => { result = dateUtils.isDueToday(testDate); });
        then('it should be marked as due today', () => { expect(result).toBe(true); });
    });

    test('Check if task is due this week', ({ given, when, then }) => {
        givenCurrentDate(given);
        given('a task with a due date within the current week', () => { testDate = '2025-12-13'; });
        when("I check if it's due this week", () => { result = dateUtils.isDueThisWeek(testDate); });
        then('it should be marked as due this week', () => { expect(result).toBe(true); });
    });

    test('Calculate days until due for future dates', ({ given, when, then }) => {
        givenCurrentDate(given);
        given('a task due in 3 days', () => { testDate = '2025-12-12'; });
        when('I calculate days until due', () => { result = dateUtils.daysUntilDue(testDate); });
        then('it should return 3', () => { expect(result).toBe(3); });
    });

    test('Calculate days until due for past dates', ({ given, when, then }) => {
        givenCurrentDate(given);
        given('a task that was due 2 days ago', () => { testDate = '2025-12-07'; });
        when('I calculate days until due', () => { result = dateUtils.daysUntilDue(testDate); });
        then('it should return -2', () => { expect(result).toBe(-2); });
    });

    test('Format due date as "Due Today"', ({ given, when, then }) => {
        givenCurrentDate(given);
        given('a task due today', () => { testDate = '2025-12-09'; });
        when('I format the due date for display', () => { result = dateUtils.formatDueDate(testDate); });
        then('it should display as "Due Today"', () => { expect(result).toBe('Due Today'); });
    });

    test('Format due date as "Due Tomorrow"', ({ given, when, then }) => {
        givenCurrentDate(given);
        given('a task due tomorrow', () => { testDate = '2025-12-10'; });
        when('I format the due date for display', () => { result = dateUtils.formatDueDate(testDate); });
        then('it should display as "Due Tomorrow"', () => { expect(result).toBe('Due Tomorrow'); });
    });

    test('Format overdue date', ({ given, when, then, and }) => {
        givenCurrentDate(given);
        given('a task with a past due date', () => { testDate = '2025-12-08'; });
        when('I format the due date for display', () => { result = dateUtils.formatDueDate(testDate); });
        then(/^it should display as "(.*)"$/, (msg) => { expect(result).toBe(msg); });
    });

    test('Format future due date', ({ given, when, then }) => {
        givenCurrentDate(given);
        given(/^a task due on (.*)$/, (dateStr) => { testDate = '2025-12-25'; });
        when('I format the due date for display', () => { result = dateUtils.formatDueDate(testDate); });
        then(/^it should display as "(.*)"$/, (msg) => { expect(result).toBe(msg); });
    });

    test('Get overdue status for styling', ({ given, when, then }) => {
        givenCurrentDate(given);
        given('a task with a past due date', () => { testDate = '2025-12-08'; });
        when('I get the due date status', () => { result = dateUtils.getDueDateStatus(testDate); });
        then(/^it should return "(.*)"$/, (status) => { expect(result).toBe(status); });
    });

    test('Get due today status for styling', ({ given, when, then }) => {
        givenCurrentDate(given);
        given('a task due today', () => { testDate = '2025-12-09'; });
        when('I get the due date status', () => { result = dateUtils.getDueDateStatus(testDate); });
        then(/^it should return "(.*)"$/, (status) => { expect(result).toBe(status); });
    });

    test('Get due tomorrow status for styling', ({ given, when, then }) => {
        givenCurrentDate(given);
        given('a task due tomorrow', () => { testDate = '2025-12-10'; });
        when('I get the due date status', () => { result = dateUtils.getDueDateStatus(testDate); });
        then(/^it should return "(.*)"$/, (status) => { expect(result).toBe(status); });
    });

    test('Get due this week status for styling', ({ given, when, then }) => {
        givenCurrentDate(given);
        given('a task due this week', () => { testDate = '2025-12-13'; });
        when('I get the due date status', () => { result = dateUtils.getDueDateStatus(testDate); });
        then(/^it should return "(.*)"$/, (status) => { expect(result).toBe(status); });
    });

    test('Get due future status for styling', ({ given, when, then }) => {
        givenCurrentDate(given);
        given('a task due in the future', () => { testDate = '2025-12-20'; });
        when('I get the due date status', () => { result = dateUtils.getDueDateStatus(testDate); });
        then(/^it should return "(.*)"$/, (status) => { expect(result).toBe(status); });
    });

    test('Handle tasks with no due date', ({ given, when, then }) => {
        givenCurrentDate(given);
        given('a task with no due date', () => { testDate = null; });
        when('I format the due date', () => { result = dateUtils.formatDueDate(testDate); });
        then(/^it should display as "(.*)"$/, (msg) => { expect(result).toBe(msg); });
    });

    test('Handle invalid due dates', ({ given, when, then }) => {
        givenCurrentDate(given);
        given('a task with an invalid due date', () => { testDate = 'invalid'; });
        when('I format the due date', () => { result = dateUtils.formatDueDate(testDate); });
        then(/^it should display as "(.*)"$/, (msg) => { expect(result).toBe(msg); });
    });
});