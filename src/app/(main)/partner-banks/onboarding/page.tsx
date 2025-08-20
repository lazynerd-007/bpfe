import { redirect } from 'next/navigation';

// Default onboarding page redirects to first step
export default function PartnerBankOnboardingPage() {
  redirect('/partner-banks/onboarding/basic-details');
}