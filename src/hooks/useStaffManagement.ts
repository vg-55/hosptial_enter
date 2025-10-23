import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FilterOptions } from '../types/analytics';
import {
  mockStaffMembers,
  mockDepartments,
  mockShifts,
  mockPerformanceMetrics,
  mockStaffStats,
} from '../services/staffMockData';

const USE_MOCK_DATA = true;

export const useStaffStats = (filters: FilterOptions) => {
  return useQuery({
    queryKey: ['staffStats', filters],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
          setTimeout(() => resolve(mockStaffStats), 500);
        });
      }
      throw new Error('API not implemented');
    },
  });
};

export const useStaffMembers = (filters?: { department?: string; role?: string; status?: string; search?: string }) => {
  return useQuery({
    queryKey: ['staffMembers', filters],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
          setTimeout(() => {
            let filtered = [...mockStaffMembers];
            if (filters?.department) {
              filtered = filtered.filter((staff) => staff.department === filters.department);
            }
            if (filters?.role) {
              filtered = filtered.filter((staff) => staff.role === filters.role);
            }
            if (filters?.status) {
              filtered = filtered.filter((staff) => staff.status === filters.status);
            }
            if (filters?.search) {
              const search = filters.search.toLowerCase();
              filtered = filtered.filter(
                (staff) =>
                  staff.fullName.toLowerCase().includes(search) ||
                  staff.email.toLowerCase().includes(search) ||
                  staff.employeeId.toLowerCase().includes(search)
              );
            }
            resolve(filtered);
          }, 500);
        });
      }
      throw new Error('API not implemented');
    },
  });
};

export const useStaffMember = (id: string) => {
  return useQuery({
    queryKey: ['staffMember', id],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
          setTimeout(() => {
            const staff = mockStaffMembers.find((s) => s.id === id);
            resolve(staff);
          }, 500);
        });
      }
      throw new Error('API not implemented');
    },
  });
};

export const useUpdateStaffMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
          setTimeout(() => resolve({ success: true, id, data }), 1000);
        });
      }
      throw new Error('API not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffMembers'] });
      queryClient.invalidateQueries({ queryKey: ['staffMember'] });
    },
  });
};

export const useDepartments = () => {
  return useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
          setTimeout(() => resolve(mockDepartments), 300);
        });
      }
      throw new Error('API not implemented');
    },
  });
};

export const useShifts = (filters?: { staffId?: string; department?: string; startDate?: string; endDate?: string }) => {
  return useQuery({
    queryKey: ['shifts', filters],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
          setTimeout(() => {
            let filtered = [...mockShifts];
            if (filters?.staffId) {
              filtered = filtered.filter((shift) => shift.staffId === filters.staffId);
            }
            if (filters?.department) {
              filtered = filtered.filter((shift) => shift.department === filters.department);
            }
            if (filters?.startDate) {
              filtered = filtered.filter((shift) => shift.startTime >= filters.startDate!);
            }
            if (filters?.endDate) {
              filtered = filtered.filter((shift) => shift.endTime <= filters.endDate!);
            }
            resolve(filtered);
          }, 500);
        });
      }
      throw new Error('API not implemented');
    },
  });
};

export const useCreateShift = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (shift: any) => {
      if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
          setTimeout(() => resolve({ success: true, shift }), 1000);
        });
      }
      throw new Error('API not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      queryClient.invalidateQueries({ queryKey: ['staffStats'] });
    },
  });
};

export const useUpdateShift = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
          setTimeout(() => resolve({ success: true, id, data }), 1000);
        });
      }
      throw new Error('API not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
    },
  });
};

export const usePerformanceMetrics = (filters?: { staffId?: string; department?: string; period?: string }) => {
  return useQuery({
    queryKey: ['performanceMetrics', filters],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
          setTimeout(() => {
            let filtered = [...mockPerformanceMetrics];
            if (filters?.staffId) {
              filtered = filtered.filter((metric) => metric.staffId === filters.staffId);
            }
            if (filters?.department) {
              filtered = filtered.filter((metric) => metric.department === filters.department);
            }
            if (filters?.period) {
              filtered = filtered.filter((metric) => metric.period === filters.period);
            }
            resolve(filtered);
          }, 500);
        });
      }
      throw new Error('API not implemented');
    },
  });
};
