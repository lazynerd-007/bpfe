import { Metadata } from 'next';
import TransactionsPage from '@/features/transactions';

export const metadata: Metadata = {
  title: 'Transactions - Blupay Africa',
  description: 'Manage and monitor all transactions',
};

export default function Page() {
  return (
      <TransactionsPage />
  );
}