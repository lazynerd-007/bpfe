import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Transaction } from '@/sdk/types';
import { formatCurrency } from '../utils';

interface ReverseConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
  onConfirm: () => void;
  isReversing: boolean;
}

export function ReverseConfirmationDialog({
  open,
  onOpenChange,
  transaction,
  onConfirm,
  isReversing
}: ReverseConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Transaction Reversal</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to reverse this transaction? This action cannot be undone.
            <br /><br />
            <strong>Transaction Details:</strong>
            <br />
            Reference: {transaction?.transactionRef}
            <br />
            Amount: {transaction ? formatCurrency(transaction.amount, transaction.currency) : ''}
            <br />
            Customer: {transaction?.customer?.name}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            disabled={isReversing}
          >
            {isReversing ? 'Reversing...' : 'Confirm Reversal'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}