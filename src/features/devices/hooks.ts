"use client";

import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { devicesAtom, selectedDeviceAtom, devicesFilterAtom, DevicesFilter } from './atoms';
import { deviceService } from '@/sdk/devices';
import { Device, CreateDeviceDto, UpdateDeviceDto } from '@/sdk/types';

export function useDevices() {
  const [devicesState, setDevicesState] = useAtom(devicesAtom);
  const [filter, setFilter] = useAtom(devicesFilterAtom);

  const fetchDevices = useCallback(async (filterOverrides?: Partial<DevicesFilter>) => {
    try {
      setDevicesState(prev => ({ ...prev, loading: true, error: null }));
      
      const currentFilter = { ...filter, ...filterOverrides };
      const response = await deviceService.getDevices(currentFilter);
      
      setDevicesState(prev => ({
        ...prev,
        devices: response.data || [],
        total: response.total || 0,
        loading: false,
      }));
      
      if (filterOverrides) {
        setFilter(currentFilter);
      }
    } catch (error) {
      setDevicesState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch devices',
      }));
    }
  }, [filter, setDevicesState, setFilter]);

  const createDevice = useCallback(async (deviceData: CreateDeviceDto) => {
    try {
      setDevicesState(prev => ({ ...prev, loading: true, error: null }));
      
      const newDevice = await deviceService.createDevice(deviceData);
      
      setDevicesState(prev => ({
        ...prev,
        devices: [newDevice, ...prev.devices],
        total: prev.total + 1,
        loading: false,
      }));
      
      return newDevice;
    } catch (error) {
      setDevicesState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to create device',
      }));
      throw error;
    }
  }, [setDevicesState]);

  const updateDevice = useCallback(async (id: string, deviceData: UpdateDeviceDto) => {
    try {
      setDevicesState(prev => ({ ...prev, loading: true, error: null }));
      
      const updatedDevice = await deviceService.updateDevice(id, deviceData);
      
      setDevicesState(prev => ({
        ...prev,
        devices: prev.devices.map(device => 
          device.uuid === id ? updatedDevice : device
        ),
        loading: false,
      }));
      
      return updatedDevice;
    } catch (error) {
      setDevicesState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to update device',
      }));
      throw error;
    }
  }, [setDevicesState]);

  const deleteDevice = useCallback(async (id: string) => {
    try {
      setDevicesState(prev => ({ ...prev, loading: true, error: null }));
      
      await deviceService.deleteDevice(id);
      
      setDevicesState(prev => ({
        ...prev,
        devices: prev.devices.filter(device => device.uuid !== id),
        total: prev.total - 1,
        loading: false,
      }));
    } catch (error) {
      setDevicesState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to delete device',
      }));
      throw error;
    }
  }, [setDevicesState]);

  const updateFilter = useCallback((newFilter: Partial<DevicesFilter>) => {
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
    devices: devicesState.devices,
    total: devicesState.total,
    loading: devicesState.loading,
    error: devicesState.error,
    filter,
    fetchDevices,
    createDevice,
    updateDevice,
    deleteDevice,
    updateFilter,
    resetFilter,
  };
}

export function useSelectedDevice() {
  const [selectedDevice, setSelectedDevice] = useAtom(selectedDeviceAtom);

  const selectDevice = useCallback((device: Device | null) => {
    setSelectedDevice(device);
  }, [setSelectedDevice]);

  const clearSelection = useCallback(() => {
    setSelectedDevice(null);
  }, [setSelectedDevice]);

  return {
    selectedDevice,
    selectDevice,
    clearSelection,
  };
}