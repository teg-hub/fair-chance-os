import { NextResponse, NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const url = req.nextUrl
  const host = req.headers.get('host') || ''
  const appDomain = process.env.APP_DOMAIN || 'localhost:3000'

  // Preview override: ?tenant=pilot OR /t/pilot
  const qpTenant = url.searchParams.get('tenant')
  const pathTenant = url.pathname.startsWith('/t/') ? url.pathname.split('/')[2] || null : null
  const forcedTenant = qpTenant || pathTenant
  if (forcedTenant) {
    const res = NextResponse.redirect(new URL('/', req.url))
    res.cookies.set('tenant_subdomain', forcedTenant, { path: '/' })
    return res
  }

  const parts = host.split(':')[0].split('.')
  const apexParts = appDomain.split(':')[0].split('.')
  const isLocal = host.includes('localhost')

  let subdomain: string | null = null
  if (isLocal) {
    if (parts.length > 2) subdomain = parts[0]          // tenant.localhost
  } else if (host.endsWith(appDomain) && parts.length > apexParts.length) {
    subdomain = parts[0]                                 // tenant.yourapp.com
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
