-- Professional portfolio additions: richer profile, hero image captions, and a contact-form inbox.

alter table public.contact_profile
  add column if not exists full_name text,
  add column if not exists headline text,
  add column if not exists tagline text,
  add column if not exists bio text,
  add column if not exists availability text,
  add column if not exists cv_url text,
  add column if not exists avatar_url text;

alter table public.hero_images
  add column if not exists title text;

-- Contact form submissions: anyone can send, only admins can read.
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 200 and email like '%@%'),
  message text not null check (char_length(message) between 1 and 5000),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

drop policy if exists "anyone can send message" on public.messages;
create policy "anyone can send message" on public.messages
  for insert to anon, authenticated with check (is_read = false);

drop policy if exists "admin manage messages" on public.messages;
create policy "admin manage messages" on public.messages
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
