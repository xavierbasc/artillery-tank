import type { Metadata } from 'next';
import './globals.css';
import { display, mono, pixel } from './fonts';
import { asset } from '@/lib/asset';
import { SITE_URL, SITE_NAME } from '@/lib/site';

const TITLE = SITE_NAME;
const DESCRIPTION =
  'A turn-based artillery game with destructible pixel-art terrain, inspired by Scorched Earth. Local multiplayer, procedural levels, 100% offline — no servers.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${TITLE} — Offline Artillery Warfare`,
    template: `%s · ${TITLE}`,
  },
  description: DESCRIPTION,
  keywords: [
    'artillery game', 'turn-based artillery', 'turn-based strategy game',
    'destructible terrain', 'pixel art game', 'offline game', 'no wifi game',
    'Scorched Earth game', 'local multiplayer game', 'indie game',
    'SDL3', 'C++ game', 'tank game', 'procedural generation',
  ],
  authors: [{ name: 'Javier Bascones Velázquez' }],
  creator: 'Javier Bascones Velázquez',
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: TITLE,
    title: `${TITLE} — Offline Artillery Warfare`,
    description: DESCRIPTION,
    images: [{
      url: 'og-image.png',
      width: 1200,
      height: 630,
      alt: 'TerraShell Fracture title screen — a pixel-art tank firing across a desert canyon, with the game logo overhead',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${TITLE} — Offline Artillery Warfare`,
    description: DESCRIPTION,
    images: ['og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${display.variable} ${mono.variable} ${pixel.variable}`}>
      <head>
        {/* Manual <link> tags — like <img>, these are NOT rewritten with
            basePath by Next's static export, so they go through asset(). */}
        <link rel="icon" href={asset('/icon.png')} sizes="512x512" type="image/png" />
        <link rel="icon" href={asset('/favicon-32.png')} sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href={asset('/apple-icon.png')} />
      </head>
      <body className="bg-bg text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
