export const MEADOW_GUST_EVENT = "portfolio:meadow-gust";
export const WELCOME_TRAVEL_MS = 3200;
export type MeadowGust = { startedAt: number; origin: number; span?: number; direction: number; strength: number; duration: number };
export type GrassFootprint = { x: number; y: number; radius: number; at: number; direction: number };

export function arrivalGrassWind(now: number, x: number, gust: MeadowGust | null) {
  if (!gust || x < gust.origin) return 0;
  const elapsed = now - gust.startedAt - Math.max(0, (x - gust.origin) / (gust.span ?? 1)) * WELCOME_TRAVEL_MS;
  const progress = elapsed / (gust.duration);
  if (progress <= 0 || progress >= 1) return 0;
  return Math.sin(progress * Math.PI) ** 2 * gust.strength * gust.direction * 1.1;
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

export function cursorGrassBend(x: number, y: number, brush: { x: number; y: number; direction: number; strength: number } | null, now = 0) {
  if (!brush) return 0;
  const dx = (x - brush.x) / 128;
  const dy = (y - brush.y) / 88;
  const falloff = Math.max(0, 1 - dx * dx - dy * dy) ** 1.65;
  const flutter = 0.68 + Math.sin(now / 125 + x / 21 + y / 17) * 0.32;
  return falloff * brush.direction * brush.strength * flutter * 1.12;
}
