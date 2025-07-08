import { NextResponse, NextRequest } from 'next/server';
import { extractSubdomain } from './lib/subdomain';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const subdomain = extractSubdomain(request);
  const url = request.nextUrl;
  const header = request.headers;
  const hostname = header.get('host') || '';
  const domainParts = hostname.split('.');
  const searchParams = url.searchParams;
  const { pathname } = request.nextUrl;

  const pathWithSearchParams = `${pathname}${
    searchParams.toString() ? `?${searchParams.toString()}` : ''
  }`;

  //   header reqwrite for server side used
  const rewriteHeader = new Headers(header);
  rewriteHeader.set('x-current-url', pathWithSearchParams);
  rewriteHeader.set('x-current-host', hostname);
  rewriteHeader.set('x-current-domain', domainParts[0] || '');
  rewriteHeader.set('x-current-pathname', pathname);
  rewriteHeader.set('x-current-search-params', searchParams.toString());
  rewriteHeader.set('x-current-protocol', url.protocol);
  rewriteHeader.set('x-current-origin', url.origin);
  rewriteHeader.set('x-current-full-url', url.href);

  const responseHeader = {
    headers: rewriteHeader,
  };

  if (subdomain) {
    rewriteHeader.set('x-current-subdomain', subdomain);
    if (subdomain === 'console' || subdomain === 'docs') {
      // Redirect to console page if subdomain is 'console'
      const rewriteUrl = new URL(`/${subdomain}${pathname}`, request.url);
      return NextResponse.rewrite(rewriteUrl, responseHeader);
    }
  }

  return NextResponse.next(responseHeader);
}

export const config = {
  matcher: ['/((?!api/|_next/|_static/|_vercel|icons/|[\\w-]+\\.\\w+).*)'],
};
