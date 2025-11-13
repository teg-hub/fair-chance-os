import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import type { Database } from './types'

export type Tenant = { id: string; name: string; subdomain: string }

export async function getTenant() {
  try {
    const cookieStore = cookies()
    const sub = cookieStore.get('tenant_subdomain')?.value
    if (!sub) return null

    const supabase = createServerClient<Database, 'app'>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get: (name: string) => cookieStore.get(name)?.value } } as any
    )

    const { data, error } = await supabase
      .from('tenants')
      .select('id,name,subdomain')
      .eq('subdomain', sub)
      .maybeSingle()

    if (error) return null
    return (data as Tenant) ?? null
  } catch {
    return null
  }
}
