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
            sortedTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        case 'created-asc':
            sortedTasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
        case 'due-desc':
            sortedTasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
            break;
        case 'due-asc':
            sortedTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
            break;
        case 'priority-desc':
            sortedTasks.sort((a, b) => {
                const order = { high: 3, medium: 2, low: 1 };
                return (order[b.priority] || 2) - (order[a.priority] || 2);
            });
            break;
        case 'priority-asc':
            sortedTasks.sort((a, b) => {
                const order = { high: 3, medium: 2, low: 1 };
                return (order[a.priority] || 2) - (order[b.priority] || 2);
            });
            break;
        case 'status-desc':
            sortedTasks.sort((a, b) => {
                const order = { completed: 3, 'in-progress': 2, pending: 1 };
                return (order[b.status] || 1) - (order[a.status] || 1);
            });
            break;
        case 'status-asc':
            sortedTasks.sort((a, b) => {
                const order = { completed: 3, 'in-progress': 2, pending: 1 };
                return (order[a.status] || 1) - (order[b.status] || 1);
            });
            break;
        default:
            break;
    }
    return sortedTasks;
}

// Form utility functions
function getFormData(form) {
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    return data;
}

function setFormData(form, data) {
    Object.keys(data).forEach(key => {
        const input = form.querySelector(`[name="${key}"]`);
        if (input) {
            input.value = data[key];
        }
    });
}

function clearForm(form) {
    form.reset();
}

// Toast notification function
function showToast(message, type = 'info', duration = 3000) {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    toastContainer.appendChild(toast);

    // Auto-remove after duration
    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 300);
    }, duration);
}

// Confirm dialog function
function confirmDialog(message) {
    return new Promise((resolve) => {
        const confirmed = window.confirm(message);
        resolve(confirmed);
    });
}

// Export for window/global
const exported = {
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
    getFormData,
    setFormData,
    clearForm,
    showToast,
    confirmDialog
};

// Export for browser (window) as TaskManagerUtils for compatibility
if (typeof window !== 'undefined') {
    window.TaskManagerUtils = exported;
    window.utils = exported; // for backward compatibility if needed
}

// Export for Node.js (tests)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = exported;
}
