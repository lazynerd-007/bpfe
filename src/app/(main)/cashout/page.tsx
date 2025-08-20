import { Metadata } from 'next';
import { PageContainer } from '@/components/layout/page-container';
import CashoutPage from '@/features/cashout';

export const metadata: Metadata = {
  title: 'Cashout - Blupay Africa',
  description: 'Bulk payout operations with OTP verification',
};

export default function Page() {
  return (
    <PageContainer>
      <CashoutPage />
    </PageContainer>
  );
}