"use client";

import { useEffect } from "react";

/** Assist the intentional hero-to-Work handoff while keeping Work natively scrollable. */
export function WorkScroll() {
  useEffect(() => {
    const root = document.documentElement;
    const sections = Array.from(document.querySelectorAll<HTMLElement>(".work-feature"));
    const work = document.getElementById("work");
    if (!work || !sections.length) return;
    const desktop = window.matchMedia("(min-width: 1080px) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let heroLanding = false;
    let idleTimer = 0;
    let scrollFrame = 0;
    const HERO_SETTLE_DURATION = 900;
    const stopScroll = () => {
      cancelAnimationFrame(scrollFrame);
      scrollFrame = 0;
      window.clearTimeout(idleTimer);
      heroLanding = false;
    };
    // Use a calm ease-in-out curve: cubic-bezier(0.77, 0, 0.175, 1).
    const easeScroll = (progress: number) => {
      const cubic = (t: number, a: number, b: number) => 3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t * t * b + t ** 3;
      let low = 0;
      let high = 1;
      for (let i = 0; i < 14; i++) {
        const t = (low + high) / 2;
        if (cubic(t, 0.77, 0.175) < progress) low = t;
        else high = t;
      }
      return cubic((low + high) / 2, 0, 1);
    };
    const center = (section: HTMLElement) => {
      const rect = section.getBoundingClientRect();
      return window.scrollY + rect.top - Math.max(32, (window.innerHeight - rect.height) / 2);
    };
    const settle = (section: HTMLElement, smooth: boolean, duration = 560) => {
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
    // Touch scrolling is fully native. No touch listener captures or prevents a swipe,
    // so a phone follows the finger from the hero into Work without a scripted jump.
    const wheel = (event: WheelEvent) => {
      const eligible = desktop.matches && !reduced.matches && !event.ctrlKey && !event.metaKey
        && Math.abs(event.deltaY) > Math.abs(event.deltaX) && !nestedScroll(event.target);
      // Only the intentional opening gesture is captured. Its momentum stays inside
      // the same handoff, while every wheel event in Work remains native.
      const startsAtHome = window.scrollY <= 8 && center(sections[0]) > window.innerHeight * 0.5;
      if (eligible && event.deltaY > 0 && (heroLanding || startsAtHome || scrollFrame)) {
        if (event.cancelable) event.preventDefault();
        if (!heroLanding && !scrollFrame) {
          if (!event.cancelable) return;
          stopScroll();
          heroLanding = true;
          settle(sections[0], true, HERO_SETTLE_DURATION);
        }
        window.clearTimeout(idleTimer);
        idleTimer = window.setTimeout(() => { heroLanding = false; }, 140);
        return;
      }
      // Reversals and all normal Work scrolling stay native.
      stopScroll();
      if (!desktop.matches || reduced.matches || event.ctrlKey || event.metaKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || nestedScroll(event.target)) return;
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
    window.addEventListener("wheel", wheel, { passive: false });
    desktop.addEventListener("change", syncMotion);
    document.addEventListener("click", click);
    window.addEventListener("keydown", stopScroll);
    window.addEventListener("pointerdown", stopScroll);
    window.addEventListener("resize", stopScroll);
    return () => {
      cancelAnimationFrame(initialFrame);
      stopScroll();
      window.removeEventListener("keydown", stopScroll);
      window.removeEventListener("pointerdown", stopScroll);
      window.removeEventListener("resize", stopScroll);
      delete root.dataset.workSnap;
      reduced.removeEventListener("change", syncMotion);
      window.removeEventListener("wheel", wheel);
      desktop.removeEventListener("change", syncMotion);
      document.removeEventListener("click", click);
    };
  }, []);
  return null;
}
