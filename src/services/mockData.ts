import {
  PatientFlowData,
  OccupancyData,
  ResourceUtilizationData,
  MedicineUsageData,
  FinanceKPI,
  FinanceDataPoint,
  StaffPerformanceData,
} from '../types/analytics';

export const mockPatientFlowData: PatientFlowData[] = [
  { date: '2024-01-01', admissions: 45, discharges: 38, transfers: 12, emergencyVisits: 78 },
  { date: '2024-01-02', admissions: 52, discharges: 41, transfers: 15, emergencyVisits: 82 },
  { date: '2024-01-03', admissions: 48, discharges: 45, transfers: 10, emergencyVisits: 75 },
  { date: '2024-01-04', admissions: 55, discharges: 47, transfers: 13, emergencyVisits: 88 },
  { date: '2024-01-05', admissions: 50, discharges: 43, transfers: 11, emergencyVisits: 80 },
  { date: '2024-01-06', admissions: 42, discharges: 40, transfers: 9, emergencyVisits: 71 },
  { date: '2024-01-07', admissions: 39, discharges: 36, transfers: 8, emergencyVisits: 68 },
];

export const mockOccupancyData: OccupancyData[] = [
  { department: 'ICU', occupancyRate: 85, totalBeds: 40, occupiedBeds: 34, availableBeds: 6 },
  { department: 'Emergency', occupancyRate: 72, totalBeds: 50, occupiedBeds: 36, availableBeds: 14 },
  { department: 'Surgery', occupancyRate: 68, totalBeds: 30, occupiedBeds: 20, availableBeds: 10 },
  { department: 'Pediatrics', occupancyRate: 55, totalBeds: 45, occupiedBeds: 25, availableBeds: 20 },
  { department: 'Maternity', occupancyRate: 78, totalBeds: 35, occupiedBeds: 27, availableBeds: 8 },
  { department: 'General Ward', occupancyRate: 62, totalBeds: 100, occupiedBeds: 62, availableBeds: 38 },
];

export const mockResourceUtilizationData: ResourceUtilizationData[] = [
  { resource: 'MRI Scanner', utilizationRate: 82, totalHours: 168, usedHours: 138, category: 'Imaging' },
  { resource: 'CT Scanner', utilizationRate: 75, totalHours: 168, usedHours: 126, category: 'Imaging' },
  { resource: 'X-Ray Machine', utilizationRate: 68, totalHours: 168, usedHours: 114, category: 'Imaging' },
  { resource: 'Operating Room 1', utilizationRate: 88, totalHours: 168, usedHours: 148, category: 'Surgery' },
  { resource: 'Operating Room 2', utilizationRate: 85, totalHours: 168, usedHours: 143, category: 'Surgery' },
  { resource: 'Ventilator', utilizationRate: 65, totalHours: 168, usedHours: 109, category: 'Equipment' },
];

export const mockMedicineUsageData: MedicineUsageData[] = [
  { medicineName: 'Paracetamol', quantity: 5000, cost: 1500, category: 'Pain Relief', date: '2024-01-01' },
  { medicineName: 'Amoxicillin', quantity: 3200, cost: 4800, category: 'Antibiotic', date: '2024-01-01' },
  { medicineName: 'Insulin', quantity: 1800, cost: 9000, category: 'Diabetes', date: '2024-01-01' },
  { medicineName: 'Aspirin', quantity: 4500, cost: 1350, category: 'Pain Relief', date: '2024-01-01' },
  { medicineName: 'Metformin', quantity: 2800, cost: 5600, category: 'Diabetes', date: '2024-01-01' },
  { medicineName: 'Lisinopril', quantity: 2200, cost: 6600, category: 'Cardiovascular', date: '2024-01-01' },
];

export const mockFinanceKPIs: FinanceKPI[] = [
  { metric: 'Total Revenue', value: 2450000, change: 12.5, trend: 'up' },
  { metric: 'Operating Expenses', value: 1850000, change: 5.2, trend: 'up' },
  { metric: 'Net Profit', value: 600000, change: 18.3, trend: 'up' },
  { metric: 'Patient Revenue', value: 1950000, change: 10.8, trend: 'up' },
  { metric: 'Operational Efficiency', value: 75.5, change: -2.1, trend: 'down' },
  { metric: 'Cost per Patient', value: 3500, change: -5.5, trend: 'down' },
];

export const mockFinanceData: FinanceDataPoint[] = [
  { date: '2024-01', revenue: 2100000, expenses: 1650000, profit: 450000 },
  { date: '2024-02', revenue: 2250000, expenses: 1700000, profit: 550000 },
  { date: '2024-03', revenue: 2300000, expenses: 1750000, profit: 550000 },
  { date: '2024-04', revenue: 2400000, expenses: 1800000, profit: 600000 },
  { date: '2024-05', revenue: 2350000, expenses: 1780000, profit: 570000 },
  { date: '2024-06', revenue: 2450000, expenses: 1850000, profit: 600000 },
];

export const mockStaffPerformanceData: StaffPerformanceData[] = [
  { staffId: 'S001', name: 'Dr. Sarah Johnson', department: 'Emergency', patientsHandled: 156, averageRating: 4.7, tasksCompleted: 142 },
  { staffId: 'S002', name: 'Dr. Michael Chen', department: 'Surgery', patientsHandled: 89, averageRating: 4.9, tasksCompleted: 85 },
  { staffId: 'S003', name: 'Nurse Emily Davis', department: 'ICU', patientsHandled: 203, averageRating: 4.6, tasksCompleted: 198 },
  { staffId: 'S004', name: 'Dr. James Wilson', department: 'Pediatrics', patientsHandled: 178, averageRating: 4.8, tasksCompleted: 165 },
  { staffId: 'S005', name: 'Nurse Robert Brown', department: 'Emergency', patientsHandled: 189, averageRating: 4.5, tasksCompleted: 180 },
  { staffId: 'S006', name: 'Dr. Lisa Anderson', department: 'Maternity', patientsHandled: 134, averageRating: 4.9, tasksCompleted: 128 },
];
