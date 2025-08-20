import { Metadata } from 'next';
import UsersPage from '@/features/users';

export const metadata: Metadata = {
  title: 'Users - Blupay Africa',
  description: 'Manage user accounts and permissions',
};

export default function Page() {
  return (
      <UsersPage />
  );
}