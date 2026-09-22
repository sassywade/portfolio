"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useMeadowLayerHost } from "./use-meadow-layer-host";
import { MeadowActivityIcon } from "./meadow-activity-icon";

const FRAME_URLS = [
  "/photographer-frame-1-corrected.png",
  "/photographer-frame-2-corrected.png",
  "/photographer-frame-3.png",
  "/photographer-frame-4.png",
  "/photographer-frame-5.png",
] as const;

const PHOTO_SEQUENCE = [
  { frame: 0, minDuration: 980, maxDuration: 2100 },
  { frame: 1, minDuration: 360, maxDuration: 680 },
  { frame: 2, minDuration: 420, maxDuration: 720 },
  { frame: 3, minDuration: 420, maxDuration: 560 },
  { frame: 2, minDuration: 240, maxDuration: 380 },
  { frame: 4, minDuration: 900, maxDuration: 1800 },
] as const;

const RAPID_BURST_SEQUENCE = [
  { frame: 2, duration: 70 },
  { frame: 3, duration: 110 },
  { frame: 2, duration: 65 },
  { frame: 3, duration: 110 },
  { frame: 2, duration: 65 },
  { frame: 3, duration: 110 },
  { frame: 2, duration: 65 },
  { frame: 3, duration: 110 },
  { frame: 2, duration: 65 },
  { frame: 3, duration: 130 },
  { frame: 4, duration: 240 },
] as const;

const SPAWN_DURATION = 220;
const LAND_DURATION = 180;
const PHOTOGRAPHER_GROUND_RATIO = 0.962;
// Match the reference's quiet position in the main dip, independent of the icon.
const PHOTOGRAPHER_ARRIVAL_X_RATIO = 0.44;
const PET_BLOW_PHOTOGRAPHER_EVENT = "portfolio:pet-blow-photographer";

type PhotoPhase = "idle" | "spawn" | "drop" | "land" | "shoot";

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const randomDuration = (min: number, max: number) => Math.round(min + Math.random() * (max - min));

