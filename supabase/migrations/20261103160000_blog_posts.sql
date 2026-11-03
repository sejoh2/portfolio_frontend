-- Blog posts. Content is Markdown. Visitors only see published posts; admins manage everything.

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  cover_image_url text,
  tags text[] not null default '{}',
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_published_at_idx on public.posts (published, published_at desc);

drop trigger if exists trg_posts_touch on public.posts;
create trigger trg_posts_touch before update on public.posts
  for each row execute function public.touch_updated_at();

alter table public.posts enable row level security;

drop policy if exists "public read published posts" on public.posts;
create policy "public read published posts" on public.posts
  for select to anon, authenticated using (published or public.is_admin());

drop policy if exists "admin write posts" on public.posts;
create policy "admin write posts" on public.posts
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
