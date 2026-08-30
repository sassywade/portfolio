"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef } from "react";
import { createMeadowGrass } from "./meadow-grass-renderer";
import type { WindSettings } from "./wind";

type MeadowProps = {
  wind: WindSettings;
  isPlaying: boolean;
  variant: MeadowVariant;
};

export type MeadowVariant = "living" | "flat";

export function Meadow({ wind, isPlaying, variant }: MeadowProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const grassRef = useRef<ReturnType<typeof createMeadowGrass> | null>(null);
  const initialSettings = useRef({ wind, isPlaying });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const grass = createMeadowGrass({
      canvas,
      assetUrl: "/meadow-ground.png",
      wind: initialSettings.current.wind,
      autoplay: initialSettings.current.isPlaying && !prefersReducedMotion,
    });
    grassRef.current = grass;

    return () => {
      grass.destroy();
      grassRef.current = null;
    };
  }, []);

  useEffect(() => {
    grassRef.current?.setWind(wind);
  }, [wind]);

  useEffect(() => {
    grassRef.current?.setPlaying(isPlaying && variant === "living");
  }, [isPlaying, variant]);

  return (
    <div className="meadow" data-meadow data-meadow-variant={variant}>
      <div
        className="meadow__visual meadow__visual--living"
        data-meadow-variant="living"
        data-meadow-active={variant === "living" ? "true" : "false"}
        data-meadow-surface={variant === "living" ? "active" : "inactive"}
      >
        <img className="meadow__image" src="/meadow-ground.png" alt="" />
        <div className="meadow__texture" />
        <canvas ref={canvasRef} className="meadow__grass-canvas" aria-hidden="true" data-grass-layer />
      </div>
      <div
        className="meadow__visual meadow__visual--flat"
        data-meadow-variant="flat"
        data-meadow-active={variant === "flat" ? "true" : "false"}
        data-meadow-surface={variant === "flat" ? "active" : "inactive"}
        data-playing={isPlaying && variant === "flat" ? "true" : "false"}
        aria-hidden="true"
      >
        <div className="meadow__flat-field">
          <img className="meadow__flat-image" src="/flat-meadow-generated.webp" alt="" />
          <span className="meadow__flat-tint" />
        </div>
      </div>
    </div>
  );
}
