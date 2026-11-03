import { useEffect, useState } from "react";
import { api } from "../api";
import { uploadFile } from "../../lib/supabase";
import { formatPostDate, readingTime, slugify } from "../../lib/blog";
import Markdown from "../../components/Markdown";
import SectionHeader from "../SectionHeader";

const emptyPost = {
  title: "",
  slug: "",
  excerpt: "",
  tags: "",
  cover_image_url: "",
  content: "",
  published: false,
  published_at: "",
};

const toForm = (post) => ({
  ...emptyPost,
  ...post,
  tags: (post.tags || []).join(", "),
  cover_image_url: post.cover_image_url || "",
  published_at: post.published_at ? post.published_at.slice(0, 10) : "",
});

const BlogAdmin = () => {
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null); // null = list view, {} = new post, {...} = existing
  const [form, setForm] = useState(emptyPost);
  const [slugTouched, setSlugTouched] = useState(false);
  const [preview, setPreview] = useState(false);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const loadPosts = () => api.list("posts").then((result) => setPosts(result.data || []));

  useEffect(() => {
    api.list("posts").then((result) => setPosts(result.data || []));
  }, []);

  const startEdit = (post) => {
    setEditing(post || {});
    setForm(post ? toForm(post) : emptyPost);
    setSlugTouched(Boolean(post));
    setPreview(false);
    setMessage("");
  };

  const update = (field, value) => {
    setForm((current) => {
      const next = { ...current, [field]: value };
      if (field === "title" && !slugTouched) next.slug = slugify(value);
      return next;
    });
  };

  const uploadCover = async (file) => {
    if (!file) return;
    setUploading(true);
    setMessage("");
    try {
      const url = await uploadFile(file, "blog");
      update("cover_image_url", url);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setUploading(false);
    }
  };

  const save = async (event, publishOverride) => {
    event?.preventDefault();
    const published = publishOverride ?? form.published;
    if (!form.title.trim() || !form.slug.trim()) {
      setMessage("Title and URL slug are required.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      slug: slugify(form.slug),
      excerpt: form.excerpt.trim(),
      content: form.content,
      cover_image_url: form.cover_image_url || null,
      tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      published,
      // Publishing for the first time stamps today's date unless one was set.
      published_at: form.published_at ? new Date(form.published_at).toISOString() : published ? new Date().toISOString() : null,
    };

    setSaving(true);
    setMessage("");
    try {
      const result = editing?.id ? await api.update("posts", editing.id, payload) : await api.create("posts", payload);
      setEditing(result.data);
      setForm(toForm(result.data));
      setMessage(published ? "Saved and published." : "Saved as draft.");
      await loadPosts();
    } catch (error) {
      setMessage(error.message.includes("duplicate") ? "That URL slug is already used by another post." : error.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (post) => {
    if (!confirm(`Delete "${post.title}"? This can't be undone.`)) return;
    await api.remove("posts", post.id);
    await loadPosts();
  };

  const togglePublished = async (post) => {
    await api.update("posts", post.id, {
      published: !post.published,
      published_at: post.published_at || new Date().toISOString(),
    });
    await loadPosts();
  };

  // ---------- Editor ----------
  if (editing) {
    return (
      <section>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <SectionHeader title={editing.id ? "Edit Post" : "New Post"} description="Write in Markdown. Drafts are only visible to you." />
          <button type="button" onClick={() => { setEditing(null); loadPosts(); }} className="text-sm font-semibold text-gray-600 hover:text-gray-900">
            ← Back to all posts
          </button>
        </div>

        <form onSubmit={save} className="grid gap-4 rounded-lg border border-gray-200 bg-white p-5 md:grid-cols-2">
          <label className="text-sm md:col-span-2">
            <span className="mb-1 block font-medium text-gray-700">Title</span>
            <input value={form.title} onChange={(e) => update("title", e.target.value)} className="w-full rounded-md border px-3 py-2 text-base" />
          </label>

          <label className="text-sm">
            <span className="mb-1 block font-medium text-gray-700">URL slug</span>
            <div className="flex items-center rounded-md border">
              <span className="pl-3 text-gray-400">/blog/</span>
              <input
                value={form.slug}
                onChange={(e) => { setSlugTouched(true); update("slug", e.target.value); }}
                className="w-full rounded-md px-1 py-2 text-sm outline-none"
              />
            </div>
          </label>

          <label className="text-sm">
            <span className="mb-1 block font-medium text-gray-700">Tags (comma separated)</span>
            <input value={form.tags} onChange={(e) => update("tags", e.target.value)} placeholder="M-Pesa, Node.js, Fintech" className="w-full rounded-md border px-3 py-2 text-sm" />
          </label>

          <label className="text-sm md:col-span-2">
            <span className="mb-1 block font-medium text-gray-700">Excerpt (shown on cards and in search results)</span>
            <textarea rows={2} value={form.excerpt} onChange={(e) => update("excerpt", e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" />
          </label>

          <div className="text-sm md:col-span-2">
            <span className="mb-1 block font-medium text-gray-700">Cover image</span>
            <div className="flex flex-wrap items-center gap-3">
              {form.cover_image_url && <img src={form.cover_image_url} alt="" className="h-16 w-28 rounded-md border object-cover" />}
              <input type="file" accept="image/*" onChange={(e) => uploadCover(e.target.files?.[0])} className="text-sm" />
              {uploading && <span className="text-gray-500">Uploading…</span>}
              <input
                value={form.cover_image_url}
                onChange={(e) => update("cover_image_url", e.target.value)}
                placeholder="…or paste an image URL"
                className="min-w-56 flex-1 rounded-md border px-3 py-2 text-xs"
              />
            </div>
          </div>

          <div className="text-sm md:col-span-2">
            <div className="mb-1 flex items-center justify-between">
              <span className="font-medium text-gray-700">
                Content (Markdown) · {readingTime(form.content)} min read
              </span>
              <div className="flex rounded-md border text-xs font-semibold">
                <button type="button" onClick={() => setPreview(false)} className={`px-3 py-1.5 ${!preview ? "bg-blue-50 text-blue-700" : "text-gray-600"}`}>
                  Write
                </button>
                <button type="button" onClick={() => setPreview(true)} className={`px-3 py-1.5 ${preview ? "bg-blue-50 text-blue-700" : "text-gray-600"}`}>
                  Preview
                </button>
              </div>
            </div>
            {preview ? (
              <div className="min-h-80 rounded-md border bg-gray-50 p-6">
                <Markdown>{form.content || "*Nothing to preview yet.*"}</Markdown>
              </div>
            ) : (
              <textarea
                rows={20}
                value={form.content}
                onChange={(e) => update("content", e.target.value)}
                placeholder={"## A heading\n\nA paragraph with **bold**, *italic*, `code` and [a link](https://example.com).\n\n- A list item\n\n> A quote\n\n```\ncode block\n```\n\n![Image description](https://...)"}
                className="w-full rounded-md border px-3 py-2 font-mono text-sm leading-relaxed"
              />
            )}
          </div>

          <label className="text-sm">
            <span className="mb-1 block font-medium text-gray-700">Publish date (optional)</span>
            <input type="date" value={form.published_at} onChange={(e) => update("published_at", e.target.value)} className="rounded-md border px-3 py-2 text-sm" />
          </label>

          <div className="flex flex-wrap items-end justify-end gap-3 md:col-span-1">
            <button type="button" disabled={saving} onClick={() => save(null, false)} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60">
              {editing.published ? "Unpublish & save" : "Save draft"}
            </button>
            <button type="button" disabled={saving} onClick={() => save(null, true)} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
              {saving ? "Saving…" : editing.published ? "Update post" : "Publish"}
            </button>
          </div>

          {message && <p className="text-sm text-gray-600 md:col-span-2">{message}</p>}
          {editing.published && editing.slug && (
            <a href={`/blog/${editing.slug}`} target="_blank" rel="noreferrer" className="text-sm font-semibold text-blue-600 md:col-span-2">
              View live post →
            </a>
          )}
        </form>
      </section>
    );
  }

  // ---------- List ----------
  return (
    <section>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <SectionHeader title="Blog" description="Write, edit and publish posts. Only published posts appear on your site." />
        <button type="button" onClick={() => startEdit(null)} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          + New Post
        </button>
      </div>

      {posts.length === 0 && (
        <p className="rounded-lg border border-gray-200 bg-white p-5 text-sm text-gray-500">
          No posts yet. The Blog link and home-page section appear on your site once you publish one.
        </p>
      )}

      <div className="grid gap-3">
        {posts.map((post) => (
          <div key={post.id} className="flex flex-wrap items-center gap-4 rounded-lg border border-gray-200 bg-white p-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${post.published ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                  {post.published ? "Published" : "Draft"}
                </span>
                <h3 className="truncate font-semibold text-gray-900">{post.title}</h3>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                /blog/{post.slug}
                {post.published_at && ` · ${formatPostDate(post.published_at)}`} · {readingTime(post.content)} min read
              </p>
            </div>
            <div className="flex gap-3 text-sm font-semibold">
              <button onClick={() => startEdit(post)} className="text-blue-600">Edit</button>
              <button onClick={() => togglePublished(post)} className="text-gray-600">{post.published ? "Unpublish" : "Publish"}</button>
              <button onClick={() => remove(post)} className="text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BlogAdmin;
