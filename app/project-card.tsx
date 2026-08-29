import { projects, type Project } from "./projects";
import { ProjectMockup } from "./project-mockup";
import { Reveal } from "./reveal";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Reveal className="project-reveal">
      <a className="project-card" href={`/case-studies/${project.slug}`} data-cuelume-toggle="pulse">
        <ProjectMockup theme={project.theme} />
        <div className="project-info">
          <div className="project-title-row">
            <h3>{project.title}</h3>
            <span className="project-number">{project.number}</span>
          </div>
          <p>{project.description}</p>
          <div className="project-meta">
            <span>{project.category}</span>
            <span>{project.year} <b>↗</b></span>
          </div>
        </div>
      </a>
    </Reveal>
  );
}

export function ProjectGrid({ items = projects }: { items?: Project[] }) {
  return (
    <div className="project-grid pranathi-project-grid">
      {items.map((project) => <ProjectCard key={project.number} project={project} />)}
    </div>
  );
}
