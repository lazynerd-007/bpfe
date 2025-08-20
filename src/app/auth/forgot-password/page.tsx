import { Metadata } from 'next';
import { ForgotPasswordForm } from '@/features/auth/forgot-password-form';

export const metadata: Metadata = {
  title: 'Forgot Password - Blupay Africa',
  description: 'Reset your Blupay Africa account password',
};

export default function ForgotPasswordPage() {
  return (
      <ForgotPasswordForm />
  );
}