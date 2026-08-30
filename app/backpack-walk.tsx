"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef } from "react";

const FRAME_URLS = [
  "/backpacker-frame-1.png",
  "/backpacker-frame-2.png",
  "/backpacker-frame-3.png",
] as const;

const WALK_FRAME_ORDER = [0, 1, 2, 1] as const;
const SPAWN_DURATION = 220;
const LAND_DURATION = 180;
const TURN_DURATION = 240;
const HIKER_GROUND_RATIO = 0.958;

type WalkPhase = "idle" | "spawn" | "drop" | "land" | "walk";

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function BackpackWalk() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const layerRef = useRef<HTMLSpanElement>(null);
  const hikerRef = useRef<HTMLSpanElement>(null);
  const directionRef = useRef<HTMLSpanElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const launchRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    const button = buttonRef.current;
    const layer = layerRef.current;
    const hiker = hikerRef.current;
    const directionNode = directionRef.current;
    const hikerImage = imageRef.current;
    if (!button || !layer || !hiker || !directionNode || !hikerImage) return;

    FRAME_URLS.forEach((src) => {
      const preload = new Image();
      preload.decoding = "async";
      preload.src = src;
    });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const meadowImage = new Image();
    meadowImage.decoding = "async";
    meadowImage.src = "/meadow-ground.png";

    let sourceWidth = 0;
    let sourceHeight = 0;
    let surfaceByColumn = new Float32Array(0);
    let phase: WalkPhase = "idle";
    let phaseStarted = 0;
    let frameHandle = 0;
    let reducedTimer = 0;
    let lastTime = 0;
    let inView = true;
    let x = 0;
    let y = 0;
    let velocityY = 0;
    let direction = -1;
    let walkDistance = 0;
    let currentFrame = 0;
    let turningUntil = 0;

    function prepareMeadowProfile() {
      if (!meadowImage.naturalWidth || !meadowImage.naturalHeight) return;
      const source = document.createElement("canvas");
      source.width = meadowImage.naturalWidth;
      source.height = meadowImage.naturalHeight;
      const sourceContext = source.getContext("2d", { willReadFrequently: true });
      if (!sourceContext) return;

      sourceContext.drawImage(meadowImage, 0, 0);
      try {
        const pixels = sourceContext.getImageData(0, 0, source.width, source.height).data;
        sourceWidth = source.width;
        sourceHeight = source.height;
        surfaceByColumn = new Float32Array(sourceWidth);

        for (let sourceX = 0; sourceX < sourceWidth; sourceX += 1) {
          let surface = Math.floor(sourceHeight * 0.52);
          for (let sourceY = surface; sourceY < sourceHeight; sourceY += 1) {
            if (pixels[(sourceY * sourceWidth + sourceX) * 4 + 3] > 28) {
              surface = sourceY;
              break;
            }
          }
          surfaceByColumn[sourceX] = surface / sourceHeight;
        }
      } catch {
        surfaceByColumn = new Float32Array(0);
      }
    }

    function hikerSize() {
      const styles = window.getComputedStyle(hiker);
      const width = Number.parseFloat(styles.width) || 68;
      return {
        width,
        height: Number.parseFloat(styles.height) || width * (720 / 586),
      };
    }

    function trackY(localX: number) {
      const layerBounds = layer.getBoundingClientRect();
      const meadow = document.querySelector<HTMLElement>('[data-meadow-surface="active"]');
      if (!meadow) return layerBounds.height * 0.78;

      const meadowBounds = meadow.getBoundingClientRect();
      if (meadow.dataset.meadowVariant === "flat") {
        return meadowBounds.top + Math.min(4, meadowBounds.height * 0.03) - layerBounds.top;
      }
      const clientX = layerBounds.left + localX;
      const normalizedX = clamp((clientX - meadowBounds.left) / Math.max(1, meadowBounds.width), 0, 1);
      const fallbackSurface = 0.79 + Math.sin(normalizedX * Math.PI) * 0.08;
      const sourceX = clamp(Math.round(normalizedX * Math.max(0, sourceWidth - 1)), 0, Math.max(0, sourceWidth - 1));
      const surface = surfaceByColumn.length ? surfaceByColumn[sourceX] : fallbackSurface;
      return meadowBounds.top + surface * meadowBounds.height - layerBounds.top;
    }

    function trackAngle(localX: number) {
      const { width } = hikerSize();
      const sampleDistance = Math.max(8, width * 0.2);
      const before = trackY(localX - sampleDistance);
      const after = trackY(localX + sampleDistance);
      return clamp(Math.atan2(after - before, sampleDistance * 2) * 0.38, -0.07, 0.07);
    }

    function setFrame(index: number) {
      const next = WALK_FRAME_ORDER[((index % WALK_FRAME_ORDER.length) + WALK_FRAME_ORDER.length) % WALK_FRAME_ORDER.length];
      if (next === currentFrame && hikerImage.getAttribute("src") === FRAME_URLS[next]) return;
      currentFrame = next;
      hikerImage.src = FRAME_URLS[next];
      layer.dataset.frame = String(next);
    }

    function setPhase(next: WalkPhase, now = performance.now()) {
      phase = next;
      phaseStarted = now;
      layer.dataset.phase = next;
      button.dataset.walking = next === "idle" ? "false" : "true";
      if (next === "idle") hiker.dataset.turning = "false";
    }

    function setFacing() {
      directionNode.style.setProperty("--hiker-facing", String(direction === -1 ? 1 : -1));
    }

    function renderHiker(angle = 0) {
      const { width } = hikerSize();
      hiker.style.transform = `translate3d(${x - width * 0.5}px, ${y}px, 0) rotate(${angle}rad)`;
      setFacing();
    }

    function schedule() {
      if (frameHandle || phase === "idle" || !inView || reducedMotion.matches) return;
      frameHandle = window.requestAnimationFrame(frame);
    }

    function beginTurn(now: number) {
      direction *= -1;
      turningUntil = now + TURN_DURATION;
      hiker.dataset.turning = "true";
      setFacing();
    }

    function frame(now: number) {
      frameHandle = 0;
      if (phase === "idle" || !inView || reducedMotion.matches) return;

      const deltaSeconds = lastTime ? Math.min(0.034, Math.max(0.001, (now - lastTime) / 1000)) : 0;
      lastTime = now;
      const { width, height } = hikerSize();
      const layerBounds = layer.getBoundingClientRect();
      const ground = trackY(x) - height * HIKER_GROUND_RATIO;

      if (phase === "spawn" && now - phaseStarted >= SPAWN_DURATION) {
        velocityY = -14;
        setPhase("drop", now);
      } else if (phase === "drop") {
        const gravity = Math.max(980, layerBounds.height * 2.15);
        velocityY += gravity * deltaSeconds;
        y += velocityY * deltaSeconds;
        if (y >= ground) {
          y = ground;
          velocityY = 0;
          setPhase("land", now);
        }
      } else if (phase === "land") {
        y = ground;
        if (now - phaseStarted >= LAND_DURATION) {
          walkDistance = 0;
          setPhase("walk", now);
        }
      } else if (phase === "walk") {
        const margin = width * 0.52;
        const speed = clamp(layerBounds.width * 0.041, 38, 56);

        if (turningUntil && now < turningUntil) {
          y = ground;
        } else {
          if (turningUntil) {
            turningUntil = 0;
            hiker.dataset.turning = "false";
          }

          x += direction * speed * deltaSeconds;
          walkDistance += speed * deltaSeconds;

          if (x >= layerBounds.width - margin) {
            x = layerBounds.width - margin;
            beginTurn(now);
          } else if (x <= margin) {
            x = margin;
            beginTurn(now);
          }

          y = trackY(x) - height * HIKER_GROUND_RATIO;
          setFrame(Math.floor(walkDistance / 9));
        }
      }

      renderHiker(phase === "walk" || phase === "land" ? trackAngle(x) : 0);
      schedule();
    }

    function launch() {
      window.cancelAnimationFrame(frameHandle);
      window.clearTimeout(reducedTimer);
      frameHandle = 0;
      lastTime = 0;
      turningUntil = 0;
      walkDistance = 0;
      direction = -1;
      setFrame(0);

      const layerBounds = layer.getBoundingClientRect();
      const buttonBounds = button.getBoundingClientRect();
      const { width, height } = hikerSize();
      const margin = width * 0.52;
      x = clamp(buttonBounds.left + buttonBounds.width * 0.5 - layerBounds.left, margin, layerBounds.width - margin);
      y = buttonBounds.top + buttonBounds.height * 0.5 - layerBounds.top - height * 0.46;
      velocityY = 0;

      setPhase("idle");
      void hiker.offsetWidth;

      if (reducedMotion.matches) {
        y = trackY(x) - height * HIKER_GROUND_RATIO;
        setPhase("land");
        renderHiker(trackAngle(x));
        reducedTimer = window.setTimeout(() => setPhase("idle"), 1800);
        return;
      }

      setPhase("spawn");
      renderHiker();
      schedule();
    }

    launchRef.current = launch;

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) {
        lastTime = performance.now();
        schedule();
      } else {
        window.cancelAnimationFrame(frameHandle);
        frameHandle = 0;
      }
    }, { rootMargin: "80px 0px" });
    intersectionObserver.observe(layer);

    const resizeObserver = new ResizeObserver(() => {
      if (phase === "walk" || phase === "land") {
        const { width, height } = hikerSize();
        const margin = width * 0.52;
        x = clamp(x, margin, layer.getBoundingClientRect().width - margin);
        y = trackY(x) - height * HIKER_GROUND_RATIO;
        renderHiker(trackAngle(x));
      }
    });
    resizeObserver.observe(layer);

    const handleMeadowLoad = () => {
      prepareMeadowProfile();
      if (phase === "walk" || phase === "land") {
        y = trackY(x) - hikerSize().height * HIKER_GROUND_RATIO;
        renderHiker(trackAngle(x));
      }
    };
    meadowImage.addEventListener("load", handleMeadowLoad);
    if (meadowImage.complete && meadowImage.naturalWidth) handleMeadowLoad();

    return () => {
      launchRef.current = () => undefined;
      window.cancelAnimationFrame(frameHandle);
      window.clearTimeout(reducedTimer);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      meadowImage.removeEventListener("load", handleMeadowLoad);
    };
  }, []);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="backpack-word"
        data-walking="false"
        aria-label="Release miniature Neel backpacking onto the meadow"
        onClick={() => launchRef.current()}
      >
        backpacking
      </button>
      <span ref={layerRef} className="backpack-walk-layer" data-phase="idle" data-frame="0" aria-hidden="true">
        <span ref={hikerRef} className="mini-hiker" data-turning="false">
          <span className="mini-hiker__shadow" />
          <span ref={directionRef} className="mini-hiker__direction">
            <span className="mini-hiker__sprite">
              <img ref={imageRef} src={FRAME_URLS[0]} alt="" draggable={false} />
            </span>
          </span>
        </span>
      </span>
    </>
  );
}
