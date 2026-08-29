"use client";

import { useEffect, useState } from "react";

type NavItem = { id: string; label: string };

export function CaseStudyNav({ items }: { items: NavItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => Boolean(section));
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-18% 0px -65% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="case-study-nav" aria-label="Case study sections">
      <span className="case-study-nav__label">On this page</span>
      <div className="case-study-nav__items">
        {items.map((item, index) => (
          <a
            href={`#${item.id}`}
            className={active === item.id ? "is-active" : ""}
            aria-current={active === item.id ? "location" : undefined}
            data-cuelume-toggle="page"
            key={item.id}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
