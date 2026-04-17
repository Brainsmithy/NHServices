# NHServices

HVAC business website for NH Services. Next.js 16 + Vercel.

## Dev Commands

```bash
npm run dev      # Next.js dev server (Turbopack) on port 4700 (predev kills any stale 4700 listener)
npm run build    # Next.js production build
npm run start    # Run the built app on port 4700
npm run lint     # eslint
npm run format   # prettier write
```

## Architecture

### App (Next.js App Router)

```
app/
  layout.tsx               # Root layout + metadata + <Analytics />
  page.tsx                 # Home — composes landing sections
  providers.tsx            # HeroUI provider
  globals.css              # Tailwind v4 + brand palette + :focus-visible
  error.tsx                # Error boundary (client)
  not-found.tsx            # 404
  sitemap.ts               # /sitemap.xml — NEXT_PUBLIC_SITE_URL driven
  robots.ts                # /robots.txt — disallows /admin/
  gallery/                 # /gallery
  (auth)/admin/login/      # /admin/login
  admin/                   # /admin, /admin/testimonials — proxy-gated
  api/
    auth/[...nextauth]/route.ts
    testimonials/route.ts  # GET (list approved) + POST (insert) — Drizzle-backed

components/
  navbar/, footer/, sections/, accordions/, testimonials/, admin/, ...
  admin/testimonial-row-actions.tsx  # Server Action wrappers

db/
  schema.ts        # testimonials + users (SQLite via drizzle-orm/sqlite-core)
  auth-schema.ts   # Auth.js tables
  index.ts         # drizzle client; reads DATABASE_URL, defaults to file:./local.db
  migrate.ts       # runs drizzle migrations against local.db
  migrations/      # generated SQL

scripts/
  db-smoke.ts      # testimonials insert+read+delete smoke test
  seed-admin.ts    # hashes ADMIN_PASSWORD from env, upserts admin row

auth.ts            # Auth.js v5 — Credentials + JWT + role augmentation
proxy.ts           # /admin/:path* guard (Next 16 renamed middleware → proxy)
```

## Routing

| Path                     | Handler                                   |
|--------------------------|-------------------------------------------|
| `/`                      | `app/page.tsx`                            |
| `/gallery`               | `app/gallery/page.tsx`                    |
| `/admin/login`           | `app/(auth)/admin/login/page.tsx`         |
| `/admin`                 | `app/admin/page.tsx`                      |
| `/admin/testimonials`    | `app/admin/testimonials/page.tsx`         |
| `/api/testimonials`      | `app/api/testimonials/route.ts`           |
| `/api/auth/[...nextauth]`| `app/api/auth/[...nextauth]/route.ts`     |
| `/sitemap.xml`           | `app/sitemap.ts`                          |
| `/robots.txt`            | `app/robots.ts`                           |

## Key Integrations

- **Auth.js v5** (`next-auth@beta`) — Credentials + JWT; `role` on `session.user` via `types/auth.d.ts`. Proxy-gated admin routes; Server Actions re-check `assertAdmin()` for defense in depth.
- **Drizzle ORM** + **@libsql/client** — local SQLite (`local.db`) in dev. Supabase Postgres planned for Vercel cutover (local SQLite won't persist on serverless).
- **EmailJS** (`@emailjs/browser`) — client-side contact form. Configured via `NEXT_PUBLIC_EMAILJS_*`.
- **HeroUI** (`@heroui/react`) — UI kit; provider in `app/providers.tsx`.
- **Tailwind CSS v4** + **@tailwindcss/postcss**.
- **Motion** (`motion/react`) — animations.
- **Embla Carousel** — testimonial carousel.
- **@vercel/analytics** — Web Analytics in `app/layout.tsx`.

## Environment Variables

See `.env.example` for the full list. Active:

- `DATABASE_URL` — defaults to `file:./local.db`.
- `AUTH_SECRET`, `AUTH_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
- `NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`, `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`.
- `NEXT_PUBLIC_SITE_URL` — drives sitemap/robots/OG metadataBase.

## Deployment

Target: **Vercel**. `main` branch is production; `nextjs-migration` holds the post-cutover diff pending PR. Swap `DATABASE_URL` to Supabase Postgres before production traffic (see `docs/DEPLOYMENT.md`).
