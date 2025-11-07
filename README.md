# fair-chance-os
// =============================
// README: Setup & Run
// =============================
// 1) Create a new Next.js 14 app:  npx create-next-app@latest fair-chance --ts --eslint --app --src-dir --tailwind
// 2) cd fair-chance
// 3) Install deps:
//    pnpm add @supabase/ssr @supabase/supabase-js zustand zod date-fns recharts class-variance-authority clsx
//    pnpm add next-themes
//    # shadcn/ui
//    pnpm dlx shadcn-ui@latest init -y
//    pnpm dlx shadcn-ui@latest add button card badge input label select table tabs avatar dropdown-menu dialog separator tooltip toast skeleton
// 4) Tailwind: follow Next.js + shadcn instructions (already scaffolded by create-next-app).
// 5) Env vars (set in .env.local):
//    NEXT_PUBLIC_SUPABASE_URL=... 
//    NEXT_PUBLIC_SUPABASE_ANON_KEY=...
//    SUPABASE_SERVICE_ROLE_KEY=...            # server actions requiring service role (Super Admin only)
//    APP_DOMAIN=yourapp.com                   # apex domain; used for tenant subdomain routing
// 6) Run: pnpm dev
// 7) Create a wildcard DNS: *.yourapp.com -> your Vercel project; set "APP_DOMAIN" accordingly.
// 8) Ensure you ran the SQL from earlier steps (schema, RLS, views, storage).
