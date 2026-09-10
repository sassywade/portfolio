"use client";

import type { Project } from "./projects";
import Image from "next/image";
import { useEffect, useState } from "react";

function useWorkGradients() {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    setIsEnabled(document.documentElement.dataset.workGradients === "true");

    const handleChange = (event: Event) => {
      setIsEnabled((event as CustomEvent<{ enabled: boolean }>).detail.enabled);
    };

    window.addEventListener("portfolio:work-gradient-change", handleChange);
    return () => window.removeEventListener("portfolio:work-gradient-change", handleChange);
  }, []);

  return isEnabled;
}

export function ProjectMockup({ project }: { project: Project }) {
  const workGradients = useWorkGradients();

  if (project.slug === "homepage") {
    const src = workGradients ? "/work/homepage-gradient.mp4" : "/work/homepage-ss.mp4";
    return (
      <div className="project-mockup project-mockup--full-video project-mockup--homepage-work">
        <video key={src} className="project-work-video homepage-work-video" aria-label="Glean homepage redesign walkthrough" autoPlay disablePictureInPicture loop muted playsInline poster={project.cover.src} preload="metadata">
          <source src={src} type="video/mp4" />
        </video>
      </div>
    );
  }

  if (project.slug === "psychic") {
    const src = workGradients ? "/work/proactive-intelligence-gradient.mp4" : "/work/proactive-intelligence.mp4";
    return (
      <div className="project-mockup project-mockup--full-video project-mockup--proactive-work">
        <video key={src} className="project-work-video proactive-work-video" aria-label="Glean proactive intelligence walkthrough" autoPlay disablePictureInPicture loop muted playsInline poster={project.cover.src} preload="metadata">
          <source src={src} type="video/mp4" />
        </video>
      </div>
    );
  }

  if (project.slug === "growth") {
    const src = workGradients ? "/work/growth-gradient.mp4" : "/work/onboarding-portfolio.mp4";
    return (
      <div className="project-mockup project-mockup--full-video project-mockup--growth-work">
        <video
          key={src}
          className="project-work-video growth-work-video"
          aria-label="Glean onboarding walkthrough"
          autoPlay
          disablePictureInPicture
          loop
          muted
          playsInline
          poster={project.cover.src}
          preload="metadata"
        >
          <source src={src} type="video/mp4" />
        </video>
      </div>
    );
  }

  if (project.slug === "artifacts") {
    const src = workGradients ? "/work/artifacts-gradient.mp4" : "/work/artifacts-ss.mp4";
    return (
      <div className="project-mockup project-mockup--full-video project-mockup--artifacts-work">
        <video key={src} className="project-work-video artifacts-work-image" aria-label="Glean Artifacts walkthrough" autoPlay disablePictureInPicture loop muted playsInline poster={project.cover.src} preload="metadata">
          <source src={src} type="video/mp4" />
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
