// next/font self-hosts these at build time — the files are downloaded once
// during `next build` and served from this domain, so the page never makes
// a runtime request to fonts.googleapis.com (works offline, no CDN outage risk).
import { Black_Ops_One, Space_Mono, Press_Start_2P } from 'next/font/google';

// Display face — stencilled, military, does the heavy lifting on the hero
// and section headers.
export const display = Black_Ops_One({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
});

// Body / UI / data face — terminal monospace, used for nearly all running
// text, labels and stats.
export const mono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-mono',
  display: 'swap',
});

// Bitmap-style pixel face — used sparingly, only for the logo lockup and a
// few chunky badges, echoing the game's own bitmap font without pretending
// to be it.
export const pixel = Press_Start_2P({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-pixel',
  display: 'swap',
});
