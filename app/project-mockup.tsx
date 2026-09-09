import type { Project } from "./projects";
import Image from "next/image";

export function ProjectMockup({ project }: { project: Project }) {
  if (project.slug === "agent-observability") {
    return (
      <div className="project-mockup project-mockup--observability-work">
        <span className="project-placeholder__title">{project.title}</span>
        <Image
          className="observability-work-image"
          src={project.cover.src}
          alt={project.cover.alt}
          width={728}
          height={624}
          sizes="(max-width: 700px) 72vw, (max-width: 1100px) 38vw, 390px"
        />
      </div>
    );
  }

  if (project.slug === "homepage") {
    return (
      <div className="project-mockup project-mockup--homepage-work">
        <span className="project-placeholder__title">{project.title}</span>
        <video
          className="homepage-work-video"
          aria-label="Glean homepage redesign walkthrough"
          autoPlay
          disablePictureInPicture
          loop
          muted
          playsInline
          poster={project.cover.src}
          preload="metadata"
        >
          <source src="/work/homepage-portfolio.mp4" type="video/mp4" />
        </video>
      </div>
    );
  }

  if (project.slug === "artifacts") {
    return (
      <div className="project-mockup project-mockup--artifacts-work">
        <span className="project-placeholder__title">{project.title}</span>
        <Image
          className="artifacts-work-image"
          src={project.cover.src}
          alt={project.cover.alt}
          width={1085}
          height={744}
          sizes="(max-width: 700px) 86vw, (max-width: 1100px) 46vw, 480px"
        />
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
