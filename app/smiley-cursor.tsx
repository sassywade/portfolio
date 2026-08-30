"use client";

/* Native local images keep cursor-frame swaps immediate and avoid optimizer overhead. */
/* eslint-disable @next/next/no-img-element */

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function SmileyCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const cursor = cursorRef.current;
    const root = document.documentElement;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hasFinePointer = window.matchMedia("(pointer: fine)");

    if (!cursor || pathname !== "/" || !hasFinePointer.matches || prefersReducedMotion.matches) {
      return;
    }

    root.classList.add("has-cursor-pet");

    let frame: number | null = null;
    let lastX = 0;
    let lastY = 0;
    let lastMoveTime = performance.now();
    let targetX = 0;
    let targetY = 0;
    let pointerX = 0;
    let pointerY = 0;
    let inputX = 0;
    let inputY = 0;
    let currentX = 0;
    let currentY = 0;
    let targetFollowDistance = 82;
    let currentFollowDistance = 82;
    let motionLevel = 0;
    let windStartedAt: number | null = null;
    let previousFrameTime = performance.now();
    let hasPointerPosition = false;
    let isPastWork = false;

    const updatePetState = (timestamp: number) => {
      const elapsed = Math.min(100, timestamp - previousFrameTime);
      previousFrameTime = timestamp;
      motionLevel *= Math.pow(0.94, Math.max(1, elapsed / 16.67));

      const sinceMove = timestamp - lastMoveTime;
      const wantsToBlow = motionLevel > 0.32 && sinceMove < 360;
      const isActive = motionLevel > 0.16 && sinceMove < 650;

      const nextState = !isActive
        ? "idle"
        : motionLevel > 0.74
          ? "strained"
          : motionLevel > 0.53
            ? "strong"
            : "light";

      if (cursor.dataset.state !== nextState) {
        cursor.dataset.state = nextState;
      }

      if (wantsToBlow) {
        windStartedAt ??= timestamp;
        if (timestamp - windStartedAt > 150) {
          cursor.dataset.wind = "on";
        }
      } else {
        windStartedAt = null;
        cursor.dataset.wind = "off";
      }
    };

    const setMotionVariables = (timestamp: number) => {
      const isResting = timestamp - lastMoveTime > 90;
      const nextFollowDistance = isResting ? 82 : targetFollowDistance;
      const positionEase = 0.045;

      updatePetState(timestamp);

      pointerX += (inputX - pointerX) * 0.14;
      pointerY += (inputY - pointerY) * 0.14;

      currentFollowDistance += (nextFollowDistance - currentFollowDistance) * 0.06;
      targetX = pointerX - 15 - currentFollowDistance;
      targetY = pointerY - 21;

      currentX += (targetX - currentX) * positionEase;
      currentY += (targetY - currentY) * 0.075;

      cursor.style.setProperty("--smiley-x", `${currentX}px`);
      cursor.style.setProperty("--smiley-y", `${currentY}px`);

      const stillSettling =
        Math.abs(targetX - currentX) > 0.2 ||
        Math.abs(targetY - currentY) > 0.2 ||
        Math.abs(nextFollowDistance - currentFollowDistance) > 0.1 ||
        Math.abs(inputX - pointerX) > 0.2 ||
        Math.abs(inputY - pointerY) > 0.2 ||
        motionLevel > 0.01;

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

    const handleScroll = () => {
      const work = document.getElementById("work");
      const nextIsPastWork = Boolean(work && work.getBoundingClientRect().bottom <= 0);

      if (nextIsPastWork === isPastWork) {
        return;
      }

      isPastWork = nextIsPastWork;

      if (isPastWork) {
        cursor.classList.remove("is-visible");
        if (frame !== null) {
          window.cancelAnimationFrame(frame);
          frame = null;
        }
      } else if (hasPointerPosition) {
        cursor.classList.add("is-visible");
        scheduleFrame();
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse") {
        return;
      }

      if (isPastWork) {
        return;
      }

      const timestamp = performance.now();

      if (!hasPointerPosition) {
        lastX = event.clientX;
        lastY = event.clientY;
        lastMoveTime = timestamp;
        inputX = pointerX = event.clientX;
        inputY = pointerY = event.clientY;
        currentFollowDistance = targetFollowDistance = 82;
        motionLevel = 0;
        windStartedAt = null;
        cursor.dataset.state = "idle";
        cursor.dataset.wind = "off";
        targetX = currentX = event.clientX - 15 - 82;
        targetY = currentY = event.clientY - 21;
        hasPointerPosition = true;
        cursor.classList.add("is-visible");
        scheduleFrame();
        return;
      }

      const deltaX = event.clientX - lastX;
      const deltaY = event.clientY - lastY;
      const distance = Math.hypot(deltaX, deltaY);

      motionLevel = Math.max(motionLevel, Math.min(1, Math.max(0, (distance - 6) / 27)));
      inputX = event.clientX;
      inputY = event.clientY;
      targetFollowDistance = 82 + Math.min(24, distance * 0.18);
      lastX = event.clientX;
      lastY = event.clientY;
      lastMoveTime = timestamp;

      cursor.classList.add("is-visible");
      scheduleFrame();
    };

    const handlePointerLeave = () => {
      cursor.classList.remove("is-visible");
    };

    const handlePointerOut = (event: PointerEvent) => {
      if (!event.relatedTarget) {
        handlePointerLeave();
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerout", handlePointerOut);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerout", handlePointerOut);
      window.removeEventListener("scroll", handleScroll);
      root.classList.remove("has-cursor-pet");
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [pathname]);

  return (
    <div className="smiley-cursor" ref={cursorRef} data-state="idle" data-wind="off" aria-hidden="true">
      <div className="smiley-cursor__direction">
        <img className="smiley-cursor__asset smiley-cursor__asset--idle smiley-cursor__face-frame" src="/pet/pet-idle.png" alt="" />
        <img className="smiley-cursor__asset smiley-cursor__asset--light smiley-cursor__face-frame" src="/pet/pet-light.png" alt="" />
        <img className="smiley-cursor__asset smiley-cursor__asset--light smiley-cursor__wind-frame" src="/pet/pet-light.png" alt="" />
        <img className="smiley-cursor__asset smiley-cursor__asset--strong smiley-cursor__face-frame" src="/pet/pet-strong.png" alt="" />
        <img className="smiley-cursor__asset smiley-cursor__asset--strong smiley-cursor__wind-frame" src="/pet/pet-strong.png" alt="" />
        <img className="smiley-cursor__asset smiley-cursor__asset--strained smiley-cursor__face-frame" src="/pet/pet-strained.png" alt="" />
        <img className="smiley-cursor__asset smiley-cursor__asset--strained smiley-cursor__wind-frame" src="/pet/pet-strained.png" alt="" />
      </div>
    </div>
  );
}
