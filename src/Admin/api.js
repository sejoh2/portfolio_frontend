// Same interface the admin screens used with the old Express backend, now backed by Supabase.
// Images are uploaded to Cloudflare R2 through the uploads Worker (see src/lib/supabase.js).
import { deleteFile, supabase, uploadFile } from "../lib/supabase";

const TABLES = {
  "hero-images": "hero_images",
  "build-items": "build_items",
  "skill-groups": "skill_groups",
  education: "education",
  certifications: "certifications",
  experience: "experience",
  projects: "projects",
  messages: "messages",
  posts: "posts",
};

const HERO_LIMIT = 3;

function client() {
  if (!supabase) throw new Error("Supabase is not configured. Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env");
  return supabase;
}

function table(resource) {
  const name = TABLES[resource];
  if (!name) throw new Error(`Unknown resource: ${resource}`);
  return name;
}

// The forms send camelCase (sortOrder, demoUrl, githubUrl); the database uses snake_case.
const toSnake = (key) => key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);

function toRow(payload) {
  const row = {};
  for (const [key, value] of Object.entries(payload)) row[toSnake(key)] = value;
  delete row.id;
  return row;
}

async function run(query) {
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return { success: true, data };
}

// Turns FormData from the admin forms into a row, uploading any image to R2 first.
async function formToRow(formData, folder) {
  const row = {};
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      if (value.size) row.image_url = await uploadFile(value, folder);
      continue;
    }
    if (value === "null" || value === "undefined") continue;
    if (value === "true" || value === "false") row[toSnake(key)] = value === "true";
    else if (key === "tags" || key === "links") row[key] = JSON.parse(value || "[]");
    else row[toSnake(key)] = value;
  }
  return row;
}

// Supabase keeps the session itself; these keep the original token helpers working.
const SESSION_KEY_RE = /^sb-.*-auth-token$/;

export function getToken() {
  return Object.keys(localStorage).find((key) => SESSION_KEY_RE.test(key)) ? "supabase-session" : null;
}

export function setToken() {}

export function clearToken() {
  supabase?.auth.signOut();
  Object.keys(localStorage)
    .filter((key) => SESSION_KEY_RE.test(key))
    .forEach((key) => localStorage.removeItem(key));
}

export const api = {
  async login({ username, password }) {
    const { data, error } = await client().auth.signInWithPassword({ email: username.trim(), password });
    if (error) throw new Error(error.message);

    const { data: isAdmin } = await client().rpc("is_admin");
    if (!isAdmin) {
      await client().auth.signOut();
      throw new Error("This account is not an admin. Add it to public.admins in Supabase.");
    }
    return { token: data.session.access_token };
  },

  list(resource) {
    const query = client().from(table(resource)).select("*");
    // Messages and posts have no manual ordering: newest first.
    if (resource === "messages" || resource === "posts") return run(query.order("created_at", { ascending: false }));
    return run(query.order("sort_order", { ascending: true }).order("created_at", { ascending: false }));
  },

  create(resource, payload) {
    return run(client().from(table(resource)).insert(toRow(payload)).select().single());
  },

  async createForm(resource, formData) {
    if (resource === "hero-images") {
      const files = formData.getAll("images").filter((f) => f instanceof File && f.size).slice(0, HERO_LIMIT);
      const urls = [];
      for (const file of files) urls.push(await uploadFile(file, "hero"));
      await run(client().from("hero_images").insert(urls.map((src) => ({ src }))));

      // Keep only the latest 3, like the old backend did.
      const { data: all } = await client().from("hero_images").select("id, src").order("created_at", { ascending: false });
      const extra = (all || []).slice(HERO_LIMIT);
      if (extra.length) {
        await client().from("hero_images").delete().in("id", extra.map((r) => r.id));
        await Promise.all(extra.map((r) => deleteFile(r.src).catch(() => {})));
      }
      return { success: true };
    }

    const folder = resource.replace(/[^a-z]/g, "") || "uploads";
    return run(client().from(table(resource)).insert(await formToRow(formData, folder)).select().single());
  },

  update(resource, id, payload) {
    return run(client().from(table(resource)).update(toRow(payload)).eq("id", id).select().single());
  },

  async updateForm(resource, id, formData) {
    const folder = resource.replace(/[^a-z]/g, "") || "uploads";
    return run(client().from(table(resource)).update(await formToRow(formData, folder)).eq("id", id).select().single());
  },

  async remove(resource, id) {
    const name = table(resource);
    const { data } = await client().from(name).select("*").eq("id", id).maybeSingle();
    await run(client().from(name).delete().eq("id", id));
    const file = data?.image_url || data?.src;
    if (file) await deleteFile(file).catch(() => {});
    return { success: true };
  },

  getContactProfile() {
    return run(client().from("contact_profile").select("*").eq("id", 1).maybeSingle());
  },

  updateContactProfile(payload) {
    return run(client().from("contact_profile").upsert({ ...toRow(payload), id: 1 }).select().single());
  },
};
