"use client";

import { useEffect } from "react";
import { bind, setVolume } from "cuelume";

export function Soundscape() {
  useEffect(() => {
    setVolume(0.55);
    bind();
  }, []);

  return null;
}
