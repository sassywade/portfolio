"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import styles from "./photography/photography.module.css";

export type ViewerPhoto = { id: string | number; ratio: number; label: string; src?: string; thumbnail?: string; frame?: "film" };

function revealDecodedImage(image: HTMLImageElement) {
  void image.decode().then(() => {
    if (image.isConnected) image.dataset.ready = "true";
  }).catch(() => {}); // Keep the cached preview if the larger image cannot decode.
}

export function usePhotoViewer() {
  const [selected, setSelected] = useState<(ViewerPhoto & { previewSrc?: string }) | null>(null);
  const [sequence, setSequence] = useState<ViewerPhoto[]>([]);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const originRef = useRef<HTMLElement | null>(null);
  const animateRef = useRef(true);
  const touchOpenedRef = useRef(false);
  const navigatingRef = useRef(false);
  const originalOverflowRef = useRef<string | null>(null);
  const closeRef = useRef<(immediate?: boolean) => void>(() => {});

  const playKeyboardCloseCue = () => {
    const button = closeButtonRef.current;
    if (!button) return;
    const eventInit: PointerEventInit = { bubbles: true, cancelable: true, pointerType: "keyboard" };
    button.dispatchEvent(new PointerEvent("pointerdown", eventInit));
    button.dispatchEvent(new PointerEvent("pointerup", eventInit));
  };

  useLayoutEffect(() => {
    if (!selected) return;
    const dialog = dialogRef.current!;
    const image = imageRef.current!;
    const trigger = triggerRef.current;
    const navigating = navigatingRef.current;
    navigatingRef.current = false;
    const origin = (originRef.current ?? trigger ?? image).getBoundingClientRect();
    const oldOverflow = originalOverflowRef.current ?? document.body.style.overflow;
    if (!navigating) originalOverflowRef.current = oldOverflow;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    document.body.style.overflow = "hidden";
    if (!dialog.open) dialog.showModal();
    if (!navigating) {
      // A tap focuses the labelled dialog, keeping Close quiet. Keyboard users
      // still land on Close and retain its visible focus ring.
      const initialFocus = touchOpenedRef.current ? dialog : closeButtonRef.current;
      initialFocus?.focus({ preventScroll: true });
    }
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
      if (!navigatingRef.current) {
        dialog.close();
        document.body.style.overflow = oldOverflow;
        originalOverflowRef.current = null;
        if (trigger) trigger.focus({ preventScroll: true });
      }
    };
  }, [selected]);
  
  const openPhoto = (photo: ViewerPhoto, trigger: HTMLButtonElement, animate: boolean, origin?: HTMLElement, photos?: ViewerPhoto[]) => {
    triggerRef.current = trigger;
    originRef.current = origin ?? trigger;
    animateRef.current = animate;
    touchOpenedRef.current = animate && window.matchMedia("(hover: none), (pointer: coarse)").matches;
    setSequence(photos ?? [photo]);
    const thumbnail = trigger.querySelector("img");
    setSelected({ ...photo, previewSrc: thumbnail?.currentSrc || photo.thumbnail || photo.src });
  };
  const selectedIndex = selected ? sequence.findIndex((photo) => photo.id === selected.id) : -1;
  const showPhoto = (offset: -1 | 1) => {
    const next = sequence[selectedIndex + offset];
    if (!next) return;
    navigatingRef.current = true;
    triggerRef.current = null;
    originRef.current = null;
    animateRef.current = false;
    setSelected({ ...next, previewSrc: next.thumbnail || next.src });
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "ArrowLeft" && selectedIndex > 0) {
      event.preventDefault();
      showPhoto(-1);
    } else if (event.key === "ArrowRight" && selectedIndex >= 0 && selectedIndex < sequence.length - 1) {
      event.preventDefault();
      showPhoto(1);
    }
  };
  const viewer = (
      <dialog
        ref={dialogRef}
        className={styles.dialog}
        tabIndex={-1}
        data-touch-opened={touchOpenedRef.current ? "true" : undefined}
        aria-label={selected?.label ?? "Photograph"}
        onKeyDown={handleKeyDown}
        onCancel={(event) => { event.preventDefault(); playKeyboardCloseCue(); closeRef.current(false); }}
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
              <span
                className={`${styles.focusedPhotoMedia}${selected.frame === "film" ? ` ${styles.focusedPhotoFilmImage}` : ""}`}
                style={{ backgroundImage: selected.previewSrc ? `url(${JSON.stringify(selected.previewSrc)})` : undefined }}
              >
                <Image key={selected.src} src={selected.src} alt={selected.label} fill sizes="100vw" unoptimized priority draggable={false}
                  className={styles.focusedPhotoFull} style={{ objectFit: "contain" }}
                  ref={(node) => { if (node?.complete && node.naturalWidth > 0) revealDecodedImage(node); }}
                  onLoad={(event) => revealDecodedImage(event.currentTarget)} />
              </span>
            )}
          </div>
        )}
        <nav className={styles.navigation} aria-label="Browse photographs">
          <button type="button" className={styles.navigationButton} aria-label="Previous photograph" onClick={() => showPhoto(-1)} disabled={selectedIndex <= 0}>←</button>
          <button type="button" className={styles.navigationButton} aria-label="Next photograph" onClick={() => showPhoto(1)} disabled={selectedIndex < 0 || selectedIndex >= sequence.length - 1}>→</button>
        </nav>
        <button ref={closeButtonRef} className={styles.close} onClick={(event) => closeRef.current(event.detail === 0)}>Close</button>
      </dialog>
  );
  return { openPhoto, viewer, selectedId: selected?.id };
}
