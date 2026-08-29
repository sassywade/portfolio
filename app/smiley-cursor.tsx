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

      targetX = event.clientX - 23;
      targetY = event.clientY - 32;
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
        <img className="smiley-cursor__asset smiley-cursor__asset--idle" src="/pet/pet-idle.png" alt="" />
        <img className="smiley-cursor__asset smiley-cursor__asset--light" src="/pet/pet-light.png" alt="" />
        <img className="smiley-cursor__asset smiley-cursor__asset--strong" src="/pet/pet-strong.png" alt="" />
        <img className="smiley-cursor__asset smiley-cursor__asset--strained" src="/pet/pet-strained.png" alt="" />
      </div>
    </div>
  );
}
