"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { usePhotoViewer } from "../photo-viewer";
import photographs from "./photos.json";
import { clusterPhotos, masonryLayout, matchesPhoto } from "./gallery-model.mjs";
import { PhotoPrototypePicker, PhotoSort, usePhotoGrouping } from "./photo-grouping";
import styles from "./photography.module.css";
import { SearchPrompt } from "./search-prompt";
import { photoFallDuration, photoGatherDelay, schedulePhotoSearch } from "./search-motion.mjs";

type Snapshot = { left: number; top: number; width: number; height: number; opacity: string; rotation: number };

export function PhotographyGallery() {
  const { openPhoto, viewer, selectedId } = usePhotoViewer();
  const [query, setQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [composing, setComposing] = useState(false);
  const [measure, setMeasure] = useState({ width: 0, columns: 5, gap: 40 });
  const gallery = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const cards = useRef(new Map<string, HTMLButtonElement>());
  const snapshots = useRef(new Map<string, Snapshot>());
  const animations = useRef<Animation[]>([]);
  const capturedHeight = useRef(0);
  const previousVisible = useRef(new Set(photographs.map((photo) => photo.id)));
  const reduced = useRef(false);

  const capture = useCallback(() => {
    snapshots.current.clear();
    capturedHeight.current = gallery.current!.offsetHeight;
    const bounds = gallery.current!.getBoundingClientRect();
    cards.current.forEach((node, id) => {
      const css = getComputedStyle(node);
      const transform = new DOMMatrixReadOnly(css.transform === 'none' ? undefined : css.transform);
      // Keep the current translation and rotation when a new query interrupts a fall.
      snapshots.current.set(id, {
        left: bounds.left + node.offsetLeft + transform.m41,
        top: bounds.top + node.offsetTop + transform.m42,
        width: node.offsetWidth, height: node.offsetHeight, opacity: css.opacity,
        rotation: Math.atan2(transform.m12, transform.m11) * 180 / Math.PI,
      });
    });
  }, []);

  const grouping = usePhotoGrouping(capture);

  useLayoutEffect(() => {
    const node = gallery.current!;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => { reduced.current = preference.matches; animations.current.forEach((animation) => animation.cancel()); };
    updatePreference();
    preference.addEventListener('change', updatePreference);
    let lastMeasurement = "";
    const resize = () => {
      const css = getComputedStyle(node);
      const next = { width: node.clientWidth, columns: Number(css.getPropertyValue('--columns')), gap: parseFloat(css.columnGap) };
      const key = `${next.width}:${next.columns}:${next.gap}`;
      if (key === lastMeasurement) return;
      lastMeasurement = key;
      snapshots.current.clear();
      animations.current.forEach((animation) => animation.cancel());
      setMeasure((current) => current.width === next.width && current.columns === next.columns && current.gap === next.gap ? current : next);
    };
    resize();
    let resizeFrame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(resize);
    });
    observer.observe(node);
    return () => { cancelAnimationFrame(resizeFrame); observer.disconnect(); preference.removeEventListener('change', updatePreference); animations.current.forEach((animation) => animation.cancel()); };
  }, []);

  useEffect(() => {
    if (composing || query === appliedQuery) return;
    return schedulePhotoSearch(
      () => { capture(); setAppliedQuery(query); },
      () => Promise.all(animations.current.map((animation) => animation.finished.catch(() => {}))),
    );
  }, [query, appliedQuery, composing, capture]);

  const ordered = useMemo(() => clusterPhotos(photographs, grouping), [grouping]);
  const matching = useMemo(() => ordered.filter((photo) => matchesPhoto(photo, appliedQuery)), [ordered, appliedQuery]);
  const visible = useMemo(() => new Set<string>(matching.map((photo) => photo.id)), [matching]);
  const fullLayout = useMemo(() => masonryLayout(ordered, measure.width, measure.columns, measure.gap), [ordered, measure]);
  const layout = useMemo(() => masonryLayout(matching, measure.width, measure.columns, measure.gap), [matching, measure]);

  useLayoutEffect(() => {
    animations.current.forEach((animation) => animation.cancel());
    animations.current = [];
    const node = gallery.current!;
    const targetHeight = Math.max(layout.height, visible.size ? 0 : 120);
    let cancelled = false;
    if (measure.width && !reduced.current && snapshots.current.size) {
      const bounds = gallery.current!.getBoundingClientRect();
      const easing = getComputedStyle(gallery.current!).getPropertyValue('--motion-ease-in-out').trim();
      const gatherDelay = photoGatherDelay(snapshots.current, visible, innerHeight);
      // Keep the page from collapsing and clipping the departing photos mid-fall.
      node.style.height = `${Math.max(capturedHeight.current, targetHeight)}px`;
      cards.current.forEach((node, id) => {
        const old = snapshots.current.get(id);
        if (!old) return;
        const destination = (layout.positions.get(id) ?? fullLayout.positions.get(id))!;
        const dx = old.left - bounds.left - destination.x;
        const dy = old.top - bounds.top - destination.y;
        const onscreen = old.top < innerHeight + 120 && old.top + old.height > -120;
        const enteringScreen = bounds.top + destination.y < innerHeight && bounds.top + destination.y + destination.height > 0;
        if (visible.has(id) && (onscreen || enteringScreen)) {
          const returning = !previousVisible.current.has(id);
          const emerging = !onscreen || (returning && Number(old.opacity) < 0.05);
          const start = emerging ? `translate(0px, 72px) rotate(0deg)` : `translate(${dx}px, ${dy}px) rotate(${old.rotation}deg)`;
          const animation = node.animate([
            { transform: start, opacity: emerging ? 0 : old.opacity },
            { transform: 'translate(0px, 0px) rotate(0deg)', opacity: 1 },
          ], { duration: 600, delay: gatherDelay, easing, fill: 'both' });
          animations.current.push(animation);
        } else if (!visible.has(id) && Number(old.opacity) > 0.01 && onscreen) {
          const distance = Math.max(440, innerHeight - old.top + old.height * 1.5);
          const tilt = (Number(id) % 2 ? 1 : -1) * (22 + Number(id) % 3 * 4);
          // A sampled parabola gives the drop acceleration; only transforms and opacity animate.
          const frames = [0, 0.2, 0.4, 0.6, 0.8, 1].map((t) => ({
            offset: t,
            transform: `translate(${dx + tilt * t * t * 3}px, ${dy + distance * t * t}px) rotate(${old.rotation + tilt * t * t}deg)`,
            opacity: Number(old.opacity) * (t <= 0.6 ? 1 : (1 - t) / 0.4),
          }));
          animations.current.push(node.animate(frames, { duration: photoFallDuration(id), easing: 'linear', fill: 'both' }));
        }
      });
    }
    Promise.all(animations.current.map((animation) => animation.finished.catch(() => {}))).then(() => {
      if (!cancelled) node.style.height = `${targetHeight}px`;
    });
    previousVisible.current = visible;
    snapshots.current.clear();
    return () => { cancelled = true; };
  }, [layout, fullLayout, visible, measure.width]);

  return (
    <>
      <div className={styles.search} role="search" data-empty={!query} data-viewing={!!selectedId}>
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>
        <div className={styles.searchField}>
          <SearchPrompt />
          <input ref={input} type="search" aria-label="Search photos" placeholder="type “bikes”" value={query} autoComplete="off" spellCheck={false}
            onChange={(event) => setQuery(event.target.value)} onCompositionStart={() => setComposing(true)} onCompositionEnd={() => setComposing(false)}
            onKeyDown={(event) => { if (event.key === 'Escape') { setQuery(''); capture(); setAppliedQuery(''); } }} />
        </div>
        {query && <button type="button" aria-label="Clear search" onClick={() => { setQuery(''); capture(); setAppliedQuery(''); input.current?.focus(); }}>Clear</button>}
        <PhotoSort />
      </div>
      <p className="sr-only" role="status" aria-live="polite">{matching.length} {matching.length === 1 ? 'photo' : 'photos'}{appliedQuery ? ` matching ${appliedQuery}` : ''}</p>
      {!matching.length && <p className={styles.empty}>nothin bout that</p>}
      <div ref={gallery} className={styles.gallery} data-ready={measure.width > 0} data-grouping={grouping} style={measure.width ? { height: Math.max(layout.height, matching.length ? 0 : 120) } : undefined}>
        {ordered.map((photo, index) => {
          const position = layout.positions.get(photo.id) ?? fullLayout.positions.get(photo.id);
          const shown = visible.has(photo.id);
          return (
            <button key={photo.id} ref={(node) => { if (node) cards.current.set(photo.id, node); else cards.current.delete(photo.id); }}
              className={styles.photo} type="button" data-photo-id={photo.id} data-silent-hover="true" data-visible={shown} data-color={photo.color} data-style={photo.style}
              style={{ aspectRatio: photo.ratio, visibility: selectedId === photo.id ? 'hidden' : undefined, ...(measure.width && position ? { left: position.x, top: position.y, width: position.width, height: position.height } : {}) }}
              aria-label={`Open ${photo.description}`} aria-haspopup="dialog" aria-hidden={!shown} tabIndex={shown ? 0 : -1}
              onClick={(event) => openPhoto({ ...photo, label: photo.description }, event.currentTarget, event.detail !== 0, undefined,
                matching.map((item) => ({ ...item, label: item.description })))}>
              <Image ref={(node) => { if (node?.complete && node.naturalWidth > 0) node.dataset.loaded = "true"; }}
                onLoad={(event) => { event.currentTarget.dataset.loaded = "true"; }} src={photo.thumbnail} alt={photo.description} width={photo.width} height={photo.height} sizes="(max-width: 580px) 45vw, (max-width: 800px) 30vw, 20vw" loading={index < 10 ? 'eager' : 'lazy'} unoptimized draggable={false} />
            </button>
          );
        })}
      </div>
      {viewer}
      <PhotoPrototypePicker />
    </>
  );
}
