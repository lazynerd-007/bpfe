import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { UserRoleEnum } from '@/sdk/types';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    if (pathname.startsWith('/auth')) {
      if (token) {
        return NextResponse.redirect(new URL('/', req.url));
      }
      return NextResponse.next();
    }

    if (!token && !pathname.startsWith('/auth')) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    const userRole = token?.user?.role?.toString().trim().toLowerCase();
    const adminRole = UserRoleEnum.ADMIN.toLowerCase();
    
    // Debug logging for role issues
    console.log('[Middleware] Path:', pathname);
    console.log('[Middleware] Token structure:', JSON.stringify(token, null, 2));
    console.log('[Middleware] Raw user role:', token?.user?.role);
    console.log('[Middleware] Normalized user role:', userRole);
    console.log('[Middleware] Expected admin role:', adminRole);
    console.log('[Middleware] Role match:', userRole === adminRole);
    
    // All protected routes are now admin-only
    const protectedRoutes = ['/admin', '/merchants', '/users', '/partner', '/merchant'];
    
    for (const route of protectedRoutes) {
      if (pathname.startsWith(route) && userRole !== adminRole) {
        console.log(`[Middleware] ${route} access denied for role:`, userRole);
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }

    // Admin has access to everything
    if (userRole === adminRole) {
        console.log('[Middleware] Admin access granted');
        return NextResponse.next();
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        
        // Always allow NextAuth API routes
        if (pathname.startsWith('/api/auth')) {
          return true;
        }
        
        // Allow other API routes
        if (pathname.startsWith('/api')) {
          return true;
        }
        
        if (pathname.startsWith('/auth')) {
          return true;
        }
        
        return !!token;
      },
    },
  }
);


export const config = {
    matcher: [
        // Only match paths that don't start with these prefixes:
        '/((?!api|_next/static|_next/image|favicon.ico|.*\.png|.*\.jpg|.*\.jpeg|.*\.webp|.*\.svg|.*\.gif|.*\.ico).*)',
    ],
};
