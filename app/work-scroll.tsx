"use client";

import { useEffect } from "react";

/** Native scrolling with a small, interruptible centering assist after a pause. */
export function WorkScroll() {
  useEffect(() => {
    const root = document.documentElement;
    const sections = Array.from(document.querySelectorAll<HTMLElement>(".work-feature"));
    const work = document.getElementById("work");
    if (!work || !sections.length) return;
    const desktop = window.matchMedia("(min-width: 1080px) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let direction = 0;
    let guideArmed = false;
    let idleTimer = 0;
    let scrollFrame = 0;
    const stopScroll = () => {
      cancelAnimationFrame(scrollFrame);
      scrollFrame = 0;
      window.clearTimeout(idleTimer);
      guideArmed = false;
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
    const settle = (section: HTMLElement, smooth: boolean, duration = 450) => {
      cancelAnimationFrame(scrollFrame);
      const from = window.scrollY;
      const to = center(section);
      if (!smooth || reduced.matches) {
        window.scrollTo({ top: to, behavior: "instant" });
        return;
      }
      const started = performance.now();
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
    const finishGesture = () => {
      if (!guideArmed || !desktop.matches || reduced.matches) return;
      guideArmed = false;
      const y = window.scrollY;
      const targets = sections.map(center);
      // Never pull an upward gesture back into Work, or catch the page ending.
      if (y < targets[0] || y > targets[targets.length - 1]) return;
      const radius = Math.min(120, window.innerHeight * 0.14);
      const targetIndex = targets.findIndex((target, index) => {
        const distance = (target - y) * direction;
        return distance > 2 && distance <= radius && fits(sections[index]);
      });
      if (targetIndex >= 0) settle(sections[targetIndex], true, 250);
    };
    const scheduleGuide = () => {
      if (!guideArmed || scrollFrame) return;
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(finishGesture, 180);
    };
    const wheel = (event: WheelEvent) => {
      // Every new input interrupts scripted navigation; the browser owns all wheel movement.
      stopScroll();
      if (!desktop.matches || reduced.matches || event.ctrlKey || event.metaKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || nestedScroll(event.target)) return;
      if (!event.deltaY) return;
      direction = Math.sign(event.deltaY);
      guideArmed = true;
      scheduleGuide();
    };
    const click = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('.work-section-nav a[href^="#work-"], .site-header a[href="#work"]') : null;
      if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const section = link.hash === "#work" ? sections[0] : document.getElementById(link.hash.slice(1));
      if (!section) return;
      event.preventDefault();
      history.pushState(null, "", link.hash);
      stopScroll();
      settle(section, event.detail > 0 && !reduced.matches);
      section.focus({ preventScroll: true });
    };
    const syncMotion = () => {
      stopScroll();
      root.dataset.workSnap = reduced.matches ? "off" : "on";
    };
    syncMotion();
    const initial = location.hash === "#work" ? sections[0] : sections.find((section) => `#${section.id}` === location.hash);
    const initialFrame = initial ? requestAnimationFrame(() => settle(initial, false)) : 0;
    reduced.addEventListener("change", syncMotion);
    window.addEventListener("wheel", wheel, { passive: true });
    window.addEventListener("scroll", scheduleGuide, { passive: true });
    desktop.addEventListener("change", syncMotion);
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
      delete root.dataset.workSnap;
      reduced.removeEventListener("change", syncMotion);
      window.removeEventListener("wheel", wheel);
      window.removeEventListener("scroll", scheduleGuide);
      desktop.removeEventListener("change", syncMotion);
      document.removeEventListener("click", click);
    };
  }, []);
  return null;
}
