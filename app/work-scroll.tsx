"use client";

import { useEffect } from "react";

/** Native scrolling with calm, intensity-aware project centering. */
export function WorkScroll() {
  useEffect(() => {
    const root = document.documentElement;
    const sections = Array.from(document.querySelectorAll<HTMLElement>(".work-feature"));
    const work = document.getElementById("work");
    if (!work || !sections.length) return;
    const desktop = window.matchMedia("(min-width: 1080px) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let direction = 0;
    let gestureStart = 0;
    let lastWheelTime = 0;
    let peakSpeed = 0;
    let guideArmed = false;
    let heroLanding = false;
    let idleTimer = 0;
    let scrollFrame = 0;
    const HERO_SETTLE_DURATION = 900;
    const PROJECT_SETTLE_DURATION = 900;
    const stopScroll = () => {
      cancelAnimationFrame(scrollFrame);
      scrollFrame = 0;
      window.clearTimeout(idleTimer);
      guideArmed = false;
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
    const fits = (section: HTMLElement) => section.offsetHeight <= window.innerHeight - 64;
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
    const finishGesture = () => {
      if (!guideArmed || !desktop.matches || reduced.matches) return;
      guideArmed = false;
      const y = window.scrollY;
      const targets = sections.map(center);
      // Upward escape into the hero and downward escape past Work stay native.
      if ((direction < 0 && y < targets[0]) || (direction > 0 && y > targets[targets.length - 1])) return;
      const intensity = Math.min(1, peakSpeed / 2.5);
      const targetIndex = targets.findIndex((target, index) => {
        const distance = (target - y) * direction;
        if (distance <= 2 || !fits(sections[index])) return false;
        const previous = targets[index - direction];
        const gap = previous === undefined ? window.innerHeight : Math.abs(target - previous);
        // Gentle input may settle toward the next project; strong input keeps its
        // native travel so the user can intentionally move farther.
        const radius = Math.min(gap * (0.68 - intensity * 0.48), window.innerHeight * (0.72 - intensity * 0.52));
        const committed = previous !== undefined && intensity < 0.65
          && Math.abs(gestureStart - previous) <= 80
          && (y - gestureStart) * direction >= gap * 0.18;
        return distance <= radius || committed;
      });
      if (targetIndex >= 0) settle(sections[targetIndex], true, PROJECT_SETTLE_DURATION);
    };
    const scheduleGuide = () => {
      if (!guideArmed || scrollFrame) return;
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(finishGesture, 140);
    };
    const wheel = (event: WheelEvent) => {
      const eligible = desktop.matches && !reduced.matches && !event.ctrlKey && !event.metaKey
        && Math.abs(event.deltaY) > Math.abs(event.deltaX) && !nestedScroll(event.target);
      // Only the opening gesture is captured. Its momentum must not skip project one.
      const startsAtHome = window.scrollY <= 8 && center(sections[0]) > window.innerHeight * 0.5;
      if (eligible && event.cancelable && event.deltaY > 0 && (heroLanding || startsAtHome)) {
        event.preventDefault();
        if (!heroLanding) {
          stopScroll();
          heroLanding = true;
          settle(sections[0], true, HERO_SETTLE_DURATION);
        }
        window.clearTimeout(idleTimer);
        idleTimer = window.setTimeout(() => { heroLanding = false; }, 140);
        return;
      }
      // Reversals interrupt immediately. All wheel movement inside Work stays native.
      const now = performance.now();
      const nextDirection = Math.sign(event.deltaY);
      const newGesture = !guideArmed || nextDirection !== direction || now - lastWheelTime > 180;
      stopScroll();
      if (!desktop.matches || reduced.matches || event.ctrlKey || event.metaKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || nestedScroll(event.target)) return;
      if (!event.deltaY) return;
      const delta = Math.abs(event.deltaY) * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1);
      if (newGesture) { gestureStart = window.scrollY; peakSpeed = 0; }
      peakSpeed = Math.max(peakSpeed, delta / (newGesture ? 16 : Math.max(16, now - lastWheelTime)));
      lastWheelTime = now;
      direction = nextDirection;
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
    window.addEventListener("wheel", wheel, { passive: false });
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
