import type { Project } from "./projects";

/* These are local case-study covers so the work grid reflects the supplied work. */
/* eslint-disable @next/next/no-img-element */

export function ProjectMockup({ project }: { project: Project }) {
  return (
    <div className={`project-mockup project-mockup--${project.theme} project-mockup--with-image`}>
      <img
        className={`project-work-image project-work-image--${project.cover.kind ?? "screen"}`}
        src={project.cover.src}
        alt=""
        loading="lazy"
      />
      <div className="project-mockup__wash" />
      <span className="project-card__title">{project.title}</span>
      <span className="project-card__caption">{project.cover.caption}</span>
      <span className="project-card__arrow" aria-hidden="true">↗</span>
    </div>
  );
}
