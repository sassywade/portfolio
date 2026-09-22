"use client";

import { useEffect } from "react";

/** One desktop wheel gesture per project; touch and tall sections remain native. */
export function WorkScroll() {
  useEffect(() => {
    const root = document.documentElement;
    const sections = Array.from(document.querySelectorAll<HTMLElement>(".work-feature"));
    const work = document.getElementById("work");
    if (!work || !sections.length) return;
    const desktop = window.matchMedia("(min-width: 1080px) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lastWheel = 0;
    let direction = 0;
    let accumulated = 0;
    let consumed = false;
    let movingUntil = 0;

    let scrollFrame = 0;
    const stopScroll = () => {
      cancelAnimationFrame(scrollFrame);
      scrollFrame = 0;
      movingUntil = 0;
      consumed = false;
    };
    // Match the calm drawer curve: cubic-bezier(0.32, 0.72, 0, 1).
    const easeScroll = (progress: number) => {
      const cubic = (t: number, a: number, b: number) => 3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t * t * b + t ** 3;
      let low = 0;
      let high = 1;
      for (let i = 0; i < 14; i++) {
        const t = (low + high) / 2;
        if (cubic(t, 0.32, 0) < progress) low = t;
        else high = t;
      }
      return cubic((low + high) / 2, 0.72, 1);
    };
    const center = (section: HTMLElement) => {
      const rect = section.getBoundingClientRect();
      return window.scrollY + rect.top - Math.max(32, (window.innerHeight - rect.height) / 2);
    };
    const fits = (section: HTMLElement) => section.offsetHeight <= window.innerHeight - 64;
    const settle = (section: HTMLElement, smooth: boolean) => {
      cancelAnimationFrame(scrollFrame);
      const from = window.scrollY;
      const to = center(section);
      if (!smooth || reduced.matches) {
        window.scrollTo({ top: to, behavior: "instant" });
        return;
      }
      const started = performance.now();
      const duration = 850;
      const step = (now: number) => {
        const progress = Math.min(1, (now - started) / duration);
        window.scrollTo({ top: progress === 1 ? to : from + (to - from) * easeScroll(progress), behavior: "instant" });
        scrollFrame = progress < 1 ? requestAnimationFrame(step) : 0;
      };
      scrollFrame = requestAnimationFrame(step);
    };
    const nestedScroll = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return true;
      if (target.closest('dialog, [role="dialog"], input, textarea, select, [contenteditable="true"], .meadow-settings__panel')) return true;
      for (let node: Element | null = target; node && node !== document.body; node = node.parentElement) {
        if (/(auto|scroll)/.test(getComputedStyle(node).overflowY) && node.scrollHeight > node.clientHeight + 1) return true;
      }
      return false;
    };
    const wheel = (event: WheelEvent) => {
      if (!desktop.matches || reduced.matches || event.ctrlKey || event.metaKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || nestedScroll(event.target)) return;
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1);
      if (!delta) return;
      const now = performance.now();
      const nextDirection = Math.sign(delta);
      const reversed = direction !== nextDirection;
      const newGesture = now - lastWheel > 180 && now > movingUntil;
      if (reversed) stopScroll();
      if (reversed || newGesture) { accumulated = 0; consumed = false; }
      direction = nextDirection;
      lastWheel = now;

      if (consumed) { event.preventDefault(); return; }
      const y = window.scrollY;
      const targets = sections.map(center);
      // The meadow and the space after the last project retain normal scrolling.
      if ((y < targets[0] - window.innerHeight * 0.45 && direction > 0) || (y <= targets[0] + 4 && direction < 0) || (y >= targets.at(-1)! - 4 && direction > 0)) return;
      const nearest = targets.reduce((best, value, index) => Math.abs(value - y) < Math.abs(targets[best] - y) ? index : best, 0);
      if (!fits(sections[nearest])) return;
      const targetIndex = direction > 0
        ? targets.findIndex((value) => value > y + 8)
        : targets.findLastIndex((value) => value < y - 8);
      if (targetIndex < 0 || !fits(sections[targetIndex])) return;
      event.preventDefault();
      accumulated += Math.abs(delta);
      if (accumulated < 32) return;
      consumed = true;
      movingUntil = now + 900;
      settle(sections[targetIndex], true);
    };
    const click = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('.work-section-nav a[href^="#work-"], .site-header a[href="#work"]') : null;
      if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const section = link.hash === "#work" ? sections[0] : document.getElementById(link.hash.slice(1));
      if (!section) return;
      event.preventDefault();
      history.pushState(null, "", link.hash);
      consumed = false;
      settle(section, event.detail > 0 && !reduced.matches);
      section.focus({ preventScroll: true });
    };
    const rail = document.querySelector<HTMLElement>(".work-section-nav");
    let currentSection = sections[0];
    const alignRail = () => {
      if (!rail) return;
      if (!desktop.matches) { rail.style.removeProperty("top"); return; }
      const heading = currentSection.querySelector<HTMLElement>(".work-feature__header");
      if (!heading) return;
      const top = Math.max(32, (window.innerHeight - currentSection.offsetHeight) / 2)
        + heading.offsetHeight + parseFloat(getComputedStyle(heading).marginBottom);
      rail.style.top = `${top}px`;
    };
    const resize = new ResizeObserver(alignRail);
    sections.forEach((section) => resize.observe(section));
    window.addEventListener("resize", alignRail);
    const syncMotion = () => {
      if (reduced.matches) stopScroll();
      root.dataset.workSnap = reduced.matches ? "off" : "on";
    };
    // Centered sections receive one calm entrance on each approach, in either direction.
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        (target as HTMLElement).dataset.inView = isIntersecting ? "true" : "false";
        if (isIntersecting) { currentSection = target as HTMLElement; alignRail(); }
      });
    }, { rootMargin: "-12% 0px -12% 0px", threshold: 0.3 });
    sections.forEach((section) => observer.observe(section));
    syncMotion();
    const initial = location.hash === "#work" ? sections[0] : sections.find((section) => `#${section.id}` === location.hash);
    const initialFrame = initial ? requestAnimationFrame(() => settle(initial, false)) : 0;
    reduced.addEventListener("change", syncMotion);
    window.addEventListener("wheel", wheel, { passive: false });
    document.addEventListener("click", click);
    window.addEventListener("keydown", stopScroll);
    window.addEventListener("pointerdown", stopScroll);
    window.addEventListener("touchstart", stopScroll, { passive: true });
    window.addEventListener("resize", stopScroll);
    return () => {
      cancelAnimationFrame(initialFrame);
      stopScroll();
      window.removeEventListener("keydown", stopScroll);
      window.removeEventListener("pointerdown", stopScroll);
      window.removeEventListener("touchstart", stopScroll);
      window.removeEventListener("resize", stopScroll);
      observer.disconnect();
      resize.disconnect();
      window.removeEventListener("resize", alignRail);
      rail?.style.removeProperty("top");
      sections.forEach((section) => delete section.dataset.inView);
      delete root.dataset.workSnap;
      reduced.removeEventListener("change", syncMotion);
      window.removeEventListener("wheel", wheel);
      document.removeEventListener("click", click);
    };
  }, []);
  return null;
}
