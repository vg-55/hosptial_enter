# Management Analytics Dashboard

A comprehensive management analytics dashboard for healthcare facilities, providing real-time insights into patient flow, occupancy, resource utilization, medicine usage, financial KPIs, and staff performance.

## Features

### Analytics Dashboards

- **Patient Flow Dashboard**: Track admissions, discharges, transfers, and emergency visits with interactive charts
- **Occupancy Dashboard**: Monitor bed occupancy rates across departments
- **Resource Utilization Dashboard**: Analyze equipment and facility usage
- **Medicine Usage Dashboard**: Track medicine consumption and costs by category
- **Finance KPI Dashboard**: Review financial performance metrics and trends
- **Staff Performance Dashboard**: Evaluate staff productivity and ratings

### Custom Report Builder

- Configure custom reports with flexible dimensions and metrics
- Select from various aggregation methods (sum, avg, count, min, max)
- Save report configurations for reuse
- Export reports in CSV or JSON format
- Interactive data visualization

### Key Capabilities

- **Responsive Design**: Mobile-friendly interface that works on all devices
- **Date Range Filtering**: Filter data by custom date ranges or quick selections
- **Data Export**: Export reports and analytics data in CSV or JSON formats
- **Role-Based Access Control**: Support for Admin, Manager, and Viewer roles
- **Data Caching**: Optimized data fetching with automatic caching and background refresh
- **Visual Charts**: Interactive charts using Recharts library
- **Real-time Updates**: Automatic data refresh with configurable intervals

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Charts**: Recharts
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Testing**: Vitest + Playwright
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Running Tests

```bash
# Run unit tests
npm test

# Run e2e tests
npm run test:e2e

# Type checking
npm run type-check

# Linting
npm run lint
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx
│   ├── DateRangeFilter.tsx
│   ├── ExportButton.tsx
│   ├── LoadingSpinner.tsx
│   ├── ErrorMessage.tsx
│   └── StatCard.tsx
├── pages/              # Dashboard pages
│   ├── DashboardOverview.tsx
│   ├── PatientFlowDashboard.tsx
│   ├── OccupancyDashboard.tsx
│   ├── ResourceUtilizationDashboard.tsx
│   ├── MedicineUsageDashboard.tsx
│   ├── FinanceKPIDashboard.tsx
│   ├── StaffPerformanceDashboard.tsx
│   └── CustomReportBuilder.tsx
├── services/           # API and data services
│   ├── api.ts
│   ├── analyticsService.ts
│   └── mockData.ts
├── hooks/              # Custom React hooks
│   └── useAnalytics.ts
├── store/              # State management
│   └── authStore.ts
├── types/              # TypeScript type definitions
│   └── analytics.ts
├── utils/              # Utility functions
│   ├── dateUtils.ts
│   └── exportUtils.ts
└── test/               # Test setup and utilities
    └── setup.ts

e2e/                    # End-to-end tests
└── dashboard.spec.ts
```

## Authentication

The application includes role-based authentication. For demo purposes, you can use these credentials:

- **Admin**: admin@hospital.com (full access)
- **Manager**: manager@hospital.com (read/write access)
- **Viewer**: viewer@hospital.com (read-only access)

Password: Any non-empty string

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Backend Integration

The application is configured to work with backend analytics endpoints. Update the `USE_MOCK_DATA` constant in `src/hooks/useAnalytics.ts` to switch between mock data and real API calls.

Expected backend endpoints:

- `GET /api/analytics/patient-flow`
- `GET /api/analytics/occupancy`
- `GET /api/analytics/resource-utilization`
- `GET /api/analytics/medicine-usage`
- `GET /api/analytics/finance-kpis`
- `GET /api/analytics/finance-data`
- `GET /api/analytics/staff-performance`
- `POST /api/analytics/custom-report`
- `POST /api/analytics/export`

All endpoints accept filter parameters including `dateRange`, `department`, `facility`, etc.

## Data Caching

The application uses TanStack Query for data management with the following cache configuration:

- **Stale Time**: 5 minutes
- **Cache Time**: 10 minutes
- **Refetch on Window Focus**: Disabled
- **Retry**: 1 attempt

## Custom Reports

The Custom Report Builder allows users to:

1. Select dimensions (Date, Department, Category, Staff Member)
2. Choose metrics (Patient Count, Revenue, Cost, Utilization Rate, etc.)
3. Configure aggregation methods
4. Apply date range filters
5. Generate interactive visualizations
6. Export results
7. Save report configurations for reuse

## Export Options

Data can be exported in the following formats:

- **CSV**: Comma-separated values for spreadsheet applications
- **JSON**: Structured data for programmatic access

## Accessibility

The dashboard follows web accessibility best practices:

- Semantic HTML structure
- ARIA labels where appropriate
- Keyboard navigation support
- Responsive design for all screen sizes
- High contrast color schemes

## Performance Optimization

- Code splitting with React lazy loading
- Optimized chart rendering with Recharts
- Efficient data caching with React Query
- Minimized re-renders with proper memoization
- Production build optimization with Vite

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and ensure they pass
5. Submit a pull request

## License

This project is proprietary software for healthcare management.

## Support

For questions or issues, please contact the development team.
