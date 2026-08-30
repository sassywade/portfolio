"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef } from "react";
import { createMeadowGrass } from "./meadow-grass-renderer";
import type { WindSettings } from "./wind";

type MeadowProps = {
  wind: WindSettings;
  isPlaying: boolean;
};

export function Meadow({ wind, isPlaying }: MeadowProps) {
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
    grassRef.current?.setPlaying(isPlaying);
  }, [isPlaying]);

  return (
    <div className="meadow" data-meadow>
      <div className="meadow__visual">
        <img className="meadow__image" src="/meadow-ground.png" alt="" />
        <div className="meadow__texture" />
        <canvas ref={canvasRef} className="meadow__grass-canvas" aria-hidden="true" data-grass-layer />
      </div>
    </div>
  );
}
