import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import ts from "typescript";

test("wind audio starts at tree impact; blocked audio replays the gust before sounding", async () => {
  const sound = await readFile(new URL("../app/soundscape.tsx", import.meta.url), "utf8");
  const tree = await readFile(new URL("../app/cypress-tree.tsx", import.meta.url), "utf8");
  for (const initiallyRunning of [true, false]) {
    let now = 0;
    let id = 0;
    const timers = new Map();
    const events = new EventTarget();
    const impacts = [];
    const sounds = [];
    const gusts = [];
    const window = {
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
        decodeAudioData() { return Promise.resolve({}); }
      },
    };
    const scope = vm.createContext({
      window, Event, CustomEvent,
      document: { hidden: false, documentElement: { dataset: { meadowPresent: "true" } } },
      performance: { now: () => now },
      fetch: async () => ({ ok: true, arrayBuffer: async () => new ArrayBuffer(1) }),
      setShowWindControl() {},
      playWindSound() { sounds.push(now); return {}; },
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
    for (const code of [soundEffect, treeEffect]) {
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
    assert.deepEqual(sounds, initiallyRunning ? [3060] : []);
    if (!initiallyRunning) {
      advance(6000);
      events.dispatchEvent(new Event("pointerdown"));
      await new Promise(resolve => setImmediate(resolve));
      assert.deepEqual(gusts, [500, 6000]);
      assert.deepEqual(sounds, [], "unlocking audio must not play it out of sync");
      advance(8560);
      assert.deepEqual(sounds, [8560]);
      assert.deepEqual(impacts, [3060, 8560]);
      events.dispatchEvent(new Event("pointerdown"));
      await new Promise(resolve => setImmediate(resolve));
      assert.equal(gusts.length, 2, "later clicks must not replay the welcome");
    }
  }
});
