-- Match the tables to the original portfolio UI and admin (same fields the old Express backend served).
-- Replaces the empty tables from the previous migration. Keeps public.admins and public.is_admin().

drop table if exists public.profile cascade;
drop table if exists public.services cascade;
drop table if exists public.skill_groups cascade;
drop table if exists public.experience cascade;
drop table if exists public.education cascade;
drop table if exists public.certifications cascade;
drop table if exists public.projects cascade;
drop table if exists public.testimonials cascade;
drop table if exists public.posts cascade;
drop table if exists public.messages cascade;

-- Hero carousel images (admin keeps the latest 3)
create table public.hero_images (
  id uuid primary key default gen_random_uuid(),
  src text not null,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- "What I build" cards in the About section
create table public.build_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  icon text not null default 'code',
  color text not null default 'blue',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.skill_groups (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  color text not null default 'blue',
  skills text[] not null default '{}',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.education (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  institution text not null default '',
  year text not null default '',
  location text not null default '',
  description text not null default '',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null default '',
  year text not null default '',
  image_url text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.experience (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  company text not null default '',
  period text not null default '',
  location text not null default '',
  type text not null default '',
  description text not null default '',
  achievements text[] not null default '{}',
  technologies text[] not null default '{}',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  category text not null default '',
  tags text[] not null default '{}',
  image_url text,
  demo_url text,
  code_url text,
  featured boolean not null default true,  -- shown on the landing page
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Single-row contact details + footer text
create table public.contact_profile (
  id smallint primary key default 1 check (id = 1),
  email text not null default '',
  phone text not null default '',
  location text not null default '',
  github_url text,
  linkedin_url text,
  x_url text,
  github_username text,
  whatsapp_url text,
  footer_name text,
  footer_tagline text,
  updated_at timestamptz not null default now()
);

-- updated_at triggers + row level security
do $$
declare t text;
begin
  foreach t in array array['hero_images','build_items','skill_groups','education','certifications','experience','projects','contact_profile']
  loop
    execute format('create trigger trg_%1$s_touch before update on public.%1$s
                    for each row execute function public.touch_updated_at()', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "admin write" on public.%I
                    for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
  end loop;

  foreach t in array array['hero_images','build_items','skill_groups','education','certifications','experience','projects']
  loop
    execute format('create policy "public read published" on public.%I
                    for select to anon, authenticated using (published or public.is_admin())', t);
  end loop;
end $$;

create policy "public read contact profile" on public.contact_profile
  for select to anon, authenticated using (true);
