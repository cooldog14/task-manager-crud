/**
 * Task Manager - Handles all task-related operations
 */

let validateTask, filterTasksAdvanced;

// Environment detection
const isBrowser = typeof window !== 'undefined';
const isNode = !isBrowser && typeof module !== 'undefined' && typeof require !== 'undefined';

if (isNode) {
    validateTask = require('./validators').validateTask;
    filterTasksAdvanced = require('./advancedFilters').filterTasksAdvanced;
} else {
    // Browser environment
    validateTask = window.validateTask;
    filterTasksAdvanced = window.filterTasksAdvanced;
}

class TaskManager {
    constructor() {
        this.tasks = [];
        this.filteredTasks = [];
        this.currentFilters = {
            search: '',
            categories: [],
            priorities: [],
            statuses: [],
            overdue: false,
            today: false,
            week: false
        };
        this.currentSort = 'created-desc';
        // Don't loadTasks() in constructor - wait for init() to be called after all dependencies are ready
        // Don't bind events in constructor - wait for init() to be called after DOM is ready
    }

    // Load tasks from storage
    loadTasks() {
        // Defensive: ensure storage is available (tests may not set it)
        this.tasks = (window.TaskManagerStorage && typeof window.TaskManagerStorage.getTasks === 'function')
            ? window.TaskManagerStorage.getTasks()
            : [];
        this.applyFiltersAndSort();
    }

    // Save tasks to storage
    saveTasks() {
        window.TaskManagerStorage.saveTasks(this.tasks);
    }

    // Get all tasks
    getTasks() {
        return [...this.tasks];
    }

    // Get filtered tasks
    getFilteredTasks() {
        return [...this.filteredTasks];
    }

    // Add new task
    addTask(taskData) {
        const task = {
            id: window.TaskManagerUtils.generateId(),
            title: taskData.title.trim(),
            description: taskData.description ? taskData.description.trim() : '',
            categoryId: taskData.categoryId,
            priority: taskData.priority || 'medium',
            status: taskData.status || 'pending',
            dueDate: taskData.dueDate || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.tasks.push(task);
        this.saveTasks();
        this.applyFiltersAndSort();
        return task;
    }

    // Update task
    updateTask(id, taskData) {
        const index = this.tasks.findIndex(task => task.id === id);
        if (index === -1) {
            throw new Error('Task not found');
        }

        const updatedTask = {
            ...this.tasks[index],
            ...taskData,
            title: taskData.title ? taskData.title.trim() : this.tasks[index].title,
            description: taskData.description !== undefined ? (taskData.description ? taskData.description.trim() : '') : this.tasks[index].description,
            updatedAt: new Date().toISOString()
        };

        this.tasks[index] = updatedTask;
        this.saveTasks();
        this.applyFiltersAndSort();
        return updatedTask;
    }

    // Delete task
    deleteTask(id) {
        const index = this.tasks.findIndex(task => task.id === id);
        if (index === -1) {
            throw new Error('Task not found');
        }

        this.tasks.splice(index, 1);
        this.saveTasks();
        this.applyFiltersAndSort();
        return true;
    }

    // Toggle task status
    toggleTaskStatus(id) {
        const task = this.tasks.find(task => task.id === id);
        if (!task) return false;

        const statusOrder = ['pending', 'in-progress', 'completed'];
        const currentIndex = statusOrder.indexOf(task.status);
        const nextIndex = (currentIndex + 1) % statusOrder.length;

        return this.updateTask(id, { status: statusOrder[nextIndex] });
    }

    // Get task by ID
    getTaskById(id) {
        return this.tasks.find(task => task.id === id);
    }

    // Apply filters and sorting
    applyFiltersAndSort() {
        const advancedFilters = {
            searchTerm: this.currentFilters.search,
            categories: this.currentFilters.categories,
            priorities: this.currentFilters.priorities,
            statuses: this.currentFilters.statuses,
            overdue: this.currentFilters.overdue,
            dueToday: this.currentFilters.today,
            dueThisWeek: this.currentFilters.week
            // No explicit operator set here, filterTasksAdvanced defaults to 'AND'
        };
        // Safety check for filterTasksAdvanced
        if (typeof filterTasksAdvanced === 'function') {
            let filtered = filterTasksAdvanced(this.tasks, advancedFilters);
            this.filteredTasks = window.TaskManagerUtils.sortTasks(filtered, this.currentSort);
        } else {
            // Fallback if advanced filters not loaded
            this.filteredTasks = [...this.tasks];
        }
        
        this.renderTasks();
        this.updateTaskCount();
    }

    // Set search filter
    setSearchFilter(searchTerm) {
        this.currentFilters.search = searchTerm;
        this.applyFiltersAndSort();
    }

    // Set category filters
    setCategoryFilters(categoryIds) {
        this.currentFilters.categories = categoryIds;
        this.applyFiltersAndSort();
    }

    // Set priority filters
    setPriorityFilters(priorities) {
        this.currentFilters.priorities = priorities;
        this.applyFiltersAndSort();
    }

    // Set status filters
    setStatusFilters(statuses) {
        this.currentFilters.statuses = statuses;
        this.applyFiltersAndSort();
    }

    // Set date filters
    setDateFilters(filters) {
        this.currentFilters.overdue = filters.overdue || false;
        this.currentFilters.today = filters.today || false;
        this.currentFilters.week = filters.week || false;
        this.applyFiltersAndSort();
    }

    // Set sorting
    setSorting(sortBy) {
        this.currentSort = sortBy;
        window.TaskManagerStorage.updateSetting('sortBy', sortBy);
        this.applyFiltersAndSort();
    }

    // Clear all filters
    clearFilters() {
        this.currentFilters = {
            search: '',
            categories: [],
            priorities: [],
            statuses: [],
            overdue: false,
            today: false,
            week: false
        };

        // Clear search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
        }

        // Clear checkboxes
        document.querySelectorAll('.category-filter, .priority-filter, .status-filter, .date-filter').forEach(checkbox => {
            checkbox.checked = false;
        });

        this.applyFiltersAndSort();
    }

