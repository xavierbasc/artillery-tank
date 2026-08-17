// next/image does NOT prepend basePath on static export (`output: 'export'`),
// and plain <img src> / CSS url() need the prefix by hand in production.
// Centralised here instead of repeating the ternary in every component —
// see next.config.mjs for the matching basePath/assetPrefix values.
const BASE_PATH = process.env.NODE_ENV === 'production' ? '/terrashell-fracture' : '';

/** Prefix a root-relative path (e.g. "/shots/menu.png") for the current build target. */
export function asset(path: string): string {
  if (!path.startsWith('/')) return path;
  return BASE_PATH + path;
}

export { BASE_PATH };
