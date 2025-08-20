"use client";

import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { PartnerBank } from '@/sdk/types';

export interface PartnerBanksFilter {
  search?: string;
  status?: string;
  country?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PartnerBanksState {
  partnerBanks: PartnerBank[];
  total: number;
  loading: boolean;
  error: string | null;
  selectedPartnerBank: PartnerBank | null;
  filter: PartnerBanksFilter;
}

const initialPartnerBanksState: PartnerBanksState = {
  partnerBanks: [],
  total: 0,
  loading: false,
  error: null,
  selectedPartnerBank: null,
  filter: {
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
};

export const partnerBanksAtom = atom<PartnerBanksState>(initialPartnerBanksState);

export const partnerBanksFilterAtom = atomWithStorage<PartnerBanksFilter>('partner-banks-filter', {
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc',
});

export const selectedPartnerBankAtom = atom<PartnerBank | null>(null);