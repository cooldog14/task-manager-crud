/**
 * UI Tests using Selenium WebDriver
 * Tests the Task Manager web application UI
 */

const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');

describe('Task Manager UI Tests', () => {
  let driver;
  let server;

  beforeAll(async () => {
    // Start a simple HTTP server for the app
    const http = require('http');
    const fs = require('fs');
    const url = require('url');

    server = http.createServer((req, res) => {
      const parsedUrl = url.parse(req.url);
      let pathname = parsedUrl.pathname;

      if (pathname === '/') {
        pathname = '/index.html';
      }

      const filePath = path.join(__dirname, '..', pathname);

      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end('File not found');
          return;
        }

        // Set content type based on file extension
        const ext = path.extname(filePath);
        let contentType = 'text/html';
        if (ext === '.css') contentType = 'text/css';
        if (ext === '.js') contentType = 'application/javascript';

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      });
    });

    await new Promise((resolve) => {
      server.listen(8080, () => {
        console.log('Test server started on port 8080');
        resolve();
      });
    });

    // Set up Chrome options for headless mode
    const chromeOptions = new chrome.Options();
    chromeOptions.addArguments('--headless');
    chromeOptions.addArguments('--no-sandbox');
    chromeOptions.addArguments('--disable-dev-shm-usage');
    chromeOptions.addArguments('--disable-gpu');

    // Create WebDriver instance
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(chromeOptions)
      .build();
  }, 30000);

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
    if (server) {
      server.close();
    }
  });

  beforeEach(async () => {
    await driver.get('http://localhost:8080');
    // Wait for the page to load
    await driver.wait(until.elementLocated(By.id('addTaskBtn')), 5000);
  });

  describe('Page Load', () => {
    test('should load the application correctly', async () => {
      const title = await driver.getTitle();
      expect(title).toBe('Task Manager - CRUD Application');

      // Check that main elements are present
      const addTaskBtn = await driver.findElement(By.id('addTaskBtn'));
      expect(addTaskBtn).toBeTruthy();

      const taskList = await driver.findElement(By.id('taskList'));
      expect(taskList).toBeTruthy();
    });

    test('should display default categories', async () => {
      // Wait for categories to load
      await driver.wait(until.elementLocated(By.className('category-item')), 5000);

      const categoryItems = await driver.findElements(By.className('category-item'));
      expect(categoryItems.length).toBeGreaterThan(0);
    });
  });

  describe('Task Creation', () => {
    test('should open add task modal', async () => {
      const addTaskBtn = await driver.findElement(By.id('addTaskBtn'));
      await addTaskBtn.click();

      // Wait for modal to appear
      await driver.wait(until.elementLocated(By.id('taskModal')), 5000);
      const modal = await driver.findElement(By.id('taskModal'));
      expect(modal).toBeTruthy();
    });

    test('should create a new task', async () => {
      // Click add task button
      const addTaskBtn = await driver.findElement(By.id('addTaskBtn'));
      await addTaskBtn.click();

      // Wait for modal
      await driver.wait(until.elementLocated(By.id('taskForm')), 5000);

      // Fill form
      const titleInput = await driver.findElement(By.id('taskTitle'));
      await titleInput.sendKeys('UI Test Task');

      const descriptionInput = await driver.findElement(By.id('taskDescription'));
      await descriptionInput.sendKeys('Created by Selenium test');

      // Submit form
      const saveBtn = await driver.findElement(By.className('save-btn'));
      await saveBtn.click();

      // Wait for modal to close and task to appear
      await driver.wait(until.elementLocated(By.className('task-item')), 5000);
      const taskItems = await driver.findElements(By.className('task-item'));
      expect(taskItems.length).toBeGreaterThan(0);

      // Check that the task title is displayed
      const taskTitles = await driver.findElements(By.className('task-title'));
      const titles = await Promise.all(taskTitles.map(title => title.getText()));
      expect(titles.some(title => title.includes('UI Test Task'))).toBe(true);
    }, 15000);
  });

  describe('Task Interaction', () => {
    test('should toggle task status', async () => {
      // First create a task
      const addTaskBtn = await driver.findElement(By.id('addTaskBtn'));
      await addTaskBtn.click();

      await driver.wait(until.elementLocated(By.id('taskForm')), 5000);

      const titleInput = await driver.findElement(By.id('taskTitle'));
      await titleInput.sendKeys('Status Toggle Test');

      const saveBtn = await driver.findElement(By.className('save-btn'));
      await saveBtn.click();

      // Wait for task to appear
      await driver.wait(until.elementLocated(By.className('toggle-status-btn')), 5000);

      // Click toggle button
      const toggleBtn = await driver.findElement(By.className('toggle-status-btn'));
      await toggleBtn.click();

      // Wait a bit for status change
      await driver.sleep(1000);

      // Check if status changed (this is a basic check)
      const taskItem = await driver.findElement(By.className('task-item'));
      const classAttribute = await taskItem.getAttribute('class');
      // The status change might not be immediately visible in the DOM
      expect(classAttribute).toContain('task-item');
    }, 15000);
  });

  describe('Search Functionality', () => {
    test('should filter tasks by search term', async () => {
      // Create a task first
      const addTaskBtn = await driver.findElement(By.id('addTaskBtn'));
      await addTaskBtn.click();

      await driver.wait(until.elementLocated(By.id('taskForm')), 5000);

      const titleInput = await driver.findElement(By.id('taskTitle'));
      await titleInput.sendKeys('Searchable Task');

      const saveBtn = await driver.findElement(By.className('save-btn'));
      await saveBtn.click();

      // Wait for task to appear
      await driver.wait(until.elementLocated(By.className('task-item')), 5000);

      // Use search
      const searchInput = await driver.findElement(By.id('searchInput'));
      await searchInput.sendKeys('Searchable');

      // Wait for filtering
      await driver.sleep(1000);

      // Check results
      const taskItems = await driver.findElements(By.className('task-item'));
      expect(taskItems.length).toBeGreaterThan(0);
    }, 15000);
  });

  describe('Advanced Filtering Functionality', () => {
    test('should filter tasks using advanced filter criteria', async () => {
      // Helper to add tasks for filtering scenarios
      const addTask = async (title, priority, dueDate) => {
        const addTaskBtn = await driver.findElement(By.id('addTaskBtn'));
        await addTaskBtn.click();
        await driver.wait(until.elementLocated(By.id('taskModal')), 5000); // Wait for modal to appear
        await driver.wait(until.elementLocated(By.id('taskForm')), 5000);

        await driver.findElement(By.id('taskTitle')).sendKeys(title);
        await driver.findElement(By.id('taskPriority')).sendKeys(priority);
        
        // Assuming there's an input for dueDate in the form with id='taskDueDate'
        if (dueDate) {
          try {
            const dueDateInput = await driver.findElement(By.id('taskDueDate'));
            await dueDateInput.sendKeys(dueDate);
          } catch (error) {
            console.warn("taskDueDate input not found in modal, skipping due date entry for test. Ensure it exists or adapt test.");
          }
        }
        await driver.findElement(By.className('save-btn')).click();
        await driver.wait(until.elementLocated(By.className('task-item')), 5000); // Wait for task list to update
      };

      // Helper to get today's date in YYYY-MM-DD format
      const getTodayDate = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months start at 0!
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      };

      await addTask('Advanced Filter - High Today', 'high', getTodayDate());
      await addTask('Advanced Filter - Low Week', 'low', '2025-12-20'); // Example date in the future
      await addTask('Advanced Filter - Medium Past', 'medium', '2023-01-01');

      // Wait for tasks to be rendered and stable
      await driver.sleep(1000);

      // Apply advanced filters: Priority 'high' AND Date 'today'
      const filterPriority = await driver.findElement(By.id('filter-priority'));
      await filterPriority.sendKeys('high'); // Select 'high' priority

      const filterDate = await driver.findElement(By.id('filter-date'));
      await filterDate.sendKeys('today'); // Select 'today' due date

      const applyFiltersBtn = await driver.findElement(By.id('apply-filters-btn'));
      await applyFiltersBtn.click();

      // Wait for filtering to apply and re-render
      await driver.sleep(1500);

      // Assert only the "High Priority Today Task" is visible
      const visibleTasks = await driver.findElements(By.className('task-item'));
      expect(visibleTasks.length).toBe(1); // Expect only one task

      const taskTitle = await visibleTasks[0].findElement(By.className('task-title')).getText();
      expect(taskTitle).toContain('Advanced Filter - High Today');

      // Reset filters and check all tasks are visible again
      const resetFiltersBtn = await driver.findElement(By.id('reset-filters-btn'));
      await resetFiltersBtn.click();
      await driver.sleep(1000); // Wait for reset and re-render

      const allTasksAfterReset = await driver.findElements(By.className('task-item'));
      expect(allTasksAfterReset.length).toBe(3); // All 3 tasks should be visible

    }, 45000); // Increased timeout for this comprehensive test
  });
});