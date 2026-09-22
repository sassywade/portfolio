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
export function clusterPhotos(photos, grouping) {
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
