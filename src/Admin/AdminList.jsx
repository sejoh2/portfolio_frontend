import { useState } from "react";
import { api } from "./api";

// Shared list for admin sections: edit, reorder, show/hide, featured and delete.
// `toggles` adds extra on/off buttons, e.g. [{ field: "featured", on: "Featured", off: "Not featured" }].
const AdminList = ({ resource, items, reload, onEdit, editingId, renderItem, toggles = [], deleteLabel = "item", grid = "" }) => {
  const [busy, setBusy] = useState(false);

  const run = async (work) => {
    setBusy(true);
    try {
      await work();
      await reload();
    } catch (error) {
      alert(error.message);
    } finally {
      setBusy(false);
    }
  };

  // Swap two neighbours, then renumber so every item has a clean, unique position.
  const move = (index, direction) =>
    run(async () => {
      const order = [...items];
      const target = index + direction;
      if (target < 0 || target >= order.length) return;
      [order[index], order[target]] = [order[target], order[index]];
      await Promise.all(
        order.map((item, position) =>
          item.sort_order === position + 1 ? null : api.update(resource, item.id, { sortOrder: position + 1 })
        )
      );
    });

  const toggle = (item, field) => run(() => api.update(resource, item.id, { [field]: !item[field] }));

  const remove = (item) => {
    if (!confirm(`Delete this ${deleteLabel}? This can't be undone.`)) return;
    run(() => api.remove(resource, item.id));
  };

  if (!items.length) {
    return <p className="rounded-lg border border-gray-200 bg-white p-5 text-sm text-gray-500">Nothing here yet. Add the first one above.</p>;
  }

  const allToggles = [...toggles, { field: "published", on: "Visible", off: "Hidden" }];

  return (
    <div className={grid || "grid gap-3"}>
      {items.map((item, index) => (
        <div
          key={item.id}
          className={`overflow-hidden rounded-lg border bg-white ${editingId === item.id ? "border-blue-400 ring-2 ring-blue-100" : "border-gray-200"} ${
            item.published === false ? "opacity-60" : ""
          }`}
        >
          {renderItem(item)}

          <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 bg-gray-50 px-4 py-2 text-xs font-semibold">
            <button type="button" disabled={busy || index === 0} onClick={() => move(index, -1)} className="rounded border bg-white px-2 py-1 text-gray-600 disabled:opacity-40" aria-label="Move up">
              ↑
            </button>
            <button type="button" disabled={busy || index === items.length - 1} onClick={() => move(index, 1)} className="rounded border bg-white px-2 py-1 text-gray-600 disabled:opacity-40" aria-label="Move down">
              ↓
            </button>

            {allToggles.map(({ field, on, off }) =>
              item[field] === undefined ? null : (
                <button
                  key={field}
                  type="button"
                  disabled={busy}
                  onClick={() => toggle(item, field)}
                  className={`rounded px-2 py-1 ${item[field] ? "bg-green-50 text-green-700" : "bg-gray-200 text-gray-600"}`}
                  title="Click to switch"
                >
                  {item[field] ? on : off}
                </button>
              )
            )}

            <span className="flex-1" />
            {onEdit && (
              <button type="button" onClick={() => onEdit(item)} className="text-blue-600 hover:underline">
                Edit
              </button>
            )}
            <button type="button" disabled={busy} onClick={() => remove(item)} className="text-red-600 hover:underline">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminList;

