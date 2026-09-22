"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { usePhotoViewer } from "../photo-viewer";
import photographs from "./photos.json";
import { clusterPhotos, masonryLayout, matchesPhoto } from "./gallery-model.mjs";
import { PhotoPrototypePicker, usePhotoGrouping } from "./photo-grouping";
import styles from "./photography.module.css";
import { SearchPrompt } from "./search-prompt";

type Snapshot = { left: number; top: number; width: number; height: number; opacity: string };

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
  const previousVisible = useRef(new Set(photographs.map((photo) => photo.id)));
  const reduced = useRef(false);

  const capture = useCallback(() => {
    snapshots.current.clear();
    cards.current.forEach((node, id) => {
      const rect = node.getBoundingClientRect();
      snapshots.current.set(id, { left: rect.left, top: rect.top, width: rect.width, height: rect.height, opacity: getComputedStyle(node).opacity });
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
    const observer = new ResizeObserver(resize);
    observer.observe(node);
    return () => { observer.disconnect(); preference.removeEventListener('change', updatePreference); animations.current.forEach((animation) => animation.cancel()); };
  }, []);

  useEffect(() => {
    if (composing || query === appliedQuery) return;
    const timer = window.setTimeout(() => { capture(); setAppliedQuery(query); }, 170);
    return () => window.clearTimeout(timer);
  }, [query, appliedQuery, composing, capture]);

  const ordered = useMemo(() => clusterPhotos(photographs, grouping), [grouping]);
  const matching = useMemo(() => ordered.filter((photo) => matchesPhoto(photo, appliedQuery)), [ordered, appliedQuery]);
  const visible = useMemo(() => new Set<string>(matching.map((photo) => photo.id)), [matching]);
  const fullLayout = useMemo(() => masonryLayout(ordered, measure.width, measure.columns, measure.gap), [ordered, measure]);
  const layout = useMemo(() => masonryLayout(matching, measure.width, measure.columns, measure.gap), [matching, measure]);

  useLayoutEffect(() => {
    animations.current.forEach((animation) => animation.cancel());
    animations.current = [];
    if (measure.width && !reduced.current && snapshots.current.size) {
      const bounds = gallery.current!.getBoundingClientRect();
      const easing = getComputedStyle(gallery.current!).getPropertyValue('--motion-ease-in-out').trim();
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
          const start = returning && Number(old.opacity) < 0.05 ? `translate(0px, 28px)` : `translate(${dx}px, ${dy}px)`;
          const animation = node.animate([
            { transform: start, opacity: returning ? old.opacity : 1 },
            { transform: 'translate(0px, 0px)', opacity: 1 },
          ], { duration: 560, easing, fill: 'both' });
          animations.current.push(animation);
        } else if (!visible.has(id) && Number(old.opacity) > 0.01 && onscreen) {
          const distance = Math.max(320, innerHeight - old.top + old.height);
          const tilt = Number(id) % 2 ? 10 : -10;
          // A sampled parabola gives the drop acceleration; only transforms and opacity animate.
          const frames = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
            offset: t,
            transform: `translate(${dx + tilt * t * 2}px, ${dy + distance * t * t}px) rotate(${tilt * t}deg)`,
            opacity: Number(old.opacity) * (t < 0.5 ? 1 : 2 * (1 - t)),
          }));
          animations.current.push(node.animate(frames, { duration: 460 + Number(id) % 4 * 25, easing: 'linear', fill: 'both' }));
        }
      });
    }
    previousVisible.current = visible;
    snapshots.current.clear();
  }, [layout, fullLayout, visible, measure.width]);

  return (
    <>
      <div className={styles.search} role="search" data-empty={!query} data-viewing={!!selectedId}>
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>
        <div className={styles.searchField}>
          <SearchPrompt />
          <input ref={input} type="search" aria-label="Search photos" placeholder="Search photos" value={query} autoComplete="off" spellCheck={false}
            onChange={(event) => setQuery(event.target.value)} onCompositionStart={() => setComposing(true)} onCompositionEnd={() => setComposing(false)}
            onKeyDown={(event) => { if (event.key === 'Escape') { setQuery(''); capture(); setAppliedQuery(''); } }} />
        </div>
        {query && <button type="button" aria-label="Clear search" onClick={() => { setQuery(''); capture(); setAppliedQuery(''); input.current?.focus(); }}>Clear</button>}
      </div>
      <p className="sr-only" role="status" aria-live="polite">{matching.length} {matching.length === 1 ? 'photo' : 'photos'}{appliedQuery ? ` matching ${appliedQuery}` : ''}</p>
      {!matching.length && <p className={styles.empty}>nothin bout that</p>}
      <div ref={gallery} className={styles.gallery} data-ready={measure.width > 0} data-grouping={grouping} style={measure.width ? { height: Math.max(layout.height, matching.length ? 0 : 120) } : undefined}>
        {ordered.map((photo, index) => {
          const position = layout.positions.get(photo.id) ?? fullLayout.positions.get(photo.id);
          const shown = visible.has(photo.id);
          return (
            <button key={photo.id} ref={(node) => { if (node) cards.current.set(photo.id, node); else cards.current.delete(photo.id); }}
              className={styles.photo} type="button" data-photo-id={photo.id} data-visible={shown} data-color={photo.color} data-style={photo.style}
              style={{ aspectRatio: photo.ratio, visibility: selectedId === photo.id ? 'hidden' : undefined, ...(measure.width && position ? { left: position.x, top: position.y, width: position.width, height: position.height } : {}) }}
              aria-label={`Open ${photo.description}`} aria-haspopup="dialog" aria-hidden={!shown} tabIndex={shown ? 0 : -1}
              onClick={(event) => openPhoto({ ...photo, label: photo.description }, event.currentTarget, event.detail !== 0)}>
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
