export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface FilterOptions {
  dateRange: DateRange;
  department?: string;
  facility?: string;
  [key: string]: unknown;
}

export interface PatientFlowData {
  date: string;
  admissions: number;
  discharges: number;
  transfers: number;
  emergencyVisits: number;
}

export interface OccupancyData {
  department: string;
  occupancyRate: number;
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
}

export interface ResourceUtilizationData {
  resource: string;
  utilizationRate: number;
  totalHours: number;
  usedHours: number;
  category: string;
}

export interface MedicineUsageData {
  medicineName: string;
  quantity: number;
  cost: number;
  category: string;
  date: string;
}

export interface FinanceKPI {
  metric: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

export interface FinanceDataPoint {
  date: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface StaffPerformanceData {
  staffId: string;
  name: string;
  department: string;
  patientsHandled: number;
  averageRating: number;
  tasksCompleted: number;
}

export interface ReportDimension {
  id: string;
  label: string;
  type: 'date' | 'category' | 'numeric';
}

export interface ReportMetric {
  id: string;
  label: string;
  aggregation: 'sum' | 'avg' | 'count' | 'min' | 'max';
}

export interface CustomReportConfig {
  name: string;
  dimensions: string[];
  metrics: string[];
  filters: FilterOptions;
  groupBy?: string;
}

export interface ExportFormat {
  format: 'csv' | 'excel' | 'pdf';
  data: unknown[];
  filename: string;
}
