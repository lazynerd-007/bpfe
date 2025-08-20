import { Metadata } from 'next';
import { PageContainer } from '@/components/layout/page-container';
import RemittancePage from '@/features/remittance';

export const metadata: Metadata = {
  title: 'Remittance - Blupay Africa',
  description: 'International money transfer and remittance management',
};

export default function Page() {
  return (
    <PageContainer>
      <RemittancePage />
    </PageContainer>
  );
}