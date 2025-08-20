"use client";

import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback } from 'react';
import { 
  commissionsAtom, 
  selectedCommissionAtom, 
  commissionsFiltersAtom, 
  commissionsLoadingAtom,
  commissionsErrorAtom,
  fetchCommissionsAtom,
  CommissionsFilter 
} from './atoms';
import { commissionService } from '@/sdk/commissions';
import { Commission, CreateCommissionDto, UpdateCommissionDto } from '@/sdk/types';

export function useCommissions() {
  const commissionsState = useAtomValue(commissionsAtom);
  const loading = useAtomValue(commissionsLoadingAtom);
  const error = useAtomValue(commissionsErrorAtom);
  const [filters, setFilters] = useAtom(commissionsFiltersAtom);
  const fetchCommissions = useSetAtom(fetchCommissionsAtom);

  const createCommission = useCallback(async (commissionData: CreateCommissionDto) => {
    try {
      const newCommission = await commissionService.createCommission(commissionData);
      // Refresh the commissions list
      await fetchCommissions();
      return newCommission;
    } catch (error) {
      throw error;
    }
  }, [fetchCommissions]);

  const updateCommission = useCallback(async (id: string, commissionData: UpdateCommissionDto) => {
    try {
      const updatedCommission = await commissionService.updateCommission(id, commissionData);
      // Refresh the commissions list
      await fetchCommissions();
      return updatedCommission;
    } catch (error) {
      throw error;
    }
  }, [fetchCommissions]);

  const deleteCommission = useCallback(async (id: string) => {
    try {
      await commissionService.deleteCommission(id);
      // Refresh the commissions list
      await fetchCommissions();
    } catch (error) {
      throw error;
    }
  }, [fetchCommissions]);

  const updateFilter = useCallback((newFilter: Partial<CommissionsFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilter }));
  }, [setFilters]);

  const resetFilter = useCallback(() => {
    setFilters({
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  }, [setFilters]);

  return {
    commissions: commissionsState?.data || [],
    total: commissionsState?.meta?.total || 0,
    loading,
    error,
    filters,
    fetchCommissions,
    createCommission,
    updateCommission,
    deleteCommission,
    updateFilter,
    resetFilter,
  };
}

export function useSelectedCommission() {
  const [selectedCommission, setSelectedCommission] = useAtom(selectedCommissionAtom);

  const selectCommission = useCallback((commission: Commission | null) => {
    setSelectedCommission(commission);
  }, [setSelectedCommission]);

  const clearSelection = useCallback(() => {
    setSelectedCommission(null);
  }, [setSelectedCommission]);

  return {
    selectedCommission,
    selectCommission,
    clearSelection,
  };
}