'use client';
import { motion } from 'framer-motion';

// Illustrative silhouettes of the 9 real TerrainShape archetypes
// (src/Core/Constants.h `enum class TerrainShape`). Hand-drawn to
// communicate the silhouette each produces — not a literal render of
// the midpoint-displacement algorithm.
const shapes: { name: string; desc: string; path?: string; multi?: string[] }[] = [
  { name: 'Rolling',    desc: 'Classic hills — the original midpoint-displacement look',
    path: 'M0,64 L0,38 L25,26 L50,36 L75,20 L100,32 L125,18 L150,30 L175,24 L200,38 L200,64 Z' },
  { name: 'Plateau',    desc: 'Flat mesas at different heights, joined by sheer walls',
    path: 'M0,64 L0,34 L42,34 L42,18 L100,18 L100,40 L158,40 L158,14 L200,14 L200,64 Z' },
  { name: 'Canyon',     desc: 'A deep gorge cut through the middle, high rims either side',
    path: 'M0,64 L0,16 L60,16 L88,52 L112,52 L140,16 L200,16 L200,64 Z' },
  { name: 'Twin Peaks', desc: 'Two raised summits with a valley dropped between them',
    path: 'M0,64 L0,46 L45,10 L100,40 L155,10 L200,46 L200,64 Z' },
  { name: 'Dunes',      desc: 'Smooth superposed sine waves — soft, rolling sand',
    path: 'M0,64 L0,32 L20,24 L40,34 L60,22 L80,32 L100,20 L120,32 L140,22 L160,34 L180,24 L200,32 L200,64 Z' },
  { name: 'Spires',     desc: 'Low ground punctuated by a handful of narrow tall needles',
    path: 'M0,64 L0,50 L28,50 L31,8 L34,50 L108,50 L111,14 L114,50 L168,50 L171,5 L174,50 L200,50 L200,64 Z' },
  { name: 'Cratered',   desc: 'Rolling ground pre-pocked with bowl craters',
    path: 'M0,64 L0,30 L40,30 L47,44 L55,46 L62,30 L110,30 L117,46 L125,48 L132,30 L162,30 L169,40 L177,42 L184,30 L200,30 L200,64 Z' },
  { name: 'Cliff',      desc: 'Strong asymmetry — one side towers, the other lies flat',
    path: 'M0,64 L0,10 L30,15 L60,22 L90,29 L120,34 L150,40 L180,46 L200,50 L200,64 Z' },
  { name: 'Islands',    desc: 'Flat mesas separated by chasms with no floor at all',
    multi: [
      'M0,64 L0,26 L50,26 L50,64 Z',
      'M78,64 L78,38 L128,38 L128,64 Z',
      'M156,64 L156,16 L200,16 L200,64 Z',
    ] },
];

const skies = [
  { name: 'Clear Day',      grad: ['#3a5f8a', '#8fb8d8'] },
  { name: 'Bicolor Sunset', grad: ['#2a1430', '#8a3c14'] },
  { name: 'Night Stars',    grad: ['#0a0d1c', '#1c2444'] },
  { name: 'Aurora',         grad: ['#0a1a18', '#1f6a54'] },
  { name: 'Toxic Haze',     grad: ['#28321a', '#7a8c3a'] },
  { name: 'Mars Dust',      grad: ['#3a1f14', '#a85a2c'] },
  { name: 'Ash Storm',      grad: ['#1c1a18', '#544c44'] },
  { name: 'Overcast Steel', grad: ['#242a30', '#5a636c'] },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function Scenarios() {
  return (
    <section id="scenarios" className="relative py-24 md:py-32 px-6 bg-bg overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      {/* Ambient glow to mark this as the mid-page centrepiece */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full opacity-[0.05] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #d69a1f, transparent 70%)' }}
      />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <div className="inline-block font-mono text-xs text-amber-2 border border-amber/40 px-4 py-1.5 mb-4 tracking-widest">
            PROCEDURAL BATTLEFIELDS
          </div>
          <h2 className="font-display text-3xl md:text-5xl text-cream tracking-tight uppercase">
            No Two Battles Alike
          </h2>
        </motion.div>

        {/* Combinatorics strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-16 font-display uppercase"
        >
          {[['9', 'Shapes'], ['×', ''], ['8', 'Biomes'], ['×', ''], ['4', 'Palettes'], ['=', ''], ['32', 'Looks']].map(([n, l], i) => (
            n === '×' || n === '=' ? (
              <span key={i} className="text-2xl md:text-3xl text-muted-2">{n}</span>
            ) : (
              <div key={i} className="flex flex-col items-center px-4 py-3 plate clip-angled-sm">
                <span className="text-2xl md:text-3xl text-amber-2 glow-amber">{n}</span>
                <span className="font-mono text-[10px] normal-case tracking-widest text-muted mt-1">{l}</span>
              </div>
            )
          ))}
        </motion.div>

        {/* Shape grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-line mb-16"
        >
          {shapes.map((s) => (
            <motion.div key={s.name} variants={item} className="bg-panel p-4 group">
              <svg viewBox="0 0 200 64" className="w-full h-auto mb-3" aria-hidden="true">
                <rect x="0" y="0" width="200" height="64" fill="#0d0f12" />
                {s.path && <path d={s.path} fill="#8a6318" className="group-hover:fill-amber transition-colors duration-300" />}
                {s.multi?.map((d, i) => (
                  <path key={i} d={d} fill="#8a6318" className="group-hover:fill-amber transition-colors duration-300" />
                ))}
              </svg>
              <div className="font-mono text-xs font-bold text-cream tracking-wide">{s.name}</div>
              <div className="font-mono text-[11px] text-muted mt-1 leading-snug">{s.desc}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Sky kinds */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="font-mono text-xs text-teal-2 tracking-widest text-center mb-6">
            8 SKY ARCHETYPES — PICKED BY BIOME, LAYERED WITH PARALLAX &amp; ATMOSPHERE
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {skies.map(s => (
              <div key={s.name} className="text-center">
                <div
                  className="h-12 mb-2 border border-line-2"
                  style={{ background: `linear-gradient(to bottom, ${s.grad[0]}, ${s.grad[1]})` }}
                />
                <div className="font-mono text-[11px] text-ink">{s.name}</div>
              </div>
            ))}
          </div>
          <p className="font-mono text-xs text-muted text-center max-w-2xl mx-auto leading-relaxed">
            Every level seeds sky, sun/moon, three parallax layers, biome ground
            props and an animated atmosphere pass from the same random seed as
            the terrain — so the scene always agrees with itself, and the
            silhouette, palette and weather change on every single level.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
