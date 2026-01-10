// Mock window and dependencies
let categoryManager;
beforeEach(() => {
    document.body.innerHTML = '<div id="categoriesList"></div><div id="categoryFilters"></div>';
    
    // Mock global dependencies
    window.TaskManagerUtils = {
        generateId: jest.fn(() => 'id-' + Math.random()),
        clearForm: jest.fn(),
        setFormData: jest.fn(),
        getFormData: jest.fn(() => ({ name: 'Test', color: '#fff' })),
        showToast: jest.fn(),
        confirmDialog: jest.fn(() => Promise.resolve(true)),
    };
    window.TaskManagerStorage = {
        getCategories: jest.fn(() => []),
        saveCategories: jest.fn(),
        getTasks: jest.fn(() => []),
    };
    
    jest.resetModules();
    require('../js/categoryManager');
    categoryManager = window.categoryManager;
});

describe('CategoryManager', () => {
    it('should initialize with empty categories', () => {
        expect(categoryManager.categories).toEqual([]);
    });

    it('should add a new category', () => {
        window.TaskManagerUtils.generateId.mockReturnValue('cat1');
        const cat = categoryManager.addCategory({ name: 'Work', color: '#123' });
        expect(cat.name).toBe('Work');
        expect(cat.color).toBe('#123');
        expect(categoryManager.categories.length).toBe(1);
    });

    it('should not add duplicate category names', () => {
        window.TaskManagerUtils.generateId.mockReturnValue('cat1');
        categoryManager.addCategory({ name: 'Work', color: '#123' });
        expect(() => categoryManager.addCategory({ name: 'work', color: '#456' })).toThrow('Category name already exists');
    });

    it('should update a category', () => {
        window.TaskManagerUtils.generateId.mockReturnValue('cat1');
        const cat = categoryManager.addCategory({ name: 'Work', color: '#123' });
        const updated = categoryManager.updateCategory(cat.id, { name: 'Personal', color: '#456' });
        expect(updated.name).toBe('Personal');
        expect(updated.color).toBe('#456');
    });

    it('should not update to duplicate name', () => {
        window.TaskManagerUtils.generateId.mockReturnValueOnce('cat1').mockReturnValueOnce('cat2');
        categoryManager.addCategory({ name: 'Work', color: '#123' });
        categoryManager.addCategory({ name: 'Personal', color: '#456' });
        expect(() => categoryManager.updateCategory('cat2', { name: 'Work', color: '#789' })).toThrow('Category name already exists');
    });

    it('should delete a category not used by tasks', () => {
        window.TaskManagerUtils.generateId.mockReturnValue('cat1');
        const cat = categoryManager.addCategory({ name: 'Work', color: '#123' });
        window.TaskManagerStorage.getTasks.mockReturnValue([]);
        expect(categoryManager.deleteCategory(cat.id)).toBe(true);
        expect(categoryManager.categories.length).toBe(0);
    });

    it('should not delete a category used by tasks', () => {
        window.TaskManagerUtils.generateId.mockReturnValue('cat1');
        const cat = categoryManager.addCategory({ name: 'Work', color: '#123' });
        window.TaskManagerStorage.getTasks.mockReturnValue([{ categoryId: cat.id }]);
        expect(() => categoryManager.deleteCategory(cat.id)).toThrow('Cannot delete category. It is being used by 1 task(s).');
    });

    it('should get category by id', () => {
        window.TaskManagerUtils.generateId.mockReturnValue('cat1');
        const cat = categoryManager.addCategory({ name: 'Work', color: '#123' });
        expect(categoryManager.getCategoryById(cat.id)).toEqual(cat);
    });

    it('should get category name and color by id', () => {
        window.TaskManagerUtils.generateId.mockReturnValue('cat1');
        const cat = categoryManager.addCategory({ name: 'Work', color: '#123' });
        expect(categoryManager.getCategoryName(cat.id)).toBe('Work');
        expect(categoryManager.getCategoryColor(cat.id)).toBe('#123');
        expect(categoryManager.getCategoryName('bad')).toBe('Unknown Category');
        expect(categoryManager.getCategoryColor('bad')).toBe('#6c757d');
    });

    it('should render categories in the sidebar', () => {
        window.TaskManagerUtils.generateId.mockReturnValue('cat1');
        categoryManager.addCategory({ name: 'Work', color: '#123' });
        categoryManager.renderCategories();
        const categoriesList = document.getElementById('categoriesList');
        expect(categoriesList.innerHTML).toContain('Work');
        expect(categoriesList.querySelector('.category-item')).not.toBeNull();
    });

    it('should render category options in a select element', () => {
        window.TaskManagerUtils.generateId.mockReturnValue('cat1');
        categoryManager.addCategory({ name: 'Work', color: '#123' });
        const select = document.createElement('select');
        categoryManager.renderCategoryOptions(select);
        expect(select.innerHTML).toContain('Work');
        expect(select.querySelector('option[value="cat1"]')).not.toBeNull();
    });

    it('should render category filters', () => {
        window.TaskManagerUtils.generateId.mockReturnValue('cat1');
        categoryManager.addCategory({ name: 'Work', color: '#123' });
        categoryManager.renderCategoryFilters();
        const categoryFilters = document.getElementById('categoryFilters');
        expect(categoryFilters.innerHTML).toContain('Work');
        expect(categoryFilters.querySelector('input[type="checkbox"]')).not.toBeNull();
    });

    it('should show and hide the category modal', () => {
        const modal = document.createElement('div');
        modal.id = 'categoryModal';
        const form = document.createElement('form');
        form.id = 'categoryForm';
        const title = document.createElement('div');
        title.id = 'categoryModalTitle';
        document.body.appendChild(modal);
        document.body.appendChild(form);
        document.body.appendChild(title);
        categoryManager.showCategoryModal();
        expect(modal.classList.contains('show')).toBe(true);
        categoryManager.hideCategoryModal();
        expect(modal.classList.contains('show')).toBe(false);
        // Clean up
        modal.remove();
        form.remove();
        title.remove();
    });

    it('should handle category form submission (add)', () => {
        window.TaskManagerUtils.generateId.mockReturnValue('cat1');
        const form = document.createElement('form');
        form.id = 'categoryForm';
        document.body.appendChild(form);
        window.TaskManagerUtils.getFormData.mockReturnValue({ name: 'Work', color: '#123' });
        const event = { preventDefault: jest.fn(), target: form };
        categoryManager.handleCategorySubmit(event);
        expect(window.TaskManagerUtils.showToast).toHaveBeenCalledWith('Category added successfully', 'success');
        form.remove();
    });

    it('should handle category form submission (update)', () => {
        window.TaskManagerUtils.generateId.mockReturnValue('cat1');
        const cat = categoryManager.addCategory({ name: 'Work', color: '#123' });
        const form = document.createElement('form');
        form.id = 'categoryForm';
        form.dataset.editingId = cat.id;
        document.body.appendChild(form);
        window.TaskManagerUtils.getFormData.mockReturnValue({ name: 'Personal', color: '#456' });
        const event = { preventDefault: jest.fn(), target: form };
        categoryManager.handleCategorySubmit(event);
        expect(window.TaskManagerUtils.showToast).toHaveBeenCalledWith('Category updated successfully', 'success');
        form.remove();
    });

    it('should handle category deletion via handleCategoryDelete', async () => {
        window.TaskManagerUtils.generateId.mockReturnValue('cat1');
        const cat = categoryManager.addCategory({ name: 'Work', color: '#123' });
        window.TaskManagerStorage.getTasks.mockReturnValue([]);
        await categoryManager.handleCategoryDelete(cat.id);
        expect(window.TaskManagerUtils.showToast).toHaveBeenCalledWith('Category deleted successfully', 'success');
    });

    describe('UI and event methods', () => {
        let modal, form, title, manageBtn, categoriesList, categoryFilters;
        beforeEach(() => {
            modal = document.createElement('div');
            modal.id = 'categoryModal';
            form = document.createElement('form');
            form.id = 'categoryForm';
            title = document.createElement('div');
            title.id = 'categoryModalTitle';
            manageBtn = document.createElement('button');
            manageBtn.id = 'manageCategoriesBtn';
            categoriesList = document.createElement('div');
            categoriesList.id = 'categoriesList';
            categoryFilters = document.createElement('div');
            categoryFilters.id = 'categoryFilters';
            document.body.appendChild(modal);
            document.body.appendChild(form);
            document.body.appendChild(title);
            document.body.appendChild(manageBtn);
            document.body.appendChild(categoriesList);
            document.body.appendChild(categoryFilters);
        });
        afterEach(() => {
            modal.remove();
            form.remove();
            title.remove();
            manageBtn.remove();
            categoriesList.remove();
            categoryFilters.remove();
        });

        it('should bind and trigger manageCategoriesBtn click', () => {
            const spy = jest.spyOn(categoryManager, 'showCategoryModal');
            categoryManager.bindEvents();
            manageBtn.click();
            expect(spy).toHaveBeenCalled();
            spy.mockRestore();
        });

        it('should bind and trigger form submit', () => {
            const spy = jest.spyOn(categoryManager, 'handleCategorySubmit');
            categoryManager.bindEvents();
            const event = new window.Event('submit');
            form.dispatchEvent(event);
            expect(spy).toHaveBeenCalled();
            spy.mockRestore();
        });

        it('should close modal on close button click', () => {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'close-modal';
            modal.appendChild(closeBtn);
            categoryManager.bindEvents();
            modal.classList.add('show');
            closeBtn.click();
            expect(modal.classList.contains('show')).toBe(false);
            closeBtn.remove();
        });

        it('should close modal on outside click', () => {
            categoryManager.bindEvents();
            modal.classList.add('show');
            modal.dispatchEvent(new window.Event('click'));
            expect(modal.classList.contains('show')).toBe(false);
        });

        it('should bindCategoryEvents for edit/delete', () => {
            // Add a category and render
            window.TaskManagerUtils.generateId.mockReturnValue('cat1');
            categoryManager.addCategory({ name: 'Work', color: '#123' });
            categoryManager.renderCategories();
            // Add spies
            const showSpy = jest.spyOn(categoryManager, 'showCategoryModal');
            const delSpy = jest.spyOn(categoryManager, 'handleCategoryDelete');
            // Simulate edit
            const editBtn = document.querySelector('.edit-category-btn');
            editBtn.click();
            expect(showSpy).toHaveBeenCalled();
            // Simulate delete
            const deleteBtn = document.querySelector('.delete-category-btn');
            deleteBtn.click();
            expect(delSpy).toHaveBeenCalled();
            showSpy.mockRestore();
            delSpy.mockRestore();
        });
    });


    it('should throw error if updateCategory called with invalid id', () => {
        expect(() => categoryManager.updateCategory('invalid', { name: 'Test', color: '#fff' })).toThrow('Category not found');
    });

    it('should throw error if deleteCategory called with invalid id', () => {
        expect(() => categoryManager.deleteCategory('invalid')).toThrow('Category not found');
    });

    it('should handle error in handleCategorySubmit (duplicate name)', () => {
        window.TaskManagerUtils.generateId.mockReturnValue('cat1');
        categoryManager.addCategory({ name: 'Work', color: '#123' });
        const form = document.createElement('form');
        form.id = 'categoryForm';
        document.body.appendChild(form);
        window.TaskManagerUtils.getFormData.mockReturnValue({ name: 'Work', color: '#456' });
        const event = { preventDefault: jest.fn(), target: form };
        categoryManager.handleCategorySubmit(event);
        expect(window.TaskManagerUtils.showToast).toHaveBeenCalledWith('Category name already exists', 'error');
        form.remove();
    });

    it('should handle error in handleCategoryDelete (used by tasks)', async () => {
        window.TaskManagerUtils.generateId.mockReturnValue('cat1');
        const cat = categoryManager.addCategory({ name: 'Work', color: '#123' });
        window.TaskManagerStorage.getTasks.mockReturnValue([{ categoryId: cat.id }]);
        await categoryManager.handleCategoryDelete(cat.id);
        expect(window.TaskManagerUtils.showToast).toHaveBeenCalledWith(expect.stringContaining('Cannot delete category'), 'error');
    });

    it('should not show modal if elements missing', () => {
        // Remove modal, form, title
        const modal = document.getElementById('categoryModal');
        const form = document.getElementById('categoryForm');
        const title = document.getElementById('categoryModalTitle');
        if (modal) modal.remove();
        if (form) form.remove();
        if (title) title.remove();
        expect(() => categoryManager.showCategoryModal()).not.toThrow();
    });

    it('should not render categories if element missing', () => {
        const categoriesList = document.getElementById('categoriesList');
        if (categoriesList) categoriesList.remove();
        expect(() => categoryManager.renderCategories()).not.toThrow();
    });

    it('should not render category filters if element missing', () => {
        const categoryFilters = document.getElementById('categoryFilters');
        if (categoryFilters) categoryFilters.remove();
        expect(() => categoryManager.renderCategoryFilters()).not.toThrow();
    });

    it('should not render category options if select missing', () => {
        expect(() => categoryManager.renderCategoryOptions(null)).not.toThrow();
    });
});
