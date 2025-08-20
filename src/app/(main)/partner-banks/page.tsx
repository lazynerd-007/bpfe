import { Metadata } from 'next';
import { PageContainer } from '@/components/layout/page-container';
import PartnerBanksPage from '@/features/partner-banks';

export const metadata: Metadata = {
  title: 'Partner Banks - Blupay Africa',
  description: 'Manage partner bank relationships and integrations',
};

export default function Page() {
  return (
      <PartnerBanksPage />
  );
}