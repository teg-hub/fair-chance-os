# FairChanceOS MVP

## Configure Supabase
1. Create project → run the SQL in `/docs/schema.sql` (or copy from this README section).
2. Create bucket `documents` and policies (SQL provided above).

## Deploy
1. In GitHub → Settings → Secrets and variables → **Actions** or set in Vercel.
2. Import repo in **Vercel** and set env vars:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy. Open `/employees` to add notes with file uploads (to Supabase Storage).
