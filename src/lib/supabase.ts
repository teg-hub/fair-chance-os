import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// Server-side client (SSR/Server Components) scoped to "app" schema
export function supabaseServer() {
  const c = cookies()
  return createServerClient<Database, 'app'>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    // Type the cookie callback param to satisfy TS
    { cookies: { get: (name: string) => c.get(name)?.value } } as any
  )
}

// Browser client (Client Components) scoped to "app" schema
export function supabaseBrowser() {
  return createClient<Database, 'app'>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { db: { schema: 'app' } } as any
  )
}
