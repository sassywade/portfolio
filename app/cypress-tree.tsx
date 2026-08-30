"use client";

import { useEffect, useRef } from "react";
import { createCypressTree } from "./cypress-tree-renderer";
import { type WindSettings } from "./wind";

const PET_BLOW_CYPRESS_EVENT = "portfolio:pet-blow-cypress";
const WELCOME_BREEZE_SESSION_KEY = "neel-cypress-welcome-breeze";
const WELCOME_BREEZE_DELAY = 1250;
const STRONG_AMBIENT_WIND_THRESHOLD = 0.58;
const WELCOME_BREEZE_STRENGTH = 0.46;
const WELCOME_BREEZE_DURATION = 1450;

type CypressTreeProps = {
  wind: WindSettings;
  isPlaying: boolean;
  assetUrl: string;
};

export function CypressTree({ wind, isPlaying, assetUrl }: CypressTreeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const treeRef = useRef<ReturnType<typeof createCypressTree> | null>(null);
  const latestWind = useRef(wind);
  const latestPlaying = useRef(isPlaying);

  useEffect(() => {
    latestWind.current = wind;
    latestPlaying.current = isPlaying;
  }, [wind, isPlaying]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tree = createCypressTree({
      canvas,
      assetUrl,
      wind: latestWind.current,
      autoplay: latestPlaying.current && !prefersReducedMotion,
    });
    treeRef.current = tree;

    return () => {
      tree.destroy();
      treeRef.current = null;
    };
  }, [assetUrl]);

  useEffect(() => {
    latestWind.current = wind;
    treeRef.current?.setWind(wind);
  }, [wind]);

  useEffect(() => {
    latestPlaying.current = isPlaying;
    treeRef.current?.setPlaying(isPlaying);
  }, [isPlaying]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    try {
      if (window.sessionStorage.getItem(WELCOME_BREEZE_SESSION_KEY) === "shown") return;
    } catch {
      // Storage can be unavailable in privacy-restricted contexts; the breeze can still run once.
    }

    const welcomeTimer = window.setTimeout(() => {
      try {
        window.sessionStorage.setItem(WELCOME_BREEZE_SESSION_KEY, "shown");
      } catch {
        // The animation is nonessential, so storage failure should never block it.
      }

      const tree = treeRef.current;
      const currentWind = latestWind.current;
      const ambientWind = Math.max(currentWind.breeze, currentWind.gust * 0.72);
      if (!tree || !latestPlaying.current || ambientWind >= STRONG_AMBIENT_WIND_THRESHOLD) return;

      tree.applyGust({
        direction: currentWind.direction < 0 ? -1 : 1,
        strength: WELCOME_BREEZE_STRENGTH,
        duration: WELCOME_BREEZE_DURATION,
      });
    }, WELCOME_BREEZE_DELAY);

    return () => window.clearTimeout(welcomeTimer);
  }, []);

  useEffect(() => {
    const handlePetGust = (event: Event) => {
      const detail = (event as CustomEvent<{ direction?: -1 | 1; strength?: number; duration?: number }>).detail;
      treeRef.current?.applyGust({
        direction: detail?.direction === -1 ? -1 : 1,
        strength: detail?.strength ?? 0.92,
        duration: detail?.duration ?? 1500,
      });
    };

    window.addEventListener(PET_BLOW_CYPRESS_EVENT, handlePetGust);
    return () => window.removeEventListener(PET_BLOW_CYPRESS_EVENT, handlePetGust);
  }, []);

  return (
    <div className="cypress-tree" data-cypress-tree data-tree-asset={assetUrl}>
      <div className="cypress-tree__stage">
        <canvas
          ref={canvasRef}
          className="cypress-tree__canvas"
          aria-label="Interactive Monterey cypress responding to wind"
        />
      </div>
    </div>
  );
}
