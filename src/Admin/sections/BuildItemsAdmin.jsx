import { useEffect, useState } from "react";
import { api } from "../api";
import AdminList from "../AdminList";
import FormButtons from "../FormButtons";
import { nextSortOrder } from "../adminUtils";
import SectionHeader from "../SectionHeader";

const ICONS = ["wallet", "globe", "smartphone", "bot", "code", "database", "server", "cloud", "shield", "workflow", "rocket", "lightbulb", "brain", "bar-chart"];
const COLORS = ["blue", "green", "purple", "orange"];
const initialForm = { title: "", description: "", icon: "code", color: "blue" };

const BuildItemsAdmin = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadItems = async () => {
    const result = await api.list("build-items");
    setItems(result.data || []);
  };

  useEffect(() => {
    api.list("build-items").then((result) => setItems(result.data || []));
  }, []);

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({ title: item.title, description: item.description, icon: item.icon, color: item.color });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancel = () => {
    setEditingId(null);
    setForm(initialForm);
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (editingId) await api.update("build-items", editingId, form);
      else await api.create("build-items", { ...form, sortOrder: nextSortOrder(items) });
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
      <SectionHeader title="What I Build" description="The capability cards in the About section." />

      <form onSubmit={submit} className="mb-6 grid gap-3 rounded-lg border border-gray-200 bg-white p-5 md:grid-cols-2">
        <input required value={form.title} onChange={(e) => updateField("title", e.target.value)} placeholder="Title" className="rounded-md border px-3 py-2 text-sm md:col-span-2" />
        <select value={form.icon} onChange={(e) => updateField("icon", e.target.value)} className="rounded-md border px-3 py-2 text-sm">
          {ICONS.map((icon) => (
            <option key={icon} value={icon}>Icon: {icon}</option>
          ))}
        </select>
        <select value={form.color} onChange={(e) => updateField("color", e.target.value)} className="rounded-md border px-3 py-2 text-sm">
          {COLORS.map((color) => (
            <option key={color} value={color}>Colour: {color}</option>
          ))}
        </select>
        <textarea value={form.description} onChange={(e) => updateField("description", e.target.value)} placeholder="Description" rows={3} className="rounded-md border px-3 py-2 text-sm md:col-span-2" />
        <FormButtons editing={Boolean(editingId)} addLabel="Add Item" onCancel={cancel} saving={saving} />
      </form>

      <AdminList
        resource="build-items"
        items={items}
        reload={loadItems}
        onEdit={startEdit}
        editingId={editingId}
        deleteLabel="card"
        renderItem={(item) => (
          <div className="p-4">
            <h3 className="font-semibold text-gray-900">{item.title}</h3>
            <p className="mt-1 text-sm text-gray-600">{item.description}</p>
            <p className="mt-2 text-xs text-gray-400">{item.icon} · {item.color}</p>
          </div>
        )}
      />
    </section>
  );
};

export default BuildItemsAdmin;
