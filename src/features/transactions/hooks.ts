import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import {
  transactionsAtom,
  transactionFiltersAtom,
  transactionsLoadingAtom,
  transactionsErrorAtom,
  selectedTransactionAtom,
  fetchTransactionsAtom,
  fetchTransactionAtom,
  reQueryTransactionAtom,
  reverseTransactionAtom,
  createTransactionAtom,
} from './atoms';
import { TransactionFilters } from '@/sdk/types';

export function useTransactions() {
  const transactions = useAtomValue(transactionsAtom);
  const loading = useAtomValue(transactionsLoadingAtom);
  const error = useAtomValue(transactionsErrorAtom);
  const [, fetchTransactions] = useAtom(fetchTransactionsAtom);

  const refetch = useCallback(async () => {
    await fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    refetch,
  };
}

export function useTransactionFilters() {
  const [filters, setFilters] = useAtom(transactionFiltersAtom);
  const [, fetchTransactions] = useAtom(fetchTransactionsAtom);

  const updateFilters = useCallback(
    async (newFilters: Partial<TransactionFilters>) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);
      await fetchTransactions();
    },
    [filters, setFilters, fetchTransactions]
  );

  const resetFilters = useCallback(async () => {
    const defaultFilters: TransactionFilters = {
      page: 1,
      limit: 10,
    };
    setFilters(defaultFilters);
    await fetchTransactions();
  }, [setFilters, fetchTransactions]);

  return {
    filters,
    updateFilters,
    resetFilters,
  };
}

export function useTransaction() {
  const transaction = useAtomValue(selectedTransactionAtom);
  const loading = useAtomValue(transactionsLoadingAtom);
  const error = useAtomValue(transactionsErrorAtom);
  const [, fetchTransaction] = useAtom(fetchTransactionAtom);
  const [, reQueryTransaction] = useAtom(reQueryTransactionAtom);
  const [, reverseTransaction] = useAtom(reverseTransactionAtom);

  const fetch = useCallback(
    async (transactionRef: string) => {
      await fetchTransaction(transactionRef);
    },
    [fetchTransaction]
  );

  const reQuery = useCallback(
    async (transactionRef: string) => {
      await reQueryTransaction(transactionRef);
    },
    [reQueryTransaction]
  );

  const reverse = useCallback(
    async (transactionRef: string) => {
      await reverseTransaction(transactionRef);
    },
    [reverseTransaction]
  );

  return {
    transaction,
    loading,
    error,
    fetch,
    reQuery,
    reverse,
  };
}

export function useCreateTransaction() {
  const loading = useAtomValue(transactionsLoadingAtom);
  const error = useAtomValue(transactionsErrorAtom);
  const [, createTransaction] = useAtom(createTransactionAtom);

  const create = useCallback(
    async (data: any) => {
      return await createTransaction(data);
    },
    [createTransaction]
  );

  return {
    create,
    loading,
    error,
  };
}

export function useTransactionsPage() {
  const transactions = useTransactions();
  const filters = useTransactionFilters();
  const createTransaction = useCreateTransaction();

  useEffect(() => {
    transactions.refetch();
  }, []);

  return {
    ...transactions,
    ...filters,
    createTransaction,
  };
}