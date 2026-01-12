/**
 * Local Storage management for Task Manager
 */

const STORAGE_KEYS = {
    TASKS: 'taskManager_tasks',
    CATEGORIES: 'taskManager_categories',
    SETTINGS: 'taskManager_settings'
};

// Default categories
const DEFAULT_CATEGORIES = [
    {
        id: 'default-work',
        name: 'Work',
        color: '#3498db',
        createdAt: new Date().toISOString()
    },
    {
        id: 'default-personal',
        name: 'Personal',
        color: '#e74c3c',
        createdAt: new Date().toISOString()
    },
    {
        id: 'default-shopping',
        name: 'Shopping',
        color: '#2ecc71',
        createdAt: new Date().toISOString()
    }
];

// Storage class
class TaskManagerStorage {
    constructor() {
        this.initializeStorage();
    }

    // Initialize storage with default data if empty
    initializeStorage() {
        if (!this.getTasks().length) {
            this.saveTasks([]);
        }

        if (!this.getCategories().length) {
            this.saveCategories(DEFAULT_CATEGORIES);
        }

        if (!this.getSettings()) {
            this.saveSettings({
                theme: 'light',
                sortBy: 'created-desc',
                showCompleted: true
            });
        }
    }

    // Tasks CRUD operations
    getTasks() {
        try {
            const tasks = localStorage.getItem(STORAGE_KEYS.TASKS);
            return tasks ? JSON.parse(tasks) : [];
        } catch (error) {
            console.error('Error loading tasks from storage:', error);
            return [];
        }
    }

    saveTasks(tasks) {
        try {
            localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
            return true;
        } catch (error) {
            console.error('Error saving tasks to storage:', error);
            return false;
        }
    }

    addTask(task) {
        const tasks = this.getTasks();
        tasks.push(task);
        return this.saveTasks(tasks);
    }

    updateTask(taskId, updatedTask) {
        const tasks = this.getTasks();
        const index = tasks.findIndex(task => task.id === taskId);
        if (index !== -1) {
            tasks[index] = { ...tasks[index], ...updatedTask, updatedAt: new Date().toISOString() };
            return this.saveTasks(tasks);
        }
        return false;
    }

    deleteTask(taskId) {
        const tasks = this.getTasks();
        const filteredTasks = tasks.filter(task => task.id !== taskId);
        return this.saveTasks(filteredTasks);
    }

    getTaskById(taskId) {
        const tasks = this.getTasks();
        return tasks.find(task => task.id === taskId);
    }

    // Categories CRUD operations
    getCategories() {
        try {
            const categories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
            return categories ? JSON.parse(categories) : [];
        } catch (error) {
            console.error('Error loading categories from storage:', error);
            return [];
        }
    }

    saveCategories(categories) {
        try {
            localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
            return true;
        } catch (error) {
            console.error('Error saving categories to storage:', error);
            return false;
        }
    }

    addCategory(category) {
        const categories = this.getCategories();
        categories.push(category);
        return this.saveCategories(categories);
    }

    updateCategory(categoryId, updatedCategory) {
        const categories = this.getCategories();
        const index = categories.findIndex(category => category.id === categoryId);
        if (index !== -1) {
            categories[index] = { ...categories[index], ...updatedCategory };
            return this.saveCategories(categories);
        }
        return false;
    }

    deleteCategory(categoryId) {
        const categories = this.getCategories();
        const filteredCategories = categories.filter(category => category.id !== categoryId);
        return this.saveCategories(filteredCategories);
    }

    getCategoryById(categoryId) {
        const categories = this.getCategories();
        return categories.find(category => category.id === categoryId);
    }

    // Settings operations
    getSettings() {
        try {
            const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
            return settings ? JSON.parse(settings) : null;
        } catch (error) {
            console.error('Error loading settings from storage:', error);
            return null;
        }
    }

    saveSettings(settings) {
        try {
            localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
            return true;
        } catch (error) {
            console.error('Error saving settings to storage:', error);
            return false;
        }
    }

    updateSetting(key, value) {
        const settings = this.getSettings() || {};
        settings[key] = value;
        return this.saveSettings(settings);
    }

    // Utility methods
    clearAllData() {
        try {
            localStorage.removeItem(STORAGE_KEYS.TASKS);
            localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
            localStorage.removeItem(STORAGE_KEYS.SETTINGS);
            this.initializeStorage();
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    }

    exportData() {
        return {
            tasks: this.getTasks(),
            categories: this.getCategories(),
            settings: this.getSettings(),
            exportDate: new Date().toISOString()
        };
    }

    importData(data) {
        try {
            if (data.tasks && Array.isArray(data.tasks)) {
                this.saveTasks(data.tasks);
            }
            if (data.categories && Array.isArray(data.categories)) {
                this.saveCategories(data.categories);
            }
            if (data.settings && typeof data.settings === 'object') {
                this.saveSettings(data.settings);
            }
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }

    // Get storage usage information
    getStorageInfo() {
        let totalSize = 0;
        let itemCount = 0;

        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                let value = localStorage.getItem(key);
                totalSize += value.length;
                itemCount++;
            }
        }

        return {
            totalSize: totalSize,
            itemCount: itemCount,
            sizeFormatted: this.formatBytes(totalSize)
        };
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Backup and restore
    createBackup() {
        const backup = {
            data: this.exportData(),
            timestamp: new Date().toISOString(),
            version: '1.0'
        };

        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `task-manager-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    restoreFromBackup(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const backup = JSON.parse(e.target.result);
                    if (backup.data && this.importData(backup.data)) {
                        resolve(true);
                    } else {
                        reject(new Error('Invalid backup file format'));
                    }
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('Failed to read backup file'));
            reader.readAsText(file);
        });
    }
}

// Create global instance
const storage = new TaskManagerStorage();

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.TaskManagerStorage = storage;
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = storage;
  module.exports.TaskManagerStorage = TaskManagerStorage;
}