// A link counts only if it points somewhere real.
export const realLink = (url) => (url && url !== "#" ? url : null);
