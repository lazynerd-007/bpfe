'use client';

import { LoginForm } from './login-form';

export { LoginForm };
export { useAuth, useLogin, useLogout, useInitializeAuth, usePasswordReset } from './hooks';
export * from './atoms';

export default function AuthFeature() {
  return <LoginForm />;
}