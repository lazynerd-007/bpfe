"use client";

import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { User } from '@/sdk/types';

export interface UsersFilter {
  search?: string;
  role?: string;
  status?: string;
  partnerBankId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface UsersState {
  users: User[];
  total: number;
  loading: boolean;
  error: string | null;
  selectedUser: User | null;
  filter: UsersFilter;
}

const initialUsersState: UsersState = {
  users: [],
  total: 0,
  loading: false,
  error: null,
  selectedUser: null,
  filter: {
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
};

export const usersAtom = atom<UsersState>(initialUsersState);

export const usersFilterAtom = atomWithStorage<UsersFilter>('users-filter', {
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc',
});

export const selectedUserAtom = atom<User | null>(null);