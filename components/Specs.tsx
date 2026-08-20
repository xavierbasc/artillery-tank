'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Every value here traces to a real constant or system in the codebase —
// see src/Core/Constants.h, src/World/Scenery.h, src/Core/Game.h.
const specs = [
  { label: 'language',   value: 'C++20',                note: 'smart pointers · RAII · constexpr' },
  { label: 'engine',     value: 'SDL3',                  note: 'windowing · accelerated renderer · AudioStream' },
  { label: 'resolution', value: '640x360 logical',       note: 'integer scale, pixel-perfect on any display' },
  { label: 'timestep',   value: '60hz fixed',            note: 'accumulator + 250ms guard, deterministic physics' },
  { label: 'audio',      value: 'synth + MOD',           note: 'square/noise SFX generated live, libxmp tracker music' },
  { label: 'terrain',    value: '9 shapes x 8 biomes',   note: 'midpoint displacement, deformed by every shot' },
  { label: 'particles',  value: '2048 pool',             note: '6 blended explosion layers, zero per-frame alloc' },
  { label: 'sky',        value: '9 archetypes',          note: 'gradient + celestial body + 3-layer parallax, meteors over dead biomes' },
  { label: 'weather',    value: '6 conditions',          note: 'overcast, fog, rain, red sky, storm, moonless night' },
  { label: 'shields',    value: '72-point arc',          note: 'terrain-clipped, 40hp base, up to 200 with cells' },
  { label: 'defences',   value: '4 systems',             note: 'shield cell, mag field, aegis dome, reactive armor' },
  { label: 'multiplayer',value: '2 to 6 tanks',          note: 'local only — keyboard, mouse and touch, no netcode' },
  { label: 'platforms',  value: '5 targets',             note: 'windows, macos, linux, ios, android — one CMake tree' },
];

function TypeWriter({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState('');
  const [started,   setStarted]   = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const tick = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(tick);
    }, 20);
    return () => clearInterval(tick);
  }, [started, text]);

  return <span>{displayed}<span className={displayed.length < text.length ? 'cursor' : ''} /></span>;
}

export default function Specs() {
  const [visible, setVisible] = useState(false);

  return (
    <section id="specs" className="relative py-24 md:py-28 px-6 bg-bg overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-25 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="inline-block font-mono text-xs text-amber-2 border border-amber/40 px-4 py-1.5 mb-4 tracking-widest">
            SPECIFICATIONS
          </div>
          <h2 className="font-display text-2xl md:text-4xl text-cream tracking-tight uppercase">
            Under the Hood
          </h2>
        </motion.div>

        {/* Terminal window */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
          viewport={{ once: true }}
          onViewportEnter={() => setVisible(true)}
          className="bg-panel border border-line clip-angled overflow-hidden"
        >
          {/* Terminal header */}
          <div className="flex items-center gap-3 px-5 py-3 bg-panel-2 border-b border-line">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-amber" />
              <div className="w-3 h-3 rounded-full bg-teal" />
              <div className="w-3 h-3 rounded-full bg-green" />
            </div>
            <span className="font-mono text-xs text-muted ml-2 tracking-widest">
              terrashell-fracture — tech-specs.sh
            </span>
          </div>

          {/* Terminal body */}
          <div className="p-6 font-mono text-sm space-y-0 overflow-x-auto">
            <div className="text-amber-2 mb-4 text-xs">
              {visible && <TypeWriter text="$ cat tech-specs.json" delay={100} />}
            </div>

            <div className="text-muted mb-3 text-xs">
              {visible && <TypeWriter text="{" delay={600} />}
            </div>

            {specs.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 + i * 0.06 }}
                className="group flex items-start gap-0 py-2 border-b border-line last:border-0 hover:bg-amber/5 px-3 -mx-3 transition-colors whitespace-nowrap"
              >
                <div className="w-44 flex-shrink-0">
                  <span className="text-muted-2">&nbsp;&nbsp;</span>
                  <span className="text-teal-2 text-xs">&quot;{s.label}&quot;</span>
                  <span className="text-muted">: </span>
                </div>
                <div className="flex-1 whitespace-normal">
                  <span className="text-amber-2 text-xs group-hover:text-cream transition-colors">&quot;{s.value}&quot;</span>
                  <span className="text-muted">,</span>
                  <span className="text-muted-2 text-xs ml-3">// {s.note}</span>
                </div>
              </motion.div>
            ))}

            <div className="text-muted mt-3 text-xs">
              {visible && <TypeWriter text="}" delay={800} />}
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs text-muted">
              <span className="text-amber-2">$</span>
              <span className="cursor" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
