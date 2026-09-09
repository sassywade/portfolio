import type { Project } from "./projects";
import Image from "next/image";

export function ProjectMockup({ project }: { project: Project }) {
  if (project.slug === "homepage") {
    return (
      <div className="project-mockup project-mockup--homepage-work">
        <video className="homepage-work-video" aria-label="Glean homepage redesign walkthrough" autoPlay disablePictureInPicture loop muted playsInline poster={project.cover.src} preload="metadata">
          <source src="/work/homepage-ss.mp4" type="video/mp4" />
        </video>
      </div>
    );
  }

  if (project.slug === "psychic") {
    return (
      <div className="project-mockup project-mockup--proactive-work">
        <video className="proactive-work-video" aria-label="Glean proactive intelligence walkthrough" autoPlay disablePictureInPicture loop muted playsInline poster={project.cover.src} preload="metadata">
          <source src="/work/proactive-intelligence.mp4" type="video/mp4" />
        </video>
      </div>
    );
  }

  if (project.slug === "growth") {
    return (
      <div className="project-mockup project-mockup--growth-work">
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
      <div className="project-mockup project-mockup--artifacts-work">
        <video className="artifacts-work-image" aria-label="Glean Artifacts walkthrough" autoPlay disablePictureInPicture loop muted playsInline poster={project.cover.src} preload="metadata">
          <source src="/work/artifacts-ss.mp4" type="video/mp4" />
        </video>
      </div>
    );
  }

  if (project.category.includes("Snap")) {
    return (
      <div className="project-mockup project-mockup--snap-work">
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
    </div>
  );
}
