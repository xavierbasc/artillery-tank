// Single source of truth for the site's canonical public URL — shared by
// app/layout.tsx (metadataBase), app/robots.ts, app/sitemap.ts and the
// VideoGame JSON-LD block in app/page.tsx. Keep the trailing slash: every
// relative path built from this constant (elsewhere in the app) depends on
// it to land inside /terrashell-fracture/ on GitHub Pages.
export const SITE_URL = 'https://xavierbasc.github.io/terrashell-fracture/';
export const SITE_NAME = 'TerraShell Fracture';
