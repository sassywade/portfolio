"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ALAMO_STYLES, type AlamoStyle } from "./alamo-styles";
import type { AsciiGardenTheme } from "./ascii-garden";
import {
  PORTFOLIO_ATMOSPHERES,
  type PortfolioAtmosphere,
} from "./atmospheres";
import {
  FLAT_MEADOW_TEXTURES,
  ROLLING_MEADOWS,
  type FlatMeadowTexture,
  type MeadowVariant,
  type RollingMeadow,
} from "./meadow";
import type { WindKey, WindSettings } from "./wind";
import type { WorkGridColumns } from "./hero-meadow";
import type { TopPetMode } from "./top-pet";
import { PhilipPickerToggle } from "./philip-toggle";

const windFields: Array<{ key: WindKey; label: string }> = [
  { key: "breeze", label: "Breeze" },
  { key: "gust", label: "Gust" },
  { key: "elasticity", label: "Elasticity" },
  { key: "tempo", label: "Gust rhythm" },
];

type MeadowSettingsProps = {
  environmentStyle: AlamoStyle;
  asciiGardenTheme: AsciiGardenTheme;
  atmosphere: PortfolioAtmosphere;
  workGridColumns: WorkGridColumns;
  heroHighlights: boolean;
  variant: MeadowVariant;
  rollingMeadow: RollingMeadow;
  flatTexture: FlatMeadowTexture;
  flatColor: string;
  meadowHeight: number;
  topPetMode: TopPetMode;
  wind: WindSettings;
  isPlaying: boolean;
  isVisible: boolean;
  onEnvironmentStyleChange: (style: AlamoStyle) => void;
  onAsciiGardenThemeChange: (theme: AsciiGardenTheme) => void;
  onAtmosphereChange: (atmosphere: PortfolioAtmosphere) => void;
  onWorkGridColumnsChange: (columns: WorkGridColumns) => void;
  onHeroHighlightsChange: (isEnabled: boolean) => void;
  onVariantChange: (variant: MeadowVariant) => void;
  onRollingMeadowChange: (rollingMeadow: RollingMeadow) => void;
  onFlatTextureChange: (texture: FlatMeadowTexture) => void;
  onFlatColorChange: (color: string) => void;
  onMeadowHeightChange: (height: number) => void;
  onTopPetModeChange: (mode: TopPetMode) => void;
  onWindChange: (key: WindKey, value: number) => void;
  onPlayingChange: (isPlaying: boolean) => void;
};

