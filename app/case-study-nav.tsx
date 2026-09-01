import Link from "next/link";
import type { Project } from "./projects";

export function CaseStudyNav({ items, activeSlug }: { items: Project[]; activeSlug: string }) {
  return (
    <aside className="case-study-nav" aria-label="Case studies">
      <Link className="case-study-nav__back" href="/#work">
        <span aria-hidden="true">←</span>
        Back to work
      </Link>

      <div className="case-study-nav__heading">
        <span>Selected work</span>
        <span>{String(items.length).padStart(2, "0")} studies</span>
      </div>

      <div className="case-study-nav__items">
        {items.map((item) => {
          const isActive = item.slug === activeSlug;
          return (
            <Link
              href={`/case-studies/${item.slug}`}
              className={isActive ? "is-active" : undefined}
              aria-current={isActive ? "page" : undefined}
              key={item.slug}
            >
              <span>{item.number}</span>
              <strong>{item.title}</strong>
              <i aria-hidden="true">↗</i>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
