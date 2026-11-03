// Portfolio uploads Worker
// - POST /upload  (multipart: file, folder) -> stores in R2, returns { url }
// - POST /delete  (json: { url })           -> removes object from R2
// Both require a Supabase session token belonging to a row in public.admins.
// - Cron trigger: pings Supabase daily so a free-tier project is not paused.

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "application/pdf": "pdf",
};
const FOLDER_RE = /^[a-z0-9-]{1,40}$/;

function corsHeaders(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowed = (env.ALLOWED_ORIGINS || "").split(",").map((o) => o.trim()).filter(Boolean);
  const allowOrigin = allowed.includes(origin) ? origin : allowed[0] || "";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(body, status, cors) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}

// Asks Supabase whether the bearer token belongs to an admin. Invalid tokens are rejected by Supabase.
async function isAdmin(request, env) {
  const auth = request.headers.get("Authorization") || "";
  if (!auth.startsWith("Bearer ")) return false;
  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/is_admin`, {
    method: "POST",
    headers: {
      apikey: env.SUPABASE_ANON_KEY,
      Authorization: auth,
      "Content-Type": "application/json",
    },
    body: "{}",
  });
  if (!res.ok) return false;
  return (await res.json()) === true;
}

function publicBase(env) {
  return env.PUBLIC_BASE_URL.replace(/\/+$/, "");
}

async function handleUpload(request, env, cors) {
  const form = await request.formData();
  const file = form.get("file");
  const folder = String(form.get("folder") || "uploads");

  if (!(file instanceof File)) return json({ error: "No file provided" }, 400, cors);
  if (!FOLDER_RE.test(folder)) return json({ error: "Invalid folder" }, 400, cors);
  if (file.size > MAX_BYTES) return json({ error: "File is larger than 10 MB" }, 413, cors);
  const ext = ALLOWED_TYPES[file.type];
  if (!ext) return json({ error: `File type ${file.type || "unknown"} is not allowed` }, 415, cors);

  const key = `${folder}/${crypto.randomUUID()}.${ext}`;
  await env.BUCKET.put(key, file.stream(), {
    httpMetadata: {
      contentType: file.type,
      cacheControl: "public, max-age=31536000, immutable",
    },
  });
  return json({ url: `${publicBase(env)}/${key}`, key }, 201, cors);
}

async function handleDelete(request, env, cors) {
  const { url } = await request.json().catch(() => ({}));
  const prefix = `${publicBase(env)}/`;
  if (typeof url !== "string" || !url.startsWith(prefix)) {
    return json({ error: "URL is not in this bucket" }, 400, cors);
  }
  const key = url.slice(prefix.length);
  if (!key || key.includes("..")) return json({ error: "Invalid key" }, 400, cors);
  await env.BUCKET.delete(key);
  return json({ ok: true }, 200, cors);
}

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request, env);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

    const { pathname } = new URL(request.url);
    if (request.method !== "POST" || !["/upload", "/delete"].includes(pathname)) {
      return json({ error: "Not found" }, 404, cors);
    }
    if (!(await isAdmin(request, env))) return json({ error: "Not authorized" }, 401, cors);

    try {
      return pathname === "/upload"
        ? await handleUpload(request, env, cors)
        : await handleDelete(request, env, cors);
    } catch (err) {
      return json({ error: err.message || "Unexpected error" }, 500, cors);
    }
  },

  // Keep-alive: a lightweight read so Supabase sees regular activity.
  async scheduled(_event, env) {
    // apikey header only: works with both legacy anon JWTs and new sb_publishable_ keys.
    await fetch(`${env.SUPABASE_URL}/rest/v1/contact_profile?select=id&limit=1`, {
      headers: { apikey: env.SUPABASE_ANON_KEY },
    });
  },
};
