import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("expanded film photos retain their image ratio with an even white mat", async () => {
  const css = await readFile(new URL("../app/photography/photography.module.css", import.meta.url), "utf8");
  const frame = css.match(/\.focusedPhotoFilm \{([^}]+)\}/)[1];
  assert.match(frame, /box-sizing: content-box/);
  assert.match(frame, /padding: 14px;/);
  assert.match(frame, /100vw - 78px/);
  assert.match(frame, /100dvh - 174px/);
});

test("photography uses plain paper without the studio grid", async () => {
  const css = await readFile(new URL("../app/photography/photography.module.css", import.meta.url), "utf8");
  const page = css.match(/\.page \{([^}]+)\}/)[1];
  assert.match(page, /background: var\(--paper\)/);
});

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
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

test("hero typography preserves the reference sizes and natural wrapping", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /\.pranathi-name\s*\{\s*margin-bottom: 13px;\s*color: var\(--muted\);\s*font: italic 36px \/ 1\.15 var\(--serif\);\s*letter-spacing: normal;/);
  assert.match(css, /\.work-feature__header h3\s*\{[^}]*font: italic clamp\(26px, 2\.3vw, 36px\)/);
  assert.match(css, /\.pranathi-bio\s*\{\s*max-width: 740px;\s*color: var\(--ink\);\s*font-size: 20px;/);
  assert.doesNotMatch(css, /hero-copy-break/);
});

