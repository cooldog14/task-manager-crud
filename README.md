# Task Manager - CRUD Application

A comprehensive task management application built with HTML, CSS, and JavaScript featuring full CRUD operations, categories, search, filtering, and local storage persistence.

## Features

### Core Functionality
- ✅ **Create** - Add new tasks with title, description, category, priority, status, and due date
- ✅ **Read** - View all tasks in a clean, organized list
- ✅ **Update** - Edit existing tasks with inline editing
- ✅ **Delete** - Remove tasks with confirmation dialogs

### Advanced Features
- 🏷️ **Category Management** - Create, edit, and delete custom categories
- 🔍 **Search** - Real-time search through task titles and descriptions
- 🎯 **Filtering** - Filter by category, priority, status, and due dates
- 📅 **Due Date Tracking** - Visual indicators for overdue and due-soon tasks
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 💾 **Local Storage** - Data persists between browser sessions
- 🎨 **Modern UI** - Clean, intuitive interface with smooth animations

### Task Properties
- **Title** (required)
- **Description** (optional)
- **Category** (required)
- **Priority** (High, Medium, Low)
- **Status** (Pending, In Progress, Completed)
- **Due Date** (optional)

## Getting Started

### Prerequisites
- Modern web browser with JavaScript enabled
- Local web server (for proper functionality)

### Installation

1. **Clone or download** the project files
2. **Start a local server** in the project directory:

   ```bash
   # Using Python 3
   python3 -m http.server 8000

   # Using Node.js
   npx http-server

   # Using PHP
   php -S localhost:8000
   ```

3. **Open your browser** and navigate to `http://localhost:8000`

## Usage

### Adding Tasks
1. Click the **"+ Add Task"** button in the header
2. Fill in the task details:
   - **Title** (required)
   - **Description** (optional)
   - **Category** (select from dropdown or create new)
   - **Priority** (High, Medium, Low)
   - **Status** (Pending, In Progress, Completed)
   - **Due Date** (optional)
3. Click **"Save Task"**

### Managing Categories
1. Click **"Manage Categories"** in the sidebar
2. **Add Category**: Enter name and choose color
3. **Edit Category**: Click the edit icon next to any category
4. **Delete Category**: Click the delete icon (only if no tasks use it)

### Searching Tasks
- Use the search bar in the header
- Search works in real-time across task titles and descriptions
- Click the "×" to clear search

### Filtering Tasks
Use the sidebar filters to narrow down tasks:
- **Categories**: Check multiple categories
- **Priority**: Filter by High, Medium, or Low priority
- **Status**: Filter by Pending, In Progress, or Completed
- **Due Date**: Filter by Overdue, Due Today, or Due This Week
- Click **"Clear All Filters"** to reset

### Sorting Tasks
Use the sort dropdown to order tasks by:
- Newest/Oldest First
- Due Date (Earliest/Latest)
- Priority (High to Low/Low to High)
- Title (A-Z/Z-A)

### Editing Tasks
- Click the **edit icon** (✏️) on any task
- Modify the details in the form
- Click **"Save Task"** to update

### Completing Tasks
- Click the **status toggle button** (✅/↩️) to cycle through statuses
- Tasks marked as "Completed" appear with reduced opacity

### Deleting Tasks
- Click the **delete icon** (🗑️) on any task
- Confirm deletion in the dialog

## Keyboard Shortcuts

- `Ctrl/Cmd + N` - Add new task
- `Ctrl/Cmd + F` - Focus search bar
- `Escape` - Close open modals

## Technical Details

### File Structure
```
task-manager/
├── index.html          # Main HTML file
├── css/
│   ├── styles.css      # Main stylesheet
│   └── responsive.css  # Mobile responsiveness
├── js/
│   ├── app.js          # Application initialization
│   ├── utils.js        # Utility functions
│   ├── storage.js      # Local storage management
│   ├── categoryManager.js # Category CRUD operations
│   ├── taskManager.js  # Task CRUD operations
│   └── filters.js      # Search and filter logic
└── README.md           # This file
```

### Browser Support
- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

### Data Storage
- Uses browser LocalStorage API
- Data persists between sessions
- No server required - works offline

### Performance
- Debounced search (300ms delay)
- Efficient filtering and sorting
- Minimal DOM manipulation
- Responsive images and interactions

## Development

### Code Quality
- Modular JavaScript architecture
- Consistent error handling
- Input validation and sanitization
- Accessible form controls

### Browser Console Commands
When running locally, access development helpers:

```javascript
// Clear all data (irreversible)
devHelpers.clearAllData()

// Export data to JSON file
devHelpers.exportData()

// Show storage usage info
devHelpers.showStorageInfo()
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Ensure you're using a modern browser
3. Try clearing browser data and refreshing
4. Check that JavaScript is enabled

For feature requests or bug reports, please create an issue in the repository.