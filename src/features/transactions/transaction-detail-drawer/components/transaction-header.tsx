import { ArrowUpRight } from 'lucide-react';
import { Transaction } from '@/sdk/types';
import { formatCurrency, TRANSACTION_TYPES } from '../utils';
import { TransactionStatusBadge } from './transaction-status-badge';

interface TransactionHeaderProps {
  transaction: Transaction;
}

export function TransactionHeader({ transaction }: TransactionHeaderProps) {
  const getTransactionIcon = () => {
    switch (transaction.type) {
      case 'MONEY_OUT':
        return <ArrowUpRight className="h-5 w-5 text-red-500" />;
      case 'MONEY_IN':
      default:
        return <ArrowUpRight className="h-5 w-5 text-green-500 rotate-180" />;
    }
  };

  const getTransactionTypeText = () => {
    return transaction.type === 'MONEY_OUT' 
      ? `Sending money to ${transaction.customer?.name || 'Customer'}`
      : `Receiving money from ${transaction.customer?.name || 'Customer'}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-gray-100">
            {getTransactionIcon()}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              {getTransactionTypeText()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {transaction.status === 'SUCCESSFUL' ? 'Sent' : transaction.status}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold">
            {transaction.type === 'MONEY_OUT' ? '-' : ''}
            {formatCurrency(transaction.amount, transaction.currency)}
          </p>
        </div>
      </div>
    </div>
  );
}