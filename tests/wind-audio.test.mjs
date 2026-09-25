import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import ts from "typescript";

test("wind audio leads the tree by 350ms and never replays after late gestures or remounts", async () => {
  const sound = await readFile(new URL("../app/soundscape.tsx", import.meta.url), "utf8");
  const tree = await readFile(new URL("../app/cypress-tree.tsx", import.meta.url), "utf8");
  for (const mode of ["autoplay", "late", "during", "already-played"]) {
    const initiallyRunning = mode === "autoplay" || mode === "already-played";
    const storage = new Map(mode === "already-played" ? [["portfolio:welcome-wind-played", "true"]] : []);
    let now = 0;
    let id = 0;
    const timers = new Map();
    const events = new EventTarget();
    const impacts = [];
    const sounds = [];
    const gusts = [];
    const window = {
      sessionStorage: { getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value) },
      addEventListener: events.addEventListener.bind(events),
      removeEventListener: events.removeEventListener.bind(events),
      dispatchEvent: events.dispatchEvent.bind(events),
      matchMedia: () => ({ matches: false }),
      innerWidth: 1000,
      setTimeout: (callback, delay) => { timers.set(++id, { callback, at: now + delay }); return id; },
      clearTimeout: key => timers.delete(key),
      AudioContext: class {
        state = initiallyRunning ? "running" : "suspended";
        destination = {};
        resume() { this.state = "running"; return Promise.resolve(); }
        decodeAudioData() { return Promise.resolve({ duration: 4 }); }
      },
    };
    const scope = vm.createContext({
      window, Event, CustomEvent,
      document: { hidden: false, documentElement: { dataset: { meadowPresent: "true" } } },
      performance: { now: () => now },
      fetch: async () => ({ ok: true, arrayBuffer: async () => new ArrayBuffer(1) }),
      setShowWindControl() {},
      playWindSound(context, buffer, offset) { sounds.push({ at: now, offset }); return {}; },
      treeRef: { current: { applyGust() { impacts.push(now); } } },
      latestWind: { current: { breeze: 0.2, gust: 0.2 } },
      latestPlaying: { current: true },
      canvasRef: { current: { getBoundingClientRect: () => ({ left: 700, width: 200 }) } },
      WELCOME_TRAVEL_MS: 3200, WELCOME_BREEZE_DELAY: 500,
      WELCOME_BREEZE_STRENGTH: 0.78, WELCOME_BREEZE_DURATION: 1450,
      STRONG_AMBIENT_WIND_THRESHOLD: 0.58, MEADOW_GUST_EVENT: "portfolio:meadow-gust",
    });
    events.addEventListener("portfolio:meadow-gust", () => gusts.push(now));
    const soundEffect = sound.slice(sound.indexOf("    const reducedMotion"), sound.indexOf("    addDeclarativeInteractionCues(document)"));
    const treeEffect = tree.slice(tree.indexOf("    let treeArrivalTimer"), tree.indexOf("    return () => {", tree.indexOf("    let treeArrivalTimer")));
    const visitGuard = sound.slice(sound.indexOf("const WIND_VISIT_KEY"), sound.indexOf("const actionableSelector"));
    for (const code of [visitGuard, soundEffect, treeEffect]) {
      vm.runInContext(ts.transpileModule(code, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText, scope);
    }
    await new Promise(resolve => setImmediate(resolve));
    const advance = until => {
      while (true) {
        const next = [...timers].filter(([, value]) => value.at <= until).sort((a, b) => a[1].at - b[1].at)[0];
        if (!next) break;
        timers.delete(next[0]);
        now = next[1].at;
        next[1].callback();
      }
      now = until;
    };
    advance(500);
    assert.deepEqual(gusts, [500]);
    assert.deepEqual(sounds, []);
    advance(3060);
    assert.deepEqual(impacts, [3060]);
    assert.deepEqual(sounds, mode === "autoplay" ? [{ at: 2710, offset: 0 }] : []);
    if (!initiallyRunning) {
      advance(mode === "during" ? 3200 : 6000);
      events.dispatchEvent(new Event("pointerdown"));
      await new Promise(resolve => setImmediate(resolve));
      assert.deepEqual(gusts, [500], "unlocking must never replay the gust");
      assert.deepEqual(sounds, mode === "during" ? [{ at: 3200, offset: 0.49 }] : []);
      advance(8560);
      assert.deepEqual(impacts, [3060]);
      events.dispatchEvent(new Event("pointerdown"));
      await new Promise(resolve => setImmediate(resolve));
      assert.equal(gusts.length, 1, "later clicks must not replay the welcome");
    }
    const count = sounds.length;
    events.dispatchEvent(new Event("portfolio:welcome-gust-sound"));
    assert.equal(sounds.length, count, "duplicate cues must not sound twice");
    if (count) {
      assert.equal(storage.get("portfolio:welcome-wind-played"), "true");
      vm.runInContext(ts.transpileModule("(() => {" + soundEffect + "})()", { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText, scope);
      await new Promise(resolve => setImmediate(resolve));
      events.dispatchEvent(new Event("portfolio:welcome-gust-sound"));
      assert.equal(sounds.length, count, "remounts must retain the visit guard");
    }
  }
});
