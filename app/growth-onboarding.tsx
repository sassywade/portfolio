"use client";

import { useEffect, useRef, useState } from "react";
import { growthOnboardingScreens } from "./projects";
import { zoomable } from "./work-zoom-props";

// Phones pan through the screens; desktop keeps the authored static stack.
export function GrowthOnboarding() {
  const root = useRef<HTMLDivElement>(null);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const sync = () => setRunning(visible && !document.hidden && !reduced.matches);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: .1 });
    if (root.current) observer.observe(root.current);
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", sync);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", sync); reduced.removeEventListener("change", sync); };
  }, []);
  return (
    <div ref={root} className="work-feature__onboarding" data-running={running} {...zoomable("Growth onboarding screens")}>
      <div className="work-feature__onboarding-track">
        {[0, 1].map((copy) => (
          <div className="work-feature__onboarding-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
            {growthOnboardingScreens.map((screen) => (
              <img key={screen.src} src={screen.src} alt={copy === 0 ? screen.alt : ""} width={980} height={592} loading="lazy" draggable={false} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
