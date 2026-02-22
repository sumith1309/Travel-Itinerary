import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // Apply security headers to all routes
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Cache headers for API routes
  if (pathname.startsWith('/api/')) {
    const method = request.method;

    // SSE streaming endpoints — special headers
    if (pathname.startsWith('/api/chat/stream')) {
      response.headers.set('Cache-Control', 'no-store, no-cache');
      response.headers.set('X-Accel-Buffering', 'no');
      return response;
    }

    if (method === 'GET') {
      // Public cacheable endpoints
      if (
        pathname.startsWith('/api/destinations') ||
        pathname.startsWith('/api/visa')
      ) {
        response.headers.set(
          'Cache-Control',
          'public, s-maxage=60, stale-while-revalidate=300'
        );
      } else {
        // All other API routes — no cache
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
      }
    } else {
      response.headers.set('Cache-Control', 'no-store');
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Match all paths except static files and next internals
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
