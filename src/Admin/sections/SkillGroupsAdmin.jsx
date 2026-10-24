import { useEffect, useState } from "react";
import { api } from "../api";
import SectionHeader from "../SectionHeader";

const SkillGroupsAdmin = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    title: "",
    color: "blue",
    skills: "",
    sortOrder: 0,
    published: true,
  });

  const loadItems = async () => {
    const result = await api.list("skill-groups");
    setItems(result.data || []);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const submit = async (event) => {
    event.preventDefault();

    await api.create("skill-groups", {
      ...form,
      skills: form.skills.split(",").map((item) => item.trim()).filter(Boolean),
    });

    setForm({ title: "", color: "blue", skills: "", sortOrder: 0, published: true });
    await loadItems();
  };

  const remove = async (id) => {
    if (!confirm("Delete this skill group?")) return;
    await api.remove("skill-groups", id);
    await loadItems();
  };

  return (
    <section>
      <SectionHeader title="Skills" description="Add grouped skills as comma-separated values." />

      <form onSubmit={submit} className="mb-6 grid gap-3 rounded-lg border border-gray-200 bg-white p-5 md:grid-cols-2">
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Group title" className="rounded-md border px-3 py-2 text-sm" />
        <input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} placeholder="Color" className="rounded-md border px-3 py-2 text-sm" />
        <input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="React, Node.js, Tailwind CSS" className="rounded-md border px-3 py-2 text-sm md:col-span-2" />
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white md:col-span-2">Add Skill Group</button>
      </form>

      <div className="grid gap-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{(item.skills || []).join(", ")}</p>
              </div>
              <button onClick={() => remove(item.id)} className="text-sm font-semibold text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SkillGroupsAdmin;