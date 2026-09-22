"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import styles from "./psychic-cards.module.css";

type Mode = "wheel" | "rolodex" | "grid";
let mode: Mode = "rolodex";
let flipped = false;
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
const snapshot = () => mode;
const serverSnapshot = (): Mode => "rolodex";
const useMode = () => useSyncExternalStore(subscribe, snapshot, serverSnapshot);
const useFlipped = () => useSyncExternalStore(subscribe, () => flipped, () => false);
// Coprime ordering mixes the supplied categories without random hydration or repeats.
const cards = Array.from({ length: 18 }, (_, i) => "/work/psychic-cards/card-" + ((i * 7) % 18) + ".png");

export function PsychicCardsOptions() {
  const selected = useMode();
  const isFlipped = useFlipped();
  return <section className="meadow-settings__section" aria-label="Proactive card motion">
    <h2>Proactive card motion</h2>
    <div className="layout-prototype-options">
      {(["wheel", "rolodex", "grid"] as Mode[]).map(option =>
        <button key={option} type="button" aria-pressed={selected === option} onClick={() => {
          mode = option; listeners.forEach(listener => listener());
        }}>{option === "wheel" ? "Wheel" : option === "rolodex" ? "Rolodex" : "Grid"}</button>)}
    </div>
    {selected === "wheel" && <div className="layout-prototype-options">
      <button type="button" aria-pressed={isFlipped} onClick={() => {
        flipped = !flipped; listeners.forEach(listener => listener());
      }}>Flip wheel</button>
    </div>}
  </section>;
}

export function PsychicCards() {
  const selected = useMode();
  const isFlipped = useFlipped();
  return <CardStage key={selected} mode={selected} flipped={isFlipped} />;
}

function CardStage({ mode, flipped }: { mode: Mode; flipped: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(preference.matches);
    update();
    preference.addEventListener("change", update);
    let intersects = false;
    const visibility = () => setVisible(intersects && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { intersects = entry.isIntersecting; visibility(); }, { threshold: 0.1 });
    if (root.current) observer.observe(root.current);
    document.addEventListener("visibilitychange", visibility);
    return () => { observer.disconnect(); preference.removeEventListener("change", update); document.removeEventListener("visibilitychange", visibility); };
  }, []);
  const running = visible && !reduced;
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setStep(value => value + 1), mode === "grid" ? 1400 : 3400);
    return () => clearInterval(timer);
  }, [running, mode]);
  return <div ref={root} className={styles.stage} data-mode={mode} data-running={running} data-wheel-side={flipped ? "right" : "left"}>
    <div className={styles.canvas} role="img" aria-label="A collection of proactive Glean cards: email replies, Slack updates, briefings, documents, and dashboards">
      {mode === "grid" ? Array.from({ length: 15 }, (_, slot) => {
        // Visit each cell in a scattered, deterministic order, not a row-by-row wipe.
        const order = (slot * 4) % 15;
        const generation = Math.max(0, Math.floor((step + 14 - order) / 15));
        const index = (slot + generation * 5) % cards.length;
        return <div className={styles.cell} key={slot} style={{ left: (-5 + (slot % 3) * 55) + "%", top: (-5 + Math.floor(slot / 3) * 27.5) + "%" }}>
          <img src={cards[(index + 13) % 18]} alt="" aria-hidden="true" loading="lazy" />
          <img key={generation} className={generation ? styles.swap : undefined} src={cards[index]} alt="" aria-hidden="true" loading="lazy" />
        </div>;
      }) : cards.map((src, index) => {
        const offset = ((index - step % 18 + 27) % 18) - 9;
        const angle = offset * 2.8;
        const radians = angle * Math.PI / 180;
        const side = flipped ? -1 : 1;
        const transform = mode === "wheel"
          ? "translate(-50%, -50%) translate(" + (side * 420 * (Math.cos(radians) - 1)).toFixed(3) + "cqw, " + (420 * Math.sin(radians)).toFixed(3) + "cqw) rotate(" + (side * angle) + "deg)"
          : "translate(-50%, -50%) translateY(" + (offset * 16.35) + "cqw) perspective(600px) rotateX(" + (-offset * 12) + "deg) scale(" + Math.max(.8, 1 - Math.abs(offset) * .035) + ")";
        return <img key={src} className={styles.card} src={src} alt="" aria-hidden="true" loading="lazy"
          style={{ transform, opacity: Math.abs(offset) > 4 ? 0 : 1, transition: Math.abs(offset) > 4 ? "none" : undefined }} />;
      })}
    </div>
  </div>;
}
