import { useEffect, useState } from "react";
import { api } from "../api";
import AdminList from "../AdminList";
import FormButtons from "../FormButtons";
import { nextSortOrder, splitList } from "../adminUtils";
import SectionHeader from "../SectionHeader";

const initialForm = { role: "", company: "", period: "", location: "", type: "", description: "", achievements: "", technologies: "" };
const FIELDS = [
  ["role", "Role"],
  ["company", "Company"],
  ["period", "Period (e.g. Aug 2026 – Present)"],
  ["location", "Location"],
  ["type", "Type (Full-time, Contract…)"],
];

const ExperienceAdmin = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadItems = async () => {
    const result = await api.list("experience");
    setItems(result.data || []);
  };

  useEffect(() => {
    api.list("experience").then((result) => setItems(result.data || []));
  }, []);

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      role: item.role || "",
      company: item.company || "",
      period: item.period || "",
      location: item.location || "",
      type: item.type || "",
      description: item.description || "",
      achievements: (item.achievements || []).join("\n"),
      technologies: (item.technologies || []).join(", "),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancel = () => {
    setEditingId(null);
    setForm(initialForm);
  };

  const submit = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      achievements: splitList(form.achievements, "\n"),
      technologies: splitList(form.technologies),
    };
    setSaving(true);
    try {
      if (editingId) await api.update("experience", editingId, payload);
      else await api.create("experience", { ...payload, sortOrder: nextSortOrder(items) });
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
      <SectionHeader title="Experience" description="Achievements use one line per item. Technologies use commas." />

      <form onSubmit={submit} className="mb-6 grid gap-3 rounded-lg border border-gray-200 bg-white p-5 md:grid-cols-2">
        {FIELDS.map(([field, placeholder]) => (
          <input
            key={field}
            required={field === "role" || field === "company"}
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            placeholder={placeholder}
            className="rounded-md border px-3 py-2 text-sm"
          />
        ))}
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={2} className="rounded-md border px-3 py-2 text-sm md:col-span-2" />
        <textarea value={form.achievements} onChange={(e) => setForm({ ...form, achievements: e.target.value })} placeholder="Achievements, one per line" rows={5} className="rounded-md border px-3 py-2 text-sm md:col-span-2" />
        <input value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} placeholder="Python, SQL, React" className="rounded-md border px-3 py-2 text-sm md:col-span-2" />
        <FormButtons editing={Boolean(editingId)} addLabel="Add Experience" onCancel={cancel} saving={saving} />
      </form>

      <AdminList
        resource="experience"
        items={items}
        reload={loadItems}
        onEdit={startEdit}
        editingId={editingId}
        deleteLabel="experience"
        renderItem={(item) => (
          <div className="p-4">
            <h3 className="font-semibold text-gray-900">{item.role}</h3>
            <p className="text-sm font-semibold text-blue-600">{item.company}</p>
            <p className="mt-1 text-xs text-gray-500">{[item.period, item.location, item.type].filter(Boolean).join(" · ")}</p>
          </div>
        )}
      />
    </section>
  );
};

export default ExperienceAdmin;
