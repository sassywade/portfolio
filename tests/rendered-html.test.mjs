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
  assert.match(html, />Neel Saswade</);
  assert.match(html, /class="meadow__grass-canvas"/);
  assert.match(html, /data-grass-layer="true"/);
  assert.match(html, /class="meadow__visual meadow__visual--flat"/);
  assert.match(html, /Open secret meadow prototype picker/);
  assert.match(html, />Meadow lab<\/button>/);
  assert.match(html, /class="bike-word"/);
  assert.match(html, /Release miniature Neel on a bike onto the meadow/);
  assert.match(html, /class="photo-word"/);
  assert.match(html, /Release miniature Neel with a camera onto the meadow/);
  assert.match(html, /class="backpack-word"/);
  assert.match(html, /Release miniature Neel backpacking onto the meadow/);
  assert.match(html, /aria-label="Meadow and cypress wind controls"/);
  assert.match(html, />Breeze<output>0\.34<\/output>/);
  assert.match(html, />Gust<output>0\.52<\/output>/);
  assert.match(html, />Elasticity<output>0\.38<\/output>/);
  assert.match(html, />Gust rhythm<output>0\.31<\/output>/);
  assert.match(html, />Minimize<\/button>/);
  assert.doesNotMatch(html, /codex-preview|Building your site|react-loading-skeleton/i);
});

