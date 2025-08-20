'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useTransactionDetail, useTransactionActions } from './hooks';
import {
  LoadingState,
  ErrorState,
  TransactionContent,
  ReverseConfirmationDialog,
} from './components';

interface TransactionDetailDrawerProps {
  transactionRef: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionDetailDrawer({ 
  transactionRef, 
  open, 
  onOpenChange 
}: TransactionDetailDrawerProps) {
  const [showReverseDialog, setShowReverseDialog] = useState(false);
  
  const {
    transaction,
    transactionStatus,
    loading,
    error,
    refetch,
  } = useTransactionDetail({ transactionRef, open });

  const {
    handleReverse,
    isReversing,
  } = useTransactionActions({
    onSuccess: () => {
      refetch();
      setShowReverseDialog(false);
    },
  });

  const onReverse = () => {
    setShowReverseDialog(true);
  };

  const onConfirmReverse = () => {
    if (transaction) {
      handleReverse(transaction.transactionRef);
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="overflow-y-auto w-full sm:max-w-md px-6" side="right">
          <SheetHeader className="pb-6 px-0">
              <SheetTitle className="font-medium">Transaction Details</SheetTitle>
          </SheetHeader>

          {loading && <LoadingState />}
          
          {!loading && (error || !transaction) && <ErrorState error={error} />}
          
          {!loading && !error && transaction && (
            <TransactionContent
              transaction={transaction}
              transactionStatus={transactionStatus}
              onRefetch={refetch}
              onReverse={onReverse}
            />
          )}
        </SheetContent>
      </Sheet>

      <ReverseConfirmationDialog
        open={showReverseDialog}
        onOpenChange={setShowReverseDialog}
        transaction={transaction}
        onConfirm={onConfirmReverse}
        isReversing={isReversing}
      />
    </>
  );
}