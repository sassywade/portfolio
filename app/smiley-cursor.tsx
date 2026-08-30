"use client";

/* Native local images keep cursor-frame swaps immediate and avoid optimizer overhead. */
/* eslint-disable @next/next/no-img-element */

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const IDLE_MISCHIEF_DELAY = 1500;
const IDLE_APPROACH_DURATION = 950;
const IDLE_CLOSE_DISTANCE = 46;
const IDLE_HUFF_CYCLE = 1450;
const IDLE_HUFF_STATES = ["light", "strong", "strained"] as const;

const easeInOutCubic = (value: number) => (
  value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2
);

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
    let idleTimer: number | null = null;
    let idleStartedAt: number | null = null;

    const clearIdleTimer = () => {
      if (idleTimer !== null) {
        window.clearTimeout(idleTimer);
        idleTimer = null;
      }
    };

    const stopIdleMischief = () => {
      clearIdleTimer();
      idleStartedAt = null;
      cursor.dataset.idle = "off";
      cursor.dataset.wind = "off";
      windStartedAt = null;
    };

    const updatePetState = (timestamp: number) => {
      const elapsed = Math.min(100, timestamp - previousFrameTime);
      previousFrameTime = timestamp;
      motionLevel *= Math.pow(0.94, Math.max(1, elapsed / 16.67));

      if (idleStartedAt !== null) {
        const idleElapsed = timestamp - idleStartedAt;
        windStartedAt = null;

        if (idleElapsed < IDLE_APPROACH_DURATION) {
          cursor.dataset.idle = "approach";
          cursor.dataset.state = "idle";
          cursor.dataset.wind = "off";
          return;
        }

        const huffElapsed = idleElapsed - IDLE_APPROACH_DURATION;
        const cycleIndex = Math.floor(huffElapsed / IDLE_HUFF_CYCLE);
        const cycleTime = huffElapsed % IDLE_HUFF_CYCLE;
        const huffState = IDLE_HUFF_STATES[cycleIndex % IDLE_HUFF_STATES.length];
        const isPreparing = cycleTime < 240;
        const isBlowing = cycleTime >= 240 && cycleTime < 860;
        const isRecovering = cycleTime >= 860 && cycleTime < 1040;

        cursor.dataset.idle = "huff";
        cursor.dataset.state = isPreparing || isBlowing || isRecovering ? huffState : "idle";
        cursor.dataset.wind = isBlowing ? "on" : "off";
        return;
      }

      cursor.dataset.idle = "off";

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
      let nextFollowDistance = isResting ? 82 : targetFollowDistance;
      let idleOffsetX = 0;
      let idleOffsetY = 0;
      let positionEase = 0.045;

      if (idleStartedAt !== null) {
        const idleElapsed = timestamp - idleStartedAt;
        positionEase = 0.052;

        if (idleElapsed < IDLE_APPROACH_DURATION) {
          const rawProgress = Math.min(1, Math.max(0, idleElapsed / IDLE_APPROACH_DURATION));
          const progress = easeInOutCubic(rawProgress);
          nextFollowDistance = 82 + (IDLE_CLOSE_DISTANCE - 82) * progress;
          idleOffsetY = -Math.sin(rawProgress * Math.PI) * 7;
        } else {
          const huffTime = (idleElapsed - IDLE_APPROACH_DURATION) % IDLE_HUFF_CYCLE;
          const isBlowing = huffTime >= 240 && huffTime < 860;
          nextFollowDistance = IDLE_CLOSE_DISTANCE;
          idleOffsetX = isBlowing ? 2.2 : -Math.sin((huffTime / IDLE_HUFF_CYCLE) * Math.PI) * 1.2;
          idleOffsetY = -Math.sin((huffTime / IDLE_HUFF_CYCLE) * Math.PI * 2) * 1.1;
        }
      }

      updatePetState(timestamp);

      pointerX += (inputX - pointerX) * 0.14;
      pointerY += (inputY - pointerY) * 0.14;

      currentFollowDistance += (nextFollowDistance - currentFollowDistance) * 0.06;
      targetX = pointerX - 15 - currentFollowDistance + idleOffsetX;
      targetY = pointerY - 21 + idleOffsetY;

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
        motionLevel > 0.01 ||
        idleStartedAt !== null;

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

    const armIdleMischief = () => {
      clearIdleTimer();
      if (!hasPointerPosition || isPastWork) return;

      const remainingDelay = Math.max(0, IDLE_MISCHIEF_DELAY - (performance.now() - lastMoveTime));
      idleTimer = window.setTimeout(() => {
        idleTimer = null;
        if (!hasPointerPosition || isPastWork) return;
        idleStartedAt = performance.now();
        motionLevel = 0;
        windStartedAt = null;
        cursor.dataset.idle = "approach";
        cursor.dataset.state = "idle";
        cursor.dataset.wind = "off";
        scheduleFrame();
      }, remainingDelay);
    };

    const handleScroll = () => {
      const work = document.getElementById("work");
      const nextIsPastWork = Boolean(work && work.getBoundingClientRect().bottom <= 0);

      if (nextIsPastWork === isPastWork) {
        return;
      }

      isPastWork = nextIsPastWork;

      if (isPastWork) {
        stopIdleMischief();
        cursor.classList.remove("is-visible");
        if (frame !== null) {
          window.cancelAnimationFrame(frame);
          frame = null;
        }
      } else if (hasPointerPosition) {
        lastMoveTime = performance.now();
        cursor.classList.add("is-visible");
        scheduleFrame();
        armIdleMischief();
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
      stopIdleMischief();

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
        armIdleMischief();
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
      armIdleMischief();
    };

    const handlePointerLeave = () => {
      stopIdleMischief();
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
      clearIdleTimer();
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [pathname]);

  return (
    <div className="smiley-cursor" ref={cursorRef} data-state="idle" data-wind="off" data-idle="off" aria-hidden="true">
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
