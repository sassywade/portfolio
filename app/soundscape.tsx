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

async function playWindSound(audio: HTMLAudioElement) {
  try {
    await audio.play();
    return true;
  } catch {
    return false;
  }
}

export function Soundscape() {
  const [showWindControl, setShowWindControl] = useState(false);

  useEffect(() => {
    setVolume(0.55);
    bind();

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let entranceSoundStarted = reducedMotion;
    let entranceSoundStarting = false;
    let disposed = false;
    let gustArrived = false;
    const windAudio = new Audio("/audio/meadow-wind-leaves.mp3");
    windAudio.preload = "auto";
    windAudio.volume = 0.65;
    const startEntranceSound = async (userInitiated = true) => {
      if (disposed || !gustArrived || entranceSoundStarted || entranceSoundStarting || document.hidden) return;
      if (document.documentElement.dataset.meadowPresent === "false") return;
      entranceSoundStarting = true;
      entranceSoundStarted = await playWindSound(windAudio);
      entranceSoundStarting = false;
      if (disposed) { windAudio.pause(); return; }
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
    const handleGust = () => {
      gustArrived = true;
      void startEntranceSound(false);
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
      window.addEventListener("portfolio:meadow-gust", handleGust);
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
      windAudio.pause();
      windAudio.removeAttribute("src");
      windAudio.load();
      window.removeEventListener("portfolio:meadow-gust", handleGust);
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
