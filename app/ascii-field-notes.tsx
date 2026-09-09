import type { CSSProperties, ReactNode } from "react";
import type { MeadowVariant } from "./meadow";
import type { WindSettings } from "./wind";

type AsciiFieldNotesProps = {
  children?: ReactNode;
  isPlaying: boolean;
  variant: MeadowVariant;
  wind: WindSettings;
};

type FieldNotesStyle = CSSProperties & {
  "--field-sway-start": string;
  "--field-sway-mid": string;
  "--field-sway-end": string;
  "--field-wind-duration": string;
};

const CANOPY_CLUSTERS = [
  {
    className: "ascii-field-notes__cluster--crown",
    map: "       v  y  v\n   yvVYvyyvVv\n ,vVYVvVYVYvy,\n    'yvVYvy'",
  },
  {
    className: "ascii-field-notes__cluster--upper-left",
    map: "      v y\n  ,yvVYVYvvy,\n yVYVvvyVYVYv\n   'yvvYv'",
  },
  {
    className: "ascii-field-notes__cluster--upper-right",
    map: "    y v\n ,yvVYVYVv,\n yVYVvyyVYVYv\n   'yVYv'",
  },
  {
    className: "ascii-field-notes__cluster--middle-left",
    map: "        v\n  ,yvVYVYVYvvy,\n yVYVvyyvVYVYVv\n    'yvYVv'",
  },
  {
    className: "ascii-field-notes__cluster--middle-right",
    map: "     v y\n ,yvVYVYVYVv,\n yVYVvyyVYVYVy\n    'yvVv'",
  },
  {
    className: "ascii-field-notes__cluster--lower",
    map: "      v\n  ,yvVYVYVvy,\n yVYVvyyVYVYv\n    'yVYv'",
  },
] as const;

const TREE_WOOD = String.raw`
                 \        /
          \       \  |   /       /
           \__     \ |  /    ___/
              \     \| /    /
        ___     \     /    _/
           \_____\   /____/
                  \ //
              \    ||    /
               \   ||   /
                \  ||  /
                 \ || /
                  \||/
                  {||}
                 {{||}}
                 {{||}}
                {{{||}}}
               {{{ || }}}
              {{   ||   }}
             {{    ||    }}
            {{____/  \____}}
`;

const MEADOW_GLYPHS = String.raw`
   ,       ;        v          ,       y        ;           v       ,          y
      v         ,        ;        y         v       ,           ;        v
 ;        y          v       ,         ;        y          ,          v       ;
     ,        v          y        ;         ,        v          y        ,
  v      ;         ,         v         y        ;          v         ,       y
      y       ,         ;         v        ,          y        ;          v
 ;       v         y        ,         ;        v          ,        y
    ,         ;        v         y         ,        ;          v        ,
 y       v        ,          ;        y        v         ,          ;        y
     ;        y         v        ,         ;        y          v         ,
`;

export function AsciiFieldNotes({ children, isPlaying, variant, wind }: AsciiFieldNotesProps) {
  const direction = wind.direction < 0 ? -1 : 1;
  const breezeAngle = 0.45 + wind.breeze * 1.15;
  const gustAngle = 0.3 + wind.gust * 0.95;
  const style = {
    "--field-sway-start": `${(-breezeAngle * 0.55 * direction).toFixed(2)}deg`,
    "--field-sway-mid": `${(breezeAngle * 0.2 * direction).toFixed(2)}deg`,
    "--field-sway-end": `${((breezeAngle + gustAngle) * direction).toFixed(2)}deg`,
    "--field-wind-duration": `${(7.4 - wind.tempo * 3.2).toFixed(2)}s`,
  } as FieldNotesStyle;

  return (
    <div
      className="ascii-field-notes"
      data-playing={isPlaying ? "true" : "false"}
      data-meadow-variant={variant}
      style={style}
    >
      <span className="sr-only">
        A spare typographic field note of Alamo Square: a rooted Monterey cypress sways above a rolling meadow while a photographer explores nearby.
      </span>
      <div className="ascii-field-notes__tree" aria-hidden="true">
        <pre className="ascii-field-notes__wood">{TREE_WOOD}</pre>
        <div className="ascii-field-notes__canopy">
          {CANOPY_CLUSTERS.map(({ className, map }, index) => (
            <span className={`ascii-field-notes__cluster ${className}`} key={className}>
              <pre data-sway={index % 2 === 0 ? "forward" : "back"}>{map}</pre>
            </span>
          ))}
        </div>
      </div>

      <div
        className="ascii-field-notes__meadow"
        data-meadow-surface="active"
      >
        <span className="ascii-field-notes__underprint" aria-hidden="true" />
        <pre className="ascii-field-notes__grass" aria-hidden="true">{MEADOW_GLYPHS}</pre>
        {children}
      </div>
    </div>
  );
}
