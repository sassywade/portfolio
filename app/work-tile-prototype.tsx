"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import styles from "./work-tile-prototype.module.css";

let dark = false;
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
};
const snapshot = () => dark;
const serverSnapshot = () => false;
const useDarkTiles = () => useSyncExternalStore(subscribe, snapshot, serverSnapshot);

export function WorkTileToggle() {
  const enabled = useDarkTiles();
  return <section className="meadow-settings__section" aria-label="Dark work tiles">
    <div className="meadow-settings__section-head">
      <h2>Dark work tiles</h2>
      <button type="button" aria-label="Dark work tiles" aria-pressed={enabled} onClick={() => {
        dark = !dark;
        listeners.forEach(listener => listener());
      }}>{enabled ? "On" : "Off"}</button>
    </div>
  </section>;
}

export function WorkTileSurface({ children }: { children: ReactNode }) {
  const enabled = useDarkTiles();
  return <div className={`work-editorial${enabled ? " " + styles.dark : ""}`} data-dark-tiles={enabled}>{children}</div>;
}
