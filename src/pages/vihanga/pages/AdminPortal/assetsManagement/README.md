# Assets Management System

This directory contains the complete assets management system for the application, allowing users to create, edit, and manage employee assets efficiently.

## 📁 Folder Structure

```
assetsManagement/
├── README.md                           # This documentation file
├── index.js                           # Main entry point
├── AssetsManagementSystem.js          # Main component
├── constants/
│   └── assetConstants.js              # Asset types and other constants
├── form/
│   └── EmployeeDetailsForm.js         # Employee details form component
├── hooks/
│   └── useAssetsManagement.js         # Custom hook for state management
├── services/
│   └── assetsService.js               # API service layer
└── table/
    └── table.js                       # Assets table component
```

## 🚀 Features

### Core Functionality
- ✅ Create new asset assignments for employees
- ✅ Edit existing asset assignments
- ✅ Delete asset assignments
- ✅ View all assets in a comprehensive table
- ✅ Multiple assets per employee support
- ✅ Comma-separated display for multiple assets

### Table Features
- 📊 Shows: Name, Employee ID, Department, Asset Type, Asset No, Collection Date, Actions
- 🔍 Search functionality
- 📄 Pagination support
- ⚡ Sorting capabilities
- 📱 Responsive design

### Form Features
- 📝 Employee information form with validation
- ➕ Dynamic asset addition/removal
- 📅 Date pickers for issue and collection dates
- ⚠️ Comprehensive form validation
- 🔄 Real-time error feedback

## 🎯 Usage

### Basic Usage
```jsx
import AssetsManagement from './assetsManagement';

function App() {
  return <AssetsManagement />;
}
```

### API Integration
The system integrates with the following backend endpoints:
- `POST /add-asset` - Create new asset
- `GET /allAssets` - Get all assets
- `GET /singleAsset/:id` - Get single asset
- `PUT /updateAsset/:id` - Update asset
- `DELETE /delete/:id` - Delete asset
- `GET /assets/employee/:employeeId` - Get assets by employee

## 🛠️ Components

### AssetsManagementSystem (Main Component)
The main component that orchestrates the entire assets management functionality.

**Props:** None (self-contained)

### EmployeeDetailsForm
Form component for capturing employee information.

**Props:**
- `formData`: Object containing employee data
- `handleChange`: Function to handle form field changes
- `errors`: Object containing validation errors

### AssetsManagementTable
Table component displaying all assets with actions.

**Props:**
- `onEdit`: Function called when edit button is clicked
- `refreshTable`: Boolean to trigger table refresh

## 🔧 Custom Hook

### useAssetsManagement
Custom hook that manages all state and operations for the assets management system.

**Returns:**
- State variables (formData, assetForms, loading states, etc.)
- Action functions (handleSubmit, handleEdit, handleReset, etc.)

## 📋 Constants

### Asset Types
Pre-defined asset types available for selection:
- Laptop, Mobile Phone, Monitor, Desktop
- Tablet, Headphones, Mouse, Keyboard
- Printer, Scanner, Webcam, Docking Station
- External Hard Drive, USB Drive, Network Equipment
- Software License, Office Chair, Desk, Other

## 🔒 Validation Rules

### Employee Fields (Required)
- Full Name
- Employee ID
- Department
- Position
- Work Location

### Asset Fields (Required)
- Asset Type
- Asset Number
- Issue Date
- Collection Date

## 🎨 Styling

The components use Material-UI theming and follow the existing application design patterns:
- Consistent color scheme (#847F3B for primary actions)
- Responsive breakpoints
- Consistent spacing and typography
- Form validation styling

## 🔄 State Management

The system uses local state management with custom hooks:
- Form state management
- Validation state
- Loading states
- Edit mode tracking
- Error handling

## 📱 Responsive Design

The interface adapts to different screen sizes:
- Mobile-first approach
- Responsive grid layouts
- Touch-friendly interactions
- Optimized for tablets and mobile devices

## 🚨 Error Handling

Comprehensive error handling includes:
- Form validation errors
- API request/response errors
- Network error handling
- User-friendly error messages
- Toast notifications for feedback

## 🔍 Search and Filtering

- Real-time search across all asset fields
- Advanced filtering capabilities
- Sort by any column
- Pagination for large datasets

## 📊 Data Flow

1. User inputs employee and asset information
2. Form validation occurs in real-time
3. On submission, data is sent to backend API
4. Success/error feedback is provided via toast notifications
5. Table refreshes to show updated data
6. Edit operations pre-populate forms with existing data

## 🎯 Best Practices

- Separation of concerns (hooks, services, components)
- Reusable components and utilities
- Consistent error handling
- Clean code structure
- Comprehensive validation
- User-friendly interface

## 🔧 Customization

To customize the system:
1. Modify `assetConstants.js` for different asset types
2. Update `assetsService.js` for different API endpoints
3. Extend validation rules in the custom hook
4. Customize styling through Material-UI theme overrides 