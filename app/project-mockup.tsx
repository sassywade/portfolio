/* The work grid intentionally uses native local images as visual placeholders. */
/* eslint-disable @next/next/no-img-element */

import type { Project } from "./projects";

const projectImages: Partial<Record<Project["slug"], string>> = {
  "soft-launch": "/work/snap-treasure.png",
  "pocket-studio": "/work/snap-nfts-as-lenses.png",
};

export function ProjectMockup({ project }: { project: Project }) {
  const image = projectImages[project.slug];

  return (
    <div className={`project-mockup${image ? " project-mockup--with-image" : ""}`} aria-hidden="true">
      <span className="project-card__title">{project.title}</span>
      {image && <img className="project-work-image" src={image} alt="" loading="lazy" />}
    </div>
  );
}
