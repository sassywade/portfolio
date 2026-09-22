"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useMeadowLayerHost } from "./use-meadow-layer-host";
import { MeadowActivityIcon } from "./meadow-activity-icon";

const FRAME_URLS = [
  "/bike-rider-frame-1.png",
  "/bike-rider-frame-2.png",
  "/bike-rider-frame-3.png",
] as const;

const SPAWN_DURATION = 220;
const LAND_DURATION = 170;
const TURN_DURATION = 260;
const RIDER_GROUND_RATIO = 0.89;
const PET_BLOW_CYCLIST_EVENT = "portfolio:pet-blow-cyclist";

type RidePhase = "idle" | "spawn" | "drop" | "land" | "ride";

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function BikeRide() {
  const meadowHost = useMeadowLayerHost();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const layerRef = useRef<HTMLSpanElement>(null);
  const riderRef = useRef<HTMLSpanElement>(null);
  const directionRef = useRef<HTMLSpanElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const launchRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    const button = buttonRef.current;
    const layer = layerRef.current;
    const rider = riderRef.current;
    const directionNode = directionRef.current;
    const riderImage = imageRef.current;
    if (!button || !layer || !rider || !directionNode || !riderImage) return;

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
    let phase: RidePhase = "idle";
    let phaseStarted = 0;
    let frameHandle = 0;
    let lastTime = 0;
    let inView = true;
    let x = 0;
    let y = 0;
    let velocityY = 0;
    let direction = 1;
    let rideDistance = 0;
    let currentSpeed = 0;
    let smoothedGrade = 0;
    let currentTrackAngle = 0;
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

    function riderSize() {
      return Number.parseFloat(window.getComputedStyle(rider).width) || 64;
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

    function trackAngle(localX: number) {
      const sampleDistance = Math.max(8, riderSize() * 0.18);
      const before = trackY(localX - sampleDistance);
      const after = trackY(localX + sampleDistance);
      return Math.atan2(after - before, sampleDistance * 2);
    }

    function setFrame(index: number) {
      const next = ((index % FRAME_URLS.length) + FRAME_URLS.length) % FRAME_URLS.length;
      if (next === currentFrame && riderImage.getAttribute("src") === FRAME_URLS[next]) return;
      currentFrame = next;
      riderImage.src = FRAME_URLS[next];
    }

    function setPhase(next: RidePhase, now = performance.now()) {
      phase = next;
      phaseStarted = now;
      layer.dataset.phase = next;
      button.dataset.riding = next === "idle" ? "false" : "true";
      button.setAttribute("aria-pressed", String(next !== "idle"));
      if (next === "idle") rider.dataset.turning = "false";
      if (next === "idle") layer.dataset.terrain = "level";
    }

    function renderRider(angle = 0) {
      const size = riderSize();
      rider.style.transform = `translate3d(${x - size * 0.5}px, ${y}px, 0) rotate(${angle}rad)`;
      layer.dataset.direction = direction === 1 ? "right" : "left";
      directionNode.style.setProperty("--bike-direction", String(direction));
    }

    function schedule() {
      if (frameHandle || phase === "idle" || !inView || reducedMotion.matches) return;
      frameHandle = window.requestAnimationFrame(frame);
    }

    function beginTurn(now: number, nextDirection = direction * -1) {
      direction = nextDirection;
      turningUntil = now + TURN_DURATION;
      rider.dataset.turning = "true";
      layer.dataset.direction = direction === 1 ? "right" : "left";
      directionNode.style.setProperty("--bike-direction", String(direction));
    }

    function frame(now: number) {
      frameHandle = 0;
      if (phase === "idle" || !inView || reducedMotion.matches) return;

      const deltaSeconds = lastTime ? Math.min(0.034, Math.max(0.001, (now - lastTime) / 1000)) : 0;
      lastTime = now;
      const size = riderSize();
      const layerWidth = layer.getBoundingClientRect().width;
      const ground = trackY(x) - size * RIDER_GROUND_RATIO;
      const baseRideSpeed = clamp(layerWidth * 0.068, 60, 92);

      if (phase === "spawn" && now - phaseStarted >= SPAWN_DURATION) {
        velocityY = -18;
        setPhase("drop", now);
      } else if (phase === "drop") {
        const gravity = Math.max(980, layer.getBoundingClientRect().height * 2.15);
        velocityY += gravity * deltaSeconds;
        y += velocityY * deltaSeconds;
        if (y >= ground) {
          y = ground;
          velocityY = 0;
          currentTrackAngle = trackAngle(x);
          setPhase("land", now);
        }
      } else if (phase === "land") {
        y = ground;
        currentTrackAngle = trackAngle(x);
        if (now - phaseStarted >= LAND_DURATION) {
          rideDistance = 0;
          currentSpeed = baseRideSpeed;
          smoothedGrade = 0;
          setPhase("ride", now);
        }
      } else if (phase === "ride") {
        const margin = size * 0.54;

        if (turningUntil && now < turningUntil) {
          y = ground;
        } else {
          if (turningUntil) {
            turningUntil = 0;
            rider.dataset.turning = "false";
          }

          // Screen-space y grows downward, so a positive directional grade is a descent.
          const travelGrade = clamp(Math.sin(currentTrackAngle) * direction, -0.34, 0.34);
          const gradeFollow = 1 - Math.exp(-deltaSeconds / 0.26);
          smoothedGrade += (travelGrade - smoothedGrade) * gradeFollow;
          const rollingPull = (baseRideSpeed - currentSpeed) * 1.45;
          const slopeGravity = smoothedGrade * 120;
          currentSpeed = clamp(
            currentSpeed + (rollingPull + slopeGravity) * deltaSeconds,
            baseRideSpeed * 0.72,
            baseRideSpeed * 1.32,
          );
          layer.dataset.terrain = smoothedGrade > 0.025
            ? "downhill"
            : smoothedGrade < -0.025
              ? "uphill"
              : "level";

          x += direction * currentSpeed * deltaSeconds;
          rideDistance += currentSpeed * deltaSeconds;

          if (x >= layerWidth - margin) {
            x = layerWidth - margin;
            beginTurn(now);
          } else if (x <= margin) {
            x = margin;
            beginTurn(now);
          }

          y = trackY(x) - size * RIDER_GROUND_RATIO;
          currentTrackAngle = trackAngle(x);
          setFrame(Math.floor(rideDistance / 9));
        }
      }

      renderRider(phase === "ride" || phase === "land" ? currentTrackAngle : 0);
      schedule();
    }

    function launch() {
      window.cancelAnimationFrame(frameHandle);
      frameHandle = 0;
      if (phase !== "idle") {
        setPhase("idle");
        return;
      }
      lastTime = 0;
      turningUntil = 0;
      rideDistance = 0;
      currentSpeed = 0;
      smoothedGrade = 0;
      currentTrackAngle = 0;
      direction = 1;
      setFrame(0);

      const layerBounds = layer.getBoundingClientRect();
      const buttonBounds = button.getBoundingClientRect();
      const size = riderSize();
      x = clamp(buttonBounds.left + buttonBounds.width * 0.5 - layerBounds.left, size * 0.54, layerBounds.width - size * 0.54);
      y = buttonBounds.top + buttonBounds.height * 0.5 - layerBounds.top - size * 0.52;
      velocityY = 0;

      setPhase("idle");
      void rider.offsetWidth;

      if (reducedMotion.matches) {
        y = trackY(x) - size * RIDER_GROUND_RATIO;
        currentTrackAngle = trackAngle(x);
        setPhase("land");
        renderRider(currentTrackAngle);
        return;
      }

      setPhase("spawn");
      renderRider();
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
      if (phase === "ride" || phase === "land") {
        const size = riderSize();
        x = clamp(x, size * 0.54, layer.getBoundingClientRect().width - size * 0.54);
        y = trackY(x) - size * RIDER_GROUND_RATIO;
        currentTrackAngle = trackAngle(x);
        renderRider(currentTrackAngle);
      }
    });
    resizeObserver.observe(layer);

    const handleMeadowLoad = () => {
      prepareMeadowProfile();
      if (phase === "ride" || phase === "land") {
        y = trackY(x) - riderSize() * RIDER_GROUND_RATIO;
        currentTrackAngle = trackAngle(x);
        renderRider(currentTrackAngle);
      }
    };
    meadowImage.addEventListener("load", handleMeadowLoad);
    if (meadowImage.complete && meadowImage.naturalWidth) handleMeadowLoad();

    const handlePetBlow = (event: Event) => {
      if (phase !== "ride" || reducedMotion.matches) return;
      const requestedDirection = (event as CustomEvent<{ direction?: -1 | 1 }>).detail?.direction;
      const nextDirection = requestedDirection === -1 || requestedDirection === 1
        ? requestedDirection
        : direction * -1;
      if (nextDirection === direction) return;
      beginTurn(performance.now(), nextDirection);
      lastTime = performance.now();
      schedule();
    };
    window.addEventListener(PET_BLOW_CYCLIST_EVENT, handlePetBlow);

    const handleSoloActor = (event: Event) => {
      const selected = (event as CustomEvent<string>).detail;
      if (selected === "bike") return;
      window.cancelAnimationFrame(frameHandle);
      frameHandle = 0;
      setPhase("idle");
    };
    window.addEventListener("portfolio:solo-actor", handleSoloActor);

    return () => {
      window.removeEventListener("portfolio:solo-actor", handleSoloActor);
      launchRef.current = () => undefined;
      window.cancelAnimationFrame(frameHandle);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      meadowImage.removeEventListener("load", handleMeadowLoad);
      window.removeEventListener(PET_BLOW_CYCLIST_EVENT, handlePetBlow);
    };
  }, [meadowHost]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="bike-word hero-hobby hero-hobby--bike meadow-activity"
        data-riding="false"
        aria-pressed="false"
        data-cuelume-hover="tick"
        data-cuelume-press="press"
        data-cuelume-release="release"
        aria-label="Cyclist on the meadow"
        onClick={() => launchRef.current()}
      >
        <MeadowActivityIcon activity="cycling" />
      </button>
      {meadowHost ? createPortal(
        <span ref={layerRef} className="bike-ride-layer" data-phase="idle" data-direction="right" data-terrain="level" aria-hidden="true">
          <span ref={riderRef} className="bike-rider" data-turning="false">
            <span className="bike-rider__shadow" />
            <span ref={directionRef} className="bike-rider__direction">
              <span className="bike-rider__sprite">
                <img ref={imageRef} src={FRAME_URLS[0]} alt="" draggable={false} />
              </span>
            </span>
          </span>
        </span>,
        meadowHost,
      ) : null}
    </>
  );
}
