# Dashboard API Integration

This document describes the robust and professional integration of the dashboard API (`/api/dashboard/getDashboardData`) into the Vihanga dashboard components.

## Overview

The dashboard has been completely refactored to use real data from the API instead of static data. The integration includes:

- **Centralized Data Management**: Using React Context for state management
- **Robust Error Handling**: Comprehensive loading, error, and no-data states
- **Professional UX**: Beautiful loading skeletons and error recovery options
- **Type Safety**: Proper data validation and fallbacks
- **Performance**: Optimized API calls with proper caching

## Architecture

### 1. API Service Layer
- **File**: `src/service/apiVariables.js`
- **Endpoint**: `dashboard/getDashboardData`
- **Method**: GET
- **Parameters**: `companyId`, `type`, `userId`

### 2. Custom Hook
- **File**: `src/pages/vihanga/pages/dashboard/hooks/useDashboardData.js`
- **Purpose**: Manages API calls, loading states, and error handling
- **Features**: 
  - Automatic retry on failure
  - Loading state management
  - Error boundary support

### 3. Context Provider
- **File**: `src/pages/vihanga/pages/dashboard/context/DashboardContext.js`
- **Purpose**: Shares dashboard data across all components
- **Features**:
  - Global state management
  - Type switching (me/myTeam/company)
  - Data refresh capabilities

### 4. Loading Components
- **File**: `src/pages/vihanga/pages/dashboard/components/LoadingState.js`
- **Components**:
  - `LoadingState`: Skeleton loading with title
  - `ErrorState`: Error display with retry option
  - `NoDataState`: Empty state with custom message

## API Response Structure

The dashboard expects the following API response structure:

```javascript
{
  success: true,
  data: {
    headerCards: {
      myActiveTasks: { total: number, urgent: number },
      teamAttendance: { presentPercent: number },
      punctualityScore: number,
      myAchievements: { thisMonth: number }
    },
    tasksDashboard: {
      kpiTasks: number,
      adHocTasks: number,
      urgent: number,
      recent: Array
    },
    leaderboard: {
      company: Array,
      departments: Array
    },
    okrProgress: {
      onTrack: number,
      offTrack: number,
      atRisk: number
    },
    todaysAttendance: {
      presentPercent: number,
      presentCount: number,
      totalEmployees: number,
      lateArrivals: number,
      onLeave: number,
      nextHoliday: { name: string, date: string }
    },
    performanceTrend: Array,
    birthdays: Array,
    anniversaries: Array
  }
}
```

## Component Integration

### Updated Components

1. **Top KPI Cards** (`top-kpi-section/index.js`)
   - Uses `headerCards` data
   - Shows real task counts, attendance, and achievements
   - Dynamic warning indicators for urgent tasks

2. **Task Dashboard** (`task-dashboard/`)
   - Uses `tasksDashboard` data
   - Real-time task statistics
   - Recent tasks display

3. **OKR Progress** (`okr-progress/index.js`)
   - Uses `okrProgress` data
   - Dynamic pie chart with real percentages
   - Color-coded status indicators

4. **Attendance Card** (`today-attendance/index.js`)
   - Uses `todaysAttendance` data
   - Real attendance percentages
   - Next holiday information

5. **Reward Points Leaderboard** (`reward-points-leaderboard/index.js`)
   - Uses `leaderboard` data
   - Company and department views
   - Real employee rankings

6. **Performance Trend** (`performance-trend-dashboard/index.js`)
   - Uses `performanceTrend` data
   - Dynamic bar chart
   - Current vs target comparisons

7. **Birthday List** (`birthday-list/index.js`)
   - Uses `birthdays` data
   - Real employee birthdays
   - Avatar fallbacks

8. **Anniversary List** (`anniversary-list/index.js`)
   - Uses `anniversaries` data
   - Real work anniversaries
   - Consistent styling

9. **Available Rewards** (`available-rewards/index.js`)
   - Dynamic reward points display
   - User-specific point calculation
   - Fallback to static rewards

10. **Recent Updates** (`recent-updates/index.js`)
    - Smart update generation based on real data
    - Contextual notifications
    - Dynamic content based on dashboard state

## Error Handling

### Loading States
- Skeleton loading with realistic placeholders
- Consistent styling across all components
- Configurable height and title

### Error States
- User-friendly error messages
- Retry functionality
- Proper error boundaries

### No Data States
- Informative empty state messages
- Consistent styling
- Helpful guidance for users

## Features

### 1. Robust Data Validation
- Null/undefined checks for all data properties
- Fallback values for missing data
- Graceful degradation

### 2. Professional UX
- Smooth loading transitions
- Consistent error handling
- Beautiful empty states

### 3. Performance Optimization
- Single API call for all dashboard data
- Context-based state sharing
- Efficient re-renders

### 4. Type Safety
- Proper data structure validation
- Type checking for API responses
- Safe property access

### 5. Accessibility
- Proper ARIA labels
- Keyboard navigation support
- Screen reader friendly

## Usage

### Basic Implementation

```javascript
import { useDashboardContext } from './context/DashboardContext';

const MyComponent = () => {
  const { data, loading, error, refetch } = useDashboardContext();
  
  if (loading) return <LoadingState title="Loading..." />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;
  if (!data) return <NoDataState message="No data available" />;
  
  return <div>{/* Your component content */}</div>;
};
```

### Switching Dashboard Types

```javascript
import { useDashboardContext } from './context/DashboardContext';

const DashboardSelector = () => {
  const { dashboardType, setDashboardType } = useDashboardContext();
  
  return (
    <select value={dashboardType} onChange={(e) => setDashboardType(e.target.value)}>
      <option value="me">My Dashboard</option>
      <option value="myTeam">My Team</option>
      <option value="company">Company</option>
    </select>
  );
};
```

## Configuration

### API Configuration
- Base URL: Configured in `src/service/api.js`
- Authentication: Bearer token from localStorage
- Error handling: Centralized in API service

### Environment Variables
- `REACT_APP_BASE_URL`: API base URL
- Environment-specific configurations in `src/utilities/baseurl.js`

## Best Practices

1. **Always check for data existence** before rendering
2. **Use loading states** for better UX
3. **Handle errors gracefully** with retry options
4. **Provide fallback values** for missing data
5. **Use consistent styling** across all states
6. **Implement proper accessibility** features

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live data
2. **Caching**: Implement data caching for better performance
3. **Offline Support**: Service worker for offline functionality
4. **Advanced Filtering**: More granular data filtering options
5. **Export Features**: Data export capabilities
6. **Customization**: User-configurable dashboard layouts

## Troubleshooting

### Common Issues

1. **API Not Responding**
   - Check network connectivity
   - Verify API endpoint configuration
   - Check authentication token

2. **Data Not Loading**
   - Verify API response structure
   - Check data validation logic
   - Review error handling

3. **Component Not Updating**
   - Ensure proper context usage
   - Check component dependencies
   - Verify state management

### Debug Mode

Enable debug logging by setting:
```javascript
localStorage.setItem('dashboardDebug', 'true');
```

This will log API calls, data transformations, and error details to the console.

## Support

For issues or questions regarding the dashboard integration:

1. Check the browser console for error messages
2. Verify API endpoint accessibility
3. Review data structure compatibility
4. Test with different user roles and permissions
