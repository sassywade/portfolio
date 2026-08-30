"use client";

/* Native local images keep cursor-frame swaps immediate and avoid optimizer overhead. */
/* eslint-disable @next/next/no-img-element */

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const IDLE_MISCHIEF_DELAY = 1500;
const IDLE_APPROACH_DURATION = 950;
const IDLE_CLOSE_DISTANCE = 46;
const IDLE_HUFF_CYCLE = 1450;
const IDLE_HUFF_SEQUENCE = ["light", "light", "strong", "strong", "strong"] as const;
const HAPPY_FLASH_DURATION = 560;
const PET_FACE_ANCHOR_X = 15;
const FACING_INTENT_THRESHOLD = 32;
const FACING_CHANGE_DELAY = 240;
const FACING_INTENT_MEMORY = 180;
const PET_BLOW_BACKPACKER_EVENT = "portfolio:pet-blow-backpacker";
const PET_BLOW_CYCLIST_EVENT = "portfolio:pet-blow-cyclist";
const PET_BLOW_PHOTOGRAPHER_EVENT = "portfolio:pet-blow-photographer";
const PET_BLOW_CYPRESS_EVENT = "portfolio:pet-blow-cypress";
const MINIATURE_ARM_DELAY = 480;
const MINIATURE_APPROACH_DURATION = 680;
const MINIATURE_BLOW_TRIGGER_DELAY = 280;
const MINIATURE_BLOW_DURATION = 1080;
const MINIATURE_COOLDOWN = 1800;

type MiniatureKind = "backpacker" | "cyclist" | "photographer" | "cypress";
type MiniatureInteractionPhase = "off" | "arming" | "approach" | "blow";
type ActiveMiniature = {
  kind: MiniatureKind;
  layer: HTMLElement;
  actor: HTMLElement;
  bounds: DOMRect;
  distance: number;
};

const MINIATURE_PROXIMITY: Record<MiniatureKind, number> = {
  backpacker: 86,
  cyclist: 98,
  photographer: 86,
  cypress: 110,
};

const PET_BLOW_EVENT: Record<MiniatureKind, string> = {
  backpacker: PET_BLOW_BACKPACKER_EVENT,
  cyclist: PET_BLOW_CYCLIST_EVENT,
  photographer: PET_BLOW_PHOTOGRAPHER_EVENT,
  cypress: PET_BLOW_CYPRESS_EVENT,
};

