/* Vinext's client-side Link shim can swallow these route clicks. */
/* eslint-disable @next/next/no-html-link-for-pages */

import type { Project } from "./projects";

export function CaseStudyNav({ items, activeSlug }: { items: Project[]; activeSlug: string }) {
  return (
    <aside className="case-study-nav" aria-label="Case studies">
      <a className="case-study-nav__back" href="/#work">
        <span aria-hidden="true">←</span>
        Back to work
      </a>

      <div className="case-study-nav__heading">
        <span>Selected work</span>
        <span>{String(items.length).padStart(2, "0")} studies</span>
      </div>

      <div className="case-study-nav__items">
        {items.map((item) => {
          const isActive = item.slug === activeSlug;
          return (
            <a
              href={`/case-studies/${item.slug}`}
              className={isActive ? "is-active" : undefined}
              aria-current={isActive ? "page" : undefined}
              key={item.slug}
            >
              <span>{item.number}</span>
              <strong>{item.title}</strong>
              <i aria-hidden="true">↗</i>
            </a>
          );
        })}
      </div>
    </aside>
  );
}
