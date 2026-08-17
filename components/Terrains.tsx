'use client';
import { motion } from 'framer-motion';

// Real values from src/Core/Constants.h TERRAIN_PROPS[] — the effective
// blast radius of every weapon is `weapon.blastRadius × blastMul`.
const biomes = [
  { name: 'Soil',    label: 'GRASS',    blast: 1.00, lateral: 1.00, note: 'Baseline — the reference terrain every multiplier is measured against' },
  { name: 'Sand',    label: 'SAND',     blast: 1.35, lateral: 1.60, note: 'Loosest ground in the game — huge craters, debris scatters far and wide' },
  { name: 'Rock',    label: 'ROCK',     blast: 0.65, lateral: 0.55, note: 'Resistant granite — small, tight craters, heavy chunks that don’t travel' },
  { name: 'Clay',    label: 'CLAY',     blast: 0.85, lateral: 0.70, note: 'Wet and sticky — medium craters, a slow, reluctant collapse' },
  { name: 'Snow',    label: 'SNOW',     blast: 1.10, lateral: 1.80, note: 'Softest terrain — triggers the longest-travelling avalanche slides' },
  { name: 'Volcanic',label: 'LAVA',     blast: 0.75, lateral: 0.90, note: 'Semi-hard lava rock — debris comes off glowing' },
  { name: 'Crystal', label: 'CRYSTAL',  blast: 0.55, lateral: 1.20, note: 'The hardest terrain in the game — but shatters into sharp, far-flung shards' },
  { name: 'Jungle',  label: 'JUNGLE',   blast: 0.90, lateral: 1.10, note: 'Dense soil bound by roots — a normal crater, lush falling debris' },
].sort((a, b) => a.blast - b.blast);

function BlastBar({ value }: { value: number }) {
  const pct = (value / 1.35) * 100; // 1.35 = SAND, the highest multiplier
  const color = value < 0.8 ? '#2ea89a' : value < 1.05 ? '#d69a1f' : '#c2321f';
  return (
    <div className="flex items-center gap-2 min-w-[110px]">
      <div className="flex-1 h-1.5 bg-bg border border-line-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 0.68, 0, 1.2] }}
          style={{ background: color, height: '100%' }}
        />
      </div>
      <span className="font-mono text-xs tabular-nums" style={{ color }}>{value.toFixed(2)}×</span>
    </div>
  );
}

export default function Terrains() {
  return (
    <section id="terrains" className="relative py-24 px-6 bg-bg-2">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-block font-mono text-xs text-amber-2 border border-amber/40 px-4 py-1.5 mb-4 tracking-widest">
            TERRAIN PHYSICS
          </div>
          <h2 className="font-display text-2xl md:text-4xl text-cream tracking-tight uppercase">
            8 Biomes, 8 Rulesets
          </h2>
          <p className="font-mono text-sm text-muted mt-4 max-w-xl mx-auto leading-relaxed">
            Blast radius, debris scatter, collapse speed and particle density
            are all per-biome constants — the same Nuke digs a very different
            hole in Crystal than it does in Sand.
          </p>
        </motion.div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr className="border-b border-line-2">
                <th className="text-left font-mono text-xs text-muted tracking-widest font-normal pb-3 pr-4">BIOME</th>
                <th className="text-left font-mono text-xs text-muted tracking-widest font-normal pb-3 pr-4">HUD LABEL</th>
                <th className="text-left font-mono text-xs text-muted tracking-widest font-normal pb-3 pr-4">BLAST RADIUS ×</th>
                <th className="text-left font-mono text-xs text-muted tracking-widest font-normal pb-3">BEHAVIOUR</th>
              </tr>
            </thead>
            <tbody>
              {biomes.map((b, i) => (
                <motion.tr
                  key={b.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-line hover:bg-amber/5 transition-colors"
                >
                  <td className="py-3 pr-4 font-mono text-sm text-cream whitespace-nowrap">{b.name}</td>
                  <td className="py-3 pr-4 font-mono text-xs text-amber-2 whitespace-nowrap">{b.label}</td>
                  <td className="py-3 pr-4"><BlastBar value={b.blast} /></td>
                  <td className="py-3 font-mono text-xs text-ink leading-relaxed">{b.note}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
