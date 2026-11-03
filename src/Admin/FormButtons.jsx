// Submit row for admin forms: "Add" when creating, "Save changes" + "Cancel" when editing.
const FormButtons = ({ editing, addLabel, onCancel, saving }) => (
  <div className="flex flex-wrap gap-3 md:col-span-2">
    <button disabled={saving} className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
      {saving ? "Saving…" : editing ? "Save changes" : addLabel}
    </button>
    {editing && (
      <button type="button" onClick={onCancel} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
        Cancel
      </button>
    )}
  </div>
);

export default FormButtons;
