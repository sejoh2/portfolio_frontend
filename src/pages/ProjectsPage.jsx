import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPublicProjects } from "../lib/portfolio";
import { projects as defaultProjects } from "../data/portfolioContent";
import ProjectCard from "../components/ProjectCard";

const ArrowLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </svg>
);

const ProjectsPage = () => {
  const [projects, setProjects] = useState(defaultProjects);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    document.title = "All Projects · Joseph Kyalo";
    window.scrollTo(0, 0);

    async function loadProjects() {
      try {
        const result = await fetchPublicProjects();

        if (result.success && result.data?.length) {
          setProjects(result.data);
        }
      } catch (error) {
        console.error("Failed to load projects:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  const categories = ["All", ...new Set(projects.map((p) => (p.category || "").split("·")[0].trim()).filter(Boolean))];
  const shown = filter === "All" ? projects : projects.filter((p) => (p.category || "").startsWith(filter));

  return (
    <div
      className="min-h-screen bg-gray-100"
      style={{
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      <main className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12 pt-14 pb-20">
        <header className="mb-10">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm">
            <ArrowLeftIcon />
            Back to Home
          </Link>

          <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">All Projects</h1>
          <p className="mt-2 text-gray-500">Everything I've built, from production systems to experiments.</p>

          {categories.length > 2 && (
            <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter projects">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setFilter(category)}
                  aria-pressed={filter === category}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                    filter === category
                      ? "border-orange-500 bg-orange-500 text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </header>

        {loading && (
          <div className="mb-6 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
            Loading projects...
          </div>
        )}

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shown.map((project) => (
            <ProjectCard key={project.id || project.title} project={project} />
          ))}
        </section>
      </main>
    </div>
  );
};

export default ProjectsPage;
