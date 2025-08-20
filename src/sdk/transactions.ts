import { apiClient } from './client';
import {
  Transaction,
  TransactionRequest,
  TransactionAnalytics,
  WalletBalance,
  ApiResponse,
  PaginatedResponse,
  TransactionFilters,
} from './types';

// Request types for additional transaction operations
interface CashoutRequest {
  amount: number;
  phoneNumber: string;
  description?: string;
}

interface TransferRequest {
  fromWallet: string;
  toWallet: string;
  amount: number;
  description?: string;
}

interface WalletFundRequest {
  amount: number;
  source: string;
  description?: string;
}

export class TransactionsService {
  async getTransactionById(transactionRef: string): Promise<Transaction> {
    return apiClient.get(`/transactions/${transactionRef}/view`);
  }

  async getTransactionStatus(transactionRef: string): Promise<any> {
    return apiClient.get(`/transactions/${transactionRef}/view`);
  }

  async createTransaction(data: TransactionRequest): Promise<Transaction> {
    return apiClient.post('/transactions', data);
  }

  async getTransactions(filters: TransactionFilters): Promise<PaginatedResponse<Transaction>> {
    try {
      console.log('[Transactions Service] Fetching transactions with filters:', filters);
      
      const data = await apiClient.get<any>('/transactions', filters);
      
      console.log('[Transactions Service] Raw transactions response:', data);
      
      // Handle both direct array and nested response structures
      let transactions: Transaction[] = [];
      let total = 0;
      let currentPage = filters.page || 1;
      let perPage = filters.limit || 10;
      
      if (Array.isArray(data)) {
        transactions = data;
        total = data.length;
      } else if (data && typeof data === 'object') {
        if (data.data && Array.isArray(data.data)) {
          transactions = data.data;
          total = data.total || data.data.length;
          currentPage = data.page || currentPage;
          perPage = data.perPage || perPage;
        } else if (data.transactions && Array.isArray(data.transactions)) {
          transactions = data.transactions;
          total = data.total || data.transactions.length;
        } else {
          console.warn('[Transactions Service] Unexpected response structure:', data);
          transactions = [];
          total = 0;
        }
      }
      
      return {
        data: transactions,
        meta: {
          page: currentPage,
          perPage: perPage,
          total: total,
          totalPages: Math.ceil(total / perPage)
        }
      };
    } catch (error) {
      console.error('[Transactions Service] Error fetching transactions:', error);
      // Return empty response on error to prevent UI crashes
      return {
        data: [],
        meta: {
          page: filters.page || 1,
          perPage: filters.limit || 10,
          total: 0,
          totalPages: 0
        }
      };
    }
  }

  async updateTransaction(id: string, data: Partial<Transaction>): Promise<Transaction> {
    return apiClient.put(`/transactions/${id}`, data);
  }

  async deleteTransaction(id: string): Promise<Transaction> {
    return apiClient.delete(`/transactions/${id}`);
  }

  async reverseTransaction(transactionRef: string, otpData?: { otp: string; requestedFor: string }): Promise<Transaction> {
    return apiClient.post(`/transactions/${transactionRef}/reverse`, otpData || {});
  }

  async reQueryTransaction(transactionRef: string): Promise<any> {
    return apiClient.get(`/transactions/${transactionRef}/re-query`);
  }

  async getAnalytics(filters: {
    range?: string;
    month?: number;
    year?: number;
    partnerBankId?: string;
  } = {}): Promise<TransactionAnalytics> {
    const params = new URLSearchParams();
    
    // Only include parameters that match the Postman collection spec
    if (filters.range) params.append('range', filters.range);
    if (filters.month) params.append('month', filters.month.toString());
    if (filters.year) params.append('year', filters.year.toString());
    if (filters.partnerBankId) params.append('partnerBankId', filters.partnerBankId);

    try {
      console.log('[Transactions Service] Fetching analytics with filters:', filters);
      
      const response = await apiClient.get<any>(
        `/transactions/analytics?${params.toString()}`
      );
      
      console.log('[Transactions Service] Raw analytics response:', response);
      
      // Handle case where response.data might be undefined or the API returns data directly
      if (response && typeof response === 'object') {
        // If response has the expected ApiResponse structure
        if ('data' in response && response.data) {
          console.log('[Transactions Service] Found analytics data in response.data');
          return response.data;
        }
        // If response is the analytics data directly
        if ('successTotalMoneyInAmount' in response) {
          console.log('[Transactions Service] Found analytics data directly');
          return response as unknown as TransactionAnalytics;
        }
      }
      
      console.warn('[Transactions Service] No valid analytics data found, returning empty structure');
      
      // Fallback: return empty analytics structure
      return {
        successTotalMoneyInAmount: 0,
        successTotalMoneyInCount: 0,
        successTotalMoneyOutAmount: 0,
        successTotalMoneyOutCount: 0,
        failedTotalAmount: 0,
        failedTotalCount: 0,
        timeScaleData: []
      };
    } catch (error) {
      console.error('[Transactions Service] Error fetching analytics:', error);
      
      // Handle specific network errors
      if (error && typeof error === 'object' && 'code' in error) {
        console.error('[Transactions Service] Network error code:', error.code);
      }
      
      // Return empty analytics structure on error to prevent UI crashes
      return {
        successTotalMoneyInAmount: 0,
        successTotalMoneyInCount: 0,
        successTotalMoneyOutAmount: 0,
        successTotalMoneyOutCount: 0,
        failedTotalAmount: 0,
        failedTotalCount: 0,
        timeScaleData: []
      };
    }
  }

  async cashout(data: CashoutRequest): Promise<Transaction> {
    return apiClient.post('/transactions/cashout', data);
  }

  async internalTransfer(data: TransferRequest): Promise<Transaction> {
    return apiClient.post('/transactions/transfer/internal', data);
  }

  async fundWallet(data: WalletFundRequest): Promise<Transaction> {
    return apiClient.post('/transactions/wallet/fund', data);
  }

  async getWalletBalance(): Promise<WalletBalance> {
    return apiClient.get('/transactions/wallet/balance');
  }
}

export const transactionsService = new TransactionsService();