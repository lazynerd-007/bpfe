import { Metadata } from 'next';
import { PageContainer } from '@/components/layout/page-container';
import HelpPage from '@/features/help';

export const metadata: Metadata = {
  title: 'Help & Support - Blupay Africa',
  description: 'Get help and support for using the Blupay platform',
};

export default function Page() {
  return (
    <PageContainer>
      <HelpPage />
    </PageContainer>
  );
}