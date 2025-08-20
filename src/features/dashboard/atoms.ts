import { atom } from 'jotai';
import { TransactionAnalytics, WalletBalance, Transaction, PaginatedResponse } from '@/sdk/types';

export const dashboardAnalyticsAtom = atom<TransactionAnalytics | null>(null);

export const walletBalanceAtom = atom<WalletBalance | null>(null);

export const recentTransactionsAtom = atom<Transaction[]>([]);

// Use the standard PaginatedResponse type
export const paginatedTransactionsAtom = atom<PaginatedResponse<Transaction> | null>(null);
export const transactionsPaginationAtom = atom({
  page: 1,
  perPage: 10,
});
export const transactionsLoadingAtom = atom(false);
export const transactionsErrorAtom = atom<string | null>(null);

export const dashboardLoadingAtom = atom(false);

export const dashboardErrorAtom = atom<string | null>(null);

export const analyticsFiltersAtom = atom({
  range: 'monthly' as string,
  month: new Date().getMonth() + 1, // Current month (1-12)
  year: new Date().getFullYear(), // Current year
  partnerBankId: undefined as string | undefined,
});

export const fetchDashboardAnalyticsAtom = atom(
  null,
  async (get, set, params?: { range?: string; month?: number; year?: number; partnerBankId?: string; merchantId?: string }) => {
    try {
      set(dashboardLoadingAtom, true);
      set(dashboardErrorAtom, null);
      
      // Authentication and role-based checks
      const { getSession } = await import('next-auth/react');
      const session = await getSession();
      
      if (!session) {
        console.log('[Dashboard Analytics] No authenticated session found, skipping fetch');
        set(dashboardErrorAtom, 'Authentication required');
        return null;
      }
      
      console.log('[Dashboard Analytics] Authenticated user found, role:', session.user?.role);
      
      const { currentUserAtom } = await import('@/features/auth/atoms');
      const user = get(currentUserAtom);
      
      if (!user) {
        console.log('[Dashboard Analytics] No current user found, skipping fetch');
        set(dashboardErrorAtom, 'User authentication required');
        return null;
      }
      
      const currentFilters = get(analyticsFiltersAtom);
      
      const filters = {
        range: params?.range || currentFilters.range,
        month: params?.month || currentFilters.month,
        year: params?.year || currentFilters.year,
        ...(params?.partnerBankId && { partnerBankId: params.partnerBankId }),
      };
      
      let analytics: TransactionAnalytics | null = null;
      
      // Route to appropriate analytics endpoint based on user role
      const { UserRoleEnum } = await import('@/sdk/types');
      
      if (user.role === UserRoleEnum.MERCHANT || user.role === UserRoleEnum.SUB_MERCHANT) {
        // Use merchant-specific analytics endpoint
        const merchantId = params?.merchantId || user.merchantId;
        if (!merchantId) {
          throw new Error('Merchant ID is required for merchant analytics');
        }
        
        console.log('[Dashboard Analytics] Fetching merchant analytics for:', merchantId);
        const { merchantsService } = await import('@/sdk/merchants');
        const merchantAnalytics = await merchantsService.getMerchantAnalytics(merchantId, {
          startDate: filters.range === 'daily' ? new Date().toISOString().split('T')[0] : undefined,
          endDate: filters.range === 'daily' ? new Date().toISOString().split('T')[0] : undefined,
        });
        analytics = merchantAnalytics as unknown as TransactionAnalytics;
      } else if (user.role === UserRoleEnum.PARTNER_BANK) {
        // Use partner bank-specific analytics endpoint
        const partnerBankId = params?.partnerBankId || user.partnerBankId;
        if (!partnerBankId) {
          throw new Error('Partner Bank ID is required for partner bank analytics');
        }
        
        console.log('[Dashboard Analytics] Fetching partner bank analytics for:', partnerBankId);
        const { partnerBankService } = await import('@/sdk/partner-banks');
        const partnerBankAnalytics = await partnerBankService.getPartnerBankAnalytics(partnerBankId, {
          startDate: filters.range === 'daily' ? new Date().toISOString().split('T')[0] : undefined,
          endDate: filters.range === 'daily' ? new Date().toISOString().split('T')[0] : undefined,
        });
        analytics = partnerBankAnalytics as unknown as TransactionAnalytics;
      } else if (user.role === UserRoleEnum.ADMIN) {
        // Admin can use global transactions analytics
        console.log('[Dashboard Analytics] Fetching global analytics for admin');
        const { transactionsService } = await import('@/sdk/transactions');
        const transactionAnalytics = await transactionsService.getAnalytics(filters);
        analytics = transactionAnalytics as unknown as TransactionAnalytics;
      } else {
        throw new Error(`Unsupported user role: ${user.role}`);
      }
      
      set(dashboardAnalyticsAtom, analytics);
      return analytics;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch analytics';
      console.error('[Dashboard Analytics] Error:', message, error);
      set(dashboardErrorAtom, message);
      throw error;
    } finally {
      set(dashboardLoadingAtom, false);
    }
  }
);

export const fetchWalletBalanceAtom = atom(
  null,
  async (get, set) => {
    try {
      const { transactionsService } = await import('@/sdk/transactions');
      const balance = await transactionsService.getWalletBalance();
      set(walletBalanceAtom, balance);
      return balance;
    } catch (error) {
      set(walletBalanceAtom, null);
      return null;
    }
  }
);

export const fetchRecentTransactionsAtom = atom(
  null,
  async (get, set, filters?: { page?: number; perPage?: number }) => {
    try {
      const { transactionsService } = await import('@/sdk/transactions');
      
      const requestFilters = {
        page: filters?.page || 1,
        perPage: filters?.perPage || 10,
      };
      
      const response = await transactionsService.getTransactions(requestFilters);
      set(recentTransactionsAtom, response?.data || []);
      
      return response?.data || [];
    } catch (error) {
      set(recentTransactionsAtom, []);
      return [];
    }
  }
);

export const fetchPaginatedTransactionsAtom = atom(
  null,
  async (get, set, params?: { page?: number; perPage?: number }) => {
    try {
      set(transactionsLoadingAtom, true);
      set(transactionsErrorAtom, null);
      
      const { transactionsService } = await import('@/sdk/transactions');
      const pagination = get(transactionsPaginationAtom);
      
      const filters = {
        page: params?.page || pagination.page,
        limit: params?.perPage || pagination.perPage,
      };
      
      const response = await transactionsService.getTransactions(filters);
      
      // Update pagination state
      set(transactionsPaginationAtom, {
        page: filters.page,
        perPage: filters.limit,
      });
      
      set(paginatedTransactionsAtom, response);
      
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch transactions';
      set(transactionsErrorAtom, message);
      set(paginatedTransactionsAtom, null);
      throw error;
    } finally {
      set(transactionsLoadingAtom, false);
    }
  }
);

export const refreshDashboardAtom = atom(
  null,
  async (get, set, params?: { range?: string; month?: number; year?: number; partnerBankId?: string }) => {
    const results = await Promise.allSettled([
      set(fetchDashboardAnalyticsAtom, params),
      set(fetchWalletBalanceAtom),
      set(fetchRecentTransactionsAtom),
      set(fetchPaginatedTransactionsAtom),
    ]);
  }
);