import { useState, useEffect, useCallback } from 'react';
import { useAtomValue } from 'jotai';
import { useToast } from '@/hooks/use-toast';
import { transactionsService } from '@/sdk/transactions';
import { Transaction } from '@/sdk/types';
import { transactionsAtom } from '../../atoms';

interface UseTransactionDetailProps {
  transactionRef: string | null;
  open: boolean;
}

interface UseTransactionActionsProps {
  onSuccess?: () => void;
}

export const useTransactionDetail = ({ transactionRef, open }: UseTransactionDetailProps) => {
  const { toast } = useToast();
  const transactionsState = useAtomValue(transactionsAtom);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [transactionStatus, setTransactionStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransaction = useCallback(async () => {
    if (!transactionRef) return;
    
    try {
      setLoading(true);
      setError(null);
      const status = await transactionsService.getTransactionStatus(transactionRef);
      setTransactionStatus(status);
      
      // Create a transaction object from the limited status data
      const transactionData: Partial<Transaction> = {
        uuid: transactionRef,
        transactionRef: status.transactionReference || transactionRef,
        amount: status.amount,
        status: status.transactionStatus,
        processor: status.processor,
        customer: status.customer,
        currency: 'GHS',
        merchantId: status.merchantCode,
        description: status.statusMessage,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        type: 'MONEY_IN',
        source: 'MOMO',
        surchargeOnCustomer: 0,
        surchargeOnMerchant: 0,
        processorResponse: {},
        elevyResponse: {},
      };
      
      setTransaction(transactionData as Transaction);
    } catch (err) {
      const errorMessage = 'Failed to load transaction details';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [transactionRef, toast]);

  const fetchTransactionStatus = useCallback(async () => {
    if (!transactionRef) return;
    
    try {
      const status = await transactionsService.getTransactionStatus(transactionRef);
      setTransactionStatus(status);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load transaction status:', err);
      setLoading(false);
    }
  }, [transactionRef]);

  const refetch = useCallback(() => {
    if (transactionsState?.data?.find(t => t.transactionRef === transactionRef)) {
      fetchTransactionStatus();
    } else {
      fetchTransaction();
    }
  }, [transactionRef, transactionsState, fetchTransaction, fetchTransactionStatus]);

  useEffect(() => {
    if (open && transactionRef) {
      // First try to find transaction in existing state
      const existingTransaction = transactionsState?.data?.find(
        t => t.transactionRef === transactionRef
      );
      
      if (existingTransaction) {
        setTransaction(existingTransaction);
        fetchTransactionStatus();
      } else {
        fetchTransaction();
      }
    }
  }, [open, transactionRef, transactionsState, fetchTransaction, fetchTransactionStatus]);

  return {
    transaction,
    transactionStatus,
    loading,
    error,
    refetch,
  };
};

export const useTransactionActions = ({ onSuccess }: UseTransactionActionsProps = {}) => {
  const { toast } = useToast();
  const [isRequerying, setIsRequerying] = useState(false);
  const [isReversing, setIsReversing] = useState(false);

  const handleRequery = useCallback(async (transactionRef: string) => {
    if (!transactionRef) return;
    
    try {
      setIsRequerying(true);
      await transactionsService.reQueryTransaction(transactionRef);
      toast({
        title: 'Re-query initiated',
        description: 'Transaction status re-query has been initiated',
      });
      
      // Refresh transaction data after a delay
      setTimeout(() => {
        onSuccess?.();
      }, 3000);
    } catch (error) {
      toast({
        title: 'Re-query failed',
        description: 'Failed to re-query transaction status',
        variant: 'destructive',
      });
    } finally {
      setIsRequerying(false);
    }
  }, [toast, onSuccess]);

  const handleReverse = useCallback(async (transactionRef: string, otpData?: { otp: string; requestedFor: string }) => {
    if (!transactionRef) return;
    
    try {
      setIsReversing(true);
      await transactionsService.reverseTransaction(transactionRef, otpData);
      toast({
        title: 'Reversal initiated',
        description: 'Transaction reversal has been initiated',
      });
      
      // Refresh transaction data after a delay
      setTimeout(() => {
        onSuccess?.();
      }, 3000);
    } catch (error) {
      toast({
        title: 'Reversal failed',
        description: 'Failed to reverse transaction',
        variant: 'destructive',
      });
    } finally {
      setIsReversing(false);
    }
  }, [toast, onSuccess]);

  const handleDownloadReceipt = useCallback(() => {
    toast({
      title: 'Coming soon',
      description: 'Receipt download functionality will be available soon',
    });
  }, [toast]);

  return {
    handleRequery,
    handleReverse,
    handleDownloadReceipt,
    isRequerying,
    isReversing,
  };
};