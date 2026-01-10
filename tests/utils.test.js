const utils = require('../js/utils');

describe('Utils', () => {
    describe('generateId', () => {
        it('should generate a unique string id', () => {
            const id1 = utils.generateId();
            const id2 = utils.generateId();
            expect(typeof id1).toBe('string');
            expect(id1).not.toBe(id2);
        });
    });

    describe('formatDate', () => {
        it('should format a valid date string', () => {
            expect(utils.formatDate('2023-01-01')).toMatch(/Jan/);
        });
        it('should return fallback for empty input', () => {
            expect(utils.formatDate('')).toBe('No due date');
        });
    });

    describe('isOverdue', () => {
        it('should return true for past date', () => {
            expect(utils.isOverdue('2000-01-01')).toBe(true);
        });
        it('should return false for future date', () => {
            const future = new Date(Date.now() + 86400000).toISOString().slice(0,10);
            expect(utils.isOverdue(future)).toBe(false);
        });
        it('should return false for empty', () => {
            expect(utils.isOverdue('')).toBe(false);
        });
    });

    describe('isDueSoon', () => {
        it('should return true for today', () => {
            const today = new Date();
            const iso = today.toISOString().slice(0,10);
            expect(utils.isDueSoon(iso)).toBe(true);
        });
        it('should return true for 3 days from now', () => {
            const soon = new Date(Date.now() + 3*86400000).toISOString().slice(0,10);
            expect(utils.isDueSoon(soon)).toBe(true);
        });
        it('should return false for 4 days from now', () => {
            const notSoon = new Date(Date.now() + 4*86400000).toISOString().slice(0,10);
            expect(utils.isDueSoon(notSoon)).toBe(false);
        });
        it('should return false for empty', () => {
            expect(utils.isDueSoon('')).toBe(false);
        });
    });

    describe('getPriorityClass', () => {
        it('should return correct class', () => {
            expect(utils.getPriorityClass('high')).toBe('high');
            expect(utils.getPriorityClass('medium')).toBe('medium');
            expect(utils.getPriorityClass('low')).toBe('low');
            expect(utils.getPriorityClass('other')).toBe('medium');
        });
    });

    describe('getStatusClass', () => {
        it('should return correct class', () => {
            expect(utils.getStatusClass('pending')).toBe('pending');
            expect(utils.getStatusClass('in-progress')).toBe('in-progress');
            expect(utils.getStatusClass('completed')).toBe('completed');
            expect(utils.getStatusClass('other')).toBe('pending');
        });
    });

    describe('getDueDateClass', () => {
        it('should return overdue, due-soon, or on-time', () => {
            expect(utils.getDueDateClass('2000-01-01')).toBe('overdue');
            const soon = new Date(Date.now() + 2*86400000).toISOString().slice(0,10);
            expect(utils.getDueDateClass(soon)).toBe('due-soon');
            const far = new Date(Date.now() + 10*86400000).toISOString().slice(0,10);
            expect(utils.getDueDateClass(far)).toBe('on-time');
            expect(utils.getDueDateClass('')).toBe('on-time');
        });
    });

    describe('capitalize', () => {
        it('should capitalize first letter', () => {
            expect(utils.capitalize('test')).toBe('Test');
        });
    });

    describe('statusToText', () => {
        it('should convert status to text', () => {
            expect(utils.statusToText('pending')).toBe('Pending');
            expect(utils.statusToText('in-progress')).toBe('In Progress');
            expect(utils.statusToText('completed')).toBe('Completed');
            expect(utils.statusToText('other')).toBe('Pending');
        });
    });

    describe('priorityToText', () => {
        it('should convert priority to text', () => {
            expect(utils.priorityToText('high')).toBe('High');
            expect(utils.priorityToText('medium')).toBe('Medium');
            expect(utils.priorityToText('low')).toBe('Low');
            expect(utils.priorityToText('other')).toBe('Medium');
        });
    });

    describe('isValidEmail', () => {
        it('should validate email', () => {
            expect(utils.isValidEmail('test@example.com')).toBe(true);
            expect(utils.isValidEmail('bademail')).toBe(false);
        });
    });

    describe('debounce', () => {
        it('should debounce function calls', (done) => {
            let count = 0;
            const debounced = utils.debounce(() => { count++; }, 50);
            debounced();
            debounced();
            setTimeout(() => {
                expect(count).toBe(1);
                done();
            }, 100);
        });
    });

    describe('sortTasks', () => {
        const tasks = [
            { createdAt: '2023-01-01', dueDate: '2023-01-10', priority: 'high', status: 'pending', title: 'B' },
            { createdAt: '2023-01-02', dueDate: '2023-01-09', priority: 'low', status: 'completed', title: 'A' },
        ];
        it('should sort by created-desc', () => {
            const sorted = utils.sortTasks(tasks, 'created-desc');
            expect(sorted[0].createdAt).toBe('2023-01-02');
        });
        it('should sort by created-asc', () => {
            const sorted = utils.sortTasks(tasks, 'created-asc');
            expect(sorted[0].createdAt).toBe('2023-01-01');
        });
        it('should sort by due-desc', () => {
            const sorted = utils.sortTasks(tasks, 'due-desc');
            expect(sorted[0].dueDate).toBe('2023-01-10');
        });
        it('should sort by due-asc', () => {
            const sorted = utils.sortTasks(tasks, 'due-asc');
            expect(sorted[0].dueDate).toBe('2023-01-09');
        });
        it('should sort by priority-desc', () => {
            const sorted = utils.sortTasks(tasks, 'priority-desc');
            expect(sorted[0].priority).toBe('high');
        });
        it('should sort by priority-asc', () => {
            const sorted = utils.sortTasks(tasks, 'priority-asc');
            expect(sorted[0].priority).toBe('low');
        });
        it('should sort by status-desc', () => {
            const sorted = utils.sortTasks(tasks, 'status-desc');
            expect(sorted[0].status).toBe('completed');
        });
        it('should sort by status-asc', () => {
            const sorted = utils.sortTasks(tasks, 'status-asc');
            expect(sorted[0].status).toBe('pending');
        });
    });
});
