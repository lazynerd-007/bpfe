import {Metadata} from 'next';
import {LoginForm} from '@/features/auth/login-form';

export const metadata: Metadata = {
    title: 'Login - Blupay Africa',
    description: 'Sign in to your Blupay Africa account',
};

export default function LoginPage() {
    return (
        <LoginForm/>
    );
}