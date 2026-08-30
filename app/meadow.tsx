/* eslint-disable @next/next/no-img-element */

type MeadowProps = {
  isPlaying: boolean;
  variant: MeadowVariant;
};

export type MeadowVariant = "living" | "flat";

export function Meadow({ isPlaying, variant }: MeadowProps) {
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
        aria-hidden="true"
      >
        <div className="meadow__flat-field">
          <img className="meadow__flat-image" src="/flat-meadow-generated.webp" alt="" />
          <span className="meadow__flat-tint" />
        </div>
      </div>
    </div>
  );
}
