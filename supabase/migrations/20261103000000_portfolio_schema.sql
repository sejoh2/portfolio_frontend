-- Portfolio schema: public read of published content, admin-only writes,
-- anonymous inserts into contact messages. Run in Supabase SQL editor or via `supabase db push`.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Admins: users listed here can edit content. Add yourself after signing up:
--   insert into public.admins (user_id) select id from auth.users where email = 'you@example.com';
-- ---------------------------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Profile (single row)
-- ---------------------------------------------------------------------------
create table if not exists public.profile (
  id smallint primary key default 1 check (id = 1),
  full_name text not null default '',
  headline text not null default '',
  tagline text not null default '',
  bio text not null default '',
  location text not null default '',
  email text not null default '',
  phone text not null default '',
  availability text not null default '',
  is_available boolean not null default true,
  avatar_url text,
  cv_url text,
  github_url text,
  github_username text,
  linkedin_url text,
  x_url text,
  whatsapp_url text,
  stats jsonb not null default '[]'::jsonb, -- [{ "label": "Years building", "value": "3+" }]
  now_text text not null default '',      -- "What I'm doing now" section
  now_updated date,
  banner_text text not null default '',   -- optional top strip, e.g. "Open to AI engineering roles"
  banner_url text,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Ordered content tables
-- ---------------------------------------------------------------------------
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  icon text not null default 'code',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skill_groups (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  skills text[] not null default '{}',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.experience (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  company text not null,
  company_url text,
  location text not null default '',
  employment_type text not null default '',
  start_date date,
  end_date date, -- null = present
  summary text not null default '',
  achievements text[] not null default '{}',
  technologies text[] not null default '{}',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  institution text not null,
  location text not null default '',
  period text not null default '',
  description text not null default '',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null default '',
  issued text not null default '',
  credential_url text,
  image_url text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null default '',      -- one-liner for cards
  category text not null default '',
  role text not null default '',         -- what you did
  year text not null default '',
  tags text[] not null default '{}',
  metrics jsonb not null default '[]'::jsonb, -- [{ "label": "Units managed", "value": "500+" }]
  problem text not null default '',      -- case study sections (markdown-ish plain text)
  approach text not null default '',
  outcome text not null default '',
  cover_image_url text,
  gallery text[] not null default '{}',
  demo_url text,
  code_url text,
  is_confidential boolean not null default false, -- client/employer work: hide code links
  featured boolean not null default false,
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  author_name text not null,
  author_role text not null default '',
  author_company text not null default '',
  avatar_url text,
  sort_order int not null default 0,
  published boolean not null default false, -- approve before showing
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Writing / notes (body is Markdown)
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  body text not null default '',
  tags text[] not null default '{}',
  cover_image_url text,
  published_at date,
  sort_order int not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Contact form submissions
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 200 and email like '%@%'),
  subject text check (subject is null or char_length(subject) <= 200),
  body text not null check (char_length(body) between 1 and 5000),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- updated_at triggers
do $$
declare t text;
begin
  foreach t in array array['profile','services','skill_groups','experience','education','certifications','projects','testimonials','posts']
  loop
    execute format('drop trigger if exists trg_%1$s_touch on public.%1$s', t);
    execute format('create trigger trg_%1$s_touch before update on public.%1$s
                    for each row execute function public.touch_updated_at()', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------
alter table public.admins         enable row level security;
alter table public.profile        enable row level security;
alter table public.services       enable row level security;
alter table public.skill_groups   enable row level security;
alter table public.experience     enable row level security;
alter table public.education      enable row level security;
alter table public.certifications enable row level security;
alter table public.projects       enable row level security;
alter table public.testimonials   enable row level security;
alter table public.posts          enable row level security;
alter table public.messages       enable row level security;

drop policy if exists "admins read self" on public.admins;
create policy "admins read self" on public.admins
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "public read profile" on public.profile;
create policy "public read profile" on public.profile
  for select to anon, authenticated using (true);
drop policy if exists "admin write profile" on public.profile;
create policy "admin write profile" on public.profile
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

do $$
declare t text;
begin
  foreach t in array array['services','skill_groups','experience','education','certifications','projects','testimonials','posts']
  loop
    execute format('drop policy if exists "public read published" on public.%I', t);
    execute format('create policy "public read published" on public.%I
                    for select to anon, authenticated using (published or public.is_admin())', t);
    execute format('drop policy if exists "admin write" on public.%I', t);
    execute format('create policy "admin write" on public.%I
                    for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

drop policy if exists "anyone can send message" on public.messages;
create policy "anyone can send message" on public.messages
  for insert to anon, authenticated with check (is_read = false);
drop policy if exists "admin manage messages" on public.messages;
create policy "admin manage messages" on public.messages
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- File uploads (images, CV PDF) live in Cloudflare R2, not Supabase Storage.
-- See workers/uploads — it verifies the caller with public.is_admin() below.
-- ---------------------------------------------------------------------------
grant execute on function public.is_admin() to anon, authenticated;
