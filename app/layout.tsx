import type { Metadata } from 'next';
import './globals.css';
import { display, mono, pixel } from './fonts';

const SITE_URL = 'https://xavierbasc.github.io/terrashell-fracture/';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'TerraShell Fracture — Offline Artillery Warfare',
  description:
    'Turn-based artillery combat with fully destructible terrain, procedurally generated battlefields, and real-time synthesised audio. 100% offline — no servers, no accounts, no telemetry.',
  keywords: [
    'artillery game', 'turn-based strategy', 'destructible terrain', 'SDL3', 'C++',
    'offline game', 'indie game', 'pixel art', 'local multiplayer',
  ],
  authors: [{ name: 'Javier Bascones Velázquez' }],
  openGraph: {
    title: 'TerraShell Fracture',
    description: 'Turn-based artillery warfare. Destroy the terrain. Outgun your enemy. Zero servers, zero accounts.',
    type: 'website',
    url: SITE_URL,
    siteName: 'TerraShell Fracture',
    images: [{ url: '/shots/gameplay.png', width: 1280, height: 720, alt: 'TerraShell Fracture gameplay' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TerraShell Fracture',
    description: 'Turn-based artillery warfare with fully destructible terrain. 100% offline.',
    images: ['/shots/gameplay.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${display.variable} ${mono.variable} ${pixel.variable}`}>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><text y='26' font-size='26'>💥</text></svg>" />
      </head>
      <body className="bg-bg text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
