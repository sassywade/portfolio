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
        <ProjectMockup theme={project.theme} />
        <span className="project-card__title">{project.title}</span>
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
