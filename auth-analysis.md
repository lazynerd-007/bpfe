# Authentication Bearer Token Analysis

## Current Issues Identified

Based on the code analysis, here are the potential issues with bearer token parsing:

### 1. **Token Storage and Retrieval Race Conditions**

The authentication system uses multiple storage mechanisms:
- NextAuth JWT tokens in cookies
- Jotai atoms with localStorage (`authTokenAtom`)
- API client instance token (`apiClient.setAuth()`)

Potential issues:
- Race conditions between NextAuth session loading and localStorage restoration
- Token might not be properly set in API client during initial load
- Multiple sources of truth for authentication state

### 2. **API Client Token Setting**

In `src/sdk/client.ts` line 25-27:
```typescript
if (this.token) {
  config.headers.Authorization = `Bearer ${this.token}`;
}
```

Potential issues:
- Token might be null when requests are made
- No validation of token format
- No debugging logs to verify token is being set

### 3. **Auth Provider Logic**

In `src/providers/auth-provider.tsx`:
- Complex logic with multiple useEffect hooks
- Race conditions between session status and localStorage
- Token might not be restored properly on page refresh

### 4. **NextAuth Configuration**

In `src/app/api/auth/[...nextauth]/route.ts`:
- Token is stored as `token.accessToken` but might not be properly passed
- No token validation or refresh logic

## Debugging Steps

### Step 1: Add Debug Logging
Add console.log statements to track token flow:

1. In API client interceptor
2. In auth provider when setting tokens
3. In NextAuth callbacks

### Step 2: Check Network Requests
1. Open browser DevTools
2. Go to Network tab
3. Look for requests missing Authorization header
4. Check if token format is correct: `Bearer <token>`

### Step 3: Verify Token Storage
1. Check localStorage for 'auth-token'
2. Check NextAuth session in Application tab
3. Verify tokens match between storage mechanisms

## Recommended Fixes

### Fix 1: Add Token Validation
```typescript
// In src/sdk/client.ts
private setupInterceptors() {
  this.client.interceptors.request.use(
    (config) => {
      if (this.token) {
        console.log('Setting Authorization header with token:', this.token.substring(0, 20) + '...');
        config.headers.Authorization = `Bearer ${this.token}`;
      } else {
        console.warn('No token available for request to:', config.url);
      }
      // ... rest of the code
    }
  );
}
```

### Fix 2: Improve Auth Provider
```typescript
// In src/providers/auth-provider.tsx
// Add more robust token synchronization
const syncTokens = useCallback(() => {
  const sessionToken = session?.accessToken;
  const storedToken = currentToken;
  
  if (sessionToken && sessionToken !== storedToken) {
    console.log('Syncing tokens: session token differs from stored');
    updateAuthState(session.user, sessionToken, session.partnerBank);
  } else if (storedToken && !sessionToken) {
    console.log('Using stored token, no session token');
    apiClient.setAuth(storedToken, currentPartnerBank || undefined);
  }
}, [session, currentToken, currentPartnerBank]);
```

### Fix 3: Add Token Refresh Logic
```typescript
// In src/sdk/client.ts response interceptor
this.client.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => response,
  async (error: AxiosError<ApiResponse>) => {
    if (error.response?.status === 401) {
      console.log('401 Unauthorized - clearing auth and redirecting');
      this.clearAuth();
      
      // Clear all auth storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('current-user');
        localStorage.removeItem('partner-bank');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);
```

## Testing Steps

1. **Login Flow Test**:
   - Clear all storage
   - Login with valid credentials
   - Check if token is properly set in all storage mechanisms
   - Make an authenticated API request

2. **Page Refresh Test**:
   - Login successfully
   - Refresh the page
   - Check if token is restored and API requests work

3. **Token Expiry Test**:
   - Login successfully
   - Wait for token to expire or manually trigger 401
   - Check if user is properly redirected to login

## Environment Check

Ensure these environment variables are set:
- `NEXT_PUBLIC_API_URL`: Should point to your backend API
- `NEXTAUTH_SECRET`: Required for JWT signing
- `NEXTAUTH_URL`: Should match your frontend URL

Current default: `http://localhost:3001/api`
Make sure your backend is running on this URL or update the environment variable.