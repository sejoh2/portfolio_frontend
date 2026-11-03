import { useEffect, useState } from "react";
import { api } from "../api";
import AdminList from "../AdminList";
import FormButtons from "../FormButtons";
import { nextSortOrder } from "../adminUtils";
import SectionHeader from "../SectionHeader";

const initialForm = { title: "", issuer: "", year: "" };

const CertificationsAdmin = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [fileKey, setFileKey] = useState(0); // resets the file input

  const loadItems = async () => {
    const result = await api.list("certifications");
    setItems(result.data || []);
  };

  useEffect(() => {
    api.list("certifications").then((result) => setItems(result.data || []));
  }, []);

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({ title: item.title, issuer: item.issuer || "", year: item.year || "" });
    setImage(null);
    setFileKey((key) => key + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancel = () => {
    setEditingId(null);
    setForm(initialForm);
    setImage(null);
    setFileKey((key) => key + 1);
  };

  const submit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("issuer", form.issuer);
    formData.append("year", form.year);
    if (image) formData.append("image", image); // editing without a new image keeps the old one

    setSaving(true);
    try {
      if (editingId) {
        await api.updateForm("certifications", editingId, formData);
      } else {
        formData.append("sortOrder", String(nextSortOrder(items)));
        await api.createForm("certifications", formData);
      }
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
      <SectionHeader title="Certifications" description="One image per certificate is optional." />

      <form onSubmit={submit} className="mb-6 grid gap-3 rounded-lg border border-gray-200 bg-white p-5 md:grid-cols-2">
        <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="rounded-md border px-3 py-2 text-sm md:col-span-2" />
        <input value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} placeholder="Issuer" className="rounded-md border px-3 py-2 text-sm" />
        <input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="Year" className="rounded-md border px-3 py-2 text-sm" />
        <label className="text-sm text-gray-600 md:col-span-2">
          {editingId ? "Replace image (optional): " : "Image (optional): "}
          <input key={fileKey} type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="text-sm" />
        </label>
        <FormButtons editing={Boolean(editingId)} addLabel="Add Certification" onCancel={cancel} saving={saving} />
      </form>

      <AdminList
        resource="certifications"
        items={items}
        reload={loadItems}
        onEdit={startEdit}
        editingId={editingId}
        deleteLabel="certification"
        grid="grid gap-4 md:grid-cols-2"
        renderItem={(item) => (
          <>
            {item.image_url ? (
              <img src={item.image_url} alt={item.title} className="h-36 w-full object-cover" />
            ) : (
              <div className="grid h-36 place-items-center bg-gray-50 text-xs text-gray-400">No image</div>
            )}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">{item.title}</h3>
              <p className="text-sm text-blue-600">{[item.issuer, item.year].filter(Boolean).join(" · ")}</p>
            </div>
          </>
        )}
      />
    </section>
  );
};

export default CertificationsAdmin;
