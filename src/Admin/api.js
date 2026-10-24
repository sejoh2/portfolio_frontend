const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const TOKEN_KEY = "portfolio_admin_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const token = getToken();

  const headers = {
    ...(options.headers || {}),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
}

export const api = {
  login(payload) {
    return request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  list(resource) {
    return request(`/api/admin/${resource}`);
  },

  create(resource, payload) {
    return request(`/api/admin/${resource}`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  createForm(resource, formData) {
    return request(`/api/admin/${resource}`, {
      method: "POST",
      body: formData,
    });
  },

  update(resource, id, payload) {
    return request(`/api/admin/${resource}/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  updateForm(resource, id, formData) {
    return request(`/api/admin/${resource}/${id}`, {
      method: "PUT",
      body: formData,
    });
  },

  remove(resource, id) {
    return request(`/api/admin/${resource}/${id}`, {
      method: "DELETE",
    });
  },

  getContactProfile() {
    return request("/api/admin/contact-profile");
  },

  updateContactProfile(payload) {
    return request("/api/admin/contact-profile", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
};