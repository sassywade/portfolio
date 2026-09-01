import { projects, type Project } from "./projects";
import { ProjectMockup } from "./project-mockup";
import { Reveal } from "./reveal";

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
        data-cuelume-toggle="pulse"
      >
        <ProjectMockup project={project} />
      </a>
    </Reveal>
  );
}

export function ProjectGrid({ items = projects }: { items?: Project[] }) {
  const projectsBySlug = new Map(items.map((project) => [project.slug, project]));
  const selectProjects = (slugs: string[]) =>
    slugs.flatMap((slug) => {
      const project = projectsBySlug.get(slug);
      return project ? [project] : [];
    });

  const gleanProjects = selectProjects([
    "signal-noise",
    "common-ground",
    "field-notes",
    "the-archive",
    "soft-systems",
    "afterimage",
  ]);
  const snapProjects = selectProjects(["soft-launch", "pocket-studio"]);
  const featuredSlugs = new Set([...gleanProjects, ...snapProjects].map((project) => project.slug));
  const archiveProjects = items.filter((project) => !featuredSlugs.has(project.slug));

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

      <section className="work-group" aria-labelledby="work-group-snap">
        <h3 className="work-group__brand hero-company hero-company--snap" id="work-group-snap">
          <span className="hero-company__mark" aria-hidden="true" />
          <span>Snap</span>
        </h3>
        <div className="project-grid pranathi-project-grid">
          {snapProjects.map((project) => <ProjectCard key={project.number} project={project} />)}
        </div>
      </section>

      {archiveProjects.length > 0 ? (
        <section className="work-group work-group--archive" aria-labelledby="work-group-archive">
          <details className="work-archive-disclosure">
            <summary className="work-archive-summary">
              <span id="work-group-archive">Archive</span>
              <span className="work-archive-summary__meta">
                {archiveProjects.length} projects
                <span className="work-archive-summary__icon" aria-hidden="true" />
              </span>
            </summary>
            <div className="work-archive-list">
              {archiveProjects.map((project) => (
                <a
                  className="work-archive-link"
                  href={`/case-studies/${project.slug}`}
                  key={project.number}
                  data-cuelume-toggle="pulse"
                >
                  <span>{project.title}</span>
                  <span className="work-archive-link__year">{project.year}</span>
                </a>
              ))}
            </div>
          </details>
        </section>
      ) : null}
    </div>
  );
}
