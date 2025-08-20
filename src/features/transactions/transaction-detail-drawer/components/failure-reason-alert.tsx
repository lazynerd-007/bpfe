import { AlertTriangle } from 'lucide-react';
import { Transaction } from '@/sdk/types';
import { getFailureReason } from '../utils';

interface FailureReasonAlertProps {
  transaction: Transaction;
  transactionStatus?: any;
}

export function FailureReasonAlert({ transaction, transactionStatus }: FailureReasonAlertProps) {
  if (transaction.status !== 'FAILED') return null;

  const failureReason = getFailureReason(transaction, transactionStatus);

  return (
    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
      <div className="flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-red-800 mb-1">Transaction Failed</p>
          <p className="text-sm text-red-700">{failureReason}</p>
        </div>
      </div>
    </div>
  );
}