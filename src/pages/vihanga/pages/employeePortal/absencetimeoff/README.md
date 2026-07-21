# Professional Leave Management System

A comprehensive, role-based Leave Management System for employees, managers, and HR administrators with professional UI/UX design and modern theming.

## Overview

This system provides a complete leave management solution with role-based access control, multi-level approval workflows, and professional user interface design. It includes dedicated components for different user roles and comprehensive leave tracking capabilities.

## System Components

### 1. Leave History (`leaveHistory/index.js`)
**Purpose**: Main component for viewing and managing leave requests with role-based functionality

**Key Features**:
- **Professional Status Display**: Clean status indicators without emojis, using professional color schemes
- **Role-Based Data Access**: 
  - Employees see their own leave requests
  - Managers see requests requiring their approval
  - HR/Admin see all company requests
- **Advanced Approval Interface**: Professional approval/rejection dialogs with comment fields
- **Responsive Design**: Desktop table view with mobile-optimized card layout
- **Professional Theming**: Modern Material-UI design with consistent color schemes
- **Enhanced Leave Details**: Comprehensive modal with workflow visualization
- **Action Management**: Context-aware action buttons based on user permissions

### 2. Pending Approvals (`pendingApprovals/index.js`)
**Purpose**: Dedicated dashboard for managers to handle pending approval requests

**Key Features**:
- **Professional Statistics Dashboard**: Gradient cards showing approval metrics
- **Quick Approval Actions**: Direct approve/reject functionality from card view
- **Professional Request Cards**: Employee avatars, detailed information, and status indicators
- **Urgent Request Handling**: Special highlighting for urgent requests
- **Professional Approval Dialog**: Comprehensive approval interface with validation
- **Real-time Updates**: Automatic refresh after approval actions

### 3. Mobile Leave Card (`MobileLeaveCard.js`)
**Purpose**: Professional mobile-optimized component for leave request display

**Key Features**:
- **Professional Card Design**: Modern card layout with proper spacing and typography
- **Employee Information Display**: Avatar, name, and department with clean layout
- **Enhanced Status Indicators**: Professional status chips with icons and proper colors
- **Touch-Friendly Actions**: Large, accessible buttons for mobile interactions
- **Professional Styling**: Consistent theming with hover effects and transitions
- **Detailed Information Layout**: Organized sections for leave details and metadata

## Professional Design System

