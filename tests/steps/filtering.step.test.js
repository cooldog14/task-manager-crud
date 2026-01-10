const { defineFeature, loadFeature } = require('jest-cucumber');
const feature = loadFeature('./features/advanced_filtering.feature');
const advancedFilters = require('../../js/advancedFilters');

defineFeature(feature, test => {
    let tasks = [];
    let filteredTasks = [];

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0];

    const givenCollection = (given) => {
        given('I have a collection of tasks with various properties', () => {
            tasks = [
                { id: 1, title: 'Project Alpha', categoryId: 'Work', priority: 'high', status: 'pending', dueDate: yesterday, description: 'Urgent stuff' },
                { id: 2, title: 'Buy milk', categoryId: 'Personal', priority: 'medium', status: 'pending', dueDate: today, description: 'Grocery' },
                { id: 3, title: 'Project Beta', categoryId: 'Work', priority: 'low', status: 'completed', dueDate: nextWeek },
                { id: 4, title: 'Gym', categoryId: 'Personal', priority: 'high', status: 'completed', dueDate: today }
            ];
        });
    };

    test('Filter tasks by multiple priorities with AND logic', ({ given, when, then }) => {
        givenCollection(given);
        given('I have tasks with different priority levels', () => {});
        when('I filter by high AND medium priority', () => {
            filteredTasks = advancedFilters.filterTasksAdvanced(tasks, { priorities: ['high', 'medium'] });
        });
        then('only tasks with high or medium priority should be returned', () => {
            expect(filteredTasks.every(t => ['high', 'medium'].includes(t.priority))).toBe(true);
            expect(filteredTasks).toHaveLength(3);
        });
    });

    test('Filter tasks by category and status combination', ({ given, when, then }) => {
        givenCollection(given);
        given('I have tasks in different categories and statuses', () => {});
        when(/^I filter by "(.*)" category AND "(.*)" status$/, (cat, stat) => {
            filteredTasks = advancedFilters.filterTasksAdvanced(tasks, { 
                categories: [cat], 
                statuses: [stat] 
            });
        });
        then('only pending work tasks should be returned', () => {
            expect(filteredTasks.every(t => t.categoryId === 'Work' && t.status === 'pending')).toBe(true);
        });
    });

    test('Filter overdue tasks', ({ given, when, then }) => {
        givenCollection(given);
        given('I have tasks with due dates in the past', () => {});
        when('I apply the overdue filter', () => {
            filteredTasks = advancedFilters.filterTasksAdvanced(tasks, { overdue: true });
        });
        then('only tasks past their due date should be returned', () => {
            expect(filteredTasks.every(t => t.dueDate < today)).toBe(true);
        });
    });

    test('Filter tasks due today', ({ given, when, then }) => {
        givenCollection(given);
        given('I have tasks with today\'s due date', () => {});
        when('I apply the due today filter', () => {
            filteredTasks = advancedFilters.filterTasksAdvanced(tasks, { dueToday: true });
        });
        then('only tasks due today should be returned', () => {
            expect(filteredTasks.every(t => t.dueDate === today)).toBe(true);
        });
    });

    test('Filter tasks due this week', ({ given, when, then }) => {
        givenCollection(given);
        given('I have tasks with due dates within the current week', () => {});
        when('I apply the due this week filter', () => {
            filteredTasks = advancedFilters.filterTasksAdvanced(tasks, { dueThisWeek: true });
        });
        then('only tasks due this week should be returned', () => {
            expect(filteredTasks.length).toBeGreaterThan(0);
        });
    });

    test('Combine multiple filter criteria with AND logic', ({ given, when, then }) => {
        givenCollection(given);
        given('I have tasks with various properties', () => {});
        when('I filter by work category AND high priority AND pending status', () => {
            filteredTasks = advancedFilters.filterTasksAdvanced(tasks, { 
                categories: ['Work'], 
                priorities: ['high'], 
                statuses: ['pending'] 
            });
        });
        then('only high priority pending work tasks should be returned', () => {
            expect(filteredTasks.every(t => t.categoryId === 'Work' && t.priority === 'high' && t.status === 'pending')).toBe(true);
        });
    });

    test('Use OR logic for multiple criteria', ({ given, when, then }) => {
        givenCollection(given);
        given('I have tasks in different categories', () => {});
        when('I filter by work OR personal category', () => {
            filteredTasks = advancedFilters.filterTasksAdvanced(tasks, { 
                categories: ['Work', 'Personal'],
                operator: 'OR'
            });
        });
        then('tasks from both work and personal categories should be returned', () => {
            expect(filteredTasks.length).toBe(tasks.length);
        });
    });

    test('Search tasks by text', ({ given, when, then }) => {
        givenCollection(given);
        given('I have tasks with different titles and descriptions', () => {});
        when(/^I search for "(.*)"$/, (query) => {
            filteredTasks = advancedFilters.filterTasksAdvanced(tasks, { searchTerm: query });
        });
        then(/^only tasks containing "(.*)" in title or description should be returned$/, (query) => {
            const q = query.toLowerCase();
            expect(filteredTasks.every(t => 
                t.title.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q))
            )).toBe(true);
        });
    });

    test('Combine search with other filters', ({ given, when, then }) => {
        givenCollection(given);
        given('I have tasks with various properties', () => {});
        when(/^I search for "(.*)" AND filter by high priority$/, (query) => {
            filteredTasks = advancedFilters.filterTasksAdvanced(tasks, { 
                searchTerm: query, 
                priorities: ['high'] 
            });
        });
        then(/^only high priority tasks containing "(.*)" should be returned$/, (query) => {
            expect(filteredTasks.every(t => t.priority === 'high' && t.title.toLowerCase().includes(query.toLowerCase()))).toBe(true);
        });
    });

    test('No filters applied returns all tasks', ({ given, when, then }) => {
        givenCollection(given);
        given('I have a collection of tasks', () => {});
        when('I apply no filters', () => {
            filteredTasks = advancedFilters.filterTasksAdvanced(tasks, {});
        });
        then('all tasks should be returned', () => {
            expect(filteredTasks).toHaveLength(tasks.length);
        });
    });
});