    // Render tasks
    renderTasks() {
        try {
            const taskList = document.getElementById('taskList');
            const noTasks = document.getElementById('noTasks');

            if (!taskList || !noTasks) return;

            taskList.innerHTML = '';

            if (this.filteredTasks.length === 0) {
                noTasks.style.display = 'block';
                taskList.style.display = 'none';
                return;
            }

            noTasks.style.display = 'none';
            taskList.style.display = 'flex';

            this.filteredTasks.forEach(task => {
                const taskElement = this.createTaskElement(task);
                taskList.appendChild(taskElement);
            });

            // Re-bind events for the new task elements
            this.bindTaskEvents();
        } catch (error) {
            console.error('Error rendering tasks:', error);
            throw error; // Re-throw to be caught by initializeApp
        }
    }

    // Create task element
    createTaskElement(task) {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.status === 'completed' ? 'completed' : ''}`;
        taskElement.dataset.id = task.id;

        const category = window.categoryManager.getCategoryById(task.categoryId);
        const categoryName = category ? category.name : 'Unknown Category';
        const categoryColor = category ? category.color : '#6c757d';

        taskElement.innerHTML = `
            <div class="task-header-row">
                <div class="task-title-section">
                    <h3 class="task-title">${task.title}</h3>
                    <span class="task-category" style="background-color: ${categoryColor}">${categoryName}</span>
                </div>
                <div class="task-actions">
                    <button class="toggle-status-btn" data-id="${task.id}" title="Toggle status">
                        ${task.status === 'completed' ? '↩️' : '✅'}
                    </button>
                    <button class="edit-task-btn" data-id="${task.id}" title="Edit task">✏️</button>
                    <button class="delete-task-btn" data-id="${task.id}" title="Delete task">🗑️</button>
                </div>
            </div>

            ${task.description ? `<p class="task-description">${task.description}</p>` : ''}

