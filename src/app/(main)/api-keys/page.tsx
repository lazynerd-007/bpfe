import { Metadata } from 'next';
import { PageContainer } from '@/components/layout/page-container';
import ApiKeysPage from '@/features/api-keys';

export const metadata: Metadata = {
  title: 'API Keys - Blupay Africa',
  description: 'Manage API keys and integrations',
};

export default function Page() {
  return (
    <PageContainer>
      <ApiKeysPage />
    </PageContainer>
  );
}