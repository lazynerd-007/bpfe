import { Metadata } from 'next';
import { PageContainer } from '@/components/layout/page-container';
import SPTransfersPage from '@/features/sp-transfers';

export const metadata: Metadata = {
  title: 'SP Transfers - Blupay Africa',
  description: 'Special purpose transfers and bulk operations',
};

export default function Page() {
  return (
    <PageContainer>
      <SPTransfersPage />
    </PageContainer>
  );
}