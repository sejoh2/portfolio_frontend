import { useEffect, useState } from "react";
import { api } from "../api";
import { uploadFile } from "../../lib/supabase";
import SectionHeader from "../SectionHeader";

// [form key, database column, label, input type]
const FIELDS = [
  ["fullName", "full_name", "Full name", "text"],
  ["headline", "headline", "Headline (e.g. Software Engineer · Fintech, Mobile & AI)", "text"],
  ["tagline", "tagline", "Tagline (one or two sentences under your name)", "textarea"],
  ["bio", "bio", "About me (leave a blank line between paragraphs)", "textarea"],
  ["availability", "availability", "Availability badge (e.g. Open to new opportunities)", "text"],
  ["email", "email", "Email", "text"],
  ["phone", "phone", "Phone", "text"],
  ["location", "location", "Location", "text"],
  ["githubUrl", "github_url", "GitHub URL", "text"],
  ["githubUsername", "github_username", "GitHub username (for the contributions chart)", "text"],
  ["linkedinUrl", "linkedin_url", "LinkedIn URL", "text"],
  ["xUrl", "x_url", "X URL", "text"],
  ["whatsappUrl", "whatsapp_url", "WhatsApp link (https://wa.me/2547…)", "text"],
  ["footerName", "footer_name", "Footer name", "text"],
  ["footerTagline", "footer_tagline", "Footer tagline", "text"],
  ["cvUrl", "cv_url", "CV / Resume (PDF)", "file"],
  ["avatarUrl", "avatar_url", "Profile photo", "image"],
];

const emptyForm = Object.fromEntries(FIELDS.map(([key]) => [key, ""]));

const ContactProfileAdmin = () => {
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const result = await api.getContactProfile();
      const data = result.data || {};
      setForm(Object.fromEntries(FIELDS.map(([key, column]) => [key, data[column] || ""])));
    }

    loadProfile();
  }, []);

  const upload = async (key, file, folder) => {
    if (!file) return;
    setUploading(key);
    setMessage("");
    try {
      const url = await uploadFile(file, folder);
      setForm((current) => ({ ...current, [key]: url }));
      setMessage("File uploaded. Click Save to apply it.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setUploading("");
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    try {
      await api.updateContactProfile(form);
      setMessage("Profile updated.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <section>
      <SectionHeader title="Profile & Contact" description="Your name, headline, bio, CV, contact details and footer text." />

      <form onSubmit={submit} className="grid gap-4 rounded-lg border border-gray-200 bg-white p-5 md:grid-cols-2">
        {FIELDS.map(([key, , label, type]) => {
          if (type === "textarea") {
            return (
              <label key={key} className="text-sm md:col-span-2">
                <span className="mb-1 block font-medium text-gray-700">{label}</span>
                <textarea
                  rows={key === "bio" ? 7 : 3}
                  value={form[key]}
                  onChange={(event) => setForm({ ...form, [key]: event.target.value })}
                  className="w-full rounded-md border px-3 py-2 text-sm"
                />
              </label>
            );
          }

          if (type === "file" || type === "image") {
            return (
              <div key={key} className="text-sm md:col-span-2">
                <span className="mb-1 block font-medium text-gray-700">{label}</span>
                <div className="flex flex-wrap items-center gap-3">
                  {form[key] &&
                    (type === "image" ? (
                      <img src={form[key]} alt="" className="h-14 w-14 rounded-full border object-cover" />
                    ) : (
                      <a href={form[key]} target="_blank" rel="noreferrer" className="font-semibold text-blue-600 underline">
                        View current file
                      </a>
                    ))}
                  <input
                    type="file"
                    accept={type === "image" ? "image/*" : "application/pdf"}
                    onChange={(event) => upload(key, event.target.files?.[0], type === "image" ? "profile" : "cv")}
                    className="text-sm"
                  />
                  {uploading === key && <span className="text-gray-500">Uploading…</span>}
                  {form[key] && (
                    <button type="button" onClick={() => setForm({ ...form, [key]: "" })} className="text-xs font-semibold text-red-600">
                      Remove
                    </button>
                  )}
                </div>
              </div>
            );
          }

          return (
            <label key={key} className="text-sm">
              <span className="mb-1 block font-medium text-gray-700">{label}</span>
              <input
                value={form[key]}
                onChange={(event) => setForm({ ...form, [key]: event.target.value })}
                className="w-full rounded-md border px-3 py-2 text-sm"
              />
            </label>
          );
        })}

        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white md:col-span-2">
          Save Profile
        </button>

        {message && <p className="text-sm text-gray-600 md:col-span-2">{message}</p>}
      </form>
    </section>
  );
};

export default ContactProfileAdmin;
