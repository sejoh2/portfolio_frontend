import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const uploadsUrl = import.meta.env.VITE_UPLOADS_URL; // Cloudflare Worker in workers/uploads

// When env vars are missing (e.g. first run), the site falls back to bundled content.
export const supabase = url && anonKey ? createClient(url, anonKey) : null;
export const isSupabaseConfigured = Boolean(supabase);

async function authHeader() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("You are not signed in");
  return { Authorization: `Bearer ${token}` };
}

// Uploads go to Cloudflare R2 through the uploads Worker. Returns the public file URL.
export async function uploadFile(file, folder = "uploads") {
  if (!supabase || !uploadsUrl) throw new Error("Uploads are not configured");
  const body = new FormData();
  body.append("file", file);
  body.append("folder", folder);
  const res = await fetch(`${uploadsUrl}/upload`, { method: "POST", headers: await authHeader(), body });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || "Upload failed");
  return data.url;
}

export async function deleteFile(fileUrl) {
  if (!supabase || !uploadsUrl || !fileUrl) return;
  await fetch(`${uploadsUrl}/delete`, {
    method: "POST",
    headers: { ...(await authHeader()), "Content-Type": "application/json" },
    body: JSON.stringify({ url: fileUrl }),
  });
}
