const aliases = { urban: 'city', biking: 'bicycle', coastal: 'coast', bikes: 'bicycle', bike: 'bicycle', bicycles: 'bicycle', cycling: 'bicycle', cyclist: 'bicycle', cyclists: 'bicycle', japanese: 'japan', cities: 'city', sunsets: 'sunset', landscapes: 'landscape', streets: 'street', mountains: 'mountain', flowers: 'flower', trees: 'tree' };
export function searchTokens(value) {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().split(/[^a-z0-9]+/).filter((word) => word && !['the', 'and', 'of', 'in', 'photo', 'photos', 'photography', 'picture', 'pictures'].includes(word)).map((word) => aliases[word] ?? word);
}
export function matchesPhoto(photo, query) {
  const words = searchTokens([photo.description, photo.style, photo.color, ...photo.tags].join(' '));
  return searchTokens(query).every((token) => words.some((word) => word.startsWith(token)));
}
const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'earth', 'monochrome'];
const styles = ['street', 'architecture', 'sports', 'documentary', 'landscape', 'nature', 'wildlife', 'abstract', 'still-life'];
// Neel's 28 selections, sequenced from city geometry through landscapes to night.
// The pink umbrella is the lead image; these are editorial choices, not a quality score.
export const selectedPhotoIds = [
  '087', '108', '100', '062', '133', '089', '014', '046',
  '137', '120', '130', '131', '140', '022', '042', '132',
  '080', '136', '065', '063', '109', '125', '112', '068',
  '067', '043', '004', '141',
];

function paletteDistance(a, b) {
  const rgb = (hex) => [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16) / 255);
  const left = a.palette.map(rgb), right = b.palette.map(rgb);
  const nearest = (from, to) => from.reduce((sum, color) => sum + Math.min(...to.map((other) =>
    color.reduce((distance, value, channel) => distance + (value - other[channel]) ** 2, 0))), 0) / from.length;
  return (nearest(left, right) + nearest(right, left)) / 2 + (a.style === b.style ? 0 : 0.04);
}

function selectedSequence(photos) {
  const remaining = new Map([...photos].sort((a, b) => a.id.localeCompare(b.id)).map((photo) => [photo.id, photo]));
  const ordered = [];
  for (const id of selectedPhotoIds) {
    if (remaining.has(id)) { ordered.push(remaining.get(id)); remaining.delete(id); }
  }
  // Continue the same visual rhythm into the full collection, without a section break.
  while (remaining.size) {
    const previous = ordered.at(-1);
    let next, bestDistance = Infinity;
    for (const photo of remaining.values()) {
      const distance = previous ? paletteDistance(previous, photo) : 0;
      if (distance < bestDistance) { next = photo; bestDistance = distance; }
    }
    ordered.push(next);
    remaining.delete(next.id);
  }
  return ordered;
}

export function clusterPhotos(photos, grouping) {
  if (grouping === "selected") return selectedSequence(photos);
  return [...photos].sort((a, b) => {
    const group = grouping === 'style' ? styles.indexOf(a.style) - styles.indexOf(b.style) : colors.indexOf(a.color) - colors.indexOf(b.color);
    return group || a.hue - b.hue || a.id.localeCompare(b.id);
  });
}
export function masonryLayout(photos, width, columns, gap) {
  const heights = Array(columns).fill(0);
  const tileWidth = Math.max(1, (width - gap * (columns - 1)) / columns);
  const positions = new Map();
  for (const photo of photos) {
    const column = heights.indexOf(Math.min(...heights));
    const height = tileWidth / photo.ratio;
    positions.set(photo.id, { x: column * (tileWidth + gap), y: heights[column], width: tileWidth, height });
    heights[column] += height + gap;
  }
  return { positions, height: Math.max(0, ...heights) - (photos.length ? gap : 0) };
}
