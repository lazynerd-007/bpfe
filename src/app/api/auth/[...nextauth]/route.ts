import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';
import { authService } from '@/sdk/auth';
import { User } from '@/sdk/types';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        userType: { label: 'User Type', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('[NextAuth] Missing credentials');
          return null;
        }

        try {
          console.log('[NextAuth] Attempting login for:', credentials.email);
          const loginResponse = await authService.login({
            email: credentials.email,
            password: credentials.password,
            userType: (credentials.userType as 'finance' | 'support' | 'administrator' | 'merchant' | 'submerchant' | 'partner-bank') || 'administrator',
          });
          
          console.log('[NextAuth] Login successful, response:', JSON.stringify({
            hasToken: !!loginResponse.token,
            hasUser: !!loginResponse.user,
            userEmail: loginResponse.user?.email,
            userRole: loginResponse.user?.role,
            userTypeInRequest: credentials.userType,
            rawUserData: loginResponse.user
          }, null, 2));

          // Ensure role is properly set for admin access
          const userWithAdminRole = {
            ...loginResponse.user,
            role: loginResponse.user?.role || 'administrator'
          };

          return {
            id: (loginResponse.user as any).uuid || loginResponse.user.id,
            email: loginResponse.user.email,
            name: `${loginResponse.user.firstName || 'User'} ${loginResponse.user.lastName || ''}`.trim(),
            token: loginResponse.token,
            user: userWithAdminRole,
          };
        } catch (error) {
          console.error('[NextAuth] Login failed:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      try {
        if (user) {
          // Enhanced token validation in NextAuth JWT callback
          const userToken = user.token;
          if (!userToken) {
            console.error('[NextAuth] JWT callback: user.token is empty/null');
            throw new Error('Invalid token received from login');
          }
          
          const tokenStr = String(userToken).trim();
          if (!tokenStr) {
            console.error('[NextAuth] JWT callback: user.token is whitespace-only');
            throw new Error('Invalid token format received from login');
          }
          
          console.log('[NextAuth] JWT callback: Setting token');
          console.log('[NextAuth] Token type:', typeof userToken);
          console.log('[NextAuth] Token length:', tokenStr.length);
          console.log('[NextAuth] Token (first 20 chars):', tokenStr.substring(0, 20) + '...');
          
          token.accessToken = tokenStr;
          token.user = user.user;
        }
        return token;
      } catch (error) {
        console.error('[NextAuth] JWT callback error:', error);
        // Return token without modifications to prevent session failure
        return token;
      }
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      try {
        console.log('[NextAuth] Session callback called');
        session.accessToken = token.accessToken as string;
        session.user = token.user as User;
        console.log('[NextAuth] Session callback completed successfully');
        return session;
      } catch (error) {
        console.error('[NextAuth] Session callback error:', error);
        // Return session without modifications to prevent failure
        return session;
      }
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };