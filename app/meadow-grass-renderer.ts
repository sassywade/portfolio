import type { WindSettings } from "./wind";

type GrassRendererOptions = {
  canvas: HTMLCanvasElement;
  assetUrl: string;
  wind: WindSettings;
  autoplay?: boolean;
};

type Blade = {
  x: number;
  y: number;
  height: number;
  phase: number;
  response: number;
  stiffness: number;
  damping: number;
  maxBend: number;
  bend: number;
  velocity: number;
  color: number;
  layer: number;
  width: number;
};

const FRAME_INTERVAL = 1000 / 30;
const PALETTE_FACTORS = [0.56, 0.7, 0.84, 0.98, 1.1, 1.2];
const PALETTE_ALPHA = [0.5, 0.56, 0.62, 0.68, 0.62, 0.54];

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const mix = (start: number, end: number, amount: number) => start + (end - start) * amount;

function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

export function createMeadowGrass(options: GrassRendererOptions) {
  const { canvas } = options;
  const context = canvas.getContext("2d", { alpha: true, desynchronized: true });
  if (!context) throw new Error("The meadow grass layer needs a 2D canvas context.");

  const image = new Image();
  image.decoding = "async";
  image.src = options.assetUrl;

  const wind: WindSettings = { ...options.wind };
  let sourcePixels: Uint8ClampedArray | null = null;
  let sourceWidth = 0;
  let sourceHeight = 0;
  let surfaceByColumn = new Float32Array(0);
  let blades: Blade[] = [];
  let groups: Blade[][] = [];
  let groupWidths: number[] = [];
  let palette: string[] = [];
  let width = 1;
  let height = 1;
  let dpr = 1;
  let elapsed = 0;
  let lastFrame = performance.now();
  let lastDraw = 0;
  let frameHandle = 0;
  let running = options.autoplay !== false;
  let inView = true;
  let destroyed = false;

  function prepareSource() {
    if (!image.naturalWidth || !image.naturalHeight) return;
    const source = document.createElement("canvas");
    source.width = image.naturalWidth;
    source.height = image.naturalHeight;
    const sourceContext = source.getContext("2d", { willReadFrequently: true });
    if (!sourceContext) return;

    sourceContext.drawImage(image, 0, 0);
    try {
      sourcePixels = sourceContext.getImageData(0, 0, source.width, source.height).data;
      sourceWidth = source.width;
      sourceHeight = source.height;
      surfaceByColumn = new Float32Array(sourceWidth);

      for (let x = 0; x < sourceWidth; x += 1) {
        let surface = Math.floor(sourceHeight * 0.62);
        for (let y = surface; y < sourceHeight; y += 1) {
          if (sourcePixels[(y * sourceWidth + x) * 4 + 3] > 28) {
            surface = y;
            break;
          }
        }
        surfaceByColumn[x] = surface / sourceHeight;
      }
    } catch {
      sourcePixels = null;
    }
  }

  function surfaceAt(x: number) {
    if (surfaceByColumn.length) {
      const sourceX = clamp(Math.round((x / width) * (sourceWidth - 1)), 0, sourceWidth - 1);
      return surfaceByColumn[sourceX] * height;
    }

    const normalizedX = x / width;
    const centerDip = Math.sin(normalizedX * Math.PI) * 0.09;
    return height * (0.78 + centerDip);
  }

  function sourceColorAt(x: number, y: number) {
    if (!sourcePixels) return { r: 111, g: 123, b: 43, luminance: 112 };
    const sourceX = clamp(Math.round((x / width) * (sourceWidth - 1)), 0, sourceWidth - 1);
    const sourceY = clamp(Math.round((y / height) * (sourceHeight - 1)), 0, sourceHeight - 1);
    const offset = (sourceY * sourceWidth + sourceX) * 4;
    const r = sourcePixels[offset];
    const g = sourcePixels[offset + 1];
    const b = sourcePixels[offset + 2];
    return { r, g, b, luminance: r * 0.24 + g * 0.68 + b * 0.08 };
  }

  function buildPalette() {
    let red = 0;
    let green = 0;
    let blue = 0;
    let samples = 0;

    if (sourcePixels) {
      for (let y = Math.floor(sourceHeight * 0.72); y < sourceHeight; y += 17) {
        for (let x = 0; x < sourceWidth; x += 19) {
          const offset = (y * sourceWidth + x) * 4;
          if (sourcePixels[offset + 3] < 120) continue;
          red += sourcePixels[offset];
          green += sourcePixels[offset + 1];
          blue += sourcePixels[offset + 2];
          samples += 1;
        }
      }
    }

    const base = samples
      ? { r: red / samples, g: green / samples, b: blue / samples }
      : { r: 111, g: 123, b: 43 };

    palette = PALETTE_FACTORS.map((factor, index) => {
      const warmth = index > 3 ? (index - 3) * 2.5 : 0;
      const r = clamp(Math.round(base.r * factor + warmth), 24, 196);
      const g = clamp(Math.round(base.g * factor + warmth), 38, 202);
      const b = clamp(Math.round(base.b * factor), 12, 126);
      return `rgba(${r}, ${g}, ${b}, ${PALETTE_ALPHA[index]})`;
    });
  }

  function colorIndexFor(x: number, y: number, random: () => number) {
    const sampled = sourceColorAt(x, y);
    const normalized = clamp((sampled.luminance - 44) / 126, 0, 1);
    return clamp(Math.round(normalized * 4 + random() * 1.4 - 0.35), 0, palette.length - 1);
  }

  function createBlade(
    x: number,
    y: number,
    bladeHeight: number,
    layer: number,
    random: () => number,
  ): Blade {
    return {
      x,
      y,
      height: bladeHeight,
      phase: random() * Math.PI * 2,
      response: mix(0.72, 1.22, random()),
      stiffness: mix(8.2, 13.8, random()),
      damping: mix(4.2, 6.6, random()),
      maxBend: mix(0.34, 0.58, random()),
      bend: mix(-0.025, 0.035, random()),
      velocity: 0,
      color: colorIndexFor(x, y, random),
      layer,
      width: layer === 2 ? mix(0.68, 1.08, random()) : mix(0.42, 0.86, random()),
    };
  }

  function buildScene() {
    const random = seededRandom(29417 + Math.round(width));
    const lowPower = typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 4;
    const density = lowPower ? 0.72 : 1;
    const edgeCount = clamp(Math.round(width * 0.86 * density), 420, 1180);
    const fieldCount = clamp(Math.round(width * 0.7 * density), 360, 980);
    const nextBlades: Blade[] = [];

    for (let index = 0; index < edgeCount; index += 1) {
      const x = ((index + random()) / edgeCount) * width;
      const surface = surfaceAt(x);
      const baseY = surface + mix(0.5, 5.2, random());
      const bladeHeight = mix(6.5, 16.5, Math.pow(random(), 0.72));
      nextBlades.push(createBlade(x, baseY, bladeHeight, 2, random));
    }

    for (let index = 0; index < fieldCount; index += 1) {
      const x = random() * width;
      const surface = surfaceAt(x);
      const availableDepth = Math.max(8, height - surface - 2);
      const depth = Math.pow(random(), 1.55);
      const baseY = surface + 4 + depth * availableDepth;
      const perspective = 1 - depth;
      const bladeHeight = mix(2.2, 10.5, perspective) + random() * (1.5 + perspective * 2.8);
      const layer = depth < 0.42 ? 1 : 0;
      nextBlades.push(createBlade(x, Math.min(height - 1, baseY), bladeHeight, layer, random));
    }

    blades = nextBlades;
    groups = Array.from({ length: 18 }, () => []);
    blades.forEach((blade) => groups[blade.layer * 6 + blade.color].push(blade));
    groupWidths = groups.map((group) => (
      group.length ? group.reduce((sum, blade) => sum + blade.width, 0) / group.length : 0.7
    ));
  }

  function resize() {
    const bounds = canvas.getBoundingClientRect();
    const nextWidth = Math.max(1, bounds.width || canvas.clientWidth || 1);
    const nextHeight = Math.max(1, bounds.height || canvas.clientHeight || 1);
    if (Math.abs(nextWidth - width) < 0.5 && Math.abs(nextHeight - height) < 0.5 && blades.length) return;

    width = nextWidth;
    height = nextHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildPalette();
    buildScene();
    draw(0, false);
  }

  function updateBlade(blade: Blade, deltaSeconds: number) {
    const time = elapsed * 0.001;
    const normalizedX = blade.x / Math.max(1, width);
    const localTime = time * (0.75 + wind.tempo * 0.7) - normalizedX * 1.6;
    const swell = 0.56 + 0.44 * Math.sin(localTime * 1.27 + blade.phase);
    const gustWave = Math.max(0, Math.sin(localTime * (0.64 + wind.tempo * 0.35) - blade.phase * 0.1));
    const gustPulse = Math.pow(gustWave, 6);
    const turbulence = 0.72 + 0.28 * Math.sin(localTime * 2.35 + blade.phase * 1.7);
    const fineOscillation = Math.sin(time * (1.8 + wind.tempo * 1.9) + blade.phase + normalizedX * 4.2);
    const drive = (0.012 + wind.breeze * 0.17 * blade.response) * swell * turbulence
      + wind.gust * gustPulse * 0.39 * blade.response
      + fineOscillation * (0.008 + wind.breeze * 0.027);
    const target = clamp(drive, -blade.maxBend, blade.maxBend);
    const stiffness = blade.stiffness * (1.18 - wind.elasticity * 0.38);
    const damping = blade.damping * (1.12 - wind.elasticity * 0.22);

    blade.velocity += ((target - blade.bend) * stiffness - blade.velocity * damping) * deltaSeconds;
    blade.bend = clamp(blade.bend + blade.velocity * deltaSeconds, -blade.maxBend, blade.maxBend);
  }

  function draw(deltaSeconds: number, updatePhysics = true) {
    context.clearRect(0, 0, width, height);
    context.lineCap = "round";
    context.lineJoin = "round";

    groups.forEach((group, groupIndex) => {
      if (!group.length) return;
      const layer = Math.floor(groupIndex / 6);
      const color = groupIndex % 6;
      context.beginPath();

      group.forEach((blade) => {
        if (updatePhysics) updateBlade(blade, deltaSeconds);
        const lean = Math.sin(blade.bend) * blade.height;
        const tipX = blade.x + lean;
        const tipY = blade.y - Math.cos(blade.bend) * blade.height;
        const shoulder = 0.43 + Math.sin(blade.phase) * 0.06;
        const controlX = blade.x + lean * shoulder;
        const controlY = blade.y - blade.height * 0.56;
        context.moveTo(blade.x, blade.y);
        context.quadraticCurveTo(controlX, controlY, tipX, tipY);
      });

      context.lineWidth = groupWidths[groupIndex] * (layer === 0 ? 0.86 : layer === 1 ? 0.96 : 1);
      context.strokeStyle = palette[color] || "rgba(94, 112, 35, .6)";
      context.stroke();
    });
  }

  function shouldAnimate() {
    return running && inView && !document.hidden && !destroyed;
  }

  function schedule() {
    if (!shouldAnimate() || frameHandle) return;
    lastFrame = performance.now();
    frameHandle = requestAnimationFrame(frame);
  }

  function frame(now: number) {
    frameHandle = 0;
    if (!shouldAnimate()) return;

    const sinceDraw = now - lastDraw;
    if (sinceDraw >= FRAME_INTERVAL) {
      const delta = Math.min(50, Math.max(1, now - lastFrame));
      lastFrame = now;
      lastDraw = now;
      elapsed += delta;
      draw(delta / 1000);
    }
    frameHandle = requestAnimationFrame(frame);
  }

  function setWind(values: Partial<WindSettings>) {
    (Object.keys(wind) as Array<keyof WindSettings>).forEach((key) => {
      const value = values[key];
      if (typeof value === "number" && Number.isFinite(value)) wind[key] = clamp(value, 0, 1);
    });
    if (!running) draw(0, false);
    return { ...wind };
  }

  function setPlaying(next: boolean) {
    running = Boolean(next);
    if (running) schedule();
    else {
      cancelAnimationFrame(frameHandle);
      frameHandle = 0;
      draw(0, false);
    }
    return running;
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);

  const intersectionObserver = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (inView) schedule();
    else {
      cancelAnimationFrame(frameHandle);
      frameHandle = 0;
    }
  }, { rootMargin: "120px 0px" });
  intersectionObserver.observe(canvas);

  const handleVisibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(frameHandle);
      frameHandle = 0;
    } else schedule();
  };
  document.addEventListener("visibilitychange", handleVisibility);

  const handleImageLoad = () => {
    prepareSource();
    blades = [];
    resize();
    schedule();
  };
  image.addEventListener("load", handleImageLoad);
  if (image.complete && image.naturalWidth) handleImageLoad();
  else resize();
  schedule();

  return {
    setWind,
    setPlaying,
    play: () => setPlaying(true),
    pause: () => setPlaying(false),
    resize,
    destroy: () => {
      destroyed = true;
      cancelAnimationFrame(frameHandle);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      image.removeEventListener("load", handleImageLoad);
    },
  };
}
