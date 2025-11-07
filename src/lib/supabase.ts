'use server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

export function supabaseServer() {
  const c = cookies()
  return createServerClient<Database>(
    process.env.https://gktfwtcngzxxoazhoshs.supabase.co!,
    process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrdGZ3dGNuZ3p4eG9hemhvc2hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NTk4ODksImV4cCI6MjA3ODAzNTg4OX0.OHBfU-wRhnqJ4JKIw7JWRQMmq83t35iPbppNICpio7w!,
    { cookies: { get: (name) => c.get(name)?.value } }
  )
}

export function supabaseBrowser() {
  return createClient<Database>(
    process.env.https://gktfwtcngzxxoazhoshs.supabase.co!,
    process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrdGZ3dGNuZ3p4eG9hemhvc2hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NTk4ODksImV4cCI6MjA3ODAzNTg4OX0.OHBfU-wRhnqJ4JKIw7JWRQMmq83t35iPbppNICpio7w!
  )
}
