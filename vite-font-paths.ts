const STALE_VINEXT_FONT_PATH =
  /(?:[A-Za-z]:)?(?:\/|\\)[^"'\\\s)]*?\.vinext(?:\/|\\)fonts/g;

export const SERVED_VINEXT_FONT_PREFIX = "/_next/static/_vinext_fonts";

/**
 * Vinext caches Google font CSS with absolute filesystem URLs. Its rewrite
 * only replaces the current project cache directory, so a cache written
 * before the repo moved keeps serving the old machine path and the browser
 * 404s. Point every cached `.vinext/fonts` reference at the directory the
 * font plugin copies into the client build.
 */
export function rewriteStaleVinextFontUrls(code: string): string {
  if (!code.includes(".vinext/fonts") && !code.includes(".vinext\\fonts")) return code;
  return code.replace(STALE_VINEXT_FONT_PATH, SERVED_VINEXT_FONT_PREFIX);
}
