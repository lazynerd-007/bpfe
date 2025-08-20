import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback } from 'react';
import {
  currentUserAtom,
  isAuthenticatedAtom,
  authLoadingAtom,
  authErrorAtom,
  loginAtom,
  logoutAtom,
  initializeAuthAtom,
  requestPasswordResetAtom,
  completePasswordResetAtom,
} from './atoms';
import {UserRoleEnum} from '@/sdk/types';

export function useAuth() {
  const [user, setUser] = useAtom(currentUserAtom);
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const loading = useAtomValue(authLoadingAtom);
  const error = useAtomValue(authErrorAtom);

  return {
    user,
    isAuthenticated,
    loading,
    error,
  };
}

export function useLogin() {
  const [, login] = useAtom(loginAtom);
  const loading = useAtomValue(authLoadingAtom);
  const error = useAtomValue(authErrorAtom);

  const handleLogin = useCallback(
    async (credentials: { email: string; password: string }) => {
      return await login(credentials);
    },
    [login]
  );

  return {
    login: handleLogin,
    loading,
    error,
  };
}

export function useLogout() {
  const [, logout] = useAtom(logoutAtom);

  const handleLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  return {
    logout: handleLogout,
  };
}

export function useInitializeAuth() {
  const [, initialize] = useAtom(initializeAuthAtom);

  const initializeAuth = useCallback(async () => {
    await initialize();
  }, [initialize]);

  return {
    initializeAuth,
  };
}

export function usePasswordReset() {
  const [, requestReset] = useAtom(requestPasswordResetAtom);
  const [, completeReset] = useAtom(completePasswordResetAtom);
  const loading = useAtomValue(authLoadingAtom);
  const error = useAtomValue(authErrorAtom);

  const requestPasswordReset = useCallback(
    async (email: string) => {
      await requestReset(email);
    },
    [requestReset]
  );

  const completePasswordReset = useCallback(
    async (token: string, newPassword: string) => {
      await completeReset({ token, newPassword });
    },
    [completeReset]
  );

  return {
    requestPasswordReset,
    completePasswordReset,
    loading,
    error,
  };
}
