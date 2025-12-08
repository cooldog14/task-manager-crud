/**
 * Category Manager - Handles all category-related operations
 */

class CategoryManager {
    constructor() {
        this.categories = [];
        this.loadCategories();
        this.bindEvents();
    }

    // Load categories from storage
    loadCategories() {
        this.categories = window.TaskManagerStorage.getCategories();
    }

    // Save categories to storage
    saveCategories() {
        window.TaskManagerStorage.saveCategories(this.categories);
    }

    // Get all categories
    getCategories() {
        return [...this.categories];
    }

    // Get category by ID
    getCategoryById(id) {
        return this.categories.find(category => category.id === id);
    }

    // Add new category
    addCategory(categoryData) {
        const category = {
            id: window.TaskManagerUtils.generateId(),
            name: categoryData.name.trim(),
            color: categoryData.color || '#3498db',
            createdAt: new Date().toISOString()
        };

        // Check if category name already exists
        if (this.categories.some(cat => cat.name.toLowerCase() === category.name.toLowerCase())) {
            throw new Error('Category name already exists');
        }

        this.categories.push(category);
        this.saveCategories();
        return category;
    }

    // Update category
    updateCategory(id, categoryData) {
        const index = this.categories.findIndex(category => category.id === id);
        if (index === -1) {
            throw new Error('Category not found');
        }

        const updatedCategory = {
            ...this.categories[index],
            name: categoryData.name.trim(),
            color: categoryData.color || this.categories[index].color
        };

        // Check if name conflicts with other categories
        if (this.categories.some(cat => cat.id !== id && cat.name.toLowerCase() === updatedCategory.name.toLowerCase())) {
            throw new Error('Category name already exists');
        }

        this.categories[index] = updatedCategory;
        this.saveCategories();
        return updatedCategory;
    }

    // Delete category
    deleteCategory(id) {
        const index = this.categories.findIndex(category => category.id === id);
        if (index === -1) {
            throw new Error('Category not found');
        }

        // Check if category is being used by tasks
        const tasks = window.TaskManagerStorage.getTasks();
        const tasksUsingCategory = tasks.filter(task => task.categoryId === id);

        if (tasksUsingCategory.length > 0) {
            throw new Error(`Cannot delete category. It is being used by ${tasksUsingCategory.length} task(s).`);
        }

        this.categories.splice(index, 1);
        this.saveCategories();
        return true;
    }

    // Get category name by ID
    getCategoryName(id) {
        const category = this.getCategoryById(id);
        return category ? category.name : 'Unknown Category';
    }

    // Get category color by ID
    getCategoryColor(id) {
        const category = this.getCategoryById(id);
        return category ? category.color : '#6c757d';
    }

    // Render categories in sidebar
    renderCategories() {
        const categoriesList = document.getElementById('categoriesList');
        if (!categoriesList) return;

        categoriesList.innerHTML = '';

        this.categories.forEach(category => {
            const categoryElement = document.createElement('div');
            categoryElement.className = 'category-item';
            categoryElement.innerHTML = `
                <div class="category-info">
                    <span class="category-color" style="background-color: ${category.color}"></span>
                    <span class="category-name">${category.name}</span>
                </div>
                <div class="category-actions">
                    <button class="edit-category-btn" data-id="${category.id}" title="Edit category">✏️</button>
                    <button class="delete-category-btn" data-id="${category.id}" title="Delete category">🗑️</button>
                </div>
            `;
            categoriesList.appendChild(categoryElement);
        });

        // Re-bind events for new elements
        this.bindCategoryEvents();
    }

