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

function addDeclarativeClickCue(root: ParentNode) {
  root.querySelectorAll<HTMLElement>(actionableSelector).forEach((element) => {
    if (element.matches(explicitClickCueSelector)) return;

    element.dataset.cuelumePress = "press";
    element.dataset.cuelumeRelease = "release";
    element.dataset.cuelumeAutomatic = "true";
  });
}

export function Soundscape() {
  useEffect(() => {
    setVolume(0.55);
    bind();

    addDeclarativeClickCue(document);

    const observer = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;

          if (
            node.matches(actionableSelector) &&
            !node.matches(explicitClickCueSelector)
          ) {
            const element = node as HTMLElement;
            element.dataset.cuelumePress = "press";
            element.dataset.cuelumeRelease = "release";
            element.dataset.cuelumeAutomatic = "true";
          }

          addDeclarativeClickCue(node);
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      document
        .querySelectorAll<HTMLElement>("[data-cuelume-automatic='true']")
        .forEach((element) => {
          delete element.dataset.cuelumePress;
          delete element.dataset.cuelumeRelease;
          delete element.dataset.cuelumeAutomatic;
        });
    };
  }, []);

  return null;
}
