// Let the last visible photo finish falling, then leave a short beat before gathering.
export const photoFallDuration = (id) => 600 + Number(id) % 4 * 30;
export function photoGatherDelay(snapshots, visible, viewportHeight) {
  let lastFall = 0;
  for (const [id, old] of snapshots) {
    if (!visible.has(id) && Number(old.opacity) > 0.01 && old.top < viewportHeight + 120 && old.top + old.height > 0) {
      lastFall = Math.max(lastFall, photoFallDuration(id));
    }
  }
  return lastFall ? lastFall + 180 : 0;
}
