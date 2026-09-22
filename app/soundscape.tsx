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
  element.dataset.cuelumeHover = "tick";
  element.dataset.cuelumeAutomaticHover = "true";
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

async function playWindSound(userInitiated: boolean) {
  const AudioContextConstructor =
    window.AudioContext
    ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextConstructor) return false;

  const context = new AudioContextConstructor();
  if (!userInitiated && context.state !== "running") {
    void context.close();
    return false;
  }
  if (context.state !== "running") {
    try {
      await context.resume();
    } catch {
      void context.close();
      return false;
    }
  }
  if (context.state !== "running") {
    void context.close();
    return false;
  }

  const master = context.createGain();
  master.gain.setValueAtTime(0.0001, context.currentTime);
  master.gain.exponentialRampToValueAtTime(0.32, context.currentTime + 0.35);
  master.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 2.8);
  master.connect(context.destination);

  const noiseBuffer = context.createBuffer(1, context.sampleRate * 2.6, context.sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);
  for (let index = 0; index < noiseData.length; index += 1) {
    noiseData[index] = (Math.random() * 2 - 1) * 0.9;
  }

  const wind = context.createBufferSource();
  const windFilter = context.createBiquadFilter();
  const windGain = context.createGain();
  wind.buffer = noiseBuffer;
  windFilter.type = "lowpass";
  windFilter.frequency.setValueAtTime(220, context.currentTime);
  windFilter.frequency.exponentialRampToValueAtTime(2_400, context.currentTime + 1.25);
  windFilter.frequency.exponentialRampToValueAtTime(420, context.currentTime + 2.45);
  windFilter.Q.setValueAtTime(0.7, context.currentTime);
  windGain.gain.setValueAtTime(0.0001, context.currentTime);
  windGain.gain.exponentialRampToValueAtTime(0.72, context.currentTime + 0.7);
  windGain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 2.55);
  wind.connect(windFilter).connect(windGain).connect(master);

  const startTime = context.currentTime;
  wind.start(startTime);
  wind.stop(startTime + 2.65);

  window.setTimeout(() => {
    void context.close();
  }, 3_000);
  return true;
}

export function Soundscape() {
  const [showWindControl, setShowWindControl] = useState(false);

  useEffect(() => {
    setVolume(0.55);
    bind();

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let entranceSoundStarted = reducedMotion;
    let entranceSoundStarting = false;
    const startEntranceSound = async (userInitiated = true) => {
      if (entranceSoundStarted || entranceSoundStarting) return;
      entranceSoundStarting = true;
      entranceSoundStarted = await playWindSound(userInitiated);
      entranceSoundStarting = false;
      if (entranceSoundStarted) {
        setShowWindControl(false);
        removeGestureListeners();
      } else if (userInitiated) {
        setShowWindControl(true);
      }
    };
    const handleGesture = () => {
      void startEntranceSound(true);
    };
    const removeGestureListeners = () => {
      window.removeEventListener("pointerdown", handleGesture);
      window.removeEventListener("keydown", handleGesture);
      window.removeEventListener("touchstart", handleGesture);
    };
    if (!entranceSoundStarted) {
      window.addEventListener("pointerdown", handleGesture, { passive: true });
      window.addEventListener("keydown", handleGesture);
      window.addEventListener("touchstart", handleGesture, { passive: true });
      void startEntranceSound(false);
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
