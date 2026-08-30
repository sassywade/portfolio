"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FLAT_MEADOW_TEXTURES, type FlatMeadowTexture, type MeadowVariant } from "./meadow";
import type { WindKey, WindSettings } from "./wind";

const windFields: Array<{ key: WindKey; label: string }> = [
  { key: "breeze", label: "Breeze" },
  { key: "gust", label: "Gust" },
  { key: "elasticity", label: "Elasticity" },
  { key: "tempo", label: "Gust rhythm" },
];

type MeadowSettingsProps = {
  variant: MeadowVariant;
  flatTexture: FlatMeadowTexture;
  flatColor: string;
  wind: WindSettings;
  isPlaying: boolean;
  isVisible: boolean;
  onVariantChange: (variant: MeadowVariant) => void;
  onFlatTextureChange: (texture: FlatMeadowTexture) => void;
  onFlatColorChange: (color: string) => void;
  onWindChange: (key: WindKey, value: number) => void;
  onPlayingChange: (isPlaying: boolean) => void;
};

export function MeadowSettings({
  variant,
  flatTexture,
  flatColor,
  wind,
  isPlaying,
  isVisible,
  onVariantChange,
  onFlatTextureChange,
  onFlatColorChange,
  onWindChange,
  onPlayingChange,
}: MeadowSettingsProps) {
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [portalHost, setPortalHost] = useState<HTMLElement | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const closePanel = () => {
    setIsExpanded(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  };

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setPortalHost(document.body));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (isVisible) return;
    const frame = window.requestAnimationFrame(() => setIsExpanded(false));
    return () => window.cancelAnimationFrame(frame);
  }, [isVisible]);

  useEffect(() => {
    if (!isExpanded) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      closePanel();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isExpanded]);

  if (!portalHost) return null;

  return createPortal(
    <div
      className="meadow-settings"
      data-meadow-settings
      data-scene-visible={isVisible ? "true" : "false"}
    >
      <button
        ref={triggerRef}
        type="button"
        className="meadow-settings__gear"
        aria-expanded={isExpanded}
        aria-controls={panelId}
        aria-label={isExpanded ? "Close meadow and wind settings" : "Open meadow and wind settings"}
        title="Meadow and wind settings"
        data-cuelume-toggle="panel"
        onClick={() => setIsExpanded((current) => !current)}
      >
        <span aria-hidden="true">⚙</span>
      </button>

      {isExpanded && (
        <aside id={panelId} className="meadow-settings__panel" aria-label="Meadow and wind settings">
          <div className="meadow-settings__head">
            <div>
              <span>Meadow settings</span>
              <small>Alamo Square study</small>
            </div>
            <button
              type="button"
              className="meadow-settings__close"
              data-cuelume-toggle="panel"
              onClick={closePanel}
            >
              Close
            </button>
          </div>

          <section className="meadow-settings__section" aria-labelledby={`${panelId}-meadow`}>
            <h2 id={`${panelId}-meadow`}>Meadow lab</h2>
            <div className="meadow-settings__modes" aria-label="Meadow style">
              <button
                type="button"
                aria-pressed={variant === "living"}
                data-cuelume-toggle="meadow"
                onClick={() => onVariantChange("living")}
              >
                Living
              </button>
              <button
                type="button"
                aria-pressed={variant === "flat"}
                data-cuelume-toggle="meadow"
                onClick={() => onVariantChange("flat")}
              >
                Flat
              </button>
            </div>

            <div className="meadow-settings__texture">
              <span>Flat texture</span>
              <div className="meadow-settings__texture-options" aria-label="Flat meadow texture">
                {FLAT_MEADOW_TEXTURES.map(({ id, label, src }) => (
                  <button
                    type="button"
                    aria-pressed={flatTexture === id}
                    data-cuelume-toggle="meadow-texture"
                    onClick={() => onFlatTextureChange(id)}
                    key={id}
                  >
                    <span
                      className="meadow-settings__texture-thumb"
                      style={{ backgroundImage: `url(${src})` }}
                      aria-hidden="true"
                    />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <label className="meadow-settings__color">
              <span>Flat color</span>
              <span className="meadow-settings__color-control">
                <input
                  type="color"
                  value={flatColor}
                  aria-label="Flat meadow color"
                  onChange={(event) => onFlatColorChange(event.target.value)}
                />
                <output>{flatColor.toUpperCase()}</output>
              </span>
            </label>
          </section>

          <section className="meadow-settings__section" aria-labelledby={`${panelId}-wind`}>
            <div className="meadow-settings__section-head">
              <div>
                <h2 id={`${panelId}-wind`}>Wind study</h2>
                <small>Live Alamo baseline</small>
              </div>
              <button
                type="button"
                className="meadow-settings__motion-toggle"
                aria-pressed={isPlaying}
                data-cuelume-toggle="motion"
                onClick={() => onPlayingChange(!isPlaying)}
              >
                {isPlaying ? "Pause" : "Play"}
              </button>
            </div>

            <div className="meadow-settings__wind-fields">
              {windFields.map(({ key, label }) => (
                <label className="meadow-settings__wind-field" key={key}>
                  <span>{label}<output>{wind[key].toFixed(2)}</output></span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={wind[key]}
                    aria-label={label}
                    onChange={(event) => onWindChange(key, Number(event.target.value))}
                  />
                </label>
              ))}
            </div>
          </section>
        </aside>
      )}
    </div>,
    portalHost,
  );
}
