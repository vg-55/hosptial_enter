# Staff Management Module User Guide

## Overview
The Staff Management Module provides comprehensive tools for managing hospital staff, scheduling shifts, and tracking performance metrics.

## Access Requirements
- **Required Roles**: Admin, Manager
- **Permissions**: Viewer role cannot access staff management features

## Features

### 1. Staff Dashboard (`/staff`)
Central hub displaying:
- Total staff count with hiring trends
- Active shift statistics
- Average performance ratings
- Vacancy rates
- Quick access to key functions

**Navigation Cards:**
- Staff Directory - Browse and manage profiles
- Shift Scheduling - Manage staff schedules
- Performance Tracking - View performance metrics

### 2. Staff Directory (`/staff/list`)

#### Staff Profiles
Each profile includes:
- Employee ID and contact information
- Role and department
- Specialization
- Employment status (Active, On Leave, Inactive)
- Hire date
- Certifications and credentials

#### Searching and Filtering
- **Search**: Find staff by name, email, or employee ID
- **Department Filter**: View staff by department
  - Emergency
  - Surgery
  - ICU
  - Pediatrics
  - Maternity
  - And more
- **Status Filter**: Filter by employment status

#### Managing Staff
1. Click "Add Staff" to create new profile
2. Fill in required information
3. Add certifications and credentials
4. Assign to department
5. Set employment status

### 3. Shift Scheduler (`/staff/schedule`)

#### Shift Types
- **Morning Shift**: 7:00 AM - 3:00 PM (Color: Blue)
- **Afternoon Shift**: 3:00 PM - 11:00 PM (Color: Yellow)
- **Night Shift**: 11:00 PM - 7:00 AM (Color: Purple)
- **On-Call**: As needed (Color: Red)

#### Viewing Shifts
1. Select date from calendar picker
2. Filter by department (optional)
3. View all shifts for selected criteria
4. Shifts display:
   - Staff member name
   - Department
   - Shift time range
   - Shift type
   - Status (Scheduled, In Progress, Completed, Cancelled)
   - Location
   - Notes

#### Creating Shifts
1. Click "Create Shift" button
2. Select staff member
3. Choose shift type
4. Set start and end times
5. Assign location
6. Add notes (optional)
7. Submit to schedule

#### Shift Status
- **Scheduled**: Future shift, not yet started
- **In Progress**: Currently active shift
- **Completed**: Shift finished
- **Cancelled**: Shift cancelled

### 4. Performance Tracking (`/staff-performance`)
Linked to existing performance dashboard showing:
- Patients handled per staff member
- Average ratings
- Tasks completed
- Attendance rates
- Punctuality scores
- Performance trends over time

## Department Management

### Available Departments
1. **Emergency** - 24/7 acute care
2. **Surgery** - Surgical procedures
3. **ICU** - Critical care
4. **Pediatrics** - Child healthcare
5. **Maternity** - Obstetric services
6. **General Ward** - Inpatient care
7. **Radiology** - Imaging services
8. **Laboratory** - Testing services

### Department Information
- Department code
- Department head
- Staff count
- Description

## Role-Based Access Control

### Admin Access
- Full access to all staff management features
- Create, edit, delete staff profiles
- Schedule and modify shifts
- View all performance data
- Manage departments

### Manager Access
- View staff profiles
- Schedule shifts for their department
- View performance metrics
- Limited editing capabilities

### Viewer Access
- No access to staff management features
- Can only view their own performance data

## Accessibility Features

### Keyboard Navigation
- Tab through schedule calendar
- Arrow keys to navigate dates
- Enter to select dates
- Escape to close dialogs

### Screen Reader Support
- Shift cards announce type, time, and staff
- Status changes announced
- Form field labels clearly defined
- Error messages read aloud

### Visual Accessibility
- Color-coded shifts with text labels (not color-only)
- High contrast status indicators
- Large touch targets for mobile
- Readable font sizes

## Best Practices

### Scheduling
1. Schedule shifts at least 1 week in advance
2. Avoid back-to-back night shifts
3. Distribute weekend shifts fairly
4. Consider staff preferences and availability
5. Maintain adequate coverage per department

### Staff Management
1. Keep certifications up to date
2. Review performance metrics monthly
3. Address low performance proactively
4. Recognize high performers
5. Maintain accurate contact information

### Performance Tracking
1. Set clear performance goals
2. Provide regular feedback
3. Document significant events
4. Use data to identify training needs
5. Track trends over time

## Compliance & Security

### Data Protection
- RBAC enforced at all levels
- Audit logging of all access
- Secure storage of personal information
- Session management and timeout

### Labor Compliance
- Shift hour tracking
- Overtime monitoring
- Break time enforcement
- Fair scheduling practices

## Troubleshooting

### Common Issues
- **Cannot see staff member**: Check department filter settings
- **Shift not appearing**: Verify date selection and department filter
- **Cannot create shift**: Ensure all required fields are filled
- **Performance data missing**: Check date range selection
- **Search not working**: Clear filters and try different search terms

### Support
For technical issues or questions:
- Contact IT Support
- Check system status page
- Review user guide
- Submit help ticket

## Tips for Efficiency
1. Use department filters to reduce clutter
2. Bookmark frequently used pages
3. Set up recurring shifts in advance
4. Export schedules for printing
5. Use search for quick staff lookup
6. Review audit logs for accountability
