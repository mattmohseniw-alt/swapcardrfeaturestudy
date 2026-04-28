import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/check-in-demo')) {
    const base = request.nextUrl.origin
    fetch(`${base}/api/visit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pathname,
        referrer: request.headers.get('referer') ?? '',
        userAgent: request.headers.get('user-agent') ?? '',
      }),
    }).catch(() => {})
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/check-in-demo/:path*',
}
