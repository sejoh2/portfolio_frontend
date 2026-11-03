import { useEffect, useState } from "react";
import { api } from "../api";
import AdminList from "../AdminList";
import FormButtons from "../FormButtons";
import { nextSortOrder } from "../adminUtils";
import SectionHeader from "../SectionHeader";

const initialForm = { title: "", institution: "", year: "", location: "", description: "" };
const FIELDS = [
  ["title", "Qualification"],
  ["institution", "Institution"],
  ["year", "Year or period (e.g. 2023 – 2027)"],
  ["location", "Location"],
];

const EducationAdmin = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadItems = async () => {
    const result = await api.list("education");
    setItems(result.data || []);
  };

  useEffect(() => {
    api.list("education").then((result) => setItems(result.data || []));
  }, []);

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm(Object.fromEntries(Object.keys(initialForm).map((key) => [key, item[key] || ""])));
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
      if (editingId) await api.update("education", editingId, form);
      else await api.create("education", { ...form, sortOrder: nextSortOrder(items) });
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
      <SectionHeader title="Education" description="Degrees, courses and programmes." />

      <form onSubmit={submit} className="mb-6 grid gap-3 rounded-lg border border-gray-200 bg-white p-5 md:grid-cols-2">
        {FIELDS.map(([field, placeholder]) => (
          <input
            key={field}
            required={field === "title"}
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            placeholder={placeholder}
            className="rounded-md border px-3 py-2 text-sm"
          />
        ))}
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={2} className="rounded-md border px-3 py-2 text-sm md:col-span-2" />
        <FormButtons editing={Boolean(editingId)} addLabel="Add Education" onCancel={cancel} saving={saving} />
      </form>

      <AdminList
        resource="education"
        items={items}
        reload={loadItems}
        onEdit={startEdit}
        editingId={editingId}
        deleteLabel="education item"
        renderItem={(item) => (
          <div className="p-4">
            <h3 className="font-semibold text-gray-900">{item.title}</h3>
            <p className="text-sm font-semibold text-blue-600">{item.institution}</p>
            <p className="mt-1 text-sm text-gray-600">{[item.year, item.location].filter(Boolean).join(" · ")}</p>
          </div>
        )}
      />
    </section>
  );
};

export default EducationAdmin;
