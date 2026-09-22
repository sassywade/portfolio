"use client";

import { useEffect } from "react";
import { bind, setVolume } from "cuelume";

const ENTRANCE_SOUND_KEY = "portfolio:entrance-sound-played";

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

function createEntranceSound() {
  const AudioContextConstructor =
    window.AudioContext
    ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextConstructor) return false;

  const context = new AudioContextConstructor();
  const master = context.createGain();
  master.gain.setValueAtTime(0.0001, context.currentTime);
  master.gain.exponentialRampToValueAtTime(0.075, context.currentTime + 0.7);
  master.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 3.6);
  master.connect(context.destination);

  const hum = context.createOscillator();
  const humGain = context.createGain();
  hum.type = "sine";
  hum.frequency.setValueAtTime(174, context.currentTime);
  humGain.gain.setValueAtTime(0.0001, context.currentTime);
  humGain.gain.exponentialRampToValueAtTime(0.23, context.currentTime + 0.55);
  humGain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 3.35);
  hum.connect(humGain).connect(master);

  const overtone = context.createOscillator();
  const overtoneGain = context.createGain();
  overtone.type = "sine";
  overtone.frequency.setValueAtTime(261, context.currentTime);
  overtoneGain.gain.setValueAtTime(0.0001, context.currentTime);
  overtoneGain.gain.exponentialRampToValueAtTime(0.06, context.currentTime + 0.8);
  overtoneGain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 3.1);
  overtone.connect(overtoneGain).connect(master);

  const noiseBuffer = context.createBuffer(1, context.sampleRate * 3.2, context.sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);
  for (let index = 0; index < noiseData.length; index += 1) {
    noiseData[index] = (Math.random() * 2 - 1) * 0.7;
  }

  const wind = context.createBufferSource();
  const windFilter = context.createBiquadFilter();
  const windGain = context.createGain();
  wind.buffer = noiseBuffer;
  windFilter.type = "bandpass";
  windFilter.frequency.setValueAtTime(380, context.currentTime);
  windFilter.frequency.exponentialRampToValueAtTime(1_600, context.currentTime + 1.8);
  windFilter.frequency.exponentialRampToValueAtTime(520, context.currentTime + 3.1);
  windFilter.Q.setValueAtTime(0.45, context.currentTime);
  windGain.gain.setValueAtTime(0.0001, context.currentTime);
  windGain.gain.exponentialRampToValueAtTime(0.22, context.currentTime + 1.1);
  windGain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 3.15);
  wind.connect(windFilter).connect(windGain).connect(master);

  const startTime = context.currentTime;
  hum.start(startTime);
  overtone.start(startTime);
  wind.start(startTime + 0.35);
  hum.stop(startTime + 3.65);
  overtone.stop(startTime + 3.65);
  wind.stop(startTime + 3.55);

  if (context.state === "suspended") {
    void context.close();
    return false;
  }

  window.setTimeout(() => {
    void context.close();
  }, 4_000);
  return true;
}

function playEntranceSound() {
  try {
    if (window.sessionStorage.getItem(ENTRANCE_SOUND_KEY)) return true;
    const didStart = createEntranceSound();
    if (didStart) window.sessionStorage.setItem(ENTRANCE_SOUND_KEY, "true");
    return didStart;
  } catch {
    return false;
  }
}

export function Soundscape() {
  useEffect(() => {
    setVolume(0.55);
    bind();

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let entranceSoundStarted = reducedMotion || playEntranceSound();
    const startEntranceSound = () => {
      if (entranceSoundStarted) return;
      entranceSoundStarted = playEntranceSound();
      if (entranceSoundStarted) removeGestureListeners();
    };
    const removeGestureListeners = () => {
      window.removeEventListener("pointerdown", startEntranceSound);
      window.removeEventListener("keydown", startEntranceSound);
      window.removeEventListener("touchstart", startEntranceSound);
    };
    if (!entranceSoundStarted) {
      window.addEventListener("pointerdown", startEntranceSound, { once: true, passive: true });
      window.addEventListener("keydown", startEntranceSound, { once: true });
      window.addEventListener("touchstart", startEntranceSound, { once: true, passive: true });
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

  return null;
}
