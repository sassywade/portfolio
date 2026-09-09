import type { Project } from "./projects";
import Image from "next/image";
import { ProjectVideoTile } from "./project-video-tile";

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
      <ProjectVideoTile
        ariaLabel="Glean homepage redesign walkthrough"
        className="project-mockup project-mockup--homepage-work"
        label={project.title}
        poster={project.cover.src}
        source="/work/homepage-ss.mp4"
        videoClassName="homepage-work-video"
        wideWindows={[[0, 1.25], [8, 10.5], [14, 17]]}
      />
    );
  }

  if (project.slug === "growth") {
    return (
      <div className="project-mockup project-mockup--growth-work">
        <span className="project-placeholder__title">{project.title}</span>
        <video
          className="growth-work-video"
          aria-label="Glean onboarding walkthrough"
          autoPlay
          disablePictureInPicture
          loop
          muted
          playsInline
          poster={project.cover.src}
          preload="metadata"
        >
          <source src="/work/onboarding-portfolio.mp4" type="video/mp4" />
        </video>
      </div>
    );
  }

  if (project.slug === "artifacts") {
    return (
      <ProjectVideoTile
        ariaLabel="Glean Artifacts walkthrough"
        className="project-mockup project-mockup--artifacts-work"
        label={project.title}
        poster={project.cover.src}
        source="/work/artifacts-ss.mp4"
        videoClassName="artifacts-work-image"
        wideWindows={[[0, 4.5], [14, 17]]}
      />
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
