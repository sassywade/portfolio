"use client";

import { useEffect } from "react";

type OrientationPermission = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<string>;
};

let tilt = 0;
let subscribers = 0;
let granted = false;
let pending = false;
let disconnect: (() => void) | undefined;
let touchQuery: MediaQueryList | undefined;
let reducedQuery: MediaQueryList | undefined;

/** Project the phone's lean into screen coordinates, including either landscape rotation. */
export function screenTilt(beta: number | null, gamma: number | null, angle: number) {
  if (beta == null || gamma == null || !Number.isFinite(beta) || !Number.isFinite(gamma)) return 0;
  const radians = angle * Math.PI / 180;
  const lean = gamma * Math.cos(radians) + beta * Math.sin(radians);
  const strength = Math.max(0, Math.min(1, (Math.abs(lean) - 5) / 25));
  return Math.sign(lean) * strength;
}

function allowed() {
  touchQuery ??= window.matchMedia("(hover: none), (pointer: coarse)");
  reducedQuery ??= window.matchMedia("(prefers-reduced-motion: reduce)");
  return touchQuery.matches && !reducedQuery.matches;
}

function listen() {
  if (disconnect || !subscribers || !granted) return;
  const reset = () => { tilt = 0; };
  const orientation = (event: DeviceOrientationEvent) => {
    if (!allowed() || document.hidden) { reset(); return; }
    const angle = window.screen.orientation?.angle ?? Number(window.orientation ?? 0);
    tilt = screenTilt(event.beta, event.gamma, angle);
  };
  window.addEventListener("deviceorientation", orientation, { passive: true });
  window.addEventListener("orientationchange", reset);
  document.addEventListener("visibilitychange", reset);
  disconnect = () => {
    window.removeEventListener("deviceorientation", orientation);
    window.removeEventListener("orientationchange", reset);
    document.removeEventListener("visibilitychange", reset);
    reset();
    disconnect = undefined;
  };
}

/** Call directly from the activity tap, before any asynchronous work (required by iOS). */
export function armDeviceTilt() {
  if (typeof window === "undefined" || !allowed() || pending) return;
  const orientation = window.DeviceOrientationEvent as OrientationPermission | undefined;
  if (!orientation) return;
  if (granted) { listen(); return; }
  if (typeof orientation.requestPermission !== "function") {
    granted = true;
    listen();
    return;
  }
  pending = true;
  try {
    void orientation.requestPermission().then((result) => {
      granted = result === "granted";
      if (granted) listen();
    }).catch(() => { granted = false; }).finally(() => { pending = false; });
  } catch {
    pending = false;
  }
}

/** Share one sensor listener; actor animation loops remain the sole owners of movement. */
export function useDeviceTilt() {
  useEffect(() => {
    subscribers++;
    const orientation = window.DeviceOrientationEvent as OrientationPermission | undefined;
    if (orientation && typeof orientation.requestPermission !== "function") armDeviceTilt();
    else listen();
    return () => {
      subscribers--;
      if (!subscribers) disconnect?.();
    };
  }, []);
}

export function readDeviceTilt() {
  return allowed() && !document.hidden ? tilt : 0;
}
