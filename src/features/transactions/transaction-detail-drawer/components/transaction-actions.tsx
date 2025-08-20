import { RefreshCw, RotateCcw, Download, Copy, Share, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/sdk/types';
import { useTransactionActions } from '../hooks';
import { useClipboard } from '@/hooks/use-clipboard';

interface TransactionActionsProps {
  transaction: Transaction;
  onRefetch?: () => void;
  onReverse?: () => void;
}

export function TransactionActions({ transaction, onRefetch, onReverse }: TransactionActionsProps) {
  const { copyToClipboard } = useClipboard();
  
  const {
    handleRequery,
    handleDownloadReceipt,
    isRequerying,
  } = useTransactionActions({
    onSuccess: onRefetch,
  });

  const handleShare = () => {
    const shareText = `Transaction Details\nID: ${transaction.transactionRef}\nAmount: ${transaction.currency} ${transaction.amount}\nStatus: ${transaction.status}`;
    copyToClipboard(shareText, 'Transaction details copied to clipboard');
  };

  const handleRepeatTransfer = () => {
    // This would typically navigate to a new transaction form with pre-filled data
    copyToClipboard(transaction.customer?.phoneNumber || '', 'Phone number copied for repeat transfer');
  };

  return (
    <div className="space-y-4">
      {/* Action Status Messages */}
      {transaction.status === 'PENDING' && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-xs text-yellow-800">
            💡 This transaction is pending. You can re-query to check for status updates from the processor.
          </p>
        </div>
      )}
      
      {transaction.status === 'SUCCESSFUL' && transaction.type === 'MONEY_IN' && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-xs text-green-800">
            ✅ This transaction completed successfully. You can reverse it if needed.
          </p>
        </div>
      )}
      
      {transaction.status === 'FAILED' && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-xs text-red-800">
            ❌ This transaction failed. No further actions can be performed.
          </p>
        </div>
      )}

      {/* Available Actions */}
      <div className="space-y-2">
        {transaction.status === 'PENDING' && (
          <Button
            variant="outline"
            onClick={() => handleRequery(transaction.transactionRef)}
            disabled={isRequerying}
            className="w-full justify-start"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRequerying ? 'animate-spin' : ''}`} />
            {isRequerying ? 'Re-querying...' : 'Re-query Status'}
          </Button>
        )}
        
        {transaction.status === 'SUCCESSFUL' && transaction.type === 'MONEY_IN' && (
          <Button
            variant="outline"
            onClick={onReverse}
            className="w-full justify-start"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reverse Transaction
          </Button>
        )}
        
        <Button
          variant="outline"
          onClick={handleDownloadReceipt}
          className="w-full justify-start"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Receipt
        </Button>
        
        <Button
          variant="outline" 
          onClick={() => copyToClipboard(transaction.transactionRef)}
          className="w-full justify-start"
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy Reference
        </Button>
        
        {transaction.status === 'FAILED' && (
          <Button
            variant="destructive"
            className="w-full justify-start"
            onClick={() => {
              // Handle dispute - could open a support ticket or contact form
            }}
          >
            Dispute Transaction
          </Button>
        )}
      </div>

      {/* Primary Actions (like in the design) */}
      <div className="flex gap-2 pt-4">
        <Button
          variant="outline"
          onClick={handleShare}
          className="flex-1"
        >
          <Share className="w-4 h-4 mr-2" />
          Share transaction
        </Button>
        
        <Button
          onClick={handleRepeatTransfer}
          className="flex-1"
        >
          <Repeat className="w-4 h-4 mr-2" />
          Repeat transfer
        </Button>
      </div>
    </div>
  );
}