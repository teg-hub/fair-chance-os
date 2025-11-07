import { NextResponse, NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const url = req.nextUrl
  const host = req.headers.get('host') || ''
  const appDomain = process.env.APP_DOMAIN || 'localhost:3000'

  // Allow localhost:3000 and tenant.localhost:3000 (dev)
  const isLocal = host.includes('localhost')
  const parts = host.split(':')[0].split('.')
  const apexParts = appDomain.split(':')[0].split('.')

  let subdomain: string | null = null
  if (isLocal) {
    // dev: tenant.localhost
    if (parts.length > 2) subdomain = parts[0]
  } else {
    // prod: tenant.yourapp.com
    if (host.endsWith(appDomain) && parts.length > apexParts.length) {
      subdomain = parts[0]
    }
  }

  // Persist subdomain in a cookie for server components
  if (subdomain) {
    const res = NextResponse.next()
    res.cookies.set('tenant_subdomain', subdomain, { path: '/' })
    return res
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/.*|favicon.ico|robots.txt|sitemap.xml|api/health).*)',
  ],
}
