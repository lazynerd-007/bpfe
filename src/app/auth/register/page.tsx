import {Metadata} from 'next';
import {RegisterForm} from '@/features/auth/register-form';

export const metadata: Metadata = {
    title: 'Register - Blupay Africa',
    description: 'Create your Blupay Africa account',
};

export default function RegisterPage() {
    return (

        <RegisterForm/>
    );
}