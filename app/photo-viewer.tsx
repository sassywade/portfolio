"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./photography/photography.module.css";

type ViewerPhoto = { id: string | number; ratio: number; label: string; src?: string; frame?: "film" };

export function usePhotoViewer() {
  const [selected, setSelected] = useState<ViewerPhoto | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const originRef = useRef<HTMLElement | null>(null);
  const animateRef = useRef(true);
  const closeRef = useRef<(immediate?: boolean) => void>(() => {});

  useLayoutEffect(() => {
    if (!selected) return;
    const dialog = dialogRef.current!;
    const image = imageRef.current!;
    const trigger = triggerRef.current!;
    const origin = (originRef.current ?? trigger).getBoundingClientRect();
    const oldOverflow = document.body.style.overflow;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    document.body.style.overflow = "hidden";
    dialog.showModal();
    closeButtonRef.current?.focus({ preventScroll: true });
    const destination = image.getBoundingClientRect();
    const ease = getComputedStyle(image).getPropertyValue("--motion-ease-in-out").trim();
    const animations = animateRef.current && !reduced.matches ? [
      image.animate([
        { transform: `translate(${origin.left - destination.left}px, ${origin.top - destination.top}px) scale(${origin.width / destination.width}, ${origin.height / destination.height})` },
        { transform: "translate(0, 0) scale(1)" },
      ], { duration: 280, easing: ease, fill: "both" }),
      backdropRef.current!.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 280, fill: "both" }),
    ] : [];
    let closing = false;
    closeRef.current = (immediate = false) => {
      if (immediate || reduced.matches || !animations.length) {
        dialog.close();
        setSelected(null);
        return;
      }
      if (closing) return;
      closing = true;
      // Reverse from the current position, even when dismissed during the entrance.
      animations.forEach((animation) => animation.reverse());
      void Promise.all(animations.map((animation) => animation.finished)).then(() => {
        dialog.close();
        setSelected(null);
      }).catch(() => {}); // Cleanup cancels animations on navigation or resize.
    };
    const reset = () => closeRef.current(true);
    window.addEventListener("resize", reset);
    reduced.addEventListener("change", reset);
    return () => {
      animations.forEach((animation) => animation.cancel());
      window.removeEventListener("resize", reset);
      reduced.removeEventListener("change", reset);
      dialog.close();
      document.body.style.overflow = oldOverflow;
      trigger.focus({ preventScroll: true });
    };
  }, [selected]);
  
  const openPhoto = (photo: ViewerPhoto, trigger: HTMLButtonElement, animate: boolean, origin?: HTMLElement) => {
    triggerRef.current = trigger;
    originRef.current = origin ?? trigger;
    animateRef.current = animate;
    setSelected(photo);
  };
  const viewer = (
      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-label={selected?.label ?? "Photograph"}
        onCancel={(event) => { event.preventDefault(); closeRef.current(true); }}
        onClose={() => setSelected(null)}
      >
        <div ref={backdropRef} className={styles.backdrop} aria-hidden="true" />
        <button className={styles.dismiss} tabIndex={-1} aria-label="Close photograph" onClick={(event) => closeRef.current(event.detail === 0)} />
        {selected && (
          <div
            ref={imageRef}
            className={`${styles.focusedPhoto}${selected.frame === "film" ? ` ${styles.focusedPhotoFilm}` : ""}`}
            style={{ "--photo-ratio": selected.ratio } as CSSProperties}
            role={selected.src ? undefined : "img"}
            aria-label={selected.src ? undefined : selected.label}
          >
            {selected.src && (
              <span className={selected.frame === "film" ? styles.focusedPhotoFilmImage : undefined}>
                <Image src={selected.src} alt={selected.label} fill sizes="100vw" unoptimized priority draggable={false} style={{ objectFit: "contain" }} />
              </span>
            )}
          </div>
        )}
        <button ref={closeButtonRef} className={styles.close} onClick={(event) => closeRef.current(event.detail === 0)}>Close</button>
      </dialog>
  );
  return { openPhoto, viewer, selectedId: selected?.id };
}
