export type WindKey = "breeze" | "gust" | "elasticity" | "tempo";

export type WindSettings = Record<WindKey, number>;

export const INITIAL_WIND: WindSettings = {
  breeze: 0.34,
  gust: 0.52,
  elasticity: 0.38,
  tempo: 0.31,
};
