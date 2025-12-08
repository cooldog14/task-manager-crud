/**
 * Main Application Entry Point
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    try {
        // Initialize all managers
        window.categoryManager.init();
        window.taskManager.init();
        window.filtersManager.init();

        // Set up global event listeners
        setupGlobalEventListeners();

        console.log('Task Manager application initialized successfully');

    } catch (error) {
        console.error('Failed to initialize application:', error);
        showInitializationError(error);
    }
}

function setupGlobalEventListeners() {
    // Handle keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);

    // Handle window resize for responsive adjustments
    window.addEventListener('resize', handleWindowResize);

    // Handle beforeunload to save any pending changes
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Handle online/offline status
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOfflineStatus);
}

function handleKeyboardShortcuts(event) {
    // Ctrl/Cmd + N to add new task
    if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
        event.preventDefault();
        const addTaskBtn = document.getElementById('addTaskBtn');
        if (addTaskBtn) {
            addTaskBtn.click();
        }
    }

    // Ctrl/Cmd + F to focus search
    if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
        event.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.focus();
        }
    }

    // Escape to close modals
    if (event.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal.show');
        openModals.forEach(modal => {
            const closeBtn = modal.querySelector('.close-modal');
            if (closeBtn) {
                closeBtn.click();
            }
        });
    }
}

function handleWindowResize() {
    // Update any responsive elements if needed
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    if (window.innerWidth <= 768) {
        // Mobile layout adjustments
        if (sidebar && mainContent) {
            // Ensure proper stacking on mobile
        }
    }
}

function handleBeforeUnload(event) {
    // Save any pending changes or show warning if needed
    const taskForm = document.getElementById('taskForm');
    const categoryForm = document.getElementById('categoryForm');

    // Check if forms have unsaved changes
    if (hasUnsavedChanges(taskForm) || hasUnsavedChanges(categoryForm)) {
        event.preventDefault();
        event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
    }
}

function hasUnsavedChanges(form) {
    if (!form) return false;

    const inputs = form.querySelectorAll('input, textarea, select');
    for (let input of inputs) {
        if (input.value !== input.defaultValue) {
            return true;
        }
    }
    return false;
}

function handleOnlineStatus() {
    window.TaskManagerUtils.showToast('Connection restored', 'success');
}

function handleOfflineStatus() {
    window.TaskManagerUtils.showToast('You are offline. Changes will be saved locally.', 'warning');
}

function showWelcomeMessage() {
    const tasks = window.TaskManagerStorage.getTasks();
    const categories = window.TaskManagerStorage.getCategories();

    // Show welcome message for first-time users
    if (tasks.length === 0 && categories.length === 3) { // Only default categories
        setTimeout(() => {
            window.TaskManagerUtils.showToast(
                'Welcome to Task Manager! Click "Add Task" to get started.',
                'success',
                5000
            );
        }, 1000);
    }
}

function showInitializationError(error) {
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #dc3545;
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        z-index: 1001;
        max-width: 500px;
        text-align: center;
    `;

    errorElement.innerHTML = `
        <strong>Application Error</strong><br>
        Failed to initialize Task Manager.<br>
        <small>${error.message}</small><br>
        <button onclick="location.reload()" style="margin-top: 10px; padding: 5px 10px; background: white; color: #dc3545; border: none; border-radius: 3px; cursor: pointer;">Reload Page</button>
    `;

    document.body.appendChild(errorElement);

    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (errorElement.parentElement) {
            errorElement.remove();
        }
    }, 10000);
}

// Performance monitoring (optional)
function setupPerformanceMonitoring() {
    // Monitor task rendering performance
    const originalRenderTasks = window.taskManager.renderTasks;
    window.taskManager.renderTasks = function() {
        const start = performance.now();
        originalRenderTasks.call(this);
        const end = performance.now();
        console.log(`Task rendering took ${end - start} milliseconds`);
    };
}

// Development helpers (only in development)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Add development helpers
    window.devHelpers = {
        clearAllData: () => {
            if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
                window.TaskManagerStorage.clearAllData();
                location.reload();
            }
        },
        exportData: () => {
            const data = window.TaskManagerStorage.exportData();
            console.log('Exported data:', data);
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'task-manager-data.json';
            a.click();
            URL.revokeObjectURL(url);
        },
        showStorageInfo: () => {
            const info = window.TaskManagerStorage.getStorageInfo();
            console.log('Storage info:', info);
            alert(`Storage Usage: ${info.sizeFormatted} (${info.itemCount} items)`);
        }
    };

    console.log('Development helpers available at window.devHelpers');
}

// Service Worker registration (for PWA features - optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Register service worker for offline functionality
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}

// Export app initialization for testing
window.TaskManagerApp = {
    initialize: initializeApp,
    version: '1.0.0'
};