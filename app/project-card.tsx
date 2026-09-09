import { projects, type Project } from "./projects";
import { ProjectMockup } from "./project-mockup";
import { Reveal } from "./reveal";

const gleanProjectOrder = [
  "homepage",
  "psychic",
  "artifacts",
  "growth",
  "agent-observability",
  "workspace-admin-console-actions",
] as const;

export function ProjectCard({ project }: { project: Project }) {
  const href = project.externalUrl ?? `/case-studies/${project.slug}`;
  const isExternal = Boolean(project.externalUrl);

  return (
    <Reveal className="project-reveal">
      <a
        className="project-card"
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        aria-label={
          isExternal
            ? `Open ${project.title} article in a new tab`
            : `Open ${project.title} case study`
        }
      >
        <ProjectMockup project={project} />
      </a>
    </Reveal>
  );
}

export function ProjectGrid({ items = projects }: { items?: Project[] }) {
  const gleanProjects = items
    .filter((project) => project.category.includes("Glean"))
    .sort((a, b) => gleanProjectOrder.indexOf(a.slug as typeof gleanProjectOrder[number]) - gleanProjectOrder.indexOf(b.slug as typeof gleanProjectOrder[number]));
  const snapProjects = items.filter((project) => project.category.includes("Snap"));

  return (
    <div className="work-groups">
      <section className="work-group" aria-labelledby="work-group-glean">
        <h3 className="work-group__brand hero-company hero-company--glean" id="work-group-glean">
          <span className="hero-company__mark" aria-hidden="true" />
          <span>Glean</span>
        </h3>
        <div className="project-grid pranathi-project-grid">
          {gleanProjects.map((project) => <ProjectCard key={project.number} project={project} />)}
        </div>
      </section>

      {snapProjects.length > 0 ? (
        <section className="work-group" aria-labelledby="work-group-snap">
          <h3 className="work-group__brand hero-company hero-company--snap" id="work-group-snap">
            <span className="hero-company__mark" aria-hidden="true" />
            <span>Snap</span>
          </h3>
          <div className="project-grid pranathi-project-grid">
            {snapProjects.map((project) => <ProjectCard key={project.number} project={project} />)}
          </div>
        </section>
      ) : null}

    </div>
  );
}
