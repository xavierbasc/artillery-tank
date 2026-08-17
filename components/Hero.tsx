'use client';
import { motion } from 'framer-motion';
import TerrainCanvas from './TerrainCanvas';

const stats: [string, string][] = [
  ['7', 'Weapons'],
  ['8', 'Biomes'],
  ['9', 'Shapes'],
  ['10', 'Tanks'],
  ['0', 'Servers'],
];

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col overflow-hidden bg-bg"
    >
      <TerrainCanvas />

      {/* Legibility scrim over the generative scene */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(10,11,13,0.35) 0%, rgba(10,11,13,0.55) 40%, rgba(10,11,13,0.92) 82%, #0a0b0d 100%)',
        }}
      />
      <div className="scanlines opacity-60" />
      <div className="absolute inset-0 z-[2] bg-grid opacity-20 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 text-center px-6 pt-32 pb-10 gap-7">

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-mono text-[11px] text-amber-2 tracking-[0.35em] uppercase border border-amber/40 px-4 py-1.5 bg-bg/40"
        >
          Turn-Based Artillery · Fully Destructible Terrain
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display leading-[0.95] uppercase"
        >
          <span
            className="block text-cream"
            style={{ fontSize: 'clamp(2.4rem, 9vw, 5.5rem)', letterSpacing: '0.01em' }}
          >
            Terra<span className="text-amber-2 glow-amber">Shell</span>
          </span>
          <span
            className="block text-red-2"
            style={{ fontSize: 'clamp(1.6rem, 6vw, 3.6rem)', letterSpacing: '0.08em', textShadow: '0 0 26px rgba(255,91,61,0.5)' }}
          >
            Fracture
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-mono text-sm md:text-base text-ink/90 max-w-lg leading-relaxed"
        >
          Every shot reshapes the battlefield permanently. No two levels are
          ever the same — and the whole thing runs without a single network
          request.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <a
            href="#download"
            className="cut-lg [--cut-edge:var(--amber-2)] [--cut-fill:var(--amber-2)] hover:[--cut-edge:var(--cream)] hover:[--cut-fill:var(--cream)] font-mono text-sm font-bold text-bg px-7 py-3 transition-colors duration-200 no-underline animate-pulse-amber"
          >
            DOWNLOAD NOW →
          </a>
          <a
            href="#arena"
            className="cut-lg [--cut-edge:var(--line-2)] [--cut-fill:var(--bg)] hover:[--cut-edge:var(--amber)] font-mono text-sm text-cream px-7 py-3 hover:text-amber-2 transition-colors duration-200 no-underline"
          >
            SEE SCREENSHOTS
          </a>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="flex items-center flex-wrap justify-center gap-0 mt-2"
        >
          {stats.map(([n, l], i, arr) => (
            <div key={l} className="flex items-center">
              <div className="flex flex-col items-center px-5 py-2.5 bg-bg/60 border border-line">
                <span className="font-display text-lg text-amber-2">{n}</span>
                <span className="font-mono text-[10px] text-muted mt-1 tracking-widest">{l}</span>
              </div>
              {i < arr.length - 1 && <div className="w-px h-9 bg-line" />}
            </div>
          ))}
        </motion.div>
      </div>

      <div className="relative z-10 text-center pb-6">
        <span className="font-mono text-xs text-amber-2 animate-bob inline-block">▼</span>
      </div>
    </section>
  );
}
