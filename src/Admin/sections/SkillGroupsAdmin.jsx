import { useEffect, useState } from "react";
import { api } from "../api";
import AdminList from "../AdminList";
import FormButtons from "../FormButtons";
import { nextSortOrder, splitList } from "../adminUtils";
import SectionHeader from "../SectionHeader";

const COLORS = ["blue", "green", "purple"];
const initialForm = { title: "", color: "blue", skills: "" };

const SkillGroupsAdmin = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadItems = async () => {
    const result = await api.list("skill-groups");
    setItems(result.data || []);
  };

  useEffect(() => {
    api.list("skill-groups").then((result) => setItems(result.data || []));
  }, []);

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({ title: item.title, color: item.color, skills: (item.skills || []).join(", ") });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancel = () => {
    setEditingId(null);
    setForm(initialForm);
  };

  const submit = async (event) => {
    event.preventDefault();
    const payload = { ...form, skills: splitList(form.skills) };
    setSaving(true);
    try {
      if (editingId) await api.update("skill-groups", editingId, payload);
      else await api.create("skill-groups", { ...payload, sortOrder: nextSortOrder(items) });
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
      <SectionHeader title="Skills" description="Grouped skills, comma separated." />

      <form onSubmit={submit} className="mb-6 grid gap-3 rounded-lg border border-gray-200 bg-white p-5 md:grid-cols-2">
        <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Group title" className="rounded-md border px-3 py-2 text-sm" />
        <select value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="rounded-md border px-3 py-2 text-sm">
          {COLORS.map((color) => (
            <option key={color} value={color}>Colour: {color}</option>
          ))}
        </select>
        <input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="React, Node.js, Tailwind CSS" className="rounded-md border px-3 py-2 text-sm md:col-span-2" />
        <FormButtons editing={Boolean(editingId)} addLabel="Add Skill Group" onCancel={cancel} saving={saving} />
      </form>

      <AdminList
        resource="skill-groups"
        items={items}
        reload={loadItems}
        onEdit={startEdit}
        editingId={editingId}
        deleteLabel="skill group"
        renderItem={(item) => (
          <div className="p-4">
            <h3 className="font-semibold text-gray-900">{item.title}</h3>
            <p className="mt-2 text-sm text-gray-600">{(item.skills || []).join(", ")}</p>
          </div>
        )}
      />
    </section>
  );
};

export default SkillGroupsAdmin;
