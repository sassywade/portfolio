import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import test from "node:test";
import { transpileModule, ModuleKind } from "typescript";

async function load(file, context) {
  const source = await readFile(new URL(`../app/${file}`, import.meta.url), "utf8");
  const exports = {};
  runInNewContext(transpileModule(source, { compilerOptions: { module: ModuleKind.CommonJS } }).outputText, { exports, ...context });
  return exports;
}

test("touch scrolling on the homepage is fully native with no swipe capture", async () => {
  const source = await readFile(new URL("../app/work-scroll.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(source, /touchstart|touchmove|touchend|touchcancel|TouchEvent/, "no touch listener can prevent or script a swipe");
  assert.doesNotMatch(source, /pointer: coarse/, "no coarse-pointer branch owns the hero swipe");

  const events = new Map();
  const frames = new Map();
  let nextFrame = 0;
  let cleanup;
  const reduced = { matches: false, addEventListener() {}, removeEventListener() {} };
  const desktop = { matches: false, addEventListener() {}, removeEventListener() {} };
  const win = {
    innerHeight: 800, scrollY: 0,
    matchMedia: query => query.includes("reduced-motion") ? reduced : desktop,
    addEventListener: (name, callback, options) => events.set(name, { callback, options }),
    removeEventListener: name => events.delete(name),
    clearTimeout() {}, setTimeout() {},
    scrollTo: ({ top }) => { win.scrollY = top; },
  };
  class Target {
    parentElement = null;
    closest() { return null; }
  }
  const sections = [{ getBoundingClientRect: () => ({ top: 1100 - win.scrollY, height: 650 }) }];
  const { WorkScroll } = await load("work-scroll.tsx", {
    require: () => ({ useEffect: fn => { cleanup = fn(); } }),
    window: win,
    document: {
      documentElement: { dataset: {} }, body: {}, querySelectorAll: () => sections, getElementById: () => ({}),
      addEventListener() {}, removeEventListener() {},
    },
    Element: Target, getComputedStyle: () => ({ overflowY: "visible" }),
    location: { hash: "" }, performance: { now: () => 0 },
    requestAnimationFrame: callback => { frames.set(++nextFrame, callback); return nextFrame; },
    cancelAnimationFrame: id => frames.delete(id),
  });
  WorkScroll();
  for (const name of ["touchstart", "touchmove", "touchend", "touchcancel"]) {
    assert.equal(events.has(name), false, `${name} is never listened to, so the phone follows the finger`);
  }
  // A phone's trackpad-like wheel events (not a fine desktop pointer) stay native too.
  let captured = 0;
  events.get("wheel").callback({ deltaY: 40, deltaX: 0, cancelable: true, target: new Target(), preventDefault: () => captured++ });
  assert.equal(captured, 0, "touch layouts never scrolljack the hero");
  assert.equal(frames.size, 0, "no scripted scroll starts on a touch layout");
  cleanup();
  assert.equal(events.size, 0);
});

test("tilt is shared, permission starts synchronously on tap, denial is retryable, and axes follow rotation", async () => {
  const cleanups = [];
  const events = new Map();
  const documentEvents = new Map();
  const touch = { matches: true };
  const reduced = { matches: false };
  let requests = 0;
  let answer;
  const win = {
    DeviceOrientationEvent: { requestPermission: () => { requests++; return new Promise(resolve => { answer = resolve; }); } },
    matchMedia: query => query.includes("reduced-motion") ? reduced : touch,
    screen: { orientation: { angle: 0 } },
    addEventListener: (name, callback) => events.set(name, callback),
    removeEventListener: name => events.delete(name),
  };
  const doc = {
    hidden: false,
    addEventListener: (name, callback) => documentEvents.set(name, callback),
    removeEventListener: name => documentEvents.delete(name),
  };
  const api = await load("device-tilt.ts", { require: () => ({ useEffect: effect => cleanups.push(effect()) }), window: win, document: doc });
  api.useDeviceTilt(); api.useDeviceTilt();
  assert.equal(requests, 0, "the default backpacker never opens an iOS permission prompt");
  api.armDeviceTilt(); api.armDeviceTilt();
  assert.equal(requests, 1, "permission starts in the tap, and pending requests are deduplicated");
  answer("denied");
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(events.size, 0);
  api.armDeviceTilt();
  assert.equal(requests, 2);
  answer("granted");
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(events.size, 2, "the two actors share one orientation and one rotation listener");
  events.get("deviceorientation")({ beta: 0, gamma: 30 });
  assert.equal(api.readDeviceTilt(), 1);
  events.get("deviceorientation")({ beta: 0, gamma: -30 });
  assert.equal(api.readDeviceTilt(), -1);
  assert.equal(api.screenTilt(0, 4, 0), 0, "small hand tremors remain neutral");
  assert.equal(api.screenTilt(30, 0, 90), 1);
  assert.equal(api.screenTilt(30, 0, 270), -1);
  assert.equal(api.screenTilt(0, 30, 180), -1);
  assert.equal(api.screenTilt(null, 30, 0), 0);
  assert.equal(api.screenTilt(0, NaN, 0), 0);
  reduced.matches = true;
  assert.equal(api.readDeviceTilt(), 0);
  reduced.matches = false;
  touch.matches = false;
  assert.equal(api.readDeviceTilt(), 0);
  touch.matches = true;
  doc.hidden = true;
  documentEvents.get("visibilitychange")();
  doc.hidden = false;
  assert.equal(api.readDeviceTilt(), 0, "returning to the page does not replay a stale lean");
  cleanups[0]();
  assert.equal(events.size, 2);
  cleanups[1]();
  assert.equal(events.size, 0);
  assert.equal(documentEvents.size, 0);
  win.DeviceOrientationEvent = undefined;
  assert.doesNotThrow(() => api.armDeviceTilt());
});
