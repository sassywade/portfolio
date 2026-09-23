"use client";

import { useEffect, useState } from "react";
import { bind, setVolume } from "cuelume";

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

function playWindSound(context: AudioContext, buffer: AudioBuffer) {
  const source = context.createBufferSource();
  const gain = context.createGain();
  gain.gain.value = 0.65;
  source.buffer = buffer;
  source.connect(gain).connect(context.destination);
  source.start();
  source.onended = () => { source.disconnect(); gain.disconnect(); };
  return source;
}

export function Soundscape() {
  const [showWindControl, setShowWindControl] = useState(false);

  useEffect(() => {
    setVolume(0.55);
    bind();

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const AudioContextClass = window.AudioContext
      ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    const context = !reducedMotion.matches && AudioContextClass ? new AudioContextClass() : null;
    let disposed = false;
    let entranceSoundStarted = false;
    let impactPassed = false;
    let unlocking = false;
    let replayRequested = false;
    let buffer: AudioBuffer | null = null;
    let source: AudioBufferSourceNode | null = null;
    const loading = context ? fetch("/audio/meadow-wind-leaves.mp3")
      .then(response => {
        if (!response.ok) throw new Error("Wind audio unavailable");
        return response.arrayBuffer();
      })
      .then(bytes => context.decodeAudioData(bytes))
      .then(decoded => { buffer = decoded; })
      .catch(() => {}) : Promise.resolve();
    const canPlay = () => !disposed && !document.hidden && !reducedMotion.matches
      && document.documentElement.dataset.meadowPresent !== "false";
    const handleTreeImpact = () => {
      impactPassed = true;
      replayRequested = false;
      if (entranceSoundStarted || !canPlay() || !context || context.state !== "running" || !buffer) return;
      // This event is dispatched in the same callback that bends the tree.
      source = playWindSound(context, buffer);
      entranceSoundStarted = true;
      setShowWindControl(false);
      removeGestureListeners();
    };
    const handleGesture = () => {
      if (entranceSoundStarted || unlocking || replayRequested || !canPlay() || !context) return;
      unlocking = true;
      // Resume inside the real gesture; decoding may finish asynchronously.
      void Promise.all([context.resume(), loading]).then(() => {
        if (!canPlay() || entranceSoundStarted || context.state !== "running" || !buffer) return;
        setShowWindControl(false);
        if (impactPassed) {
          replayRequested = true;
          window.dispatchEvent(new Event("portfolio:replay-welcome-gust"));
        }
      }).catch(() => {
        if (!disposed) setShowWindControl(true);
      }).finally(() => { unlocking = false; });
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
      window.addEventListener("portfolio:welcome-tree-impact", handleTreeImpact);
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
      window.removeEventListener("portfolio:welcome-tree-impact", handleTreeImpact);
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

  if (!showWindControl) return null;
  return (
    <button
      className="entrance-wind-control"
      type="button"
      aria-label="Play the entrance wind sound"
      onClick={() => {
        window.dispatchEvent(new Event("pointerdown"));
      }}
    >
      Play wind
    </button>
  );
}
