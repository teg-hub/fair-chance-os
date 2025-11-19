# FairChance Employment MVP

## Configure Supabase
1. Create project → run the SQL from the planning document or schema section.
2. Create bucket `documents` and policies (SQL provided).

## Deploy
1. Import repo in **Vercel** and set env vars:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. Deploy. Open `/employees` to add notes with file uploads.
