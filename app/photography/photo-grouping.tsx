"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";

export type PhotoGrouping = "color" | "style" | "selected";
const eventName = "portfolio:photo-grouping";
const storageKey = "portfolio:photo-grouping";
function readGrouping(): PhotoGrouping {
  try {
    const saved = sessionStorage.getItem(storageKey);
    return saved === "style" || saved === "selected" ? saved : "color";
  }
  catch { return "color"; }
}
export function setPhotoGrouping(grouping: PhotoGrouping) {
  try { sessionStorage.setItem(storageKey, grouping); } catch { /* Still applies for this page. */ }
  window.dispatchEvent(new CustomEvent(eventName, { detail: grouping }));
}
export function usePhotoGrouping(beforeChange?: () => void) {
  const [grouping, setGrouping] = useState<PhotoGrouping>("color");
  useLayoutEffect(() => {
    // Restore the saved order before paint; only explicit changes should animate.
    const update = () => { setGrouping(readGrouping()); };
    update();
    const receive = (event: Event) => { beforeChange?.(); setGrouping((event as CustomEvent<PhotoGrouping>).detail); };
    window.addEventListener(eventName, receive);
    return () => window.removeEventListener(eventName, receive);
  }, [beforeChange]);
  return grouping;
}
export function PhotoGroupingOptions() {
  const grouping = usePhotoGrouping();
  return (
    <section className="meadow-settings__section" aria-label="Photo grouping">
      <h2>Photo grouping</h2>
      <div className="layout-prototype-options">
        {([['color', 'Color'], ['style', 'Photography style'], ['selected', 'Selected work']] as const).map(([value, label]) => (
          <button type="button" key={value} aria-pressed={grouping === value} onClick={() => setPhotoGrouping(value)}>{label}</button>
        ))}
      </div>
    </section>
  );
}
export function PhotoPrototypePicker() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); trigger.current?.focus(); } };
    const outside = (event: PointerEvent) => { if (!panel.current?.contains(event.target as Node) && !trigger.current?.contains(event.target as Node)) setOpen(false); };
    window.addEventListener('keydown', key);
    window.addEventListener('pointerdown', outside);
    return () => { window.removeEventListener('keydown', key); window.removeEventListener('pointerdown', outside); };
  }, [open]);
  return (
    <div className="meadow-settings" data-scene-visible="true">
      <button ref={trigger} className="meadow-settings__gear" type="button" aria-expanded={open} aria-controls={id} aria-label="Photo prototype settings" onClick={() => setOpen(!open)}><span aria-hidden="true">⚙</span></button>
      {open && <div ref={panel} className="meadow-settings__panel" id={id}>
        <div className="meadow-settings__head"><span>Photo settings</span><button className="meadow-settings__close" type="button" onClick={() => { setOpen(false); trigger.current?.focus(); }}>Close</button></div>
        <PhotoGroupingOptions />
      </div>}
    </div>
  );
}
