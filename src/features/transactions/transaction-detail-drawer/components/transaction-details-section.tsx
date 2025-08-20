import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/sdk/types';
import { formatDate, PROCESSORS } from '../utils';
import { useClipboard } from '@/hooks/use-clipboard';
import { TransactionStatusBadge } from './transaction-status-badge';

interface TransactionDetailsSectionProps {
  transaction: Transaction;
}

interface DetailRowProps {
  label: string;
  value: string | React.ReactNode;
  copyable?: string;
}

function DetailRow({ label, value, copyable }: DetailRowProps) {
  const { copyToClipboard } = useClipboard();

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{value}</span>
        {copyable && (
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4"
            onClick={() => copyToClipboard(copyable)}
          >
            <Copy className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}

export function TransactionDetailsSection({ transaction }: TransactionDetailsSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Details</h3>
        <div className="space-y-0">
          <DetailRow
            label="Transaction ID"
            value={<span className="font-mono text-xs">{transaction.uuid}</span>}
            copyable={transaction.uuid}
          />
          
          <DetailRow
            label="Transaction Date"
            value={formatDate(transaction.createdAt)}
          />
          
          {transaction.customer && (
            <DetailRow
              label="Recipient"
              value={
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xs">{transaction.customer.name?.[0]?.toUpperCase() || 'U'}</span>
                  </div>
                  <span>{transaction.customer.name}</span>
                </div>
              }
            />
          )}
          
          <DetailRow
            label="Status"
            value={<TransactionStatusBadge status={transaction.status} />}
          />
          
          <DetailRow
            label="Amount Sent"
            value={`${transaction.currency} ${transaction.amount.toLocaleString()}`}
          />
          
          <DetailRow
            label="Fee"
            value={`${transaction.currency} ${(transaction.surchargeOnCustomer || 0).toLocaleString()}`}
          />

          {transaction.processor && (
            <DetailRow
              label="Processor"
              value={PROCESSORS[transaction.processor as keyof typeof PROCESSORS] || transaction.processor}
            />
          )}

          {transaction.customer?.phoneNumber && (
            <DetailRow
              label="Phone Number"
              value={transaction.customer.phoneNumber}
              copyable={transaction.customer.phoneNumber}
            />
          )}

          {transaction.customer?.email && (
            <DetailRow
              label="Email"
              value={transaction.customer.email}
              copyable={transaction.customer.email}
            />
          )}
        </div>
      </div>
    </div>
  );
}