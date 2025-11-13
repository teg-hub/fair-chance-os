import { headers, cookies } from 'next/headers'

export default function DebugPage() {
  const h = headers()
  const host = h.get('host') || '(none)'
  const cookieStore = cookies()
  const tenantCookie = cookieStore.get('tenant_subdomain')?.value || '(missing)'

  return (
    <pre style={{ padding: 16, background: '#fff', border: '1px solid #ddd' }}>
{`Host: ${host}
tenant_subdomain cookie: ${tenantCookie}
APP_DOMAIN: ${process.env.APP_DOMAIN || '(unset)'}
`}
    </pre>
  )
}
