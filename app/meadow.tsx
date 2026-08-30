/* eslint-disable @next/next/no-img-element */

type MeadowProps = {
  isPlaying: boolean;
  variant: MeadowVariant;
  flatTexture: FlatMeadowTexture;
};

export type MeadowVariant = "living" | "flat";
export const FLAT_MEADOW_TEXTURES = [
  { id: "fine", label: "Fine cut", src: "/flat-meadow-fine.jpg" },
  { id: "clover", label: "Soft clover", src: "/flat-meadow-clover.jpg" },
  { id: "wind", label: "Windswept", src: "/flat-meadow-wind.jpg" },
] as const;
export type FlatMeadowTexture = (typeof FLAT_MEADOW_TEXTURES)[number]["id"];

export function Meadow({ isPlaying, variant, flatTexture }: MeadowProps) {
  const texture = FLAT_MEADOW_TEXTURES.find(({ id }) => id === flatTexture) ?? FLAT_MEADOW_TEXTURES[0];

  return (
    <div className="meadow" data-meadow data-meadow-variant={variant}>
      <div
        className="meadow__visual meadow__visual--living"
        data-meadow-variant="living"
        data-meadow-active={variant === "living" ? "true" : "false"}
        data-meadow-surface={variant === "living" ? "active" : "inactive"}
      >
        <img className="meadow__image" src="/meadow-ground.png" alt="" />
      </div>
      <div
        className="meadow__visual meadow__visual--flat"
        data-meadow-variant="flat"
        data-meadow-active={variant === "flat" ? "true" : "false"}
        data-meadow-surface={variant === "flat" ? "active" : "inactive"}
        data-playing={isPlaying && variant === "flat" ? "true" : "false"}
        data-flat-texture={flatTexture}
        aria-hidden="true"
      >
        <div className="meadow__flat-field">
          <img className="meadow__flat-image" src={texture.src} alt="" />
          <span className="meadow__flat-tint" />
        </div>
      </div>
    </div>
  );
}
