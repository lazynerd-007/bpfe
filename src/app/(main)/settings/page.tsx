import { Metadata } from 'next';
import { PageContainer } from '@/components/layout/page-container';
import SettingsPage from '@/features/settings';

export const metadata: Metadata = {
  title: 'Settings - Blupay Africa',
  description: 'Manage your account settings and preferences',
};

export default function Page() {
  return (
    <PageContainer>
      <SettingsPage />
    </PageContainer>
  );
}