"use client";

import { useEffect, useRef, useState } from "react";
import { CypressTree } from "./cypress-tree";
import { Meadow } from "./meadow";
import { INITIAL_WIND, type WindKey, type WindSettings } from "./wind";

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function HeroMeadow() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const sceneVisibleRef = useRef(true);
  const [wind, setWind] = useState<WindSettings>(INITIAL_WIND);
  const [isPlaying, setIsPlaying] = useState(() => (
    typeof window === "undefined"
      ? true
      : !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ));
  const [isSceneVisible, setIsSceneVisible] = useState(true);

  useEffect(() => {
    const scene = sceneRef.current;
    const work = document.querySelector<HTMLElement>(".pranathi-work");
    if (!scene || !work) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let viewportHeight = Math.max(1, window.visualViewport?.height ?? window.innerHeight);
    let currentProgress = 0;
    let targetProgress = 0;
    let frameHandle = 0;
    let lastTime = 0;

    const setSceneVisibility = (next: boolean) => {
      if (sceneVisibleRef.current === next) return;
      sceneVisibleRef.current = next;
      setIsSceneVisible(next);
    };

    const commitProgress = (progress: number) => {
      currentProgress = clamp(progress, 0, 1);
      const easedProgress = currentProgress * currentProgress * (3 - 2 * currentProgress);
      const exitDistance = viewportHeight + Math.max(100, viewportHeight * 0.14);
      scene.style.setProperty("--meadow-exit-y", `${(easedProgress * exitDistance).toFixed(2)}px`);
      scene.style.setProperty("--meadow-scroll-progress", currentProgress.toFixed(4));
      scene.dataset.scrollState = currentProgress <= 0.002
        ? "hero"
        : currentProgress >= 0.998
          ? "hidden"
          : "transitioning";

      if (currentProgress >= 0.998 && targetProgress >= 0.998) {
        setSceneVisibility(false);
      }
    };

    const calculateTarget = () => {
      viewportHeight = Math.max(1, window.visualViewport?.height ?? window.innerHeight);
      const workTop = work.getBoundingClientRect().top;
      const transitionStart = viewportHeight * 0.98;
      const transitionEnd = viewportHeight * 0.5;
      const progress = clamp(
        (transitionStart - workTop) / Math.max(1, transitionStart - transitionEnd),
        0,
        1,
      );

      return reducedMotion.matches ? (progress >= 0.4 ? 1 : 0) : progress;
    };

    const animate = (now: number) => {
      frameHandle = 0;

      if (reducedMotion.matches) {
        commitProgress(targetProgress);
        return;
      }

      const delta = lastTime ? Math.min(48, now - lastTime) : 16;
      lastTime = now;
      const follow = 1 - Math.exp(-delta / 105);
      const next = currentProgress + (targetProgress - currentProgress) * follow;

      if (Math.abs(targetProgress - next) <= 0.001) {
        commitProgress(targetProgress);
        return;
      }

      commitProgress(next);
      frameHandle = window.requestAnimationFrame(animate);
    };

    const schedule = () => {
      targetProgress = calculateTarget();
      if (targetProgress < 0.998) setSceneVisibility(true);
      if (!frameHandle) {
        lastTime = 0;
        frameHandle = window.requestAnimationFrame(animate);
      }
    };

    targetProgress = calculateTarget();
    commitProgress(targetProgress);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.visualViewport?.addEventListener("resize", schedule);
    reducedMotion.addEventListener("change", schedule);

    return () => {
      window.cancelAnimationFrame(frameHandle);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener("resize", schedule);
      reducedMotion.removeEventListener("change", schedule);
    };
  }, []);

  const updateWind = (key: WindKey, value: number) => {
    setWind((current) => ({ ...current, [key]: value }));
  };

  const sceneIsPlaying = isPlaying && isSceneVisible;

  return (
    <div
      ref={sceneRef}
      className="hero-meadow"
      data-scene-visible={isSceneVisible ? "true" : "false"}
      data-scroll-state="hero"
    >
      <Meadow wind={wind} isPlaying={sceneIsPlaying} />
      <CypressTree
        wind={wind}
        isPlaying={sceneIsPlaying}
        onWindChange={updateWind}
        onPlayingChange={setIsPlaying}
      />
    </div>
  );
}
