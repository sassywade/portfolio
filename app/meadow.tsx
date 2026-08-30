/* eslint-disable @next/next/no-img-element */

import type { AlamoStyleDefinition } from "./alamo-styles";

type MeadowProps = {
  isPlaying: boolean;
  variant: MeadowVariant;
  flatTexture: FlatMeadowTexture;
  rollingMeadow: RollingMeadow;
  environmentStyle: AlamoStyleDefinition;
};

export type MeadowVariant = "living" | "flat";
export const ROLLING_MEADOWS = [
  { id: "original", label: "Original", src: "/meadow-ground.png" },
  { id: "coastal", label: "Coastal green", src: "/meadow-rolling-coastal.png" },
  { id: "golden", label: "Golden hour", src: "/meadow-rolling-golden.png" },
  { id: "wildflower", label: "Wildflowers", src: "/meadow-rolling-wildflower.png" },
  { id: "foggy", label: "Foggy morning", src: "/meadow-rolling-foggy.png" },
] as const;
export type RollingMeadow = (typeof ROLLING_MEADOWS)[number]["id"];
export const FLAT_MEADOW_TEXTURES = [
  { id: "fine", label: "Fine cut", src: "/flat-meadow-fine.jpg" },
  { id: "clover", label: "Soft clover", src: "/flat-meadow-clover.jpg" },
  { id: "wind", label: "Windswept", src: "/flat-meadow-wind.jpg" },
] as const;
export type FlatMeadowTexture = (typeof FLAT_MEADOW_TEXTURES)[number]["id"];

export function Meadow({
  isPlaying,
  variant,
  flatTexture,
  rollingMeadow,
  environmentStyle,
}: MeadowProps) {
  const texture = FLAT_MEADOW_TEXTURES.find(({ id }) => id === flatTexture) ?? FLAT_MEADOW_TEXTURES[0];
  const isControlStyle = environmentStyle.id === "control";

  return (
    <div className="meadow" data-meadow data-meadow-variant={variant}>
      <div
        className="meadow__visual meadow__visual--living"
        data-meadow-variant="living"
        data-meadow-active={variant === "living" ? "true" : "false"}
        data-meadow-surface={variant === "living" ? "active" : "inactive"}
        data-rolling-meadow={rollingMeadow}
        data-style-mode={isControlStyle ? "control" : "curated"}
      >
        {isControlStyle
          ? ROLLING_MEADOWS.map(({ id, src }) => (
              <img
                className="meadow__image"
                src={src}
                alt=""
                aria-hidden="true"
                data-meadow-image-active={rollingMeadow === id ? "true" : "false"}
                decoding="async"
                key={id}
              />
            ))
          : environmentStyle.rollingSrc && (
              <img
                className="meadow__image meadow__image--curated"
                src={environmentStyle.rollingSrc}
                alt=""
                aria-hidden="true"
                data-meadow-image-active="true"
                decoding="async"
              />
            )}
      </div>
      <div
        className="meadow__visual meadow__visual--flat"
        data-meadow-variant="flat"
        data-meadow-active={variant === "flat" ? "true" : "false"}
        data-meadow-surface={variant === "flat" ? "active" : "inactive"}
        data-playing={isPlaying && variant === "flat" ? "true" : "false"}
        data-flat-texture={flatTexture}
        data-style-mode={isControlStyle ? "control" : "curated"}
        aria-hidden="true"
      >
        {isControlStyle
          ? (
              <div className="meadow__flat-field">
                <img className="meadow__flat-image" src={texture.src} alt="" />
                <span className="meadow__flat-tint" />
              </div>
            )
          : environmentStyle.flatSrc && (
              <img
                className="meadow__curated-flat-image"
                src={environmentStyle.flatSrc}
                alt=""
                decoding="async"
              />
            )}
      </div>
    </div>
  );
}
