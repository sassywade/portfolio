"use client";

import { useId, useState } from "react";
import type { MeadowVariant } from "./meadow";

type MeadowPrototypeControlsProps = {
  variant: MeadowVariant;
  flatColor: string;
  onVariantChange: (variant: MeadowVariant) => void;
  onFlatColorChange: (color: string) => void;
};

export function MeadowPrototypeControls({
  variant,
  flatColor,
  onVariantChange,
  onFlatColorChange,
}: MeadowPrototypeControlsProps) {
  const panelId = useId();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isExpanded) {
    return (
      <div className="meadow-prototype meadow-prototype--collapsed" data-secret-prototype>
        <button
          type="button"
          className="meadow-prototype__launcher"
          aria-expanded="false"
          aria-controls={panelId}
          aria-label="Open secret meadow prototype picker"
          onClick={() => setIsExpanded(true)}
        >
          <span className="meadow-prototype__status" style={{ backgroundColor: flatColor }} aria-hidden="true" />
          Meadow lab
        </button>
      </div>
    );
  }

  return (
    <aside
      className="meadow-prototype meadow-prototype--expanded"
      data-secret-prototype
      aria-label="Secret meadow prototype picker"
    >
      <div className="meadow-prototype__head">
        <span>Meadow prototype</span>
        <button
          type="button"
          className="meadow-prototype__minimize"
          aria-expanded="true"
          aria-controls={panelId}
          onClick={() => setIsExpanded(false)}
        >
          Minimize
        </button>
      </div>

      <div className="meadow-prototype__panel" id={panelId}>
        <div className="meadow-prototype__modes" aria-label="Meadow style">
          <button
            type="button"
            aria-pressed={variant === "living"}
            onClick={() => onVariantChange("living")}
          >
            Living
          </button>
          <button
            type="button"
            aria-pressed={variant === "flat"}
            onClick={() => onVariantChange("flat")}
          >
            Flat
          </button>
        </div>

        <label className="meadow-prototype__color">
          <span>Flat color</span>
          <span className="meadow-prototype__color-control">
            <input
              type="color"
              value={flatColor}
              aria-label="Flat meadow color"
              onChange={(event) => onFlatColorChange(event.target.value)}
            />
            <output>{flatColor.toUpperCase()}</output>
          </span>
        </label>
      </div>
    </aside>
  );
}
