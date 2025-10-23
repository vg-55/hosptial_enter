import { apiClient } from './api';
import {
  PatientFlowData,
  OccupancyData,
  ResourceUtilizationData,
  MedicineUsageData,
  FinanceKPI,
  FinanceDataPoint,
  StaffPerformanceData,
  FilterOptions,
  CustomReportConfig,
} from '../types/analytics';

export const analyticsService = {
  getPatientFlow: async (filters: FilterOptions): Promise<PatientFlowData[]> => {
    const { data } = await apiClient.get('/analytics/patient-flow', { params: filters });
    return data;
  },

  getOccupancy: async (filters: FilterOptions): Promise<OccupancyData[]> => {
    const { data } = await apiClient.get('/analytics/occupancy', { params: filters });
    return data;
  },

  getResourceUtilization: async (filters: FilterOptions): Promise<ResourceUtilizationData[]> => {
    const { data } = await apiClient.get('/analytics/resource-utilization', { params: filters });
    return data;
  },

  getMedicineUsage: async (filters: FilterOptions): Promise<MedicineUsageData[]> => {
    const { data } = await apiClient.get('/analytics/medicine-usage', { params: filters });
    return data;
  },

  getFinanceKPIs: async (filters: FilterOptions): Promise<FinanceKPI[]> => {
    const { data } = await apiClient.get('/analytics/finance-kpis', { params: filters });
    return data;
  },

  getFinanceData: async (filters: FilterOptions): Promise<FinanceDataPoint[]> => {
    const { data } = await apiClient.get('/analytics/finance-data', { params: filters });
    return data;
  },

  getStaffPerformance: async (filters: FilterOptions): Promise<StaffPerformanceData[]> => {
    const { data } = await apiClient.get('/analytics/staff-performance', { params: filters });
    return data;
  },

  generateCustomReport: async (config: CustomReportConfig): Promise<unknown[]> => {
    const { data } = await apiClient.post('/analytics/custom-report', config);
    return data;
  },

  exportData: async (format: string, reportData: unknown[], filename: string): Promise<Blob> => {
    const { data } = await apiClient.post(
      '/analytics/export',
      { format, data: reportData, filename },
      { responseType: 'blob' }
    );
    return data;
  },
};
