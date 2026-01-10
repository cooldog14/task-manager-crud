const { defineFeature, loadFeature } = require('jest-cucumber');
const feature = loadFeature('./features/task_validation.feature');
const { validateTask } = require('../../js/validators');

defineFeature(feature, test => {
    let taskData;
    let result;

    const getValidTask = () => ({
        title: 'Tâche Test',
        categoryId: 'cat-1',
        priority: 'medium',
        status: 'pending'
    });

    const givenInitialized = (given) => {
        given('the task validation system is initialized', () => {
        });
    };

    const whenIValidate = (when) => {
        when('I validate the task', () => {
            result = validateTask(taskData);
        });
    };

    test('Valid task data passes validation', ({ given, when, then }) => {
        givenInitialized(given);
        given('I have valid task data with all required fields', () => {
            taskData = getValidTask();
        });
        whenIValidate(when);
        then('validation should pass with no errors', () => {
            expect(result.isValid).toBe(true);
        });
    });

    test('Task with empty title fails validation', ({ given, when, then, and }) => {
        givenInitialized(given);
        given('I have task data with an empty title', () => {
            taskData = getValidTask();
            taskData.title = '';
        });
        whenIValidate(when);
        then('validation should fail', () => expect(result.isValid).toBe(false));
        and(/^the error should mention "(.*)"$/, (msg) => {
            expect(result.errors.some(e => e.includes(msg))).toBe(true);
        });
    });

    test('Task with title too long fails validation', ({ given, when, then, and }) => {
        givenInitialized(given);
        given('I have task data with a title longer than 100 characters', () => {
            taskData = getValidTask();
            taskData.title = 'a'.repeat(101);
        });
        whenIValidate(when);
        then('validation should fail', () => expect(result.isValid).toBe(false));
        and(/^the error should mention "(.*)"$/, (msg) => {
            expect(result.errors.some(e => e.includes(msg))).toBe(true);
        });
    });

    test('Task with description too long fails validation', ({ given, when, then, and }) => {
        givenInitialized(given);
        given(/^I have task data with a description longer than (\d+) characters$/, (length) => {
            taskData = getValidTask();
            taskData.description = 'a'.repeat(parseInt(length) + 1);
        });
        whenIValidate(when);
        then('validation should fail', () => expect(result.isValid).toBe(false));
        and(/^the error should mention "(.*)"$/, (msg) => {
            expect(result.errors.some(e => e.includes(msg))).toBe(true);
        });
    });

    test('Task with invalid priority fails validation', ({ given, when, then, and }) => {
        givenInitialized(given);
        given('I have task data with an invalid priority value', () => {
            taskData = getValidTask();
            taskData.priority = 'invalid';
        });
        whenIValidate(when);
        then('validation should fail', () => expect(result.isValid).toBe(false));
        and('the error should mention valid priority options', () => {
            expect(result.errors.some(e => e.includes('Priority'))).toBe(true);
        });
    });

    test('Task with invalid status fails validation', ({ given, when, then, and }) => {
        givenInitialized(given);
        given('I have task data with an invalid status value', () => {
            taskData = getValidTask();
            taskData.status = 'invalid';
        });
        whenIValidate(when);
        then('validation should fail', () => expect(result.isValid).toBe(false));
        and('the error should mention valid status options', () => {
            expect(result.errors.some(e => e.includes('Status'))).toBe(true);
        });
    });

    test('Task with invalid due date fails validation', ({ given, when, then, and }) => {
        givenInitialized(given);
        given('I have task data with an invalid due date format', () => {
            taskData = getValidTask();
            taskData.dueDate = 'format-invalide';
        });
        whenIValidate(when);
        then('validation should fail', () => expect(result.isValid).toBe(false));
        and(/^the error should mention "(.*)"$/, (msg) => {
            expect(result.errors.some(e => e.includes(msg))).toBe(true);
        });
    });

    test('Task with past due date fails validation', ({ given, when, then, and }) => {
        givenInitialized(given);
        given('I have task data with a due date in the past', () => {
            taskData = getValidTask();
            taskData.dueDate = '2020-01-01';
        });
        whenIValidate(when);
        then('validation should fail', () => expect(result.isValid).toBe(false));
        and(/^the error should mention "(.*)"$/, (msg) => {
            expect(result.errors.some(e => e.includes(msg))).toBe(true);
        });
    });

    test('Task with multiple validation errors', ({ given, when, then, and }) => {
        givenInitialized(given);
        given('I have task data with multiple invalid fields', () => {
            taskData = { title: '', priority: 'invalid' };
        });
        whenIValidate(when);
        then('validation should fail', () => expect(result.isValid).toBe(false));
        and('multiple error messages should be returned', () => {
            expect(result.errors.length).toBeGreaterThan(1);
        });
    });
});