"use client";

import { useEffect } from "react";
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

const explicitClickCueSelector = [
  "[data-cuelume-press]",
  "[data-cuelume-release]",
  "[data-cuelume-toggle]",
].join(",");

function addDeclarativeInteractionCue(element: HTMLElement) {
  if (!element.hasAttribute("data-cuelume-hover")) {
    element.dataset.cuelumeHover = "tick";
    element.dataset.cuelumeAutomaticHover = "true";
  }

  if (element.matches(explicitClickCueSelector)) return;

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

export function Soundscape() {
  useEffect(() => {
    setVolume(0.55);
    bind();

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
