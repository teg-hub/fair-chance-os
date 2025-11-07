import { NextResponse, NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const url = req.nextUrl
  const host = req.headers.get('host') || ''
  const appDomain = process.env.APP_DOMAIN || 'localhost:3000'

  // Allow manual override: ?tenant=pilot  OR  /t/pilot  (sets cookie and redirects cleanly)
  const qpTenant = url.searchParams.get('tenant')
  const pathTenant = url.pathname.startsWith('/t/')
    ? url.pathname.split('/')[2] || null
    : null
  const forcedTenant = qpTenant || pathTenant

  if (forcedTenant) {
    const res = NextResponse.redirect(new URL('/', req.url))
    res.cookies.set('tenant_subdomain', forcedTenant, { path: '/' })
    return res
  }

  const parts = host.split(':')[0].split('.')
  const apexParts = appDomain.split(':')[0].split('.')

  let subdomain: string | null = null
  const isLocal = host.includes('localhost')

  if (isLocal) {
    // dev: tenant.localhost
    if (parts.length > 2) subdomain = parts[0]
  } else if (host.endsWith(appDomain) && parts.length > apexParts.length) {
    // prod: tenant.yourapp.com
    subdomain = parts[0]
  } else {
    // Vercel previews: allow ?tenant=... (handled above).
    // No-op here so previews without a custom domain rely on the query param.
  }

  if (subdomain) {
    const res = NextResponse.next()
    res.cookies.set('tenant_subdomain', subdomain, { path: '/' })
    return res
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/.*|favicon.ico|robots.txt|sitemap.xml|api/health).*)'],
}
