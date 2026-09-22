"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

export function WorkNav({ items }: { items: { slug: string; title: string }[] }) {
  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(items[0]?.slug);

  useLayoutEffect(() => {
    const nav = navRef.current;
    const indicator = indicatorRef.current;
    if (!nav || !indicator) return;
    const position = () => {
      const link = nav.querySelector<HTMLAnchorElement>("a[aria-current]");
      if (!link) return;
      const y = link.offsetTop + parseFloat(getComputedStyle(link).fontSize) * 0.55;
      indicator.style.transform = `translate3d(${link.offsetLeft}px, ${y}px, 0)`;
      indicator.dataset.positioned = "true";
    };
    position();
    const resize = new ResizeObserver(position);
    resize.observe(nav);
    nav.querySelectorAll("a").forEach((link) => resize.observe(link));
    return () => resize.disconnect();
  }, [active]);

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

  useEffect(() => {
    const nav = navRef.current;
    const firstMedia = document.querySelector(".work-feature__media");
    if (!nav || !firstMedia) return;

    // Deep links remain immediately usable, even beyond the first project.
    if (firstMedia.getBoundingClientRect().top <= window.innerHeight * 0.55) return;
    nav.dataset.revealReady = "true";
    const entrance = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      nav.dataset.revealed = "true";
      entrance.disconnect();
    }, { rootMargin: "0px 0px -45% 0px", threshold: 0 });
    entrance.observe(firstMedia);
    return () => entrance.disconnect();
  }, []);

  return (
    <aside className="work-editorial__rail">
      <nav ref={navRef} className="work-section-nav" aria-label="Selected work">
        {items.map(({ slug, title }) => (
          <a key={slug} href={`#work-${slug}`} aria-current={active === slug ? "location" : undefined}>
            {title}
          </a>
        ))}
        <span ref={indicatorRef} className="work-section-nav__dot" aria-hidden="true" />
      </nav>
    </aside>
  );
}
