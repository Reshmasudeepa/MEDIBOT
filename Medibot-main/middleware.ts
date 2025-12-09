import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const { pathname } = request.nextUrl;

  // List of valid routes in your app
  const validRoutes = [
    '/',
    '/chat',
    '/pricing',
    '/premium',
    '/premium-features',
    '/appointments',
    '/auth/signin',
    '/auth/signup',
    '/auth/forgot-password',
    '/profile',
    '/profile-setup',
    '/history',
    '/medications',
    '/summarizer',
    '/feedback',
    '/collaborations',
    '/dashboard',
    '/privacy',
    '/terms',
    '/refund',
    '/api'
  ];

  // Check if the pathname starts with any valid route or is an API route
  const isValidRoute = validRoutes.some(route => {
    if (route === '/api') {
      return pathname.startsWith('/api/');
    }
    return pathname === route || pathname.startsWith(route + '/');
  });

  // Check for static files (images, fonts, etc.)
  const isStaticFile = pathname.includes('.') && !pathname.endsWith('.tsx') && !pathname.endsWith('.ts');

  // Allow Next.js internal routes
  const isNextInternal = pathname.startsWith('/_next/') || pathname.startsWith('/favicon.ico');

  // If it's not a valid route, static file, or Next.js internal route, let Next.js handle it
  // Next.js will automatically show the 404 page for invalid routes
  if (!isValidRoute && !isStaticFile && !isNextInternal) {
    // Let Next.js handle this naturally - it will show the not-found.tsx page
    return NextResponse.next();
  }

  // Continue with the request
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
