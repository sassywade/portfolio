"use client";

import { useState } from "react";
import { CypressTree } from "./cypress-tree";
import { Meadow } from "./meadow";
import { INITIAL_WIND, type WindKey, type WindSettings } from "./wind";

export function HeroMeadow() {
  const [wind, setWind] = useState<WindSettings>(INITIAL_WIND);
  const [isPlaying, setIsPlaying] = useState(() => (
    typeof window === "undefined"
      ? true
      : !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ));

  const updateWind = (key: WindKey, value: number) => {
    setWind((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="hero-meadow">
      <Meadow wind={wind} isPlaying={isPlaying} />
      <CypressTree
        wind={wind}
        isPlaying={isPlaying}
        onWindChange={updateWind}
        onPlayingChange={setIsPlaying}
      />
    </div>
  );
}
