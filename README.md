# NH Services

Marketing + lead-capture site for NH Services, a family-run HVAC business in the Denver metro.

## Tech stack

- **Next.js 16** (App Router, Turbopack) + React 19
- **Auth.js v5** — Credentials provider, JWT sessions, admin gate via `proxy.ts`
- **Drizzle ORM** + `@libsql/client` — local SQLite in dev (`file:./local.db`); Supabase Postgres planned for production (see `docs/BACKLOG.md`)
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

npm run db:migrate     # apply drizzle migrations to local.db
npm run db:generate    # generate a new migration after editing db/schema.ts
npm run db:studio      # drizzle studio
npm run db:smoke       # roundtrip smoke test against testimonials
npm run db:seed-admin  # hash ADMIN_PASSWORD from env and upsert the admin row
```

## Env vars

See `.env.example` for the full list. Minimum to boot:

- `DATABASE_URL=file:./local.db` (default)
- `AUTH_SECRET` — `openssl rand -base64 32`
- `AUTH_URL=http://localhost:4700`
- `ADMIN_EMAIL`, `ADMIN_PASSWORD` (for the seeder)
- `NEXT_PUBLIC_EMAILJS_*` (contact form)
- `NEXT_PUBLIC_SITE_URL` (drives sitemap/robots/OG)

## Seed the admin user

```bash
cp .env.example .env.local   # fill in AUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm run db:migrate
npm run db:seed-admin
```

Then log in at `http://localhost:4700/admin/login`.

## Docs

Internal docs live in `/docs` (gitignored):

- `ARCHITECTURE.md` — code layout + routing map
- `DEPLOYMENT.md` — Vercel runbook
- `CLIENT_RUNBOOK.md` — non-developer admin guide
- `BACKLOG.md` — post-launch follow-ups
- `LAUNCH_REPORT.md` — what shipped + known limitations
- `MIGRATION_MAP.md`, `SPRINT_PLAN.md`, `TECH_STACK.md`, `STYLE_GUIDE.md`

Sprint specs live in `/sprints` (tracked).
