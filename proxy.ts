import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';

  // Exclude static assets, API calls, and Next.js internals
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/images') ||
    url.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 1. Subdomain routing for Admin: admin.bakeistry.com or admin.localhost:3000
  if (hostname.startsWith('admin.')) {
    // If request is to root of admin subdomain, route to /admin
    if (url.pathname === '/') {
      url.pathname = '/admin';
      return NextResponse.rewrite(url);
    }
    // If request doesn't already start with /admin, prefix it
    if (!url.pathname.startsWith('/admin')) {
      url.pathname = `/admin${url.pathname}`;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // 2. Subdomain routing for Student Learning LMS: learn.bakeistry.com or learn.localhost:3000
  if (hostname.startsWith('learn.')) {
    if (url.pathname === '/') {
      url.pathname = '/account/learning';
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, images, sitemap, robots
     */
    '/((?!_next/static|_next/image|favicon.ico|images/).*)',
  ],
};
