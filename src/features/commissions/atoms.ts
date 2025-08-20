import { atom } from 'jotai';
import { Commission, PaginatedResponse } from '@/sdk/types';

export interface CommissionsFilter {
  search?: string;
  type?: string;
  status?: string;
  merchantId?: string;
  partnerBankId?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export const commissionsAtom = atom<PaginatedResponse<Commission> | null>(null);

export const commissionsFiltersAtom = atom<CommissionsFilter>({
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc',
});

export const commissionsLoadingAtom = atom(false);

export const commissionsErrorAtom = atom<string | null>(null);

export const selectedCommissionAtom = atom<Commission | null>(null);

export const fetchCommissionsAtom = atom(
  null,
  async (get, set) => {
    try {
      set(commissionsLoadingAtom, true);
      set(commissionsErrorAtom, null);
      
      const { commissionService } = await import('@/sdk/commissions');
      const filters = get(commissionsFiltersAtom);
      
      const response = await commissionService.getCommissions(filters as Record<string, unknown>);
      set(commissionsAtom, response);
      
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch commissions';
      set(commissionsErrorAtom, message);
      throw error;
    } finally {
      set(commissionsLoadingAtom, false);
    }
  }
);