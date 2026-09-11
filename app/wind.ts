export type WindKey = "breeze" | "gust" | "elasticity" | "tempo";

export type WindSettings = Record<WindKey, number> & {
  direction: number;
};

export const INITIAL_WIND: WindSettings = {
  breeze: 0.34,
  gust: 0.52,
  elasticity: 0.38,
  tempo: 0.31,
  direction: 1,
};

// One spatial gust field for turf and canopy; positive flow travels right.
export function sampleMeadowWind(seconds: number, x: number, wind: WindSettings): number {
  const direction = wind.direction;
  const time = seconds * (0.45 + wind.tempo * 0.9);
  const front = Math.pow(Math.max(0, Math.sin(time - x * direction * 4.2)), 3);
  const ripple = Math.sin(time * 2.1 - x * direction * 15.0) * 0.12;
  return direction * (wind.breeze * (0.38 + ripple) + wind.gust * front * 0.75);
}
