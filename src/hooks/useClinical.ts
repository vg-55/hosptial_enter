import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FilterOptions } from '../types/analytics';
import {
  mockClinicalNotes,
  mockClinicalDocuments,
  mockNoteTemplates,
  mockClinicalStats,
} from '../services/clinicalMockData';

const USE_MOCK_DATA = true;

export const useClinicalStats = (filters: FilterOptions) => {
  return useQuery({
    queryKey: ['clinicalStats', filters],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
          setTimeout(() => resolve(mockClinicalStats), 500);
        });
      }
      throw new Error('API not implemented');
    },
  });
};

export const useClinicalNotes = (filters?: { category?: string; type?: string; search?: string }) => {
  return useQuery({
    queryKey: ['clinicalNotes', filters],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
          setTimeout(() => {
            let filtered = [...mockClinicalNotes];
            if (filters?.category) {
              filtered = filtered.filter((note) => note.category === filters.category);
            }
            if (filters?.type) {
              filtered = filtered.filter((note) => note.type === filters.type);
            }
            if (filters?.search) {
              const search = filters.search.toLowerCase();
              filtered = filtered.filter(
                (note) =>
                  note.title.toLowerCase().includes(search) ||
                  note.content.toLowerCase().includes(search) ||
                  note.patientName.toLowerCase().includes(search)
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

export const useClinicalNote = (id: string) => {
  return useQuery({
    queryKey: ['clinicalNote', id],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
          setTimeout(() => {
            const note = mockClinicalNotes.find((n) => n.id === id);
            resolve(note);
          }, 500);
        });
      }
      throw new Error('API not implemented');
    },
  });
};

export const useSaveClinicalNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (note: any) => {
      if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
          setTimeout(() => resolve({ success: true, note }), 1000);
        });
      }
      throw new Error('API not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinicalNotes'] });
      queryClient.invalidateQueries({ queryKey: ['clinicalStats'] });
    },
  });
};

export const useClinicalDocuments = (filters?: { type?: string; category?: string; search?: string }) => {
  return useQuery({
    queryKey: ['clinicalDocuments', filters],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
          setTimeout(() => {
            let filtered = [...mockClinicalDocuments];
            if (filters?.type) {
              filtered = filtered.filter((doc) => doc.type === filters.type);
            }
            if (filters?.category) {
              filtered = filtered.filter((doc) => doc.category === filters.category);
            }
            if (filters?.search) {
              const search = filters.search.toLowerCase();
              filtered = filtered.filter(
                (doc) =>
                  doc.title.toLowerCase().includes(search) ||
                  doc.patientName.toLowerCase().includes(search)
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

export const useNoteTemplates = (type?: string) => {
  return useQuery({
    queryKey: ['noteTemplates', type],
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
          setTimeout(() => {
            const filtered = type
              ? mockNoteTemplates.filter((tpl) => tpl.type === type)
              : mockNoteTemplates;
            resolve(filtered);
          }, 300);
        });
      }
      throw new Error('API not implemented');
    },
  });
};

export const useUploadDocument = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (document: any) => {
      if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
          setTimeout(() => resolve({ success: true, document }), 1500);
        });
      }
      throw new Error('API not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinicalDocuments'] });
      queryClient.invalidateQueries({ queryKey: ['clinicalStats'] });
    },
  });
};
