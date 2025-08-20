import { Metadata } from 'next';
import CommissionsPage from '@/features/commissions';

export const metadata: Metadata = {
  title: 'Commissions - Blupay Africa',
  description: 'Configure and manage commission structures for transactions',
};

export default function Page() {
  return (
      <CommissionsPage />
  );
}