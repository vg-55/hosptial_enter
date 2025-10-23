# Analytics Module Usage Guide

This guide provides detailed instructions for using and extending the analytics module in the Management Analytics Dashboard.

## Table of Contents

1. [Overview](#overview)
2. [Dashboard Features](#dashboard-features)
3. [Custom Report Builder](#custom-report-builder)
4. [Data Filtering](#data-filtering)
5. [Export Functionality](#export-functionality)
6. [API Integration](#api-integration)
7. [Adding New Dashboards](#adding-new-dashboards)
8. [Customization](#customization)

## Overview

The analytics module provides comprehensive insights into various aspects of healthcare facility management through specialized dashboards and a flexible custom report builder.

## Dashboard Features

### Patient Flow Dashboard

**Purpose**: Monitor patient movements and track admission/discharge patterns

**Metrics Displayed**:
- Total Admissions
- Total Discharges
- Total Transfers
- Emergency Visits

**Visualizations**:
- Line chart showing trends over time
- Bar chart for daily comparisons

**Use Cases**:
- Identify peak admission times
- Track emergency department load
- Analyze discharge patterns
- Plan staffing based on patient flow

### Occupancy Dashboard

**Purpose**: Monitor bed utilization across departments

**Metrics Displayed**:
- Overall occupancy rate
- Total beds available
- Available beds by department
- Department-wise occupancy rates

**Visualizations**:
- Horizontal bar chart for occupancy rates
- Pie chart for bed distribution
- Detailed data table

**Use Cases**:
- Optimize bed allocation
- Identify capacity constraints
- Plan for peak periods
- Balance department loads

### Resource Utilization Dashboard

**Purpose**: Track equipment and facility usage

**Metrics Displayed**:
- Average utilization rate
- Total resources tracked
- High utilization resources (>80%)
- Category-wise filtering

**Visualizations**:
- Horizontal bar chart for utilization rates
- Pie chart for hours distribution
- Color-coded status indicators

**Use Cases**:
- Schedule maintenance
- Identify underutilized resources
- Optimize resource allocation
- Plan equipment purchases

### Medicine Usage Dashboard

**Purpose**: Monitor medicine consumption and costs

**Metrics Displayed**:
- Total cost
- Total quantity consumed
- Average cost per unit
- Category-wise analysis

**Visualizations**:
- Bar charts for cost and quantity
- Pie chart for category distribution
- Detailed medicine data table

**Use Cases**:
- Control medicine costs
- Track inventory needs
- Identify high-cost medicines
- Analyze usage patterns

### Finance KPI Dashboard

**Purpose**: Track financial performance metrics

**Metrics Displayed**:
- Total Revenue
- Operating Expenses
- Net Profit
- Patient Revenue
- Operational Efficiency
- Cost per Patient

**Visualizations**:
- KPI cards with trend indicators
- Line chart for financial trends
- Bar chart for monthly comparison
- Detailed financial data table

**Use Cases**:
- Monitor financial health
- Identify cost optimization opportunities
- Track revenue trends
- Calculate profit margins

### Staff Performance Dashboard

**Purpose**: Evaluate staff productivity and quality

**Metrics Displayed**:
- Average rating
- Total patients handled
- Staff member count
- Department-wise filtering

**Visualizations**:
- Horizontal bar charts for patients and ratings
- Scatter plot for performance overview
- Detailed staff data table with ratings

**Use Cases**:
- Identify top performers
- Allocate resources effectively
- Track productivity trends
- Support performance reviews

## Custom Report Builder

### Creating a Custom Report

1. **Navigate** to Custom Reports from the main menu
2. **Enter a report name** in the Report Name field
3. **Select dimensions** to group your data:
   - Date: Group by date
   - Department: Group by department
   - Category: Group by category
   - Staff Member: Group by staff
4. **Choose metrics** to measure:
   - Patient Count
   - Revenue
   - Cost
   - Utilization Rate
   - Rating
   - Occupancy Rate
5. **Set date range** using the date filter
6. **Click "Generate Report"** to create the report
7. **View results** in chart and table format

### Saving Report Configurations

1. Configure your report dimensions and metrics
2. Click "Save Configuration"
3. Report settings are stored in browser local storage
4. Reuse saved configurations for recurring reports

### Aggregation Methods

- **Sum**: Total of all values
- **Average (Avg)**: Mean of all values
- **Count**: Number of records
- **Min**: Minimum value
- **Max**: Maximum value

## Data Filtering

### Date Range Filtering

All dashboards support date range filtering:

1. **Quick Selections**:
   - Last 7 Days
   - This Month
   - Last Month

2. **Custom Range**:
   - Select Start Date
   - Select End Date
   - Data automatically updates

### Category Filtering

Some dashboards support category filtering:

- **Resource Utilization**: Filter by category (Imaging, Surgery, Equipment, etc.)
- **Staff Performance**: Filter by department

## Export Functionality

### Exporting Data

1. **Click the Export button** on any dashboard
2. **Choose format**:
   - CSV: For Excel and spreadsheet applications
   - JSON: For programmatic access and data processing

3. **File downloads automatically** with descriptive name

### Export Formats

**CSV Format**:
- Header row with column names
- Comma-separated values
- Quoted strings for text fields
- Compatible with Excel, Google Sheets

**JSON Format**:
- Pretty-printed JSON array
- Complete data structure
- Suitable for APIs and data processing

## API Integration

### Backend Endpoint Requirements

The analytics module expects the following REST API endpoints:

#### Patient Flow Endpoint
```
GET /api/analytics/patient-flow
Query Parameters:
  - startDate: ISO date string
  - endDate: ISO date string
  - department: optional string
  - facility: optional string

Response: Array of PatientFlowData
[
  {
    date: "2024-01-01",
    admissions: 45,
    discharges: 38,
    transfers: 12,
    emergencyVisits: 78
  }
]
```

#### Occupancy Endpoint
```
GET /api/analytics/occupancy
Response: Array of OccupancyData
[
  {
    department: "ICU",
    occupancyRate: 85,
    totalBeds: 40,
    occupiedBeds: 34,
    availableBeds: 6
  }
]
```

#### Resource Utilization Endpoint
```
GET /api/analytics/resource-utilization
Response: Array of ResourceUtilizationData
[
  {
    resource: "MRI Scanner",
    utilizationRate: 82,
    totalHours: 168,
    usedHours: 138,
    category: "Imaging"
  }
]
```

#### Medicine Usage Endpoint
```
GET /api/analytics/medicine-usage
Response: Array of MedicineUsageData
[
  {
    medicineName: "Paracetamol",
    quantity: 5000,
    cost: 1500,
    category: "Pain Relief",
    date: "2024-01-01"
  }
]
```

#### Finance KPIs Endpoint
```
GET /api/analytics/finance-kpis
Response: Array of FinanceKPI
[
  {
    metric: "Total Revenue",
    value: 2450000,
    change: 12.5,
    trend: "up"
  }
]
```

#### Finance Data Endpoint
```
GET /api/analytics/finance-data
Response: Array of FinanceDataPoint
[
  {
    date: "2024-01",
    revenue: 2100000,
    expenses: 1650000,
    profit: 450000
  }
]
```

#### Staff Performance Endpoint
```
GET /api/analytics/staff-performance
Response: Array of StaffPerformanceData
[
  {
    staffId: "S001",
    name: "Dr. Sarah Johnson",
    department: "Emergency",
    patientsHandled: 156,
    averageRating: 4.7,
    tasksCompleted: 142
  }
]
```

#### Custom Report Endpoint
```
POST /api/analytics/custom-report
Request Body: CustomReportConfig
{
  name: "Report Name",
  dimensions: ["date", "department"],
  metrics: ["patients", "revenue"],
  filters: {
    dateRange: {
      startDate: "2024-01-01",
      endDate: "2024-01-31"
    }
  },
  groupBy: "department"
}

Response: Array of report data
```

#### Export Endpoint
```
POST /api/analytics/export
Request Body:
{
  format: "csv" | "excel" | "pdf",
  data: Array<any>,
  filename: string
}

Response: Blob (file download)
```

### Authentication

All API requests include an Authorization header:
```
Authorization: Bearer <token>
```

The token is automatically included from the authentication store.

### Error Handling

API errors are handled gracefully:
- 401 Unauthorized: Redirects to login
- Other errors: Displays error message to user
- Failed requests are retried once automatically

## Adding New Dashboards

### Step 1: Create Types

Add new data types in `src/types/analytics.ts`:

```typescript
export interface NewDashboardData {
  id: string;
  name: string;
  value: number;
  // ... other fields
}
```

### Step 2: Add Service Method

Add API method in `src/services/analyticsService.ts`:

```typescript
getNewData: async (filters: FilterOptions): Promise<NewDashboardData[]> => {
  const { data } = await apiClient.get('/analytics/new-data', { params: filters });
  return data;
}
```

### Step 3: Create Hook

Add custom hook in `src/hooks/useAnalytics.ts`:

```typescript
export const useNewData = (filters: FilterOptions) => {
  return useQuery({
    queryKey: ['newData', filters],
    queryFn: async () => {
      return analyticsService.getNewData(filters);
    },
  });
};
```

### Step 4: Create Dashboard Component

Create new page in `src/pages/NewDashboard.tsx`:

```typescript
import { useState } from 'react';
import DateRangeFilter from '../components/DateRangeFilter';
import ExportButton from '../components/ExportButton';
import { useNewData } from '../hooks/useAnalytics';

export default function NewDashboard() {
  const [dateRange, setDateRange] = useState(getDefaultDateRange());
  const { data, isLoading, error } = useNewData({ dateRange });

  return (
    <div className="space-y-6">
      <h1>New Dashboard</h1>
      <DateRangeFilter dateRange={dateRange} onChange={setDateRange} />
      {/* Add visualizations */}
    </div>
  );
}
```

### Step 5: Add Route

Update `src/App.tsx`:

```typescript
import NewDashboard from './pages/NewDashboard';

// In Routes:
<Route path="/new-dashboard" element={<NewDashboard />} />
```

### Step 6: Add Navigation

Update `src/components/Layout.tsx`:

```typescript
const menuItems = [
  // ... existing items
  { path: '/new-dashboard', icon: YourIcon, label: 'New Dashboard' },
];
```

## Customization

### Changing Chart Colors

Update colors in dashboard components:

```typescript
const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
```

### Modifying Cache Duration

Update cache settings in `src/main.tsx`:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 20 * 60 * 1000, // 20 minutes
    },
  },
});
```

### Customizing Theme

Update Tailwind configuration in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      },
    },
  },
}
```

### Adding New Chart Types

Import additional Recharts components:

```typescript
import { RadarChart, Radar, AreaChart, Area } from 'recharts';
```

## Best Practices

1. **Always apply date filters** to limit data volume
2. **Use appropriate chart types** for your data
3. **Export data regularly** for backup and analysis
4. **Save custom report configurations** for recurring reports
5. **Monitor performance metrics** regularly
6. **Review role-based access** for sensitive data
7. **Test filters thoroughly** before generating reports
8. **Document custom configurations** for team reference

## Troubleshooting

### Data Not Loading

- Check browser console for errors
- Verify backend API is running
- Confirm authentication token is valid
- Check network requests in browser DevTools

### Charts Not Rendering

- Ensure data is in correct format
- Verify all required fields are present
- Check for JavaScript errors in console
- Confirm chart dimensions are valid

### Export Not Working

- Check browser pop-up blocker
- Verify data is loaded before exporting
- Ensure sufficient browser permissions
- Try different export format

### Performance Issues

- Reduce date range for queries
- Enable data caching
- Limit number of data points in charts
- Use pagination for large tables

## Support

For additional help or questions about the analytics module, please refer to the main README or contact the development team.
