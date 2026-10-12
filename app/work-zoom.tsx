"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./work-zoom.module.css";

const focusable = "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])";

// The live tile scales in place, so videos, card motion, and the Before/After toggle keep working.
export function WorkZoom() {
  const [label, setLabel] = useState<string | null>(null);
  const target = useRef<{ piece: HTMLElement; trigger: HTMLElement } | null>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<(immediate?: boolean) => void>(() => {});

  useEffect(() => {
    const setOpened = (next: { piece: HTMLElement; trigger: HTMLElement }) => {
      target.current = next;
      setLabel(next.piece.getAttribute("aria-label")?.replace(/^Enlarge /, "") ?? "Work");
    };
    // Capture runs before React updates aria-pressed for the Before/After toggle.
    const onClick = (event: MouseEvent) => {
      if (document.documentElement.dataset.workZoom || !(event.target instanceof Element)) return;
      const node = event.target.closest<HTMLElement>("[data-work-zoom]");
      const control = event.target.closest<HTMLElement>("a, button, input");
      // Inner controls keep their own job; the screen already shown opens the larger view.
      if (!node || (control && node.contains(control) && control.getAttribute("aria-pressed") !== "true")) return;
      setOpened({ piece: node, trigger: control && node.contains(control) ? control : node });
    };
    const onKeyDown = (event: KeyboardEvent) => {
      const node = event.target instanceof HTMLElement ? event.target : null;
      if (!node?.matches("[data-work-zoom][role='button']") || (event.key !== "Enter" && event.key !== " ")) return;
      event.preventDefault();
      setOpened({ piece: node, trigger: node });
    };
    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useLayoutEffect(() => {
    if (label === null || !target.current) return;
    const { piece, trigger } = target.current;
    const root = document.documentElement;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const oldOverflow = document.body.style.overflow;
    root.dataset.workZoom = "open";
    piece.dataset.workZoomed = "true";
    document.body.style.overflow = "hidden";
    close.current?.focus({ preventScroll: true });

    const bounds = piece.getBoundingClientRect();
    const compact = innerWidth <= 700;
    const sideRoom = compact ? 16 : 48;
    const topRoom = compact ? 72 : 88;
    const scale = Math.min((innerWidth - sideRoom * 2) / bounds.width, (innerHeight - topRoom * 2) / bounds.height);
    const x = innerWidth / 2 - (bounds.left + bounds.width / 2);
    const y = innerHeight / 2 - (bounds.top + bounds.height / 2);
    const radius = parseFloat(getComputedStyle(piece).borderTopLeftRadius) || 0;
    const ease = getComputedStyle(piece).getPropertyValue("--motion-ease-in-out").trim() || "ease";
    const motion = !reduced.matches;
    const animations = [
      piece.animate([
        { transform: "none", borderRadius: `${radius}px` },
        { transform: `translate(${x}px, ${y}px) scale(${scale})`, borderRadius: `${radius / scale}px` },
      ], { duration: motion ? 300 : 0, easing: ease, fill: "both" }),
      backdrop.current!.animate([{ opacity: 0 }, { opacity: 1 }], { duration: motion ? 300 : 0, fill: "both" }),
    ];

    let closing = false;
    const finish = () => {
      animations.forEach((animation) => animation.cancel());
      delete root.dataset.workZoom;
      delete piece.dataset.workZoomed;
      document.body.style.overflow = oldOverflow;
      trigger.focus({ preventScroll: true });
      target.current = null;
      setLabel(null);
    };
    closeRef.current = (immediate = false) => {
      if (immediate || !motion) return finish();
      if (closing) return;
      closing = true;
      animations.forEach((animation) => animation.reverse());
      void Promise.all(animations.map((animation) => animation.finished)).then(finish).catch(() => {});
    };

    const onClick = (event: MouseEvent) => {
      const clicked = event.target as Element;
      if (clicked.closest(`.${styles.close}`)) return;
      const control = clicked.closest("a, button, input");
      if (control && piece.contains(control) && control.getAttribute("aria-pressed") !== "true") return;
      if (piece.contains(clicked) || clicked === backdrop.current) closeRef.current(event.detail === 0);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current(false);
      } else if (event.key === "Tab") {
        const stops = [close.current!, ...(piece.matches(focusable) ? [piece] : []), ...piece.querySelectorAll<HTMLElement>(focusable)];
        const index = stops.indexOf(document.activeElement as HTMLElement);
        event.preventDefault();
        stops[(index + (event.shiftKey ? -1 : 1) + stops.length) % stops.length].focus({ preventScroll: true });
      } else if ((event.key === "Enter" || event.key === " ") && document.activeElement === piece) {
        event.preventDefault();
        closeRef.current(false);
      }
    };
    const reset = () => closeRef.current(true);
    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKeyDown, true);
    addEventListener("resize", reset);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("keydown", onKeyDown, true);
      removeEventListener("resize", reset);
      if (root.dataset.workZoom) {
        animations.forEach((animation) => animation.cancel());
        delete root.dataset.workZoom;
        delete piece.dataset.workZoomed;
        document.body.style.overflow = oldOverflow;
      }
    };
  }, [label]);

  return (
    <div className={styles.layer} role="dialog" aria-label={label ?? "Work"} hidden={label === null}>
      <div ref={backdrop} className={styles.backdrop} />
      <button ref={close} type="button" className={styles.close} onClick={(event) => closeRef.current(event.detail === 0)}>Close</button>
    </div>
  );
}
