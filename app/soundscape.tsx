"use client";

import { useEffect } from "react";
import { bind, setVolume } from "cuelume";

const WIND_VISIT_KEY = "portfolio:welcome-wind-played";
let windPlayedInDocument = false;
function hasPlayedWind() {
  try { return windPlayedInDocument || window.sessionStorage.getItem(WIND_VISIT_KEY) === "true"; }
  catch { return windPlayedInDocument; }
}

const actionableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([type='hidden']):not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "summary",
  "[role='button']",
  "[role='link']",
  "[role='menuitem']",
  "[role='tab']",
  "[role='switch']",
].join(",");

function addDeclarativeInteractionCue(element: HTMLElement) {
  if (element.dataset.silentHover !== "true") {
    element.dataset.cuelumeHover = "tick";
    element.dataset.cuelumeAutomaticHover = "true";
  }
  delete element.dataset.cuelumeToggle;
  element.dataset.cuelumePress = "press";
  element.dataset.cuelumeRelease = "release";
  element.dataset.cuelumeAutomaticClick = "true";
}

function addDeclarativeInteractionCues(root: ParentNode) {
  if (root instanceof HTMLElement && root.matches(actionableSelector)) {
    addDeclarativeInteractionCue(root);
  }

  root
    .querySelectorAll<HTMLElement>(actionableSelector)
    .forEach(addDeclarativeInteractionCue);
}

function playWindSound(context: AudioContext, buffer: AudioBuffer, offset = 0) {
  const source = context.createBufferSource();
  const gain = context.createGain();
  gain.gain.value = 0.65;
  source.buffer = buffer;
  source.connect(gain).connect(context.destination);
  source.start(0, offset);
  source.onended = () => { source.disconnect(); gain.disconnect(); };
  return source;
}

export function Soundscape() {
  useEffect(() => {
    setVolume(0.55);
    bind();

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const AudioContextClass = window.AudioContext
      ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    const context = !reducedMotion.matches && AudioContextClass ? new AudioContextClass() : null;
    let disposed = false;
    let entranceSoundStarted = hasPlayedWind();
    let cueStartedAt: number | null = null;
    let unlocking = false;
    let buffer: AudioBuffer | null = null;
    let source: AudioBufferSourceNode | null = null;
    const loading = context ? fetch("/audio/meadow-wind-leaves.mp3")
      .then(response => {
        if (!response.ok) throw new Error("Wind audio unavailable");
        return response.arrayBuffer();
      })
      .then(bytes => context.decodeAudioData(bytes))
      .then(decoded => { buffer = decoded; startSyncedSound(); })
      .catch(() => {}) : Promise.resolve();
    const canPlay = () => !disposed && !document.hidden && !reducedMotion.matches
      && document.documentElement.dataset.meadowPresent !== "false";
    const startSyncedSound = () => {
      if (cueStartedAt === null || entranceSoundStarted || hasPlayedWind() || !canPlay() || !context || context.state !== "running" || !buffer) return;
      const offset = Math.max(0, (performance.now() - cueStartedAt) / 1000);
      // Join only the actual moving gust, at the matching point in the recording.
      // Never replay a finished gust or start a delayed sound on a later click.
      if (offset > 1.8 || offset >= buffer.duration) return;
      windPlayedInDocument = true;
      entranceSoundStarted = true;
      try { window.sessionStorage.setItem(WIND_VISIT_KEY, "true"); } catch {}
      source = playWindSound(context, buffer, offset);
      removeGestureListeners();
    };
    const handleSoundCue = () => {
      if (cueStartedAt !== null) return;
      cueStartedAt = performance.now();
      startSyncedSound();
    };
    const handleGesture = () => {
      if (entranceSoundStarted || hasPlayedWind() || unlocking || !canPlay() || !context) return;
      unlocking = true;
      // Resume inside the real gesture; decoding may finish asynchronously.
      void Promise.all([context.resume(), loading]).then(() => {
        if (!canPlay() || entranceSoundStarted || context.state !== "running" || !buffer) return;
        startSyncedSound();
      }).catch(() => {}).finally(() => { unlocking = false; });
    };
    const removeGestureListeners = () => {
      window.removeEventListener("pointerdown", handleGesture);
      window.removeEventListener("keydown", handleGesture);
      window.removeEventListener("touchstart", handleGesture);
    };
    if (context) {
      window.addEventListener("pointerdown", handleGesture, { passive: true });
      window.addEventListener("keydown", handleGesture);
      window.addEventListener("touchstart", handleGesture, { passive: true });
      window.addEventListener("portfolio:welcome-gust-sound", handleSoundCue);
    }

    addDeclarativeInteractionCues(document);

    const observer = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;

          addDeclarativeInteractionCues(node);
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      disposed = true;
      source?.stop();
      if (context) void context.close();
      window.removeEventListener("portfolio:welcome-gust-sound", handleSoundCue);
      removeGestureListeners();
      observer.disconnect();
      document
        .querySelectorAll<HTMLElement>("[data-cuelume-automatic-hover='true']")
        .forEach((element) => {
          delete element.dataset.cuelumeHover;
          delete element.dataset.cuelumeAutomaticHover;
        });
      document
        .querySelectorAll<HTMLElement>("[data-cuelume-automatic-click='true']")
        .forEach((element) => {
          delete element.dataset.cuelumePress;
          delete element.dataset.cuelumeRelease;
          delete element.dataset.cuelumeAutomaticClick;
        });
    };
  }, []);

  return null;
}
