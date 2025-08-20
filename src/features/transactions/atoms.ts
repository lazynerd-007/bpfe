import { atom } from 'jotai';
import { Transaction, TransactionFilters, PaginatedResponse } from '@/sdk/types';

export const transactionsAtom = atom<PaginatedResponse<Transaction> | null>(null);

export const transactionFiltersAtom = atom<TransactionFilters>({
  page: 1,
  limit: 10,
});

export const transactionsLoadingAtom = atom(false);

export const transactionsErrorAtom = atom<string | null>(null);

export const selectedTransactionAtom = atom<Transaction | null>(null);

export const fetchTransactionsAtom = atom(
  null,
  async (get, set) => {
    try {
      set(transactionsLoadingAtom, true);
      set(transactionsErrorAtom, null);
      
      // Check if user is authenticated before making API calls
      const { getSession } = await import('next-auth/react');
      const session = await getSession();
      
      if (!session?.user) {
        console.log('[Transactions] No authenticated session, skipping transactions fetch');
        set(transactionsAtom, {
          data: [],
          meta: {
            page: 1,
            perPage: 10,
            total: 0,
            totalPages: 0
          }
        });
        set(transactionsLoadingAtom, false);
        return;
      }
      
      const { transactionsService } = await import('@/sdk/transactions');
      const filters = get(transactionFiltersAtom);
      
      console.log('[Transactions] Fetching transactions with filters:', filters);
      const response = await transactionsService.getTransactions(filters);
      set(transactionsAtom, response);
      
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch transactions';
      console.error('[Transactions] Error fetching transactions:', error);
      set(transactionsErrorAtom, message);
      throw error;
    } finally {
      set(transactionsLoadingAtom, false);
    }
  }
);

export const fetchAnalyticsAtom = atom(
  null,
  async (get, set, filters: { range?: string; month?: number; year?: number; partnerBankId?: string } = {}) => {
    try {
      set(transactionsLoadingAtom, true);
      set(transactionsErrorAtom, null);
      
      // Check if user is authenticated before making API calls
      const { getSession } = await import('next-auth/react');
      const session = await getSession();
      
      if (!session?.user) {
        console.log('[Transactions] No authenticated session, skipping analytics fetch');
        set(transactionsLoadingAtom, false);
        return null;
      }
      
      const { transactionsService } = await import('@/sdk/transactions');
      
      console.log('[Transactions] Fetching analytics with filters:', filters);
      const analytics = await transactionsService.getAnalytics(filters);
      
      return analytics;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch analytics';
      console.error('[Transactions] Error fetching analytics:', error);
      set(transactionsErrorAtom, message);
      return null;
    } finally {
      set(transactionsLoadingAtom, false);
    }
  }
);

export const fetchTransactionAtom = atom(
  null,
  async (get, set, transactionRef: string) => {
    try {
      set(transactionsLoadingAtom, true);
      set(transactionsErrorAtom, null);
      
      // Check if user is authenticated before making API calls
      const { getSession } = await import('next-auth/react');
      const session = await getSession();
      
      if (!session?.user) {
        console.log('[Transactions] No authenticated session, skipping transaction fetch');
        set(selectedTransactionAtom, null);
        set(transactionsLoadingAtom, false);
        return null;
      }
      
      const { transactionsService } = await import('@/sdk/transactions');
      
      console.log('[Transactions] Fetching transaction:', transactionRef);
      const transaction = await transactionsService.getTransactionById(transactionRef);
      set(selectedTransactionAtom, transaction);
      
      return transaction;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch transaction';
      console.error('[Transactions] Error fetching transaction:', error);
      set(transactionsErrorAtom, message);
      throw error;
    } finally {
      set(transactionsLoadingAtom, false);
    }
  }
);

export const reQueryTransactionAtom = atom(
  null,
  async (get, set, transactionRef: string) => {
    try {
      set(transactionsLoadingAtom, true);
      set(transactionsErrorAtom, null);
      
      // Check if user is authenticated before making API calls
      const { getSession } = await import('next-auth/react');
      const session = await getSession();
      
      if (!session?.user) {
        console.log('[Transactions] No authenticated session, skipping re-query transaction');
        set(transactionsLoadingAtom, false);
        return null;
      }
      
      const { transactionsService } = await import('@/sdk/transactions');
      
      console.log('[Transactions] Re-querying transaction:', transactionRef);
      const transaction = await transactionsService.getTransactionById(transactionRef);
      
      // Update the transaction in the list
      const currentTransactions = get(transactionsAtom);
      if (currentTransactions) {
        const updatedData = currentTransactions.data.map(t => 
          t.transactionRef === transactionRef ? transaction : t
        );
        set(transactionsAtom, { ...currentTransactions, data: updatedData });
      }
      
      // Update selected transaction if it matches
      const selectedTransaction = get(selectedTransactionAtom);
      if (selectedTransaction?.transactionRef === transactionRef) {
        set(selectedTransactionAtom, transaction);
      }
      
      return transaction;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to re-query transaction';
      console.error('[Transactions] Error re-querying transaction:', error);
      set(transactionsErrorAtom, message);
      throw error;
    } finally {
      set(transactionsLoadingAtom, false);
    }
  }
);

export const reverseTransactionAtom = atom(
  null,
  async (get, set, transactionRef: string) => {
    try {
      set(transactionsLoadingAtom, true);
      set(transactionsErrorAtom, null);
      
      // Check if user is authenticated before making API calls
      const { getSession } = await import('next-auth/react');
      const session = await getSession();
      
      if (!session?.user) {
        console.log('[Transactions] No authenticated session, skipping reverse transaction');
        set(transactionsLoadingAtom, false);
        return null;
      }
      
      const { transactionsService } = await import('@/sdk/transactions');
      
      console.log('[Transactions] Reversing transaction:', transactionRef);
      const transaction = await transactionsService.reverseTransaction(transactionRef);
      
      // Update the transaction in the list
      const currentTransactions = get(transactionsAtom);
      if (currentTransactions) {
        const updatedData = currentTransactions.data.map(t => 
          t.transactionRef === transactionRef ? transaction : t
        );
        set(transactionsAtom, { ...currentTransactions, data: updatedData });
      }
      
      return transaction;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to reverse transaction';
      console.error('[Transactions] Error reversing transaction:', error);
      set(transactionsErrorAtom, message);
      throw error;
    } finally {
      set(transactionsLoadingAtom, false);
    }
  }
);

export const createTransactionAtom = atom(
  null,
  async (get, set, data: any) => {
    try {
      set(transactionsLoadingAtom, true);
      set(transactionsErrorAtom, null);
      
      // Check if user is authenticated before making API calls
      const { getSession } = await import('next-auth/react');
      const session = await getSession();
      
      if (!session?.user) {
        console.log('[Transactions] No authenticated session, skipping create transaction');
        set(transactionsLoadingAtom, false);
        return null;
      }
      
      const { transactionsService } = await import('@/sdk/transactions');
      
      console.log('[Transactions] Creating transaction with data:', data);
      const transaction = await transactionsService.createTransaction(data);
      
      // Refresh the transactions list
      await set(fetchTransactionsAtom);
      
      return transaction;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create transaction';
      console.error('[Transactions] Error creating transaction:', error);
      set(transactionsErrorAtom, message);
      throw error;
    } finally {
      set(transactionsLoadingAtom, false);
    }
  }
);