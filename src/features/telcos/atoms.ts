import { atom } from 'jotai';
import { TelcoManagement } from '@/sdk/types';

export interface TelcosFilter {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  telco?: string;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
}

export interface TelcosState {
  telcos: TelcoManagement[];
  total: number;
  loading: boolean;
  error: string | null;
}

export const telcosAtom = atom<TelcosState>({
  telcos: [],
  total: 0,
  loading: false,
  error: null,
});

export const telcosFilterAtom = atom<TelcosFilter>({
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  sortOrder: 'DESC',
});

export const selectedTelcoAtom = atom<TelcoManagement | null>(null);