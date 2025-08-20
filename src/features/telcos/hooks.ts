"use client";

import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { 
  telcosAtom, 
  telcosFilterAtom, 
  selectedTelcoAtom,
  TelcosFilter 
} from './atoms';
import { telcosManagementService } from '@/sdk/telcos-mgt';
import { TelcoManagement, CreateTelcoManagementDto, UpdateTelcoManagementDto } from '@/sdk/types';

export function useTelcos() {
  const [telcosState, setTelcosState] = useAtom(telcosAtom);
  const [filter, setFilter] = useAtom(telcosFilterAtom);

  const fetchTelcos = useCallback(async (filterOverrides?: Partial<TelcosFilter>) => {
    try {
      setTelcosState(prev => ({ ...prev, loading: true, error: null }));
      
      const currentFilter = { ...filter, ...filterOverrides };
      const response = await telcosManagementService.getTelcosManagement(currentFilter);
      
      setTelcosState(prev => ({
        ...prev,
        telcos: response.data || [],
        total: response.meta?.total || 0,
        loading: false,
      }));
      
      if (filterOverrides) {
        setFilter(currentFilter);
      }
    } catch (error) {
      setTelcosState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch telcos',
      }));
    }
  }, [filter, setTelcosState, setFilter]);

  const createTelco = useCallback(async (telcoData: CreateTelcoManagementDto) => {
    try {
      setTelcosState(prev => ({ ...prev, loading: true, error: null }));
      
      const newTelco = await telcosManagementService.createTelcoManagement(telcoData);
      
      setTelcosState(prev => ({
        ...prev,
        telcos: [newTelco, ...prev.telcos],
        total: prev.total + 1,
        loading: false,
      }));
      
      return newTelco;
    } catch (error) {
      setTelcosState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to create telco',
      }));
      throw error;
    }
  }, [setTelcosState]);

  const updateTelco = useCallback(async (id: string, telcoData: UpdateTelcoManagementDto) => {
    try {
      setTelcosState(prev => ({ ...prev, loading: true, error: null }));
      
      const updatedTelco = await telcosManagementService.updateTelcoManagement(id, telcoData);
      
      setTelcosState(prev => ({
        ...prev,
        telcos: prev.telcos.map(telco => 
          telco.uuid === id ? updatedTelco : telco
        ),
        loading: false,
      }));
      
      return updatedTelco;
    } catch (error) {
      setTelcosState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to update telco',
      }));
      throw error;
    }
  }, [setTelcosState]);

  const deleteTelco = useCallback(async (id: string) => {
    try {
      setTelcosState(prev => ({ ...prev, loading: true, error: null }));
      
      await telcosManagementService.deleteTelcoManagement(id);
      
      setTelcosState(prev => ({
        ...prev,
        telcos: prev.telcos.filter(telco => telco.uuid !== id),
        total: prev.total - 1,
        loading: false,
      }));
    } catch (error) {
      setTelcosState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to delete telco',
      }));
      throw error;
    }
  }, [setTelcosState]);

  const testTelco = useCallback(async (id: string) => {
    try {
      const result = await telcosManagementService.testTelcoConfiguration(id);
      return result;
    } catch (error) {
      throw error;
    }
  }, []);

  return {
    telcos: telcosState.telcos,
    total: telcosState.total,
    loading: telcosState.loading,
    error: telcosState.error,
    filter,
    fetchTelcos,
    createTelco,
    updateTelco,
    deleteTelco,
    testTelco,
    updateFilter: useCallback((newFilter: Partial<TelcosFilter>) => {
      setFilter(prev => ({ ...prev, ...newFilter }));
    }, [setFilter]),
  };
}

export function useSelectedTelco() {
  const [selectedTelco, setSelectedTelco] = useAtom(selectedTelcoAtom);

  const selectTelco = useCallback((telco: TelcoManagement | null) => {
    setSelectedTelco(telco);
  }, [setSelectedTelco]);

  return {
    selectedTelco,
    selectTelco,
  };
}