"use client";

import { useEffect, useState } from "react";

export function WorkNav({ items }: { items: { slug: string; title: string }[] }) {
  const [active, setActive] = useState(items[0]?.slug);

  useEffect(() => {
    const sections = items.map(({ slug }) => document.getElementById(`work-${slug}`));
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setActive(entry.target.id.replace("work-", ""));
      }
    }, { rootMargin: "-20% 0px -65% 0px", threshold: 0 });
    sections.forEach((section) => section && observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  return (
    <aside className="work-editorial__rail">
      <nav className="work-section-nav" aria-label="Selected work">
        {items.map(({ slug, title }) => (
          <a key={slug} href={`#work-${slug}`} aria-current={active === slug ? "location" : undefined}>
            {title}
          </a>
        ))}
      </nav>
    </aside>
  );
}
