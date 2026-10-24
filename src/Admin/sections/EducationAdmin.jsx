import { useEffect, useState } from "react";
import { api } from "../api";
import SectionHeader from "../SectionHeader";

const EducationAdmin = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    title: "",
    institution: "",
    year: "",
    location: "",
    description: "",
    sortOrder: 0,
    published: true,
  });

  const loadItems = async () => {
    const result = await api.list("education");
    setItems(result.data || []);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    await api.create("education", form);
    setForm({ title: "", institution: "", year: "", location: "", description: "", sortOrder: 0, published: true });
    await loadItems();
  };

  const remove = async (id) => {
    if (!confirm("Delete this education item?")) return;
    await api.remove("education", id);
    await loadItems();
  };

  return (
    <section>
      <SectionHeader title="Education" description="Manage education entries." />

      <form onSubmit={submit} className="mb-6 grid gap-3 rounded-lg border border-gray-200 bg-white p-5 md:grid-cols-2">
        {["title", "institution", "year", "location"].map((field) => (
          <input key={field} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} placeholder={field} className="rounded-md border px-3 py-2 text-sm" />
        ))}
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="rounded-md border px-3 py-2 text-sm md:col-span-2" />
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white md:col-span-2">Add Education</button>
      </form>

      <div className="grid gap-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm font-semibold text-blue-600">{item.institution}</p>
                <p className="mt-1 text-sm text-gray-600">{item.year} · {item.location}</p>
              </div>
              <button onClick={() => remove(item.id)} className="text-sm font-semibold text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EducationAdmin;