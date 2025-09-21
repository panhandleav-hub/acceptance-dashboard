# Acceptance Test Dashboard - Vue.js

A comprehensive multi-room acceptance test plan dashboard built with Vue.js 3, featuring room management, test tracking, equipment inventory, and Excel/CSV import/export capabilities.

## Features

- 🏠 **Multi-Room Management**: Add, edit, and manage multiple test rooms
- ✅ **Test Tracking**: Track acceptance test progress across different phases
- 📊 **Progress Monitoring**: Real-time progress tracking with visual indicators
- 💾 **Equipment Management**: Comprehensive equipment inventory with reference sheets
- 📤 **Export Capabilities**: Export to Excel and CSV formats
- 📥 **Import Support**: Import equipment data from CSV/Excel files
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 🔍 **Search Functionality**: Search across test items and equipment
- 💽 **Local Storage**: Automatic saving and restoration of data

## Project Structure

```
src/
├── components/
│   ├── ChecklistSheet.vue      # Test checklist display
│   ├── EditableCell.vue        # Inline cell editing
│   ├── ImportPreviewModal.vue  # CSV/Excel import preview
│   ├── MainContent.vue         # Main content area
│   ├── ManagementModal.vue     # Project/room management
│   ├── NavigationContent.vue   # Sidebar navigation
│   ├── NavigationItem.vue      # Individual nav items
│   ├── NoSheetAvailable.vue    # Empty state component
│   ├── ReferenceSheet.vue      # Reference data tables
│   ├── RoomSelector.vue        # Room selection controls
│   ├── SearchContainer.vue     # Search input
│   ├── Sidebar.vue             # Main sidebar
│   ├── SidebarActions.vue      # Action buttons
│   ├── SidebarHeader.vue       # Sidebar header
│   └── TestItem.vue            # Individual test items
├── composables/
│   ├── useExportActions.js     # Export functionality
│   ├── useImportActions.js     # Import functionality
│   └── useRoomManagement.js    # Room management logic
├── stores/
│   └── main.js                 # Pinia store (state management)
├── App.vue                     # Root component
├── main.js                     # Application entry point
└── style.css                   # Global styles
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone or extract the project files**
   ```bash
   cd acceptance-test-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Key Components Overview

### State Management (Pinia Store)
- **Location**: `src/stores/main.js`
- **Purpose**: Centralized state management for rooms, test data, UI state
- **Key Features**: Reactive state, progress calculations, localStorage persistence

### Composables
- **useRoomManagement**: Room CRUD operations, data clearing
- **useExportActions**: Excel/CSV export functionality
- **useImportActions**: CSV/Excel import with preview

### Component Architecture
- **Sidebar**: Navigation, room selection, progress overview
- **MainContent**: Switches between checklist and reference sheets
- **ChecklistSheet**: Test item management with status tracking
- **ReferenceSheet**: Equipment and reference data tables
- **Modals**: Project management and import preview

## Test Data Structure

### Test Sheets
1. **In-House Commissioning** (Shop)
2. **In-House Programming** (Shop)
3. **On-Site Commissioning** (Field)
4. **On-Site Programming** (Field)

### Test Item Properties
- ID, Title, Description
- Status: Pass/Fail/N/A/Pending
- Notes, Initials, Owner
- Date stamp

### Reference Data
- Equipment lists with detailed specifications
- Configurable headers and data structure
- Inline editing capabilities

## Features in Detail

### Room Management
- Add/delete rooms with confirmation
- Room-specific test data and equipment
- Progress tracking per room
- Room dependencies (future feature)

### Import/Export
- **Excel Export**: Multi-sheet workbooks with test results and equipment
- **CSV Export**: Comprehensive test data export
- **Template Export**: Equipment list template for easy data entry
- **Import**: CSV/Excel import with preview and validation

### Progress Tracking
- Real-time percentage calculations
- Category-level and room-level progress
- Visual progress bars and indicators
- Completion status tracking

### Data Persistence
- Automatic localStorage saving
- Project data recovery on reload
- Export capabilities for backup
- Clear all data functionality

## Customization

### Adding New Test Categories
1. Modify the initial data structure in `src/stores/main.js`
2. Update room creation templates in `useRoomManagement.js`

### Adding New Reference Sheets
1. Add to room's `referenceData` structure
2. Define headers and data structure
3. Update navigation in `NavigationContent.vue`

### Styling
- Main styles in `src/style.css`
- Dark mode support throughout
- Responsive design for mobile devices
- Customizable color schemes

## Development Tips

### Adding New Components
1. Create component in `src/components/`
2. Import and register in parent components
3. Add to navigation if needed

### State Management
- Use the Pinia store for shared state
- Reactive computed properties for derived data
- Call `saveToLocalStorage()` after state changes

### Error Handling
- All import/export functions include try-catch blocks
- User-friendly error messages
- Graceful degradation for missing data

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ features used throughout
- Local storage required for data persistence
- File API used for import/export

## License

This project is provided as-is for educational and development purposes.

## Support

For issues or questions about the Vue.js implementation:
1. Check the browser console for errors
2. Verify all dependencies are installed
3. Ensure modern browser compatibility
4. Check localStorage permissions

---

**Note**: This is a complete conversion of the original HTML application to Vue.js 3 with modern development practices, component architecture, and proper state management.
