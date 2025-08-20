'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useSetAtom, useAtomValue } from 'jotai';
import { currentUserAtom, authTokenAtom } from '@/features/auth/atoms';
import { apiClient } from '@/sdk/client';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const setCurrentUser = useSetAtom(currentUserAtom);
  const setAuthToken = useSetAtom(authTokenAtom);
  // Partner bank logic removed for admin panel
  
  // Use refs to track initialization state and prevent race conditions
  const isInitialized = useRef(false);
  const lastSessionRef = useRef(session);
  const lastStatusRef = useRef(status);
  
  // Read current values from atoms (persisted in localStorage)
  const currentToken = useAtomValue(authTokenAtom);
  const currentUser = useAtomValue(currentUserAtom);

  // Memoized function to clear auth state
  const clearAuthState = useCallback(() => {
    console.log('[Auth Provider] Clearing auth state');
    setCurrentUser(null);
    setAuthToken(null);
    apiClient.clearAuth();
  }, [setCurrentUser, setAuthToken]);

  // Memoized function to update auth state
  const updateAuthState = useCallback((user: any, token: string) => {
    console.log('[Auth Provider] Updating auth state');
    console.log('[Auth Provider] User:', user?.email || 'No email');
    console.log('[Auth Provider] User object:', JSON.stringify(user, null, 2));
    
    // Enhanced token validation in auth provider
    if (!token) {
      console.error('[Auth Provider] updateAuthState called with empty/null token');
      clearAuthState();
      return;
    }
    
    const tokenStr = String(token).trim();
    if (!tokenStr) {
      console.error('[Auth Provider] updateAuthState called with whitespace-only token');
      clearAuthState();
      return;
    }
    
    console.log('[Auth Provider] Token type:', typeof token);
    console.log('[Auth Provider] Token length:', tokenStr.length);
    console.log('[Auth Provider] Token (first 20 chars):', tokenStr.substring(0, 20) + '...');
    
    setCurrentUser(user);
    setAuthToken(tokenStr);
    apiClient.setAuth(tokenStr);
  }, [setCurrentUser, setAuthToken, clearAuthState]);

  // Handle session changes with race condition protection
  useEffect(() => {
    // Prevent unnecessary updates if session/status haven't actually changed
    if (lastSessionRef.current === session && lastStatusRef.current === status) {
      return;
    }
    
    console.log('[Auth Provider] Session changed');
    console.log('[Auth Provider] Status:', status);
    console.log('[Auth Provider] Session exists:', !!session);
    console.log('[Auth Provider] Session has accessToken:', !!session?.accessToken);
    console.log('[Auth Provider] Current stored token exists:', !!currentToken);
    
    lastSessionRef.current = session;
    lastStatusRef.current = status;

    if (status === 'loading') {
      console.log('[Auth Provider] Status is loading');
      // During loading, restore API client from persisted data if available
      if (!isInitialized.current && currentToken && currentUser) {
        console.log('[Auth Provider] Restoring API client from stored data during loading');
        apiClient.setAuth(currentToken);
        isInitialized.current = true;
      }
      return;
    }

    if (session?.accessToken && session?.user) {
      console.log('[Auth Provider] Session available - updating auth state');
      // Session is available - update auth state (NextAuth takes precedence)
      updateAuthState(session.user, session.accessToken);
      isInitialized.current = true;
    } else if (status === 'unauthenticated') {
      console.log('[Auth Provider] Status is unauthenticated - clearing auth state');
      // Explicitly unauthenticated - clear auth state
      clearAuthState();
      isInitialized.current = true;
    }
    // Note: We don't clear on session === null during loading to prevent race conditions
  }, [session, status, currentToken, currentUser, updateAuthState, clearAuthState]);

  // Separate effect for initial restoration from localStorage
  useEffect(() => {
    if (!isInitialized.current && status !== 'loading' && !session && currentToken && currentUser) {
      // Restore from localStorage when NextAuth session is not available
      apiClient.setAuth(currentToken);
      isInitialized.current = true;
    }
  }, [currentToken, currentUser, session, status]);

  return <>{children}</>;
}