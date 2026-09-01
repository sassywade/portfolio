import { projects, type Project } from "./projects";
import { ProjectMockup } from "./project-mockup";
import { Reveal } from "./reveal";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Reveal className="project-reveal">
      <a
        className="project-card"
        href={`/case-studies/${project.slug}`}
        aria-label={`Open ${project.title} case study`}
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
    </div>
  );
}
