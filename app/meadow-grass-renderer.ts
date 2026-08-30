import type { WindSettings } from "./wind";

type GrassRendererOptions = {
  canvas: HTMLCanvasElement;
  assetUrl: string;
  wind: WindSettings;
  autoplay?: boolean;
};

type Rgb = {
  r: number;
  g: number;
  b: number;
};

type GrassBlade = {
  offset: number;
  height: number;
  curve: number;
  weight: number;
};

type GrassTuft = {
  x: number;
  y: number;
  size: number;
  spread: number;
  depth: number;
  phase: number;
  response: number;
  color: Rgb;
  alpha: number;
  blades: GrassBlade[];
};

type WindPatch = {
  offset: number;
  depth: number;
  speed: number;
  width: number;
  height: number;
  phase: number;
  strength: number;
};

const FRAME_INTERVAL = 1000 / 30;
const READY_CLASS = "is-grass-live";
const DEFAULT_GRASS = { r: 111, g: 123, b: 43 };

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

function adjustColor(color: Rgb, lift: number, warmth = 0): Rgb {
  const adjust = (channel: number) => (
    lift >= 0 ? channel + (255 - channel) * lift : channel * (1 + lift)
  );

  return {
    r: clamp(Math.round(adjust(color.r) + warmth), 18, 225),
    g: clamp(Math.round(adjust(color.g) + warmth * 0.45), 24, 226),
    b: clamp(Math.round(adjust(color.b) - warmth * 0.3), 8, 176),
  };
}

function rgba(color: Rgb, alpha: number) {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
}

