/**
 * Utility functions for the Task Manager application
 */

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Check if date is overdue
function isOverdue(dateString) {
    if (!dateString) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateString);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
}

// Check if date is due soon (within 3 days)
function isDueSoon(dateString) {
    if (!dateString) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateString);
    dueDate.setHours(0, 0, 0, 0);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 3;
}

// Get priority color class
function getPriorityClass(priority) {
    switch (priority) {
        case 'high': return 'high';
        case 'medium': return 'medium';
        case 'low': return 'low';
        default: return 'medium';
    }
}

// Get status color class
function getStatusClass(status) {
    switch (status) {
        case 'pending': return 'pending';
        case 'in-progress': return 'in-progress';
        case 'completed': return 'completed';
        default: return 'pending';
    }
}

// Get due date status class
function getDueDateClass(dateString) {
    if (!dateString) return 'on-time';
    if (isOverdue(dateString)) return 'overdue';
    if (isDueSoon(dateString)) return 'due-soon';
    return 'on-time';
}

// Capitalize first letter
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Convert status to display text
function statusToText(status) {
    switch (status) {
        case 'pending': return 'Pending';
        case 'in-progress': return 'In Progress';
        case 'completed': return 'Completed';
        default: return 'Pending';
    }
}

// Convert priority to display text
function priorityToText(priority) {
    switch (priority) {
        case 'high': return 'High';
        case 'medium': return 'Medium';
        case 'low': return 'Low';
        default: return 'Medium';
    }
}

// Validate email (basic validation)
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Sort tasks by different criteria
function sortTasks(tasks, sortBy) {
    const sortedTasks = [...tasks];

    switch (sortBy) {
        case 'created-desc':
            return sortedTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        case 'created-asc':
            return sortedTasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        case 'due-asc':
            return sortedTasks.sort((a, b) => {
                if (!a.dueDate && !b.dueDate) return 0;
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate) - new Date(b.dueDate);
            });
        case 'due-desc':
            return sortedTasks.sort((a, b) => {
                if (!a.dueDate && !b.dueDate) return 0;
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(b.dueDate) - new Date(a.dueDate);
            });
        case 'priority-desc':
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return sortedTasks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        case 'priority-asc':
            const priorityOrderAsc = { high: 3, medium: 2, low: 1 };
            return sortedTasks.sort((a, b) => priorityOrderAsc[a.priority] - priorityOrderAsc[b.priority]);
        case 'title-asc':
            return sortedTasks.sort((a, b) => a.title.localeCompare(b.title));
        case 'title-desc':
            return sortedTasks.sort((a, b) => b.title.localeCompare(a.title));
        default:
            return sortedTasks;
    }
}

// Filter tasks based on criteria
function filterTasks(tasks, filters) {
    return tasks.filter(task => {
        // Search filter
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            const titleMatch = task.title.toLowerCase().includes(searchTerm);
            const descriptionMatch = task.description.toLowerCase().includes(searchTerm);
            if (!titleMatch && !descriptionMatch) return false;
        }

        // Category filter
        if (filters.categories && filters.categories.length > 0) {
            if (!filters.categories.includes(task.categoryId)) return false;
        }

        // Priority filter
        if (filters.priorities && filters.priorities.length > 0) {
            if (!filters.priorities.includes(task.priority)) return false;
        }

        // Status filter
        if (filters.statuses && filters.statuses.length > 0) {
            if (!filters.statuses.includes(task.status)) return false;
        }

        // Due date filters
        if (filters.overdue && !isOverdue(task.dueDate)) return false;
        if (filters.today) {
            const today = new Date().toDateString();
            const dueDate = task.dueDate ? new Date(task.dueDate).toDateString() : null;
            if (dueDate !== today) return false;
        }
        if (filters.week) {
            if (!task.dueDate) return false;
            const today = new Date();
            const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
            const dueDate = new Date(task.dueDate);
            if (dueDate < today || dueDate > weekFromNow) return false;
        }

        return true;
    });
}

// Show toast notification
function showToast(message, type = 'success', duration = 3000) {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span>${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;

    toastContainer.appendChild(toast);

    // Auto remove after duration
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, duration);
}

// Confirm dialog
function confirmDialog(message) {
    return new Promise((resolve) => {
        const result = confirm(message);
        resolve(result);
    });
}

// Get form data as object
function getFormData(form) {
    const formData = new FormData(form);
    const data = {};
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    return data;
}

// Set form data from object
function setFormData(form, data) {
    for (let key in data) {
        const element = form.elements[key];
        if (element) {
            element.value = data[key];
        }
    }
}

// Clear form
function clearForm(form) {
    form.reset();
}

// Validate form
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
        } else {
            field.classList.remove('error');
        }
    });

    return isValid;
}

// Add CSS class for error styling
const style = document.createElement('style');
style.textContent = `
    .error {
        border-color: #dc3545 !important;
        box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1) !important;
    }
`;
document.head.appendChild(style);

// Export functions for use in other modules
window.TaskManagerUtils = {
    generateId,
    formatDate,
    isOverdue,
    isDueSoon,
    getPriorityClass,
    getStatusClass,
    getDueDateClass,
    capitalize,
    statusToText,
    priorityToText,
    isValidEmail,
    debounce,
    sortTasks,
    filterTasks,
    showToast,
    confirmDialog,
    getFormData,
    setFormData,
    clearForm,
    validateForm
};