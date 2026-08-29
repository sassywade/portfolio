"use client";

import { useEffect, useRef } from "react";

export function SmileyCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const root = document.documentElement;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hasFinePointer = window.matchMedia("(pointer: fine)");

    if (!cursor || !hasFinePointer.matches || prefersReducedMotion.matches) {
      return;
    }

    root.classList.add("has-smiley-cursor");

    let frame: number | null = null;
    let lastX = 0;
    let lastY = 0;
    let lastTime = performance.now();
    let lastMoveTime = lastTime;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let targetAngle = 0;
    let currentAngle = 0;
    let targetBlow = 0;
    let currentBlow = 0;
    let hasPointerPosition = false;

    const setMotionVariables = (timestamp: number) => {
      const isResting = timestamp - lastMoveTime > 90;
      const nextBlow = isResting ? 0 : targetBlow;

      currentX += (targetX - currentX) * 0.55;
      currentY += (targetY - currentY) * 0.55;
      currentBlow += (nextBlow - currentBlow) * 0.18;

      const angleDelta = Math.atan2(
        Math.sin(targetAngle - currentAngle),
        Math.cos(targetAngle - currentAngle),
      );
      currentAngle += angleDelta * 0.28;

      cursor.style.setProperty("--smiley-x", `${currentX}px`);
      cursor.style.setProperty("--smiley-y", `${currentY}px`);
      cursor.style.setProperty("--smiley-angle", `${currentAngle}rad`);
      cursor.style.setProperty("--smiley-air-opacity", `${currentBlow}`);
      cursor.style.setProperty(
        "--smiley-wind-opacity",
        `${currentBlow > 0.03 ? 0.18 + currentBlow * 0.75 : 0}`,
      );
      cursor.style.setProperty("--smiley-air-stretch", `${0.55 + currentBlow * 0.7}`);
      cursor.style.setProperty("--smiley-wind-duration", `${850 - currentBlow * 220}ms`);
      cursor.style.setProperty("--smiley-face-scale", `${1 + currentBlow * 0.05}`);
      cursor.style.setProperty("--smiley-eye-scale", `${1 - currentBlow * 0.35}`);
      cursor.style.setProperty("--smiley-mouth-scale", `${1 - currentBlow * 0.22}`);
      cursor.style.setProperty("--smiley-cheek-opacity", `${currentBlow * 0.7}`);
      cursor.dataset.state =
        currentBlow > 0.5
          ? "strained"
          : currentBlow > 0.23
            ? "strong"
            : currentBlow > 0.03
              ? "light"
              : "idle";

      const stillSettling =
        Math.abs(targetX - currentX) > 0.2 ||
        Math.abs(targetY - currentY) > 0.2 ||
        Math.abs(nextBlow - currentBlow) > 0.01;

      if (stillSettling) {
        frame = window.requestAnimationFrame(setMotionVariables);
      } else {
        frame = null;
      }
    };

    const scheduleFrame = () => {
      if (frame === null) {
        frame = window.requestAnimationFrame(setMotionVariables);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse") {
        return;
      }

      const timestamp = performance.now();

      if (!hasPointerPosition) {
        lastX = event.clientX;
        lastY = event.clientY;
        lastTime = timestamp;
        lastMoveTime = timestamp;
        targetX = currentX = event.clientX - 31;
        targetY = currentY = event.clientY - 36;
        hasPointerPosition = true;
        cursor.classList.add("is-visible");
        scheduleFrame();
        return;
      }

      const elapsed = Math.max(8, timestamp - lastTime);
      const distance = Math.hypot(event.clientX - lastX, event.clientY - lastY);
      const velocity = distance / elapsed;
      const intensity = Math.min(0.72, Math.max(0, (velocity - 0.12) / 2.15));

      targetX = event.clientX - 31;
      targetY = event.clientY - 36;
      if (distance > 0.5) {
        targetAngle = Math.atan2(event.clientY - lastY, event.clientX - lastX);
      }
      targetBlow = intensity;
      lastX = event.clientX;
      lastY = event.clientY;
      lastTime = timestamp;
      lastMoveTime = timestamp;

      cursor.classList.add("is-visible");
      scheduleFrame();
    };

    const handlePointerLeave = () => {
      cursor.classList.remove("is-visible");
      targetBlow = 0;
    };

    const handlePointerOut = (event: PointerEvent) => {
      if (!event.relatedTarget) {
        handlePointerLeave();
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerout", handlePointerOut);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerout", handlePointerOut);
      root.classList.remove("has-smiley-cursor");
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  return (
    <div className="smiley-cursor" ref={cursorRef} data-state="idle" aria-hidden="true">
      <div className="smiley-cursor__direction">
        <svg className="smiley-cursor__art" viewBox="0 0 112 72" role="presentation">
          <path
            className="smiley-cursor__outline"
            d="M32 6C17 6 9 15 7 28C4 42 8 56 20 64C30 69 44 67 52 61C59 54 60 39 58 25C55 12 47 6 32 6Z"
          />

          <g className="smiley-cursor__state smiley-cursor__state--idle">
            <path className="smiley-cursor__feature" d="M22 27C24 24 28 24 29 27C29 30 24 31 22 27Z" />
            <path className="smiley-cursor__feature" d="M42 27C44 24 48 24 49 27C49 30 44 31 42 27Z" />
            <path className="smiley-cursor__feature" d="M22 45H44" />
          </g>

          <g className="smiley-cursor__state smiley-cursor__state--light">
            <path className="smiley-cursor__feature" d="M21 26C23 23 28 23 29 26C29 30 23 30 21 26Z" />
            <path className="smiley-cursor__feature" d="M42 26C44 23 49 23 50 26C50 30 44 30 42 26Z" />
            <ellipse className="smiley-cursor__feature" cx="33" cy="44" rx="4" ry="5" />
            <path className="smiley-cursor__wind-line" d="M60 42C71 42 80 41 89 36C94 33 96 37 93 40" />
            <path className="smiley-cursor__wind-line" d="M61 47C71 47 78 46 84 43" />
          </g>

          <g className="smiley-cursor__state smiley-cursor__state--strong">
            <path className="smiley-cursor__feature" d="M18 23L28 21" />
            <path className="smiley-cursor__feature" d="M41 22L50 20" />
            <path className="smiley-cursor__feature" d="M21 27C23 24 28 24 29 28C28 31 23 31 21 27Z" />
            <path className="smiley-cursor__feature" d="M41 26C43 23 48 23 49 27C48 30 43 30 41 26Z" />
            <path className="smiley-cursor__feature" d="M29 43C29 37 39 37 39 43C39 48 29 48 29 43Z" />
            <path className="smiley-cursor__wind-line" d="M59 40C71 40 81 37 90 31C97 27 101 33 98 38C96 42 91 42 89 38" />
            <path className="smiley-cursor__wind-line" d="M59 46C72 46 81 44 90 40" />
            <path className="smiley-cursor__wind-line" d="M66 51C76 51 83 49 89 47" />
          </g>

          <g className="smiley-cursor__state smiley-cursor__state--strained">
            <path className="smiley-cursor__feature" d="M17 22C20 20 24 21 28 20" />
            <path className="smiley-cursor__feature" d="M40 20C44 19 47 20 50 22" />
            <path className="smiley-cursor__feature" d="M20 28C21 23 28 22 30 27C30 32 22 33 20 28Z" />
            <circle className="smiley-cursor__pupil" cx="25" cy="27" r="2" />
            <path className="smiley-cursor__feature" d="M40 27C41 22 48 22 50 27C50 32 42 32 40 27Z" />
            <circle className="smiley-cursor__pupil" cx="45" cy="27" r="2" />
            <path className="smiley-cursor__feature smiley-cursor__feature--fill" d="M27 42C27 35 40 35 41 42C40 50 29 51 27 42Z" />
            <ellipse className="smiley-cursor__mouth-hole" cx="34" cy="43" rx="4" ry="5" />
            <path className="smiley-cursor__wind-line" d="M59 39C70 39 81 34 91 27C99 21 105 28 101 35C98 41 92 42 88 37" />
            <path className="smiley-cursor__wind-line" d="M59 45C73 45 85 42 97 36" />
            <path className="smiley-cursor__wind-line" d="M62 51C75 52 85 49 94 46" />
            <path className="smiley-cursor__wind-line" d="M72 56C82 57 88 55 94 52" />
          </g>
        </svg>
      </div>
    </div>
  );
}
