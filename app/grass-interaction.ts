export const MEADOW_GUST_EVENT = "portfolio:meadow-gust";
export type MeadowGust = { startedAt: number; origin: number; direction: number; strength: number; duration: number };
export type GrassFootprint = { x: number; y: number; radius: number; at: number; direction: number };

export function arrivalGrassWind(now: number, x: number, gust: MeadowGust | null) {
  if (!gust) return 0;
  const elapsed = now - gust.startedAt - Math.abs(x - gust.origin) * 1700;
  const progress = elapsed / (gust.duration * 0.6);
  if (progress <= 0 || progress >= 1) return 0;
  return Math.sin(progress * Math.PI) ** 2 * gust.strength * gust.direction * 5.2;
}

export function grassPressure(x: number, y: number, now: number, footprints: GrassFootprint[]) {
  let pressure = 0;
  let direction = 1;
  for (const foot of footprints) {
    const recovery = Math.max(0, 1 - (now - foot.at) / 1900);
    const distance = ((x - foot.x) / foot.radius) ** 2 + ((y - foot.y) / (foot.radius * 0.65)) ** 2;
    const local = Math.max(0, 1 - distance) ** 2 * recovery;
    if (local > pressure) { pressure = local; direction = foot.direction; }
  }
  return { pressure, direction };
}

export const GRASS_PRESENCE_EVENT = "portfolio:grass-presence";
export function petGrassWind(x: number, y: number, brush: { x: number; y: number; direction: number; strength: number } | null) {
  if (!brush) return 0;
  const dx = (x - brush.x) / 95;
  const dy = (y - brush.y) / 55;
  return Math.max(0, 1 - dx * dx - dy * dy) ** 2 * brush.direction * brush.strength * 2.8;
}
