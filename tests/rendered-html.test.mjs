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
  assert.match(html, /aria-label="Meadow and cypress wind controls"/);
  assert.match(html, />Breeze<output>0\.34<\/output>/);
  assert.match(html, />Gust<output>0\.52<\/output>/);
  assert.match(html, />Elasticity<output>0\.38<\/output>/);
  assert.match(html, />Gust rhythm<output>0\.31<\/output>/);
  assert.match(html, />Minimize<\/button>/);
  assert.doesNotMatch(html, /codex-preview|Building your site|react-loading-skeleton/i);
});

test("keeps the living lawn and cursor pet lightweight", async () => {
  const [renderer, meadow, hero, tree, smiley, css] = await Promise.all([
    readFile(new URL("../app/meadow-grass-renderer.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/meadow.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/hero-meadow.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/cypress-tree.tsx", import.meta.url), "utf8"),
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
  assert.match(hero, /<Meadow wind=\{wind\} isPlaying=\{isPlaying\} \/>/);
  assert.match(hero, /wind=\{wind\}[\s\S]*isPlaying=\{isPlaying\}/);
  assert.match(tree, /treeRef\.current\?\.setWind\(wind\)/);
  assert.match(tree, /onPlayingChange\(!isPlaying\)/);
  assert.match(tree, /cypress-tree__root-transition/);
  assert.match(tree, /cypress-tree__root-shadow/);
  assert.match(tree, /cypress-tree__root-bank/);
  assert.match(smiley, /const IDLE_MISCHIEF_DELAY = 1500/);
  assert.match(smiley, /const IDLE_APPROACH_DURATION = 950/);
  assert.match(smiley, /const IDLE_HUFF_STATES = \["light", "strong", "strained"\]/);
  assert.match(smiley, /cursor\.dataset\.idle = "approach"/);
  assert.match(smiley, /cursor\.dataset\.idle = "huff"/);
  assert.match(smiley, /stopIdleMischief\(\)/);
  assert.match(css, /\.meadow__grass-canvas\s*\{/);
  assert.match(css, /\.meadow__visual\.is-grass-live \.meadow__image/);
  assert.match(css, /\.cypress-tree__root-transition\s*\{/);
  assert.match(css, /@keyframes cypress-root-grass-sway/);
  assert.match(css, /--portfolio-reading-width:\s*740px/);
  assert.match(css, /font-size:\s*clamp\(29px, 2\.5vw, 35px\)/);
  assert.match(css, /font-size:\s*clamp\(16px, 1\.32vw, 19px\)/);
  assert.match(css, /pointer-events:\s*none/);
});
