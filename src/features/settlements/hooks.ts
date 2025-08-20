"use client";

import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { 
  settlementsAtom, 
  settlementsFilterAtom, 
  selectedSettlementAtom,
  SettlementsFilter 
} from './atoms';
import { settlementsService } from '@/sdk/settlements';
import { Settlement, CreateSettlementDto, UpdateSettlementDto } from '@/sdk/types';

export function useSettlements() {
  const [settlementsState, setSettlementsState] = useAtom(settlementsAtom);
  const [filter, setFilter] = useAtom(settlementsFilterAtom);

  const fetchSettlements = useCallback(async (filterOverrides?: Partial<SettlementsFilter>) => {
    try {
      setSettlementsState(prev => ({ ...prev, loading: true, error: null }));
      
      const currentFilter = { ...filter, ...filterOverrides };
      const response = await settlementsService.getSettlements(currentFilter);
      
      setSettlementsState(prev => ({
        ...prev,
        settlements: response.data || [],
        total: response.meta?.total || 0,
        loading: false,
      }));
      
      if (filterOverrides) {
        setFilter(currentFilter);
      }
    } catch (error) {
      setSettlementsState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch settlements',
      }));
    }
  }, [filter, setSettlementsState, setFilter]);

  const createSettlement = useCallback(async (settlementData: CreateSettlementDto) => {
    try {
      setSettlementsState(prev => ({ ...prev, loading: true, error: null }));
      
      const newSettlement = await settlementsService.createSettlement(settlementData);
      
      setSettlementsState(prev => ({
        ...prev,
        settlements: [newSettlement, ...prev.settlements],
        total: prev.total + 1,
        loading: false,
      }));
      
      return newSettlement;
    } catch (error) {
      setSettlementsState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to create settlement',
      }));
      throw error;
    }
  }, [setSettlementsState]);

  const updateSettlement = useCallback(async (id: string, settlementData: UpdateSettlementDto) => {
    try {
      setSettlementsState(prev => ({ ...prev, loading: true, error: null }));
      
      const updatedSettlement = await settlementsService.updateSettlement(id, settlementData);
      
      setSettlementsState(prev => ({
        ...prev,
        settlements: prev.settlements.map(settlement => 
          settlement.uuid === id ? updatedSettlement : settlement
        ),
        loading: false,
      }));
      
      return updatedSettlement;
    } catch (error) {
      setSettlementsState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to update settlement',
      }));
      throw error;
    }
  }, [setSettlementsState]);

  const deleteSettlement = useCallback(async (id: string) => {
    try {
      setSettlementsState(prev => ({ ...prev, loading: true, error: null }));
      
      await settlementsService.deleteSettlement(id);
      
      setSettlementsState(prev => ({
        ...prev,
        settlements: prev.settlements.filter(settlement => settlement.uuid !== id),
        total: prev.total - 1,
        loading: false,
      }));
    } catch (error) {
      setSettlementsState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to delete settlement',
      }));
      throw error;
    }
  }, [setSettlementsState]);

  return {
    settlements: settlementsState.settlements,
    total: settlementsState.total,
    loading: settlementsState.loading,
    error: settlementsState.error,
    filter,
    fetchSettlements,
    createSettlement,
    updateSettlement,
    deleteSettlement,
    updateFilter: useCallback((newFilter: Partial<SettlementsFilter>) => {
      setFilter(prev => ({ ...prev, ...newFilter }));
    }, [setFilter]),
  };
}

export function useSelectedSettlement() {
  const [selectedSettlement, setSelectedSettlement] = useAtom(selectedSettlementAtom);

  const selectSettlement = useCallback((settlement: Settlement | null) => {
    setSelectedSettlement(settlement);
  }, [setSelectedSettlement]);

  return {
    selectedSettlement,
    selectSettlement,
  };
}