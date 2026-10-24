import { useEffect, useState } from "react";
import { api } from "../api";
import SectionHeader from "../SectionHeader";

const CertificationsAdmin = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: "", issuer: "", year: "" });
  const [image, setImage] = useState(null);

  const loadItems = async () => {
    const result = await api.list("certifications");
    setItems(result.data || []);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const submit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("issuer", form.issuer);
    formData.append("year", form.year);
    formData.append("image", image);

    await api.createForm("certifications", formData);
    setForm({ title: "", issuer: "", year: "" });
    setImage(null);
    event.target.reset();
    await loadItems();
  };

  const remove = async (id) => {
    if (!confirm("Delete this certification?")) return;
    await api.remove("certifications", id);
    await loadItems();
  };

  return (
    <section>
      <SectionHeader title="Certifications" description="Add one image per certificate." />

      <form onSubmit={submit} className="mb-6 grid gap-3 rounded-lg border border-gray-200 bg-white p-5 md:grid-cols-2">
        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="rounded-md border px-3 py-2 text-sm" />
        <input value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} placeholder="Issuer" className="rounded-md border px-3 py-2 text-sm" />
        <input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="Year" className="rounded-md border px-3 py-2 text-sm" />
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0])} className="text-sm" />
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white md:col-span-2">Add Certification</button>
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <img src={item.image_url} alt={item.title} className="h-40 w-full object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">{item.title}</h3>
              <p className="text-sm text-blue-600">{item.issuer}</p>
              <button onClick={() => remove(item.id)} className="mt-3 text-sm font-semibold text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CertificationsAdmin;