"use client";

import { type CSSProperties, useEffect, useRef } from "react";

const PET_STRIPS = [
  "/top-pets/top-pets-neutral.png",
  "/top-pets/top-pets-sad.png",
  "/top-pets/top-pets-angry.png",
  "/top-pets/top-pets-furious.png",
] as const;

const WHEEL_RELEASE_DELAY = 120;
const FRAME_COUNT = PET_STRIPS.length;

type PetLayerStyle = CSSProperties & {
  "--top-pet-frame-opacity": number;
};

const clamp = (value: number, min: number, max: number) => (
  Math.max(min, Math.min(max, value))
);

export function TopPetPull() {
  const pullRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pull = pullRef.current;
    if (!pull) return;

    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let pullPosition = 0;
    let rawPull = 0;
    let springVelocity = 0;
    let springFrame = 0;
    let releaseTimer = 0;
    let touchStartY: number | null = null;
    let lastSpringTime = 0;

    const maxPull = () => Math.min(190, Math.max(132, window.innerHeight * 0.22));

    const rubberBand = (distance: number) => {
      const limit = maxPull();
      return limit * (1 - Math.exp(-Math.max(0, distance) / (limit * 0.95)));
    };

    const commit = (nextPosition: number) => {
      pullPosition = Math.max(-14, nextPosition);
      const reveal = Math.max(0, pullPosition);
      const progress = clamp(reveal / maxPull(), 0, 1);
      const framePosition = progress * (FRAME_COUNT - 1);
      const firstFrame = Math.floor(framePosition);
      const secondFrame = Math.min(FRAME_COUNT - 1, firstFrame + 1);
      const frameMix = framePosition - firstFrame;
      const frameWeights = PET_STRIPS.map((_, index) => {
        if (firstFrame === secondFrame) return index === firstFrame ? 1 : 0;
        if (index === firstFrame) return 1 - frameMix;
        if (index === secondFrame) return frameMix;
        return 0;
      });
      const stripOpacity = 0.5 + progress * 0.5;

      root.style.setProperty("--top-pet-pull-y", `${pullPosition.toFixed(2)}px`);
      root.style.setProperty("--top-pet-reveal-y", `${reveal.toFixed(2)}px`);
      root.style.setProperty("--top-pet-strip-opacity", stripOpacity.toFixed(3));
      frameWeights.forEach((weight, index) => {
        root.style.setProperty(`--top-pet-frame-${index}`, weight.toFixed(3));
      });

      if (reveal > 0.2) {
        root.dataset.topPetActive = "true";
      }
    };

    const finish = () => {
      pullPosition = 0;
      rawPull = 0;
      springVelocity = 0;
      lastSpringTime = 0;
      root.style.setProperty("--top-pet-pull-y", "0px");
      root.style.setProperty("--top-pet-reveal-y", "0px");
      root.style.setProperty("--top-pet-strip-opacity", "0.5");
      root.style.setProperty("--top-pet-frame-0", "1");
      root.style.setProperty("--top-pet-frame-1", "0");
      root.style.setProperty("--top-pet-frame-2", "0");
      root.style.setProperty("--top-pet-frame-3", "0");
      delete root.dataset.topPetActive;
      delete root.dataset.topPetPulling;
    };

    const cancelSpring = () => {
      if (!springFrame) return;
      window.cancelAnimationFrame(springFrame);
      springFrame = 0;
      lastSpringTime = 0;
    };

    const release = () => {
      window.clearTimeout(releaseTimer);
      rawPull = 0;
      delete root.dataset.topPetPulling;

      if (reducedMotion.matches) {
        cancelSpring();
        finish();
        return;
      }

      cancelSpring();
      springVelocity = 0;

      const springBack = (now: number) => {
        const step = lastSpringTime
          ? Math.min(2, (now - lastSpringTime) / 16.667)
          : 1;
        lastSpringTime = now;
        springVelocity += -pullPosition * 0.12 * step;
        springVelocity *= Math.pow(0.74, step);
        commit(pullPosition + springVelocity * step);

        if (Math.abs(pullPosition) < 0.12 && Math.abs(springVelocity) < 0.12) {
          springFrame = 0;
          finish();
          return;
        }

        springFrame = window.requestAnimationFrame(springBack);
      };

      springFrame = window.requestAnimationFrame(springBack);
    };

    const scheduleRelease = () => {
      window.clearTimeout(releaseTimer);
      releaseTimer = window.setTimeout(release, WHEEL_RELEASE_DELAY);
    };

    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey || window.scrollY > 0.5) return;
      const modeScale = event.deltaMode === WheelEvent.DOM_DELTA_LINE
        ? 16
        : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
          ? window.innerHeight
          : 1;
      const delta = event.deltaY * modeScale;

      if (delta < 0) {
        event.preventDefault();
        cancelSpring();
        root.dataset.topPetPulling = "true";
        rawPull = clamp(rawPull - delta, 0, 1200);
        commit(rubberBand(rawPull));
        scheduleRelease();
        return;
      }

      if (pullPosition > 0) {
        event.preventDefault();
        cancelSpring();
        rawPull = Math.max(0, rawPull - delta * 1.35);
        commit(rubberBand(rawPull));
        if (rawPull <= 0.5) release();
        else scheduleRelease();
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (window.scrollY > 0.5 || event.touches.length !== 1) return;
      touchStartY = event.touches[0].clientY;
      rawPull = 0;
      cancelSpring();
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (touchStartY === null || event.touches.length !== 1 || window.scrollY > 0.5) return;
      const distance = event.touches[0].clientY - touchStartY;
      if (distance <= 0 && pullPosition <= 0) return;
      event.preventDefault();
      root.dataset.topPetPulling = "true";
      rawPull = clamp(distance * 1.15, 0, 1200);
      commit(rubberBand(rawPull));
    };

    const handleTouchEnd = () => {
      if (touchStartY === null) return;
      touchStartY = null;
      if (pullPosition > 0) release();
    };

    const handleScroll = () => {
      if (window.scrollY <= 0.5 || pullPosition <= 0) return;
      cancelSpring();
      window.clearTimeout(releaseTimer);
      finish();
    };

    finish();
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("touchcancel", handleTouchEnd, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      cancelSpring();
      window.clearTimeout(releaseTimer);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
      window.removeEventListener("scroll", handleScroll);
      finish();
    };
  }, []);

  return (
    <div ref={pullRef} className="top-pet-pull" aria-hidden="true">
      <div className="top-pet-pull__strip">
        {PET_STRIPS.map((src, index) => (
          <span
            className="top-pet-pull__frame"
            key={src}
            style={{
              backgroundImage: `url(${src})`,
              "--top-pet-frame-opacity": `var(--top-pet-frame-${index})`,
            } as PetLayerStyle}
          />
        ))}
      </div>
    </div>
  );
}
