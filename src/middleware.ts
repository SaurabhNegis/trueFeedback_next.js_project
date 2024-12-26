import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Export NextAuth middleware
export { default } from 'next-auth/middleware';

// The custom middleware function
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  const isAuthRoute =
    url.pathname.startsWith('/sign-in') ||
    url.pathname.startsWith('/sign-up') ||
    url.pathname.startsWith('/verify');

  const isDashboardRoute = url.pathname.startsWith('/dashboard');

  // Redirect logged-in users away from auth pages
  if (token && isAuthRoute) {
    if (url.pathname !== '/dashboard') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next(); // Allow access if already on /dashboard
  }

  // Redirect unauthenticated users away from protected routes
  if (!token && isDashboardRoute) {
    if (url.pathname !== '/sign-in') {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    return NextResponse.next(); // Allow access to /sign-in
  }

  // Allow all other requests to proceed
  return NextResponse.next();
}

// Define which routes the middleware applies to
export const config = {
  matcher: [
    '/', // Home page
    '/sign-in', // Sign-in page
    '/sign-up', // Sign-up page
    '/dashboard/:path*', // Dashboard and any sub-paths
    '/verify/:path*', // Verify page and any sub-paths
  ],
};
