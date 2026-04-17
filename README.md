# NH Services

Marketing + lead-capture site for NH Services, a family-run HVAC business in the Denver metro.

## Tech stack

- **Next.js 16** (App Router, Turbopack) + React 19
- **Supabase** — Postgres + Storage. App talks to it via `@supabase/supabase-js` with the `service_role` key server-side.
- **Auth.js v5** — Credentials provider + JWT sessions. Admin-only routes gated by `proxy.ts`; Server Actions re-check `assertAdmin()`.
- **HeroUI** + **Tailwind CSS v4**
- **Motion** (`motion/react`) + **Embla Carousel**
- **@emailjs/browser** — client-side contact form
- **Vercel** — hosting + Web Analytics

## Dev commands

```bash
npm install            # install deps
npm run dev            # start on port 4700 (predev kills any existing 4700 listener)
npm run build          # production build
npm run start          # run the built app on port 4700
npm run lint           # eslint
npm run format         # prettier write

npm run db:smoke       # Supabase insert/read/delete roundtrip
npm run db:seed-admin  # bcrypt-hash ADMIN_PASSWORD and upsert the admin row
```

## Env vars

See `.env.example`. Minimum to boot:

- `NEXT_PUBLIC_SUPABASE_URL` — project URL (e.g. `https://abc123.supabase.co`)
- `SUPABASE_SERVICE_ROLE_KEY` — server-only. **Never** prefix with `NEXT_PUBLIC_`.
- `AUTH_SECRET` — `openssl rand -base64 32`
- `AUTH_URL=http://localhost:4700` (local) / production URL on Vercel
- `ADMIN_EMAIL`, `ADMIN_PASSWORD` (one-time for the seeder; remove from Vercel after seeding)
- `NEXT_PUBLIC_EMAILJS_SERVICE_ID` / `_TEMPLATE_ID` / `_PUBLIC_KEY` (contact form)
- `NEXT_PUBLIC_SITE_URL` (drives sitemap, robots, OG metadataBase)

## First-time setup

1. Create a Supabase project at https://supabase.com.
2. Copy `.env.example` to `.env.local` and fill in values.
3. Open Supabase Dashboard → SQL Editor → New query. Paste `db/schema.sql` and run it. Creates 8 tables + 2 storage buckets (`gallery`, `brochures`) + RLS policies.
4. Seed the admin user:
   ```bash
   npm run db:seed-admin
   ```
5. Start dev:
   ```bash
   npm run dev
   ```
   Log in at `http://localhost:4700/admin/login`.

## Admin surface

Once logged in at `/admin`, you have:

- **Testimonials** — `/admin/testimonials`: approve / unapprove / delete public submissions.
- **Gallery** — `/admin/gallery`: drag-and-drop image uploads; edit alt text; delete. Changes reflect on public `/gallery` immediately (cache tag invalidation).
- **Brochures** — `/admin/brochures`: drag-and-drop PDF uploads with title + category. Powers the Equipment dropdown in the navbar.

## Docs

Internal docs live in `/docs` (gitignored):

- `ARCHITECTURE.md` — code layout + routing map
- `DEPLOYMENT.md` — Vercel runbook
- `CLIENT_RUNBOOK.md` — non-developer admin guide
- `BACKLOG.md` — post-launch follow-ups
- `LAUNCH_REPORT.md` — what shipped + known limitations

Sprint specs live in `/sprints` (gitignored).
