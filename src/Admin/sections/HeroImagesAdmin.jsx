import { useEffect, useState } from "react";
import { api } from "../api";
import SectionHeader from "../SectionHeader";

const HeroImagesAdmin = () => {
  const [items, setItems] = useState([]);
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const loadItems = async () => {
    const result = await api.list("hero-images");
    setItems(result.data || []);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const uploadImages = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!files.length) {
      setMessage("Choose up to 3 images.");
      return;
    }

    const formData = new FormData();
    files.slice(0, 3).forEach((file) => formData.append("images", file));

    setLoading(true);

    try {
      await api.createForm("hero-images", formData);
      setFiles([]);
      event.target.reset();
      await loadItems();
      setMessage("Hero images updated. Latest 3 images kept.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    if (!confirm("Delete this hero image?")) return;
    await api.remove("hero-images", id);
    await loadItems();
  };

  return (
    <section>
      <SectionHeader
        title="Hero Images"
        description="Upload up to 3 hero carousel images. The backend keeps the latest 3."
      />

      <form
        onSubmit={uploadImages}
        className="mb-6 rounded-lg border border-gray-200 bg-white p-5"
      >
       <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center hover:bg-gray-100">
  <span className="text-sm font-semibold text-gray-900">
    Choose hero images
  </span>
  <span className="mt-1 text-xs text-gray-500">
    Select up to 3 images
  </span>

  <input
    type="file"
    accept="image/*"
    multiple
    onChange={(event) => setFiles(Array.from(event.target.files || []))}
    className="sr-only"
  />
</label>

{files.length > 0 && (
  <div className="mt-3 text-sm text-gray-600">
    {files.slice(0, 3).map((file) => (
      <p key={file.name}>{file.name}</p>
    ))}
  </div>
)}

        <button
          type="submit"
          disabled={loading}
          className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Uploading..." : "Upload Hero Images"}
        </button>

        {message && <p className="mt-3 text-sm text-gray-600">{message}</p>}
      </form>

      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <img src={item.src} alt="" className="h-44 w-full object-cover" />
            <div className="flex items-center justify-between p-4">
              <span className="text-xs text-gray-500">
                {item.published ? "Published" : "Hidden"}
              </span>
              <button
                onClick={() => deleteItem(item.id)}
                className="rounded-md border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeroImagesAdmin;