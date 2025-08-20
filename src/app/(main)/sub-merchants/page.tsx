import { Metadata } from 'next';
import { PageContainer } from '@/components/layout/page-container';
import SubMerchantsPage from '@/features/sub-merchants';

export const metadata: Metadata = {
  title: 'Sub-Merchants - Blupay Africa',
  description: 'Manage sub-merchant accounts and relationships',
};

export default function Page() {
  return (
    <PageContainer>
      <SubMerchantsPage />
    </PageContainer>
  );
}