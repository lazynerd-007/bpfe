import { atom } from 'jotai';
import { Settlement } from '@/sdk/types';

export interface SettlementsFilter {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
}

export interface SettlementsState {
  settlements: Settlement[];
  total: number;
  loading: boolean;
  error: string | null;
}

export const settlementsAtom = atom<SettlementsState>({
  settlements: [],
  total: 0,
  loading: false,
  error: null,
});

export const settlementsFilterAtom = atom<SettlementsFilter>({
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  sortOrder: 'DESC',
});

export const selectedSettlementAtom = atom<Settlement | null>(null);