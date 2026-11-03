import { ExternalLink, Lock } from "lucide-react";
import ProjectVisual from "./ProjectVisuals";
import { realLink } from "../lib/links";
import { GithubIcon } from "./icons";

const ProjectImage = ({ project }) => {
  const image = project.image_url || project.imageUrl;
  if (image) {
    return (
      <img
        src={image}
        alt={`${project.title} screenshot`}
        loading="lazy"
        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
      />
    );
  }
  return <ProjectVisual category={project.category} />;
};

const ProjectCard = ({ project }) => {
  const tags = Array.isArray(project.tags) ? project.tags : [];
  const demo = realLink(project.demo_url || project.demoUrl);
  const code = realLink(project.code_url || project.codeUrl);
  const extraLinks = (Array.isArray(project.links) ? project.links : []).filter((link) => link?.label && realLink(link.url));

  return (
    <article className="group flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm transition hover:shadow-md">
      <div className="relative h-44 lg:h-52 overflow-hidden bg-gray-100">
        <ProjectImage project={project} />
        {project.category && (
          <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 shadow-sm">
            {project.category}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3" title={project.description}>{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-5">
          {tags.map((tag) => (
            <span key={tag} className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto">
          {demo || code ? (
            <div className="grid grid-cols-2 gap-3">
              {demo && (
                <a
                  href={demo}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 ${code ? "" : "col-span-2"}`}
                >
                  <ExternalLink className="w-4 h-4" /> Live Demo
                </a>
              )}
              {code && (
                <a
                  href={code}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-center justify-center gap-2 rounded-md border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 ${demo ? "" : "col-span-2"}`}
                >
                  <GithubIcon /> Source Code
                </a>
              )}
            </div>
          ) : (
            <p className="flex items-center gap-2 text-xs text-gray-500">
              <Lock className="w-3.5 h-3.5" /> Private client or employer project
            </p>
          )}

          {extraLinks.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-gray-100 pt-4">
              {extraLinks.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-blue-600"
                >
                  {link.label}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
