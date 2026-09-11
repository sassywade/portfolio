"use client";

import { useEffect, useRef } from "react";
import { sampleMeadowWind, type WindSettings } from "./wind";

// Sample the painted terrain itself: every root and color belongs to the hill,
// including its irregular silhouette. The source remains the no-JS fallback.
export function MeadowGrass({ wind, isPlaying, src }: { wind: WindSettings; isPlaying: boolean; src: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const settings = useRef({ wind, isPlaying });
  useEffect(() => { settings.current = { wind, isPlaying }; }, [wind, isPlaying]);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const source = new Image();
    let disposed = false;
    let visible = true;
    let frame = 0;
    let last = 0;
    let width = 1;
    let height = 1;
    let blades: { x: number; y: number; length: number; lean: number; color: string; width: number }[] = [];

    function resize() {
      if (!canvas || !ctx || !source.naturalWidth || disposed) return;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      if (width < 1 || height < 1) return;
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const sample = document.createElement("canvas");
      sample.width = 720;
      sample.height = Math.max(1, Math.round(720 * height / width));
      const sampler = sample.getContext("2d", { willReadFrequently: true });
      if (!sampler) return;
      const scale = Math.min(sample.width / source.naturalWidth, sample.height / source.naturalHeight);
      sampler.drawImage(source, (sample.width - source.naturalWidth * scale) / 2, (sample.height - source.naturalHeight * scale) / 2, source.naturalWidth * scale, source.naturalHeight * scale);
      const pixels = sampler.getImageData(0, 0, sample.width, sample.height).data;
      let seed = 7419;
      const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
      blades = [];
      for (let i = 0; i < Math.min(26000, width * 18); i++) {
        const x = random();
        const y = random();
        const p = (Math.floor(y * sample.height) * sample.width + Math.floor(x * sample.width)) * 4;
        if (pixels[p + 3] < 235 || pixels[p + 1] < pixels[p] * 0.96 || pixels[p + 2] > pixels[p + 1] * 0.94) continue;
        const light = 0.75 + random() * 0.65;
        const length = (2.2 + random() * 6.8) * (0.45 + y * 0.9) * Math.min(1.2, width / 1100);
        blades.push({ x: x * width, y: y * height, length, lean: (random() - 0.5) * length * 0.6, width: 0.4 + random() * 0.65, color: `rgba(${Math.min(210, pixels[p] * light)},${Math.min(220, pixels[p + 1] * light)},${Math.min(165, pixels[p + 2] * light)},0.78)` });
      }
      blades.sort((a, b) => a.y - b.y);
      canvas.dataset.bladeCount = String(blades.length);
      draw(performance.now());
    }

    function draw(now: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      const moving = settings.current.isPlaying && !reduced.matches;
      for (const blade of blades) {
        const flow = moving ? sampleMeadowWind(now / 1000, blade.x / width, settings.current.wind) : 0;
        const bend = blade.lean + flow * blade.length * 0.85;
        const tipY = blade.y - blade.length + Math.abs(flow) * blade.length * 0.15;
        ctx.strokeStyle = blade.color;
        ctx.lineWidth = blade.width;
        ctx.beginPath();
        ctx.moveTo(blade.x, blade.y);
        ctx.quadraticCurveTo(blade.x + bend * 0.16, blade.y - blade.length * 0.7, blade.x + bend, tipY);
        ctx.stroke();
      }
    }

    function tick(now: number) {
      frame = 0;
      if (disposed || !visible || document.hidden || reduced.matches || !settings.current.isPlaying) return;
      if (now - last >= 32) { draw(now); last = now; }
      frame = requestAnimationFrame(tick);
    }
    function sync() {
      cancelAnimationFrame(frame);
      frame = 0;
      if (source.naturalWidth) draw(performance.now());
      if (!disposed && visible && !document.hidden && !reduced.matches && settings.current.isPlaying) frame = requestAnimationFrame(tick);
    }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(canvas);
    // The hero's dissolve changes playback without unmounting the terrain.
    const sceneObserver = new MutationObserver(sync);
    const hero = canvas.closest(".hero-meadow");
    if (hero) sceneObserver.observe(hero, { attributes: true, attributeFilter: ["data-scene-visible", "data-meadow-variant"] });
    const sizeObserver = new ResizeObserver(resize);
    sizeObserver.observe(canvas);
    source.onload = () => { resize(); sync(); };
    source.src = src;
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", sync);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      sceneObserver.disconnect();
      sizeObserver.disconnect();
      source.onload = null;
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", sync);
    };
  }, [src, isPlaying]);

  return <canvas ref={ref} className="meadow__grass-canvas" data-grass-layer aria-hidden="true" />;
}
