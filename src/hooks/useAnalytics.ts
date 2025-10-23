import { useQuery } from '@tanstack/react-query';
import { FilterOptions } from '../types/analytics';
import { analyticsService } from '../services/analyticsService';
import {
  mockPatientFlowData,
  mockOccupancyData,
  mockResourceUtilizationData,
  mockMedicineUsageData,
  mockFinanceKPIs,
  mockFinanceData,
  mockStaffPerformanceData,
} from '../services/mockData';

const USE_MOCK_DATA = true;

export const usePatientFlow = (filters: FilterOptions) => {
  return useQuery({
    queryKey: ['patientFlow', filters],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
          setTimeout(() => resolve(mockPatientFlowData), 500);
        });
      }
      return analyticsService.getPatientFlow(filters);
    },
  });
};

export const useOccupancy = (filters: FilterOptions) => {
  return useQuery({
    queryKey: ['occupancy', filters],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
          setTimeout(() => resolve(mockOccupancyData), 500);
        });
      }
      return analyticsService.getOccupancy(filters);
    },
  });
};

export const useResourceUtilization = (filters: FilterOptions) => {
  return useQuery({
    queryKey: ['resourceUtilization', filters],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
          setTimeout(() => resolve(mockResourceUtilizationData), 500);
        });
      }
      return analyticsService.getResourceUtilization(filters);
    },
  });
};

export const useMedicineUsage = (filters: FilterOptions) => {
  return useQuery({
    queryKey: ['medicineUsage', filters],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
          setTimeout(() => resolve(mockMedicineUsageData), 500);
        });
      }
      return analyticsService.getMedicineUsage(filters);
    },
  });
};

export const useFinanceKPIs = (filters: FilterOptions) => {
  return useQuery({
    queryKey: ['financeKPIs', filters],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
          setTimeout(() => resolve(mockFinanceKPIs), 500);
        });
      }
      return analyticsService.getFinanceKPIs(filters);
    },
  });
};

export const useFinanceData = (filters: FilterOptions) => {
  return useQuery({
    queryKey: ['financeData', filters],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
          setTimeout(() => resolve(mockFinanceData), 500);
        });
      }
      return analyticsService.getFinanceData(filters);
    },
  });
};

export const useStaffPerformance = (filters: FilterOptions) => {
  return useQuery({
    queryKey: ['staffPerformance', filters],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
          setTimeout(() => resolve(mockStaffPerformanceData), 500);
        });
      }
      return analyticsService.getStaffPerformance(filters);
    },
  });
};
