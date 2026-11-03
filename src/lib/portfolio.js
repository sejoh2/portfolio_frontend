// Public reads for the landing page and projects page. Returns the same shape the old
// backend returned ({ success, data }), so the page components stay unchanged.
import { supabase } from "./supabase";

const published = (name) =>
  supabase
    .from(name)
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

export async function fetchPublicPortfolio() {
  if (!supabase) return { success: false };

  const [heroImages, buildItems, skillGroups, education, certifications, experience, projects, contactProfile] =
    await Promise.all([
      published("hero_images").limit(3),
      published("build_items"),
      published("skill_groups"),
      published("education"),
      published("certifications"),
      published("experience"),
      published("projects").eq("featured", true),
      supabase.from("contact_profile").select("*").eq("id", 1).maybeSingle(),
    ]);

  return {
    success: true,
    data: {
      heroImages: heroImages.data || [],
      buildItems: buildItems.data || [],
      skillGroups: skillGroups.data || [],
      education: education.data || [],
      certifications: certifications.data || [],
      experience: experience.data || [],
      projects: projects.data || [],
      contactProfile: contactProfile.data || null,
    },
  };
}

export async function fetchPublicProjects() {
  if (!supabase) return { success: false };
  const { data, error } = await published("projects");
  return { success: !error, data: data || [] };
}

export async function sendContactMessage({ name, email, message }) {
  if (!supabase) throw new Error("Supabase is not configured");
  const { error } = await supabase
    .from("messages")
    .insert({ name: name.trim(), email: email.trim(), message: message.trim() });
  if (error) throw new Error(error.message);
}

// ---------- Blog ----------
const POST_FIELDS = "id, slug, title, excerpt, cover_image_url, tags, published_at, content";

export async function fetchPosts({ limit } = {}) {
  if (!supabase) return [];
  let query = supabase
    .from("posts")
    .select(POST_FIELDS)
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data || [];
}

export async function fetchPost(slug) {
  if (!supabase) return null;
  const { data, error } = await supabase.from("posts").select(POST_FIELDS).eq("slug", slug).eq("published", true).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}
