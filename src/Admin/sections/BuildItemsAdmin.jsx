import { useEffect, useState } from "react";
import { api } from "../api";
import SectionHeader from "../SectionHeader";

const initialForm = {
  title: "",
  description: "",
  icon: "code",
  color: "blue",
  sortOrder: 0,
  published: true,
};

const BuildItemsAdmin = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);

  const loadItems = async () => {
    const result = await api.list("build-items");
    setItems(result.data || []);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    await api.create("build-items", form);
    setForm(initialForm);
    await loadItems();
  };

  const remove = async (id) => {
    if (!confirm("Delete this item?")) return;
    await api.remove("build-items", id);
    await loadItems();
  };

  return (
    <section>
      <SectionHeader title="What I Build" description="Manage the About Me capability cards." />

      <form onSubmit={submit} className="mb-6 grid gap-3 rounded-lg border border-gray-200 bg-white p-5 md:grid-cols-2">
        <input value={form.title} onChange={(e) => updateField("title", e.target.value)} placeholder="Title" className="rounded-md border px-3 py-2 text-sm" />
        <input value={form.icon} onChange={(e) => updateField("icon", e.target.value)} placeholder="Icon name" className="rounded-md border px-3 py-2 text-sm" />
        <input value={form.color} onChange={(e) => updateField("color", e.target.value)} placeholder="Color" className="rounded-md border px-3 py-2 text-sm" />
        <input type="number" value={form.sortOrder} onChange={(e) => updateField("sortOrder", Number(e.target.value))} placeholder="Sort order" className="rounded-md border px-3 py-2 text-sm" />
        <textarea value={form.description} onChange={(e) => updateField("description", e.target.value)} placeholder="Description" className="rounded-md border px-3 py-2 text-sm md:col-span-2" />
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white md:col-span-2">Add Item</button>
      </form>

      <div className="grid gap-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{item.description}</p>
              </div>
              <button onClick={() => remove(item.id)} className="text-sm font-semibold text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BuildItemsAdmin;