    // Render category options in select dropdowns
    renderCategoryOptions(selectElement) {
        if (!selectElement) return;

        selectElement.innerHTML = '<option value="">Select a category</option>';

        this.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            selectElement.appendChild(option);
        });
    }

    // Render category filters
    renderCategoryFilters() {
        const categoryFilters = document.getElementById('categoryFilters');
        if (!categoryFilters) return;

        categoryFilters.innerHTML = '';

        this.categories.forEach(category => {
            const filterElement = document.createElement('label');
            filterElement.className = 'filter-option';
            filterElement.innerHTML = `
                <input type="checkbox" value="${category.id}" class="category-filter">
                <span class="category-filter-label">
                    <span class="category-color" style="background-color: ${category.color}"></span>
                    ${category.name}
                </span>
            `;
            categoryFilters.appendChild(filterElement);
        });
    }

    // Show category modal
    showCategoryModal(category = null) {
        const modal = document.getElementById('categoryModal');
        const form = document.getElementById('categoryForm');
        const title = document.getElementById('categoryModalTitle');

        if (!modal || !form || !title) return;

        // Reset form
        window.TaskManagerUtils.clearForm(form);

        if (category) {
            // Edit mode
            title.textContent = 'Edit Category';
            window.TaskManagerUtils.setFormData(form, category);
        } else {
            // Add mode
            title.textContent = 'Add New Category';
        }

        // Store current category for editing
        form.dataset.editingId = category ? category.id : '';

        modal.classList.add('show');
    }

    // Hide category modal
    hideCategoryModal() {
        const modal = document.getElementById('categoryModal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    // Handle category form submission
    handleCategorySubmit(event) {
        event.preventDefault();

        const form = event.target;
        const formData = window.TaskManagerUtils.getFormData(form);
        const isEditing = form.dataset.editingId;

        try {
            let category;

            if (isEditing) {
                // Update existing category
                category = this.updateCategory(isEditing, formData);
                window.TaskManagerUtils.showToast('Category updated successfully', 'success');
            } else {
                // Add new category
                category = this.addCategory(formData);
                window.TaskManagerUtils.showToast('Category added successfully', 'success');
            }

            // Refresh UI
            this.renderCategories();
            this.renderCategoryFilters();

            // Notify task manager to refresh category options
            if (window.taskManager) {
                window.taskManager.renderCategoryOptions();
            }

            this.hideCategoryModal();

        } catch (error) {
            window.TaskManagerUtils.showToast(error.message, 'error');
        }
    }

    // Handle category deletion
    async handleCategoryDelete(categoryId) {
        const category = this.getCategoryById(categoryId);
        if (!category) return;

        const confirmed = await window.TaskManagerUtils.confirmDialog(
            `Are you sure you want to delete the category "${category.name}"?`
        );

        if (!confirmed) return;

        try {
            this.deleteCategory(categoryId);
            window.TaskManagerUtils.showToast('Category deleted successfully', 'success');

            // Refresh UI
            this.renderCategories();
            this.renderCategoryFilters();

            // Notify task manager to refresh category options
            if (window.taskManager) {
                window.taskManager.renderCategoryOptions();
            }

        } catch (error) {
            window.TaskManagerUtils.showToast(error.message, 'error');
        }
    }

    // Bind events
    bindEvents() {
        // Category modal events
        const categoryModal = document.getElementById('categoryModal');
        const categoryForm = document.getElementById('categoryForm');
        const manageCategoriesBtn = document.getElementById('manageCategoriesBtn');

        if (manageCategoriesBtn) {
            manageCategoriesBtn.addEventListener('click', () => this.showCategoryModal());
        }

        if (categoryForm) {
            categoryForm.addEventListener('submit', (e) => this.handleCategorySubmit(e));
        }

        // Close modal events
        if (categoryModal) {
            const closeButtons = categoryModal.querySelectorAll('.close-modal, .cancel-btn');
            closeButtons.forEach(button => {
                button.addEventListener('click', () => this.hideCategoryModal());
            });

            // Close on outside click
            categoryModal.addEventListener('click', (e) => {
                if (e.target === categoryModal) {
                    this.hideCategoryModal();
                }
            });
        }

        // Bind category-specific events
        this.bindCategoryEvents();
    }

    // Bind events for category elements
    bindCategoryEvents() {
        // Edit category buttons
        document.querySelectorAll('.edit-category-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const categoryId = e.target.dataset.id;
                const category = this.getCategoryById(categoryId);
                if (category) {
                    this.showCategoryModal(category);
                }
            });
        });

        // Delete category buttons
        document.querySelectorAll('.delete-category-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const categoryId = e.target.dataset.id;
                this.handleCategoryDelete(categoryId);
            });
        });
    }

    // Initialize the category manager
    init() {
        this.renderCategories();
        this.renderCategoryFilters();
    }
}

// Create global instance
const categoryManager = new CategoryManager();

// Export for use in other modules
window.categoryManager = categoryManager;