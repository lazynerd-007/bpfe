"use client";

import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { partnerBanksAtom, selectedPartnerBankAtom, partnerBanksFilterAtom, PartnerBanksFilter } from './atoms';
import { partnerBankService } from '@/sdk/partner-banks';
import { PartnerBank, CreatePartnerBankDto, UpdatePartnerBankDto } from '@/sdk/types';

export function usePartnerBanks() {
  const [partnerBanksState, setPartnerBanksState] = useAtom(partnerBanksAtom);
  const [filter, setFilter] = useAtom(partnerBanksFilterAtom);

  const fetchPartnerBanks = useCallback(async (filterOverrides?: Partial<PartnerBanksFilter>) => {
    try {
      setPartnerBanksState(prev => ({ ...prev, loading: true, error: null }));
      
      const currentFilter = { ...filter, ...filterOverrides };
      const response = await partnerBankService.getPartnerBanks(currentFilter);
      
      setPartnerBanksState(prev => ({
        ...prev,
        partnerBanks: response.data || [],
        total: response.meta?.total || 0,
        loading: false,
      }));
      
      if (filterOverrides) {
        setFilter(currentFilter);
      }
    } catch (error) {
      setPartnerBanksState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch partner banks',
      }));
    }
  }, [filter, setPartnerBanksState, setFilter]);

  const createPartnerBank = useCallback(async (partnerBankData: CreatePartnerBankDto | FormData) => {
    try {
      setPartnerBanksState(prev => ({ ...prev, loading: true, error: null }));
      
      const newPartnerBank = await partnerBankService.createPartnerBank(partnerBankData);
      
      setPartnerBanksState(prev => ({
        ...prev,
        partnerBanks: [newPartnerBank, ...prev.partnerBanks],
        total: prev.total + 1,
        loading: false,
      }));
      
      return newPartnerBank;
    } catch (error) {
      setPartnerBanksState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to create partner bank',
      }));
      throw error;
    }
  }, [setPartnerBanksState]);

  const updatePartnerBank = useCallback(async (uuid: string, partnerBankData: UpdatePartnerBankDto | FormData) => {
    try {
      setPartnerBanksState(prev => ({ ...prev, loading: true, error: null }));
      
      const updatedPartnerBank = await partnerBankService.updatePartnerBank(uuid, partnerBankData);
      
      setPartnerBanksState(prev => ({
        ...prev,
        partnerBanks: prev.partnerBanks.map(partnerBank => 
          partnerBank.uuid === uuid ? updatedPartnerBank : partnerBank
        ),
        loading: false,
      }));
      
      return updatedPartnerBank;
    } catch (error) {
      setPartnerBanksState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to update partner bank',
      }));
      throw error;
    }
  }, [setPartnerBanksState]);

  const deletePartnerBank = useCallback(async (uuid: string) => {
    try {
      setPartnerBanksState(prev => ({ ...prev, loading: true, error: null }));
      
      await partnerBankService.deletePartnerBank(uuid);
      
      setPartnerBanksState(prev => ({
        ...prev,
        partnerBanks: prev.partnerBanks.filter(partnerBank => partnerBank.uuid !== uuid),
        total: prev.total - 1,
        loading: false,
      }));
    } catch (error) {
      setPartnerBanksState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to delete partner bank',
      }));
      throw error;
    }
  }, [setPartnerBanksState]);

  const updateFilter = useCallback((newFilter: Partial<PartnerBanksFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  }, [setFilter]);

  const resetFilter = useCallback(() => {
    setFilter({
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  }, [setFilter]);

  return {
    partnerBanks: partnerBanksState.partnerBanks,
    total: partnerBanksState.total,
    loading: partnerBanksState.loading,
    error: partnerBanksState.error,
    filter,
    fetchPartnerBanks,
    createPartnerBank,
    updatePartnerBank,
    deletePartnerBank,
    updateFilter,
    resetFilter,
  };
}

export function useSelectedPartnerBank() {
  const [selectedPartnerBank, setSelectedPartnerBank] = useAtom(selectedPartnerBankAtom);

  const selectPartnerBank = useCallback((partnerBank: PartnerBank | null) => {
    setSelectedPartnerBank(partnerBank);
  }, [setSelectedPartnerBank]);

  const clearSelection = useCallback(() => {
    setSelectedPartnerBank(null);
  }, [setSelectedPartnerBank]);

  return {
    selectedPartnerBank,
    selectPartnerBank,
    clearSelection,
  };
}