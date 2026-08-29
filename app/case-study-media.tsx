"use client";

import { useState, type ReactNode } from "react";

export function CaseStudyMedia({ children, label }: { children: ReactNode; label: string }) {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className={`case-media-shell ${isPaused ? "is-paused" : ""}`}>
      <button
        className="case-media-control"
        type="button"
        aria-pressed={isPaused}
        onClick={() => setIsPaused((paused) => !paused)}
        data-cuelume-toggle="toggle"
      >
        <span aria-hidden="true">{isPaused ? "▶" : "Ⅱ"}</span>
        {isPaused ? "Play" : "Pause"} {label}
      </button>
      {children}
    </div>
  );
}
