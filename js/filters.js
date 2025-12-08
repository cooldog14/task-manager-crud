/**
 * Filters Manager - Handles search and filter functionality
 */

class FiltersManager {
    constructor() {
        this.bindEvents();
        this.loadSavedSettings();
    }

    // Bind events for search and filters
    bindEvents() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const clearSearchBtn = document.getElementById('clearSearch');

        if (searchInput) {
            // Debounced search
            const debouncedSearch = window.TaskManagerUtils.debounce((value) => {
                window.taskManager.setSearchFilter(value);
            }, 300);

            searchInput.addEventListener('input', (e) => {
                debouncedSearch(e.target.value);
            });
        }

        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', () => {
                if (searchInput) {
                    searchInput.value = '';
                    searchInput.focus();
                }
                window.taskManager.setSearchFilter('');
            });
        }

        // Category filters
        this.bindCheckboxFilters('.category-filter', (checkedValues) => {
            window.taskManager.setCategoryFilters(checkedValues);
        });

        // Priority filters
        this.bindCheckboxFilters('.priority-filter', (checkedValues) => {
            window.taskManager.setPriorityFilters(checkedValues);
        });

        // Status filters
        this.bindCheckboxFilters('.status-filter', (checkedValues) => {
            window.taskManager.setStatusFilters(checkedValues);
        });

        // Date filters
        this.bindDateFilters();

        // Clear all filters
        const clearFiltersBtn = document.getElementById('clearFilters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                window.taskManager.clearFilters();
            });
        }

        // Sort functionality
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                window.taskManager.setSorting(e.target.value);
            });
        }
    }

    // Bind checkbox filters
    bindCheckboxFilters(selector, callback) {
        document.addEventListener('change', (e) => {
            if (e.target.matches(selector)) {
                const checkedBoxes = document.querySelectorAll(`${selector}:checked`);
                const checkedValues = Array.from(checkedBoxes).map(box => box.value);
                callback(checkedValues);
            }
        });
    }

    // Bind date filters
    bindDateFilters() {
        const overdueFilter = document.getElementById('overdueFilter');
        const todayFilter = document.getElementById('todayFilter');
        const weekFilter = document.getElementById('weekFilter');

        const updateDateFilters = () => {
            const filters = {
                overdue: overdueFilter ? overdueFilter.checked : false,
                today: todayFilter ? todayFilter.checked : false,
                week: weekFilter ? weekFilter.checked : false
            };
            window.taskManager.setDateFilters(filters);
        };

        if (overdueFilter) {
            overdueFilter.addEventListener('change', updateDateFilters);
        }
        if (todayFilter) {
            todayFilter.addEventListener('change', updateDateFilters);
        }
        if (weekFilter) {
            weekFilter.addEventListener('change', updateDateFilters);
        }
    }

    // Load saved settings
    loadSavedSettings() {
        const settings = window.TaskManagerStorage.getSettings();
        if (settings && settings.sortBy) {
            const sortSelect = document.getElementById('sortSelect');
            if (sortSelect) {
                sortSelect.value = settings.sortBy;
            }
        }
    }

    // Update filter counts (optional enhancement)
    updateFilterCounts() {
        const tasks = window.taskManager.getTasks();

        // Update category counts
        document.querySelectorAll('.category-filter').forEach(checkbox => {
            const categoryId = checkbox.value;
            const count = tasks.filter(task => task.categoryId === categoryId).length;
            const label = checkbox.closest('.filter-option');
            if (label) {
                const countSpan = label.querySelector('.filter-count') || document.createElement('span');
                countSpan.className = 'filter-count';
                countSpan.textContent = ` (${count})`;
                if (!label.querySelector('.filter-count')) {
                    label.appendChild(countSpan);
                }
            }
        });

        // Update priority counts
        ['high', 'medium', 'low'].forEach(priority => {
            const count = tasks.filter(task => task.priority === priority).length;
            const checkbox = document.querySelector(`.priority-filter[value="${priority}"]`);
            if (checkbox) {
                const label = checkbox.closest('.filter-option');
                if (label) {
                    const countSpan = label.querySelector('.filter-count') || document.createElement('span');
                    countSpan.className = 'filter-count';
                    countSpan.textContent = ` (${count})`;
                    if (!label.querySelector('.filter-count')) {
                        label.appendChild(countSpan);
                    }
                }
            }
        });

        // Update status counts
        ['pending', 'in-progress', 'completed'].forEach(status => {
            const count = tasks.filter(task => task.status === status).length;
            const checkbox = document.querySelector(`.status-filter[value="${status}"]`);
            if (checkbox) {
                const label = checkbox.closest('.filter-option');
                if (label) {
                    const countSpan = label.querySelector('.filter-count') || document.createElement('span');
                    countSpan.className = 'filter-count';
                    countSpan.textContent = ` (${count})`;
                    if (!label.querySelector('.filter-count')) {
                        label.appendChild(countSpan);
                    }
                }
            }
        });
    }

    // Get active filters summary
    getActiveFiltersSummary() {
        const summary = {
            search: document.getElementById('searchInput')?.value || '',
            categories: Array.from(document.querySelectorAll('.category-filter:checked')).map(cb => cb.value),
            priorities: Array.from(document.querySelectorAll('.priority-filter:checked')).map(cb => cb.value),
            statuses: Array.from(document.querySelectorAll('.status-filter:checked')).map(cb => cb.value),
            overdue: document.getElementById('overdueFilter')?.checked || false,
            today: document.getElementById('todayFilter')?.checked || false,
            week: document.getElementById('weekFilter')?.checked || false
        };

        return summary;
    }

    // Check if any filters are active
    hasActiveFilters() {
        const summary = this.getActiveFiltersSummary();
        return !!(
            summary.search ||
            summary.categories.length > 0 ||
            summary.priorities.length > 0 ||
            summary.statuses.length > 0 ||
            summary.overdue ||
            summary.today ||
            summary.week
        );
    }

    // Show/hide clear filters button based on active filters
    updateClearFiltersVisibility() {
        const clearFiltersBtn = document.getElementById('clearFilters');
        if (clearFiltersBtn) {
            clearFiltersBtn.style.display = this.hasActiveFilters() ? 'block' : 'none';
        }
    }

    // Initialize the filters manager
    init() {
        // Update filter counts on initialization
        this.updateFilterCounts();
        this.updateClearFiltersVisibility();

        // Set up periodic updates for filter counts (every 5 seconds)
        setInterval(() => {
            this.updateFilterCounts();
        }, 5000);
    }
}

// Create global instance
const filtersManager = new FiltersManager();

// Export for use in other modules
window.filtersManager = filtersManager;