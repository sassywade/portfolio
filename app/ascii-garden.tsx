import type { CSSProperties } from "react";
import type { MeadowVariant } from "./meadow";

export type AsciiGardenTheme = "dark" | "light";

type GlyphTone =
  | "ink"
  | "olive"
  | "olive-soft"
  | "rust"
  | "pink"
  | "cyan"
  | "blue"
  | "hair"
  | "skin";

type GlyphLayer = {
  map: string;
  tone: GlyphTone;
};

type AsciiGardenProps = {
  theme: AsciiGardenTheme;
  variant: MeadowVariant;
};

type Detail = {
  glyph: string;
  tone: GlyphTone;
  x: string;
  bottom: string;
  size?: string;
};

type DetailStyle = CSSProperties & {
  "--ascii-detail-x": string;
  "--ascii-detail-bottom": string;
  "--ascii-detail-size"?: string;
};

const fixedMap = (value: string) => value.replace(/^\n/, "").replace(/\n$/, "");

// These matrices are deliberately hand-authored and fixed. The two palettes
// render the exact same cells, so changing theme never changes the scene.
const MEADOW_PRIMARY = fixedMap(String.raw`
  .   .  .   .   .  .   .  .   .   .  .   .  .   .  .   .   .  .   .  .   .  .   .   .  .   .  .   .  .   .   .  .   .  .   .   .  .   .  .   .  .   .   .
.  .   .  ..  .   .  . ..  . .  .   . .. .  .  .   .  . .  .   . ..  .   . .   .  . ..  . .  .   .  . .  .   . ..  .  .  .   . .  .   .  .  . .  .   .  .
 .. . .. .  . .. . .  . . .. .  . .. . .  . .. . . .. . .  . .. .  .. . .  . .. . .  . .. . . .. .  . .. . .  . .. . .  . .. .  .. . .  . .. . .  . .. .
. .. . . .. . . .. . .. . . .. . . .. . .. . . .. . . .. . .. . . .. . . .. . .. . . .. . . .. . .. . . .. . . .. . .. . . .. . . .. . .. . . .. . . ..
.. . ... . .. ... . .. . ... . .. ... . .. . ... . .. ... . .. . ... . .. ... . .. . ... . .. ... . .. . ... . .. ... . .. . ... . .. ... . .. . ... . .. ...
................................................................................................................................................................
... .... ... ..... .... ... .... ..... ... .... ... ..... .... ... .... ..... ... .... ... ..... .... ... .... ..... ... .... ... ..... .... ... .... ..... ... ....
................................................................................................................................................................
.... ...... ..... ...... ...... ..... ...... ..... ...... ...... ..... ...... ..... ...... ...... ..... ...... ..... ...... ...... ..... ...... ..... ...... ...... ....
................................................................................................................................................................
`);

const MEADOW_SECONDARY = fixedMap(String.raw`
       '       ,          '       ,         '         ,        '          ,        '         ,         '       ,          '       ,         '         ,       '
  ,        '        ,         '       ,          '        ,        '          ,       '          ,        '       ,           '       ,         '        ,
      ;        ,        ;        ,         ;        ,         ;       ,          ;        ,         ;        ,         ;        ,         ;       ,        ;
 ,        ;        ,         ;       ,          ;       ,         ;        ,          ;       ,         ;         ,       ;          ,        ;        ,
     '        ,         '        ,       '         ,         '       ,          '        ,        '         ,        '        ,        '         ,       '
  ;       ,         ;       ,         ;        ,         ;       ,         ;         ,        ;       ,          ;       ,         ;        ,         ;
       ,        '        ,         '        ,       '          ,       '         ,         '       ,         '        ,        '        ,          '
  ,         ;       ,         ;        ,        ;         ,         ;       ,          ;       ,         ;       ,         ;       ,          ;
      '         ,       '         ,         '        ,        '         ,        '          ,        '         ,         '        ,       '
   ,       ;         ,       ;         ,        ;       ,          ;        ,        ;         ,        ;         ,       ;         ,
`);

