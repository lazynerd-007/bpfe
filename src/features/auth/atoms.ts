import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { User } from '@/sdk/types';

export const currentUserAtom = atomWithStorage<User | null>('current-user', null);

export const isAuthenticatedAtom = atom(
  (get) => get(currentUserAtom) !== null
);

export const authTokenAtom = atomWithStorage<string | null>('auth-token', null);

// Partner bank atom removed for admin panel

export const authLoadingAtom = atom(false);

export const authErrorAtom = atom<string | null>(null);

export const loginAtom = atom(
  null,
  async (get, set, credentials: { email: string; password: string }) => {
    try {
      set(authLoadingAtom, true);
      set(authErrorAtom, null);
      
      const { authService } = await import('@/sdk/auth');
      
      const response = await authService.login({
        email: credentials.email,
        password: credentials.password,
      });
      
      set(authTokenAtom, response.token);
      set(currentUserAtom, response.user);
      
      const { apiClient } = await import('@/sdk/client');
      apiClient.setAuth(response.token);
      
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      set(authErrorAtom, message);
      throw error;
    } finally {
      set(authLoadingAtom, false);
    }
  }
);

export const logoutAtom = atom(
  null,
  async (get, set) => {
    try {
      const { authService } = await import('@/sdk/auth');
      const { signOut } = await import('next-auth/react');
      
      // Clear our custom auth state
      authService.logout();
      
      set(currentUserAtom, null);
      set(authTokenAtom, null);
      set(authErrorAtom, null);
      
      // Sign out from NextAuth session
      await signOut({ redirect: false });
      
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
);

export const initializeAuthAtom = atom(
  null,
  async (get, set) => {
    try {
      const token = get(authTokenAtom);
      
      if (token) {
        const { apiClient } = await import('@/sdk/client');
        apiClient.setAuth(token);
        
        const { authService } = await import('@/sdk/auth');
        const user = await authService.getMe();
        set(currentUserAtom, user);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      set(currentUserAtom, null);
      set(authTokenAtom, null);
    }
  }
);

export const requestPasswordResetAtom = atom(
  null,
  async (get, set, email: string) => {
    try {
      set(authLoadingAtom, true);
      set(authErrorAtom, null);
      
      const { authService } = await import('@/sdk/auth');
      await authService.initiatePasswordReset(email);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to request password reset';
      set(authErrorAtom, message);
      throw error;
    } finally {
      set(authLoadingAtom, false);
    }
  }
);

export const completePasswordResetAtom = atom(
  null,
  async (get, set, { token, newPassword }: { token: string; newPassword: string }) => {
    try {
      set(authLoadingAtom, true);
      set(authErrorAtom, null);
      
      const { authService } = await import('@/sdk/auth');
      await authService.completePasswordReset({ token, password: newPassword });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to reset password';
      set(authErrorAtom, message);
      throw error;
    } finally {
      set(authLoadingAtom, false);
    }
  }
);