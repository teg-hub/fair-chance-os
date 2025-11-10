import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
// Use a permissive type during setup or your generated types later.
export type Database = any

export function supabaseServer() {
  const c = cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: { get: (name) => c.get(name)?.value },
      db: { schema: 'app' }, // <-- default to app schema
    }
  )
}

export function supabaseBrowser() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { db: { schema: 'app' } } // <-- default to app schema
  )
}
