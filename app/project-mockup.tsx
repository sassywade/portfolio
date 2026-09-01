import type { Project } from "./projects";

export function ProjectMockup({ project }: { project: Project }) {
  return (
    <div className={`project-mockup project-mockup--${project.theme} project-mockup--placeholder`}>
      <span className="project-placeholder__title">{project.title}</span>
    </div>
  );
}