### Status Management
- **Approved**: Professional green (#2E7D32) with success icons
- **Pending**: Professional orange (#F57C00) with time icons  
- **Rejected**: Professional red (#D32F2F) with cancel icons
- **Cancelled**: Professional gray (#616161) with block icons

### UI Components
- **Material-UI Integration**: Consistent use of Material-UI components
- **Professional Color Palette**: Business-appropriate color schemes
- **Modern Typography**: Clean, readable fonts with proper hierarchy
- **Responsive Design**: Mobile-first approach with desktop enhancements
- **Accessibility**: Proper contrast ratios and keyboard navigation

### Modal Dialogs
- **Professional Approval Dialog**: 
  - Color-coded headers based on action type
  - Comprehensive request summary with grid layout
  - Validation for rejection reasons
  - Progress indicators during submission
- **Leave Details Modal**:
  - Structured information display
  - Workflow visualization with stepper component
  - Professional status indicators
  - Approval history with timeline

## Role-Based Access Control

### Employee Role
- **View Access**: Own leave requests only
- **Actions**: Create, edit (if pending), delete own requests
- **API Parameters**: `empId=userId&currentUserId=userId`

### Manager Role  
- **View Access**: Requests requiring their approval
- **Actions**: Approve, reject, view details of assigned requests
- **API Parameters**: `currentUserId=userId&viewType=pending-approvals`

### HR/Admin Role
- **View Access**: All company leave requests
- **Actions**: Full system access, view all requests
- **API Parameters**: `currentUserId=userId&viewType=all-leaves`

## API Integration

### Leave Data Fetching
```javascript
// Role-based parameter construction
const apiParams = {
  page: page + 1,
  limit: rowsPerPage,
  search,
  companyId,
  currentUserId, // Always included for role-based filtering
  ...filters,
};

// Role-specific parameters
if (effectiveViewMode === "employee") {
  apiParams.empId = currentUserId; // Show user's own leaves
} else if (effectiveViewMode === "manager") {
  apiParams.viewType = "pending-approvals"; // Show pending approvals
} else if (effectiveViewMode === "admin") {
  apiParams.viewType = "all-leaves"; // Show all company leaves
}
```

### Approval Workflow
```javascript
// Professional approval submission
const response = await axios.post(`${appURL}/recruitment/approve-leave?id=${leaveId}`, {
  approverId: currentUserId,
  action: 'approved' | 'rejected',
  comments: approvalComments,
  rejectionReason: rejectionReason // Required for rejections
});
```

## Component Usage

### Leave History Component
```jsx
import LeaveTable from './leaveHistory';

// Auto-detect role mode
<LeaveTable 
  onEdit={handleEdit}
  refreshTable={refreshTrigger}
  viewMode="auto" // or "employee", "manager", "admin"
/>
```

### Pending Approvals Component
```jsx
import PendingApprovals from './pendingApprovals';

// Manager dashboard
<PendingApprovals />
```

### Mobile Leave Card
```jsx
import MobileLeaveCard from './MobileLeaveCard';

<MobileLeaveCard
  leave={leaveData}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onViewDetails={handleViewDetails}
  onApprove={handleApprove}
  onReject={handleReject}
  canApprove={userCanApprove}
  canEdit={userCanEdit}
  canDelete={userCanDelete}
  canViewDetails={userCanViewDetails}
/>
```

## Professional Features

### Enhanced User Experience
- **Loading States**: Professional loading indicators with descriptive text
- **Error Handling**: User-friendly error messages and fallback states
- **Success Feedback**: Clear confirmation messages for all actions
- **Responsive Design**: Optimized for all device sizes
- **Professional Animations**: Subtle hover effects and transitions

### Data Presentation
- **Comprehensive Information Display**: All relevant leave details clearly presented
- **Professional Status Management**: Clear, business-appropriate status indicators
- **Structured Layouts**: Grid-based layouts for optimal information hierarchy
- **Professional Typography**: Consistent font weights and sizes

### Workflow Management
- **Multi-Level Approval Visualization**: Clear display of approval progress
- **Role-Based Action Availability**: Context-aware action buttons
- **Professional Approval Process**: Structured approval with validation
- **Audit Trail**: Complete history of all approval actions

## Technical Implementation

### State Management
- **Professional Loading States**: Clear feedback during data operations
- **Error Boundary Handling**: Graceful error management
- **Optimistic Updates**: Immediate UI feedback with rollback capability
- **Form Validation**: Professional form validation with user-friendly messages

### Performance Optimization
- **Efficient Data Fetching**: Role-based API calls to minimize data transfer
- **Responsive Design**: Mobile-first approach with progressive enhancement
- **Professional Caching**: Smart data caching for improved performance
- **Memory Management**: Proper cleanup of components and event listeners

### Security Considerations
- **Role-Based Access**: Server-side validation of user permissions
- **Data Filtering**: Proper filtering based on user roles
- **Input Validation**: Comprehensive validation of all user inputs
- **Professional Authentication**: Secure user authentication integration

## Integration Notes

### Backend Requirements
- Enhanced leave model with `approverLevels` and `currentApprovers`
- Role-based data filtering in API endpoints
- Approval workflow progression logic
- Professional audit trail management

### Frontend Dependencies
- Material-UI components for professional design
- Axios for API communication
- Moment.js for date formatting
- React hooks for state management

This professional leave management system provides a complete, role-based solution with modern UI/UX design suitable for enterprise environments. 