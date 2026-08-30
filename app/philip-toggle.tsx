"use client";

/* Native local images keep the tiny Philip preview immediate. */
/* eslint-disable @next/next/no-img-element */

import { useEffect, useId, useState } from "react";
import { usePathname } from "next/navigation";
import { SmileyCursor } from "./smiley-cursor";

const PHILIP_PREFERENCE_KEY = "portfolio:philip-enabled";

export function PhilipToggle() {
  const pathname = usePathname();
  const tooltipId = useId();
  const [isEnabled, setIsEnabled] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const preferenceFrame = window.requestAnimationFrame(() => {
      try {
        setIsEnabled(window.localStorage.getItem(PHILIP_PREFERENCE_KEY) !== "false");
      } catch {
        setIsEnabled(true);
      }
      setIsReady(true);
    });

    return () => window.cancelAnimationFrame(preferenceFrame);
  }, []);

  if (pathname !== "/") return null;

  const togglePhilip = () => {
    const nextEnabled = !isEnabled;
    setIsEnabled(nextEnabled);
    try {
      window.localStorage.setItem(PHILIP_PREFERENCE_KEY, String(nextEnabled));
    } catch {
      // The switch still works for this visit when storage is unavailable.
    }
  };

  return (
    <>
      <div
        className="philip-toggle"
        data-enabled={isEnabled ? "true" : "false"}
        data-ready={isReady ? "true" : "false"}
      >
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
      {isReady && isEnabled ? <SmileyCursor /> : null}
    </>
  );
}
