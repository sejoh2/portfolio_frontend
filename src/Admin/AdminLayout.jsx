import { clearToken } from "./api";

const navItems = [
  ["Hero", "hero"],
  ["What I Build", "build"],
  ["Skills", "skills"],
  ["Education", "education"],
  ["Certifications", "certifications"],
  ["Experience", "experience"],
  ["Projects", "projects"],
  ["Contact", "contact"],
];

const AdminLayout = ({ activeSection, setActiveSection, onLogout, children }) => {
  const logout = () => {
    clearToken();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-gray-200 bg-white p-5 md:block">
        <h1 className="text-xl font-bold text-gray-900">Portfolio CMS</h1>
        <p className="mt-1 text-xs text-gray-500">Admin dashboard</p>

        <nav className="mt-8 space-y-1">
          {navItems.map(([label, value]) => (
            <button
              key={value}
              type="button"
              onClick={() => setActiveSection(value)}
              className={`w-full rounded-md px-3 py-2 text-left text-sm ${
                activeSection === value
                  ? "bg-blue-50 font-semibold text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        <button
          type="button"
          onClick={logout}
          className="absolute bottom-5 left-5 right-5 rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          Logout
        </button>
      </aside>

      <div className="md:pl-64">
        <header className="sticky top-0 z-20 border-b border-gray-200 bg-white px-5 py-4 md:hidden">
          <div className="flex items-center justify-between">
            <h1 className="font-bold text-gray-900">Portfolio CMS</h1>
            <button onClick={logout} className="text-sm text-gray-600">
              Logout
            </button>
          </div>

          <select
            value={activeSection}
            onChange={(event) => setActiveSection(event.target.value)}
            className="mt-4 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            {navItems.map(([label, value]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </header>

        <main className="mx-auto max-w-6xl px-5 py-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;