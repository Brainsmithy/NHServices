# NHServices

HVAC business website for NH Services. Mid-migration from React + Vite + Netlify to Next.js 16 + Vercel (branch: `nextjs-migration`). Target cutover: Sprint 1.13.

## Dev Commands

```bash
npm run dev      # Next.js dev server (Turbopack) on port 4700
npm run build    # Next.js production build
npm run start    # Run the built app on port 4700
npm run lint     # eslint
npm run format   # prettier write
```

Legacy Vite scripts (`dev:vite`, `build:vite`) still exist but are vestigial — retired at cutover. The `src/` tree is legacy Vite code, not imported by the Next.js app.

## Architecture

### App (Next.js App Router)

```
app/
  layout.tsx               # Root layout + providers
  page.tsx                 # Home — composes landing sections
  providers.tsx            # HeroUI provider
  globals.css
  gallery/                 # /gallery route
  api/
    testimonials/route.ts  # GET (list approved) + POST (insert) — Drizzle-backed

components/
  navbar/, footer/, modals/, accordions/, testimonials/, ...
  testimonials/testimonial-form.tsx   # client form + carousel, calls /api/testimonials

db/
  schema.ts       # testimonials + users (SQLite via drizzle-orm/sqlite-core)
  index.ts        # drizzle client; reads DATABASE_URL, defaults to file:./local.db
  migrate.ts      # runs drizzle migrations against local.db
  migrations/     # generated SQL
drizzle.config.ts

scripts/
  db-smoke.ts                   # testimonials insert+read+delete smoke test
  seed-admin-placeholder.ts     # no-op stub until Sprint 1.11 (Auth.js)
```

`netlify/functions/` is empty (addTestimonial + getTestimonials deleted in 1.9.0). The directory itself stays until 1.13 cutover.

## Routing

| Path                | Handler                          |
|---------------------|----------------------------------|
| `/`                 | `app/page.tsx`                   |
| `/gallery`          | `app/gallery/page.tsx`           |
| `/api/testimonials` | `app/api/testimonials/route.ts`  |

## Key Integrations

- **Drizzle ORM** + **@libsql/client**: backing store. Local SQLite (`local.db`) in dev; planned migration to Supabase Postgres at Vercel cutover.
- **EmailJS** (`@emailjs/browser`): client-side contact form email. Configured via `NEXT_PUBLIC_EMAILJS_*`.
- **HeroUI** (`@heroui/react`): UI component library; provider in `app/providers.tsx`.
- **Tailwind CSS v4** + **@tailwindcss/postcss**.
- **Motion** (`motion/react`): animations.
- **Embla Carousel** (`embla-carousel-react` + autoplay): testimonial carousel.

## Environment Variables

Active (Next.js):
- `DATABASE_URL` — defaults to `file:./local.db`.
- `NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`, `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`.

Legacy (still in `.env.local` / `.env` but unused by Next.js; retired at cutover):
- `VITE_APP_API_KEY`, `VITE_APP_EMAILJS_*`.

Planned (Sprint 1.11):
- `AUTH_SECRET`, `AUTH_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.

## Deployment

Current production: **Netlify** (legacy Vite build on `main`). The new Next.js build on `nextjs-migration` deploys to **Vercel** at Sprint 1.13 cutover, at which point `DATABASE_URL` flips from local SQLite to Supabase Postgres (see `docs/DEPLOYMENT.md`).