const CYPRESS_FOLIAGE = fixedMap(String.raw`
                                  vvVVVVvv
                         vvvVVVVVVVVVVVVVVVVvv
                  vvvVVVVVVVVVVVVVVVVVVVVVVVVVVvv
           vvvVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVvv
       vvVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVvv
            vvvVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVvvvv
                     vvvVVVVVVVVVVVVVVVVVVvvvv
                              vvvvvv
         vvvVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVvv
     vvVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVvv
          vvvVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVvv
                       vvvVVVVVVVVVVVVVVvvvv
                                 vvv
                vvvVVVVVVVVVVVVVVVVVVVVVVVVvv
          vvvVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVvv
               vvvVVVVVVVVVVVVVVVVVVVVVVVvv
                            vvvVVVVvv
                                    vv
                     vvvVVVVVVVVVVVVVVVVVVVvv
                vvvVVVVVVVVVVVVVVVVVVVVVVVVVVVvv
                     vvvVVVVVVVVVVVVVVVVVvv
                                vvvvv
                         vvvVVVVVVVVVVVVvv
                     vvvVVVVVVVVVVVVVVVVVVvv
                           vvvVVVVVVvv
`);

const CYPRESS_FOLIAGE_SOFT = fixedMap(String.raw`
                              .,,''..,,.
                       .,,''..    .,,''..,,.
                .,,''..  .,,''..  .,,''..   .,,.
          .,,''..  .,,''..   .,,''..  .,,''..   .,,.
      .,,''..  .,,''..  .,,''..   .,,''..  .,,''..
           .,,''..  .,,''..  .,,''..    .,,.
                  .,,''..  .,,''..,,.

        .,,''..  .,,''..  .,,''..  .,,''..,,.
    .,,''..  .,,''..  .,,''..   .,,''..   .,,.
         .,,''..   .,,''..   .,,''..,,.
                    .,,''..,,.

              .,,''..   .,,''..  .,,''..,,.
         .,,''..   .,,''..   .,,''..    .,,.
              .,,''..  .,,''..,,.


                  .,,''..   .,,''..  .,,''..,,.
             .,,''..  .,,''..   .,,''..   .,,.
                  .,,''..   .,,''..,,.

                       .,,''..  .,,''..,,.
                   .,,''..  .,,''..   .,,.
                        .,,''..,,.
`);

const CYPRESS_WOOD = fixedMap(String.raw`




                           /|          |\
                       ___/ |          | \___
                    __/     |          |     \__
                            |\        /|
                 ____      /| \      / |      ____
              __/    \____/ |  \____/  |\____/    \__
                         /   |    ||    |   \
                        /    |    ||    |    \
                  _____/    /|    ||    |\    \_____
               __/         / |    ||    | \         \__
                          /  |    ||    |  \
                         /   |    ||    |   \
                     ___/    |    ||    |    \___
                   _/       /|    ||    |\       \_
                          / |    ||    | \
                         /  |    ||    |  \
                   _____/   |    ||    |   \_____
                __/        /|    ||    |\        \__
                          / |    ||    | \
                         /  |    ||    |  \
                        /   |    ||    |   \
                       /   /|    ||    |\   \
                      /   / |    ||    | \   \
                     /   /  |    ||    |  \   \
                    /   /   |    ||    |   \   \
                   /   /   /|    ||    |\   \   \
                  /___/___/ |    ||    | \___\___\
                     _..___/      ||      \___.._
                  __/             ||             \__
               __/________________||________________\__
`);

const BACKPACKER_INK = fixedMap(String.raw`
      ▓▓▓
     ▓o ▓
      /|\
   __/ | \__
  /    |    \
 /     |     \
       |
      / \
  ___/   \___
 /           \
/             \
   /       \
 _/         \_
'             '
`);

const BACKPACKER_PACK = fixedMap(String.raw`

         ▓▓
        ▓▓▓▓
       ▓▓▓▓▓
       ▓▓▓▓▓
        ▓▓▓
`);

const STANDING_INK = fixedMap(String.raw`


     o
     -
   \___/
    /|\
   / | \
     |
     |
    / \
    | |
    | |
   _| |_
  '   '
`);

const STANDING_HAIR = fixedMap(String.raw`
   ▓▓▓▓▓
  ▓▓▓▓▓▓▓
 ▓▓     ▓▓
 ▓       ▓
`);

const STANDING_PANTS = fixedMap(String.raw`









    ║ ║
    ║ ║
    ║ ║
    ║ ║
`);

// The rider is filled, while the bicycle deliberately keeps its open wheels,
// frame, spokes, and negative space.
const CYCLIST_BIKE = fixedMap(String.raw`
            __
        ___/  \__
     __/  /--\   \
   _/____/    \___\_
  /      \____/      \
 (   o----\__/----o   )
  \_/      /\      \_/
        __/  \__
`);

