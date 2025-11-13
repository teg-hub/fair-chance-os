'use server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { Database } from './types'

export type Tenant = { id: string; name: string; subdomain: string }

export async function getTenant() {
  const cookieStore = cookies()
  const sub = cookieStore.get('tenant_subdomain')?.value
  if (!sub) return null

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  )

  const { data, error } = await supabase
    .from('tenants')
    .select('id,name,subdomain')
    .eq('subdomain', sub)
    .maybeSingle()

  if (error) throw error
  return data as Tenant | null
}
