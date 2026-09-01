"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import {
  DEFAULT_ALAMO_STYLE,
  getAlamoStyle,
  type AlamoStyle,
} from "./alamo-styles";
import { AlamoWeather } from "./alamo-weather";
import { AsciiGarden, type AsciiGardenTheme } from "./ascii-garden";
import { type PortfolioAtmosphere } from "./atmospheres";
import { CypressTree } from "./cypress-tree";
import { Meadow, type FlatMeadowTexture, type MeadowVariant, type RollingMeadow } from "./meadow";
import { MeadowSettings } from "./meadow-prototype-controls";
import { DEFAULT_TOP_PET_MODE, type TopPetMode } from "./top-pet";
import { INITIAL_WIND, type WindKey, type WindSettings } from "./wind";

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const DEFAULT_FLAT_MEADOW_COLOR = "#6f8d45";
export type WorkGridColumns = 2 | 3;

export function HeroMeadow() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const sceneVisibleRef = useRef(true);
  const previousAtmosphereRef = useRef<PortfolioAtmosphere>("grid");
  const [wind, setWind] = useState<WindSettings>(INITIAL_WIND);
  const [isPlaying, setIsPlaying] = useState(() => (
    typeof window === "undefined"
      ? true
      : !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ));
  const [isSceneVisible, setIsSceneVisible] = useState(true);
  const [meadowVariant, setMeadowVariant] = useState<MeadowVariant>("living");
  const [rollingMeadow, setRollingMeadow] = useState<RollingMeadow>("original");
  const [flatMeadowTexture, setFlatMeadowTexture] = useState<FlatMeadowTexture>("fine");
  const [flatMeadowColor, setFlatMeadowColor] = useState(DEFAULT_FLAT_MEADOW_COLOR);
  const [meadowHeight, setMeadowHeight] = useState(100);
  const [atmosphere, setAtmosphere] = useState<PortfolioAtmosphere>("grid");
  const [workGridColumns, setWorkGridColumns] = useState<WorkGridColumns>(2);
  const [heroHighlights, setHeroHighlights] = useState(false);
  const [topPetMode, setTopPetMode] = useState<TopPetMode>(DEFAULT_TOP_PET_MODE);
  const [environmentStyle, setEnvironmentStyle] = useState<AlamoStyle>(DEFAULT_ALAMO_STYLE);
  const [asciiGardenTheme, setAsciiGardenTheme] = useState<AsciiGardenTheme>("dark");
  const environment = getAlamoStyle(environmentStyle);
  const isAsciiGarden = environmentStyle === "ascii-garden";
  const isStudioStatic = environmentStyle === "studio-static";

  useEffect(() => {
    document.documentElement.dataset.topPetMode = topPetMode;
    return () => delete document.documentElement.dataset.topPetMode;
  }, [topPetMode]);

  useEffect(() => {
    const scene = sceneRef.current;
    const shell = scene?.closest<HTMLElement>(".site-shell");
    if (!shell) return;

    shell.dataset.atmosphere = atmosphere;
    document.documentElement.dataset.atmosphere = atmosphere;

    return () => {
      delete shell.dataset.atmosphere;
      delete document.documentElement.dataset.atmosphere;
    };
  }, [atmosphere]);

  useEffect(() => {
    const scene = sceneRef.current;
    const shell = scene?.closest<HTMLElement>(".site-shell");
    if (!shell) return;

    shell.dataset.environmentStyle = environmentStyle;
    document.documentElement.dataset.environmentStyle = environmentStyle;

    return () => {
      delete shell.dataset.environmentStyle;
      delete document.documentElement.dataset.environmentStyle;
    };
  }, [environmentStyle]);

  useEffect(() => {
    const scene = sceneRef.current;
    const shell = scene?.closest<HTMLElement>(".site-shell");

    if (!isAsciiGarden) {
      delete document.documentElement.dataset.asciiGardenTheme;
      if (shell) delete shell.dataset.asciiGardenTheme;
      return;
    }

    document.documentElement.dataset.asciiGardenTheme = asciiGardenTheme;
    if (shell) shell.dataset.asciiGardenTheme = asciiGardenTheme;

    return () => {
      delete document.documentElement.dataset.asciiGardenTheme;
      if (shell) delete shell.dataset.asciiGardenTheme;
    };
  }, [asciiGardenTheme, isAsciiGarden]);

  useEffect(() => {
    document.documentElement.dataset.workColumns = String(workGridColumns);
    return () => delete document.documentElement.dataset.workColumns;
  }, [workGridColumns]);

  useEffect(() => {
    document.documentElement.dataset.heroHighlights = heroHighlights ? "true" : "false";
    return () => delete document.documentElement.dataset.heroHighlights;
  }, [heroHighlights]);

  useEffect(() => {
    if (!isStudioStatic) return;

    const interactiveCopy = document.querySelectorAll<HTMLElement>(
      ".pranathi-intro--home .hero-inline-action",
    );

    interactiveCopy.forEach((element) => {
      element.dataset.studioPreviousTabindex = element.getAttribute("tabindex") ?? "";
      element.setAttribute("tabindex", "-1");
      element.setAttribute("aria-disabled", "true");
    });

    return () => {
      interactiveCopy.forEach((element) => {
        const previousTabindex = element.dataset.studioPreviousTabindex;
        if (previousTabindex) element.setAttribute("tabindex", previousTabindex);
        else element.removeAttribute("tabindex");
        element.removeAttribute("aria-disabled");
        delete element.dataset.studioPreviousTabindex;
      });
    };
  }, [isStudioStatic]);

  useEffect(() => {
    const scene = sceneRef.current;
    const work = document.querySelector<HTMLElement>(".pranathi-work");
    if (!scene || !work) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let viewportHeight = Math.max(1, window.visualViewport?.height ?? window.innerHeight);
    let currentProgress = 0;
    let targetProgress = 0;
    let frameHandle = 0;
    let lastTime = 0;

    const setSceneVisibility = (next: boolean) => {
      if (sceneVisibleRef.current === next) return;
      sceneVisibleRef.current = next;
      setIsSceneVisible(next);
    };

    const commitProgress = (progress: number) => {
      currentProgress = clamp(progress, 0, 1);
      const smootherProgress = currentProgress * currentProgress * currentProgress
        * (currentProgress * (currentProgress * 6 - 15) + 10);
      const ceremonialProgress = Math.pow(smootherProgress, 1.08);
      const dissolveProgress = clamp((smootherProgress - 0.12) / 0.88, 0, 1);
      const treeDissolveProgress = clamp((dissolveProgress - 0.16) / 0.84, 0, 1);
      const exitDistance = viewportHeight + Math.max(120, viewportHeight * 0.18);
      const fadeProgress = clamp((currentProgress - 0.72) / 0.28, 0, 1);
      const softenedFade = fadeProgress * fadeProgress * (3 - 2 * fadeProgress);
      const dissolveEdge = -24 + dissolveProgress * 150;
      const dissolveEdgeOffsets = [0, 4, -2, 6, 1, -4, 3, -1];
      scene.style.setProperty("--meadow-exit-y", `${(ceremonialProgress * exitDistance).toFixed(2)}px`);
      scene.style.setProperty("--meadow-exit-scale", (1 - ceremonialProgress * 0.012).toFixed(4));
      scene.style.setProperty("--meadow-exit-opacity", (1 - softenedFade * 0.14).toFixed(4));
      scene.style.setProperty("--meadow-layer-y", `${(ceremonialProgress * 22).toFixed(2)}px`);
      scene.style.setProperty("--tree-layer-y", `${(ceremonialProgress * -30).toFixed(2)}px`);
      scene.style.setProperty(
        "--meadow-layer-opacity",
        (1 - Math.pow(dissolveProgress, 1.72)).toFixed(4),
      );
      scene.style.setProperty(
        "--tree-layer-opacity",
        (1 - Math.pow(treeDissolveProgress, 1.48)).toFixed(4),
      );
      scene.style.setProperty(
        "--meadow-dissolve-blur",
        `${(Math.pow(dissolveProgress, 1.3) * 2.8).toFixed(2)}px`,
      );
      scene.style.setProperty(
        "--tree-dissolve-blur",
        `${(Math.pow(treeDissolveProgress, 1.25) * 1.4).toFixed(2)}px`,
      );
      dissolveEdgeOffsets.forEach((offset, index) => {
        scene.style.setProperty(
          `--meadow-dissolve-edge-${index + 1}`,
          `${(dissolveEdge + offset).toFixed(2)}%`,
        );
      });
      scene.style.setProperty("--meadow-scroll-progress", currentProgress.toFixed(4));
      scene.dataset.scrollState = currentProgress <= 0.002
        ? "hero"
        : currentProgress >= 0.998
          ? "hidden"
          : "transitioning";

      if (currentProgress >= 0.998 && targetProgress >= 0.998) {
        setSceneVisibility(false);
      }
    };

    const calculateTarget = () => {
      viewportHeight = Math.max(1, window.visualViewport?.height ?? window.innerHeight);
      const scrollY = Math.max(0, window.scrollY);
      const workTop = work.getBoundingClientRect().top + scrollY;
      const transitionStart = Math.max(0, workTop - viewportHeight * 1.06);
      const transitionEnd = Math.max(transitionStart + 1, workTop - viewportHeight * 0.2);
      const progress = clamp(
        (scrollY - transitionStart) / Math.max(1, transitionEnd - transitionStart),
        0,
        1,
      );

      return reducedMotion.matches ? (progress >= 0.4 ? 1 : 0) : progress;
    };

    const animate = (now: number) => {
      frameHandle = 0;

      if (reducedMotion.matches) {
        commitProgress(targetProgress);
        return;
      }

      const delta = lastTime ? Math.min(48, now - lastTime) : 16;
      lastTime = now;
      const follow = 1 - Math.exp(-delta / 190);
      const next = currentProgress + (targetProgress - currentProgress) * follow;

      if (Math.abs(targetProgress - next) <= 0.001) {
        commitProgress(targetProgress);
        return;
      }

      commitProgress(next);
      frameHandle = window.requestAnimationFrame(animate);
    };

    const schedule = () => {
      targetProgress = calculateTarget();
      if (targetProgress < 0.998) setSceneVisibility(true);
      if (!frameHandle) {
        lastTime = 0;
        frameHandle = window.requestAnimationFrame(animate);
      }
    };

    targetProgress = calculateTarget();
    commitProgress(targetProgress);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.visualViewport?.addEventListener("resize", schedule);
    reducedMotion.addEventListener("change", schedule);

    return () => {
      window.cancelAnimationFrame(frameHandle);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener("resize", schedule);
      reducedMotion.removeEventListener("change", schedule);
    };
  }, []);

  const updateWind = (key: WindKey, value: number) => {
    setWind((current) => ({ ...current, [key]: value }));
  };

  const handleEnvironmentStyleChange = (nextStyle: AlamoStyle) => {
    if (nextStyle === environmentStyle) return;

    if (nextStyle === "studio-static") {
      previousAtmosphereRef.current = atmosphere;
      setAtmosphere("grid");
    } else if (environmentStyle === "studio-static") {
      const previousAtmosphere = previousAtmosphereRef.current;
      setAtmosphere(
        nextStyle === "ascii-garden" && previousAtmosphere === "grid"
          ? (asciiGardenTheme === "dark" ? "night" : "day")
          : previousAtmosphere,
      );
    } else if (nextStyle === "ascii-garden") {
      previousAtmosphereRef.current = atmosphere;
      if (atmosphere === "grid") {
        setAtmosphere(asciiGardenTheme === "dark" ? "night" : "day");
      }
    } else if (environmentStyle === "ascii-garden") {
      setAtmosphere(previousAtmosphereRef.current);
    }

    setEnvironmentStyle(nextStyle);
  };

  const handleAsciiGardenThemeChange = (nextTheme: AsciiGardenTheme) => {
    setAsciiGardenTheme(nextTheme);
    if (isAsciiGarden && atmosphere !== "grid") {
      setAtmosphere(nextTheme === "dark" ? "night" : "day");
    }
  };

  const sceneIsPlaying = isPlaying && isSceneVisible;
  const sceneStyle = {
    "--flat-meadow-color": flatMeadowColor,
    "--meadow-height-scale": (meadowHeight / 100).toFixed(2),
    "--living-meadow-scale-y": (0.84 * meadowHeight / 100).toFixed(3),
    "--meadow-height-offset": `${((meadowHeight - 100) * 1.45).toFixed(1)}px`,
    "--rolling-meadow-registration-y": `${environment.rollingGroundOffset}%`,
    "--flat-meadow-registration-y": `${-environment.flatHorizon}%`,
    "--cypress-root-registration-y": `${environment.treeRootOffset}%`,
    "--ascii-ground-height-rolling": `${(34 * meadowHeight / 100).toFixed(2)}svh`,
    "--ascii-ground-height-flat": `${(18 * meadowHeight / 100).toFixed(2)}svh`,
    "--ascii-tree-bottom-rolling": `${(19.6 * meadowHeight / 100).toFixed(2)}svh`,
    "--ascii-tree-bottom-flat": `${(15.6 * meadowHeight / 100).toFixed(2)}svh`,
    "--ascii-actor-left-bottom": `${(14.4 * meadowHeight / 100).toFixed(2)}svh`,
    "--ascii-actor-center-bottom": `${(13.1 * meadowHeight / 100).toFixed(2)}svh`,
    "--ascii-actor-right-bottom": `${(20.1 * meadowHeight / 100).toFixed(2)}svh`,
  } as CSSProperties;

  return (
    <div
      ref={sceneRef}
      className="hero-meadow"
      data-scene-visible={isSceneVisible ? "true" : "false"}
      data-scroll-state="hero"
      data-meadow-variant={meadowVariant}
      data-environment-style={environmentStyle}
      data-ascii-garden-theme={isAsciiGarden ? asciiGardenTheme : undefined}
      data-style-atmosphere={environment.atmosphere}
      style={sceneStyle}
    >
      <div className="hero-meadow__style-atmosphere" aria-hidden="true" />
      {isStudioStatic ? null : isAsciiGarden ? (
        <AsciiGarden theme={asciiGardenTheme} variant={meadowVariant} />
      ) : (
        <>
          <Meadow
            isPlaying={sceneIsPlaying}
            variant={meadowVariant}
            flatTexture={flatMeadowTexture}
            rollingMeadow={rollingMeadow}
            environmentStyle={environment}
          />
          <CypressTree
            wind={wind}
            isPlaying={sceneIsPlaying}
            assetUrl={environment.treeSrc}
          />
        </>
      )}
      <MeadowSettings
        environmentStyle={environmentStyle}
        asciiGardenTheme={asciiGardenTheme}
        atmosphere={atmosphere}
        workGridColumns={workGridColumns}
        heroHighlights={heroHighlights}
        variant={meadowVariant}
        rollingMeadow={rollingMeadow}
        flatTexture={flatMeadowTexture}
        flatColor={flatMeadowColor}
        meadowHeight={meadowHeight}
        topPetMode={topPetMode}
        wind={wind}
        isPlaying={isPlaying}
        isVisible={isSceneVisible}
        onAtmosphereChange={setAtmosphere}
        onEnvironmentStyleChange={handleEnvironmentStyleChange}
        onAsciiGardenThemeChange={handleAsciiGardenThemeChange}
        onWorkGridColumnsChange={setWorkGridColumns}
        onHeroHighlightsChange={setHeroHighlights}
        onVariantChange={setMeadowVariant}
        onRollingMeadowChange={(nextMeadow) => {
          setRollingMeadow(nextMeadow);
          setMeadowVariant("living");
        }}
        onFlatTextureChange={(texture) => {
          setFlatMeadowTexture(texture);
          setMeadowVariant("flat");
        }}
        onFlatColorChange={(color) => {
          setFlatMeadowColor(color);
          setMeadowVariant("flat");
        }}
        onMeadowHeightChange={setMeadowHeight}
        onTopPetModeChange={setTopPetMode}
        onWindChange={updateWind}
        onPlayingChange={setIsPlaying}
      />
      {!isStudioStatic && <AlamoWeather onWindUpdate={setWind} />}
    </div>
  );
}
