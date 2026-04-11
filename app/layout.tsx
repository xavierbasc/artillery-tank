import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TerraShell Fracture — Artillery Warfare',
  description: 'Turn-based artillery warfare with destructible terrain, real-time synthesis audio, and brutal physics. Blow the world apart.',
  keywords: ['artillery game', 'turn-based', 'destructible terrain', 'SDL3', 'indie game'],
  openGraph: {
    title: 'TerraShell Fracture',
    description: 'Turn-based artillery warfare. Destroy terrain. Outgun your enemy.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><text y='28' font-size='28'>💥</text></svg>" />
      </head>
      <body className="bg-[#080808] text-[#c8c8e0] antialiased">
        {children}
      </body>
    </html>
  );
}
