import type { CSSProperties, ReactNode } from "react";
import type { MeadowVariant } from "./meadow";
import type { WindSettings } from "./wind";

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
  children?: ReactNode;
  isPlaying?: boolean;
  live?: boolean;
  theme: AsciiGardenTheme;
  variant: MeadowVariant;
  wind?: WindSettings;
};

type AsciiGardenStyle = CSSProperties & {
  "--ascii-sway-from"?: string;
  "--ascii-sway-to"?: string;
  "--ascii-wind-duration"?: string;
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

type PixelSpriteStyle = CSSProperties & {
  "--pixel-columns": number;
  "--pixel-rows": number;
};

// These fixed matrices are sampled once from the approved composition, then
// committed as authored glyph maps. Nothing is generated or randomized in the
// browser, so both palettes always render the exact same scene.
const MEADOW_PRIMARY = "                                .yv                                        wv'.         v                          ;v                                    ;uyu'       'uwuYvw\n                 ,;             yuy                                        vyuy        vY.                                                            ;,'vw.;.'      vwvYuyu\n                 wu             vw.                                        yuwu;       yv                                                            ', .yv;,','     wuwVwuw.     .;,',;,;,;,;.;,;.\n        ' '      uw                                                      ,yuwuw,       vw                                               ;.           ,;.;.;,'.'   ;,;uyvwvyvyvy,yvyuyv;vyvyvyvyvyuy,;,;,\n,y,;,;,yvyvyv;,;vwuy,;,;                 '.'                             ' yuyv'       yu'                                      .'.     v'           ;,',;,;vy,y,;,yvyv;v;vyv;,y,yvy.;,y,yv;v;,y,yv; ;,\n;,;,;,'.;v;,;,;,;vy.yvyvyv;,y,;.'        ,wv                             .   .'        vw,                                      'vy    ,wv   .',yvy,yvw.yv;vy,yv;,;,y,;,;,;vy,; ;.;,',;,',;,;,; yuy, ,\n,; ;, v;.y.;,;,;.yv;,',y,;,;,y,yvwv;,;,'.yuy                            .' y, ,        yv                                        wu .'.;vwvyvyv;v;,;,;vy,;,;v',',;.y,y,;,w,;.;, , .y.;  ,;v;.;, ,yv; ;,\n , .; y,;,'.;,  ;v;,; ;,;,',',;,;v;,;vy,yvwu',;,'.                      '  uw.'.       vy                         '           '.wuwvwvyvyvy,;,;,y,;.;,; ;, ,; ; ;,    ','\n,' '  .;,y.;,',;,;v , vy,;,; yv;,;,;,;,',y,;,;,wvy,yvyv;               ;.  ;uw.'       y,                        'v'     ;vyvyvyu;,;v;,;vy.;, , ,;,',', ,  '  , , .y,;,wv',;. , .'.;.;  . ,' ;  .; ;  ,\n ,;,',;,',         v; ; ;. .'.;  v;,; ;.',;,',;vy,;v;vyv;vwuy,yvyv;    .   ,yv' ;      vy                        ,Yvyvyvy,;v;,;,;. v; ;.;,'    .   ,;.y, u ,; ;.      yuw        .\n   ;   wu;  , ,;,y. , ,         ,      ',y, .'vy,',',;v;.;vy,;,;,;vyvyv;vyvyvyv;,;     ;v'     ;,;,;.yvy,;,yvwvy,yuy,;,;,;,;v',;,y,;, ,;,;.; ;  ,','.'v vyv     ,  '  uwu'.;,;  , .' ;  , ,;v' ' '.  ;\n     .yvy     yv   ,  ',;v;,',;. v , ,y,',',  ;    ,'v;,;.;,;,',;,',;,;,;.yv;,;v;vy,yuyvyuy,yvyuyvyv;,yv;,;,;,;,',;v; ;, ,y.'   ;.  '  ,       .   . ,y yvy.; ;.;,       .;uy.             ,yv         ,\n.',  y.',;  ,  ' y, .   ,'v',y.    ' ;vyv;.' ; ;vy ;.; '.;,;   ;, ,y,' ;.',;,;,y,;,;,y,;vy,;,;,y.;,;,;,;,',',;,; ;v;,   , .yv; ;,'vw,' ;,;.' ;  ,; ; yv       . .      ;     ;   ' ;,  ;  .;Vw  .' ;\n            '  ,yu' ' '.;vwv', ,'.  ; ' yu;, ,'vwv  ',',;v', ,; ;.;.'uw ;.;.;,;v ,;.;,',;.; ',;,;,;, ,'  .;   '.     ,;. ,;v;. .;.  ' '. .    yuy   '.; ; ;  .;v; ',' '  . .' ;,      '    vwu' '. .  '\n ;  . ,',  ',;  uw, .;.'.'v; '         ;     ;.;Vw ; ;,y ;v;, .;,' y.yu',;,'. .;.;v ,;, .;,;  ,  ; ;.;.  ',y,y.; ',', .y  , ,; ;,'.y, ,;u;.', .y,;,y,',     , ,w,             vw.; ; y,         .'   ',\n     ,  ;  . . .wuy ; 'v;,',',;,',;  ,; ;,;. , ,;,y y,;v' 'v;,    ' ;  ,  ;. ,'uy.;,;,'.; ; ', ,;v; '  ,   , ,  wv .; ;        . . ,'   yv         ,y   '    ,'v; ;,y.;,  ; ;.;v     ,y ',',',  ;. .  '\n              ,      yv            '.         .y.  wuy ; ;,  ; wv .; ; ; ;,'. .Yu , , .'.;. .     . uy ;.;,;.;. vy ;.  ;v; '.  ; '.  ',      y,;,',;,;, , .  ;                    , ,;  . .;       ;  ,\n ,  ; yv ,  ;    ,' ;vy,' ; ', , , .; ;, , , .' ' ',yv'        vw '    .      ;uw,;  , .; y   ;.y.  yv   .;        .'.'.wv    '.;.',' '.;.;.;\n      ,;      ,;    ,;,                      ;. , ,' ;, ,',;, , , ,;, ,y,;,', ,;,;v .', vy.yvy, .;,; ; ;   ',;.;  ,;.',yuw  . ,;                 'v;,;,;.'.','.',',;.','.;, ,;,', ,;,;,',;,;.' ','\n ,' ;,  ; '. .  '  , , ,;  ,  ; ;,;. . vwv' ;,;v;  , ,;, .' ; '.; ', ,  ',y. .      ',    'v     .y   ;  ,y        . .' '  .; ' '  ,  '.; '.;, ,; y,y,;.','.'.y.'.',;,;,'v' ',y,; ;vyv;,;,;, . ,;,'\n                        vw,      y            .'.        ;,       .; ;  , vy ;,'. ,   , .;v;  ,;. .;    ,'   ;  .  ; ;. ,  ; yv          'vy            .;.;,',; ;.'.'.;,' '.'.'.','    .', ,' ','\n   ,' '. ,  yv . ,' ; ',yv  ;. ,yu;  . .; ;  ,     , ,;uy ',yv; ;.;,',  ' '. .  ' ' wv .' '  . . v'  . . ,yv;  .  ' '  ,y.; ;vy, ,' ;  , ,Yu  ', ,; ;   'v;,y,yv ,;,'v',yv ,;uyvyvy,' ; yvy yv;vyv;\n   '.    '       '. .  yVwu      ;,    '. .  ' ;vy ' '.yv .'vyv    ' ;  , ,' ;  , , vy ;, ,  ; ;  , .; ; ;uw,  ;  . ,  ; '. .  ' '. .  ' yVY.\n;,   ,  ;  , ,  ;  , .; ;.',  ; ', ,  ;  ,  ; ', ,' ;  , ,',wVw, ,  ; ;. ,  ; ;. ,;.; ;  , ,  ; ', ,  ; ;,;v ,' ;  , ,' ;  , ,  ; ', ,  ; ;. ,  ; ;. ,  ; ;. ,  ; ;. , .; ; ;. ,  ; ;. ,  ; ;, ,' ;  ,\n.'   '  .  ' '  .  ' '. .  '  . .' '  .  '  . .' '. .  ' '.',;,' '  . .' '  . .' ' '. .  ' '  . .' '  . .' ' '. .  ' '. .  ' '  .  ' '  . .' '  . .' '  . .' '  . .  ' '. . .' '  . .' '  . .' '. .  '\n";
const CYPRESS_FOLIAGE = "\n                                                     v\n                                            ,;, .; ;vwuw. v;,'.     .\n                                            ;vYVYVYVyuwVwVY,yuy,'vyuY,;\n                                    ,;uwuwu;  ,'vyuYuwvwuwv ,yvYuyuyuwvyv'\n                   ,',     ,;,y.;v;v;,wuYvyv;,;.; yvwuwuwuwuYuwVyvwuYv'. ,;,;,;\n                   ;uYVwuy,wuYVYVYVYuwuyuyvwVYVYVwvy,y.;vyu;uyvwvwu;uwVYVYVYVy,\n                  ;  .yVYVyVYuwuyuwuYuYVYuYVYuw,yu;            .',wuYuwuyv\n              ,;. vwuwvyuYuYVYuYVwVYVwVwuwuwuw,yu ,',',;, ,;,yvy.;v;vy,y,;vyuyv;\n              'vYuwuwuYuwuwuwvwuwuwvy,yv;,;,;vyvy.wuwVYVyvYVYuyv;,; ;,yVwVYVYVYu;,\n         ;vwuwVwVyuwuwuyv;.                      ;v;v;,yvw ;uwuYVYu;,;,;  .'v;v;\n           uyuyvw,yv;vyvy,;, . vy.         ,',  ;  .; 'v;,wuYuwVwVy '\n            .y,',',      ','.'  ,y, ,;   'vy         y.;vwuyvyvwuw.\n                  y. ,'        vy  .  ;     ;v' ' ;vyVYVw,;,  'u;,y      vyuYVYVYVYVYvy\n                      ,  ;,'      ,;uwuwv'   ;vyVwVwuwvy.y,' ;vyvwv ,yvw.y,;,',y,y.y,\n                            ;uyuwuwuwuYu   ,yvwvw,y.;. ,',;.  'v;uwvYVYVwuyvy\n                    .;,  ;,;,YVYVYVw,wv; y,' yvy. ,;. u         .;vyuyuw.y\n                 v;uwuyvy,;,'. .;.'   yv .' '        ,;      ,y,;.               . v\n        ,;vyv;vyuyVYVYuYuy,          'u;   '.   ,   ,w,  ;v'.;v      y y.;v;vyvwvwuw,',\n        ;uYVYVYVYVYVYVwvy,y,          y,  y, .y,     v;v',      ;vyvwVYVwVwuYVYVYVYVwu;\n           yuyVYVwuwvyuwVYuYVwVwvy ;  v    y,;      ,w,      'vYuwuYVwvwvwvyuwvy,;.y,'\n           vwuwvYuwVYVYVwuwuYuyuwuYuy,wv;  .;.;   ;uy,         uwuYvwvyu;u' y  ,   .;,;\n           ;v;uYVyuwuwvyvyvyvy,wv',y.'Vwv   v;v v'vyv   ,;, v;v .yv'uyvy,;  ,  '\n        yuYVYuy,' y   ;.  ;v',       ,;.    ;,yv  wuyu;vwuYVYuwVwv; ',','  .\n         ;vwvy,' '.;,y,y,y  ,;        .;   ;v;,yVwuwuYVYuwuyVwuw,y. ,;      ,;vy,y,\n                  ',;vyvy,;v;v             uY.y,wvw,;vyu; y,y ', ,  '       ' ',yuwv\n                       ',y.'v;,;      v .  y,    ;,           .',;.\n                         ,;,;vy,;.    ;vy  u;.  'u; ;.      ',yv;,\n                               y,y     wv  ;,   ,w,;,       vw,\n                            'u; w.     vw, ,'.  ;vy,      ;,\n                             '  ,'  v;  u;,',y  , ,      ;,     .', ,\n                               .yv  ;v  wv;,;, ,y ;      v' ;vyuwuwuYuwvy.\n                                  .;,; ;,wuyvw.yuwuwuy.yuwvwVwuYVwVYuyvyv\n                       uyvyv         ,;,'.;,;, vyv'vwVYVwvwVYuwVwuwuYuwu'.'\n                      ,yu;v;         ',;,; ' ','uwVyuwuwvYuwuwvYvwVwuwuyuYuwuy,\n                      wvw,            ',',    ' yuy,' ;   ;. .;vyuwuwuwVwVYVYVwv\n                                         ;. ,y.       .       .;v', ,yvw,y,yv\n                                       ,;,;.;v',;    v;     y,  ','.;. . . .;\n                                        v;.;vy. .   vyv   .yv   ,y,'.\n                                        yv;v;vy    ,wVy 'v;\n                                         ;.;vy,;, .wv;,\n                     ,                   vyvyv  ; wvy.                                y  v\n                    ,yv                  'uwvw, .wuyv'                               ;Vy,w\n                ;,',wvy                  .yvy,  yuy y                               ',Yv',\n               ;.;,;v                    ;,y,; yv;.;,                               ,yu\n              ;,;,  y.   .               .;,  ;vy, ,\n              v;vy,  ;  vy               ;,y  ,wv .y\n               .y.y '.w,;                v;, ,yu  ;v\n                ,'.; yu;,;.'            ,;. ,yvw, ,;\n           .','vwv'uYv;,;.;,            y ;,;,' ;.;,\n           ;  .; y,yu;.;,y. v           ,'   '    .y,           ,yv vy,y y,;u;vy y yvyv;,y,;v\n          ',;vy, v;u' 'v .;,y        . vy.',;v',; ' ', uy,y w,;v;vy  vy  .;,y.y. v vyvy,;v;vy.y,\n           ;v;v ,;vy. .;, ,yvy ;u;vw,yvwvyu;vw,yv',;,w,'v;v'vyvy.y, ,y,; y,;v',; ; wv;v;v;,;v'v;\n        ;.yvyv',y,;v'v;,    '. .'  . ,  ;,;, , .; ' '.  ' ;   '. .'  .'     '  . . .  '  v u' '\nv;vwvw.yv  y.;.', ,' y,;,;v'v; ;v'v  ;.; 'v  '.;  ,',y.;,;  ,  y  ,  y,; y.'v .;   ;,;,  yvyuy ;\n; yv'v',y  v'vyv;.;v',yv;.;.;  ,;. . ,  w,y,    ;  .;  ,;.  ;   ',;  ,;.  ;,; y, ,  ;.;  ,;vyv;.\nv' ;.;                         yv;      .           .   .   .    '.   .        '              .\n  ;     ;  v','.;.;  ,;.  ;.;";
const CYPRESS_WOOD = "\n\n\n\n\n                                                     . .\n                                                     |/(. .:.\n                                                       .\n                                                                    /\n                             / .  :. /\\.|/\\.:.:                  .  \\    .\n                 :.\\.\\.\\/\\//)/.\\/  //\\///\\/      //\\.\\.\\             \\./.\\/\\  .\n                   .:.  \\\\\\/\\  . .\\\\\\\\\\/\\.\\.\\\\\\/\\ \\ \\  .            \\\n               \\.        :/|||/\\ \\/|||   :(\\/:      /\\      /\\.\\\n                /  / /:.\\      .//\\//.)/ )/  /          \\.)//\n                       :\\       /\\\\ . .\\{\\    .  :.:.\\.\\{\\/:/\n                           .|      . / ||     \\/|.\\/||\\|: :/:  /\n                                .:/\\//)) : //://)/)////           /\\///  :\n                     .   . .:     :\\{/\\/ /\\/\\\\ .{\\\\ :{\\      /\\\\\\\\\\ :\n                                    .|/| \\((. .:(   .(|:/:/|(\\.\n                    :                 ))  \\): ///   )})})/\n                                      {\\/  \\\\\\{\\    \\\\                        /\\.: :\n                              :       ||\\  /(/|  |\\/|/              : :  /\\||||/ | /:.\n                .: :  .\\/  :/\\/\\.\\ \\. //)   /\\) )/)//             .\\//))/)/)/\\/:\n                : :/  \\   :.\\      .\\\\{{\\{  {{\\/  \\.                \\/\\\\ \\\\/:\n               :|\\/(/\\  /\\ :|         ((/||\\|(/:/ |\\/:       \\/   |||||| :.||\\.\\\n                \\ :///\\/ .)/\\/:       }}\\.)/\\/   /)/\\/:/\\/: :/\\/:/}):    ///)/\\/\n                       \\\\\\/ \\\\{\\      {{{  {/\\   {{\\ :.{       {\\{/\\\\\\\\\\/:\n                         /|. .\\(\\.    \\(|.||||   {| ||\\      /||:.\n                          /)/ /\\ //    /}/)})/  .})//       /\\/\n                            \\\\\\.: \\{:  /{\\{{\\{  {{\\.      \\{{\n                              |(   (|   |((( \\  {:|       (\\\n                               .\\))/))  :/)/\\/\\/)/)     \\//\n                                  \\{/{{ /|\\\\.\\\\\\\\\\. .   \\\\\n                                   .|(\\| ((|\\||/ /\n                                     \\))/)))//)/     \\////.\\/:/\n                                      {{\\{{{\\{{/  :.:/{|\\\\\\/{/\\\\\\\n                                       ( (((.|(:( /|/(((.     /(.:     : \\.:\n                                       //)/):))/\\   \\}/)    :///  \\///// . .\n                                       :\\{\\\\.\\\\\\/   \\{{{ \\/{{\\{{/:.\\\n                                        |{(|\\|(||  /(||(({(/|\n                                        /))/.:/\\. .//)/}.\n                                        \\{\\\\ .\\.{ \\/\\|\\\n                     \\/                  ((|/:  (|(|({.\n                     })                  )/):/  /)/ /\n                    .\\                   \\\\{/\\ \\{{\\\\/\n                   /({|                  (|(|(|||(:(:\n                   })}}))                )}) \\)}///)\n                  \\|{  \\:               :{{\\ \\{\\\\ \\\\\n                  {{                    |((|/(|\\/  (\n                  })                    )))//}}/). )\n                  /\\                   \\{{\\{{{{ { \\\\\\\n                                       .||\\|\\/: |/| |\n                                        .\n                                             .\n                                             :.\n                                             /)))\n\n                                         .\\|:/";

const PIXEL_BACKPACKER = "\n\n\n                     rhhhi\n                    rhhhhh\n                    rhhhhi\n                    rsssr  rrrrr\n                     rrsr rrrrrrr\n                      rrssrrrrrrr\n                     riiiiirrrrrr\n                     riiiiirrrrrrr\n                     riiisirrrrrrr\n                     riiiisrrrrrrr\n                     rrsiirrrrrirr\n               rrr  ssrrrsrrrrrrrr\n               rrrrrrssrrrirrrrrrr\n                irsirrrrrrrrrrrrrr\n               ii   rrrirrrrrrrrr\n               ii   rriirrrrrrrr\n              ii     iiii iiii\n              ii     iiii iiii\n             ii     ii ii i  ii\n             ii      i    i   i\n             ii      i iiii   ii\n            ii      riiiii    ii\n            ii      rrrrri     ii\n           ii        rrsr       ii\n          iii        rrssrr     iii\n          ii         rrrrrr      ii\n         ii            rrrsr      ii\n         ii            rrrss h    ii\n        ii             rr rsssi    ii\n        i              rr  siii     ii\n       ii             iiiiiiri      ii\n       i              iiiiiii        ii\n                    rriiriii          i\n  s  r  r           rrrirr\n  r     r ii r  s  r  r rr sr r ss s  rr  r\n          ii r  r  r  r rr sr r ss r  rr  r  s\n                   r  r ss r    rr rh     i  s\n  r rr  r  r                              i  r\n             ih    r    rr r  r ss    rrr\n             ih    r    sr r  r rr    rrr r\n  r     s    i                  ii  r        r";
const PIXEL_STANDING = "\n\n\n\n            iiii\n          hhhhhs\n         hhhhhrsr\n         hhhhsssr\n           rrrrr\n           iss\n          isssi\n          hisiii\n          siisss\n          rrirsii\n          siiiiii\n          srsssrri\n          rrsssrrr\n          iirrsiii\n          rririii\n          rriisii\n          iiirrii\n          iirrsii\n          iirrii\n          cciiii\n          ccccc\n          cccccc\n          cccccc\n          cccccc\n          ccccc\n          cbccc\n          bbccc\n          ccccc\n          ccbcc\n          ccccc\n          iiicii\n          iiiirisi\n          siiisisr\n                  ss\n           r      ss\n           r\n             r\n             r\n                  rr";
const PIXEL_CYCLIST = "\n\n\n\n\n                             i\n                           iiiiii\n                           iiiiii\n                            ssrsr\n                      iiiiiiirssr\n                    iiibbbbbbbsr\n                    ibbbbbbbbb\n                  iibbbbbbbbbr\n                 iibbbbbbbbbbrr\n                 iibbbbbbbbbrrr\n                 ibbbbbbbbbrrrrsrrrii\n                 ii     iirr rrrrrrii\n                    ii   rsr  ri rri\n                   ii iirrsriiiiir\n                    ci  rrsr  iii   i\n                    cciirsr  iiii iiiiii\n             iiiiiiiiiiirsiici iiii    iii\n            iiii   iiiiissiiiiii ii    iii\n           ii     iiiiiissiii ii  iii ii ii\n           ii   iii   iiiiii  i     ii   ii\n          ii  iiiii   iiiiii  i iii iiii  i\n          ii iiiiiiiiiiiiii   iiii  i ii ii\n           ii iiii   iiiiiii  hi  i     ii\n           iiiiiii   iiiiiii   iiii   iiii       h\n            iii ii  ii          iiiiiiii    s ss\n         s    iiiiiiis r  rr r  i\n         s  r  iiiiiss r  rr r\n            r       rr          s  r     r\n\n                  s    h\n                    rr h";


const DETAILS: Detail[] = [
  { glyph: "Y\n|", tone: "olive", x: "8%", bottom: "20%" },
  { glyph: ";)_", tone: "cyan", x: "16%", bottom: "27%" },
  { glyph: "vYv\n\\|/", tone: "pink", x: "21%", bottom: "11%" },
  { glyph: "(o)\n/|\\", tone: "pink", x: "31%", bottom: "7%" },
  { glyph: "Y\n|", tone: "olive-soft", x: "43%", bottom: "18%" },
  { glyph: ";)_", tone: "cyan", x: "57%", bottom: "28%" },
  { glyph: "vvv\n^^^", tone: "blue", x: "65%", bottom: "15%" },
  { glyph: "vYv\n/|\\", tone: "pink", x: "72%", bottom: "7%" },
  { glyph: "(·)\n››", tone: "cyan", x: "79%", bottom: "23%" },
  { glyph: "Y\n|", tone: "olive", x: "87%", bottom: "12%" },
  { glyph: "wYw\n\\|/", tone: "rust", x: "94%", bottom: "20%" },
  { glyph: "(·)\n››", tone: "olive-soft", x: "97%", bottom: "31%" },
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

const PIXEL_TONE_BY_GLYPH: Record<string, GlyphTone> = {
  i: "ink",
  r: "rust",
  s: "skin",
  h: "hair",
  c: "cyan",
  b: "blue",
};

function PixelSprite({ className, map }: { className: string; map: string }) {
  const rows = map.split("\n");
  const columns = Math.max(...rows.map((row) => row.length));
  const cells = rows.flatMap((row, rowIndex) =>
    [...row].flatMap((glyph, columnIndex) => {
      const tone = PIXEL_TONE_BY_GLYPH[glyph];
      if (!tone) return [];
      return [{
        column: columnIndex + 1,
        row: rowIndex + 1,
        tone,
      }];
    }),
  );

  return (
    <span
      className={"ascii-garden__pixel-sprite " + className}
      style={{
        "--pixel-columns": columns,
        "--pixel-rows": rows.length,
      } as PixelSpriteStyle}
      aria-hidden="true"
    >
      {cells.map(({ column, row, tone }) => (
        <i
          className={"ascii-garden__pixel ascii-garden__tone--" + tone}
          style={{ gridColumn: column, gridRow: row }}
          key={row + "-" + column}
        />
      ))}
    </span>
  );
}

export function AsciiGarden({
  children,
  isPlaying = false,
  live = false,
  theme,
  variant,
  wind,
}: AsciiGardenProps) {
  const direction = (wind?.direction ?? 0.6) < 0 ? -1 : 1;
  const breeze = 0.18 + (wind?.breeze ?? 0.35) * 0.42;
  const gust = 0.08 + (wind?.gust ?? 0.2) * 0.28;
  const style = {
    "--ascii-sway-from": `${(-breeze * direction).toFixed(2)}deg`,
    "--ascii-sway-to": `${((breeze + gust) * direction).toFixed(2)}deg`,
    "--ascii-wind-duration": `${(8.8 - (wind?.tempo ?? 0.35) * 3).toFixed(2)}s`,
  } as AsciiGardenStyle;

  return (
    <div
      className="ascii-garden"
      data-ascii-garden
      data-live={live ? "true" : "false"}
      data-playing={isPlaying ? "true" : "false"}
      data-theme={theme}
      data-meadow-variant={variant}
      style={style}
      role="img"
      aria-label="An authored ASCII garden at Alamo Square with a Monterey cypress, a cyclist, a standing photographer, a backpacker, flowers, and small creatures."
    >
      <GlyphStack
        className="ascii-garden__tree"
        layers={[
          { map: CYPRESS_FOLIAGE, tone: "olive" },
          { map: CYPRESS_WOOD, tone: "rust" },
        ]}
      />

      <div
        className="ascii-garden__ground"
        data-meadow-surface={live ? "active" : undefined}
        aria-hidden="true"
      >
        <span className="ascii-garden__underprint" />
        <GlyphStack
          className="ascii-garden__terrain"
          layers={[{ map: MEADOW_PRIMARY, tone: "olive" }]}
        />
      </div>

      <PixelSprite
        className="ascii-garden__sprite ascii-garden__sprite--backpacker"
        map={PIXEL_BACKPACKER}
      />
      <PixelSprite
        className="ascii-garden__sprite ascii-garden__sprite--standing"
        map={PIXEL_STANDING}
      />
      <PixelSprite
        className="ascii-garden__sprite ascii-garden__sprite--cyclist"
        map={PIXEL_CYCLIST}
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
      {children}
    </div>
  );
}