test("homepage has a deliberate narrow-screen work layout", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /@media \(max-width: 700px\) \{[\s\S]*?\.hero-meadow\s*\{\s*display: none;/);
  assert.match(css, /\.work-feature__media--trio,[\s\S]*?grid-template-columns: 1fr;/);
  assert.match(css, /\.work-feature__media--assets > \*\s*\{\s*aspect-ratio: 1 \/ 1\.08;/);
});

test("server-renders the portfolio meadow and shared wind study", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Neel Saswade’s portfolio<\/title>/i);
  assert.match(html, /rel="icon" href="\/lmo-square-tree\.png\?v=4" type="image\/png" sizes="64x64"/i);
  assert.match(html, /rel="shortcut icon" href="\/lmo-square-tree\.png\?v=4"/i);
  await access(new URL("../public/favicon.svg", import.meta.url));
  assert.match(html, /property="og:title" content="Neel Saswade’s portfolio"/i);
  assert.match(html, /property="og:image" content="[^\"]*\/og\.png"/i);
  assert.match(html, /name="twitter:title" content="Neel Saswade’s portfolio"/i);
  assert.match(html, /<script defer="" data-domain="neelsaswade\.com" src="https:\/\/plausible\.io\/js\/script\.js"><\/script>/i);
  assert.match(html, /class="site-header site-header--pages"/);
  assert.match(html, />Neel Saswade</);
  assert.match(html, /I’m a product designer based in San Francisco\. Currently, I’m a designer at /);
  assert.match(html, /working on proactivity, artifacts, and growth\. Previously, I designed at /);
  assert.match(html, /class="hero-copy__rest hero-copy__free-time">In my free time,<\/span>/);
  assert.match(html, /hero-activities__icons/);
  const activityButtons = [...html.matchAll(/<button[^>]*class="[^"]*meadow-activity[^"]*"[^>]*>[\s\S]*?<\/button>/g)];
  assert.equal(activityButtons.length, 3);
  for (const [index, activity] of ["photography", "cycling", "backpacking"].entries()) {
    const button = activityButtons[index][0];
    assert.match(button, /aria-pressed="false"/);
    assert.ok(button.includes(`/collectibles/glass-square-v1/${activity}-96.webp`));
    assert.ok(button.includes(`/collectibles/glass-square-v1/${activity}-selected-96.webp`));
    await access(new URL(`../public/collectibles/glass-square-v1/${activity}-96.webp`, import.meta.url));
    await access(new URL(`../public/collectibles/glass-square-v1/${activity}-selected-96.webp`, import.meta.url));
  }
  assert.match(html, /hero-company--glean[^>]*href="https:\/\/www\.glean\.com\/"/);
  assert.match(html, /hero-company--snap[^>]*href="https:\/\/www\.snap\.com\/"/);
  assert.doesNotMatch(html, /as an intern/);
  assert.doesNotMatch(html, /\[something good\]|\[company\]/);
  assert.match(html, /class="meadow__image meadow__image--curated" src="\/alamo-styles\/painterly-realism\/rolling\.png"/);
  assert.match(html, /data-rolling-meadow="original"/);
  assert.match(html, /Checking Alamo Square&#x27;s wind/);
  assert.match(html, /Local time in San Francisco/);
  assert.match(html, /meadow__grass-canvas[^>]*data-grass-layer/);
  assert.match(html, /class="meadow__visual meadow__visual--flat"/);
  assert.match(html, /data-flat-texture="fine"/);
  assert.match(html, /class="[^"]*\bbike-word\b[^"]*\bhero-hobby--bike\b/);
  assert.match(html, /Cyclist on the meadow/);
  assert.match(html, /class="[^"]*\bphoto-word\b[^"]*\bhero-hobby--photo\b/);
  assert.match(html, /Photographer on the meadow/);
  assert.match(html, /class="[^"]*\bbackpack-word\b[^"]*\bhero-hobby--backpack\b/);
  assert.match(html, /Backpacker on the meadow/);
  assert.match(html, /class="top-pet-pull"/);
  assert.doesNotMatch(html, /Meadow and cypress wind controls|Open secret meadow prototype picker/);
  assert.doesNotMatch(html, /codex-preview|Building your site|react-loading-skeleton/i);
});

test("the bike arrives without decorative sparkles", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.doesNotMatch(css, /miniature-bike-sparkle|\.bike-rider__sprite::(?:before|after)/);
  assert.match(css, /miniature-bike-materialize/);
  assert.match(css, /miniature-bike-touchdown/);
});

test("hobby icons toggle active characters off before starting a new arrival", async () => {
  for (const file of ["bike-ride.tsx", "photo-drop.tsx", "backpack-walk.tsx"]) {
    const source = await readFile(new URL(`../app/${file}`, import.meta.url), "utf8");
    const launch = source.slice(source.indexOf("function launch()"), source.indexOf("launchRef.current = launch"));
    assert.match(launch, /cancelAnimationFrame\(frameHandle\)/);
    assert.match(launch, /if \(phase !== "idle"\) \{\s*setPhase\("idle"\);\s*return;/);
    assert.ok(launch.indexOf('if (phase !== "idle")') < launch.indexOf('setPhase("spawn")'));
    assert.match(source, /setAttribute\("aria-pressed", String\(next !== "idle"\)\)/);
    assert.doesNotMatch(launch, /setTimeout\(\(\) => setPhase\("idle"\)/);
    if (file === "photo-drop.tsx") {
      assert.ok(launch.indexOf("clearPhotoLoop()") < launch.indexOf('if (phase !== "idle")'));
      assert.match(launch, /clearTimeout\(reducedTimer\)/);
    }
  }
});

test("the default photographer starts in the meadow dip rather than below its icon", async () => {
  const source = await readFile(new URL("../app/photo-drop.tsx", import.meta.url), "utf8");
  const placement = source.slice(source.indexOf("function placeOnMeadow()"), source.indexOf("launchRef.current = launch"));
  assert.ok(source.includes("const PHOTOGRAPHER_ARRIVAL_X_RATIO = 0.44;"));
  assert.ok(placement.includes("anchoredToMeadowDip = true;"));
  assert.ok(placement.includes("layerBounds.width * PHOTOGRAPHER_ARRIVAL_X_RATIO"));
  assert.ok(placement.includes('setPhase("shoot")'));
  assert.ok(!placement.includes("buttonBounds"));
  assert.ok(source.includes("anchoredToMeadowDip ? layerWidth * PHOTOGRAPHER_ARRIVAL_X_RATIO : x"));
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
  assert.match(css, /\.pranathi-bio,[\s\S]*?\.case-story-chapter__copy > p:last-child\s*\{[^}]*text-wrap:\s*pretty/);
  assert.match(css, /\.case-intro h1\s*\{[^}]*font-family:\s*var\(--serif\)/);
  assert.match(css, /\.site-header__wordmark,[\s\S]*?\.site-header--pages \.site-nav\s*\{[^}]*font-family:\s*var\(--sans\)/);
  assert.match(css, /\.about-copy p\s*\{[^}]*font-family:\s*var\(--sans\)/);
  assert.match(css, /\.simple-page__copy p,[\s\S]*?\.simple-page__lede\s*\{[^}]*font-family:\s*var\(--sans\)/);
  assert.match(css, /\.play-tile h2\s*\{[^}]*font-family:\s*var\(--sans\)/);
});

test("keeps the primary navigation simple and links Photo to photography", async () => {
  const header = await readFile(new URL("../app/site-header.tsx", import.meta.url), "utf8");
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.doesNotMatch(header, /next\/link/);
  assert.match(header, /href=\{id === "work" && current === "work" \? "#work" : href\}/);
  assert.match(header, /\["work", "Work", "\/#work"\]/);
  assert.match(header, /\["photo", "Photo", "\/photography"\]/);
  assert.match(header, /\["about", "About", "\/about"\]/);
  assert.doesNotMatch(header, /Play|Resume|Neel-Saswade-Resume/);
  assert.match(await readFile(new URL("../app/photo-drop.tsx", import.meta.url), "utf8"), /id="photo"/);
  assert.doesNotMatch(header, /site-nav__label--hover/);
  assert.doesNotMatch(css, /site-nav__label--hover/);
});

test("renders Play as a compact three-column project grid", async () => {
  const [play, css] = await Promise.all([
    readFile(new URL("../app/play/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  for (const title of ["Passport", "Mental health app", "Logitech", "Adobe", "Microsoft"]) {
    assert.match(play, new RegExp(title));
  }
  assert.match(play, /SiteHeader current="play"/);
  assert.doesNotMatch(play, /Small experiments, side projects/);
  assert.doesNotMatch(play, /<h1[^>]*>Play<\/h1>/);
  assert.match(css, /\.play-grid\s*\{[^}]*grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(css, /\.play-tile\s*\{[^}]*background:\s*#f2f2f2/);
  assert.match(css, /\.play-tile\s*\{[^}]*align-items:\s*center;[^}]*justify-content:\s*center/);
  assert.match(css, /\.play-tile h2\s*\{[^}]*text-align:\s*center/);
});

test("keeps About motion calm, accessible, and reduced-motion safe", async () => {
  const [gallery, css] = await Promise.all([
    readFile(new URL("../app/about/about-photo-gallery.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  const viewer = await readFile(new URL("../app/photo-viewer.tsx", import.meta.url), "utf8");
  assert.match(viewer, /trigger.focus\(\{ preventScroll: true \}\)/);
  assert.match(gallery, /usePhotoViewer/);
  assert.match(gallery, /aria-haspopup="dialog"/);
  assert.match(css, /\.about-page__gallery\[data-motion-ready="true"\] \.film-photo__paper/);
  assert.match(css, /\/\* Lift the About composition toward the homepage hero's starting point\. \*\/[\s\S]*padding-top: clamp\(58px, 8vh, 92px\)/);
  assert.match(css, /@media \(hover: hover\) and \(pointer: fine\)/);
  assert.match(css, /\.photo-lightbox\[data-state="closing"\]/);
  assert.match(css, /\.case-media-shell > \.case-visual\s*\{\s*animation:\s*none;/);
  assert.ok(
    css.lastIndexOf(".case-media-shell > .case-visual {\n  animation: none;") >
      css.lastIndexOf(".case-media-shell > .case-visual {\n  animation: case-media-drift"),
    "the final motion layer must keep case-study media still",
  );
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.about-page__gallery\[data-motion-ready="true"\] \.film-photo__paper/);
});

test("Life hover expands only one print and types its caption", async () => {
  const css = await readFile(new URL("../app/about/about-journal.css", import.meta.url), "utf8");
  assert.match(css, /\.life-print:hover \.life-print__paper.*scale\(1\.85\)/);
  assert.match(css, /transform: rotate\(var\(--print-angle\)\)/);
  assert.match(css, /--letter-index/);
  assert.ok(css.includes("calc(150ms + var(--letter-index) * 30ms)"));
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /hover: hover/);
  assert.doesNotMatch(css, /life-gallery__track:hover/);
});

test("About keeps one biography paragraph and a softly tilting 2px portrait", async () => {
  const about = await readFile(new URL("../app/about/page.tsx", import.meta.url), "utf8");
  const css = await readFile(new URL("../app/about/about-journal.css", import.meta.url), "utf8");
  const intro = about.slice(about.indexOf('className="simple-page__copy about-page__intro"'), about.indexOf('<nav className="about-page__socials"'));
  assert.equal((intro.match(/<p /g) ?? []).length, 1);
  assert.ok(css.includes("border-radius: 2px;"));
  assert.ok(css.includes(".about-page--journal .about-page__portrait-card:hover { transform: rotate(-1deg) scale(1.01); }"));
  assert.ok(css.includes("(prefers-reduced-motion: no-preference)"));
});

test("keeps About links concise and opens the resume in a new tab", async () => {
  const about = await readFile(new URL("../app/about/page.tsx", import.meta.url), "utf8");
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.match(about, /className="about-page__greeting">Hello!<\/h1>/);
  assert.match(css, /\.about-page \.about-page__greeting\s*\{[\s\S]*color: var\(--ink\);[\s\S]*font: italic clamp\(22px, 1\.8vw, 28px\)[\s\S]*font-weight: 400;/);
  assert.match(about, /data-social="resume"[\s\S]*data-social="twitter"[\s\S]*data-social="email"/);
  assert.match(about, /aria-label="Resume"/);
  assert.match(about, /2077068857160700242/);
  for (const asset of ["passport.png", "underwallet.png", "task-valley.png"]) {
    assert.ok(about.includes(`/about/${asset}`));
  }
  assert.match(about, /href="\/Neel-Saswade-Resume\.pdf"[\s\S]*target="_blank"/);
  assert.match(about, /className="about-page__social-icon"[\s\S]*<svg viewBox="0 0 24 24"/);
  assert.doesNotMatch(about, /aria-hidden="true">↗/);
  assert.match(css, /\.about-page__social-icon svg\s*\{[\s\S]*stroke-linecap: round;[\s\S]*stroke-linejoin: round;/);
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
  const styleCatalog = styles.split("] as const;")[0];

  assert.equal((styleCatalog.match(/\n\s+id: "/g) ?? []).length, 20);
  assert.match(styles, /id: "control"[\s\S]*treeSrc: "\/monterey-cypress\.png"/);
  assert.match(styles, /id: "studio-static"[\s\S]*label: "Studio · no meadow"[\s\S]*rollingSrc: null[\s\S]*flatSrc: null/);
  assert.match(styles, /id: "ascii-garden"[\s\S]*rollingSrc: null[\s\S]*flatSrc: null/);
  assert.match(styles, /id: "ascii-field-notes"[\s\S]*rollingSrc: null[\s\S]*flatSrc: null/);
  assert.match(styles, /DEFAULT_ALAMO_STYLE: AlamoStyle = "painterly-realism"/);
  assert.match(styles, /MEADOW_TREE_OPTIONS/);
  assert.match(styles, /label: "Soft illustration"/);
  assert.match(styles, /label: "ASCII Garden · live"/);
  assert.match(styles, /label: "Watercolor wash"/);
  assert.match(styles, /label: "Marker sketch"/);
  assert.match(styles, /label: "Clay model"/);
  assert.equal((styles.match(/rollingGroundOffset:/g) ?? []).length, 20);
  assert.equal((styles.match(/flatHorizon:/g) ?? []).length, 20);
  assert.equal((styles.match(/treeRootOffset:/g) ?? []).length, 20);
  for (const id of styleIds) {
    assert.match(styles, new RegExp(`id: "${id}"`));
    for (const asset of ["rolling", "flat", "tree"]) {
      assert.match(styles, new RegExp(`/alamo-styles/${id}/${asset}\\.png`));
      await access(new URL(`../public/alamo-styles/${id}/${asset}.png`, import.meta.url));
    }
  }

  assert.match(hero, /useState<AlamoStyle>\(DEFAULT_ALAMO_STYLE\)/);
  assert.match(hero, /useState<MeadowVariant>\("living"\)/);
  assert.match(hero, /const isStudioStatic = environmentStyle === "studio-static"/);
  assert.match(hero, /isStudioStatic \? null : isAsciiGarden/);
  assert.match(hero, /<Meadow[\s\S]*?<AlamoWeather onWindUpdate=\{setWind\} \/>[\s\S]*?<\/Meadow>/);
  assert.match(hero, /const visualStyle = isAsciiFieldNotes \? "ascii-garden" : environmentStyle/);
  assert.match(hero, /shell\.dataset\.environmentStyle = visualStyle/);
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
  assert.match(prototype, /aria-label="Meadow and tree art direction"/);
  assert.match(prototype, /MEADOW_TREE_OPTIONS\.map/);
  assert.match(prototype, /onVariantChange\("living"\)/);
  assert.match(prototype, /ALAMO_STYLES\.map/);
  assert.match(prototype, /Style and meadow shape are independent/);
  assert.match(prototype, /No meadow · no tree · no Philip · no miniature visitors/);
  assert.match(tree, /assetUrl: string/);
  assert.match(tree, /createCypressTree\(\{[\s\S]*assetUrl,/);
  assert.match(tree, /\}, \[assetUrl\]\)/);
  assert.match(css, /\.meadow__image--curated\s*\{[^}]*translate3d\(0, var\(--rolling-meadow-registration-y\), 0\)/);
  assert.match(css, /\.meadow__visual--flat\[data-style-mode="curated"\]\s*\{[^}]*height:\s*var\(--flat-meadow-height\)/);
  assert.match(css, /\.meadow__curated-flat-image\s*\{[^}]*translate3d\(-50%, var\(--flat-meadow-registration-y\), 0\)/);
  assert.match(css, /\.hero-meadow > \.cypress-tree \.cypress-tree__stage\s*\{[^}]*translate3d\(0, var\(--cypress-root-registration-y\), 0\)/);
  assert.match(css, /\.meadow-settings__scene-options\s*\{[^}]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /\.meadow-settings__scene-preview\s*\{[^}]*background-size:\s*auto 92%, cover/);
  assert.match(css, /html\[data-environment-style="studio-static"\] \.smiley-cursor/);
  assert.match(css, /html\[data-environment-style="studio-static"\] \.pranathi-intro--home\s*\{[\s\S]*?min-height:\s*auto/);
  assert.match(css, /html\[data-environment-style="studio-static"\] \.hero-inline-action\s*\{[\s\S]*?pointer-events:\s*none/);
});

test("keeps the visitor bike as an opt-in, locally saved prototype", async () => {
  const [hero, prototype, visitorBike, peloton, css] = await Promise.all([
    readFile(new URL("../app/hero-meadow.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/meadow-prototype-controls.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/visitor-bike.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/peloton/peloton-preview.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(hero, /visitorBikeEnabled/);
  assert.match(prototype, />Visitor bike</);
  assert.match(prototype, /onVisitorBikeEnabledChange/);
  assert.match(visitorBike, /neel-portfolio-visitor-bike/);
  for (const option of ["Aero", "Climbing", "Commuter", "Vintage", "Brompton", "Gravel", "Time trial", "Carbon disc", "Chunky gravel tires"]) {
    assert.match(visitorBike, new RegExp(option));
  }
  assert.match(visitorBike, /bikeName/);
  assert.match(visitorBike, /riderName/);
  assert.match(visitorBike, /Race Neel/);
  assert.match(hero, /visitorBikeRacing/);
  assert.match(peloton, />The Peloton</);
  assert.match(peloton, /local for now/);
  assert.match(css, /\.visitor-bike-layer/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.visitor-bike-ride/);
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
  assert.doesNotMatch(garden, /Math\.random|<img\b/);

  assert.match(hero, /useState<AsciiGardenTheme>\("light"\)/);
  assert.match(hero, /const isAsciiGarden = environmentStyle === "ascii-garden"/);
  assert.match(hero, /<AsciiGarden theme=\{asciiGardenTheme\} variant=\{meadowVariant\} \/>/);
  assert.match(hero, /previousAtmosphereRef\.current = atmosphere/);
  assert.match(hero, /data-ascii-garden-theme=\{isAsciiScene \? asciiGardenTheme : undefined\}/);
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

test("offers the full ASCII Garden reference as a live light and dark scene", async () => {
  const [fieldNotes, garden, hero, picker, smiley, css] = await Promise.all([
    readFile(new URL("../app/ascii-field-notes.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/ascii-garden.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/hero-meadow.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/meadow-prototype-controls.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/smiley-cursor.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(fieldNotes, /<AsciiGarden/);
  assert.match(fieldNotes, /live/);
  assert.match(fieldNotes, /theme=\{theme\}/);
  assert.match(fieldNotes, /wind=\{wind\}/);
  assert.doesNotMatch(fieldNotes, /Math\.random|<img\b|requestAnimationFrame/);

  assert.match(hero, /const isAsciiFieldNotes = environmentStyle === "ascii-field-notes"/);
  assert.match(hero, /const isAsciiScene = isAsciiGarden \|\| isAsciiFieldNotes/);
  assert.match(hero, /document\.documentElement\.dataset\.asciiGardenLive = "true"/);
  assert.match(hero, /<AsciiFieldNotes[\s\S]*?theme=\{asciiGardenTheme\}[\s\S]*?wind=\{wind\}[\s\S]*?<AlamoWeather onWindUpdate=\{setWind\} \/>/);
  assert.match(picker, /data-scene-preview=\{isFieldNotes \? "ascii-field-notes" : undefined\}/);
  assert.match(picker, /Dense authored glyphs · paired palettes · live wind and miniature actions/);
  assert.match(garden, /Math\.pow\(height, 1\.55\)/);
  assert.match(garden, /Math\.sin\(Math\.PI \* progress\)[\s\S]*?Math\.exp\(-1\.6 \* progress\)/);
  assert.match(garden, /FOLIAGE_EDGE_GLYPHS/);
  assert.match(garden, /window\.addEventListener\(PET_BLOW_CYPRESS_EVENT/);
  assert.match(garden, /const breeze = 4\.8 \+ \(wind\?\.breeze \?\? 0\.35\) \* 5\.2/);
  assert.match(garden, /\{!live \? \([\s\S]*?ascii-garden__sprite--cyclist[\s\S]*?ascii-garden__details[\s\S]*?\) : null\}/);
  assert.match(smiley, /actor: "\.cypress-tree__canvas, \.ascii-garden__tree"/);

  assert.match(css, /\.ascii-garden\[data-live="true"\] \.ascii-garden__tree/);
  assert.match(css, /@keyframes ascii-garden-tree-sway/);
  assert.match(css, /\.ascii-garden\[data-live="true"\] \.ascii-garden__ground/);
  assert.match(css, /\.ascii-garden\[data-live="true"\] > \.alamo-weather/);
  assert.match(css, /\.alamo-weather__ascii-primary/);
  assert.match(css, /\.site-shell\[data-environment-style="ascii-garden"\] \.pranathi-intro/);
  assert.match(css, /\.ascii-garden\[data-live="true"\] \.ascii-garden__underprint,[\s\S]*?\.ascii-garden\[data-live="true"\] \.ascii-garden__sprite[\s\S]*?display:\s*none/);
  assert.doesNotMatch(css, /html\[data-ascii-garden-live="true"\] \.smiley-cursor/);
  assert.match(css, /\.site-shell\[data-ascii-garden-live="true"\]\[data-ascii-garden-theme="light"\][\s\S]*?background-color:\s*#ffffff/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.ascii-garden\[data-live="true"\]/);
});

test("keeps the ASCII palette reversible without replacing the white default", async () => {
  const [layout, hero, theme, css, system] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/hero-meadow.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/portfolio-theme.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../docs/portfolio-system.md", import.meta.url), "utf8"),
  ]);

  assert.match(theme, /neel-portfolio-theme/);
  assert.match(theme, /window\.localStorage\.removeItem/);
  assert.match(theme, /document\.documentElement\.dataset\.portfolioTheme = "light"/);
  assert.match(layout, /suppressHydrationWarning/);
  assert.match(layout, /PORTFOLIO_THEME_BOOT_SCRIPT/);
  assert.doesNotMatch(hero, /window\.localStorage\.setItem/);
  assert.match(hero, /document\.documentElement\.dataset\.portfolioTheme = nextTheme/);
  assert.match(css, /html\[data-portfolio-theme="dark"\]\s*\{[\s\S]*?--paper:\s*#101412;/);
  assert.match(css, /html\[data-portfolio-theme="dark"\] \.site-shell/);
  assert.match(css, /html\[data-portfolio-theme="dark"\] \.case-study-shell\.case-story/);
  assert.match(css, /html\[data-portfolio-theme="dark"\][\s\S]*?\.play-tile/);
  assert.doesNotMatch(css, /\.site-shell\[data-environment-style="ascii-garden"\] \.pranathi-bio\s*\{[^}]*font-family/);
  assert.doesNotMatch(css, /\.site-shell\[data-environment-style="ascii-garden"\] \.site-header__wordmark,/);
  assert.match(system, /always loads in its white, painterly default/);
  assert.match(system, /must never become the saved default/);
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
  assert.match(philip, /isReady && isEnabled && !quietLayout \? <SmileyCursor \/>/);
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

test("uses an immersive case-study hero with a persistent chapter rail", async () => {
  const [page, css] = await Promise.all([
    readFile(new URL("../app/case-studies/[slug]/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(page, /className="case-story-hero"/);
  assert.match(page, /className="case-story-rail"/);
  assert.match(page, /aria-label="Case study chapters"/);
  assert.match(page, /className="case-story-content"/);
  assert.match(page, /className="case-story-team"/);
  assert.match(page, /className=\{`case-story-media/);
  assert.doesNotMatch(page, /SiteHeader|CaseStudyNav|case-brief-gallery|case-source-link/);
  assert.match(css, /Case studies: immersive opening/);
  assert.match(css, /\.case-story-layout\s*\{[\s\S]*?grid-template-columns:\s*200px minmax\(0, 800px\)/);
  assert.match(css, /\.case-story-rail\s*\{[\s\S]*?position:\s*sticky/);
  assert.match(css, /\.case-story-media__frame\s*\{/);
});

test("groups six featured projects into quiet Glean and Snap tiles", async () => {
  const [projects, projectCard, projectMockup, caseStudy, hero, prototype, css] = await Promise.all([
    readFile(new URL("../app/projects.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/project-card.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/project-mockup.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/case-studies/[slug]/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/hero-meadow.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/meadow-prototype-controls.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.equal((projects.match(/number: "\d{2}"/g) ?? []).length, 6);
  for (const title of [
    "Artifacts",
    "Growth",
    "Homepage redesign",
    "Proactive intelligence",
    "Treasure",
    "NFTs as Lenses",
  ]) {
    assert.match(projects, new RegExp(`title: "${title}"`));
  }
  assert.doesNotMatch(projects.split("const agentBrief")[0], /title: "Agent observability"|title: "Enterprise setup"/);
  assert.match(projectCard, /<ProjectMockup project=\{project\} \/>/);
  assert.match(projectCard, /className="project-card__info"/);
  assert.match(projectCard, /<h4>\{project\.title\}<\/h4>/);
  assert.match(projectCard, /project\.cardDescription/);
  assert.match(projectMockup, /project-mockup--placeholder/);
  assert.equal((projectMockup.match(/project-mockup--full-video/g) ?? []).length, 4);
  assert.equal((projectMockup.match(/project-work-video/g) ?? []).length, 4);
  assert.match(hero, /useState\(false\)[\s\S]*?dataset\.workGradients = workGradients \? "true" : "false"/);
  assert.match(hero, /portfolio:work-gradient-change/);
  assert.match(prototype, />Gradient videos</);
  assert.match(prototype, /aria-pressed=\{workGradients\}/);
  assert.match(prototype, /onWorkGradientsChange\(!workGradients\)/);
  assert.match(prototype, /Off is the default/);
  assert.match(hero, /useState\(false\)[\s\S]*?dataset\.projectSubtext = projectSubtext \? "true" : "false"/);
  assert.match(prototype, />Project subtext</);
  assert.match(prototype, /aria-pressed=\{projectSubtext\}/);
  assert.match(prototype, /onProjectSubtextChange\(!projectSubtext\)/);
  assert.match(prototype, /title-only by default/);
  assert.match(projectMockup, /document\.documentElement\.dataset\.workGradients === "true"/);
  assert.match(projectMockup, /"portfolio:work-gradient-change"/);
  for (const gradientVideo of [
    "homepage-gradient.mp4",
    "proactive-intelligence-gradient.mp4",
    "artifacts-gradient.mp4",
    "growth-gradient.mp4",
  ]) {
    assert.match(projectMockup, new RegExp(gradientVideo.replace(".", "\\.")));
  }
  assert.doesNotMatch(projectMockup, /project-placeholder__title|project-video-label/);
  assert.match(projectMockup, /function ProjectVideo/);
  assert.match(projectMockup, /new IntersectionObserver/);
  assert.match(projectMockup, /entry\?\.isIntersecting/);
  assert.match(projectMockup, /void video\.play\(\)\.catch/);
  assert.match(projectMockup, /video\.pause\(\)/);
  assert.match(projectMockup, /threshold:\s*0\.2/);
  assert.match(projectMockup, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(projectMockup, /\bautoPlay\b/);
  assert.match(projectMockup, /project\.slug === "homepage"/);
  assert.match(projectMockup, /<ProjectVideo[\s\S]*className="project-work-video homepage-work-video"/);
  assert.match(projectMockup, /"\/work\/homepage-ss\.mp4"/);
  assert.match(projects, /src: "\/work\/glean-homepage-redesign\.png"/);
  assert.match(projectMockup, /project\.slug === "growth"/);
  assert.match(projectMockup, /<ProjectVideo[\s\S]*className="project-work-video growth-work-video"/);
  assert.match(projectMockup, /"\/work\/onboarding-portfolio\.mp4"/);
  assert.match(projectMockup, /project\.slug === "artifacts"/);
  assert.match(projectMockup, /<ProjectVideo[\s\S]*className="project-work-video artifacts-work-image"/);
  assert.match(projectMockup, /"\/work\/artifacts-ss\.mp4"/);
  assert.match(projects, /src: "\/work\/glean-artifacts\.png"/);
  assert.match(projectMockup, /project\.slug === "psychic"/);
  assert.match(projectMockup, /<ProjectVideo[\s\S]*className="project-work-video proactive-work-video"/);
  assert.match(projectMockup, /"\/work\/proactive-intelligence\.mp4"/);
  assert.match(projects, /slug: "psychic",[\s\S]*src: "\/work\/work-02\.png"/);
  assert.match(projectMockup, /project\.category\.includes\("Snap"\)/);
  assert.match(projectMockup, /className="snap-work-image"/);
  assert.match(projectMockup, /src=\{project\.cover\.src\}/);
  assert.doesNotMatch(projectMockup, /project-card__label|project-card__title|project-card__caption|project-card__arrow|project-mockup__wash/);
  assert.match(projectCard, /id="work-group-glean"/);
  assert.match(projectCard, /id="work-group-snap"/);
  assert.match(projectCard, /"homepage",[\s\S]*"psychic",[\s\S]*"artifacts",[\s\S]*"growth"/);
  assert.doesNotMatch(projectCard, /gleanProjectOrder[\s\S]*"agent-observability"|gleanProjectOrder[\s\S]*"workspace-admin-console-actions"/);
  assert.match(projectCard, /gleanProjectOrder\.includes\(project\.slug/);
  for (const description of [
    "Updating the Glean homepage after 4 years",
    "Doing work before someone has to ask",
    "Creating content from chats",
    "How do you make Glean a habit?",
    "An AR experience to visualize your NFTs",
    "Bringing NFT ownership to Snapchat",
  ]) {
    assert.match(projects, new RegExp(description.replace(/[?]/g, "\\?")));
  }
  assert.match(projectCard, /project\.category\.includes\("Snap"\)/);
  assert.match(projectCard, /project\.externalUrl \?\? `\/case-studies\/\$\{project\.slug\}`/);
  assert.match(caseStudy, /case-story-rail/);
  assert.match(caseStudy, /case-story-media/);
  assert.match(caseStudy, /narrative\.artifacts/);
  assert.doesNotMatch(projects, /placeholderCaseStudy|Concept placeholder/);
  assert.match(hero, /useState<WorkGridColumns>\(2\)/);
  assert.match(hero, /useState<WorkHandoff>\("dissolve"\)/);
  assert.match(hero, /document\.documentElement\.dataset\.workColumns = String\(workGridColumns\)/);
  assert.match(hero, /document\.documentElement\.dataset\.workHandoff = workHandoff/);
  assert.match(prototype, /aria-label="Work grid columns"/);
  assert.match(prototype, /onWorkGridColumnsChange\(2\)/);
  assert.match(prototype, /onWorkGridColumnsChange\(3\)/);
  assert.match(prototype, /aria-label="Work section handoff style"/);
  assert.match(prototype, /"rising-tray"/);
  assert.match(prototype, /"soft-overlap"/);
  assert.match(prototype, /"compact"/);
  assert.match(css, /html\[data-work-columns="3"\] \.pranathi-project-grid/);
  assert.match(css, /html\[data-work-handoff="rising-tray"\] \.pranathi-work/);
  assert.match(css, /--portfolio-work-width:\s*1040px/);
  assert.match(css, /\.pranathi-work \{[\s\S]*?width:\s*min\(100% - 64px, var\(--portfolio-work-width\)\)/);
  assert.match(css, /\.hero-company--glean \.hero-company__mark \{[\s\S]*?background-image:\s*url\("\/work\/glean-logo\.png"\)/);
  assert.match(css, /\.hero-company--snap \.hero-company__mark \{[\s\S]*?background-image:\s*url\("\/work\/snap-logo\.png"\)/);
  assert.match(css, /\.work-group__brand \{[\s\S]*?font-size:\s*clamp\(16px, 1\.32vw, 19px\)/);
  assert.match(css, /\.work-group__brand \{[\s\S]*?font-family:\s*var\(--font-geist\)/);
  assert.match(css, /\.work-group__brand \{[\s\S]*?font-weight:\s*600/);
  assert.match(css, /\.work-group__brand \{[\s\S]*?margin:\s*0 0 clamp\(22px, 2vw, 28px\) 4px/);
  assert.match(css, /\.work-groups \{[\s\S]*?padding-bottom:\s*clamp\(88px, 10vw, 144px\)/);
  assert.match(css, /aspect-ratio:\s*1\.3/);
  assert.match(css, /\.pranathi-project-grid \.project-mockup--placeholder \{[\s\S]*?background:\s*#f2f2f2;/);
  assert.ok(
    css.lastIndexOf(".pranathi-project-grid .project-mockup.project-mockup--placeholder") >
      css.lastIndexOf(".pranathi-project-grid .project-mockup {\n  background: transparent;"),
    "the final placeholder rule must win over the generic transparent-card rule",
  );
  assert.doesNotMatch(css, /\.project-video-label|data-label-visible/);
  assert.match(css, /\.pranathi-project-grid \{[\s\S]*?column-gap:\s*clamp\(22px, 1\.8vw, 28px\);[\s\S]*?row-gap:\s*clamp\(50px, 5vw, 68px\)/);
  assert.match(css, /\.project-card__info \{[\s\S]*?padding:\s*18px 4px 0[\s\S]*?font-family:\s*var\(--font-geist\)/);
  assert.match(css, /\.project-card__info h4 \{[\s\S]*?font-size:\s*clamp\(15px, 1\.05vw, 17px\)[\s\S]*?font-weight:\s*600/);
  assert.match(css, /\.project-card__info p \{[\s\S]*?display:\s*none;[\s\S]*?color:\s*var\(--muted\)[\s\S]*?font-size:\s*clamp\(12px, 0\.82vw, 14px\)/);
  assert.match(css, /html\[data-project-subtext="true"\] \.project-card__info p \{[\s\S]*?display:\s*block/);
  assert.match(css, /grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /Final hover behavior for work tiles: lift the full-bleed video tiles/);
  assert.match(css, /\.pranathi-project-grid \.project-card \.project-mockup \{[^}]*box-shadow:\s*none;[^}]*transform:\s*none;/);
  assert.match(css, /\.pranathi-project-grid \.project-mockup\.project-mockup--full-video \{[\s\S]*?padding:\s*0;[\s\S]*?overflow:\s*hidden;/);
  assert.match(css, /Small interface details:[\s\S]*?text-wrap:\s*balance;[\s\S]*?text-wrap:\s*pretty;/);
  assert.match(css, /\.pranathi-project-grid \.project-mockup\.project-mockup--full-video \{[\s\S]*?outline:\s*1px solid rgba\(36, 35, 33, 0\.08\);[\s\S]*?outline-offset:\s*-1px;[\s\S]*?filter:\s*none;[\s\S]*?box-shadow:/);
  assert.match(css, /Small interface details:[\s\S]*?@media \(hover: hover\) and \(pointer: fine\) \{[\s\S]*?\.project-card:hover \.project-mockup--full-video \{[\s\S]*?box-shadow:/);
  assert.match(css, /\.pranathi-project-grid \.project-mockup\.project-mockup--full-video \{[\s\S]*?transition:\s*transform 180ms var\(--motion-ease-out\)/);
  assert.match(css, /@media \(hover: hover\) and \(pointer: fine\)[\s\S]*?\.pranathi-project-grid \.project-card:hover \.project-mockup--full-video \{[\s\S]*?transform:\s*translateY\(-4px\)/);
  assert.doesNotMatch(css, /html\[data-portfolio-theme="dark"\] \.pranathi-project-grid \.project-card:hover \.project-mockup/);
  assert.match(css, /\.project-work-video \{[\s\S]*?width:\s*100%[\s\S]*?height:\s*100%[\s\S]*?border-radius:\s*inherit[\s\S]*?object-fit:\s*cover/);
  assert.match(css, /\.project-card:hover \.project-mockup--full-video \{[\s\S]*?transform:\s*translateY\(-4px\)/);
  assert.doesNotMatch(css, /\.project-card:hover \.homepage-work-video/);
  assert.doesNotMatch(css, /html\[data-portfolio-theme="dark"\] \.pranathi-project-grid \.project-mockup/);
  assert.match(css, /\.snap-work-image \{[\s\S]*?max-width:\s*min\(78%, 400px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.project-card:hover \.project-mockup--full-video,[\s\S]*?transform:\s*none/);
  assert.doesNotMatch(css, /homepage-before-after|homepage-work-image--before/);
  assert.doesNotMatch(css, /project-mockup__wash|project-card__caption|project-card__arrow|project-video-label/);
});

test("documents the portfolio's durable design and change contract", async () => {
  const [agentContract, designDoc, systemDoc] = await Promise.all([
    readFile(new URL("../AGENTS.md", import.meta.url), "utf8"),
    readFile(new URL("../design.md", import.meta.url), "utf8"),
    readFile(new URL("../docs/portfolio-system.md", import.meta.url), "utf8"),
  ]);

  assert.match(agentContract, /Prefer the smallest complete change/);
  assert.match(agentContract, /inline editorial sequence/);
  assert.match(agentContract, /sticky project rail tracks the section in view/);
  assert.match(agentContract, /homepage shows five major sections/);
  assert.match(agentContract, /use black rectangles/);
  assert.match(agentContract, /inspect the final matching rule/);
  assert.match(agentContract, /continuity of Torph/);
  assert.match(systemDoc, /continuity when text changes state/);
  assert.match(designDoc, /Balance short display titles and use pretty wrapping/);
  assert.match(designDoc, /Keep nested radii concentric/);
  assert.match(designDoc, /Use interruptible CSS transitions/);
  assert.match(designDoc, /Quiet on arrival\. Playful on discovery\. Simple everywhere\./);
  assert.match(designDoc, /Treat Alamo Square as a place, not a theme park/);
  assert.match(designDoc, /Never collapse a placeholder into a title floating in empty page space/);
  assert.match(systemDoc, /Prototype settings are exploratory state/);
  assert.match(systemDoc, /Gradient videos experiment[\s\S]*always off on load/);
  assert.match(systemDoc, /Project descriptions remain in the page but are hidden by default/);
  assert.match(systemDoc, /Pointer speed alone is not a state transition/);
  assert.match(systemDoc, /placeholder tile visibility and cascade precedence/);
});

test("uses only the standard Cuelume Declarative profile on every action", async () => {
  const [layout, soundscape, ...interactionSources] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/soundscape.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/site-header.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/project-card.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/case-study-carousel.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/case-study-media.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/philip-toggle.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/meadow-prototype-controls.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/bike-ride.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/photo-drop.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/backpack-walk.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(layout, /<Soundscape \/>/);
  assert.match(soundscape, /bind\(\)/);
  assert.match(soundscape, /addDeclarativeInteractionCues\(document\)/);
  assert.match(soundscape, /element\.dataset\.cuelumeHover = "tick"/);
  assert.match(soundscape, /delete element\.dataset\.cuelumeToggle/);
  assert.match(soundscape, /element\.dataset\.cuelumeAutomaticHover = "true"/);
  assert.match(soundscape, /element\.dataset\.cuelumeAutomaticClick = "true"/);
  assert.match(soundscape, /element\.dataset\.cuelumePress = "press"/);
  assert.match(soundscape, /element\.dataset\.cuelumeRelease = "release"/);
  assert.match(soundscape, /new MutationObserver/);
  assert.match(soundscape, /playWindSound/);
  assert.match(soundscape, /meadow-wind-leaves\.mp3/);
  assert.doesNotMatch(soundscape, /createOscillator|Math.random/);
  assert.doesNotMatch(soundscape, /createOscillator|174|261/);
  assert.match(soundscape, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(soundscape, /addEventListener\("pointerdown", startEntranceSound, \{ once: true/);
  assert.doesNotMatch(interactionSources.join("\n"), /data-cuelume-toggle=/);
  assert.doesNotMatch(interactionSources.join("\n"), /data-cuelume-hover="(?!tick")/);
  assert.doesNotMatch(interactionSources.join("\n"), /data-cuelume-press="(?!press")/);
  assert.doesNotMatch(interactionSources.join("\n"), /data-cuelume-release="(?!release")/);
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
  assert.match(weather, /return "Slight breeze"/);
  assert.match(weather, /describeAlamoWind\(conditions\)/);
  assert.match(weather, /\$\{describeAlamoWind\(conditions\)\} at Alamo Square right now/);
  assert.match(weather, /alamo-weather__ridge/);
  assert.match(weather, /<textPath href=\{`#\$\{ridgePathId\}`\}/);
  assert.match(weather, /M 5 43 C 76 42, 178 31, 275 12/);
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
  assert.match(meadow, /<MeadowGrass wind=\{wind\}/);
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
  assert.match(hero, /window\.location\.hash === "#work"/);
  assert.match(hero, /if \(initialWorkEntryRef\.current\)[\s\S]*?if \(scrollY >= transitionEnd\) return 1;/);
  assert.match(hero, /targetProgress = initialWorkEntryRef\.current \? 1 : calculateTarget\(\)/);
  assert.match(hero, /const \[isSceneVisible, setIsSceneVisible\] = useState\(!initialWorkEntry\)/);
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
  assert.match(hero, /document\.documentElement\.dataset\.meadowPresent =/);
  assert.match(hero, /!isStudioStatic && dissolveProgress < 0\.95 \? "true" : "false"/);
  assert.match(css, /html:not\(\[data-meadow-present="true"\]\) \.smiley-cursor\s*\{[^}]*display:\s*none !important;[^}]*visibility:\s*hidden;[^}]*opacity:\s*0 !important;/);
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
  assert.match(tree, /WELCOME_BREEZE_DELAY = 500/);
  assert.match(tree, /STRONG_AMBIENT_WIND_THRESHOLD = 0\.58/);
  assert.match(tree, /WELCOME_BREEZE_STRENGTH = 0\.78/);
  assert.match(tree, /Math\.max\(currentWind\.breeze, currentWind\.gust \* 0\.72\)/);
  assert.match(tree, /ambientWind >= STRONG_AMBIENT_WIND_THRESHOLD/);
  assert.match(tree, /window\.dispatchEvent\(new CustomEvent\(MEADOW_GUST_EVENT/);
  assert.match(tree, /treePosition \* WELCOME_TRAVEL_MS/);
  assert.doesNotMatch(tree, /cypress-tree__ground-shadow/);
  assert.doesNotMatch(tree, /cypress-tree__controls|useState/);
  assert.doesNotMatch(tree, /cypress-tree__root-transition/);
  assert.doesNotMatch(tree, /cypress-tree__root-bank/);
  assert.match(treeRenderer, /const petGust = \{ direction: 1, strength: 0/);
  assert.match(treeRenderer, /const gustEnvelope =/);
  assert.match(treeRenderer, /const petDrive = petGust\.direction/);
  assert.match(treeRenderer, /const dynamicMaxAngle = bone\.maxAngle/);
  assert.match(treeRenderer, /const naturalDirection = Number\.isFinite\(wind\.direction\)/);
  assert.match(treeRenderer, /const sharedFlow = sampleMeadowWind/);
  assert.match(treeRenderer, /const petLeafPush = petGust\.direction/);
  assert.match(treeRenderer, /function applyGust\(values\)/);
  assert.match(treeRenderer, /running && !reducedMotion\.matches/);
  assert.match(layerHost, /document\.querySelector<HTMLElement>\("\.hero-meadow"\)/);
  assert.match(layerHost, /window\.requestAnimationFrame/);
  assert.match(bike, /const FRAME_URLS = \[/);
  assert.match(bike, /data-cuelume-hover="tick"/);
  assert.match(bike, /data-cuelume-press="press"/);
  assert.match(bike, /data-cuelume-release="release"/);
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
  assert.match(photographer, /data-cuelume-hover="tick"/);
  assert.match(photographer, /data-cuelume-press="press"/);
  assert.match(photographer, /data-cuelume-release="release"/);
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
  assert.match(photographer, /x = clamp\(buttonBounds\.left \+ buttonBounds\.width \* 0\.5 - layerBounds\.left/);
  assert.match(photographer, /function placeOnMeadow\(\)[\s\S]*?setPhase\("shoot"\);[\s\S]*?renderPhotographer\(\);/);
  assert.match(photographer, /resizeObserver\.observe\(layer\);[\s\S]*placeOnMeadow\(\);/);
  assert.match(photographer, /setPhase\("shoot"\);[\s\S]*renderPhotographer\(\);[\s\S]*runPhotoStep\(\);/);
  assert.doesNotMatch(photographer, /reducedTimer = window\.setTimeout\(\(\) => setPhase\("idle"\)/);
  assert.match(backpacker, /const FRAME_URLS = \[/);
  assert.match(backpacker, /data-cuelume-hover="tick"/);
  assert.match(backpacker, /data-cuelume-press="press"/);
  assert.match(backpacker, /data-cuelume-release="release"/);
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
  assert.match(smiley, /document\.querySelector<HTMLElement>\("\.hero-copy__free-time"\)/);
  assert.match(smiley, /if \(!hasPointerPosition && freeTimeLabel\)/);
  assert.match(smiley, /event\.clientY <= freeTimeBounds\.bottom/);
  assert.doesNotMatch(smiley, /heroSection|getBoundingClientRect\(\)\.bottom <= 0/);
  assert.match(smiley, /root\.dataset\.meadowPresent !== "true"/);
  assert.match(smiley, /new MutationObserver\(handleMeadowPresenceChange\)/);
  assert.match(smiley, /attributeFilter: \["data-meadow-present"\]/);
  assert.match(smiley, /meadowPresenceObserver\.disconnect\(\)/);
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
  assert.match(smiley, /cypress: \{ layer: '\.hero-meadow\[data-scene-visible="true"\]', actor: "\.cypress-tree__canvas, \.ascii-garden__tree" \}/);
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
  assert.doesNotMatch(smiley, /motionLevel|wantsToBlow|const isActive/);
  assert.match(smiley, /cursor\.dataset\.state = "idle";\s*cursor\.dataset\.wind = "off";/);
  assert.match(smiley, /stopIdleMischief\(\)/);
  assert.match(css, /\.meadow__grass-canvas\s*\{[^}]*pointer-events: none/);
  assert.match(css, /\.meadow__visual--flat\s*\{/);
  assert.match(css, /--flat-meadow-color:\s*#6f8d45/);
  assert.match(css, /--flat-meadow-height:\s*clamp\(86px, 11svh, 122px\)/);
  assert.match(css, /--cypress-viewport-lift:\s*clamp\(0px, calc\(20vw - 288px\), 132px\)/);
  assert.match(css, /--cypress-display-width:\s*clamp\(240px, 22vw, 322px\)/);
  assert.match(css, /@media \(min-width: 1800px\) and \(min-height: 900px\)\s*\{[\s\S]*?--cypress-display-width:\s*min\(20vw, 46svh\)/);
  assert.match(css, /\.cypress-tree\s*\{[^}]*width:\s*var\(--cypress-display-width\)/);
  assert.match(css, /transform:\s*translateX\(-50%\) scaleY\(var\(--living-meadow-scale-y\)\)/);
  assert.match(css, /transform:\s*scaleY\(var\(--meadow-height-scale\)\)/);
  assert.match(css, /\.meadow-settings__height input\s*\{/);
  assert.doesNotMatch(css, /\.meadow__flat-image\s*\{[^}]*mix-blend-mode:\s*luminosity/);
  assert.match(css, /\.meadow__flat-tint\s*\{[^}]*opacity:\s*0\.22/);
  assert.match(css, /\.meadow-settings__texture-options\s*\{/);
  assert.match(css, /\.meadow__flat-tint\s*\{[^}]*background:\s*var\(--flat-meadow-color\)/);
  assert.match(css, /\.meadow-settings\s*\{/);
  assert.match(css, /\.meadow-settings__modes button\[aria-pressed="true"\]/);
  assert.match(css, /\.alamo-weather\s*\{[^}]*right:\s*calc\(\(var\(--meadow-render-width\) - 100vw\) \/ 2/);
  assert.match(css, /\.alamo-weather\s*\{[^}]*bottom:\s*17%/);
  assert.match(css, /\[data-environment-style="painterly-realism"\] \.alamo-weather\s*\{[^}]*bottom: 22px;[^}]*height: auto;[^}]*color: rgb\(255 255 255 \/ 92%\);[^}]*text-align: right;/);
  assert.match(weather, /return "Slight breeze"/);
  assert.match(css, /\.alamo-weather__primary\s*\{[^}]*font-size:\s*12px/);
  assert.match(meadow, /children\?: ReactNode/);
  assert.match(hero, /<AlamoWeather onWindUpdate=\{setWind\} \/>/);
  assert.match(css, /\.hero-meadow > \.cypress-tree\s*\{[^}]*z-index:\s*auto;[^}]*contain:\s*none;/);
  assert.match(css, /--cypress-root-overlap:\s*clamp\(38px, 2\.5vw, 52px\)/);
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
  assert.match(css, /\.pranathi-name\s*\{[^}]*font-size:\s*36px/);
  assert.match(css, /\.pranathi-bio\s*\{[^}]*font-size:\s*20px/);
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
  assert.match(css, /html:not\(\[data-meadow-present="true"\]\) \.smiley-cursor \{[\s\S]*?display:\s*none !important;[\s\S]*?opacity:\s*0 !important/);
});


test("shared terrain wind is calm at zero, directional, and stronger in gusts", async () => {
  const ts = await import("typescript");
  const source = await readFile(new URL("../app/wind.ts", import.meta.url), "utf8");
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
  const { sampleMeadowWind, INITIAL_WIND } = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
  for (let t = 0; t < 30; t += 0.25) {
    assert.equal(sampleMeadowWind(t, 0.5, { ...INITIAL_WIND, breeze: 0, gust: 0 }), 0);
    assert.ok(sampleMeadowWind(t, 0.5, { ...INITIAL_WIND, direction: 1 }) >= 0);
    assert.ok(sampleMeadowWind(t, 0.5, { ...INITIAL_WIND, direction: -1 }) <= 0);
    assert.ok(sampleMeadowWind(t, 0.5, { ...INITIAL_WIND, gust: 1 }) >= sampleMeadowWind(t, 0.5, { ...INITIAL_WIND, gust: 0 }));
  }
});


test("grass meadow replaces its reference and keeps the image-only picker alternative", async () => {
  const [hero, meadow, grass, controls, css] = await Promise.all([
    "hero-meadow.tsx", "meadow.tsx", "meadow-grass.tsx", "meadow-prototype-controls.tsx", "globals.css",
  ].map((file) => readFile(new URL(`../app/${file}`, import.meta.url), "utf8")));
  assert.match(hero, /const \[grassEnabled, setGrassEnabled\] = useState\(true\)/);
  assert.match(meadow, /grassEnabled && environmentStyle.id === "painterly-realism"/);
  assert.match(controls, /aria-label="Grass meadow"[\s\S]*?aria-pressed=\{grassEnabled\}[\s\S]*?onGrassEnabledChange\(!grassEnabled\)/);
  assert.match(grass, /surface.dataset.grassReady = "true"/);
  assert.match(grass, /delete surface.dataset.grassReady/);
  assert.doesNotMatch(grass, /ctx\.drawImage\(source/);
  assert.match(css, /\.meadow__visual\[data-grass-ready="true"\] > \.meadow__image\s*\{[^}]*visibility: hidden/);
});


test("arrival breeze travels and character pressure recovers without disturbing distant grass", async () => {
  const ts = await import("typescript");
  const source = await readFile(new URL("../app/grass-interaction.ts", import.meta.url), "utf8");
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
  const { arrivalGrassWind, grassPressure } = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
  const gust = { startedAt: 1000, origin: 0, direction: 1, strength: 0.78, duration: 1450 };
  assert.ok(arrivalGrassWind(1500, 0, gust) > 0);
  assert.equal(arrivalGrassWind(1500, 0.8, gust), 0);
  assert.ok(arrivalGrassWind(4100, 0.8, gust) > 0);
  assert.equal(arrivalGrassWind(7000, 1, gust), 0);
  const footprints = [{ x: 100, y: 100, radius: 16, at: 1000, direction: -1 }];
  assert.equal(grassPressure(100, 100, 1000, footprints).pressure, 1);
  assert.equal(grassPressure(100, 100, 1950, footprints).pressure, 0.5);
  assert.equal(grassPressure(100, 100, 2900, footprints).pressure, 0);
  assert.equal(grassPressure(130, 100, 1000, footprints).pressure, 0);
  assert.equal(grassPressure(100, 100, 1000, footprints).direction, -1);
  assert.equal(grassPressure(100, 100, 1000, [{ ...footprints[0], strength: 0.34 }]).pressure, 0.34);
  const grass = await readFile(new URL("../app/meadow-grass.tsx", import.meta.url), "utf8");
  assert.match(grass, /isBike \? 0\.28 : isHiker \? 0\.16/);
  assert.match(grass, /const strength = isBike \? 0\.34 : isHiker \? 0\.28 : 1/);
  assert.match(grass, /elasticWind\(blade\.x\) \* blade\.crestFlex \+ arrivalGrassWind\(now, blade\.x \/ width, gust\) \* 0\.82/);
  assert.match(grass, /elasticWind\(blade\.x\) \+ arrivalGrassWind\(now, blade\.x \/ width, gust\) \* 0\.82/);
});


test("cursor gently brushes nearby grass without making Philip blow", async () => {
  const ts = await import("typescript");
  const source = await readFile(new URL("../app/grass-interaction.ts", import.meta.url), "utf8");
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
  const { cursorGrassBend } = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
  const brush = { x: 100, y: 100, direction: 1, strength: 1 };
  assert.ok(cursorGrassBend(100, 100, brush) <= 1.2);
  assert.equal(cursorGrassBend(100, 100, { ...brush, direction: -1 }), -cursorGrassBend(100, 100, brush));
  assert.equal(cursorGrassBend(260, 100, brush), 0);
  assert.equal(cursorGrassBend(100, 200, brush), 0);
  assert.equal(cursorGrassBend(100, 100, null), 0);
  const pet = await readFile(new URL("../app/smiley-cursor.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(pet, /GRASS_PRESENCE_EVENT|grassActive/);
  assert.match(pet, /updateMiniatureInteraction\(timestamp\)/);
  const grass = await readFile(new URL("../app/meadow-grass.tsx", import.meta.url), "utf8");
  assert.match(grass, /point.y >= \(ridge/);
  assert.match(grass, /paintGround\(ctx, blade, pressure, direction, flow\)/);
  assert.match(grass, /backpack-walk-layer:is/);
  assert.match(grass, /bike-ride-layer:is/);
  assert.match(source, /const dx = \(x - brush\.x\) \/ 128/);
  assert.match(source, /const dy = \(y - brush\.y\) \/ 88/);
  assert.match(source, /Math\.sin\(now \/ 125/);
});


test("miniature feet and bike tires sit slightly inside the grass roots", async () => {
  for (const file of ["bike-ride.tsx", "photo-drop.tsx", "backpack-walk.tsx"]) {
    const source = await readFile(new URL(`../app/${file}`, import.meta.url), "utf8");
    assert.match(source, /const grassInset = meadow.dataset.grassReady === "true" \? 4 : 0/);
    assert.match(source, /surface \* meadowBounds.height - layerBounds.top \+ grassInset/);
  }
});


test("the welcome tree receives the passing breeze and leans with its screen direction", async () => {
  const tree = await readFile(new URL("../app/cypress-tree.tsx", import.meta.url), "utf8");
  const renderer = await readFile(new URL("../app/cypress-tree-renderer.ts", import.meta.url), "utf8");
  assert.match(tree, /startedAt: performance.now\(\), origin: 0,[\s\S]*?direction: 1/);
  assert.match(tree, /treeArrivalTimer = window.setTimeout/);
  assert.match(tree, /treePosition \* WELCOME_TRAVEL_MS/);
  assert.match(tree, /window.clearTimeout\(treeArrivalTimer\)/);
  assert.match(renderer, /float s = sin\(-angle\)/);
});


test("grass contact redraws preserve cache scale, whole-pixel edges, and paint order", async () => {
  const grass = await readFile(new URL("../app/meadow-grass.tsx", import.meta.url), "utf8");
  assert.match(grass, /ctx.setTransform\(1, 0, 0, 1, 0, 0\);[\s\S]*?ctx.drawImage\(undergrowth, 0, 0\)/);
  assert.match(grass, /Math.floor\(patch.x \* pixelScale\) \/ pixelScale/);
  assert.match(grass, /Math.ceil\(\(patch.x \+ patch.w\) \* pixelScale\) \/ pixelScale/);
  assert.match(grass, /\[\.\.\.rows\].sort\(\(a, b\) => a - b\)/);
});

test("fine cypress articulation keeps foliage continuous and child flex bounded", async () => {
  const renderer = await readFile(new URL("../app/cypress-tree-renderer.ts", import.meta.url), "utf8");
  assert.match(renderer, /LEAF_GRID_X = 32/);
  assert.match(renderer, /LEAF_GRID_Y = 24/);
  assert.match(renderer, /u_bone_angles\[16\]/);
  assert.match(renderer, /maxAngle: 0\.065, inherit: 0\.92/);
  assert.match(renderer, /vec2 leaf_cell = v_uv;/);
  assert.doesNotMatch(renderer, /gl\.NEAREST|weights\[dominant\]/);
  assert.match(renderer, /const stride = \(4 \+ bones.length\) \* 4/);
});

test("Life has eleven captioned prints with the shared click-to-open viewer", async () => {
  const gallery = await readFile(new URL("../app/about/about-photo-gallery.tsx", import.meta.url), "utf8");
  assert.equal((gallery.match(/id: "/g) ?? []).length, 11);
  assert.match(gallery, /Recents from life/);
  assert.match(gallery, /<figure/);
  assert.match(gallery, /<figcaption/);
  assert.match(gallery, /usePhotoViewer/);
  assert.match(gallery, /frame: "film"/);
  assert.match(gallery, /captionLines/);
  const quest = await readFile(new URL("../app/about/quest-image.tsx", import.meta.url), "utf8");
  assert.match(quest, /usePhotoViewer/);
  assert.match(quest, /aria-haspopup="dialog"/);
  for (const caption of ["Sunset in Kyoto", "My first road race", "Cathedral lakes", "The spirit of gravel?"]) {
    assert.ok(gallery.includes(caption));
  }
  const photography = await readFile(new URL("../app/photography/photography-gallery.tsx", import.meta.url), "utf8");
  assert.match(photography, /usePhotoViewer/);
});

test("the cypress grounds into both grass layers without a cutout halo", async () => {
  const grass = await readFile(new URL("../app/meadow-grass.tsx", import.meta.url), "utf8");
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(grass, /tree.left \+ tree.width \* 0.5 - bounds.left/);
  assert.match(grass, /const depth = \(y - groundAt\(x\)\) \/ shadeDepth/);
  assert.match(grass, /tree.width \* height \/ bounds.height/);
  assert.match(grass, /color: grassColor\(p, light, rootX, rootY\)/);
  assert.match(grass, /color: grassColor\(p, light, x \* width, y \* height, 0.78\)/);
  assert.match(css, /\[data-environment-style="painterly-realism"\] \.cypress-tree__canvas\s*\{\s*filter: none;/);
});

test("elastic grass shares spring motion and feathers the moving crest into cached turf", async () => {
  const grass = await readFile(new URL("../app/meadow-grass.tsx", import.meta.url), "utf8");
  assert.match(grass, /windSprings = Array.from\(\{ length: 65 \}/);
  assert.match(grass, /spring.velocity \+=/);
  assert.match(grass, /elasticWind\(blade.x\) \* crestFlex/);
  assert.match(grass, /1 - terrainDepth \/ 22/);
  assert.match(grass, /lastWindFrame = 0/);
});

test("quiet sidebar is opt-in and keeps character selection exclusive", async () => {
  const hero = await readFile(new URL("../app/hero-meadow.tsx", import.meta.url), "utf8");
  assert.match(hero, /useState<"classic" \| "quiet">\("classic"\)/);
  assert.match(hero, /portfolio:solo-actor/);
  for (const file of ["bike-ride", "photo-drop", "backpack-walk"]) {
    const actor = await readFile(new URL(`../app/${file}.tsx`, import.meta.url), "utf8");
    assert.match(actor, /removeEventListener\("portfolio:solo-actor", handleSoloActor\)/);
    assert.match(actor, /window.cancelAnimationFrame\(frameHandle\)/);
  }
});

 test("quiet variation matches the original introduction reading size", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  const quiet = css.slice(css.indexOf("/* An opt-in composition study;"));
  assert.match(quiet, /\.home-portfolio \.quiet-sidebar \{[^}]*font-size: 20px; line-height: 1/);
  assert.match(quiet, /font-size: clamp\(16px, 1.32vw, 19px\)/);
});


test("grass separates cached turf from display-synced tips without rebuilding on playback", async () => {
  const grass = await readFile(new URL("../app/meadow-grass.tsx", import.meta.url), "utf8");
  assert.match(grass, /data-grass-tips/);
  assert.match(grass, /for \(const blade of crestBlades\)/);
  assert.match(grass, /previousPatches = patches/);
  assert.match(grass, /groundCells/);
  assert.match(grass, /a.order - b.order/);
  assert.doesNotMatch(grass, /now - last >= 32/);
  assert.doesNotMatch(grass, /\}, \[src, isPlaying\]\)/);
});


test("default homepage uses the shared header and meadow weather while keeping its introduction", async () => {
  const [page, hero, css] = await Promise.all(["page.tsx", "hero-meadow.tsx", "globals.css"].map(file => readFile(new URL(`../app/${file}`, import.meta.url), "utf8")));
  assert.match(page, /<SiteHeader current="work" \/>/);
  assert.doesNotMatch(page, /quiet-sidebar/);
  assert.match(page, /pranathi-name/);
  assert.match(css, /\.pranathi-name\s*\{[\s\S]*?font-style:\s*italic/);
  assert.match(hero, /layout === "quiet" && weatherHost[\s\S]*createPortal/);
  assert.match(css, /\.quiet-sidebar \{ display: none; \}/);
});

test("weather summary and details stay smaller than navigation", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /\.quiet-weather \.alamo-weather__ascii-primary \{ font-size: clamp\(12px, 0\.9vw, 14px\)/);
  assert.match(css, /\.quiet-weather \.alamo-weather__secondary \{ font-size: clamp\(11px, 0\.8vw, 12px\)/);
});


test("homepage presents five inline projects with black placeholders and anchor navigation", async () => {
  const html = await (await render()).text();
  const sections = ["psychic", "homepage", "artifacts", "growth", "snap"];
  let previous = -1;
  for (const slug of sections) {
    const position = html.indexOf(`id="work-${slug}"`);
    assert.ok(position > previous, `${slug} follows the previous section`);
    previous = position;
    assert.ok(html.includes(`href="#work-${slug}"`));
  }
  assert.equal((html.match(/class="work-feature__placeholder"/g) ?? []).length, 2);
  assert.equal((html.match(/class="work-feature__media work-feature__media--split(?: |")/g) ?? []).length, 3);
  assert.doesNotMatch(html, /href="\/case-studies\//);
  assert.doesNotMatch(html, /class="project-work-video/);
});

test("Homepage redesign shows the cropped video inside a rounded shadowed tile", async () => {
  const html = await (await render()).text();
  const section = html.split('id="work-homepage"')[1].split("</section>")[0];
  assert.match(section, /homepage-final.mp4/);
  assert.match(section, /homepage-final-poster.jpg/);
  assert.match(section, /loop="" muted="" playsInline=""/);
  assert.equal((section.match(/work-feature__placeholder/g) ?? []).length, 2);
  const css = await readFile(new URL("../app/homepage-video.module.css", import.meta.url), "utf8");
  assert.match(css, /border-radius: 12px/);
  assert.match(css, /box-shadow:/);
  assert.match(css, /background: #ececec/);
});

test("Artifacts shows the supplied document, AI edit bar, and stacked app drafts", async () => {
  const html = await (await render()).text();
  const section = html.split('id="work-artifacts"')[1].split("</section>")[0];
  for (const asset of ["document.png", "edit-with-ai.png", "gmail-skin.png", "slack-skin.png", "outlook-skin.png"]) {
    assert.ok(section.includes("/work/artifacts/" + asset));
  }
  assert.equal((section.match(/data-artifact-panel=/g) ?? []).length, 3);
  assert.doesNotMatch(section, /work-feature__placeholder|assets coming soon/);
  assert.match(section, /id="work-artifacts-title">Glean Artifacts<\/h3>/);
  assert.match(section, /I led design for Artifacts, helping Glean expand from answering questions to helping people create finished work/);
});

test("artifact skins include reading holds and suspend when not visible", async () => {
  const source = await readFile(new URL("../app/artifact-skins.tsx", import.meta.url), "utf8");
  assert.match(source, /duration: 15000/);
  assert.match(source, /add\(1\.5, depth === 0 \? focused/);
  assert.match(source, /add\(3\.8, depth === 0 \? focused/);
  assert.match(source, /const focused = "translate\(-50%, 7cqw\) scale\(1\)"/);
  assert.doesNotMatch(source, /const bottom|const revealed/);
  assert.match(source, /IntersectionObserver/);
  assert.match(source, /visibilitychange/);
  assert.match(source, /prefers-reduced-motion/);
  assert.match(source, /animation.cancel\(\)/);
});

test("dark work tiles are an opt-in, work-only prototype", async () => {
  const html = await (await render()).text();
  assert.match(html, /data-dark-tiles="false"/);
  const source = await readFile(new URL("../app/work-tile-prototype.tsx", import.meta.url), "utf8");
  const css = await readFile(new URL("../app/work-tile-prototype.module.css", import.meta.url), "utf8");
  assert.match(source, /let dark = false/);
  assert.match(source, /aria-label="Dark work tiles" aria-pressed={enabled}/);
  assert.doesNotMatch(source, /localStorage|sessionStorage/);
  assert.match(css, /work-feature__media\) > \*/);
  assert.match(css, /#work-snap/);
  assert.match(css, /background: #1c1c1c/);
  assert.match(css, /work-feature__checklist/);
  assert.match(css, /color: #c9c9c6/);
});

test("Proactive Intelligence pairs popup artwork with the larger default Rolodex", async () => {
  const html = await (await render()).text();
  const psychic = html.split('id="work-psychic"')[1].split("</section>")[0];
  assert.match(psychic, /class="work-feature__popups"/);
  assert.match(psychic, /src="\/work\/psychic-popups-shadow.png"/);
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /\.work-feature__popups img \{[^}]*width: 86%/);
  assert.equal((psychic.match(/class="work-feature__placeholder"/g) ?? []).length, 0);
  assert.match(psychic, /data-mode="rolodex"/);
  assert.doesNotMatch(psychic, /Pause proactive card animation/);
  const motion = await readFile(new URL("../app/psychic-cards.tsx", import.meta.url), "utf8");
  assert.match(motion, /\["wheel", "rolodex", "grid"\]/);
  assert.match(motion, /visible && !reduced/);
  const wheelTransform = motion.split('const transform = mode === "wheel"')[1].split('\n        return')[0];
  assert.doesNotMatch(wheelTransform.split('\n          :')[0], /rotateX|perspective|scale\(/);
  assert.match(wheelTransform.split('\n          :')[1], /offset \* 16\.35/);
  assert.match(wheelTransform.split('\n          :')[1], /perspective\(600px\) rotateX/);
  assert.match(wheelTransform.split('\n          :')[1], /-offset \* 12/);
  const cardCss = await readFile(new URL("../app/psychic-cards.module.css", import.meta.url), "utf8");
  assert.match(cardCss, /\[data-mode="rolodex"\] \.card \{\s*width: 80%;\s*height: auto;/);
  assert.match(motion, /let mode: Mode = "rolodex"/);
  assert.match(motion, /const serverSnapshot = \(\): Mode => "rolodex"/);
  assert.match(motion, /420 \* Math.sin/);
  assert.match(motion, /const angle = offset \* 2\.8/);
  assert.match(motion, /Flip wheel/);
  assert.match(motion, /let flipped = false/);
  assert.match(motion, /side \* 420 \* \(Math.cos/);
  assert.match(motion, /side \* angle/);
  assert.match(motion, /clearInterval\(timer\)/);
  assert.match(motion, /document\.hidden/);
  assert.match(motion, /prefers-reduced-motion: reduce/);
});

test("Snap work renders the supplied Treasure and Lens assets in two groups", async () => {
  const html = await (await render()).text();
  assert.match(html, /class="work-feature__media work-feature__media--pair work-feature__media--assets"/);
  for (const asset of ["treasure-ar.png", "treasure-collection.png", "treasure-feed.png", "nft-lens.png"]) {
    assert.match(html, new RegExp(`/work/snap/${asset}`));
  }
  assert.match(html, />Treasure<\/span>/);
  assert.match(html, />NFTs as lenses<\/span>/);
  assert.match(html, /href="https:\/\/techcrunch\.com\/2022\/07\/13\/snap-eyes-adding-nfts-as-ar-filters-in-snapchat\/" target="_blank" rel="noopener noreferrer">TechCrunch article<\/a>/);
});


test("desktop work rail aligns with the mockups instead of viewport height", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /\.work-editorial__rail \{\s*padding-top: calc\(25\.2px \+ clamp\(80px, 9vw, 150px\) \+ clamp\(29\.9px, 2\.645vw, 41\.4px\) \+ 26px\)/);
  assert.match(css, /\.work-section-nav \{\s*position: sticky;\s*top: calc\(90px \+ clamp\(29\.9px, 2\.645vw, 41\.4px\) \+ 26px\)/);
});

test("work rail gives inactive items a lighter color and active item stronger color", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /\.work-section-nav a \{[^}]*color: #999691;[^}]*font: 14px\/1\.4 var\(--sans\)/);
  assert.match(css, /\.work-section-nav a\[aria-current\], \.work-section-nav a:hover \{ color: #43413e; \}/);
});


test("work rail reveals once after entering the first project and respects reduced motion", async () => {
  const [nav, css] = await Promise.all([
    readFile(new URL("../app/work-nav.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);
  assert.match(nav, /firstMedia.getBoundingClientRect\(\).top <= window.innerHeight \* 0.55/);
  assert.match(nav, /rootMargin: "0px 0px -45% 0px"/);
  assert.match(nav, /nav.dataset.revealed = "true";\s*entrance.disconnect\(\)/);
  assert.match(css, /\.work-section-nav a \{[^}]*font: 14px/);
  assert.match(css, /prefers-reduced-motion: reduce[^}]*work-section-nav[^}]*transition: opacity 150ms linear/s);
});


test("all Snapchat phones share one height without a larger lens override", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /\.work-feature__asset-phones img \{[^}]*--phone-height: min\(24cqw, 440px\);[^}]*flex: none;[^}]*width: calc\(var\(--phone-height\) \* 576 \/ 1156\);[^}]*height: var\(--phone-height\);[^}]*max-width: none;/);
  assert.doesNotMatch(css, /\.work-feature__asset-group:last-child \.work-feature__asset-phones img \{[^}]*height:/);
});

test("Snapchat image panels use the requested neutral background", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /#work-snap \.work-feature__asset-group \{ background: #ECECEC; \}/);
});

test("all inline project placeholders have 12px corners", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /\.work-feature__placeholder \{[^}]*border-radius: 12px/);
});


test("the hero grid fades into plain paper for inline Work", async () => {
  const [hero, css] = await Promise.all([
    readFile(new URL("../app/hero-meadow.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);
  assert.match(hero, /setProperty\("--work-paper-opacity", dissolveProgress.toFixed\(4\)\)/);
  assert.match(hero, /removeProperty\("--work-paper-opacity"\)/);
  assert.match(css, /opacity: var\(--work-paper-opacity, 0\)/);
  assert.match(css, /html\[data-portfolio-layout="quiet"\] \.pranathi-work--editorial \{ background: transparent; \}/);
});


test("Work has no visible Selected work heading", async () => {
  const html = await (await render()).text();
  assert.match(html, /id="work-title"><span class="sr-only">Work<\/span><\/h2>/);
  assert.doesNotMatch(html, />Selected work<\/h2>/);
});


test("scroll assistance guides ordinary input, preserves reversals, and escapes to the hero", async () => {
  const { transpileModule, ModuleKind } = await import("typescript");
  const { runInNewContext } = await import("node:vm");
  const source = await readFile(new URL("../app/work-scroll.tsx", import.meta.url), "utf8");
  const events = new Map();
  const timers = new Map();
  const frames = new Map();
  let sequence = 0;
  const desktop = { matches: true, addEventListener() {}, removeEventListener() {} };
  const reduced = { matches: false, addEventListener() {}, removeEventListener() {} };
  const win = {
    innerHeight: 800, scrollY: 1000,
    matchMedia: query => query.includes("reduced-motion") ? reduced : desktop,
    addEventListener: (name, callback, options) => events.set(name, { callback, options }),
    removeEventListener: name => events.delete(name),
    setTimeout: callback => { timers.set(++sequence, callback); return sequence; },
    clearTimeout: id => timers.delete(id),
    scrollTo: ({ top }) => { win.scrollY = top; },
  };
  class MockElement {
    parentElement = null;
    scrollHeight = 0;
    clientHeight = 0;
    closest() { return null; }
  }
  const sections = [1000, 2000, 3000].map((target, index) => ({
    id: `work-${index}`, offsetHeight: 500, dataset: {},
    getBoundingClientRect: () => ({ top: target + 150 - win.scrollY, height: 500 }),
  }));
  let cleanup;
  const exports = {};
  runInNewContext(transpileModule(source, { compilerOptions: { module: ModuleKind.CommonJS } }).outputText, {
    exports, require: () => ({ useEffect: effect => { cleanup = effect(); } }),
    window: win, document: {
      documentElement: { dataset: {} }, body: {},
      querySelectorAll: () => sections, getElementById: id => id === "work" ? { getBoundingClientRect: () => ({ top: 0, bottom: 5000 }) } : null, querySelector: () => null,
      addEventListener() {}, removeEventListener() {},
    },
    Element: MockElement, getComputedStyle: () => ({ overflowY: "visible" }),
    IntersectionObserver: class { observe() {} disconnect() {} },
    ResizeObserver: class { observe() {} disconnect() {} },
    location: { hash: "" }, performance: { now: () => 0 },
    requestAnimationFrame: callback => { frames.set(++sequence, callback); return sequence; },
    cancelAnimationFrame: id => frames.delete(id),
  });
  exports.WorkScroll();
  const wheel = (deltaY, extra = {}) => events.get("wheel").callback({
    deltaY, deltaX: 0, target: new MockElement(),
    preventDefault: () => {}, ...extra,
  });
  const pause = () => {
    const callbacks = [...timers.values()];
    timers.clear();
    callbacks.forEach(callback => callback());
  };
  assert.equal(events.get("wheel").options.passive, false);
  assert.match(source, /const HERO_SETTLE_DURATION = 900/);
  assert.match(source, /const PROJECT_SETTLE_DURATION = 900/);
  assert.match(source, /projectLandingDirection/);
  assert.match(source, /event\.preventDefault\(\);/);
  assert.match(source, /cubic\(t, 0\.77, 0\.175\)/);
  const complete = () => {
    const callbacks = [...frames.values()];
    frames.clear();
    callbacks.forEach(callback => callback(1000));
  };
  let captured = 0;
  win.scrollY = 0;
  wheel(4, { cancelable: true, preventDefault: () => captured++ });
  assert.equal(frames.size, 1, "the first small downward scroll starts the homepage handoff");
  wheel(900, { cancelable: true, preventDefault: () => captured++ });
  assert.equal(captured, 2, "opening momentum is contained so it cannot skip project one");
  assert.equal(frames.size, 1, "momentum does not restart the handoff animation");
  complete();
  assert.equal(win.scrollY, 1000, "the opening gesture lands precisely on Proactive Intelligence");
  pause();
  wheel(100, { cancelable: true });
  assert.equal(frames.size, 1, "any ordinary project scroll goes directly to the next project");
  complete();
  pause();
  win.scrollY = 0;
  wheel(10, { cancelable: true, preventDefault: () => captured++ });
  wheel(-1, { cancelable: true });
  assert.equal(frames.size, 0, "upward reversal cancels the homepage handoff immediately");
  pause();
  assert.equal(frames.size, 0);
  win.scrollY = 0;
  wheel(10, { cancelable: true, ctrlKey: true });
  assert.equal(frames.size, 0, "zoom gestures never trigger homepage navigation");
  for (const preference of [desktop, reduced]) {
    preference.matches = preference === reduced;
    wheel(10, { cancelable: true });
    assert.equal(frames.size, 0, "touch and reduced motion preserve native homepage scrolling");
    preference.matches = preference === desktop;
  }
  win.scrollY = 1600;
  wheel(8);
  pause();
  assert.equal(frames.size, 1, "gentle input captures the next project from farther away");
  complete();
  assert.equal(win.scrollY, 2000, "the assist finishes at the exact project center");
  win.scrollY = 1700;
  wheel(120);
  assert.equal(frames.size, 1, "stronger input still advances one project directly");
  complete();
  pause();
  win.scrollY = 1000;
  wheel(8);
  win.scrollY = 1190;
  wheel(8);
  pause();
  assert.equal(frames.size, 1, "a deliberate gentle departure commits to the next project");
  complete();
  assert.equal(win.scrollY, 2000);
  win.scrollY = 2000;
  wheel(-8);
  win.scrollY = 1810;
  wheel(-8);
  pause();
  complete();
  assert.equal(win.scrollY, 1000, "gentle upward intent centers the previous project");
  win.scrollY = 1700;
  wheel(8, { deltaMode: 1 });
  assert.equal(frames.size, 1, "line-mode wheels advance directly");
  complete();
  pause();
  win.scrollY = 1700;
  wheel(1, { deltaMode: 2 });
  assert.equal(frames.size, 1, "page-mode wheels advance directly");
  complete();
  pause();
  win.scrollY = 1000;
  wheel(2);
  win.scrollY = 1020;
  assert.equal(frames.size, 1, "tiny adjustments advance directly");
  complete();
  pause();
  win.scrollY = 750;
  wheel(8);
  pause();
  complete();
  assert.equal(win.scrollY, 1000, "approaching Work from the hero can center the first project");
  win.scrollY = 1900;
  wheel(8);
  assert.equal(frames.size, 1, "a pause just before a project centers it directly");
  wheel(-1);
  assert.equal(frames.size, 1, "a reversal retargets the handoff without a jump");
  pause();
  win.scrollY = 1600;
  wheel(400);
  assert.equal(frames.size, 1, "a mid-project scroll still advances directly");
  complete();
  pause();
  win.scrollY = 980;
  wheel(-900);
  pause();
  assert.equal(frames.size, 0, "upward movement above the first project freely reaches the hero");
  win.scrollY = 2900;
  wheel(2500);
  win.scrollY = 3400;
  events.get("scroll").callback();
  assert.equal(frames.size, 1, "a scroll before the last project centers it directly");
  complete();
  pause();
  win.scrollY = 2100;
  wheel(-4);
  events.get("scroll").callback();
  assert.equal(frames.size, 1, "project scrolling does not wait for momentum to settle");
  events.get("keydown").callback();
  assert.equal(frames.size, 0, "keyboard input interrupts the assist");
  for (const preference of [desktop, reduced]) {
    preference.matches = preference === reduced;
    wheel(20);
    pause();
    assert.equal(frames.size, 0, "touch layouts and reduced motion keep native scrolling");
    preference.matches = preference === desktop;
  }
  cleanup();
  assert.equal(timers.size, 0);
  assert.equal(frames.size, 0);
});

test("touch work uses gentle proximity snap while desktop stays native", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /@media \(pointer: coarse\) \{\s*html\[data-work-snap="on"\] \{ scroll-snap-type: y proximity; \}/);
  assert.doesNotMatch(css, /@media \(min-width: 1080px\), \(pointer: coarse\)/);
  assert.match(css, /html\[data-work-snap="on"\] \.work-feature \{[\s\S]*?scroll-snap-stop: normal;/);
});


test("Snapchat work metadata centers and separates the logo and label", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /\.work-feature__meta \.hero-company--snap \{ display: inline-flex; align-items: center; gap: 8px; \}/);
  assert.match(css, /\.work-feature__meta \.hero-company--snap \.hero-company__mark \{ transform: none; \}/);
});

test("Snapchat work metadata centers and separates the logo and label", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /\.work-feature__meta \.hero-company--snap \{ display: inline-flex; align-items: center; gap: 8px; \}/);
  assert.match(css, /\.work-feature__meta \.hero-company--snap \.hero-company__mark \{ transform: none; \}/);
});

test("Glean work metadata separates the logo and label", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /\.work-feature__meta \.hero-company--glean \{[^}]*display: inline-flex;[^}]*gap: 6px/);
});


test("Work rail clearly distinguishes the selected project with color", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /\.work-section-nav a \{[^}]*color: #999691/);
  assert.match(css, /\.work-section-nav a\[aria-current\][^{]*\{[^}]*color: #43413e/);
  assert.match(css, /\.work-section-nav__dot \{[^}]*background: #43413e/);
});

test("Work rail position does not follow project heights", async () => {
  const [scroll, css] = await Promise.all([
    readFile(new URL("../app/work-scroll.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);
  assert.doesNotMatch(scroll, /alignRail|currentSection|rail\.style/);
  assert.match(css, /\.work-section-nav \{\s*position: sticky;\s*top: calc\(90px \+ clamp\(29.9px, 2.645vw, 41.4px\) \+ 26px\)/);
});

test("Work rail uses one moving indicator with reduced-motion support", async () => {
  const [nav, css] = await Promise.all([
    readFile(new URL("../app/work-nav.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);
  assert.match(nav, /className="work-section-nav__dot" aria-hidden="true"/);
  assert.match(nav, /link.offsetLeft/);
  assert.match(nav, /resize.disconnect\(\)/);
  assert.doesNotMatch(css, /\.work-section-nav a\[aria-current\]::before/);
  assert.match(css, /transform 250ms var\(--motion-ease-in-out\)/);
  assert.match(css, /prefers-reduced-motion: reduce[^}]*work-section-nav__dot[^}]*transition: opacity 150ms linear/s);
});


test("project navigation is hidden when the left rail does not fit", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /@media \(max-width: 1079px\) \{\s*\.work-editorial \{[^}]*\}\s*\.work-editorial__rail \{ display: none; \}/);
});


test("Proactive Intelligence uses the cropped main video", async () => {
  const html = await (await render()).text();
  assert.match(html, /class="work-feature__video"/);
  assert.match(html, /src="\/work\/psychic-updated.mp4"/);
  assert.match(html, /poster="\/work\/psychic-updated-poster.jpg"/);
});


test("homepage uses the requested warm paper background", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /\.site-shell\[data-atmosphere\]\[data-environment-style\]:has\(\.pranathi-intro--home\) \{\s*--paper: #f5f5f4;\s*background-color: #f5f5f4;/);
});


test("projects reveal as one composition and stay visible on return", async () => {
  const [scroll, css, reveal] = await Promise.all([
    readFile(new URL("../app/work-scroll.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/reveal.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(scroll, /cancelAnimationFrame\(scrollFrame\)/);
  assert.match(scroll, /removeEventListener\("pointerdown", stopScroll\)/);
  assert.match(reveal, /observer.unobserve\(element\)/);
  assert.match(css, /\.work-feature > \.reveal\[data-reveal-ready="true"\]\.is-visible \{\s*opacity: 1;\s*transform: none;/);
  assert.doesNotMatch(css, /\.work-feature\[data-in-view="false"\]/);
  assert.doesNotMatch(css, /\.work-feature__media > :nth-child/);
});


test("project descriptions fill the mockup width", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /\.work-feature__summary \{[^}]*max-width: none;[^}]*text-wrap: wrap;/);
});

test("alternate Growth video is the first visit-local prototype and defaults off", async () => {
  const [picker, prototype, html] = await Promise.all([
    readFile(new URL("../app/meadow-prototype-controls.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/growth-video-prototype.tsx", import.meta.url), "utf8"),
    render().then((response) => response.text()),
  ]);
  assert.ok(picker.indexOf("<GrowthVideoToggle />") < picker.indexOf('aria-label="Page layout"'));
  assert.match(prototype, /let alternateEnabled = false/);
  assert.match(prototype, /aria-pressed=\{enabled\}/);
  assert.match(prototype, /key=\{media.src\}/);
  assert.doesNotMatch(prototype, /localStorage|sessionStorage/);
  assert.match(html, /src="\/work\/growth-main.mp4"/);
});

test("Growth pairs ordered onboarding screens with a centered video and fading checklist", async () => {
  const fadeCss = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(fadeCss, /\.work-feature__checklist img \{[^}]*mask-image: linear-gradient\(to bottom, transparent, #000 20%\)/);
  assert.match(await (await render()).text(), /id="work-growth-title">Growth at Glean<\/h3>/);
  const html = await (await render()).text();
  const growth = html.match(/id="work-growth"[\s\S]*?<\/section>/)?.[0];
  assert.ok(growth);
  assert.match(growth, /work-feature__onboarding[\s\S]*?growth-welcome.png[\s\S]*?growth-extension.png[\s\S]*?growth-bookmark.png[\s\S]*?<video[\s\S]*?growth-main.mp4[\s\S]*?<\/video>[\s\S]*?growth-checklist.png/);
  assert.equal((growth.match(/work-feature__placeholder/g) || []).length, 0);
  assert.match(growth, /poster="\/work\/growth-main-poster.jpg"/);
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /grid-template-columns: minmax\(0, 271fr\) minmax\(0, 563fr\) minmax\(0, 271fr\)/);
  assert.match(css, /column-gap: calc\(100% \* 20 \/ 1145\)/);
  assert.match(css, /\.work-feature__checklist::after \{[^}]*height: 18%;[^}]*pointer-events: none;[^}]*linear-gradient/);
  assert.match(css, /\.work-feature__checklist img \{[^}]*transform: translateY\(5%\)/);
});


test("renders the tagged photo collection with search and a native focus view", async () => {
  const response = await render("/photography");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<title>Photography — Neel Saswade<\/title>/);
  assert.doesNotMatch(html, /<h1[^>]*>Photography<\/h1>/);
  assert.match(html, /href="\/photography"[^>]*aria-current="page"/);
  assert.equal((html.match(/data-photo-id="/g) ?? []).length, 141);
  assert.equal((html.match(/data-silent-hover="true"/g) ?? []).length, 141);
  assert.match(html, /aria-label="Search photos"/);
  assert.match(html, /placeholder="type “bikes”"/);
  assert.match(html, /“nature”/);
  assert.doesNotMatch(html, /\(placeholder\)/);
  assert.match(html, /<dialog/);
  assert.match(html, /aria-label="Close photograph"/);
});


test("renders the tagged photo collection with search and a native focus view", async () => {
  const response = await render("/photography");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<title>Photography — Neel Saswade<\/title>/);
  assert.doesNotMatch(html, /<h1[^>]*>Photography<\/h1>/);
  assert.match(html, /href="\/photography"[^>]*aria-current="page"/);
  assert.equal((html.match(/data-photo-id="/g) ?? []).length, 141);
  assert.match(html, /aria-label="Search photos"/);
  assert.doesNotMatch(html, /\(placeholder\)/);
  assert.match(html, /<dialog/);
  assert.match(html, /aria-label="Close photograph"/);
});


test("photo search matches synonyms and combined tags without changing the catalog", async () => {
  const { matchesPhoto, clusterPhotos, masonryLayout } = await import("../app/photography/gallery-model.mjs");
  const photos = JSON.parse(await readFile(new URL("../app/photography/photos.json", import.meta.url), "utf8"));
  const ids = (query) => photos.filter((photo) => matchesPhoto(photo, query)).map((photo) => photo.id);
  assert.equal(photos.length, 141);
  assert.equal(new Set(photos.map((photo) => photo.id)).size, 141);
  assert.equal(ids("").length, 141);
  assert.deepEqual(ids("bike"), ids("bicycle"));
  assert.deepEqual(ids("Japanese"), ids("Japan"));
  for (const term of ["sunset", "bicycle", "Japan", "city", "street photography"]) assert.ok(ids(term).length > 0, term);
  const combined = ids("Japan city");
  assert.ok(combined.length > 0);
  assert.ok(combined.every((id) => ids("Japan").includes(id) && ids("city").includes(id)));
  assert.equal(ids("zzzz-no-match").length, 0);
  for (const photo of photos) {
    assert.ok(photo.tags.length >= 7 && photo.description && photo.width > 0 && photo.height > 0);
    assert.ok(Math.abs(photo.ratio - photo.width / photo.height) < 0.00001);
    await access(new URL(`../public${photo.src}`, import.meta.url));
    await access(new URL(`../public${photo.thumbnail}`, import.meta.url));
  }
  for (const grouping of ["color", "style"]) {
    const ordered = clusterPhotos(photos, grouping);
    const key = grouping === "color" ? "color" : "style";
    const groups = ordered.map((photo) => photo[key]).filter((value, i, all) => i === 0 || value !== all[i - 1]);
    assert.equal(new Set(groups).size, groups.length, "clusters are contiguous");
    assert.equal(ordered.length, photos.length);
    for (const columns of [2, 3, 4, 5]) {
      const width = columns === 2 ? 342 : 1152;
      const layout = masonryLayout(ordered, width, columns, 20);
      const positions = [...layout.positions.values()];
      assert.equal(positions.length, photos.length);
      assert.ok(positions.every((position) => position.x >= 0 && position.x + position.width <= width + 0.01));
      for (let i = 0; i < positions.length; i++) for (let j = i + 1; j < positions.length; j++) {
        const a = positions[i], b = positions[j];
        assert.ok(a.x + a.width <= b.x + 0.01 || b.x + b.width <= a.x + 0.01 || a.y + a.height <= b.y + 0.01 || b.y + b.height <= a.y + 0.01, "photos do not overlap");
      }
    }
  }
});


test("Photo and About share the homepage paper color", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /html:has\(\.about-page, \.photography-page\) body,\s*\.about-page,\s*\.photography-page,[^{]+\{\s*--paper: #f5f5f4;\s*background-color: #f5f5f4;/);
  assert.match(await (await render("/photography")).text(), /class="site-shell photography-page /);
  assert.match(await (await render("/about")).text(), /class="site-shell page-enter about-page about-page--journal"/);
});

test("Field journal unifies all hero artwork as an explicit reversible prototype", async () => {
  const [styles, css, hero] = await Promise.all([
    readFile(new URL("../app/alamo-styles.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/field-journal.css", import.meta.url), "utf8"),
    readFile(new URL("../app/hero-meadow.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(styles, /DEFAULT_ALAMO_STYLE: AlamoStyle = "painterly-realism"/);
  assert.match(styles.split("MEADOW_TREE_OPTIONS")[1], /id: "field-journal"/);
  assert.match(hero, /if \(environmentStyle !== "field-journal"\) return/);
  assert.match(hero, /observer\.disconnect\(\);\s*tree\.style\.removeProperty\("bottom"\)/);
  for (const asset of ["rolling", "flat", "tree", "paper", "icon-photography", "icon-cycling", "icon-backpacking", "photo-0", "photo-1", "photo-2", "photo-3", "photo-4", "bike-0", "bike-1", "bike-2", "hiker-0", "hiker-1", "hiker-2", "philip-idle", "philip-smile", "philip-light", "philip-strong", "philip-strained"]) {
    await access(new URL(`../public/alamo-styles/field-journal/${asset}.svg`, import.meta.url));
    assert.ok((styles + css).includes(`/alamo-styles/field-journal/${asset}.svg`), `${asset} is wired into the prototype`);
  }
  assert.match(css, /data-environment-style="field-journal"[^}]+:focus-visible/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  const html = await (await render()).text();
  assert.match(html, /data-environment-style="painterly-realism"/);
  assert.doesNotMatch(html, /data-environment-style="field-journal"/);
});


test("Selected work leads with the umbrella and Neel's 28 selections without losing photos", async () => {
  const { clusterPhotos, selectedPhotoIds, masonryLayout } = await import("../app/photography/gallery-model.mjs");
  const photos = JSON.parse(await readFile(new URL("../app/photography/photos.json", import.meta.url), "utf8"));
  const before = JSON.stringify(photos);
  const ordered = clusterPhotos(photos, "selected");
  assert.equal(selectedPhotoIds.length, 28);
  assert.equal(new Set(selectedPhotoIds).size, 28);
  assert.equal(ordered[0].id, "087");
  assert.deepEqual(ordered.slice(0, 28).map(photo => photo.id), selectedPhotoIds);
  assert.deepEqual(ordered.map(photo => photo.id).sort(), photos.map(photo => photo.id).sort());
  assert.deepEqual(clusterPhotos([...photos].reverse(), "selected"), ordered);
  assert.equal(JSON.stringify(photos), before);
  for (const columns of [2, 5]) {
    const layout = masonryLayout(ordered, columns === 2 ? 342 : 1152, columns, 20);
    assert.equal(layout.positions.get("087").y, 0);
    assert.equal(layout.positions.get("087").x, 0);
  }
});


test("photo search waits for visible departures and a short pause before gathering", async () => {
  const { photoGatherDelay, photoFallDuration } = await import("../app/photography/search-motion.mjs");
  const snapshots = new Map([
    ["001", { top: 100, height: 200, opacity: "1" }],
    ["003", { top: 300, height: 200, opacity: "1" }],
    ["007", { top: 1500, height: 200, opacity: "1" }],
    ["011", { top: 100, height: 200, opacity: "0" }],
  ]);
  assert.equal(photoGatherDelay(snapshots, new Set(["001"]), 800), photoFallDuration("003") + 180);
  assert.equal(photoGatherDelay(snapshots, new Set(["003"]), 800), photoFallDuration("001") + 180);
  assert.equal(photoGatherDelay(snapshots, new Set(["001", "003"]), 800), 0);
  assert.equal(photoGatherDelay(new Map(), new Set(), 800), 0);
});

test("glass hover remains reversible and gated for motion and pointer preferences", async () => {
  const css = await readFile(new URL("../app/meadow-activities.css", import.meta.url), "utf8");
  assert.match(css, /transition: transform 250ms var\(--motion-ease-out\), opacity 250ms ease/);
  assert.match(css, /@media \(hover: hover\) and \(pointer: fine\) and \(prefers-reduced-motion: no-preference\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?transform: none/);
  assert.doesNotMatch(css, /@keyframes|transition: all/);
});

test("photo search coalesces typing and waits for the active gallery motion", async () => {
  const { schedulePhotoSearch } = await import("../app/photography/search-motion.mjs");
  const jobs = new Map();
  let next = 0;
  const timers = {
    setTimeout(fn, delay) { assert.equal(delay, 600); jobs.set(++next, fn); return next; },
    clearTimeout(id) { jobs.delete(id); },
  };
  const applied = [];
  let finish;
  const motion = new Promise(resolve => { finish = resolve; });
  const wait = () => motion;
  const cancelI = schedulePhotoSearch(() => applied.push("i"), wait, timers);
  cancelI();
  const cancelIC = schedulePhotoSearch(() => applied.push("ic"), wait, timers);
  const pendingIC = [...jobs.values()][0](); // A typing pause while photos still move.
  cancelIC();
  schedulePhotoSearch(() => applied.push("ice"), wait, timers);
  const pendingIce = [...jobs.values()][0]();
  assert.deepEqual(applied, []);
  finish();
  await Promise.all([pendingIC, pendingIce]);
  assert.deepEqual(applied, ["ice"]);
});
