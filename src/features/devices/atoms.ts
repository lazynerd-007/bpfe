"use client";

import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { Device } from '@/sdk/types';

export interface DevicesFilter {
  search?: string;
  status?: string;
  type?: string;
  partnerBankId?: string;
  merchantId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface DevicesState {
  devices: Device[];
  total: number;
  loading: boolean;
  error: string | null;
  selectedDevice: Device | null;
  filter: DevicesFilter;
}

const initialDevicesState: DevicesState = {
  devices: [],
  total: 0,
  loading: false,
  error: null,
  selectedDevice: null,
  filter: {
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
};

export const devicesAtom = atom<DevicesState>(initialDevicesState);

export const devicesFilterAtom = atomWithStorage<DevicesFilter>('devices-filter', {
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc',
});

export const selectedDeviceAtom = atom<Device | null>(null);