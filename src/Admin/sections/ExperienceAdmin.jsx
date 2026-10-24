import { useEffect, useState } from "react";
import { api } from "../api";
import SectionHeader from "../SectionHeader";

const ExperienceAdmin = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    role: "",
    company: "",
    period: "",
    location: "",
    type: "",
    description: "",
    achievements: "",
    technologies: "",
  });

  const loadItems = async () => {
    const result = await api.list("experience");
    setItems(result.data || []);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const submit = async (event) => {
    event.preventDefault();

    await api.create("experience", {
      ...form,
      achievements: form.achievements.split("\n").map((item) => item.trim()).filter(Boolean),
      technologies: form.technologies.split(",").map((item) => item.trim()).filter(Boolean),
    });

    setForm({ role: "", company: "", period: "", location: "", type: "", description: "", achievements: "", technologies: "" });
    await loadItems();
  };

  const remove = async (id) => {
    if (!confirm("Delete this experience?")) return;
    await api.remove("experience", id);
    await loadItems();
  };

  return (
    <section>
      <SectionHeader title="Experience" description="Achievements use one line per item. Technologies use commas." />

      <form onSubmit={submit} className="mb-6 grid gap-3 rounded-lg border border-gray-200 bg-white p-5 md:grid-cols-2">
        {["role", "company", "period", "location", "type"].map((field) => (
          <input key={field} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} placeholder={field} className="rounded-md border px-3 py-2 text-sm" />
        ))}
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="rounded-md border px-3 py-2 text-sm md:col-span-2" />
        <textarea value={form.achievements} onChange={(e) => setForm({ ...form, achievements: e.target.value })} placeholder="Achievements, one per line" className="rounded-md border px-3 py-2 text-sm md:col-span-2" />
        <input value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} placeholder="Python, SQL, React" className="rounded-md border px-3 py-2 text-sm md:col-span-2" />
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white md:col-span-2">Add Experience</button>
      </form>

      <div className="grid gap-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-900">{item.role}</h3>
                <p className="text-sm font-semibold text-blue-600">{item.company}</p>
              </div>
              <button onClick={() => remove(item.id)} className="text-sm font-semibold text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExperienceAdmin;