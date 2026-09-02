import type { Project } from "./projects";
import Image from "next/image";

export function ProjectMockup({ project }: { project: Project }) {
  if (project.slug === "homepage") {
    return (
      <div className="project-mockup project-mockup--homepage-work">
        <span className="project-placeholder__title">{project.title}</span>
        <div className="homepage-work-comparison">
          <Image
            className="homepage-work-image homepage-work-image--after"
            src={project.cover.src}
            alt={project.cover.alt}
            width={1280}
            height={912}
            sizes="(max-width: 700px) 92vw, (max-width: 1100px) 50vw, 520px"
          />
          <Image
            className="homepage-work-image homepage-work-image--before"
            src="/work/glean-homepage-before.png"
            alt=""
            width={1280}
            height={912}
            sizes="(max-width: 700px) 92vw, (max-width: 1100px) 50vw, 520px"
          />
        </div>
      </div>
    );
  }

  if (project.category.includes("Snap")) {
    return (
      <div className="project-mockup project-mockup--snap-work">
        <span className="project-placeholder__title">{project.title}</span>
        <Image
          className="snap-work-image"
          src={project.cover.src}
          alt={project.cover.alt}
          width={368}
          height={658}
          sizes="(max-width: 700px) 70vw, 320px"
        />
      </div>
    );
  }

  return (
    <div className={`project-mockup project-mockup--${project.theme} project-mockup--placeholder`}>
      <span className="project-placeholder__title">{project.title}</span>
    </div>
  );
}
