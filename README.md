# Joseph Kyalo · Portfolio

React + Vite + Tailwind site.
- **Content:** [Supabase](https://supabase.com) is the database and handles admin login. It replaces the old Express backend.
- **Images:** uploaded to **Cloudflare R2** through a small Worker in `workers/uploads`.

Pages:
- `/`: landing page
- `/projects`: all projects
- `/admin`: content manager (sign in with your Supabase admin email and password)

When a table is empty, the pages show their built-in fallback content, as before.

## Environment (`.env`, not committed)

```
VITE_SUPABASE_URL=https://<project-ref>.supabase.co     # Supabase → Project Settings → Data API
VITE_SUPABASE_ANON_KEY=<anon / publishable key>         # Supabase → Project Settings → API Keys
VITE_UPLOADS_URL=https://portfolio-uploads.<you>.workers.dev   # printed by `wrangler deploy`
```

Never put the `service_role` / secret key or any R2 access keys here.

## Database

Migrations live in `supabase/migrations/` and are applied with the Supabase CLI:

```bash
npm run db:login         # once (or: npx supabase login --token <token>)
npm run db:link          # once
npm run db:push          # apply pending migrations to the remote project
npm run db:status        # compare local vs remote migrations
npm run db:new my_change # create a new migration file
```

Admin access, one time:
1. Supabase → Authentication → Users → **Add user** (email + password, auto-confirm).
2. In the SQL editor, make that user an admin:
   ```sql
   insert into public.admins (user_id) select id from auth.users where email = 'you@example.com';
   ```
3. Authentication → Sign In / Providers → turn off **Allow new users to sign up**.

Who can do what (row-level security):
- Visitors can read published content.
- Only users in `public.admins` can create, edit or delete content.

## Uploads Worker (Cloudflare R2)

```bash
cd workers/uploads
npx wrangler login
npx wrangler r2 bucket create portfolio-assets   # then enable Public access on the bucket
# set SUPABASE_URL, PUBLIC_BASE_URL and ALLOWED_ORIGINS in wrangler.toml
npx wrangler secret put SUPABASE_ANON_KEY
npx wrangler deploy
```

The Worker:
- checks the uploader is a Supabase admin, then stores the file in R2
- pings Supabase daily, so the free tier isn't paused for inactivity

## Deploy

- **Build:** `npm run build`
- **Output folder:** `dist`
- **Environment variables:** set the three `VITE_*` values on your host.
- **Routing:** the host must serve `index.html` for all paths (single-page app).
