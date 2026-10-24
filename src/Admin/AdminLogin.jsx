import { useState } from "react";
import { api, setToken } from "./api";

const AdminLogin = ({ onLogin }) => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await api.login(form);
      setToken(result.token);
      onLogin();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 grid place-items-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
      >
        <h1 className="text-2xl font-bold text-gray-900">CMS Login</h1>
        <p className="mt-2 text-sm text-gray-500">
          Sign in to manage portfolio content.
        </p>

        {error && (
          <div className="mt-5 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(event) => updateField("username", event.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(event) => updateField("password", event.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </main>
  );
};

export default AdminLogin;