import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the portfolio meadow and shared wind study", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Neel Saswade — Product designer<\/title>/i);
  assert.match(html, /class="site-header__wordmark"[^>]*>\s*Neel Saswade\s*<\/a>/);
  assert.match(html, />Neel Saswade</);
  assert.match(html, /I&#x27;m a product designer based in San Francisco\. Currently, I work at /);
  assert.match(html, /hero-company--glean[^>]*href="https:\/\/www\.glean\.com\/"/);
  assert.match(html, /hero-company--snap[^>]*href="https:\/\/www\.snap\.com\/"/);
  assert.match(html, /hero-company--intuitive[^>]*href="https:\/\/www\.intuitive\.com\/"/);
  assert.doesNotMatch(html, /\[something good\]|\[company\]/);
  assert.match(html, /class="meadow__image meadow__image--curated" src="\/alamo-styles\/painterly-realism\/rolling\.png"/);
  assert.match(html, /data-rolling-meadow="original"/);
  assert.match(html, /Checking the wind at Alamo Square/);
  assert.match(html, /Local time in San Francisco/);
  assert.doesNotMatch(html, /meadow__grass-canvas|data-grass-layer/);
  assert.match(html, /class="meadow__visual meadow__visual--flat"/);
  assert.match(html, /data-flat-texture="fine"/);
  assert.match(html, /class="[^"]*\bbike-word\b[^"]*\bhero-hobby--bike\b/);
  assert.match(html, /Release miniature Neel on a bike onto the meadow/);
  assert.match(html, /class="[^"]*\bphoto-word\b[^"]*\bhero-hobby--photo\b/);
  assert.match(html, /Release miniature Neel with a camera onto the meadow/);
  assert.match(html, /class="[^"]*\bbackpack-word\b[^"]*\bhero-hobby--backpack\b/);
  assert.match(html, /Release miniature Neel backpacking onto the meadow/);
  assert.match(html, /class="top-pet-pull"/);
  assert.doesNotMatch(html, /Meadow and cypress wind controls|Open secret meadow prototype picker/);
  assert.doesNotMatch(html, /codex-preview|Building your site|react-loading-skeleton/i);
});

test("pairs Newsreader display type with Geist Sans interface and reading type", async () => {
  const [layout, css] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(layout, /import \{ Geist, Geist_Mono, Newsreader \} from "next\/font\/google"/);
  assert.match(layout, /const geist = Geist\(\{[\s\S]*?variable: "--font-geist"/);
  assert.match(layout, /const geistMono = Geist_Mono\(\{[\s\S]*?variable: "--font-geist-mono"/);
  assert.match(layout, /className=\{`\$\{newsreader\.variable\} \$\{geist\.variable\} \$\{geistMono\.variable\} antialiased`\}/);
  assert.match(css, /--serif:\s*var\(--font-newsreader, "Newsreader"\)/);
  assert.match(css, /--sans:\s*var\(--font-geist, "Geist"\)/);
  assert.match(css, /--mono:\s*var\(--font-geist, "Geist"\)/);
  assert.match(css, /--ascii-mono:\s*var\(--font-geist-mono, "Geist Mono"\)/);
  assert.match(css, /body\s*\{[^}]*font-family:\s*var\(--sans\)/);
  assert.match(css, /\.pranathi-name\s*\{[^}]*font-family:\s*var\(--serif\)/);
  assert.match(css, /\.pranathi-bio\s*\{[^}]*font-family:\s*var\(--serif\)/);
  assert.match(css, /\.case-intro h1\s*\{[^}]*font-family:\s*var\(--serif\)/);
  assert.match(css, /\.site-header__wordmark,[\s\S]*?\.site-header--pages \.site-nav\s*\{[^}]*font-family:\s*var\(--sans\)/);
  assert.match(css, /\.about-copy p\s*\{[^}]*font-family:\s*var\(--sans\)/);
  assert.match(css, /\.simple-page__copy p,[\s\S]*?\.simple-page__lede\s*\{[^}]*font-family:\s*var\(--sans\)/);
  assert.match(css, /\.play-item p\s*\{[^}]*font-family:\s*var\(--sans\)/);
});

test("offers quiet, reactive, and disabled top-edge pet pulls", async () => {
  const [topPull, topPet, prototype, css] = await Promise.all([
    readFile(new URL("../app/top-pet-pull.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/top-pet.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/meadow-prototype-controls.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(topPull, /\/top-pets\/top-pets-neutral\.png/);
  assert.match(topPull, /\/top-pets\/top-pets-sad\.png/);
  assert.match(topPull, /\/top-pets\/top-pets-angry\.png/);
  assert.match(topPull, /\/top-pets\/top-pets-furious\.png/);
  assert.match(topPull, /window\.scrollY > 0\.5/);
  assert.match(topPull, /window\.addEventListener\("wheel", handleWheel, \{ passive: false \}\)/);
  assert.match(topPull, /window\.addEventListener\("touchmove", handleTouchMove, \{ passive: false \}\)/);
  assert.match(topPull, /QUIET_ARM_DISTANCE = 104/);
  assert.match(topPull, /QUIET_RELEASE_DURATION = 520/);
  assert.match(topPull, /const releaseQuietly = \(\) =>/);
  assert.match(topPull, /mode === "quiet"\s*\? PET_STRIPS\.map\(\(_, index\) => index === 0 \? 1 : 0\)/);
  assert.match(topPull, /0\.5 \+ progress \* 0\.32/);
  assert.match(topPull, /mode === "off"/);
  assert.match(topPull, /const framePosition = progress \* \(FRAME_COUNT - 1\)/);
  assert.match(topPull, /springVelocity \+= -pullPosition \* 0\.12 \* step/);
  assert.match(topPull, /window\.requestAnimationFrame\(springBack\)/);
  assert.match(topPull, /prefers-reduced-motion: reduce/);
  assert.match(topPet, /DEFAULT_TOP_PET_MODE: TopPetMode = "off"/);
  assert.match(prototype, />Hidden faces</);
  assert.match(prototype, /aria-label="Hidden face pull style"/);
  assert.match(prototype, /onTopPetModeChange\(topPetMode === "off" \? "quiet" : "off"\)/);
  assert.match(css, /\.top-pet-pull\s*\{[^}]*position:\s*fixed[^}]*height:\s*var\(--top-pet-reveal-y\)/);
  assert.match(css, /background-size:\s*max\(100vw, 1440px\) auto/);
  assert.match(css, /translate3d\(0, var\(--top-pet-pull-y\), 0\)/);
  assert.match(css, /html\[data-top-pet-mode="off"\] \.top-pet-pull/);
  assert.match(css, /html\[data-top-pet-pull-style="quiet"\] \.top-pet-pull__frame:not\(:first-child\)/);
});

test("offers lightweight San Francisco atmosphere backgrounds in the prototype picker", async () => {
  const [atmospheres, hero, prototype, css] = await Promise.all([
    readFile(new URL("../app/atmospheres.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/hero-meadow.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/meadow-prototype-controls.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  for (const id of ["grid", "day", "sunny", "foggy", "sunrise", "sunset", "rainy", "night"]) {
    assert.match(atmospheres, new RegExp(`id: "${id}"`));
    assert.match(css, new RegExp(`data-atmosphere(?:-option)?="${id}"`));
  }
  assert.match(hero, /useState<PortfolioAtmosphere>\("grid"\)/);
  assert.match(hero, /shell\.dataset\.atmosphere = atmosphere/);
  assert.match(hero, /document\.documentElement\.dataset\.atmosphere = atmosphere/);
  assert.match(prototype, /PORTFOLIO_ATMOSPHERES\.map/);
  assert.match(prototype, /aria-label="Portfolio background atmosphere"/);
  assert.match(prototype, /onAtmosphereChange\(id\)/);
  assert.match(atmospheres, /id: "grid", label: "Studio card grid"/);
  assert.match(prototype, /Studio card grid overrides the selected environment background/);
  assert.match(css, /\.site-shell\[data-atmosphere="grid"\]\[data-environment-style\]\s*\{[\s\S]*?background-color:\s*#ffffff;[\s\S]*?background-size:\s*40px 40px;/);
  assert.match(css, /\.site-shell\[data-atmosphere="grid"\] \.hero-meadow__style-atmosphere\s*\{[^}]*opacity:\s*0;/);
  assert.match(css, /\.site-shell\[data-atmosphere="night"\]\s*\{[^}]*--ink:\s*#f5f2e9/);
  assert.match(css, /html\[data-atmosphere="night"\] \.smiley-cursor__asset/);
  assert.doesNotMatch(css, /@keyframes[^}]*rain/i);
});

test("offers the original art directions, the unchanged control, and an isolated ASCII Garden prototype", async () => {
  const [styles, hero, meadow, prototype, tree, css] = await Promise.all([
    readFile(new URL("../app/alamo-styles.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/hero-meadow.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/meadow.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/meadow-prototype-controls.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/cypress-tree.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);
  const styleIds = [
    "risograph",
    "painterly-realism",
    "ascii-terminal",
    "cut-paper",
    "grainy-editorial",
    "lavender-dream",
    "airy-watercolor",
    "blue-duotone",
    "golden-hour",
    "vivid-surreal",
    "cinematic-glow",
    "soft-daylight",
    "voxel",
    "whiteboard",
    "handmade-clay",
  ];

  assert.equal((styles.match(/\n\s+id: "/g) ?? []).length, 17);
  assert.match(styles, /id: "control"[\s\S]*treeSrc: "\/monterey-cypress\.png"/);
  assert.match(styles, /id: "ascii-garden"[\s\S]*rollingSrc: null[\s\S]*flatSrc: null/);
  assert.match(styles, /DEFAULT_ALAMO_STYLE: AlamoStyle = "painterly-realism"/);
  assert.equal((styles.match(/rollingGroundOffset:/g) ?? []).length, 17);
  assert.equal((styles.match(/flatHorizon:/g) ?? []).length, 17);
  assert.equal((styles.match(/treeRootOffset:/g) ?? []).length, 17);
  for (const id of styleIds) {
    assert.match(styles, new RegExp(`id: "${id}"`));
    for (const asset of ["rolling", "flat", "tree"]) {
      assert.match(styles, new RegExp(`/alamo-styles/${id}/${asset}\\.png`));
      await access(new URL(`../public/alamo-styles/${id}/${asset}.png`, import.meta.url));
    }
  }

  assert.match(hero, /useState<AlamoStyle>\(DEFAULT_ALAMO_STYLE\)/);
  assert.match(hero, /useState<MeadowVariant>\("living"\)/);
  assert.match(hero, /shell\.dataset\.environmentStyle = environmentStyle/);
  assert.match(hero, /data-environment-style=\{environmentStyle\}/);
  assert.match(hero, /environmentStyle=\{environment\}/);
  assert.match(hero, /assetUrl=\{environment\.treeSrc\}/);
  assert.match(hero, /--rolling-meadow-registration-y/);
  assert.match(hero, /--flat-meadow-registration-y/);
  assert.match(hero, /--cypress-root-registration-y/);
  assert.match(meadow, /data-style-mode=\{isControlStyle \? "control" : "curated"\}/);
  assert.match(meadow, /environmentStyle\.rollingSrc/);
  assert.match(meadow, /environmentStyle\.flatSrc/);
  assert.match(prototype, /aria-label="Alamo Square visual style"/);
  assert.match(prototype, /ALAMO_STYLES\.map/);
  assert.match(prototype, /Style and meadow shape are independent/);
  assert.match(tree, /assetUrl: string/);
  assert.match(tree, /createCypressTree\(\{[\s\S]*assetUrl,/);
  assert.match(tree, /\}, \[assetUrl\]\)/);
  assert.match(css, /\.meadow__image--curated\s*\{[^}]*translate3d\(0, var\(--rolling-meadow-registration-y\), 0\)/);
  assert.match(css, /\.meadow__visual--flat\[data-style-mode="curated"\]\s*\{[^}]*height:\s*var\(--flat-meadow-height\)/);
  assert.match(css, /\.meadow__curated-flat-image\s*\{[^}]*translate3d\(-50%, var\(--flat-meadow-registration-y\), 0\)/);
  assert.match(css, /\.hero-meadow > \.cypress-tree \.cypress-tree__stage\s*\{[^}]*translate3d\(0, var\(--cypress-root-registration-y\), 0\)/);
});

test("renders ASCII Garden from fixed glyph maps with paired palettes and static filled sprites", async () => {
  const [garden, hero, picker, layout, css] = await Promise.all([
    readFile(new URL("../app/ascii-garden.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/hero-meadow.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/meadow-prototype-controls.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(garden, /const MEADOW_PRIMARY = /);
  assert.match(garden, /const CYPRESS_FOLIAGE = /);
  assert.match(garden, /const CYPRESS_WOOD = /);
  assert.match(garden, /const PIXEL_BACKPACKER = /);
  assert.match(garden, /const PIXEL_STANDING = /);
  assert.match(garden, /const PIXEL_CYCLIST = /);
  assert.match(garden, /function PixelSprite/);
  assert.match(garden, /h: "hair"/);
  assert.match(garden, /b: "blue"/);
  assert.match(garden, /data-theme=\{theme\}/);
  assert.match(garden, /data-meadow-variant=\{variant\}/);
  assert.doesNotMatch(garden, /Math\.random|<img\b|requestAnimationFrame/);

  assert.match(hero, /useState<AsciiGardenTheme>\("dark"\)/);
  assert.match(hero, /const isAsciiGarden = environmentStyle === "ascii-garden"/);
  assert.match(hero, /<AsciiGarden theme=\{asciiGardenTheme\} variant=\{meadowVariant\} \/>/);
  assert.match(hero, /previousAtmosphereRef\.current = atmosphere/);
  assert.match(hero, /data-ascii-garden-theme=\{isAsciiGarden \? asciiGardenTheme : undefined\}/);
  assert.match(picker, /aria-label="ASCII Garden palette"/);
  assert.match(picker, /onAsciiGardenThemeChange\("dark"\)/);
  assert.match(picker, /onAsciiGardenThemeChange\("light"\)/);
  assert.match(picker, /This first checkpoint is intentionally still/);

  assert.match(layout, /Geist_Mono/);
  assert.match(css, /\.ascii-garden\s*\{[\s\S]*?contain:\s*strict/);
  assert.match(css, /\.ascii-garden\[data-theme="light"\]/);
  assert.match(css, /--ascii-underprint:\s*rgba\(142, 145, 79, 0\.115\)/);
  assert.match(css, /\.ascii-garden__tree\s*\{[\s\S]*?bottom:\s*var\(--ascii-tree-bottom-rolling\)/);
  assert.match(css, /\.ascii-garden__pixel-sprite\s*\{[\s\S]*?display:\s*grid/);
  assert.match(css, /\.ascii-garden\[data-meadow-variant="flat"\] \.ascii-garden__ground/);
  assert.match(css, /html\[data-environment-style="ascii-garden"\]\[data-ascii-garden-theme="dark"\]/);
  assert.match(css, /html\[data-environment-style="ascii-garden"\]\[data-ascii-garden-theme="light"\]/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.ascii-garden/);
});

test("scopes the dark ASCII terminal theme and restores the normal tokens outside it", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.match(css, /:root\s*\{[\s\S]*?--paper:\s*#ffffff;/);
  assert.match(css, /html\[data-environment-style="ascii-terminal"\]\s*\{[\s\S]*?--paper:\s*#0d100f;/);
  assert.match(css, /\.site-shell\[data-environment-style="ascii-terminal"\]/);
  assert.match(css, /html\[data-environment-style="ascii-terminal"\] \.meadow-settings__panel/);
  assert.match(css, /html\[data-environment-style="ascii-terminal"\] \.philip-toggle__switch/);
  assert.match(css, /html\[data-environment-style="ascii-terminal"\] \.alamo-weather/);
  assert.match(css, /html\[data-atmosphere="grid"\]\[data-environment-style="ascii-terminal"\]\s*\{[\s\S]*?--paper:\s*#ffffff;[\s\S]*?--ink:\s*#65625f;/);
  assert.doesNotMatch(css, /:root\s*\{[^}]*--paper:\s*#0d100f/);
});

test("lets visitors toggle Philip from inside the prototype picker", async () => {
  const [layout, philip, picker, css] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/philip-toggle.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/meadow-prototype-controls.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(layout, /<PhilipToggle \/>/);
  assert.doesNotMatch(layout, /<SmileyCursor \/>/);
  assert.match(philip, /role="switch"/);
  assert.match(philip, /aria-label="Toggle Philip"/);
  assert.match(philip, /role="tooltip"/);
  assert.match(philip, /portfolio:philip-enabled/);
  assert.match(philip, /window\.localStorage\.setItem/);
  assert.match(philip, /isReady && isEnabled \? <SmileyCursor \/>/);
  assert.match(philip, /\/pet\/pet-idle\.png/);
  assert.match(picker, /<PhilipPickerToggle \/>/);
  assert.match(picker, />Philip<\/h2>/);
  assert.match(css, /\.philip-toggle\s*\{[^}]*position:\s*relative;/);
  assert.doesNotMatch(css, /\.philip-toggle\s*\{[^}]*position:\s*fixed;/);
  assert.match(css, /\.philip-toggle:hover \.philip-toggle__tooltip/);
  assert.match(css, /\.philip-toggle:focus-within \.philip-toggle__tooltip/);
  assert.match(css, /\.philip-toggle\[data-enabled="true"\] \.philip-toggle__knob/);
});

test("keeps colorful hero highlights optional and off by default", async () => {
  const [hero, picker, css] = await Promise.all([
    readFile(new URL("../app/hero-meadow.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/meadow-prototype-controls.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(hero, /const \[heroHighlights, setHeroHighlights\] = useState\(false\)/);
  assert.match(hero, /document\.documentElement\.dataset\.heroHighlights = heroHighlights \? "true" : "false"/);
  assert.match(picker, />Hero highlights<\/h2>/);
  assert.match(picker, /aria-pressed=\{heroHighlights\}/);
  assert.match(picker, /onHeroHighlightsChange\(!heroHighlights\)/);
  assert.match(css, /html\[data-hero-highlights="true"\] \.hero-inline-action/);
  assert.match(css, /\.hero-company__mark,[\s\S]*?display:\s*none;/);
  assert.match(css, /html\[data-hero-highlights="true"\] \.hero-company__mark/);
  assert.match(css, /html\[data-hero-highlights="true"\] \.pranathi-bio:has/);
});

test("uses a linear editorial case-study template without navigation chrome", async () => {
  const [page, css] = await Promise.all([
    readFile(new URL("../app/case-studies/[slug]/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(page, /CaseStudyNav|case-study-topbar|case-breadcrumb/);
  assert.match(page, /className="case-intro"/);
  assert.match(page, /className="case-study-content"/);
  assert.match(page, /className="case-section__copy"/);
  assert.match(page, /className="case-section__visual"/);
  assert.match(css, /Linear editorial case studies/);
  assert.match(css, /\.case-study-shell \.case-study-frame\s*\{[^}]*width:\s*100%;[^}]*border-radius:\s*0;/);
  assert.match(css, /\.case-study-shell \.case-section,[\s\S]*?display:\s*block;/);
  assert.match(css, /\.case-study-shell \.case-section__copy\s*\{[^}]*max-width|\.case-study-shell \.case-section__copy\s*\{[^}]*width:/);
});

test("uses the supplied projects in the Play archive", async () => {
  const play = await readFile(new URL("../app/play/page.tsx", import.meta.url), "utf8");

  for (const title of ["Passport", "Mental health app", "Logitech", "Adobe", "Microsoft"]) {
    assert.match(play, new RegExp(`"${title}"`));
  }
  assert.equal((play.match(/\["\d{2}",/g) ?? []).length, 5);
  assert.doesNotMatch(play, /Tiny type studies|Weekend camera roll|Things in progress/);
});

test("expands the work archive and offers two- or three-column layouts", async () => {
  const [projects, projectCard, caseStudy, hero, prototype, css] = await Promise.all([
    readFile(new URL("../app/projects.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/project-card.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/case-studies/[slug]/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/hero-meadow.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/meadow-prototype-controls.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.equal((projects.match(/number: "\d{2}"/g) ?? []).length, 17);
  assert.match(projects, /title: "Glean homepage"/);
  assert.match(projects, /title: "Glean proactive intelligence"/);
  assert.match(projects, /title: "Telestrations"/);
  assert.match(projectCard, /className="project-card__title"/);
  assert.match(projects, /export const placeholderCaseStudy: CaseStudy/);
  assert.match(caseStudy, /caseStudies\[slug\] \?\? placeholderCaseStudy/);
  assert.match(hero, /useState<WorkGridColumns>\(3\)/);
  assert.match(hero, /document\.documentElement\.dataset\.workColumns = String\(workGridColumns\)/);
  assert.match(prototype, /aria-label="Work grid columns"/);
  assert.match(prototype, /onWorkGridColumnsChange\(2\)/);
  assert.match(prototype, /onWorkGridColumnsChange\(3\)/);
  assert.match(css, /html\[data-work-columns="2"\] \.pranathi-project-grid/);
  assert.match(css, /gap:\s*clamp\(46px, 4vw, 64px\) clamp\(24px, 2\.2vw, 34px\)/);
});

test("keeps the meadow scene, miniature visitors, and cursor pet lightweight", async () => {
  const [weather, meadow, prototype, hero, tree, treeRenderer, layerHost, bike, photographer, backpacker, smiley, css] = await Promise.all([
    readFile(new URL("../app/alamo-weather.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/meadow.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/meadow-prototype-controls.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/hero-meadow.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/cypress-tree.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/cypress-tree-renderer.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/use-meadow-layer-host.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/bike-ride.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/photo-drop.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/backpack-walk.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/smiley-cursor.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(weather, /api\.open-meteo\.com\/v1\/forecast/);
  assert.match(weather, /wind_speed_10m%2Cwind_direction_10m%2Cwind_gusts_10m/);
  assert.doesNotMatch(weather, /temperature_2m|temperature:/);
  assert.match(weather, /function describeAlamoWind/);
  assert.match(weather, /There's a slight breeze at Alamo Square right now\./);
  assert.match(weather, /describeAlamoWind\(conditions\)/);
  assert.match(weather, /const WEATHER_REFRESH_MS = 10 \* 60 \* 1000/);
  assert.match(weather, /timeZone: "America\/Los_Angeles"/);
  assert.match(weather, /onWindUpdate\(conditionsToWind\(next\)\)/);
  assert.match(meadow, /type MeadowVariant = "living" \| "flat"/);
  assert.match(meadow, /type RollingMeadow/);
  assert.match(meadow, /\/meadow-rolling-coastal\.png/);
  assert.match(meadow, /\/meadow-rolling-golden\.png/);
  assert.match(meadow, /\/meadow-rolling-wildflower\.png/);
  assert.match(meadow, /\/meadow-rolling-foggy\.png/);
  assert.match(meadow, /type FlatMeadowTexture/);
  assert.match(meadow, /\{ id: "original", label: "Original", src: "\/meadow-ground\.png" \}/);
  assert.doesNotMatch(meadow, /createMeadowGrass|meadow__texture|meadow__grass-canvas/);
  assert.match(meadow, /data-meadow-surface=\{variant === "flat" \? "active" : "inactive"\}/);
  assert.match(meadow, /className="meadow__flat-field"/);
  assert.match(meadow, /\/flat-meadow-fine\.jpg/);
  assert.match(meadow, /\/flat-meadow-clover\.jpg/);
  assert.match(meadow, /\/flat-meadow-wind\.jpg/);
  assert.match(meadow, /className="meadow__flat-tint"/);
  assert.match(prototype, /useState\(false\)/);
  assert.match(prototype, /Open meadow and wind settings/);
  assert.match(prototype, /createPortal/);
  assert.match(prototype, /setPortalHost\(document\.body\)/);
  assert.match(prototype, /aria-pressed=\{variant === "flat"\}/);
  assert.match(prototype, /type="color"/);
  assert.match(prototype, /FLAT_MEADOW_TEXTURES\.map/);
  assert.match(prototype, /onFlatTextureChange\(id\)/);
  assert.match(prototype, /aria-label="Meadow height"/);
  assert.match(prototype, /onMeadowHeightChange\(Number\(event\.target\.value\)\)/);
  assert.match(prototype, /cycleRollingMeadow/);
  assert.match(prototype, /Previous rolling meadow/);
  assert.match(prototype, /Next rolling meadow/);
  assert.match(prototype, /windFields\.map/);
  assert.match(prototype, /onPlayingChange\(!isPlaying\)/);
  assert.match(hero, /document\.querySelector<HTMLElement>\("\.pranathi-work"\)/);
  assert.match(hero, /const scrollY = Math\.max\(0, window\.scrollY\)/);
  assert.match(hero, /const transitionStart = Math\.max\(0, workTop - viewportHeight \* 1\.06\)/);
  assert.match(hero, /const transitionEnd = Math\.max\(transitionStart \+ 1, workTop - viewportHeight \* 0\.2\)/);
  assert.match(hero, /const smootherProgress = currentProgress \* currentProgress \* currentProgress/);
  assert.match(hero, /const ceremonialProgress = Math\.pow\(smootherProgress, 1\.08\)/);
  assert.match(hero, /--meadow-exit-scale/);
  assert.match(hero, /--meadow-exit-opacity/);
  assert.match(hero, /--meadow-exit-y/);
  assert.match(hero, /--meadow-layer-y/);
  assert.match(hero, /--tree-layer-y/);
  assert.match(hero, /--meadow-layer-opacity/);
  assert.match(hero, /--tree-layer-opacity/);
  assert.match(hero, /--meadow-dissolve-edge-/);
  assert.match(hero, /window\.requestAnimationFrame\(animate\)/);
  assert.match(hero, /window\.addEventListener\("scroll", schedule, \{ passive: true \}\)/);
  assert.match(hero, /prefers-reduced-motion: reduce/);
  assert.match(hero, /data-scene-visible/);
  assert.match(hero, /rollingMeadow=\{rollingMeadow\}/);
  assert.match(hero, /useState<RollingMeadow>\("original"\)/);
  assert.match(hero, /useState<FlatMeadowTexture>\("fine"\)/);
  assert.match(hero, /wind=\{wind\}[\s\S]*isPlaying=\{sceneIsPlaying\}/);
  assert.match(hero, /DEFAULT_FLAT_MEADOW_COLOR/);
  assert.match(hero, /const \[meadowHeight, setMeadowHeight\] = useState\(100\)/);
  assert.match(hero, /--meadow-height-scale/);
  assert.match(hero, /--living-meadow-scale-y/);
  assert.match(hero, /--meadow-height-offset/);
  assert.match(hero, /data-meadow-variant=\{meadowVariant\}/);
  assert.match(hero, /<MeadowSettings/);
  assert.match(hero, /isVisible=\{isSceneVisible\}/);
  assert.match(hero, /<AlamoWeather onWindUpdate=\{setWind\} \/>/);
  assert.match(tree, /treeRef\.current\?\.setWind\(wind\)/);
  assert.match(tree, /portfolio:pet-blow-cypress/);
  assert.match(tree, /treeRef\.current\?\.applyGust/);
  assert.match(tree, /window\.addEventListener\(PET_BLOW_CYPRESS_EVENT, handlePetGust\)/);
  assert.match(tree, /WELCOME_BREEZE_DELAY = 1250/);
  assert.match(tree, /STRONG_AMBIENT_WIND_THRESHOLD = 0\.58/);
  assert.match(tree, /WELCOME_BREEZE_STRENGTH = 0\.46/);
  assert.match(tree, /Math\.max\(currentWind\.breeze, currentWind\.gust \* 0\.72\)/);
  assert.match(tree, /ambientWind >= STRONG_AMBIENT_WIND_THRESHOLD/);
  assert.match(tree, /sessionStorage\.getItem\(WELCOME_BREEZE_SESSION_KEY\)/);
  assert.match(tree, /direction: currentWind\.direction < 0 \? -1 : 1/);
  assert.doesNotMatch(tree, /cypress-tree__ground-shadow/);
  assert.doesNotMatch(tree, /cypress-tree__controls|useState/);
  assert.doesNotMatch(tree, /cypress-tree__root-transition/);
  assert.doesNotMatch(tree, /cypress-tree__root-bank/);
  assert.match(treeRenderer, /const petGust = \{ direction: 1, strength: 0/);
  assert.match(treeRenderer, /const gustEnvelope =/);
  assert.match(treeRenderer, /const petDrive = petGust\.direction/);
  assert.match(treeRenderer, /const dynamicMaxAngle = bone\.maxAngle/);
  assert.match(treeRenderer, /const naturalDirection = Number\.isFinite\(wind\.direction\)/);
  assert.match(treeRenderer, /naturalDirection \* \(\(0\.006/);
  assert.match(treeRenderer, /const petLeafPush = petGust\.direction/);
  assert.match(treeRenderer, /function applyGust\(values\)/);
  assert.match(treeRenderer, /running \|\| petGust\.duration > 0/);
  assert.match(layerHost, /document\.querySelector<HTMLElement>\("\.hero-meadow"\)/);
  assert.match(layerHost, /window\.requestAnimationFrame/);
  assert.match(bike, /const FRAME_URLS = \[/);
  assert.match(bike, /data-cuelume-toggle="pulse"/);
  assert.match(bike, /createPortal/);
  assert.match(bike, /\}, \[meadowHost\]\)/);
  assert.match(bike, /surfaceByColumn/);
  assert.match(bike, /window\.requestAnimationFrame\(frame\)/);
  assert.match(bike, /direction = nextDirection/);
  assert.match(bike, /let currentSpeed = 0/);
  assert.match(bike, /let smoothedGrade = 0/);
  assert.match(bike, /const travelGrade = clamp\(Math\.sin\(currentTrackAngle\) \* direction, -0\.34, 0\.34\)/);
  assert.match(bike, /const rollingPull = \(baseRideSpeed - currentSpeed\) \* 1\.45/);
  assert.match(bike, /const slopeGravity = smoothedGrade \* 120/);
  assert.match(bike, /baseRideSpeed \* 0\.72,[\s\S]*baseRideSpeed \* 1\.32/);
  assert.match(bike, /layer\.dataset\.terrain = smoothedGrade > 0\.025/);
  assert.match(bike, /portfolio:pet-blow-cyclist/);
  assert.match(bike, /layer\.dataset\.direction = direction === 1 \? "right" : "left"/);
  assert.match(bike, /window\.addEventListener\(PET_BLOW_CYCLIST_EVENT, handlePetBlow\)/);
  assert.match(bike, /beginTurn\(performance\.now\(\), nextDirection\)/);
  assert.match(bike, /new IntersectionObserver/);
  assert.match(bike, /prefers-reduced-motion: reduce/);
  assert.match(bike, /data-meadow-surface="active"/);
  assert.match(bike, /meadow\.dataset\.meadowVariant === "flat"/);
  assert.match(photographer, /const FRAME_URLS = \[/);
  assert.match(photographer, /data-cuelume-toggle="scan"/);
  assert.match(photographer, /createPortal/);
  assert.match(photographer, /\}, \[meadowHost\]\)/);
  assert.match(photographer, /const PHOTO_SEQUENCE = \[/);
  assert.match(photographer, /const RAPID_BURST_SEQUENCE = \[/);
  assert.match(photographer, /photographer-frame-1-corrected\.png/);
  assert.match(photographer, /photographer-frame-2-corrected\.png/);
  assert.match(photographer, /\{ frame: 3, minDuration: 420, maxDuration: 560 \}/);
  assert.match(photographer, /Math\.random\(\)/);
  assert.match(photographer, /randomDuration\(step\.minDuration, step\.maxDuration\)/);
  assert.match(photographer, /portfolio:pet-blow-photographer/);
  assert.match(photographer, /isRapidBurst = true/);
  assert.match(photographer, /layer\.dataset\.burst = "true"/);
  assert.match(photographer, /window\.addEventListener\(PET_BLOW_PHOTOGRAPHER_EVENT, handlePetBlow\)/);
  assert.match(photographer, /surfaceByColumn/);
  assert.match(photographer, /window\.requestAnimationFrame\(frame\)/);
  assert.match(photographer, /window\.setTimeout/);
  assert.match(photographer, /new IntersectionObserver/);
  assert.match(photographer, /prefers-reduced-motion: reduce/);
  assert.match(photographer, /data-meadow-surface="active"/);
  assert.match(backpacker, /const FRAME_URLS = \[/);
  assert.match(backpacker, /data-cuelume-toggle="arrival"/);
  assert.match(backpacker, /createPortal/);
  assert.match(backpacker, /\}, \[meadowHost\]\)/);
  assert.match(backpacker, /const WALK_FRAME_ORDER = \[/);
  assert.match(backpacker, /surfaceByColumn/);
  assert.match(backpacker, /window\.requestAnimationFrame\(frame\)/);
  assert.match(backpacker, /direction = nextDirection/);
  assert.match(backpacker, /portfolio:pet-blow-backpacker/);
  assert.match(backpacker, /layer\.dataset\.direction = direction === 1 \? "right" : "left"/);
  assert.match(backpacker, /window\.addEventListener\(PET_BLOW_BACKPACKER_EVENT, handlePetBlow\)/);
  assert.match(backpacker, /beginTurn\(performance\.now\(\), nextDirection\)/);
  assert.match(backpacker, /new IntersectionObserver/);
  assert.match(backpacker, /prefers-reduced-motion: reduce/);
  assert.match(backpacker, /data-meadow-surface="active"/);
  assert.match(smiley, /const IDLE_HUFF_DELAY = 5000/);
  assert.match(smiley, /const IDLE_MISCHIEF_DELAY = IDLE_HUFF_DELAY - IDLE_APPROACH_DURATION/);
  assert.match(smiley, /const IDLE_APPROACH_DURATION = 950/);
  assert.match(smiley, /const IDLE_HUFF_SEQUENCE = \["light", "light", "strong", "strong", "strong"\]/);
  assert.match(smiley, /IDLE_HUFF_SEQUENCE\[cycleIndex\] \?\? "strained"/);
  assert.match(smiley, /const HAPPY_FLASH_DURATION = 560/);
  assert.match(smiley, /const heroSection = document\.querySelector<HTMLElement>\("\.pranathi-intro--home"\)/);
  assert.match(smiley, /heroSection\.getBoundingClientRect\(\)\.bottom <= 0/);
  assert.doesNotMatch(smiley, /HERO_COPY_CLEARANCE|heroCopyTargets|isNearHeroCopy|data-hero-copy/);
  assert.match(smiley, /if \(!hasPointerPosition \|\| isPastHero \|\| miniaturePhase !== "off"\) return/);
  assert.match(smiley, /const FACING_INTENT_THRESHOLD = 32/);
  assert.match(smiley, /const FACING_CHANGE_DELAY = 240/);
  assert.match(smiley, /const FACING_INTENT_MEMORY = 180/);
  assert.match(smiley, /const clamp = \(value: number, min: number, max: number\) => \(/);
  assert.ok(smiley.indexOf("const clamp =") < smiley.indexOf("export function SmileyCursor"));
  assert.match(smiley, /facingIntent = clamp\(facingIntent \+ deltaX, -140, 140\)/);
  assert.match(smiley, /queueFacingChange\(nextFacing\)/);
  assert.match(smiley, /window\.setTimeout\(\(\) => \{/);
  assert.match(smiley, /cursor\.dataset\.facing = facing === 1 \? "right" : "left"/);
  assert.match(smiley, /currentFollowDistance \* facing/);
  assert.match(smiley, /const MINIATURE_ARM_DELAY = 480/);
  assert.match(smiley, /const MINIATURE_APPROACH_DURATION = 680/);
  assert.match(smiley, /const MINIATURE_BLOW_TRIGGER_DELAY = 280/);
  assert.match(smiley, /type MiniatureKind = "backpacker" \| "cyclist" \| "photographer" \| "cypress"/);
  assert.match(smiley, /activeMiniature/);
  assert.match(smiley, /nearestMiniature/);
  assert.match(smiley, /portfolio:pet-blow-backpacker/);
  assert.match(smiley, /portfolio:pet-blow-cyclist/);
  assert.match(smiley, /portfolio:pet-blow-photographer/);
  assert.match(smiley, /portfolio:pet-blow-cypress/);
  assert.match(smiley, /cypress: \{ layer: '\.hero-meadow\[data-scene-visible="true"\]', actor: "\.cypress-tree__canvas" \}/);
  assert.match(smiley, /cypress: 54/);
  assert.match(smiley, /cursor\.dataset\.miniature = "approach"/);
  assert.match(smiley, /cursor\.dataset\.miniature = "blow"/);
  assert.match(smiley, /new CustomEvent\(PET_BLOW_EVENT\[miniature\.kind\]/);
  assert.match(smiley, /miniature\.kind === "cypress"/);
  assert.match(smiley, /\{ direction: miniatureFacing, strength: 0\.92, duration: 1500 \}/);
  assert.match(smiley, /miniatureKind === "cypress" \? "strained" : "strong"/);
  assert.match(smiley, /cursor\.dataset\.idle = "approach"/);
  assert.match(smiley, /cursor\.dataset\.idle = "huff"/);
  assert.match(smiley, /cursor\.dataset\.reaction = "smile"/);
  assert.match(smiley, /\/pet\/pet-smile\.png/);
  assert.match(smiley, /stopIdleMischief\(\)/);
  assert.doesNotMatch(css, /\.meadow__grass-canvas\s*\{|\.meadow__texture\s*\{|\.meadow__visual\.is-grass-live/);
  assert.match(css, /\.meadow__visual--flat\s*\{/);
  assert.match(css, /--flat-meadow-color:\s*#6f8d45/);
  assert.match(css, /--flat-meadow-height:\s*clamp\(86px, 11svh, 122px\)/);
  assert.match(css, /--cypress-viewport-lift:\s*clamp\(0px, calc\(20vw - 288px\), 132px\)/);
  assert.match(css, /transform:\s*translateX\(-50%\) scaleY\(var\(--living-meadow-scale-y\)\)/);
  assert.match(css, /transform:\s*scaleY\(var\(--meadow-height-scale\)\)/);
  assert.match(css, /\.meadow-settings__height input\s*\{/);
  assert.doesNotMatch(css, /\.meadow__flat-image\s*\{[^}]*mix-blend-mode:\s*luminosity/);
  assert.match(css, /\.meadow__flat-tint\s*\{[^}]*opacity:\s*0\.22/);
  assert.match(css, /\.meadow-settings__texture-options\s*\{/);
  assert.match(css, /\.meadow__flat-tint\s*\{[^}]*background:\s*var\(--flat-meadow-color\)/);
  assert.match(css, /\.meadow-settings\s*\{/);
  assert.match(css, /\.meadow-settings__modes button\[aria-pressed="true"\]/);
  assert.match(css, /\.alamo-weather\s*\{[^}]*font-size:\s*10px/);
  assert.match(css, /\.alamo-weather__primary\s*\{[^}]*font-size:\s*11px/);
  assert.match(css, /\.hero-meadow > \.cypress-tree\s*\{[^}]*z-index:\s*auto;[^}]*contain:\s*none;/);
  assert.match(css, /--cypress-root-overlap:\s*clamp\(16px, 1\.4vw, 24px\)/);
  assert.match(css, /\.hero-meadow\[data-meadow-variant="living"\] > \.cypress-tree\s*\{[^}]*bottom:\s*calc\([\s\S]*?clamp\(68px, 7\.35vw, 110px\)[\s\S]*?var\(--meadow-height-offset\)[\s\S]*?var\(--cypress-viewport-lift\)[\s\S]*?- var\(--cypress-root-overlap\)[\s\S]*?\);/);
  assert.match(css, /var\(--cypress-viewport-lift\)\s*-\s*10px/);
  assert.doesNotMatch(css, /\.cypress-tree__ground-shadow\s*\{/);
  assert.match(css, /\.hero-meadow > \.cypress-tree \.cypress-tree__canvas\s*\{[^}]*z-index:\s*1;/);
  assert.match(css, /\.hero-meadow > \.meadow\s*\{[^}]*z-index:\s*2;/);
  assert.match(css, /\.hero-meadow > \.meadow\s*\{[^}]*clip-path:\s*polygon\(/);
  assert.match(css, /transform:\s*translate3d\(0, var\(--meadow-layer-y\), 0\)/);
  assert.match(css, /transform:\s*translate3d\(0, var\(--tree-layer-y\), 0\)/);
  assert.match(css, /\.hero-meadow > \.bike-ride-layer,[\s\S]*?\.hero-meadow > \.backpack-walk-layer\s*\{[^}]*z-index:\s*5;/);
  assert.match(css, /\.hero-meadow\s*\{[\s\S]*position:\s*fixed/);
  assert.match(css, /transform:\s*translate3d\(-50%, var\(--meadow-exit-y\), 0\) scale\(var\(--meadow-exit-scale\)\)/);
  assert.match(css, /transform-origin:\s*50% 100%/);
  assert.match(css, /\.hero-meadow\[data-scene-visible="false"\]/);
  assert.doesNotMatch(css, /\.cypress-tree__root-transition\s*\{/);
  assert.match(css, /width:\s*clamp\(240px, 22vw, 322px\)/);
  assert.match(css, /width:\s*clamp\(238px, 31vw, 330px\)/);
  assert.match(css, /width:\s*248px/);
  assert.doesNotMatch(css, /@keyframes cypress-root-grass-sway/);
  assert.match(css, /--portfolio-reading-width:\s*740px/);
  assert.match(css, /\.site-header__wordmark,[\s\S]*?\.site-header--pages \.site-nav\s*\{[^}]*font-size:\s*clamp\(15px, 1\.1vw, 18px\)/);
  assert.match(css, /\.site-header--pages\s*\{[^}]*gap:\s*32px;[^}]*padding-top:\s*30px/);
  assert.match(css, /font-size:\s*clamp\(29px, 2\.5vw, 35px\)/);
  assert.match(css, /font-size:\s*clamp\(16px, 1\.32vw, 19px\)/);
  assert.match(css, /min-height:\s*100svh/);
  assert.match(css, /\.bike-word,\s*\.photo-word,\s*\.backpack-word\s*\{/);
  assert.match(css, /--miniature-character-height:\s*clamp\(82px, 7vw, 100px\)/);
  assert.match(css, /--cyclist-character-size:\s*clamp\(66px, 5\.6vw, 80px\)/);
  assert.match(css, /--backpacker-character-width:\s*clamp\(70px, 6vw, 85px\)/);
  assert.match(css, /--backpacker-character-height:\s*clamp\(86px, 7\.35vw, 105px\)/);
  assert.match(css, /\.bike-rider\s*\{[^}]*width:\s*var\(--cyclist-character-size\)[^}]*height:\s*var\(--cyclist-character-size\)/);
  assert.match(css, /\.bike-rider__direction\s*\{[^}]*transform:\s*scale\(1\.14\) scaleX\(var\(--bike-direction\)\)/);
  assert.match(css, /\.mini-photographer\s*\{[^}]*height:\s*var\(--miniature-character-height\)/);
  assert.match(css, /\.mini-hiker\s*\{[^}]*width:\s*var\(--backpacker-character-width\)[^}]*height:\s*var\(--backpacker-character-height\)/);
  assert.match(css, /@keyframes miniature-bike-materialize/);
  assert.match(css, /@keyframes miniature-photographer-materialize/);
  assert.match(css, /@keyframes miniature-hiker-materialize/);
  assert.match(css, /@keyframes smiley-happy-glimpse/);
  assert.doesNotMatch(css, /data-hero-copy/);
  assert.match(css, /--smiley-facing:\s*1/);
  assert.match(css, /transform:\s*scaleX\(var\(--smiley-facing\)\)/);
  assert.match(css, /pointer-events:\s*none/);
});