test("keeps the living lawn, miniature visitors, and cursor pet lightweight", async () => {
  const [renderer, meadow, prototype, hero, tree, layerHost, bike, photographer, backpacker, smiley, css] = await Promise.all([
    readFile(new URL("../app/meadow-grass-renderer.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/meadow.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/meadow-prototype-controls.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/hero-meadow.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/cypress-tree.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/use-meadow-layer-host.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/bike-ride.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/photo-drop.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/backpack-walk.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/smiley-cursor.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(renderer, /const FRAME_INTERVAL = 1000 \/ 30/);
  assert.match(renderer, /surfaceByColumn/);
  assert.match(renderer, /sourceContext\.getImageData/);
  assert.match(renderer, /type GrassTuft/);
  assert.match(renderer, /buildPainterlyBase/);
  assert.match(renderer, /buildTuftClusters/);
  assert.match(renderer, /drawWindBands/);
  assert.match(renderer, /globalCompositeOperation = "screen"/);
  assert.match(renderer, /classList\.add\(READY_CLASS\)/);
  assert.match(renderer, /context\.quadraticCurveTo/);
  assert.match(renderer, /navigator\.hardwareConcurrency/);
  assert.match(renderer, /new IntersectionObserver/);
  assert.match(renderer, /new ResizeObserver/);
  assert.match(renderer, /document\.hidden/);
  assert.doesNotMatch(renderer, /type Blade\s*=/);
  assert.doesNotMatch(renderer, /edgeCount/);
  assert.doesNotMatch(renderer, /filter\s*=\s*["']blur|ctx\.filter\s*=\s*["']blur/i);

  assert.match(meadow, /createMeadowGrass/);
  assert.match(meadow, /prefers-reduced-motion: reduce/);
  assert.match(meadow, /type MeadowVariant = "living" \| "flat"/);
  assert.match(meadow, /data-meadow-surface=\{variant === "flat" \? "active" : "inactive"\}/);
  assert.match(meadow, /className="meadow__flat-field"/);
  assert.match(meadow, /src="\/flat-meadow-generated\.webp"/);
  assert.match(meadow, /className="meadow__flat-tint"/);
  assert.match(meadow, /isPlaying && variant === "living"/);
  assert.match(prototype, /useState\(false\)/);
  assert.match(prototype, /Open secret meadow prototype picker/);
  assert.match(prototype, /aria-pressed=\{variant === "flat"\}/);
  assert.match(prototype, /type="color"/);
  assert.match(prototype, />\s*Minimize\s*<\/button>/);
  assert.match(hero, /document\.querySelector<HTMLElement>\("\.pranathi-work"\)/);
  assert.match(hero, /const scrollY = Math\.max\(0, window\.scrollY\)/);
  assert.match(hero, /const transitionStart = Math\.max\(0, workTop - viewportHeight \* 0\.98\)/);
  assert.match(hero, /--meadow-exit-y/);
  assert.match(hero, /window\.requestAnimationFrame\(animate\)/);
  assert.match(hero, /window\.addEventListener\("scroll", schedule, \{ passive: true \}\)/);
  assert.match(hero, /prefers-reduced-motion: reduce/);
  assert.match(hero, /data-scene-visible/);
  assert.match(hero, /<Meadow wind=\{wind\} isPlaying=\{sceneIsPlaying\} variant=\{meadowVariant\} \/>/);
  assert.match(hero, /wind=\{wind\}[\s\S]*isPlaying=\{sceneIsPlaying\}/);
  assert.match(hero, /DEFAULT_FLAT_MEADOW_COLOR/);
  assert.match(hero, /data-meadow-variant=\{meadowVariant\}/);
  assert.match(hero, /<MeadowPrototypeControls/);
  assert.match(tree, /treeRef\.current\?\.setWind\(wind\)/);
  assert.match(tree, /onPlayingChange\(!isPlaying\)/);
  assert.doesNotMatch(tree, /cypress-tree__root-transition/);
  assert.doesNotMatch(tree, /cypress-tree__root-bank/);
  assert.match(layerHost, /document\.querySelector<HTMLElement>\("\.hero-meadow"\)/);
  assert.match(layerHost, /window\.requestAnimationFrame/);
  assert.match(bike, /const FRAME_URLS = \[/);
  assert.match(bike, /createPortal/);
  assert.match(bike, /\}, \[meadowHost\]\)/);
  assert.match(bike, /surfaceByColumn/);
  assert.match(bike, /window\.requestAnimationFrame\(frame\)/);
  assert.match(bike, /direction \*= -1/);
  assert.match(bike, /new IntersectionObserver/);
  assert.match(bike, /prefers-reduced-motion: reduce/);
  assert.match(bike, /data-meadow-surface="active"/);
  assert.match(bike, /meadow\.dataset\.meadowVariant === "flat"/);
  assert.match(photographer, /const FRAME_URLS = \[/);
  assert.match(photographer, /createPortal/);
  assert.match(photographer, /\}, \[meadowHost\]\)/);
  assert.match(photographer, /const PHOTO_SEQUENCE = \[/);
  assert.match(photographer, /photographer-frame-1-corrected\.png/);
  assert.match(photographer, /photographer-frame-2-corrected\.png/);
  assert.match(photographer, /\{ frame: 3, minDuration: 420, maxDuration: 560 \}/);
  assert.match(photographer, /Math\.random\(\)/);
  assert.match(photographer, /randomDuration\(step\.minDuration, step\.maxDuration\)/);
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
  assert.match(smiley, /const FACING_INTENT_THRESHOLD = 32/);
  assert.match(smiley, /const FACING_CHANGE_DELAY = 240/);
  assert.match(smiley, /const FACING_INTENT_MEMORY = 180/);
  assert.match(smiley, /facingIntent = clamp\(facingIntent \+ deltaX, -140, 140\)/);
  assert.match(smiley, /queueFacingChange\(nextFacing\)/);
  assert.match(smiley, /window\.setTimeout\(\(\) => \{/);
  assert.match(smiley, /cursor\.dataset\.facing = facing === 1 \? "right" : "left"/);
  assert.match(smiley, /currentFollowDistance \* facing/);
  assert.match(smiley, /const BACKPACKER_ARM_DELAY = 480/);
  assert.match(smiley, /const BACKPACKER_APPROACH_DURATION = 680/);
  assert.match(smiley, /const BACKPACKER_BLOW_REVERSAL_DELAY = 280/);
  assert.match(smiley, /activeBackpacker/);
  assert.match(smiley, /pointerIsNearBackpacker/);
  assert.match(smiley, /cursor\.dataset\.backpacker = "approach"/);
  assert.match(smiley, /cursor\.dataset\.backpacker = "blow"/);
  assert.match(smiley, /new CustomEvent\(PET_BLOW_BACKPACKER_EVENT/);
  assert.match(smiley, /detail: \{ direction: backpackerFacing \}/);
  assert.match(smiley, /cursor\.dataset\.idle = "approach"/);
  assert.match(smiley, /cursor\.dataset\.idle = "huff"/);
  assert.match(smiley, /cursor\.dataset\.reaction = "smile"/);
  assert.match(smiley, /\/pet\/pet-smile\.png/);
  assert.match(smiley, /stopIdleMischief\(\)/);
  assert.match(css, /\.meadow__grass-canvas\s*\{/);
  assert.match(css, /\.meadow__visual--flat\s*\{/);
  assert.match(css, /--flat-meadow-color:\s*#6f8d45/);
  assert.match(css, /\.meadow__flat-image\s*\{[^}]*mix-blend-mode:\s*luminosity/);
  assert.match(css, /\.meadow__flat-tint\s*\{[^}]*background:\s*var\(--flat-meadow-color\)/);
  assert.match(css, /\.meadow-prototype\s*\{/);
  assert.match(css, /\.meadow-prototype__modes button\[aria-pressed="true"\]/);
  assert.match(css, /\.hero-meadow\s*\{[\s\S]*position:\s*fixed/);
  assert.match(css, /transform:\s*translate3d\(-50%, var\(--meadow-exit-y\), 0\)/);
  assert.match(css, /\.hero-meadow\[data-scene-visible="false"\]/);
  assert.match(css, /\.meadow__visual\.is-grass-live \.meadow__image/);
  assert.doesNotMatch(css, /\.cypress-tree__root-transition\s*\{/);
  assert.match(css, /width:\s*clamp\(260px, 24vw, 350px\)/);
  assert.doesNotMatch(css, /@keyframes cypress-root-grass-sway/);
  assert.match(css, /--portfolio-reading-width:\s*740px/);
  assert.match(css, /font-size:\s*clamp\(29px, 2\.5vw, 35px\)/);
  assert.match(css, /font-size:\s*clamp\(16px, 1\.32vw, 19px\)/);
  assert.match(css, /\.bike-word,\s*\.photo-word,\s*\.backpack-word\s*\{/);
  assert.match(css, /--miniature-character-height:\s*clamp\(82px, 7vw, 100px\)/);
  assert.match(css, /\.bike-rider\s*\{[^}]*width:\s*var\(--miniature-character-height\)[^}]*height:\s*var\(--miniature-character-height\)/);
  assert.match(css, /\.bike-rider__direction\s*\{[^}]*transform:\s*scale\(1\.14\) scaleX\(var\(--bike-direction\)\)/);
  assert.match(css, /\.mini-photographer\s*\{[^}]*height:\s*var\(--miniature-character-height\)/);
  assert.match(css, /\.mini-hiker\s*\{[^}]*height:\s*var\(--miniature-character-height\)/);
  assert.match(css, /@keyframes miniature-bike-materialize/);
  assert.match(css, /@keyframes miniature-photographer-materialize/);
  assert.match(css, /@keyframes miniature-hiker-materialize/);
  assert.match(css, /@keyframes smiley-happy-glimpse/);
  assert.match(css, /--smiley-facing:\s*1/);
  assert.match(css, /transform:\s*scaleX\(var\(--smiley-facing\)\)/);
  assert.match(css, /pointer-events:\s*none/);
});
