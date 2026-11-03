// Next position for a new item, so it lands at the end of the list.
export const nextSortOrder = (items) => (items.length ? Math.max(...items.map((item) => item.sort_order || 0)) + 1 : 1);

// "a, b, c" -> ["a", "b", "c"]
export const splitList = (text, separator = ",") =>
  String(text || "")
    .split(separator)
    .map((item) => item.trim())
    .filter(Boolean);
