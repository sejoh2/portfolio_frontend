import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const ExternalLinkIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <path d="M15 3h6v6" />
    <path d="M10 14 21 3" />
  </svg>
);

const GithubIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6A4.6 4.6 0 0 0 18.7 6a4.2 4.2 0 0 0-.1-3.3s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.4 5.4 2.7 5.4 2.7A4.2 4.2 0 0 0 5.3 6 4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </svg>
);

const fallbackProjects = [
  {
    id: "binance",
    title: "Binance Crypto Data Pipeline",
    description:
      "An Apache Airflow pipeline for automated fetching and processing of live cryptocurrency prices from Binance with scheduled DAG workflows.",
    imageUrl: "/projects/binance-pipeline.png",
    category: "",
    tags: ["Apache Airflow", "Python", "Data Engineering", "Crypto API", "ETL"],
    demoUrl: "#",
    codeUrl: "#",
  },
  {
    id: "urban-detail",
    title: "Urban Detail Software",
    description:
      "a sleek, user-friendly website for Urban Detail, showcasing their car detailing services, pricing, and booking options to attract and engage...",
    imageUrl: "/projects/urban-detail.png",
    category: "Web Development",
    tags: ["React", "Firebase"],
    demoUrl: "#",
    codeUrl: "#",
  },
  {
    id: "online-tech",
    title: "Online Tech Store – Laptops & Phones",
    description: "shop for laptops and phones",
    imageUrl: "/projects/online-tech-store.png",
    category: "Web Development",
    tags: ["React"],
    demoUrl: "#",
    codeUrl: "#",
  },
  {
    id: "kamsa",
    title: "Kamsa Poultry",
    description:
      "Agent that fetches Data from all platforms and gives farmers insights about farming and egg production",
    imageUrl: "/projects/kamsa-poultry.png",
    category: "",
    tags: ["React", "ML"],
    demoUrl: "#",
    codeUrl: "#",
  },
];

const normalizeProject = (project) => ({
  ...project,
  imageUrl: project.imageUrl || project.image_url || project.image,
  demoUrl: project.demoUrl || project.demo_url || project.demo || "#",
  codeUrl: project.codeUrl || project.code_url || project.code || "#",
  tags: Array.isArray(project.tags) ? project.tags : [],
});

const ProjectsPage = () => {
  const [projects, setProjects] = useState(fallbackProjects);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/public/projects`);
        const result = await response.json();

        if (result.success && result.data?.length) {
          setProjects(result.data.map(normalizeProject));
        }
      } catch (error) {
        console.error("Failed to load projects:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  return (
    <div
      className="min-h-screen bg-white"
      style={{
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      <main className="max-w-5xl mx-auto px-6 pt-14 pb-12">
        <header className="flex items-center gap-5 pt-2 mb-9">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm"
          >
            <ArrowLeftIcon />
            Back to Home
          </Link>

          <h1 className="text-2xl font-bold text-gray-900">
            All Projects
          </h1>
        </header>

        {loading && (
          <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
            Loading projects...
          </div>
        )}

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <article
              key={project.id || project.title}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"
            >
              <div className="relative h-56 overflow-hidden bg-gray-100">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />

                {project.category && (
                  <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-sm text-gray-700 shadow-sm">
                    {project.category}
                  </span>
                )}

                <div className="absolute top-4 right-4 flex gap-2">
                  <a
                    href={project.demoUrl}
                    className="grid h-9 w-9 place-items-center rounded-lg bg-white text-gray-600 shadow-sm hover:text-blue-600"
                    aria-label={`${project.title} demo`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExternalLinkIcon />
                  </a>

                  <a
                    href={project.codeUrl}
                    className="grid h-9 w-9 place-items-center rounded-lg bg-white text-gray-600 shadow-sm hover:text-blue-600"
                    aria-label={`${project.title} code`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <GithubIcon />
                  </a>
                </div>
              </div>

              <div className="p-5">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  {project.title}
                </h2>

                <p className="text-sm text-gray-600 leading-7 mb-5">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={project.demoUrl}
                    className="flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExternalLinkIcon />
                    Demo
                  </a>

                  <a
                    href={project.codeUrl}
                    className="flex items-center justify-center gap-2 rounded-md border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <GithubIcon />
                    Code
                  </a>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
};

export default ProjectsPage;