import { NextRequest, NextResponse } from 'next/server';
export { default } from 'next-auth/middleware';
import { getToken } from 'next-auth/jwt';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // Redirect to dashboard if token is present and trying to access certain routes
  if (token &&
    (
      url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/verify') ||
      url.pathname.startsWith('/')
    )
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url)); // Uncomment this
  }

  // Redirect to home or a valid page if no token is present
  return NextResponse.redirect(new URL('/page', request.url)); // Change '/page' if necessary
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/',                // Home page
    '/sign-in',         // Sign-in page
    '/sign-up',         // Sign-up page
    '/dashboard/:path*',// Dashboard and any sub-paths
    '/verify/:path*',   // Verify page and any sub-paths
  ]
};
 