export function PhotoDrop() {
  const meadowHost = useMeadowLayerHost();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const layerRef = useRef<HTMLSpanElement>(null);
  const photographerRef = useRef<HTMLSpanElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const launchRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    const button = buttonRef.current;
    const layer = layerRef.current;
    const photographer = photographerRef.current;
    const photographerImage = imageRef.current;
    if (!button || !layer || !photographer || !photographerImage) return;

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
    let phase: PhotoPhase = "idle";
    let anchoredToMeadowDip = false;
    let phaseStarted = 0;
    let frameHandle = 0;
    let sequenceTimer = 0;
    let reducedTimer = 0;
    let lastTime = 0;
    let inView = true;
    let x = 0;
    let y = 0;
    let velocityY = 0;
    let sequenceIndex = 0;
    let rapidBurstIndex = 0;
    let isRapidBurst = false;

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

    function photographerSize() {
      const styles = window.getComputedStyle(photographer);
      return {
        width: Number.parseFloat(styles.width) || 72,
        height: Number.parseFloat(styles.height) || 100,
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
      // Sink feet and tires just into the blade roots, not onto their tips.
      const grassInset = meadow.dataset.grassReady === "true" ? 4 : 0;
      return meadowBounds.top + surface * meadowBounds.height - layerBounds.top + grassInset;
    }

    function setFrame(index: number) {
      const next = ((index % FRAME_URLS.length) + FRAME_URLS.length) % FRAME_URLS.length;
      layer.dataset.frame = String(next);
      if (photographerImage.getAttribute("src") !== FRAME_URLS[next]) {
        photographerImage.src = FRAME_URLS[next];
      }
    }

    function clearPhotoLoop() {
      window.clearTimeout(sequenceTimer);
      sequenceTimer = 0;
    }

    function runPhotoStep() {
      clearPhotoLoop();
      if (phase !== "shoot" || !inView || reducedMotion.matches) return;

      if (isRapidBurst) {
        const burstStep = RAPID_BURST_SEQUENCE[rapidBurstIndex];
        setFrame(burstStep.frame);
        sequenceTimer = window.setTimeout(() => {
          rapidBurstIndex += 1;
          if (rapidBurstIndex >= RAPID_BURST_SEQUENCE.length) {
            rapidBurstIndex = 0;
            isRapidBurst = false;
            layer.dataset.burst = "false";
            sequenceIndex = 4;
          }
          runPhotoStep();
        }, burstStep.duration);
        return;
      }

      const step = PHOTO_SEQUENCE[sequenceIndex];
      setFrame(step.frame);
      sequenceTimer = window.setTimeout(() => {
        sequenceIndex = (sequenceIndex + 1) % PHOTO_SEQUENCE.length;
        runPhotoStep();
      }, randomDuration(step.minDuration, step.maxDuration));
    }

    function setPhase(next: PhotoPhase, now = performance.now()) {
      phase = next;
      phaseStarted = now;
      layer.dataset.phase = next;
      button.dataset.photographing = next === "idle" ? "false" : "true";
      button.setAttribute("aria-pressed", String(next !== "idle"));
      if (next !== "shoot") {
        isRapidBurst = false;
        rapidBurstIndex = 0;
        layer.dataset.burst = "false";
        clearPhotoLoop();
      }
    }

    function renderPhotographer() {
      const { width } = photographerSize();
      photographer.style.transform = `translate3d(${x - width * 0.5}px, ${y}px, 0)`;
    }

    function schedule() {
      if (frameHandle || phase === "idle" || phase === "shoot" || !inView || reducedMotion.matches) return;
      frameHandle = window.requestAnimationFrame(frame);
    }

    function frame(now: number) {
      frameHandle = 0;
      if (phase === "idle" || phase === "shoot" || !inView || reducedMotion.matches) return;

      const deltaSeconds = lastTime ? Math.min(0.034, Math.max(0.001, (now - lastTime) / 1000)) : 0;
      lastTime = now;
      const { height } = photographerSize();
      const ground = trackY(x) - height * PHOTOGRAPHER_GROUND_RATIO;

      if (phase === "spawn" && now - phaseStarted >= SPAWN_DURATION) {
        velocityY = -12;
        setPhase("drop", now);
      } else if (phase === "drop") {
        const gravity = Math.max(980, layer.getBoundingClientRect().height * 2.15);
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
          sequenceIndex = 0;
          setPhase("shoot", now);
          runPhotoStep();
        }
      }

      renderPhotographer();
      schedule();
    }

    function launch() {
      window.cancelAnimationFrame(frameHandle);
      window.clearTimeout(reducedTimer);
      clearPhotoLoop();
      frameHandle = 0;
      if (phase !== "idle") {
        setPhase("idle");
        return;
      }
      anchoredToMeadowDip = false;
      lastTime = 0;
      sequenceIndex = 0;
      rapidBurstIndex = 0;
      isRapidBurst = false;
      layer.dataset.burst = "false";
      setFrame(0);

      const layerBounds = layer.getBoundingClientRect();
      const buttonBounds = button.getBoundingClientRect();
      const { width, height } = photographerSize();
      x = clamp(buttonBounds.left + buttonBounds.width * 0.5 - layerBounds.left, width * 0.5, layerBounds.width - width * 0.5);
      y = buttonBounds.top + buttonBounds.height * 0.5 - layerBounds.top - height * 0.5;
      velocityY = 0;

      setPhase("idle");
      void photographer.offsetWidth;

      if (reducedMotion.matches) {
        y = trackY(x) - height * PHOTOGRAPHER_GROUND_RATIO;
        setPhase("shoot");
        renderPhotographer();
        reducedTimer = window.setTimeout(() => setFrame(0), 1800);
        return;
      }

      setPhase("spawn");
      renderPhotographer();
      schedule();
    }

    function placeOnMeadow() {
      window.cancelAnimationFrame(frameHandle);
      window.clearTimeout(reducedTimer);
      clearPhotoLoop();
      frameHandle = 0;
      lastTime = 0;
      sequenceIndex = 0;
      rapidBurstIndex = 0;
      isRapidBurst = false;
      layer.dataset.burst = "false";
      setFrame(0);

      const layerBounds = layer.getBoundingClientRect();
      const { width, height } = photographerSize();
      anchoredToMeadowDip = true;
      x = clamp(layerBounds.width * PHOTOGRAPHER_ARRIVAL_X_RATIO, width * 0.5, layerBounds.width - width * 0.5);
      y = trackY(x) - height * PHOTOGRAPHER_GROUND_RATIO;
      velocityY = 0;

      setPhase("shoot");
      renderPhotographer();
      runPhotoStep();
    }

    launchRef.current = launch;

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) {
        lastTime = performance.now();
        if (phase === "shoot") runPhotoStep();
        else schedule();
      } else {
        window.cancelAnimationFrame(frameHandle);
        frameHandle = 0;
        clearPhotoLoop();
      }
    }, { rootMargin: "80px 0px" });
    intersectionObserver.observe(layer);

    const resizeObserver = new ResizeObserver(() => {
      if (phase === "land" || phase === "shoot") {
        const { width, height } = photographerSize();
        const layerWidth = layer.getBoundingClientRect().width;
        x = clamp(anchoredToMeadowDip ? layerWidth * PHOTOGRAPHER_ARRIVAL_X_RATIO : x, width * 0.5, layerWidth - width * 0.5);
        y = trackY(x) - height * PHOTOGRAPHER_GROUND_RATIO;
        renderPhotographer();
      }
    });
    resizeObserver.observe(layer);
    const groundObserver = new MutationObserver(() => {
      if (phase === "land" || phase === "shoot") {
        y = trackY(x) - photographerSize().height * PHOTOGRAPHER_GROUND_RATIO;
        renderPhotographer();
      }
    });
    const meadowSurface = document.querySelector(".meadow");
    if (meadowSurface) groundObserver.observe(meadowSurface, {
      subtree: true, attributes: true, attributeFilter: ["data-grass-ready", "data-meadow-active"],
    });

    const handleMeadowLoad = () => {
      prepareMeadowProfile();
      if (phase === "land" || phase === "shoot") {
        y = trackY(x) - photographerSize().height * PHOTOGRAPHER_GROUND_RATIO;
        renderPhotographer();
      }
    };
    meadowImage.addEventListener("load", handleMeadowLoad);
    if (meadowImage.complete && meadowImage.naturalWidth) handleMeadowLoad();

    if (document.documentElement.dataset.portfolioLayout !== "quiet") placeOnMeadow();

    const handlePetBlow = () => {
      if (phase !== "shoot" || reducedMotion.matches) return;
      isRapidBurst = true;
      rapidBurstIndex = 0;
      layer.dataset.burst = "true";
      runPhotoStep();
    };
    window.addEventListener(PET_BLOW_PHOTOGRAPHER_EVENT, handlePetBlow);

    const handleSoloActor = (event: Event) => {
      const selected = (event as CustomEvent<string>).detail;
      if (selected === "photo") return;
      window.cancelAnimationFrame(frameHandle);
      frameHandle = 0;
      window.clearTimeout(reducedTimer);
      clearPhotoLoop();
      setPhase("idle");
      if (selected === "classic") placeOnMeadow();
    };
    window.addEventListener("portfolio:solo-actor", handleSoloActor);

    return () => {
      window.removeEventListener("portfolio:solo-actor", handleSoloActor);
      launchRef.current = () => undefined;
      window.cancelAnimationFrame(frameHandle);
      window.clearTimeout(reducedTimer);
      clearPhotoLoop();
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      groundObserver.disconnect();
      meadowImage.removeEventListener("load", handleMeadowLoad);
      window.removeEventListener(PET_BLOW_PHOTOGRAPHER_EVENT, handlePetBlow);
    };
  }, [meadowHost]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="photo-word hero-hobby hero-hobby--photo meadow-activity"
        id="photo"
        data-photographing="false"
        aria-pressed="false"
        data-cuelume-hover="tick"
        data-cuelume-press="press"
        data-cuelume-release="release"
        aria-label="Photographer on the meadow"
        onClick={() => launchRef.current()}
      >
        <MeadowActivityIcon activity="photography" />
      </button>
      {meadowHost ? createPortal(
        <span ref={layerRef} className="photo-drop-layer" data-phase="idle" data-frame="0" data-burst="false" aria-hidden="true">
          <span ref={photographerRef} className="mini-photographer">
            <span className="mini-photographer__shadow" />
            <span className="mini-photographer__sprite">
              <img ref={imageRef} src={FRAME_URLS[0]} alt="" draggable={false} />
            </span>
          </span>
        </span>,
        meadowHost,
      ) : null}
    </>
  );
}
