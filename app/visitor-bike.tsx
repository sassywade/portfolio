"use client";

import { createPortal } from "react-dom";
import { useMemo, useState } from "react";
import { useMeadowLayerHost } from "./use-meadow-layer-host";

export const VISITOR_BIKE_STORAGE_KEY = "neel-portfolio-visitor-bike";

export const BIKE_FRAMES = ["Aero", "Climbing", "Commuter", "Vintage", "Brompton", "Gravel", "Time trial"] as const;
export const BIKE_WHEELS = ["Alloy", "Carbon 30mm", "Carbon 50mm", "Carbon 60mm", "Carbon disc"] as const;
export const BIKE_TIRES = ["High performance", "Road tires", "Chunky gravel tires", "Commuter tires"] as const;
export const BIKE_COLORS = [
  { id: "vermillion", label: "Vermillion", value: "#cf4f38" },
  { id: "cobalt", label: "Cobalt", value: "#315aa6" },
  { id: "moss", label: "Moss", value: "#718447" },
  { id: "butter", label: "Butter", value: "#e3bd58" },
  { id: "ink", label: "Ink", value: "#303334" },
  { id: "cream", label: "Cream", value: "#e6dfd0" },
] as const;
export const BIKE_DECALS = [
  { id: "none", label: "None", mark: "" },
  { id: "stripe", label: "Stripe", mark: "／" },
  { id: "dots", label: "Dots", mark: "•••" },
  { id: "star", label: "Star", mark: "✦" },
  { id: "check", label: "Check", mark: "✓" },
] as const;

export type VisitorBike = {
  frame: (typeof BIKE_FRAMES)[number];
  wheels: (typeof BIKE_WHEELS)[number];
  tires: (typeof BIKE_TIRES)[number];
  color: (typeof BIKE_COLORS)[number]["id"];
  decal: (typeof BIKE_DECALS)[number]["id"];
  bikeName: string;
  riderName: string;
};

export const DEFAULT_VISITOR_BIKE: VisitorBike = {
  frame: "Gravel",
  wheels: "Alloy",
  tires: "Chunky gravel tires",
  color: "vermillion",
  decal: "stripe",
  bikeName: "A bike passing through",
  riderName: "A visitor",
};

const colorForBike = (id: VisitorBike["color"]) => BIKE_COLORS.find((color) => color.id === id) ?? BIKE_COLORS[0];
const decalForBike = (id: VisitorBike["decal"]) => BIKE_DECALS.find((decal) => decal.id === id) ?? BIKE_DECALS[0];

export function useVisitorBike() {
  const [bike, setBike] = useState<VisitorBike>(() => {
    if (typeof window === "undefined") return DEFAULT_VISITOR_BIKE;
    try {
      const saved = window.localStorage.getItem(VISITOR_BIKE_STORAGE_KEY);
      return saved ? { ...DEFAULT_VISITOR_BIKE, ...JSON.parse(saved) } : DEFAULT_VISITOR_BIKE;
    } catch {
      // The prototype still works when storage is unavailable.
    }
    return DEFAULT_VISITOR_BIKE;
  });

  const updateBike = (patch: Partial<VisitorBike>) => {
    setBike((current) => {
      const next = { ...current, ...patch };
      try { window.localStorage.setItem(VISITOR_BIKE_STORAGE_KEY, JSON.stringify(next)); } catch { /* no-op */ }
      return next;
    });
  };

  return [bike, updateBike] as const;
}

export function VisitorBikeEditor({ bike, onChange, onRace }: { bike: VisitorBike; onChange: (patch: Partial<VisitorBike>) => void; onRace?: () => void }) {
  const color = colorForBike(bike.color);
  return (
    <div className="visitor-bike-editor">
      <div className="visitor-bike-editor__identity">
        <label><span>Bike name</span><input maxLength={32} value={bike.bikeName} onChange={(event) => onChange({ bikeName: event.target.value })} /></label>
        <label><span>Your name</span><input maxLength={24} value={bike.riderName} onChange={(event) => onChange({ riderName: event.target.value })} /></label>
      </div>
      <div className="visitor-bike-editor__fields">
        <label><span>Frame</span><select value={bike.frame} onChange={(event) => onChange({ frame: event.target.value as VisitorBike["frame"] })}>{BIKE_FRAMES.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label><span>Wheels</span><select value={bike.wheels} onChange={(event) => onChange({ wheels: event.target.value as VisitorBike["wheels"] })}>{BIKE_WHEELS.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label><span>Tires</span><select value={bike.tires} onChange={(event) => onChange({ tires: event.target.value as VisitorBike["tires"] })}>{BIKE_TIRES.map((item) => <option key={item}>{item}</option>)}</select></label>
      </div>
      <div className="visitor-bike-editor__choices">
        <fieldset><legend>Frame color</legend><div className="visitor-bike-swatches">{BIKE_COLORS.map((item) => <button type="button" key={item.id} className="visitor-bike-swatch" aria-label={item.label} aria-pressed={bike.color === item.id} style={{ backgroundColor: item.value }} onClick={() => onChange({ color: item.id })} />)}</div></fieldset>
        <fieldset><legend>Frame decal</legend><div className="visitor-bike-decals">{BIKE_DECALS.map((item) => <button type="button" key={item.id} aria-pressed={bike.decal === item.id} onClick={() => onChange({ decal: item.id })}>{item.mark || "—"}</button>)}</div></fieldset>
      </div>
      <p className="visitor-bike-editor__signature"><span className="visitor-bike-preview-mark" style={{ backgroundColor: color.value }} aria-hidden="true" /> Signed by <strong>{bike.riderName || "a visitor"}</strong> · saved in this browser</p>
      {onRace && <button type="button" className="visitor-bike-race-button" onClick={onRace}>Race Neel</button>}
    </div>
  );
}

export function VisitorBikeLayer({ bike, enabled, isPlaying, racing }: { bike: VisitorBike; enabled: boolean; isPlaying: boolean; racing: boolean }) {
  const meadowHost = useMeadowLayerHost();
  const color = colorForBike(bike.color);
  const decal = decalForBike(bike.decal);
  const style = useMemo(() => ({ "--visitor-bike-color": color.value } as React.CSSProperties), [color.value]);
  if (!meadowHost || !enabled) return null;
  return createPortal(
    <div className="visitor-bike-layer" data-playing={isPlaying ? "true" : "false"} data-racing={racing ? "true" : "false"} style={style} aria-label={`${bike.bikeName}, signed by ${bike.riderName}`}>
      <div className="visitor-bike-ride">
        <span className="visitor-bike-signature">{bike.riderName || "visitor"}</span>
        <span className="visitor-bike-shape" data-frame={bike.frame.toLowerCase().replaceAll(" ", "-")} data-wheels={bike.wheels.toLowerCase().replaceAll(" ", "-")} data-tires={bike.tires.toLowerCase().replaceAll(" ", "-")}>
          <i className="visitor-bike-wheel visitor-bike-wheel--back" /><i className="visitor-bike-wheel visitor-bike-wheel--front" /><i className="visitor-bike-body"><b>{decal.mark}</b></i>
        </span>
      </div>
      {racing && <span className="visitor-bike-race-callout" aria-live="polite">Visitor bike vs. Neel</span>}
    </div>, meadowHost,
  );
}
