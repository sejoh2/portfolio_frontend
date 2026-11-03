-- Extra links per project (e.g. API docs, AI agent, mobile app), shown under the main buttons.
-- Format: [{ "label": "API docs", "url": "https://..." }]
alter table public.projects
  add column if not exists links jsonb not null default '[]'::jsonb;
