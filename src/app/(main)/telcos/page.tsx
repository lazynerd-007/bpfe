import { Metadata } from 'next';
import { PageContainer } from '@/components/layout/page-container';
import TelcosPage from '@/features/telcos';

export const metadata: Metadata = {
  title: 'Telcos Management - Blupay Africa',
  description: 'Manage telco provider configurations and settings',
};

export default function Page() {
  return (
    <PageContainer>
      <TelcosPage />
    </PageContainer>
  );
}