const CYCLIST_BODY = fixedMap(String.raw`
        ▓▓▓
       ▓▓▓▓▓
      ▓▓▓▓▓▓▓
       ▓▓▓▓▓▓▓
         ▓▓ ▓▓
        ▓▓   ▓▓
        ▓     ▓
`);

const CYCLIST_SKIN = fixedMap(String.raw`
          ▒
         ▒▒
            ▒▒
             ▒▒
`);

const DETAILS: Detail[] = [
  { glyph: "Y\n|", tone: "olive", x: "8%", bottom: "21%" },
  { glyph: ";)_", tone: "cyan", x: "17%", bottom: "28%" },
  { glyph: "vYv\n\\|/", tone: "pink", x: "22%", bottom: "13%" },
  { glyph: "(o)\n/|\\", tone: "pink", x: "39%", bottom: "7%" },
  { glyph: ";)_", tone: "cyan", x: "57%", bottom: "30%" },
  { glyph: "vvv\n^^^", tone: "blue", x: "65%", bottom: "17%" },
  { glyph: "vYv\n/|\\", tone: "pink", x: "72%", bottom: "8%" },
  { glyph: "(·)", tone: "cyan", x: "83%", bottom: "28%" },
  { glyph: "Y\n|", tone: "olive", x: "92%", bottom: "13%" },
  { glyph: "wYw\n\\|/", tone: "rust", x: "96%", bottom: "21%" },
];

function GlyphStack({ className, layers }: { className: string; layers: GlyphLayer[] }) {
  return (
    <span className={`ascii-garden__glyph-stack ${className}`} aria-hidden="true">
      {layers.map(({ map, tone }, index) => (
        <pre
          className={`ascii-garden__glyph-layer ascii-garden__tone--${tone}`}
          key={`${tone}-${index}`}
        >
          {map}
        </pre>
      ))}
    </span>
  );
}

export function AsciiGarden({ theme, variant }: AsciiGardenProps) {
  return (
    <div
      className="ascii-garden"
      data-ascii-garden
      data-theme={theme}
      data-meadow-variant={variant}
      role="img"
      aria-label="An ASCII garden at Alamo Square with a Monterey cypress, a cyclist, a standing photographer, a backpacker, flowers, and small creatures."
    >
      <GlyphStack
        className="ascii-garden__tree"
        layers={[
          { map: CYPRESS_FOLIAGE, tone: "olive" },
          { map: CYPRESS_FOLIAGE_SOFT, tone: "olive-soft" },
          { map: CYPRESS_WOOD, tone: "rust" },
        ]}
      />

      <div className="ascii-garden__ground" aria-hidden="true">
        <span className="ascii-garden__underprint" />
        <GlyphStack
          className="ascii-garden__terrain"
          layers={[
            { map: MEADOW_PRIMARY, tone: "olive" },
            { map: MEADOW_SECONDARY, tone: "olive-soft" },
          ]}
        />
      </div>

      <GlyphStack
        className="ascii-garden__sprite ascii-garden__sprite--backpacker"
        layers={[
          { map: BACKPACKER_INK, tone: "ink" },
          { map: BACKPACKER_PACK, tone: "rust" },
        ]}
      />
      <GlyphStack
        className="ascii-garden__sprite ascii-garden__sprite--standing"
        layers={[
          { map: STANDING_INK, tone: "ink" },
          { map: STANDING_HAIR, tone: "hair" },
          { map: STANDING_PANTS, tone: "cyan" },
        ]}
      />
      <GlyphStack
        className="ascii-garden__sprite ascii-garden__sprite--cyclist"
        layers={[
          { map: CYCLIST_BIKE, tone: "ink" },
          { map: CYCLIST_BODY, tone: "blue" },
          { map: CYCLIST_SKIN, tone: "skin" },
        ]}
      />

      <div className="ascii-garden__details" aria-hidden="true">
        {DETAILS.map(({ glyph, tone, x, bottom, size }, index) => (
          <pre
            className={`ascii-garden__detail ascii-garden__tone--${tone}`}
            style={{
              "--ascii-detail-x": x,
              "--ascii-detail-bottom": bottom,
              "--ascii-detail-size": size,
            } as DetailStyle}
            key={`${glyph}-${index}`}
          >
            {glyph}
          </pre>
        ))}
      </div>
    </div>
  );
}
