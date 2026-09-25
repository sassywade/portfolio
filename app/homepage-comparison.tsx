"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import styles from "./homepage-video.module.css";

export function HomepageComparison({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [before, setBefore] = useState(false);
  const [instant, setInstant] = useState(false);
  const select = (value: boolean, event: MouseEvent<HTMLButtonElement>) => {
    setInstant(event.detail === 0);
    setBefore(value);
  };
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const sync = () => {
      if (reduced.matches || before) {
        video.pause();
      } else if (visible && !document.hidden) {
        void video.play().catch(() => {});
      } else video.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { threshold: .2 });
    observer.observe(video);
    video.addEventListener("loadedmetadata", sync);
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", sync);
    return () => {
      observer.disconnect();
      video.pause();
      video.removeEventListener("loadedmetadata", sync);
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", sync);
    };
  }, [src, before]);
  return (
    <div className={styles.tile} data-comparison={before ? "before" : "after"} data-instant={instant}>
      <div className={styles.track}>
        <button type="button" className={styles.screen} aria-label="Show Before homepage" aria-pressed={before} onClick={event => select(true, event)}>
          <img src="/work/homepage-before.png" alt="Previous Glean homepage with search, activity feed, and calendar" width={5120} height={3328} loading="lazy" draggable={false} />
        </button>
        <button type="button" className={styles.screen} aria-label="Show After homepage" aria-pressed={!before} onClick={event => select(false, event)}>
      <video ref={ref} className={styles.video} aria-label="Redesigned Glean homepage"
        loop muted playsInline disablePictureInPicture poster={poster} preload="metadata">
        <source src={src} type="video/mp4" />
      </video>
        </button>
      </div>
      <button type="button" className={styles.label} onClick={event => select(!before, event)} aria-label={before ? "Show After homepage" : "Show Before homepage"}>
        {!before && <span aria-hidden="true">←</span>}
        {before ? "After" : "Before"}
        {before && <span aria-hidden="true">→</span>}
      </button>
    </div>
  );
}
