"use client";

import { useState } from "react";
import type { ProjectTheme } from "./projects";

const slides = [
  ["01", "Start with the question."],
  ["02", "Make the next step visible."],
  ["03", "Keep the useful parts."],
  ["04", "Let the system breathe."],
] as const;

export function CaseStudyCarousel({ theme }: { theme: ProjectTheme }) {
  const [active, setActive] = useState(0);

  return (
    <section className={`case-carousel case-carousel--${theme}`} aria-label="Concept directions">
      <div className="case-carousel__header">
        <span className="case-kicker">A few directions</span>
        <span>{String(active + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span>
      </div>
      <div className="case-carousel__viewport" aria-live="polite">
        {slides.map(([number, title], index) => (
          <div className={`case-carousel__slide ${active === index ? "is-active" : ""}`} aria-hidden={active !== index} key={number}>
            <span>{number} / placeholder direction</span>
            <strong>{title}</strong>
            <em>visual study / replace with project work</em>
          </div>
        ))}
      </div>
      <div className="case-carousel__controls" aria-label="Carousel progress">
        {slides.map(([number], index) => (
          <button
            type="button"
            className={active === index ? "is-active" : undefined}
            aria-label={`Go to slide ${index + 1}`}
            aria-pressed={active === index}
            onClick={() => setActive(index)}
            data-cuelume-toggle="pulse"
            key={number}
          >
            <span>{number}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
