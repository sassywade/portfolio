import { projects, type Project } from "./projects";
import { ProjectMockup } from "./project-mockup";
import { Reveal } from "./reveal";

export function ProjectCard({ project }: { project: Project }) {
  const href = `/case-studies/${project.slug}`;

  return (
    <Reveal className="project-reveal">
      <a
        className="project-card"
        href={href}
        aria-label={`Open ${project.title} case study`}
        data-cuelume-toggle="pulse"
      >
        <ProjectMockup project={project} />
      </a>
    </Reveal>
  );
}

export function ProjectGrid({ items = projects }: { items?: Project[] }) {
  const gleanProjects = items;

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

    </div>
  );
}
