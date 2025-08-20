import {Metadata} from 'next';
import {ResetPasswordForm} from '@/features/auth/reset-password-form';

export const metadata: Metadata = {
    title: 'Reset Password - Blupay Africa',
    description: 'Reset your Blupay Africa account password',
};

export default function ResetPasswordPage() {
    return (

        <ResetPasswordForm/>
    );
}