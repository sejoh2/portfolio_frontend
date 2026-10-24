import { useEffect, useState } from "react";
import { api } from "../api";
import SectionHeader from "../SectionHeader";

const ContactProfileAdmin = () => {
  const [form, setForm] = useState({
    email: "",
    phone: "",
    location: "",
    githubUrl: "",
    linkedinUrl: "",
    xUrl: "",
    githubUsername: "",
    whatsappUrl: "",
    footerName: "",
    footerTagline: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const result = await api.getContactProfile();
      const data = result.data || {};

      setForm({
        email: data.email || "",
        phone: data.phone || "",
        location: data.location || "",
        githubUrl: data.github_url || "",
        linkedinUrl: data.linkedin_url || "",
        xUrl: data.x_url || "",
        githubUsername: data.github_username || "",
        whatsappUrl: data.whatsapp_url || "",
        footerName: data.footer_name || "",
        footerTagline: data.footer_tagline || "",
      });
    }

    loadProfile();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    await api.updateContactProfile(form);
    setMessage("Contact profile updated.");
  };

  return (
    <section>
      <SectionHeader title="Contact Profile" description="Manage contact details and footer text." />

      <form onSubmit={submit} className="grid gap-3 rounded-lg border border-gray-200 bg-white p-5 md:grid-cols-2">
        {Object.keys(form).map((field) => (
          <input
            key={field}
            value={form[field]}
            onChange={(event) => setForm({ ...form, [field]: event.target.value })}
            placeholder={field}
            className="rounded-md border px-3 py-2 text-sm"
          />
        ))}

        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white md:col-span-2">
          Save Contact Profile
        </button>

        {message && <p className="text-sm text-gray-600 md:col-span-2">{message}</p>}
      </form>
    </section>
  );
};

export default ContactProfileAdmin;