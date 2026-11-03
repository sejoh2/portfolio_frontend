import { useEffect, useState } from "react";
import { api } from "../api";
import SectionHeader from "../SectionHeader";

const MessagesAdmin = () => {
  const [items, setItems] = useState([]);
  const [openId, setOpenId] = useState(null);

  const loadItems = async () => {
    const result = await api.list("messages");
    setItems(result.data || []);
  };

  useEffect(() => {
    api.list("messages").then((result) => setItems(result.data || []));
  }, []);

  const toggle = async (item) => {
    setOpenId(openId === item.id ? null : item.id);
    if (!item.is_read) {
      await api.update("messages", item.id, { isRead: true });
      await loadItems();
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this message?")) return;
    await api.remove("messages", id);
    await loadItems();
  };

  return (
    <section>
      <SectionHeader title="Messages" description="Messages sent through the contact form on your site." />

      {items.length === 0 && (
        <p className="rounded-lg border border-gray-200 bg-white p-5 text-sm text-gray-500">No messages yet.</p>
      )}

      <div className="grid gap-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-lg border border-gray-200 bg-white">
            <button type="button" onClick={() => toggle(item)} className="flex w-full items-start justify-between gap-4 p-4 text-left">
              <div className="min-w-0">
                <p className={`truncate ${item.is_read ? "text-gray-700" : "font-semibold text-gray-900"}`}>
                  {!item.is_read && <span className="mr-2 inline-block h-2 w-2 rounded-full bg-blue-600" />}
                  {item.name} · <span className="text-gray-500">{item.email}</span>
                </p>
                {openId !== item.id && <p className="mt-1 truncate text-sm text-gray-500">{item.message}</p>}
              </div>
              <span className="shrink-0 text-xs text-gray-400">{new Date(item.created_at).toLocaleString()}</span>
            </button>

            {openId === item.id && (
              <div className="border-t border-gray-100 p-4">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">{item.message}</p>
                <div className="mt-4 flex gap-3">
                  <a href={`mailto:${item.email}?subject=${encodeURIComponent("Re: your message")}`} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                    Reply by email
                  </a>
                  <button onClick={() => remove(item.id)} className="rounded-md border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default MessagesAdmin;
