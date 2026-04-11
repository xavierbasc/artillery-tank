'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const specs = [
  { label: 'Language',   value: 'C++20',               note: 'Smart pointers · RAII · constexpr · std::numbers' },
  { label: 'Engine',     value: 'SDL3',                 note: 'Windowing · GPU Renderer · AudioStream callback' },
  { label: 'Resolution', value: '640 × 360',            note: 'Integer scale — pixel-perfect on any display' },
  { label: 'Timestep',   value: '60 Hz fixed',          note: 'Deterministic physics across all platforms' },
  { label: 'Audio',      value: 'PCM + MOD',            note: 'Real-time synthesis + libxmp tracker playback' },
  { label: 'Terrain',    value: 'Midpoint Displace',    note: 'Procedural · pixel-level destruction per round' },
  { label: 'Particles',  value: '2,048 pool',           note: 'Additive flash + alpha debris — zero alloc in-game' },
  { label: 'Platforms',  value: '5 targets',            note: 'Windows · macOS · Linux · iOS · Android' },
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
    }, 22);
    return () => clearInterval(tick);
  }, [started, text]);

  return <span>{displayed}<span className={displayed.length < text.length ? 'cursor' : ''} /></span>;
}

export default function Specs() {
  const [visible, setVisible] = useState(false);

  return (
    <section id="specs" className="relative py-28 px-6 bg-[#060608]">
      <div className="absolute inset-0 bg-grid-subtle bg-[length:40px_40px] opacity-25 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block font-mono text-xs text-[#ff5f00] border border-[#ff5f00]/40 px-4 py-1.5 mb-4 tracking-widest">
            SPECIFICATIONS
          </div>
          <h2 className="font-pixel text-2xl md:text-3xl text-white tracking-tight">
            Under the Hood
          </h2>
        </motion.div>

        {/* Terminal window */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
          viewport={{ once: true }}
          onViewportEnter={() => setVisible(true)}
          className="bg-[#080810] border border-[#1e1e2e] clip-angled overflow-hidden"
        >
          {/* Terminal header */}
          <div className="flex items-center gap-3 px-5 py-3 bg-[#0d0d18] border-b border-[#1e1e2e]">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f00]" />
              <div className="w-3 h-3 rounded-full bg-[#ffd040]" />
              <div className="w-3 h-3 rounded-full bg-[#40c040]" />
            </div>
            <span className="font-mono text-xs text-[#404060] ml-2 tracking-widest">
              terrashell-fracture — tech-specs.sh
            </span>
          </div>

          {/* Terminal body */}
          <div className="p-6 font-mono text-sm space-y-0">
            <div className="text-[#ff5f00] mb-4 text-xs">
              {visible && <TypeWriter text="$ cat tech-specs.json" delay={100} />}
            </div>

            <div className="text-[#404060] mb-3 text-xs">
              {visible && <TypeWriter text="{" delay={600} />}
            </div>

            {specs.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 + i * 0.07 }}
                className="group flex items-start gap-0 py-2 border-b border-[#0e0e18] last:border-0 hover:bg-[#ff5f00]/3 px-3 -mx-3 transition-colors"
              >
                <div className="w-36 flex-shrink-0">
                  <span className="text-[#404060]">&nbsp;&nbsp;</span>
                  <span className="text-[#60c0ff] text-xs">&quot;{s.label}&quot;</span>
                  <span className="text-[#606080]">: </span>
                </div>
                <div className="flex-1">
                  <span className="text-[#ffd040] text-xs group-hover:text-white transition-colors">&quot;{s.value}&quot;</span>
                  <span className="text-[#404060]">,</span>
                  <span className="text-[#303050] text-xs ml-3">// {s.note}</span>
                </div>
              </motion.div>
            ))}

            <div className="text-[#404060] mt-3 text-xs">
              {visible && <TypeWriter text="}" delay={800} />}
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs text-[#404060]">
              <span className="text-[#ff5f00]">$</span>
              <span className="cursor" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
