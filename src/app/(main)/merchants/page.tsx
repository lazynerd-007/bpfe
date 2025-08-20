import { Metadata } from 'next';
import MerchantsPage from '@/features/merchants';

export const metadata: Metadata = {
  title: 'Merchants - Blupay Africa',
  description: 'Manage merchant accounts and settings',
};

export default function Page() {
  return (
      <MerchantsPage />
  );
}