const clamp = (value: number, min: number, max: number) => (
  Math.max(min, Math.min(max, value))
);

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
    const heroSection = document.querySelector<HTMLElement>(".pranathi-intro--home");

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
    let isPastHero = false;
    let idleTimer: number | null = null;
    let idleStartedAt: number | null = null;
    let happyUntil = 0;
    let facing: -1 | 1 = 1;
    let facingIntent = 0;
    let pendingFacing: -1 | 1 = 1;
    let lastFacingInputTime = performance.now();
    let facingTimer: number | null = null;
    let miniaturePhase: MiniatureInteractionPhase = "off";
    let miniaturePhaseStarted = 0;
    let miniatureKind: MiniatureKind | null = null;
    let miniatureFacing: -1 | 1 = 1;
    let miniatureBlowSent = false;
    let miniatureNeedsExit: MiniatureKind | null = null;
    let miniatureCooldownUntil = 0;

    cursor.dataset.facing = "right";
    cursor.dataset.backpacker = "off";
    cursor.dataset.miniature = "off";
    cursor.dataset.target = "none";
    cursor.style.setProperty("--smiley-facing", "1");

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

    const stopHappyReaction = () => {
      happyUntil = 0;
      cursor.dataset.reaction = "off";
    };

    const clearFacingTimer = () => {
      if (facingTimer !== null) {
        window.clearTimeout(facingTimer);
        facingTimer = null;
      }
    };

    const queueFacingChange = (nextFacing: -1 | 1) => {
      if (nextFacing === facing) {
        clearFacingTimer();
        pendingFacing = facing;
        return;
      }

      if (pendingFacing === nextFacing && facingTimer !== null) return;

      clearFacingTimer();
      pendingFacing = nextFacing;
      facingTimer = window.setTimeout(() => {
        facingTimer = null;
        if (pendingFacing !== nextFacing || isPastHero) return;

        const intentStillMatches = nextFacing === 1
          ? facingIntent > FACING_INTENT_THRESHOLD
          : facingIntent < -FACING_INTENT_THRESHOLD;
        if (!intentStillMatches) return;

        facing = nextFacing;
        facingIntent = 0;
        pendingFacing = facing;
        cursor.dataset.facing = facing === 1 ? "right" : "left";
        cursor.style.setProperty("--smiley-facing", String(facing));
        scheduleFrame();
      }, FACING_CHANGE_DELAY);
    };

    const setFacingImmediately = (nextFacing: -1 | 1) => {
      clearFacingTimer();
      facing = nextFacing;
      facingIntent = 0;
      pendingFacing = nextFacing;
      cursor.dataset.facing = nextFacing === 1 ? "right" : "left";
      cursor.style.setProperty("--smiley-facing", String(nextFacing));
    };

    const activeMiniature = (kind: MiniatureKind): ActiveMiniature | null => {
      const selectors: Record<MiniatureKind, { layer: string; actor: string }> = {
        backpacker: { layer: '.backpack-walk-layer[data-phase="walk"]', actor: ".mini-hiker" },
        cyclist: { layer: '.bike-ride-layer[data-phase="ride"]', actor: ".bike-rider" },
        photographer: { layer: '.photo-drop-layer[data-phase="shoot"]', actor: ".mini-photographer" },
        cypress: { layer: '.hero-meadow[data-scene-visible="true"]', actor: ".cypress-tree__canvas" },
      };
      const selector = selectors[kind];
      const layer = document.querySelector<HTMLElement>(selector.layer);
      const actor = layer?.querySelector<HTMLElement>(selector.actor);
      if (!layer || !actor) return null;

      const bounds = actor.getBoundingClientRect();
      if (bounds.width <= 0 || bounds.height <= 0) return null;
      const nearestX = clamp(inputX, bounds.left, bounds.right);
      const nearestY = clamp(inputY, bounds.top, bounds.bottom);
      const distance = hasPointerPosition ? Math.hypot(inputX - nearestX, inputY - nearestY) : Number.POSITIVE_INFINITY;
      return { kind, layer, actor, bounds, distance };
    };

    const nearestMiniature = () => {
      const candidates = (["backpacker", "cyclist", "photographer", "cypress"] as const)
        .map(activeMiniature)
        .filter((candidate): candidate is ActiveMiniature => Boolean(
          candidate && candidate.distance <= MINIATURE_PROXIMITY[candidate.kind],
        ));
      candidates.sort((a, b) => a.distance - b.distance);
      return candidates[0] ?? null;
    };

    const resetMiniatureInteraction = (needsExit: MiniatureKind | null = null) => {
      miniaturePhase = "off";
      miniaturePhaseStarted = 0;
      miniatureBlowSent = false;
      miniatureNeedsExit = needsExit;
      miniatureKind = null;
      cursor.dataset.backpacker = "off";
      cursor.dataset.miniature = "off";
      cursor.dataset.target = "none";
    };

    const chooseMiniatureFacing = (miniature: ActiveMiniature) => {
      if (miniature.kind === "backpacker" || miniature.kind === "cyclist") {
        return miniature.layer.dataset.direction === "right" ? -1 : 1;
      }

      const actorCenter = miniature.bounds.left + miniature.bounds.width * 0.5;
      const petCenter = currentX + PET_FACE_ANCHOR_X;
      if (miniature.kind === "cypress") {
        if (miniature.bounds.right >= window.innerWidth - 48) return 1;
        if (miniature.bounds.left <= 48) return -1;
      }
      return petCenter <= actorCenter ? 1 : -1;
    };

    const updateMiniatureInteraction = (timestamp: number) => {
      if (miniatureNeedsExit) {
        const previousTarget = activeMiniature(miniatureNeedsExit);
        if (!previousTarget || previousTarget.distance > MINIATURE_PROXIMITY[miniatureNeedsExit]) {
          miniatureNeedsExit = null;
        }
        return;
      }

      if (miniaturePhase === "off") {
        const nearby = nearestMiniature();
        if (!nearby || timestamp < miniatureCooldownUntil) return;
        miniatureKind = nearby.kind;
        miniaturePhase = "arming";
        miniaturePhaseStarted = timestamp;
        cursor.dataset.miniature = "arming";
        cursor.dataset.target = nearby.kind;
        cursor.dataset.backpacker = nearby.kind === "backpacker" ? "arming" : "off";
        stopIdleMischief();
        return;
      }

      const miniature = miniatureKind ? activeMiniature(miniatureKind) : null;
      if (!miniature) {
        resetMiniatureInteraction(miniatureKind);
        return;
      }

      const isNear = miniature.distance <= MINIATURE_PROXIMITY[miniature.kind];
      if (miniaturePhase === "arming") {
        if (!isNear) {
          resetMiniatureInteraction();
          lastMoveTime = timestamp;
          armIdleMischief();
          return;
        }

        if (timestamp - miniaturePhaseStarted >= MINIATURE_ARM_DELAY) {
          miniatureFacing = chooseMiniatureFacing(miniature);
          setFacingImmediately(miniatureFacing);
          stopIdleMischief();
          stopHappyReaction();
          miniaturePhase = "approach";
          miniaturePhaseStarted = timestamp;
          cursor.dataset.miniature = "approach";
          cursor.dataset.backpacker = miniature.kind === "backpacker" ? "approach" : "off";
        }
        return;
      }

      if (miniaturePhase === "approach" && timestamp - miniaturePhaseStarted >= MINIATURE_APPROACH_DURATION) {
        miniaturePhase = "blow";
        miniaturePhaseStarted = timestamp;
        miniatureBlowSent = false;
        cursor.dataset.miniature = "blow";
        cursor.dataset.backpacker = miniature.kind === "backpacker" ? "blow" : "off";
        return;
      }

      if (miniaturePhase === "blow") {
        const blowElapsed = timestamp - miniaturePhaseStarted;
        if (!miniatureBlowSent && blowElapsed >= MINIATURE_BLOW_TRIGGER_DELAY) {
          miniatureBlowSent = true;
          const detail = miniature.kind === "photographer"
            ? undefined
            : miniature.kind === "cypress"
              ? { direction: miniatureFacing, strength: 1.16, duration: 1500 }
              : { direction: miniatureFacing };
          window.dispatchEvent(new CustomEvent(PET_BLOW_EVENT[miniature.kind], { detail }));
        }

        const blowDuration = miniature.kind === "cypress" ? 1600 : MINIATURE_BLOW_DURATION;
        if (blowElapsed >= blowDuration) {
          miniatureCooldownUntil = timestamp + MINIATURE_COOLDOWN;
          resetMiniatureInteraction(miniature.kind);
          lastMoveTime = timestamp;
          armIdleMischief();
        }
      }
    };

    const miniatureTargetPosition = () => {
      if ((miniaturePhase !== "approach" && miniaturePhase !== "blow") || !miniatureKind) return null;
      const miniature = activeMiniature(miniatureKind);
      if (!miniature) return null;

      const gap = miniature.kind === "cyclist" ? 42 : miniature.kind === "cypress" ? 30 : 34;
      const targetHeightRatio = miniature.kind === "photographer"
        ? 0.36
        : miniature.kind === "cypress"
          ? 0.40
          : 0.42;
      const desiredFaceX = miniatureFacing === 1
        ? miniature.bounds.left - gap
        : miniature.bounds.right + gap;
      return {
        x: clamp(desiredFaceX, 24, window.innerWidth - 24) - PET_FACE_ANCHOR_X,
        y: miniature.bounds.top + miniature.bounds.height * targetHeightRatio - 21,
      };
    };

    const updatePetState = (timestamp: number) => {
      const elapsed = Math.min(100, timestamp - previousFrameTime);
      previousFrameTime = timestamp;
      motionLevel *= Math.pow(0.94, Math.max(1, elapsed / 16.67));

      if (miniaturePhase === "approach") {
        cursor.dataset.idle = "off";
        cursor.dataset.reaction = "off";
        cursor.dataset.state = "idle";
        cursor.dataset.wind = "off";
        windStartedAt = null;
        return;
      }

      if (miniaturePhase === "blow") {
        cursor.dataset.idle = "off";
        cursor.dataset.reaction = "off";
        cursor.dataset.state = miniatureKind === "cypress" ? "strained" : "strong";
        cursor.dataset.wind = "on";
        windStartedAt = timestamp;
        return;
      }

      if (timestamp < happyUntil) {
        cursor.dataset.idle = "off";
        cursor.dataset.state = "idle";
        cursor.dataset.wind = "off";
        windStartedAt = null;
        return;
      }

      if (cursor.dataset.reaction === "smile") {
        cursor.dataset.reaction = "off";
      }

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
        const huffState = IDLE_HUFF_SEQUENCE[cycleIndex] ?? "strained";
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

      updateMiniatureInteraction(timestamp);
      updatePetState(timestamp);

      pointerX += (inputX - pointerX) * 0.14;
      pointerY += (inputY - pointerY) * 0.14;

      currentFollowDistance += (nextFollowDistance - currentFollowDistance) * 0.06;
      const miniatureTarget = miniatureTargetPosition();
      if (miniatureTarget) {
        targetX = miniatureTarget.x;
        targetY = miniatureTarget.y;
        positionEase = miniaturePhase === "approach" ? 0.058 : 0.085;
      } else {
        targetX = pointerX - PET_FACE_ANCHOR_X - currentFollowDistance * facing + idleOffsetX;
        targetY = pointerY - 21 + idleOffsetY;
      }

      currentX += (targetX - currentX) * positionEase;
      currentY += (targetY - currentY) * (miniatureTarget ? 0.065 : 0.075);

      cursor.style.setProperty("--smiley-x", `${currentX}px`);
      cursor.style.setProperty("--smiley-y", `${currentY}px`);

      const stillSettling =
        Math.abs(targetX - currentX) > 0.2 ||
        Math.abs(targetY - currentY) > 0.2 ||
        Math.abs(nextFollowDistance - currentFollowDistance) > 0.1 ||
        Math.abs(inputX - pointerX) > 0.2 ||
        Math.abs(inputY - pointerY) > 0.2 ||
        motionLevel > 0.01 ||
        timestamp < happyUntil ||
        miniaturePhase !== "off" ||
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
      if (!hasPointerPosition || isPastHero || miniaturePhase !== "off") return;

      const remainingDelay = Math.max(0, IDLE_MISCHIEF_DELAY - (performance.now() - lastMoveTime));
      idleTimer = window.setTimeout(() => {
        idleTimer = null;
        if (!hasPointerPosition || isPastHero) return;
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
      const nextIsPastHero = Boolean(heroSection && heroSection.getBoundingClientRect().bottom <= 0);

      if (nextIsPastHero === isPastHero) {
        return;
      }

      isPastHero = nextIsPastHero;

      if (isPastHero) {
        resetMiniatureInteraction();
        stopIdleMischief();
        stopHappyReaction();
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

      if (isPastHero) {
        return;
      }

      const timestamp = performance.now();
      const wasHuffing = idleStartedAt !== null
        && timestamp - idleStartedAt >= IDLE_APPROACH_DURATION;
      stopIdleMischief();

      if (wasHuffing) {
        happyUntil = timestamp + HAPPY_FLASH_DURATION;
        cursor.dataset.reaction = "smile";
        cursor.dataset.state = "idle";
        cursor.dataset.wind = "off";
      }

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
        targetX = currentX = event.clientX - PET_FACE_ANCHOR_X - 82;
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
      if (timestamp - lastFacingInputTime > FACING_INTENT_MEMORY) {
        facingIntent = 0;
      }
      facingIntent = clamp(facingIntent + deltaX, -140, 140);
      lastFacingInputTime = timestamp;
      if (miniaturePhase === "off" || miniaturePhase === "arming") {
        const nextFacing: -1 | 1 = facingIntent > FACING_INTENT_THRESHOLD
          ? 1
          : facingIntent < -FACING_INTENT_THRESHOLD
            ? -1
            : facing;
        queueFacingChange(nextFacing);
      }
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
      resetMiniatureInteraction();
      clearFacingTimer();
      stopIdleMischief();
      stopHappyReaction();
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
      clearFacingTimer();
      clearIdleTimer();
      stopHappyReaction();
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [pathname]);

  return (
    <div className="smiley-cursor" ref={cursorRef} data-state="idle" data-wind="off" data-idle="off" data-reaction="off" data-facing="right" data-backpacker="off" data-miniature="off" data-target="none" aria-hidden="true">
      <div className="smiley-cursor__direction">
        <img className="smiley-cursor__asset smiley-cursor__asset--idle smiley-cursor__face-frame" src="/pet/pet-idle.png" alt="" />
        <img className="smiley-cursor__asset smiley-cursor__asset--smile" src="/pet/pet-smile.png" alt="" />
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
