import { Metadata } from 'next';
import { PageContainer } from '@/components/layout/page-container';
import SettlementsPage from '@/features/settlements';

export const metadata: Metadata = {
  title: 'Settlements - Blupay Africa',
  description: 'Manage settlement configurations and tracking',
};

export default function Page() {
  return (
    <PageContainer>
      <SettlementsPage />
    </PageContainer>
  );
}