import { useEffect, useState } from "react";
import { api } from "../api";
import AdminList from "../AdminList";
import FormButtons from "../FormButtons";
import { nextSortOrder, splitList } from "../adminUtils";
import SectionHeader from "../SectionHeader";

const initialForm = {
  title: "",
  description: "",
  category: "",
  tags: "",
  demoUrl: "",
  codeUrl: "",
  links: "",
  featured: true,
};

// Extra links are typed as "Label | URL", one per line.
const linksToText = (links) => (Array.isArray(links) ? links.map((link) => `${link.label} | ${link.url}`).join("\n") : "");
const textToLinks = (text) =>
  String(text || "")
    .split("\n")
    .map((line) => line.split("|").map((part) => part.trim()))
    .filter(([label, url]) => label && url)
    .map(([label, url]) => ({ label, url }));

const ProjectsAdmin = () => {
  const [items, setItems] = useState([]);
  const [image, setImage] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [fileKey, setFileKey] = useState(0); // resets the file input

  const loadItems = async () => {
    const result = await api.list("projects");
    setItems(result.data || []);
  };

  useEffect(() => {
    api.list("projects").then((result) => setItems(result.data || []));
  }, []);

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title || "",
      description: item.description || "",
      category: item.category || "",
      tags: (item.tags || []).join(", "),
      demoUrl: item.demo_url || "",
      codeUrl: item.code_url || "",
      links: linksToText(item.links),
      featured: Boolean(item.featured),
    });
    setImage(null);
    setFileKey((key) => key + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancel = () => {
    setEditingId(null);
    setForm(initialForm);
    setImage(null);
    setFileKey((key) => key + 1);
  };

  const submit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("tags", JSON.stringify(splitList(form.tags)));
    formData.append("demoUrl", form.demoUrl);
    formData.append("codeUrl", form.codeUrl);
    formData.append("links", JSON.stringify(textToLinks(form.links)));
    formData.append("featured", String(form.featured));
    if (image) formData.append("image", image); // editing without a new image keeps the old one

    setSaving(true);
    try {
      if (editingId) {
        await api.updateForm("projects", editingId, formData);
      } else {
        formData.append("sortOrder", String(nextSortOrder(items)));
        await api.createForm("projects", formData);
      }
      cancel();
      await loadItems();
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <SectionHeader title="Projects" description="Featured projects show on the home page; all visible projects show on the All Projects page." />

      <form onSubmit={submit} className="mb-6 grid gap-3 rounded-lg border border-gray-200 bg-white p-5 md:grid-cols-2">
        <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="rounded-md border px-3 py-2 text-sm" />
        <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category (e.g. Fintech, AI Agents, Mobile)" className="rounded-md border px-3 py-2 text-sm" />
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={3} className="rounded-md border px-3 py-2 text-sm md:col-span-2" />
        <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="React, Node.js, PostgreSQL" className="rounded-md border px-3 py-2 text-sm md:col-span-2" />
        <input value={form.demoUrl} onChange={(e) => setForm({ ...form, demoUrl: e.target.value })} placeholder="Live demo URL" className="rounded-md border px-3 py-2 text-sm" />
        <input value={form.codeUrl} onChange={(e) => setForm({ ...form, codeUrl: e.target.value })} placeholder="Code URL" className="rounded-md border px-3 py-2 text-sm" />
        <textarea
          value={form.links}
          onChange={(e) => setForm({ ...form, links: e.target.value })}
          placeholder={"Extra links, one per line: Label | URL\nAPI docs | https://..."}
          rows={3}
          className="rounded-md border px-3 py-2 text-sm md:col-span-2"
        />
        <label className="text-sm text-gray-600">
          {editingId ? "Replace image (optional): " : "Image (optional): "}
          <input key={fileKey} type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="text-sm" />
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
          Featured on the home page
        </label>
        <FormButtons editing={Boolean(editingId)} addLabel="Add Project" onCancel={cancel} saving={saving} />
      </form>

      <AdminList
        resource="projects"
        items={items}
        reload={loadItems}
        onEdit={startEdit}
        editingId={editingId}
        deleteLabel="project"
        grid="grid gap-4 md:grid-cols-2"
        toggles={[{ field: "featured", on: "★ Featured", off: "Not featured" }]}
        renderItem={(item) => (
          <>
            {item.image_url ? (
              <img src={item.image_url} alt={item.title} className="h-40 w-full object-cover object-top" />
            ) : (
              <div className="grid h-40 place-items-center bg-gray-50 text-xs text-gray-400">No image (an illustration is shown)</div>
            )}
            <div className="p-4">
              <p className="text-xs font-semibold text-gray-500">{item.category}</p>
              <h3 className="font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-gray-600">{item.description}</p>
            </div>
          </>
        )}
      />
    </section>
  );
};

export default ProjectsAdmin;
