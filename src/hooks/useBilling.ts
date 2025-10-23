import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FilterOptions } from '../types/analytics';
import {
  mockInvoices,
  mockPayments,
  mockInsuranceClaims,
  mockBillingStats,
} from '../services/billingMockData';

const USE_MOCK_DATA = true;

export const useBillingStats = (filters: FilterOptions) => {
  return useQuery({
    queryKey: ['billingStats', filters],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
          setTimeout(() => resolve(mockBillingStats), 500);
        });
      }
      throw new Error('API not implemented');
    },
  });
};

export const useInvoices = (filters?: FilterOptions) => {
  return useQuery({
    queryKey: ['invoices', filters],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
          setTimeout(() => resolve(mockInvoices), 500);
        });
      }
      throw new Error('API not implemented');
    },
  });
};

export const useInvoice = (id: string) => {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
          setTimeout(() => {
            const invoice = mockInvoices.find((inv) => inv.id === id);
            resolve(invoice);
          }, 500);
        });
      }
      throw new Error('API not implemented');
    },
  });
};

export const usePayments = (invoiceId: string) => {
  return useQuery({
    queryKey: ['payments', invoiceId],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
          setTimeout(() => {
            const payments = mockPayments.filter((pay) => pay.invoiceId === invoiceId);
            resolve(payments);
          }, 500);
        });
      }
      throw new Error('API not implemented');
    },
  });
};

export const useRecordPayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payment: any) => {
      if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
          setTimeout(() => resolve({ success: true, payment }), 1000);
        });
      }
      throw new Error('API not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['billingStats'] });
    },
  });
};

export const useInsuranceClaims = (filters?: FilterOptions) => {
  return useQuery({
    queryKey: ['insuranceClaims', filters],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
          setTimeout(() => resolve(mockInsuranceClaims), 500);
        });
      }
      throw new Error('API not implemented');
    },
  });
};

export const useInsuranceClaim = (id: string) => {
  return useQuery({
    queryKey: ['insuranceClaim', id],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
          setTimeout(() => {
            const claim = mockInsuranceClaims.find((c) => c.id === id);
            resolve(claim);
          }, 500);
        });
      }
      throw new Error('API not implemented');
    },
  });
};

export const useSubmitClaim = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (claim: any) => {
      if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
          setTimeout(() => resolve({ success: true, claim }), 1000);
        });
      }
      throw new Error('API not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insuranceClaims'] });
      queryClient.invalidateQueries({ queryKey: ['billingStats'] });
    },
  });
};
