import { useEffect, useState } from "react";
import { api } from "../api";
import SectionHeader from "../SectionHeader";

const ProjectsAdmin = () => {
  const [items, setItems] = useState([]);
  const [image, setImage] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
    demoUrl: "",
    codeUrl: "",
    featured: true,
    published: true,
  });

  const loadItems = async () => {
    const result = await api.list("projects");
    setItems(result.data || []);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const submit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("tags", JSON.stringify(form.tags.split(",").map((item) => item.trim()).filter(Boolean)));
    formData.append("demoUrl", form.demoUrl);
    formData.append("codeUrl", form.codeUrl);
    formData.append("featured", String(form.featured));
    formData.append("published", String(form.published));
    formData.append("image", image);

    await api.createForm("projects", formData);
    setForm({ title: "", description: "", category: "", tags: "", demoUrl: "", codeUrl: "", featured: true, published: true });
    setImage(null);
    event.target.reset();
    await loadItems();
  };

  const remove = async (id) => {
    if (!confirm("Delete this project?")) return;
    await api.remove("projects", id);
    await loadItems();
  };

  return (
    <section>
      <SectionHeader title="Projects" description="Add project cards for featured and all-projects pages." />

      <form onSubmit={submit} className="mb-6 grid gap-3 rounded-lg border border-gray-200 bg-white p-5 md:grid-cols-2">
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="rounded-md border px-3 py-2 text-sm" />
        <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" className="rounded-md border px-3 py-2 text-sm" />
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="rounded-md border px-3 py-2 text-sm md:col-span-2" />
        <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="React, Node.js, PostgreSQL" className="rounded-md border px-3 py-2 text-sm md:col-span-2" />
        <input value={form.demoUrl} onChange={(e) => setForm({ ...form, demoUrl: e.target.value })} placeholder="Demo URL" className="rounded-md border px-3 py-2 text-sm" />
        <input value={form.codeUrl} onChange={(e) => setForm({ ...form, codeUrl: e.target.value })} placeholder="Code URL" className="rounded-md border px-3 py-2 text-sm" />
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0])} className="text-sm md:col-span-2" />
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white md:col-span-2">Add Project</button>
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <img src={item.image_url} alt={item.title} className="h-44 w-full object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{item.description}</p>
              <button onClick={() => remove(item.id)} className="mt-3 text-sm font-semibold text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsAdmin;