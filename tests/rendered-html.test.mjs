import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
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
  assert.match(html, /I&#x27;m a product designer based in San Francisco\. Currently, I work at Glean focused on proactive intelligence,\s*growth, and artifacts\. Previously, I designed at snap, and intuitive surgical\./);
  assert.doesNotMatch(html, /\[something good\]|\[company\]/);
  assert.match(html, /class="meadow__image" src="\/meadow-ground\.png"/);
  assert.match(html, /data-rolling-meadow="original"/);
  assert.match(html, /Checking the weather at Alamo Square/);
  assert.match(html, /Local time in San Francisco/);
  assert.doesNotMatch(html, /meadow__grass-canvas|data-grass-layer/);
  assert.match(html, /class="meadow__visual meadow__visual--flat"/);
  assert.match(html, /data-flat-texture="fine"/);
  assert.match(html, /class="bike-word"/);
  assert.match(html, /Release miniature Neel on a bike onto the meadow/);
  assert.match(html, /class="photo-word"/);
  assert.match(html, /Release miniature Neel with a camera onto the meadow/);
  assert.match(html, /class="backpack-word"/);
  assert.match(html, /Release miniature Neel backpacking onto the meadow/);
  assert.doesNotMatch(html, /Meadow and cypress wind controls|Open secret meadow prototype picker/);
  assert.doesNotMatch(html, /codex-preview|Building your site|react-loading-skeleton/i);
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
  assert.match(weather, /temperature_2m%2Cwind_speed_10m%2Cwind_direction_10m%2Cwind_gusts_10m/);
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
  assert.match(prototype, /cycleRollingMeadow/);
  assert.match(prototype, /Previous rolling meadow/);
  assert.match(prototype, /Next rolling meadow/);
  assert.match(prototype, /windFields\.map/);
  assert.match(prototype, /onPlayingChange\(!isPlaying\)/);
  assert.match(hero, /document\.querySelector<HTMLElement>\("\.pranathi-work"\)/);
  assert.match(hero, /const scrollY = Math\.max\(0, window\.scrollY\)/);
  assert.match(hero, /const transitionStart = Math\.max\(0, workTop - viewportHeight \* 0\.98\)/);
  assert.match(hero, /--meadow-exit-y/);
  assert.match(hero, /window\.requestAnimationFrame\(animate\)/);
  assert.match(hero, /window\.addEventListener\("scroll", schedule, \{ passive: true \}\)/);
  assert.match(hero, /prefers-reduced-motion: reduce/);
  assert.match(hero, /data-scene-visible/);
  assert.match(hero, /rollingMeadow=\{rollingMeadow\}/);
  assert.match(hero, /useState<RollingMeadow>\("original"\)/);
  assert.match(hero, /useState<FlatMeadowTexture>\("fine"\)/);
  assert.match(hero, /wind=\{wind\}[\s\S]*isPlaying=\{sceneIsPlaying\}/);
  assert.match(hero, /DEFAULT_FLAT_MEADOW_COLOR/);
  assert.match(hero, /data-meadow-variant=\{meadowVariant\}/);
  assert.match(hero, /<MeadowSettings/);
  assert.match(hero, /isVisible=\{isSceneVisible\}/);
  assert.match(hero, /<AlamoWeather onWindUpdate=\{setWind\} \/>/);
  assert.match(tree, /treeRef\.current\?\.setWind\(wind\)/);
  assert.match(tree, /portfolio:pet-blow-cypress/);
  assert.match(tree, /treeRef\.current\?\.applyGust/);
  assert.match(tree, /window\.addEventListener\(PET_BLOW_CYPRESS_EVENT, handlePetGust\)/);
  assert.match(tree, /className="cypress-tree__ground-shadow" aria-hidden="true"/);
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
  assert.match(smiley, /const IDLE_MISCHIEF_DELAY = 1500/);
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
  assert.doesNotMatch(css, /\.meadow__flat-image\s*\{[^}]*mix-blend-mode:\s*luminosity/);
  assert.match(css, /\.meadow__flat-tint\s*\{[^}]*opacity:\s*0\.22/);
  assert.match(css, /\.meadow-settings__texture-options\s*\{/);
  assert.match(css, /\.meadow__flat-tint\s*\{[^}]*background:\s*var\(--flat-meadow-color\)/);
  assert.match(css, /\.meadow-settings\s*\{/);
  assert.match(css, /\.meadow-settings__modes button\[aria-pressed="true"\]/);
  assert.match(css, /\.alamo-weather\s*\{[^}]*font-size:\s*10px/);
  assert.match(css, /\.alamo-weather__primary\s*\{[^}]*font-size:\s*11px/);
  assert.match(css, /\.hero-meadow > \.cypress-tree\s*\{[^}]*z-index:\s*auto;[^}]*contain:\s*none;/);
  assert.match(css, /\.hero-meadow\[data-meadow-variant="living"\] > \.cypress-tree\s*\{[^}]*bottom:\s*clamp\(56px, 6\.5vw, 96px\)/);
  assert.match(css, /\.cypress-tree__ground-shadow\s*\{[^}]*z-index:\s*3;[^}]*radial-gradient\(/);
  assert.match(css, /\.cypress-tree__ground-shadow\s*\{[^}]*mix-blend-mode:\s*multiply/);
  assert.match(css, /\.hero-meadow > \.cypress-tree \.cypress-tree__canvas\s*\{[^}]*z-index:\s*1;/);
  assert.match(css, /\.hero-meadow > \.meadow\s*\{[^}]*z-index:\s*2;/);
  assert.match(css, /\.hero-meadow > \.bike-ride-layer,[\s\S]*?\.hero-meadow > \.backpack-walk-layer\s*\{[^}]*z-index:\s*5;/);
  assert.match(css, /\.hero-meadow\s*\{[\s\S]*position:\s*fixed/);
  assert.match(css, /transform:\s*translate3d\(-50%, var\(--meadow-exit-y\), 0\)/);
  assert.match(css, /\.hero-meadow\[data-scene-visible="false"\]/);
  assert.doesNotMatch(css, /\.cypress-tree__root-transition\s*\{/);
  assert.match(css, /width:\s*clamp\(240px, 22vw, 322px\)/);
  assert.match(css, /width:\s*clamp\(238px, 31vw, 330px\)/);
  assert.match(css, /width:\s*248px/);
  assert.doesNotMatch(css, /@keyframes cypress-root-grass-sway/);
  assert.match(css, /--portfolio-reading-width:\s*740px/);
  assert.match(css, /\.site-header__wordmark,[\s\S]*?\.site-header--pages \.site-nav\s*\{[^}]*font-size:\s*clamp\(17px, 1\.3vw, 21px\)/);
  assert.match(css, /\.site-header--pages\s*\{[^}]*gap:\s*32px;[^}]*padding-top:\s*30px/);
  assert.match(css, /font-size:\s*clamp\(29px, 2\.5vw, 35px\)/);
  assert.match(css, /font-size:\s*clamp\(16px, 1\.32vw, 19px\)/);
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