            <div class="task-meta">
                <div class="task-details">
                    <span class="task-priority priority-${window.TaskManagerUtils.getPriorityClass(task.priority)}">
                        ${window.TaskManagerUtils.priorityToText(task.priority)}
                    </span>
                    <span class="task-status status-${window.TaskManagerUtils.getStatusClass(task.status)}">
                        ${window.TaskManagerUtils.statusToText(task.status)}
                    </span>
                    ${task.dueDate ? `
                        <span class="task-due-date ${window.TaskManagerUtils.getDueDateClass(task.dueDate)}">
                            Due: ${window.TaskManagerUtils.formatDate(task.dueDate)}
                        </span>
                    ` : ''}
                </div>
            </div>
        `;

        return taskElement;
    }

    // Update task count
    updateTaskCount() {
        const taskCount = document.getElementById('taskCount');
        if (taskCount) {
            taskCount.textContent = `(${this.filteredTasks.length})`;
        }
    }

    // Render category options in forms
    renderCategoryOptions() {
        const taskCategorySelect = document.getElementById('taskCategory');
        if (taskCategorySelect) {
            window.categoryManager.renderCategoryOptions(taskCategorySelect);
        }
    }

    // Show task modal
    showTaskModal(task = null) {
        const modal = document.getElementById('taskModal');
        const form = document.getElementById('taskForm');
        const title = document.getElementById('taskModalTitle');

        if (!modal || !form || !title) return;

        // Reset form
        window.TaskManagerUtils.clearForm(form);

        if (task) {
            // Edit mode
            title.textContent = 'Edit Task';
            window.TaskManagerUtils.setFormData(form, {
                title: task.title,
                description: task.description,
                categoryId: task.categoryId,
                priority: task.priority,
                status: task.status,
                dueDate: task.dueDate
            });
        } else {
            // Add mode
            title.textContent = 'Add New Task';
        }

        // Store current task for editing
        form.dataset.editingId = task ? task.id : '';

        modal.classList.add('show');
    }

    // Hide task modal
    hideTaskModal() {
        const modal = document.getElementById('taskModal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    // Handle task form submission
    handleTaskSubmit(event) {
        event.preventDefault();

        const form = event.target;
        const formData = window.TaskManagerUtils.getFormData(form);
        const isEditing = form.dataset.editingId;

        try {
            // --- ADD VALIDATION HERE ---
            let isValid = true;
            if (typeof validateTask === 'function') {
                const validationResult = validateTask(formData);
                if (!validationResult.isValid) {
                    isValid = false;
                    validationResult.errors.forEach(error => {
                        window.TaskManagerUtils.showToast(error, 'error');
                    });
                }
            }
            if (!isValid) return; // Stop submission if validation fails
            // --- END VALIDATION ---

            let task;

            if (isEditing) {
                // Update existing task
                task = this.updateTask(isEditing, formData);
                window.TaskManagerUtils.showToast('Task updated successfully', 'success');
            } else {
                // Add new task
                task = this.addTask(formData);
                window.TaskManagerUtils.showToast('Task added successfully', 'success');
            }

            this.hideTaskModal();

        } catch (error) {
            window.TaskManagerUtils.showToast(error.message, 'error');
        }
    }

    // Handle task deletion
    async handleTaskDelete(taskId) {
        const task = this.getTaskById(taskId);
        if (!task) return;

        const confirmed = await window.TaskManagerUtils.confirmDialog(
            `Are you sure you want to delete the task "${task.title}"?`
        );

        if (!confirmed) return;

        try {
            this.deleteTask(taskId);
            window.TaskManagerUtils.showToast('Task deleted successfully', 'success');
        } catch (error) {
            window.TaskManagerUtils.showToast(error.message, 'error');
        }
    }

    // Bind events
    bindEvents() {
        // Task modal events
        const taskModal = document.getElementById('taskModal');
        const taskForm = document.getElementById('taskForm');
        const addTaskBtn = document.getElementById('addTaskBtn');
        const addFirstTaskLink = document.getElementById('addFirstTask');

        if (addTaskBtn) {
            addTaskBtn.addEventListener('click', () => this.showTaskModal());
        }

        if (addFirstTaskLink) {
            addFirstTaskLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showTaskModal();
            });
        }

        if (taskForm) {
            taskForm.addEventListener('submit', (e) => this.handleTaskSubmit(e));
        }

        // Close modal events
        if (taskModal) {
            const closeButtons = taskModal.querySelectorAll('.close-modal, .cancel-btn');
            closeButtons.forEach(button => {
                button.addEventListener('click', () => this.hideTaskModal());
            });

            // Close on outside click
            taskModal.addEventListener('click', (e) => {
                if (e.target === taskModal) {
                    this.hideTaskModal();
                }
            });
        }

        // Bind task-specific events
        this.bindTaskEvents();
    }

    // Bind events for task elements
    bindTaskEvents() {
        // Edit task buttons
        document.querySelectorAll('.edit-task-btn').forEach(button => {
            button.addEventListener('click', () => {
                const taskId = button.dataset.id;
                const task = this.getTaskById(taskId);
                if (task) {
                    this.showTaskModal(task);
                }
            });
        });

        // Delete task buttons
        document.querySelectorAll('.delete-task-btn').forEach(button => {
            button.addEventListener('click', () => {
                const taskId = button.dataset.id;
                this.handleTaskDelete(taskId);
            });
        });

        // Toggle status buttons
        document.querySelectorAll('.toggle-status-btn').forEach(button => {
            button.addEventListener('click', () => {
                const taskId = button.dataset.id;
                this.toggleTaskStatus(taskId);
                window.TaskManagerUtils.showToast('Task status updated', 'success');
            });
        });
    }

    // Initialize the task manager
    init() {
        this.loadTasks(); // Load tasks after all dependencies are ready
        this.bindEvents(); // Bind events after DOM is ready
        this.renderTasks();
        this.renderCategoryOptions();
        this.updateTaskCount();
    }
}

// Global Assignment
if (isBrowser) {
    window.taskManager = new TaskManager();
}

// Node Export
if (isNode) {
    module.exports = new TaskManager();
    module.exports.TaskManager = TaskManager;
}