export function createMeadowGrass(options: GrassRendererOptions) {
  const { canvas } = options;
  const context = canvas.getContext("2d", { alpha: true, desynchronized: true });
  if (!context) throw new Error("The meadow grass layer needs a 2D canvas context.");

  const host = canvas.parentElement;
  const paintedBase = document.createElement("canvas");
  const paintedContext = paintedBase.getContext("2d", { alpha: true });
  if (!paintedContext) throw new Error("The meadow grass layer needs an offscreen canvas context.");

  const image = new Image();
  image.decoding = "async";
  image.src = options.assetUrl;

  const wind: WindSettings = { ...options.wind };
  let sourcePixels: Uint8ClampedArray | null = null;
  let sourceWidth = 0;
  let sourceHeight = 0;
  let surfaceByColumn = new Float32Array(0);
  let tufts: GrassTuft[] = [];
  let windPatches: WindPatch[] = [];
  let width = 1;
  let height = 1;
  let dpr = 1;
  let elapsed = 0;
  let lastFrame = performance.now();
  let lastDraw = 0;
  let frameHandle = 0;
  let running = options.autoplay !== false;
  let inView = true;
  let baseReady = false;
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
        let surface = Math.floor(sourceHeight * 0.52);
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
    return height * (0.79 + Math.sin(normalizedX * Math.PI) * 0.08);
  }

  function sourceColorAt(x: number, y: number): Rgb {
    if (!sourcePixels) return DEFAULT_GRASS;
    const sourceX = clamp(Math.round((x / width) * (sourceWidth - 1)), 0, sourceWidth - 1);
    const sourceY = clamp(Math.round((y / height) * (sourceHeight - 1)), 0, sourceHeight - 1);
    const offset = (sourceY * sourceWidth + sourceX) * 4;

    if (sourcePixels[offset + 3] < 24) return DEFAULT_GRASS;
    return {
      r: sourcePixels[offset],
      g: sourcePixels[offset + 1],
      b: sourcePixels[offset + 2],
    };
  }

  function traceMeadow(target: CanvasRenderingContext2D) {
    target.beginPath();
    target.moveTo(0, surfaceAt(0));
    const step = Math.max(5, width / 220);
    for (let x = step; x < width; x += step) target.lineTo(x, surfaceAt(x));
    target.lineTo(width, surfaceAt(width));
    target.lineTo(width, height);
    target.lineTo(0, height);
    target.closePath();
  }

  // The original transparent painting remains the ground truth. The canvas owns it
  // only so the animated light and tuft layers share one clean alpha silhouette.
  function buildPainterlyBase() {
    paintedBase.width = canvas.width;
    paintedBase.height = canvas.height;
    paintedContext.setTransform(dpr, 0, 0, dpr, 0, 0);
    paintedContext.clearRect(0, 0, width, height);
    paintedContext.imageSmoothingEnabled = true;
    paintedContext.imageSmoothingQuality = "high";
    paintedContext.drawImage(image, 0, 0, width, height);
    baseReady = true;
  }

  function makeBladeSet(random: () => number, count: number): GrassBlade[] {
    return Array.from({ length: count }, (_, index) => {
      const position = count === 1 ? 0 : index / (count - 1) - 0.5;
      const centerBias = 1 - Math.abs(position) * 0.28;
      return {
        offset: position + mix(-0.08, 0.08, random()),
        height: centerBias * mix(0.72, 1.08, random()),
        curve: mix(-0.16, 0.16, random()),
        weight: mix(0.72, 1.16, random()),
      };
    });
  }

  function makeTuft(
    x: number,
    y: number,
    depth: number,
    edge: boolean,
    random: () => number,
  ): GrassTuft {
    const sampled = sourceColorAt(x, Math.min(height - 1, y + 2));
    const lift = mix(-0.16, 0.16, random()) + (edge ? 0.05 : 0);
    const color = adjustColor(sampled, lift, mix(-3, 5, random()));
    const bladeCount = edge ? 3 + Math.floor(random() * 3) : 2 + Math.floor(random() * 4);
    const perspectiveSize = mix(2.4, 8.2, Math.pow(depth, 0.72));

    return {
      x,
      y,
      size: edge ? mix(4.2, 8.5, random()) : perspectiveSize * mix(0.78, 1.18, random()),
      spread: edge ? mix(4.4, 8.8, random()) : mix(3.2, 7.6, depth) * mix(0.78, 1.18, random()),
      depth,
      phase: random() * Math.PI * 2,
      response: mix(0.72, 1.2, random()),
      color,
      alpha: edge ? mix(0.42, 0.68, random()) : mix(0.18, 0.46, depth) * mix(0.75, 1, random()),
      blades: makeBladeSet(random, bladeCount),
    };
  }

  function buildTuftClusters() {
    const random = seededRandom(73129 + Math.round(width));
    const lowPower = typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 4;
    const density = lowPower ? 0.68 : 1;
    const nextTufts: GrassTuft[] = [];

    // Sparse bunches break up the hill silhouette without tracing it like hair.
    const edgeClusters = clamp(Math.round((width / 48) * density), 20, 38);
    for (let index = 0; index < edgeClusters; index += 1) {
      const centerX = ((index + mix(0.08, 0.92, random())) / edgeClusters) * width;
      const bunchSize = 1 + Math.floor(random() * 3);
      for (let member = 0; member < bunchSize; member += 1) {
        const x = clamp(centerX + mix(-8, 8, random()), 1, width - 1);
        nextTufts.push(makeTuft(x, surfaceAt(x) + mix(0.8, 2.6, random()), 0.05, true, random));
      }
    }

    // Tufts live in loose families; open patches are as important as grassy ones.
    const fieldClusters = clamp(Math.round((width * 0.078) * density), 58, 126);
    for (let index = 0; index < fieldClusters; index += 1) {
      const centerX = random() * width;
      const centerDepth = mix(0.08, 0.98, Math.pow(random(), 0.82));
      const familySize = 2 + Math.floor(random() * 4);
      for (let member = 0; member < familySize; member += 1) {
        const x = clamp(centerX + mix(-18, 18, random()) * (0.55 + centerDepth), 1, width - 1);
        const surface = surfaceAt(x);
        const depth = clamp(centerDepth + mix(-0.07, 0.07, random()), 0.06, 1);
        const y = surface + 5 + depth * Math.max(2, height - surface - 7);
        nextTufts.push(makeTuft(x, Math.min(height - 1, y), depth, false, random));
      }
    }

    tufts = nextTufts.sort((a, b) => a.y - b.y);
    windPatches = Array.from({ length: lowPower ? 4 : 6 }, (_, index) => ({
      offset: random(),
      depth: mix(0.18, 0.88, random()),
      speed: mix(0.018, 0.038, random()),
      width: mix(0.13, 0.24, random()),
      height: mix(0.034, 0.078, random()),
      phase: random() * Math.PI * 2,
      strength: mix(0.66, 1, random()) * (index % 2 ? 0.86 : 1),
    }));
  }

  function buildScene() {
    buildPainterlyBase();
    buildTuftClusters();
  }

  function resize(force = false) {
    const bounds = canvas.getBoundingClientRect();
    const nextWidth = Math.max(1, bounds.width || canvas.clientWidth || 1);
    const nextHeight = Math.max(1, bounds.height || canvas.clientHeight || 1);
    const unchanged = Math.abs(nextWidth - width) < 0.5 && Math.abs(nextHeight - height) < 0.5;
    if (!force && unchanged && tufts.length) return;

    width = nextWidth;
    height = nextHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (image.naturalWidth) {
      buildScene();
      draw();
    } else {
      context.clearRect(0, 0, width, height);
    }
  }

  function waveAt(tuft: GrassTuft, time: number) {
    const normalizedX = tuft.x / Math.max(1, width);
    const travel = time * (0.42 + wind.tempo * 0.58) - normalizedX * 5.1 - tuft.depth * 0.54;
    const broadWave = 0.5 + 0.5 * Math.sin(travel + tuft.phase * 0.09);
    const secondaryWave = 0.5 + 0.5 * Math.sin(travel * 0.53 + tuft.phase * 0.17 + 1.4);
    const rawGust = Math.max(0, Math.sin(time * (0.3 + wind.tempo * 0.28) - normalizedX * 3.4));
    const gustEnvelope = rawGust * rawGust * rawGust * rawGust;
    return {
      broadWave,
      secondaryWave,
      gustEnvelope,
    };
  }

  function drawWindBands(time: number) {
    if (!windPatches.length) return;
    context.save();
    traceMeadow(context);
    context.clip();

    const breezeVisibility = 0.46 + wind.breeze * 0.54;
    windPatches.forEach((patch, index) => {
      const cycle = 1.34;
      const progress = (patch.offset + time * patch.speed * (0.7 + wind.tempo * 0.9)) % cycle;
      const x = (progress - 0.17) * width;
      const surface = surfaceAt(clamp(x, 0, width));
      const y = surface + patch.depth * Math.max(4, height - surface);
      const pulse = 0.72 + 0.28 * Math.sin(time * 0.48 + patch.phase);
      const radiusX = width * patch.width * (0.9 + wind.gust * 0.2);
      const radiusY = height * patch.height;
      const light = index % 2 === 0;

      context.save();
      context.translate(x, y);
      context.rotate(-0.055 + Math.sin(patch.phase) * 0.025);
      context.scale(radiusX, radiusY);
      const gradient = context.createRadialGradient(-0.18, -0.16, 0.04, 0, 0, 1);
      const alpha = (light ? 0.048 : 0.032) * breezeVisibility * pulse * patch.strength;
      if (light) {
        context.globalCompositeOperation = "screen";
        gradient.addColorStop(0, `rgba(244, 232, 137, ${alpha})`);
        gradient.addColorStop(0.52, `rgba(226, 220, 113, ${alpha * 0.58})`);
      } else {
        context.globalCompositeOperation = "multiply";
        gradient.addColorStop(0, `rgba(45, 67, 21, ${alpha})`);
        gradient.addColorStop(0.52, `rgba(59, 77, 24, ${alpha * 0.54})`);
      }
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(0, 0, 1, 0, Math.PI * 2);
      context.fill();
      context.restore();
    });

    context.restore();
  }

  function drawTufts(time: number) {
    context.lineCap = "round";
    context.lineJoin = "round";

    tufts.forEach((tuft) => {
      const wave = waveAt(tuft, time);
      const localWind = (
        0.025
        + wind.breeze * (0.055 + wave.broadWave * 0.105)
        + wind.gust * wave.gustEnvelope * (0.1 + wave.secondaryWave * 0.13)
      ) * tuft.response;
      const depthFade = mix(0.78, 1, tuft.depth);

      context.beginPath();
      tuft.blades.forEach((blade) => {
        const rootX = tuft.x + blade.offset * tuft.spread;
        const rootY = tuft.y + Math.abs(blade.offset) * tuft.size * 0.08;
        const bladeHeight = tuft.size * blade.height;
        const naturalCurve = blade.curve * 0.1;
        const lean = clamp(localWind + naturalCurve, -0.04, 0.42);
        const tipX = rootX + bladeHeight * lean;
        const tipY = rootY - bladeHeight * (1 - Math.abs(lean) * 0.07);
        const controlX = rootX + bladeHeight * (lean * 0.42 - blade.curve * 0.035);
        const controlY = rootY - bladeHeight * 0.57;
        context.moveTo(rootX, rootY);
        context.quadraticCurveTo(controlX, controlY, tipX, tipY);
      });

      context.lineWidth = mix(0.48, 1.12, tuft.depth) * depthFade;
      context.strokeStyle = rgba(tuft.color, tuft.alpha);
      context.stroke();

      // A short grounded shadow binds each tuft to the painted field.
      if (tuft.depth > 0.2) {
        context.beginPath();
        context.moveTo(tuft.x - tuft.spread * 0.35, tuft.y + 0.6);
        context.quadraticCurveTo(
          tuft.x + tuft.spread * 0.15,
          tuft.y + 1.2,
          tuft.x + tuft.spread * (0.42 + localWind * 0.2),
          tuft.y + 0.7,
        );
        context.lineWidth = mix(0.45, 0.9, tuft.depth);
        context.strokeStyle = "rgba(43, 61, 18, 0.12)";
        context.stroke();
      }
    });
  }

  function draw() {
    context.clearRect(0, 0, width, height);
    if (!baseReady) return;

    context.globalCompositeOperation = "source-over";
    context.drawImage(paintedBase, 0, 0, width, height);
    const time = elapsed * 0.001;
    drawWindBands(time);
    context.globalCompositeOperation = "source-over";
    drawTufts(time);

    host?.classList.add(READY_CLASS);
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
      draw();
    }
    frameHandle = requestAnimationFrame(frame);
  }

  function setWind(values: Partial<WindSettings>) {
    (Object.keys(wind) as Array<keyof WindSettings>).forEach((key) => {
      const value = values[key];
      if (typeof value === "number" && Number.isFinite(value)) wind[key] = clamp(value, 0, 1);
    });
    if (!running) draw();
    return { ...wind };
  }

  function setPlaying(next: boolean) {
    running = Boolean(next);
    if (running) schedule();
    else {
      cancelAnimationFrame(frameHandle);
      frameHandle = 0;
      draw();
    }
    return running;
  }

  const resizeObserver = new ResizeObserver(() => resize());
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
    resize(true);
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
      host?.classList.remove(READY_CLASS);
    },
  };
}
