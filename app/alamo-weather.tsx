"use client";

import { useEffect, useState } from "react";
import type { WindSettings } from "./wind";

const ALAMO_WEATHER_URL = "https://api.open-meteo.com/v1/forecast?latitude=37.7764&longitude=-122.4345&current=wind_speed_10m%2Cwind_direction_10m%2Cwind_gusts_10m&wind_speed_unit=mph&timezone=America%2FLos_Angeles";
const WEATHER_REFRESH_MS = 10 * 60 * 1000;
const CLOCK_REFRESH_MS = 15 * 1000;

type AlamoConditions = {
  observedAt: string;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
};

type OpenMeteoResponse = {
  current?: {
    time?: string;
    wind_speed_10m?: number;
    wind_direction_10m?: number;
    wind_gusts_10m?: number;
  };
};

type AlamoWeatherProps = {
  onWindUpdate: (wind: WindSettings) => void;
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function conditionsToWind(conditions: AlamoConditions): WindSettings {
  const gustSpread = Math.max(0, conditions.windGusts - conditions.windSpeed);
  const radians = conditions.windDirection * Math.PI / 180;
  const horizontalFlow = -Math.sin(radians);

  return {
    breeze: clamp(conditions.windSpeed / 20, 0.05, 0.95),
    gust: clamp(conditions.windGusts / 30, 0.04, 1),
    elasticity: clamp(0.28 + gustSpread * 0.018, 0.28, 0.58),
    tempo: clamp(0.18 + (conditions.windSpeed + conditions.windGusts) / 65, 0.18, 0.78),
    direction: clamp(horizontalFlow, -1, 1),
  };
}

function parseConditions(payload: OpenMeteoResponse): AlamoConditions | null {
  const current = payload.current;
  if (
    !current
    || !Number.isFinite(current.wind_speed_10m)
    || !Number.isFinite(current.wind_direction_10m)
    || !Number.isFinite(current.wind_gusts_10m)
  ) {
    return null;
  }

  return {
    observedAt: current.time ?? "",
    windSpeed: Number(current.wind_speed_10m),
    windDirection: Number(current.wind_direction_10m),
    windGusts: Number(current.wind_gusts_10m),
  };
}

export function describeAlamoWind(conditions: AlamoConditions) {
  const feltWind = Math.max(conditions.windSpeed, conditions.windGusts * 0.65);

  if (feltWind < 2) return "It's calm at Alamo Square right now.";
  if (feltWind < 6) return "There's a slight breeze at Alamo Square right now.";
  if (feltWind < 10) return "There's a gentle breeze at Alamo Square right now.";
  if (feltWind < 15) return "There's a steady breeze at Alamo Square right now.";
  if (feltWind < 22) return "It's pretty windy at Alamo Square right now.";
  return "It's very windy at Alamo Square right now.";
}

function cardinalDirection(degrees: number) {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return directions[Math.round(((degrees % 360) + 360) % 360 / 45) % directions.length];
}

function formatSanFranciscoTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Los_Angeles",
    timeZoneName: "short",
  }).format(date);
}

export function AlamoWeather({ onWindUpdate }: AlamoWeatherProps) {
  const [conditions, setConditions] = useState<AlamoConditions | null>(null);
  const [hasWeatherError, setHasWeatherError] = useState(false);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const initialClock = window.setTimeout(() => setNow(new Date()), 0);
    const clock = window.setInterval(() => setNow(new Date()), CLOCK_REFRESH_MS);
    return () => {
      window.clearTimeout(initialClock);
      window.clearInterval(clock);
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    const refreshWeather = async () => {
      try {
        const response = await fetch(ALAMO_WEATHER_URL, { cache: "no-store" });
        if (!response.ok) throw new Error(`Weather request failed: ${response.status}`);
        const next = parseConditions(await response.json() as OpenMeteoResponse);
        if (!next || !isActive) return;
        setConditions(next);
        setHasWeatherError(false);
        onWindUpdate(conditionsToWind(next));
      } catch {
        if (isActive) setHasWeatherError(true);
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") void refreshWeather();
    };

    void refreshWeather();
    const weatherRefresh = window.setInterval(refreshWeather, WEATHER_REFRESH_MS);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      isActive = false;
      window.clearInterval(weatherRefresh);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [onWindUpdate]);

  const primaryCopy = conditions
    ? describeAlamoWind(conditions)
    : hasWeatherError
      ? "Alamo Square's wind is resting."
      : "Checking the wind at Alamo Square…";

  const ridgeCharacters = Array.from(primaryCopy).map((character, index, characters) => {
    const progress = characters.length > 1 ? index / (characters.length - 1) : 0;
    const ridgeLift = 5 - progress * 9 - Math.sin(progress * Math.PI) * 1.8;
    const ridgeAngle = -2.6 + progress * 4.8;

    return (
      <span
        key={`${character}-${index}`}
        className="alamo-weather__character"
        style={{ transform: `translateY(${ridgeLift.toFixed(2)}px) rotate(${ridgeAngle.toFixed(2)}deg)` }}
      >
        {character === " " ? "\u00a0" : character}
      </span>
    );
  });

  return (
    <aside
      className="alamo-weather"
      data-weather-state={conditions ? "live" : hasWeatherError ? "unavailable" : "loading"}
      aria-live="polite"
    >
      <span className="alamo-weather__primary" aria-label={primaryCopy}>
        <span className="alamo-weather__arc" aria-hidden="true">
          {ridgeCharacters}
        </span>
      </span>
      <span className="alamo-weather__secondary sr-only">
        {now ? `${formatSanFranciscoTime(now)} in San Francisco` : "Local time in San Francisco"}
        {conditions ? ` · ${Math.round(conditions.windSpeed)} mph ${cardinalDirection(conditions.windDirection)} wind` : ""}
      </span>
      {conditions?.observedAt && <time dateTime={conditions.observedAt} className="sr-only">Current weather observation</time>}
    </aside>
  );
}
