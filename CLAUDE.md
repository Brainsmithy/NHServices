# NHServices

HVAC business website for NH Services. Next.js 16 + Vercel + Supabase.

## Dev Commands

```bash
npm run dev             # Next.js dev server (Turbopack) on port 4700 (predev kills any stale listener)
npm run build           # Next.js production build
npm run start           # Run the built app on port 4700
npm run lint            # eslint
npm run format          # prettier write
npm run db:smoke        # Supabase roundtrip smoke test (testimonials)
npm run db:seed-admin   # Upsert admin row from ADMIN_EMAIL/ADMIN_PASSWORD
```

## Architecture

### App (Next.js App Router)

```
app/
  layout.tsx               # Root layout + metadata + <Analytics />; fetches brochures for navbar
  page.tsx                 # Home — composes landing sections
  providers.tsx            # HeroUI provider
  globals.css              # Tailwind v4 + brand palette + :focus-visible
  error.tsx                # Error boundary (client)
  not-found.tsx            # 404
  sitemap.ts               # /sitemap.xml — NEXT_PUBLIC_SITE_URL driven
  robots.ts                # /robots.txt — disallows /admin/
  gallery/                 # /gallery — reads gallery_images from Supabase
  (auth)/admin/login/      # /admin/login
  admin/                   # /admin + /admin/{testimonials,gallery,brochures} — proxy-gated
  api/
    auth/[...nextauth]/route.ts
    testimonials/route.ts  # GET (list approved) + POST (insert) — Supabase SDK

components/
  navbar/, footer/, sections/, accordions/, testimonials/, admin/, gallery/
  admin/media-uploader.tsx            # Reusable drag-and-drop zone
  admin/{gallery,brochure}-row-actions.tsx  # Per-item edit/delete wrappers
  admin/testimonial-row-actions.tsx   # Server Action wrappers for testimonials

db/
  schema.sql        # One-shot SQL — paste into Supabase SQL Editor
  index.ts          # Server-only Supabase client (service_role)
  types.ts          # Row types for every public table

lib/
  storage.ts        # publicUrl(bucket, path) helper for Supabase Storage URLs
  rate-limit.ts     # In-memory IP/rate limiter

scripts/
  db-smoke.ts       # Supabase insert/read/delete roundtrip
  seed-admin.ts     # bcrypt(10) hashes ADMIN_PASSWORD, upserts admin row

auth.ts             # Auth.js v5 — Credentials + JWT; no DB adapter (JWT strategy)
proxy.ts            # /admin/:path* guard (Next 16 renamed middleware → proxy)
```

## Routing

| Path                     | Handler                                   |
|--------------------------|-------------------------------------------|
| `/`                      | `app/page.tsx`                            |
| `/gallery`               | `app/gallery/page.tsx`                    |
| `/admin/login`           | `app/(auth)/admin/login/page.tsx`         |
| `/admin`                 | `app/admin/page.tsx`                      |
| `/admin/testimonials`    | `app/admin/testimonials/page.tsx`         |
| `/admin/gallery`         | `app/admin/gallery/page.tsx`              |
| `/admin/brochures`       | `app/admin/brochures/page.tsx`            |
| `/api/testimonials`      | `app/api/testimonials/route.ts`           |
| `/api/auth/[...nextauth]`| `app/api/auth/[...nextauth]/route.ts`     |
| `/sitemap.xml`           | `app/sitemap.ts`                          |
| `/robots.txt`            | `app/robots.ts`                           |

## Key Integrations

- **Auth.js v5** (`next-auth@beta`) — Credentials + JWT; `role` on `session.user` via `types/auth.d.ts`. Proxy-gated admin routes; Server Actions re-check `assertAdmin()` for defense in depth. No DB adapter needed (JWT strategy queries the `users` table directly in the `authorize` callback).
- **Supabase** — Postgres + Storage over HTTPS via `@supabase/supabase-js` with the `service_role` key. All DB + file operations are server-side. Schema managed via `db/schema.sql` pasted into the Supabase SQL Editor. Buckets: `gallery` + `brochures`, both public-read.
- **EmailJS** (`@emailjs/browser`) — client-side contact form. Configured via `NEXT_PUBLIC_EMAILJS_*`.
- **HeroUI** (`@heroui/react`) — UI kit; provider in `app/providers.tsx`.
- **Tailwind CSS v4** + **@tailwindcss/postcss**.
- **Motion** (`motion/react`) — animations.
- **Embla Carousel** — testimonial carousel.
- **@vercel/analytics** — Web Analytics in `app/layout.tsx`.

## DB Tables (in Supabase)

| Table              | Purpose                                                          |
|--------------------|------------------------------------------------------------------|
| `testimonials`     | public-submit, admin-approve                                     |
| `users`            | admin login (Credentials provider, bcrypt hashes)                |
| `gallery_images`   | admin-managed gallery — storage_path points to `gallery` bucket  |
| `brochures`        | admin-managed equipment brochures — category + `brochures` bucket|
| `auth_*` (4 tables)| Auth.js standard (reserved for a future OAuth provider)          |

All tables have RLS enabled; only `service_role` (server-side) can read/write. Storage bucket reads are public.

## Environment Variables

See `.env.example`. Minimum to boot:

- `DATABASE_URL` — unused at runtime (holdover; safe to omit now). Supabase access goes via the SDK.
- `NEXT_PUBLIC_SUPABASE_URL` — project URL (`https://<ref>.supabase.co`).
- `SUPABASE_SERVICE_ROLE_KEY` — **server-only**, never `NEXT_PUBLIC_`-prefixed.
- `AUTH_SECRET` — `openssl rand -base64 32`.
- `AUTH_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
- `NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`, `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`.
- `NEXT_PUBLIC_SITE_URL` — drives sitemap/robots/OG metadataBase.

## Deployment

Target: **Vercel**. `main` is production; `nextjs-migration` carries the Supabase cutover + admin-managed media features (PR #1). Vercel needs all env vars above; seeding is a one-off `npm run db:seed-admin` run against the production Supabase before first traffic.
