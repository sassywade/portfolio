"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./photography.module.css";

// Preserve each slot's proportions when replacing placeholders with photographs.
const photographs = [
  0.8, 1.5, 1, 0.67, 1.25, 0.8, 1.5, 0.75,
  1, 1.5, 0.67, 1.25, 0.8, 1, 1.5, 0.75,
  1.25, 0.67, 1, 1.5, 0.8, 1.25, 0.75, 1,
].map((ratio, index) => ({ id: index + 1, ratio }));

export function PhotographyGallery() {
  const [selected, setSelected] = useState<(typeof photographs)[number] | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const animateRef = useRef(true);
  const closeRef = useRef<(immediate?: boolean) => void>(() => {});

  useLayoutEffect(() => {
    if (!selected) return;
    const dialog = dialogRef.current!;
    const image = imageRef.current!;
    const trigger = triggerRef.current!;
    const origin = trigger.getBoundingClientRect();
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

  return (
    <>
      <div className={styles.gallery}>
        {photographs.map((photo) => (
          <button
            key={photo.id}
            className={styles.photo}
            style={{ aspectRatio: photo.ratio, visibility: selected?.id === photo.id ? "hidden" : undefined }}
            aria-label={`Open photograph ${photo.id} (placeholder)`}
            aria-haspopup="dialog"
            onClick={(event) => {
              triggerRef.current = event.currentTarget;
              animateRef.current = event.detail !== 0;
              setSelected(photo);
            }}
          />
        ))}
      </div>
      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-label={selected ? `Photograph ${selected.id} (placeholder)` : "Photograph"}
        onCancel={(event) => { event.preventDefault(); closeRef.current(true); }}
        onClose={() => setSelected(null)}
      >
        <div ref={backdropRef} className={styles.backdrop} aria-hidden="true" />
        <button className={styles.dismiss} tabIndex={-1} aria-label="Close photograph" onClick={(event) => closeRef.current(event.detail === 0)} />
        {selected && (
          <div
            ref={imageRef}
            className={styles.focusedPhoto}
            style={{ "--photo-ratio": selected.ratio } as CSSProperties}
            role="img"
            aria-label={`Photograph ${selected.id} placeholder`}
          />
        )}
        <button ref={closeButtonRef} className={styles.close} onClick={(event) => closeRef.current(event.detail === 0)}>Close</button>
      </dialog>
    </>
  );
}
