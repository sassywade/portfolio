import type { ReactNode } from "react";
import { AsciiGarden, type AsciiGardenTheme } from "./ascii-garden";
import type { MeadowVariant } from "./meadow";
import type { WindSettings } from "./wind";

type AsciiFieldNotesProps = {
  children?: ReactNode;
  isPlaying: boolean;
  theme: AsciiGardenTheme;
  variant: MeadowVariant;
  wind: WindSettings;
};
export function AsciiFieldNotes({ children, isPlaying, theme, variant, wind }: AsciiFieldNotesProps) {
  return (
    <AsciiGarden
      isPlaying={isPlaying}
      live
      theme={theme}
      variant={variant}
      wind={wind}
    >
      {children}
    </AsciiGarden>
  );
}
