-- NH Services — Supabase schema
-- Paste this into the Supabase SQL Editor (Dashboard → SQL Editor → New query → Run).
-- Re-runnable: every statement is IF NOT EXISTS / CREATE OR REPLACE safe.

-- Testimonials (public-submit, admin-approve)
create table if not exists public.testimonials (
  id            text primary key default gen_random_uuid()::text,
  first_name    text not null,
  last_name     text not null,
  message       text not null,
  rating        integer not null check (rating between 1 and 5),
  approved      boolean not null default false,
  created_at    timestamptz not null default now()
);

-- Admin users (Credentials provider in Auth.js)
create table if not exists public.users (
  id            text primary key default gen_random_uuid()::text,
  email         text not null unique,
  password_hash text not null,
  role          text not null default 'admin',
  created_at    timestamptz not null default now()
);

-- Auth.js standard tables (for SupabaseAdapter)
create table if not exists public.auth_user (
  id             text primary key,
  name           text,
  email          text not null,
  email_verified timestamptz,
  image          text
);

create table if not exists public.auth_account (
  user_id              text not null references public.auth_user(id) on delete cascade,
  type                 text not null,
  provider             text not null,
  provider_account_id  text not null,
  refresh_token        text,
  access_token         text,
  expires_at           integer,
  token_type           text,
  scope                text,
  id_token             text,
  session_state        text,
  primary key (provider, provider_account_id)
);

create table if not exists public.auth_session (
  session_token text primary key,
  user_id       text not null references public.auth_user(id) on delete cascade,
  expires       timestamptz not null
);

create table if not exists public.auth_verification_token (
  identifier text not null,
  token      text not null,
  expires    timestamptz not null,
  primary key (identifier, token)
);

-- Storage buckets for admin-managed media
insert into storage.buckets (id, name, public) values ('gallery', 'gallery', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public) values ('brochures', 'brochures', true)
on conflict (id) do nothing;

-- Public read policies for both buckets. Writes happen server-side with service_role (bypasses RLS).
do $$ begin
  create policy "gallery public read" on storage.objects for select using (bucket_id = 'gallery');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "brochures public read" on storage.objects for select using (bucket_id = 'brochures');
exception when duplicate_object then null; end $$;

-- RLS on application tables. All writes go through the server with the
-- service_role key, which bypasses RLS. The anon/publishable key gets zero
-- access by default (no policies defined for anon role).
alter table public.testimonials            enable row level security;
alter table public.users                   enable row level security;
alter table public.auth_user               enable row level security;
alter table public.auth_account            enable row level security;
alter table public.auth_session            enable row level security;
alter table public.auth_verification_token enable row level security;

-- Gallery images — admin-managed, public read
create table if not exists public.gallery_images (
  id            text primary key default gen_random_uuid()::text,
  storage_path  text not null,
  filename      text not null,
  alt           text,
  sort_order    integer not null default 0,
  width         integer,
  height        integer,
  created_at    timestamptz not null default now()
);

-- Brochures — admin-managed, public read
create table if not exists public.brochures (
  id            text primary key default gen_random_uuid()::text,
  storage_path  text not null,
  filename      text not null,
  title         text not null,
  category      text not null,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now()
);

alter table public.gallery_images enable row level security;
alter table public.brochures      enable row level security;
