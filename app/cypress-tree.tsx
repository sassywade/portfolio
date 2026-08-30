"use client";

import { useEffect, useRef, useState } from "react";
import { createCypressTree } from "./cypress-tree-renderer";
import { type WindKey, type WindSettings } from "./wind";

const PET_BLOW_CYPRESS_EVENT = "portfolio:pet-blow-cypress";

const windFields: Array<{ key: WindKey; label: string }> = [
  { key: "breeze", label: "Breeze" },
  { key: "gust", label: "Gust" },
  { key: "elasticity", label: "Elasticity" },
  { key: "tempo", label: "Gust rhythm" },
];

type CypressTreeProps = {
  wind: WindSettings;
  isPlaying: boolean;
  onWindChange: (key: WindKey, value: number) => void;
  onPlayingChange: (isPlaying: boolean) => void;
};

export function CypressTree({ wind, isPlaying, onWindChange, onPlayingChange }: CypressTreeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const treeRef = useRef<ReturnType<typeof createCypressTree> | null>(null);
  const initialSettings = useRef({ wind, isPlaying });
  const [isExpanded, setIsExpanded] = useState(true);

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

  const togglePlaying = () => {
    onPlayingChange(!isPlaying);
  };

  return (
    <div className="cypress-tree" data-cypress-tree>
      <div className="cypress-tree__stage">
        <canvas
          ref={canvasRef}
          className="cypress-tree__canvas"
          aria-label="Interactive Monterey cypress responding to wind"
        />
        <div
          className={`cypress-tree__controls${isExpanded ? "" : " is-collapsed"}`}
          aria-label="Meadow and cypress wind controls"
        >
          <div className="cypress-tree__controls-head">
            <span>Wind study</span>
            <div className="cypress-tree__actions">
              <button
                type="button"
                className="cypress-tree__toggle cypress-tree__panel-toggle"
                aria-expanded={isExpanded}
                aria-controls="cypress-wind-panel"
                aria-label={isExpanded ? "Minimize wind controls" : "Expand wind controls"}
                onClick={() => setIsExpanded((current) => !current)}
              >
                {isExpanded ? "Minimize" : "Expand"}
              </button>
              {isExpanded && (
                <button
                  type="button"
                  className="cypress-tree__toggle"
                  aria-pressed={isPlaying}
                  onClick={togglePlaying}
                >
                  {isPlaying ? "Pause" : "Play"}
                </button>
              )}
            </div>
          </div>
          <div id="cypress-wind-panel" className="cypress-tree__fields" hidden={!isExpanded}>
            {windFields.map(({ key, label }) => (
              <label className="cypress-tree__field" key={key}>
                <span>{label}<output>{wind[key].toFixed(2)}</output></span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={wind[key]}
                  aria-label={label}
                  onChange={(event) => onWindChange(key, Number(event.target.value))}
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
