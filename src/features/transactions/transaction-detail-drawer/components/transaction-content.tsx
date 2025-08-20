import { Transaction } from '@/sdk/types';
import {
  TransactionHeader,
  TransactionDetailsSection,
  TransactionActions,
  FailureReasonAlert,
} from './';

interface TransactionContentProps {
  transaction: Transaction;
  transactionStatus?: any;
  onRefetch?: () => void;
  onReverse?: () => void;
}

export function TransactionContent({ 
  transaction, 
  transactionStatus, 
  onRefetch, 
  onReverse 
}: TransactionContentProps) {
  return (
    <div className="space-y-6">
      <TransactionHeader transaction={transaction} />
      
      <FailureReasonAlert 
        transaction={transaction} 
        transactionStatus={transactionStatus} 
      />
      
      <TransactionDetailsSection transaction={transaction} />
      
      <TransactionActions 
        transaction={transaction}
        onRefetch={onRefetch}
        onReverse={onReverse}
      />
    </div>
  );
}