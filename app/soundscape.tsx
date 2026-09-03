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
