"use client";

import { useEffect, useRef } from "react";
import { MEADOW_GUST_EVENT, WELCOME_TRAVEL_MS, cursorGrassBend, arrivalGrassWind, grassPressure, type MeadowGust, type GrassFootprint } from "./grass-interaction";
import { sampleMeadowWind, type WindSettings } from "./wind";

// Sample the painted terrain itself: every root and color belongs to the hill,
// including its irregular silhouette. Only generated blades reach the visible canvas.
// The source image is a loading / no-canvas fallback and picker alternative.
export function MeadowGrass({ wind, isPlaying, src }: { wind: WindSettings; isPlaying: boolean; src: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const tipsRef = useRef<HTMLCanvasElement>(null);
  const settings = useRef({ wind, isPlaying });
  useEffect(() => { settings.current = { wind, isPlaying }; ref.current?.dispatchEvent(new Event("grass-playback")); }, [wind, isPlaying]);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    const tips = tipsRef.current;
    const tipCtx = tips?.getContext("2d");
    if (!canvas || !ctx || !tips || !tipCtx) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const source = new Image();
    const undergrowth = document.createElement("canvas");
    const ground = undergrowth.getContext("2d");
    if (!ground) return;
    const surface = canvas.parentElement;
    let disposed = false;
    let visible = true;
    let frame = 0;
    type Patch = { x: number; y: number; w: number; h: number };
    let previousPatches: Patch[] = [];
    let crestBlades: GroundBlade[] = [];
    let lastContactSample = -Infinity;
    let width = 1;
    let height = 1;
    let pixelScale = 1;
    let lastWindFrame = 0;
    const windSprings = Array.from({ length: 65 }, () => ({ bend: 0, velocity: 0 }));
    const elasticWind = (x: number) => {
      const position = Math.max(0, Math.min(64, x / width * 64));
      const index = Math.min(63, Math.floor(position));
      return windSprings[index].bend + (windSprings[index + 1].bend - windSprings[index].bend) * (position - index);
    };
    let gust: MeadowGust | null = null;
    let footprints: GrassFootprint[] = [];
    let ridge: number[] = [];
    let pointer: { x: number; y: number } | null = null;
    let pointerDirection = 1;
    let lastPointerMove = 0;
    let grassActive = false;
    let brush: { x: number; y: number; direction: number; strength: number } | null = null;
    const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
    const announcePresence = (active: boolean) => {
      if (grassActive === active) return;
      grassActive = active;
      if (canvas) canvas.dataset.pointerGrass = active ? "true" : "false";
    };
    let lastBrushFrame = 0;
    function updateBrush(now: number) {
      const step = lastBrushFrame ? Math.min(2, (now - lastBrushFrame) / 32) : 1;
      lastBrushFrame = now;
      if (!canvas || !finePointer.matches || !pointer) { announcePresence(false); brush = null; return; }
      const bounds = canvas.getBoundingClientRect();
      const toLocal = (x: number, y: number) => ({ x: (x - bounds.left) * width / bounds.width, y: (y - bounds.top) * height / bounds.height });
      const inGrass = (point: {x: number; y: number}) => point.x >= 0 && point.x < width && point.y >= (ridge[Math.floor(point.x / width * ridge.length)] ?? height) && point.y <= height;
      const local = toLocal(pointer.x, pointer.y);
      const active = inGrass(local) && now - lastPointerMove < 160;
      announcePresence(active);
      if (active) {
        brush = { x: local.x, y: local.y, direction: pointerDirection, strength: Math.min(1, (brush?.strength ?? 0) + 0.36 * step) };
      } else if (brush) {
        brush.strength *= 0.86 ** step;
        if (brush.strength < 0.02) brush = null;
      }
    }
    type GroundBlade = { x: number; y: number; length: number; lean: number; color: string; spacing: number; order: number; crestFlex: number };
    const groundCells = new Map<number, Map<number, GroundBlade[]>>();
    function paintGround(target: CanvasRenderingContext2D, blade: GroundBlade, pressure = 0, direction = 1, flow = 0) {
      const { x, y, spacing, color } = blade;
      const length = blade.length * (1 - pressure * 0.83) / (1 + Math.abs(flow) * 0.2);
      const lean = blade.lean + pressure * blade.length * direction * 0.85 + flow * blade.length * 0.95;
      target.fillStyle = color;
      target.beginPath();
      target.moveTo(x - spacing * 0.85, y + spacing);
      target.quadraticCurveTo(x - spacing * 0.4 + lean * 0.22, y - length * 0.62, x + lean, y - length);
      target.quadraticCurveTo(x + spacing * 0.6, y - length * 0.25, x + spacing * 0.85, y + spacing);
      target.fill();
    }
    function collectFootprints(now: number) {
      if (!canvas) return;
      footprints = footprints.filter((foot) => now - foot.at < 1900);
      if (now - lastContactSample < 50) return;
      lastContactSample = now;
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      // Visitors pass through the meadow without flattening it. Only the camera
      // drop gets a temporary contact patch, so walking and biking stay light.
      const actors = document.querySelectorAll<HTMLElement>('.photo-drop-layer:is([data-phase="shoot"], [data-phase="land"]) .mini-photographer');
      actors.forEach((actor) => {
        const rect = actor.getBoundingClientRect();
        const x = (rect.left + rect.width * 0.5 - bounds.left) * width / bounds.width;
        const y = (rect.bottom - 3 - bounds.top) * height / bounds.height;
        if (x < 0 || x > width || y < 0 || y > height) return;
        const radius = Math.max(10, rect.width * (actor.classList.contains("bike-rider") ? 0.34 : 0.2)) * width / bounds.width;
        const direction = actor.closest('[data-direction]')?.getAttribute('data-direction') === "left" ? -1 : 1;
        const existing = footprints.find((foot) => Math.abs(foot.x - x) < 5 && Math.abs(foot.y - y) < 5);
        if (existing) { existing.at = now; }
        else footprints.push({ x, y, radius, at: now, direction });
      });
      footprints = footprints.slice(-36);
      canvas.dataset.contactCount = String(footprints.length);
    }
    let blades: { x: number; y: number; length: number; lean: number; color: string; width: number; flexibility: number }[] = [];

    function resize() {
      if (!canvas || !ctx || !source.naturalWidth || disposed) return;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      if (width < 1 || height < 1) return;
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      pixelScale = dpr;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      tips.width = canvas.width;
      tips.height = canvas.height;
      tipCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      previousPatches = [];
      undergrowth.width = canvas.width;
      undergrowth.height = canvas.height;
      ground!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const sample = document.createElement("canvas");
      sample.width = 720;
      sample.height = Math.max(1, Math.round(720 * height / width));
      const sampler = sample.getContext("2d", { willReadFrequently: true });
      if (!sampler) return;
      const scale = Math.min(sample.width / source.naturalWidth, sample.height / source.naturalHeight);
      sampler.drawImage(source, (sample.width - source.naturalWidth * scale) / 2, (sample.height - source.naturalHeight * scale) / 2, source.naturalWidth * scale, source.naturalHeight * scale);
      const pixels = sampler.getImageData(0, 0, sample.width, sample.height).data;
      // Carry terrain color down from each column's ridge through transparent
      // flecks in the cutout, so the blade-only hill has no holes to the grid.
      for (let x = 0; x < sample.width; x++) {
        let previous = -1;
        for (let y = 0; y < sample.height; y++) {
          const p = (y * sample.width + x) * 4;
          if (pixels[p + 3] >= 235 && pixels[p + 1] >= pixels[p] * 0.9 && pixels[p + 2] <= pixels[p + 1] * 0.96) {
            previous = p;
          } else if (previous >= 0) {
            pixels[p] = pixels[previous];
            pixels[p + 1] = pixels[previous + 1];
            pixels[p + 2] = pixels[previous + 2];
            pixels[p + 3] = 255;
          } else {
            pixels[p + 3] = 0;
          }
        }
      }
      ridge = Array.from({ length: sample.width }, (_, x) => {
        for (let y = 0; y < sample.height; y++) if (pixels[(y * sample.width + x) * 4 + 3] >= 235) return y / sample.height * height;
        return height;
      });
      // Ground the tree by shading the actual blades, never an overlay ellipse.
      // Use the rendered trunk position so the contact follows responsive layouts.
      const bounds = canvas.getBoundingClientRect();
      const tree = canvas.closest(".hero-meadow")?.querySelector(".cypress-tree__canvas")?.getBoundingClientRect();
      const treeX = tree ? (tree.left + tree.width * 0.5 - bounds.left) * width / bounds.width : -width;
      const treeWidth = tree ? tree.width * width / bounds.width : 1;
      const shadeDepth = tree ? tree.width * height / bounds.height : 1;
      const groundAt = (x: number) => ridge[Math.max(0, Math.min(ridge.length - 1, Math.floor(x / width * ridge.length)))] ?? height;
      const treeShade = (x: number, y: number) => {
        const depth = (y - groundAt(x)) / shadeDepth;
        const dx = (x - treeX) / treeWidth;
        const contact = Math.exp(-Math.pow(dx / 0.16, 2) - Math.pow((depth - 0.02) / 0.065, 2));
        const shelter = Math.exp(-Math.pow((dx + 0.16) / 0.58, 2) - Math.pow((depth - 0.09) / 0.19, 2));
        const brokenLight = 0.82 + 0.18 * Math.sin(dx * 23 + Math.sin(depth * 29) * 2);
        return (contact * 0.40 + shelter * 0.28) * brokenLight;
      };
      const grassColor = (p: number, light: number, x: number, y: number, alpha = 1) => {
        const shade = treeShade(x, y);
        return `rgba(${Math.min(220, pixels[p] * light) * (1 - shade)},${Math.min(225, pixels[p + 1] * light) * (1 - shade * 0.9)},${Math.min(170, pixels[p + 2] * light) * (1 - shade * 0.68)},${alpha})`;
      };
      let seed = 7419;
      const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
      // Bake the dense interior once. Skyline roots and longer foreground tips
      // share a separate animated layer, leaving the interior undisturbed.
      // Never draw the reference bitmap into the visible canvas or this backing layer.
      const spacing = Math.max(2.1, width / 650);
      let groundCount = 0;
      groundCells.clear();
      crestBlades = [];
      for (let y = 0; y < height + spacing; y += spacing) {
        for (let x = 0; x < width; x += spacing) {
          const rootX = x + random() * spacing;
          const rootY = Math.min(height - 1, y + random() * spacing);
          const p = (Math.min(sample.height - 1, Math.floor(rootY / height * sample.height)) * sample.width + Math.min(sample.width - 1, Math.floor(rootX / width * sample.width))) * 4;
          if (pixels[p + 3] < 235 || pixels[p + 1] < pixels[p] * 0.9 || pixels[p + 2] > pixels[p + 1] * 0.96) continue;
          const light = 0.80 + random() * 0.30;
          const crest = Math.min(1, Math.max(0, (rootY - groundAt(rootX)) / 65));
          const rootTuft = Math.exp(-Math.pow((rootX - treeX) / (treeWidth * 0.12), 2) - Math.pow((rootY - groundAt(rootX)) / 12, 2));
          const tuft = rootTuft * Math.max(0, Math.sin(rootX * 0.42)) * 0.4;
          const length = (rootY - groundAt(rootX) < 22 ? 0.91 : 0.7) * spacing * (2.8 + random() * 3.8) * (0.6 + rootY / height * 0.6) * (0.8 + crest * 0.2 + tuft);
          const lean = (random() - 0.3) * length * 0.45;
          const blade = { x: rootX, y: rootY, length, lean, spacing: spacing * (rootY - groundAt(rootX) < 14 ? 0.82 : 1), color: grassColor(p, light, rootX, rootY), order: groundCount, crestFlex: Math.max(0, Math.min(1, (22 - (rootY - groundAt(rootX))) / 14)) };
          if (blade.crestFlex > 0) crestBlades.push(blade);
          else paintGround(ground!, blade);
          const row = Math.floor(rootY / 32);
          if (blade.crestFlex > 0) { groundCount++; continue; }
          if (!groundCells.has(row)) groundCells.set(row, new Map());
          const column = Math.floor(rootX / 64);
          const cells = groundCells.get(row)!;
          if (!cells.has(column)) cells.set(column, []);
          cells.get(column)!.push(blade);
          groundCount++;
        }
      }
      blades = [];
      for (let i = 0; i < Math.min(12000, width * 8); i++) {
        const x = random();
        const y = random();
        const p = (Math.floor(y * sample.height) * sample.width + Math.floor(x * sample.width)) * 4;
        if (pixels[p + 3] < 235 || pixels[p + 1] < pixels[p] * 0.96 || pixels[p + 2] > pixels[p + 1] * 0.94) continue;
        const light = 0.80 + random() * 0.44;
        const length = 0.94 * (2.2 + random() * 6.8) * (0.45 + y * 0.9) * Math.min(1.2, width / 1100);
        blades.push({ x: x * width, y: y * height, length, lean: (random() - 0.5) * length * 0.6, width: 0.4 + random() * 0.45, flexibility: 0.9 + (Math.sin(x * width * 0.37 + y * height * 0.21) + 1) * 0.15, color: grassColor(p, light, x * width, y * height, 0.78) });
      }
      blades.sort((a, b) => a.y - b.y);
      canvas.dataset.bladeCount = String(blades.length);
      canvas.dataset.groundBladeCount = String(groundCount);
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(undergrowth, 0, 0);
      ctx.restore();
      draw(performance.now());
      if (surface && groundCount > 0) surface.dataset.grassReady = "true";
    }

    function draw(now: number) {
      if (!ctx) return;
      tipCtx!.clearRect(0, 0, width, height);
      const moving = settings.current.isPlaying && !reduced.matches && visible && !document.hidden;
      if (moving) {
        const dt = lastWindFrame ? Math.min(0.04, (now - lastWindFrame) / 1000) : 0.016;
        windSprings.forEach((spring, index) => {
          const x = index / 64;
          const target = sampleMeadowWind(now / 1000, x, settings.current.wind) * 1.10 + arrivalGrassWind(now, x, gust) * 0.8;
          spring.velocity += ((target - spring.bend) * 100 - spring.velocity * (14 - settings.current.wind.elasticity * 4)) * dt;
          spring.bend += spring.velocity * dt;
        });
        lastWindFrame = now;
      } else {
        lastWindFrame = 0;
      }
      if (moving) { collectFootprints(now); updateBrush(now); }
      // Animate the dense turf too, within bounded wind/contact patches.
      const patches = footprints.map((foot) => ({ x: foot.x - foot.radius - 22, y: foot.y - foot.radius - 22, w: (foot.radius + 22) * 2, h: (foot.radius + 22) * 2 }));
      if (brush && moving) patches.push({ x: brush.x - 146, y: brush.y - 108, w: 292, h: 216 });
      // Restore only last/current dirty regions; the rest of the turf stays put.
      if (previousPatches.length || patches.length) {
        ctx.save();
        ctx.beginPath();
        for (const patch of [...previousPatches, ...patches]) {
          const left = Math.floor(patch.x * pixelScale) / pixelScale;
          const top = Math.floor(patch.y * pixelScale) / pixelScale;
          const right = Math.ceil((patch.x + patch.w) * pixelScale) / pixelScale;
          const bottom = Math.ceil((patch.y + patch.h) * pixelScale) / pixelScale;
          ctx.rect(left, top, right - left, bottom - top);
        }
        ctx.clip();
        ctx.clearRect(0, 0, width, height);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(undergrowth, 0, 0);
        ctx.restore();
      }
      previousPatches = patches;
      if (patches.length) {
        ctx.save();
        ctx.beginPath();
        const rows = new Set<number>();
        const columns = new Map<number, Set<number>>();
        for (const patch of patches) {
          // Fractional clip edges partially erase pixels and leave a pale box.
          const left = Math.floor(patch.x * pixelScale) / pixelScale;
          const top = Math.floor(patch.y * pixelScale) / pixelScale;
          const right = Math.ceil((patch.x + patch.w) * pixelScale) / pixelScale;
          const bottom = Math.ceil((patch.y + patch.h) * pixelScale) / pixelScale;
          ctx.rect(left, top, right - left, bottom - top);
          for (let row = Math.max(0, Math.floor((patch.y - 40) / 32)); row <= Math.min(Math.ceil(height / 32), Math.ceil((patch.y + patch.h + 40) / 32)); row++) {
            rows.add(row);
            if (!columns.has(row)) columns.set(row, new Set());
            for (let column = Math.max(0, Math.floor((patch.x - 40) / 64)); column <= Math.floor((patch.x + patch.w + 40) / 64); column++) columns.get(row)!.add(column);
          }
        }
        ctx.clip();
        ctx.clearRect(0, 0, width, height);
        for (const row of [...rows].sort((a, b) => a - b)) for (const blade of [...(columns.get(row) ?? [])].flatMap(column => groundCells.get(row)?.get(column) ?? []).sort((a, b) => a.order - b.order)) {
          const { pressure, direction } = grassPressure(blade.x, blade.y, now, footprints);
          const crestFlex = blade.crestFlex;
          const flow = moving ? elasticWind(blade.x) * crestFlex + arrivalGrassWind(now, blade.x / width, gust) * (1 - crestFlex) + cursorGrassBend(blade.x, blade.y, brush, now) : 0;
          paintGround(ctx, blade, pressure, direction, flow);
        }
        ctx.restore();
      }
      // Skyline roots are preselected once. No clipped turf reconstruction per frame.
      for (const blade of crestBlades) {
        const { pressure, direction } = grassPressure(blade.x, blade.y, now, footprints);
        const flow = moving ? elasticWind(blade.x) * blade.crestFlex + cursorGrassBend(blade.x, blade.y, brush, now) : 0;
        paintGround(tipCtx!, blade, pressure, direction, flow);
      }
      for (const blade of blades) {
        const flow = moving ? elasticWind(blade.x) + cursorGrassBend(blade.x, blade.y, brush, now) : 0;
        const { pressure, direction } = grassPressure(blade.x, blade.y, now, footprints);
        const length = blade.length * (1 - pressure * 0.83);
        const flexibility = blade.flexibility;
        const bend = blade.lean + flow * length * 0.95 * flexibility + pressure * blade.length * direction;
        const tipY = blade.y - length + Math.abs(flow) * length * 0.15;
        tipCtx!.strokeStyle = blade.color;
        tipCtx!.lineWidth = blade.width;
        tipCtx!.beginPath();
        tipCtx!.moveTo(blade.x, blade.y);
        tipCtx!.quadraticCurveTo(blade.x + bend * 0.3, blade.y - length * 0.75, blade.x + bend, tipY);
        tipCtx!.stroke();
      }
    }

    function tick(now: number) {
      frame = 0;
      if (disposed || !visible || document.hidden || reduced.matches || !settings.current.isPlaying) return;
      draw(now);
      frame = requestAnimationFrame(tick);
    }
    function sync() {
      cancelAnimationFrame(frame);
      frame = 0;
      if (!visible || document.hidden || reduced.matches || !settings.current.isPlaying) { announcePresence(false); brush = null; }
      if (source.naturalWidth) draw(performance.now());
      if (!disposed && visible && !document.hidden && !reduced.matches && settings.current.isPlaying) frame = requestAnimationFrame(tick);
    }
    canvas.addEventListener("grass-playback", sync);
    const handlePointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !finePointer.matches) return;
      if (pointer && Math.abs(event.clientX - pointer.x) > 2) pointerDirection = event.clientX < pointer.x ? -1 : 1;
      lastPointerMove = performance.now();
      pointer = { x: event.clientX, y: event.clientY };
    };
    const handlePointerOut = (event: PointerEvent) => {
      if (!event.relatedTarget) { pointer = null; brush = null; announcePresence(false); }
    };
    window.addEventListener("pointermove", handlePointer, { passive: true });
    window.addEventListener("pointerout", handlePointerOut);
    const handleGust = (event: Event) => {
      if (reduced.matches || !settings.current.isPlaying || document.hidden) return;
      const bounds = canvas.getBoundingClientRect();
      const left = Math.max(0, bounds.left);
      const right = Math.min(window.innerWidth, bounds.right);
      gust = { ...(event as CustomEvent<MeadowGust>).detail,
        origin: (left - bounds.left) / bounds.width,
        span: (right - left) / bounds.width,
      };
    };
    window.addEventListener(MEADOW_GUST_EVENT, handleGust);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(canvas);
    // The hero's dissolve changes playback without unmounting the terrain.
    const sceneObserver = new MutationObserver(sync);
    const hero = canvas.closest(".hero-meadow");
    if (hero) sceneObserver.observe(hero, { attributes: true, attributeFilter: ["data-scene-visible", "data-meadow-variant"] });
    const sizeObserver = new ResizeObserver(resize);
    sizeObserver.observe(canvas);
    window.addEventListener("resize", resize);
    source.onload = () => { resize(); sync(); };
    source.src = src;
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", sync);
    return () => {
      disposed = true;
      canvas.removeEventListener("grass-playback", sync);
      announcePresence(false);
      window.removeEventListener("pointermove", handlePointer);
      window.removeEventListener("pointerout", handlePointerOut);
      if (surface) delete surface.dataset.grassReady;
      cancelAnimationFrame(frame);
      observer.disconnect();
      sceneObserver.disconnect();
      sizeObserver.disconnect();
      window.removeEventListener("resize", resize);
      source.onload = null;
      window.removeEventListener(MEADOW_GUST_EVENT, handleGust);
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", sync);
    };
  }, [src]);

  return <>
    <canvas ref={ref} className="meadow__grass-canvas" data-grass-layer aria-hidden="true" />
    <canvas ref={tipsRef} className="meadow__grass-canvas" data-grass-tips aria-hidden="true" />
  </>;
}
