import { redirect } from 'next/navigation';

// Default onboarding page redirects to first step
export default function OnboardingPage() {
  redirect('/merchants/onboarding/merchant-details');
}