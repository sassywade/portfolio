"use client";

import { useEffect, useRef } from "react";
import { createCypressTree } from "./cypress-tree-renderer";
import { type WindSettings } from "./wind";

const PET_BLOW_CYPRESS_EVENT = "portfolio:pet-blow-cypress";

type CypressTreeProps = {
  wind: WindSettings;
  isPlaying: boolean;
};

export function CypressTree({ wind, isPlaying }: CypressTreeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const treeRef = useRef<ReturnType<typeof createCypressTree> | null>(null);
  const initialSettings = useRef({ wind, isPlaying });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tree = createCypressTree({
      canvas,
      assetUrl: "/monterey-cypress.png",
      wind: initialSettings.current.wind,
      autoplay: initialSettings.current.isPlaying && !prefersReducedMotion,
    });
    treeRef.current = tree;

    return () => {
      tree.destroy();
      treeRef.current = null;
    };
  }, []);

  useEffect(() => {
    treeRef.current?.setWind(wind);
  }, [wind]);

  useEffect(() => {
    treeRef.current?.setPlaying(isPlaying);
  }, [isPlaying]);

  useEffect(() => {
    const handlePetGust = (event: Event) => {
      const detail = (event as CustomEvent<{ direction?: -1 | 1; strength?: number; duration?: number }>).detail;
      treeRef.current?.applyGust({
        direction: detail?.direction === -1 ? -1 : 1,
        strength: detail?.strength ?? 1.16,
        duration: detail?.duration ?? 1500,
      });
    };

    window.addEventListener(PET_BLOW_CYPRESS_EVENT, handlePetGust);
    return () => window.removeEventListener(PET_BLOW_CYPRESS_EVENT, handlePetGust);
  }, []);

  return (
    <div className="cypress-tree" data-cypress-tree>
      <div className="cypress-tree__ground-shadow" aria-hidden="true" />
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
