"use client";

/* Native local images keep the tiny Philip preview immediate. */
/* eslint-disable @next/next/no-img-element */

import { useEffect, useId, useState } from "react";
import { usePathname } from "next/navigation";
import { SmileyCursor } from "./smiley-cursor";

const PHILIP_PREFERENCE_KEY = "portfolio:philip-enabled";
const PHILIP_PREFERENCE_EVENT = "portfolio:philip-preference";

function readPhilipPreference() {
  try {
    return window.localStorage.getItem(PHILIP_PREFERENCE_KEY) !== "false";
  } catch {
    return true;
  }
}

function savePhilipPreference(isEnabled: boolean) {
  try {
    window.localStorage.setItem(PHILIP_PREFERENCE_KEY, String(isEnabled));
  } catch {
    // The preference still applies for this visit when storage is unavailable.
  }

  window.dispatchEvent(
    new CustomEvent<boolean>(PHILIP_PREFERENCE_EVENT, { detail: isEnabled }),
  );
}

export function PhilipToggle() {
  const pathname = usePathname();
  const [isEnabled, setIsEnabled] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const preferenceFrame = window.requestAnimationFrame(() => {
      setIsEnabled(readPhilipPreference());
      setIsReady(true);
    });

    const handlePreference = (event: Event) => {
      setIsEnabled((event as CustomEvent<boolean>).detail);
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === PHILIP_PREFERENCE_KEY) {
        setIsEnabled(event.newValue !== "false");
      }
    };

    window.addEventListener(PHILIP_PREFERENCE_EVENT, handlePreference);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.cancelAnimationFrame(preferenceFrame);
      window.removeEventListener(PHILIP_PREFERENCE_EVENT, handlePreference);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  if (pathname !== "/") return null;

  return isReady && isEnabled ? <SmileyCursor /> : null;
}

export function PhilipPickerToggle() {
  const tooltipId = useId();
  const [isEnabled, setIsEnabled] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const preferenceFrame = window.requestAnimationFrame(() => {
      setIsEnabled(readPhilipPreference());
      setIsReady(true);
    });

    const handlePreference = (event: Event) => {
      setIsEnabled((event as CustomEvent<boolean>).detail);
    };

    window.addEventListener(PHILIP_PREFERENCE_EVENT, handlePreference);

    return () => {
      window.cancelAnimationFrame(preferenceFrame);
      window.removeEventListener(PHILIP_PREFERENCE_EVENT, handlePreference);
    };
  }, []);

  const togglePhilip = () => {
    const nextEnabled = !isEnabled;
    setIsEnabled(nextEnabled);
    savePhilipPreference(nextEnabled);
  };

  return (
    <div
      className="philip-toggle"
      data-enabled={isEnabled ? "true" : "false"}
      data-ready={isReady ? "true" : "false"}
    >
      <span className="philip-toggle__state" aria-hidden="true">
        {isEnabled ? "On" : "Off"}
      </span>
      <button
        className="philip-toggle__switch"
        type="button"
        role="switch"
        aria-checked={isEnabled}
        aria-label="Toggle Philip"
        aria-describedby={tooltipId}
        data-cuelume-toggle="bloom"
        onClick={togglePhilip}
      >
        <span className="philip-toggle__knob" aria-hidden="true">
          <img src="/pet/pet-idle.png" alt="" />
        </span>
      </button>
      <span className="philip-toggle__tooltip" id={tooltipId} role="tooltip">
        Toggle Philip
      </span>
    </div>
  );
}