export function MeadowSettings({
  environmentStyle,
  asciiGardenTheme,
  atmosphere,
  workGridColumns,
  heroHighlights,
  variant,
  rollingMeadow,
  flatTexture,
  flatColor,
  meadowHeight,
  topPetMode,
  wind,
  isPlaying,
  isVisible,
  onEnvironmentStyleChange,
  onAsciiGardenThemeChange,
  onAtmosphereChange,
  onWorkGridColumnsChange,
  onHeroHighlightsChange,
  onVariantChange,
  onRollingMeadowChange,
  onFlatTextureChange,
  onFlatColorChange,
  onMeadowHeightChange,
  onTopPetModeChange,
  onWindChange,
  onPlayingChange,
}: MeadowSettingsProps) {
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [portalHost, setPortalHost] = useState<HTMLElement | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const rollingMeadowIndex = Math.max(0, ROLLING_MEADOWS.findIndex(({ id }) => id === rollingMeadow));
  const rollingMeadowOption = ROLLING_MEADOWS[rollingMeadowIndex];
  const selectedEnvironment = ALAMO_STYLES.find(({ id }) => id === environmentStyle) ?? ALAMO_STYLES[0];

  const cycleRollingMeadow = (offset: number) => {
    const nextIndex = (rollingMeadowIndex + offset + ROLLING_MEADOWS.length) % ROLLING_MEADOWS.length;
    onRollingMeadowChange(ROLLING_MEADOWS[nextIndex].id);
  };

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

          <section className="meadow-settings__section" aria-labelledby={`${panelId}-atmosphere`}>
            <div className="meadow-settings__section-head">
              <div>
                <h2 id={`${panelId}-atmosphere`}>Atmosphere</h2>
                <small>San Francisco skies</small>
              </div>
            </div>
            <div className="meadow-settings__atmospheres" aria-label="Portfolio background atmosphere">
              {PORTFOLIO_ATMOSPHERES.map(({ id, label }) => (
                <button
                  type="button"
                  aria-pressed={atmosphere === id}
                  data-atmosphere-option={id}
                  data-cuelume-toggle="bloom"
                  onClick={() => onAtmosphereChange(id)}
                  key={id}
                >
                  <span className="meadow-settings__atmosphere-swatch" aria-hidden="true" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
            <p className="meadow-settings__note">
              Studio card grid overrides the selected environment background while keeping its meadow and tree.
            </p>
          </section>

          <section className="meadow-settings__section" aria-labelledby={`${panelId}-work-grid`}>
            <div className="meadow-settings__section-head">
              <div>
                <h2 id={`${panelId}-work-grid`}>Work grid</h2>
                <small>Archive density</small>
              </div>
            </div>
            <div className="meadow-settings__modes" aria-label="Work grid columns">
              <button
                type="button"
                aria-pressed={workGridColumns === 2}
                data-cuelume-toggle="layout"
                onClick={() => onWorkGridColumnsChange(2)}
              >
                2 columns
              </button>
              <button
                type="button"
                aria-pressed={workGridColumns === 3}
                data-cuelume-toggle="layout"
                onClick={() => onWorkGridColumnsChange(3)}
              >
                3 columns
              </button>
            </div>
          </section>

          <section className="meadow-settings__section" aria-labelledby={`${panelId}-hero-highlights`}>
            <div className="meadow-settings__section-head">
              <div>
                <h2 id={`${panelId}-hero-highlights`}>Hero highlights</h2>
                <small>Playful click affordances</small>
              </div>
              <button
                type="button"
                className="meadow-settings__motion-toggle"
                aria-pressed={heroHighlights}
                data-cuelume-toggle="bloom"
                onClick={() => onHeroHighlightsChange(!heroHighlights)}
              >
                {heroHighlights ? "On" : "Off"}
              </button>
            </div>
            <p className="meadow-settings__note">
              Adds color, company marks, and focused hover states to the clickable hero text.
            </p>
          </section>

          <section className="meadow-settings__section" aria-labelledby={`${panelId}-philip`}>
            <div className="meadow-settings__section-head">
              <div>
                <h2 id={`${panelId}-philip`}>Philip</h2>
                <small>Cursor pet</small>
              </div>
              <PhilipPickerToggle />
            </div>
          </section>

          <section className="meadow-settings__section" aria-labelledby={`${panelId}-top-pull`}>
            <div className="meadow-settings__section-head">
              <div>
                <h2 id={`${panelId}-top-pull`}>Hidden faces</h2>
                <small>Pull deliberately past the top</small>
              </div>
              <button
                type="button"
                className="meadow-settings__motion-toggle"
                aria-pressed={topPetMode !== "off"}
                data-cuelume-toggle="motion"
                onClick={() => onTopPetModeChange(topPetMode === "off" ? "quiet" : "off")}
              >
                {topPetMode === "off" ? "Off" : "On"}
              </button>
            </div>
            <div className="meadow-settings__modes" aria-label="Hidden face pull style">
              <button
                type="button"
                aria-pressed={topPetMode === "quiet"}
                disabled={topPetMode === "off"}
                data-cuelume-toggle="bloom"
                onClick={() => onTopPetModeChange("quiet")}
              >
                Quiet
              </button>
              <button
                type="button"
                aria-pressed={topPetMode === "reactive"}
                disabled={topPetMode === "off"}
                data-cuelume-toggle="motion"
                onClick={() => onTopPetModeChange("reactive")}
              >
                Reactive
              </button>
            </div>
            <p className="meadow-settings__note">
              Quiet waits for a committed pull, then reveals only the calm row with no bounce.
            </p>
          </section>

          <section className="meadow-settings__section" aria-labelledby={`${panelId}-meadow`}>
            <h2 id={`${panelId}-meadow`}>Meadow lab</h2>
            <label className="meadow-settings__style-picker">
              <span>Environment style</span>
              <span className="meadow-settings__style-select-wrap">
                <span
                  className="meadow-settings__style-preview"
                  data-environment-style-preview={selectedEnvironment.id}
                  style={{
                    backgroundImage: selectedEnvironment.rollingSrc
                      ? `url(${selectedEnvironment.rollingSrc})`
                      : "url(/meadow-ground.png)",
                  }}
                  aria-hidden="true"
                />
                <select
                  value={environmentStyle}
                  aria-label="Alamo Square visual style"
                  data-environment-style-select
                  onChange={(event) => onEnvironmentStyleChange(event.target.value as AlamoStyle)}
                >
                  {ALAMO_STYLES.map(({ id, label }) => (
                    <option value={id} key={id}>{label}</option>
                  ))}
                </select>
              </span>
            </label>
            <p className="meadow-settings__note">
              Style and meadow shape are independent. Control keeps the original prototype variants.
            </p>
            {environmentStyle === "ascii-garden" && (
              <div className="meadow-settings__ascii-palette">
                <span>ASCII palette</span>
                <div className="meadow-settings__modes" aria-label="ASCII Garden palette">
                  <button
                    type="button"
                    aria-pressed={asciiGardenTheme === "dark"}
                    data-cuelume-toggle="palette"
                    onClick={() => onAsciiGardenThemeChange("dark")}
                  >
                    Dark
                  </button>
                  <button
                    type="button"
                    aria-pressed={asciiGardenTheme === "light"}
                    data-cuelume-toggle="palette"
                    onClick={() => onAsciiGardenThemeChange("light")}
                  >
                    Light
                  </button>
                </div>
              </div>
            )}
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

            <label className="meadow-settings__height">
              <span>Meadow height <output>{meadowHeight}%</output></span>
              <input
                type="range"
                min="70"
                max="130"
                step="1"
                value={meadowHeight}
                aria-label="Meadow height"
                onChange={(event) => onMeadowHeightChange(Number(event.target.value))}
              />
            </label>

            {environmentStyle === "control" ? (
              <>
                <div className="meadow-settings__rolling">
                  <span>Rolling meadow</span>
                  <div className="meadow-settings__rolling-preview" aria-hidden="true">
                    <span style={{ backgroundImage: `url(${rollingMeadowOption.src})` }} />
                  </div>
                  <div className="meadow-settings__rolling-cycle">
                    <button
                      type="button"
                      aria-label="Previous rolling meadow"
                      data-cuelume-toggle="rolling-meadow"
                      onClick={() => cycleRollingMeadow(-1)}
                    >
                      ←
                    </button>
                    <output aria-live="polite">{rollingMeadowOption.label}</output>
                    <button
                      type="button"
                      aria-label="Next rolling meadow"
                      data-cuelume-toggle="rolling-meadow"
                      onClick={() => cycleRollingMeadow(1)}
                    >
                      →
                    </button>
                  </div>
                  <small>{rollingMeadowIndex + 1} / {ROLLING_MEADOWS.length}</small>
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
              </>
            ) : environmentStyle === "ascii-garden" ? (
              <div className="meadow-settings__curated-summary">
                <span>ASCII Garden · checkpoint 1</span>
                <small>Deterministic glyph meadow · fixed static sprites · paired palettes</small>
              </div>
            ) : (
              <div className="meadow-settings__curated-summary">
                <span>{selectedEnvironment.shortLabel}</span>
                <small>Dedicated rolling meadow · flat meadow · animated cypress</small>
              </div>
            )}
          </section>

          <section className="meadow-settings__section" aria-labelledby={`${panelId}-wind`}>
            <div className="meadow-settings__section-head">
              <div>
                <h2 id={`${panelId}-wind`}>Wind study</h2>
                <small>Live Alamo baseline</small>
              </div>
              {environmentStyle !== "ascii-garden" && (
                <button
                  type="button"
                  className="meadow-settings__motion-toggle"
                  aria-pressed={isPlaying}
                  data-cuelume-toggle="motion"
                  onClick={() => onPlayingChange(!isPlaying)}
                >
                  {isPlaying ? "Pause" : "Play"}
                </button>
              )}
            </div>

            {environmentStyle === "ascii-garden" ? (
              <p className="meadow-settings__note">
                This first checkpoint is intentionally still. Live branch wind and figure actions come next.
              </p>
            ) : (
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
            )}
          </section>
        </aside>
      )}
    </div>,
    portalHost,
  );
}
