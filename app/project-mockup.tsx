"use client";

import type { Project } from "./projects";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type ProjectVideoProps = {
  ariaLabel: string;
  className: string;
  poster: string;
  src: string;
};

function ProjectVideo({ ariaLabel, className, poster, src }: ProjectVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(video);
    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      className={className}
      aria-label={ariaLabel}
      disablePictureInPicture
      loop
      muted
      playsInline
      poster={poster}
      preload="metadata"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

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
        <ProjectVideo key={src} src={src} className="project-work-video homepage-work-video" ariaLabel="Glean homepage redesign walkthrough" poster={project.cover.src} />
      </div>
    );
  }

  if (project.slug === "psychic") {
    const src = workGradients ? "/work/proactive-intelligence-gradient.mp4" : "/work/proactive-intelligence.mp4";
    return (
      <div className="project-mockup project-mockup--full-video project-mockup--proactive-work">
        <ProjectVideo key={src} src={src} className="project-work-video proactive-work-video" ariaLabel="Glean proactive intelligence walkthrough" poster={project.cover.src} />
      </div>
    );
  }

  if (project.slug === "growth") {
    const src = workGradients ? "/work/growth-gradient.mp4" : "/work/onboarding-portfolio.mp4";
    return (
      <div className="project-mockup project-mockup--full-video project-mockup--growth-work">
        <ProjectVideo
          key={src}
          src={src}
          className="project-work-video growth-work-video"
          ariaLabel="Glean onboarding walkthrough"
          poster={project.cover.src}
        />
      </div>
    );
  }

  if (project.slug === "artifacts") {
    const src = workGradients ? "/work/artifacts-gradient.mp4" : "/work/artifacts-ss.mp4";
    return (
      <div className="project-mockup project-mockup--full-video project-mockup--artifacts-work">
        <ProjectVideo key={src} src={src} className="project-work-video artifacts-work-image" ariaLabel="Glean Artifacts walkthrough" poster={project.cover.src} />
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
