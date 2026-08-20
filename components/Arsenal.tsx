'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Real values — src/Core/Constants.h `WEAPONS[]`. Damage/blast are absolute
// game units (hit points / pixels); bars below are scaled against the
// highest value in the table (Nuke) so relative power reads at a glance.
const MAX_DMG = 90;
const MAX_RAD = 75;

const weapons = [
  {
    id: 'baby_missile', name: 'Baby Missile', cost: 0, costLabel: 'FREE · UNLIMITED', costColor: '#6b7078',
    dmg: 20, rad: 10, bundle: -1, clusters: 0, pen: false, barColor: '#ffb92e',
    badge: null,
    desc: 'The backbone of every strategy — free and unlimited. Master the arc before spending a single credit.',
    art: (
      <div className="relative w-24 h-10 flex items-center justify-center">
        <div className="absolute w-16 h-4 rounded-full" style={{ background: 'linear-gradient(to right,#b0a050,#e0d870,#b0a050)', filter: 'drop-shadow(0 0 6px #ffd04088)' }} />
        <div className="absolute right-3 w-4 h-4 clip-angled-sm" style={{ background: '#e0c040' }} />
        <div className="absolute left-2 w-8 h-1.5 rounded-l-full" style={{ background: 'linear-gradient(to right,transparent,rgba(255,200,80,0.4))' }} />
      </div>
    ),
  },
  {
    id: 'missile', name: 'Missile', cost: 450, costLabel: '450 CR · ×5 BUNDLE', costColor: '#ffb92e',
    dmg: 40, rad: 20, bundle: 5, clusters: 0, pen: false, barColor: '#ff8c3c',
    badge: null,
    desc: 'Twice the punch of the Baby Missile for a modest price. The default step up once credits allow it.',
    art: (
      <div className="relative w-24 h-12 flex items-center justify-center">
        <div className="absolute w-18 h-5 rounded-full" style={{ width: 72, background: 'linear-gradient(to right,#a05820,#e08c40,#a05820)', filter: 'drop-shadow(0 0 8px #ff8c3c88)' }} />
        <div className="absolute right-2 w-5 h-5 clip-angled-sm" style={{ background: '#e08c40' }} />
      </div>
    ),
  },
  {
    id: 'baby_nuke', name: 'Baby Nuke', cost: 1400, costLabel: '1,400 CR · ×3 BUNDLE', costColor: '#ff7a3c',
    dmg: 65, rad: 40, bundle: 3, clusters: 0, pen: false, barColor: '#ff7a3c',
    badge: 'HEAVY',
    desc: 'A Nuke-class warhead at a third of the blast radius. Serious area damage without committing your whole war chest.',
    art: (
      <div className="relative w-20 h-20 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-12 h-12 rounded-full"
          style={{ background: 'radial-gradient(circle at 35% 35%,#ffb060,#c05a10,#601e08)', filter: 'drop-shadow(0 0 10px #ff7a3c)' }}
        />
      </div>
    ),
  },
  {
    id: 'nuke', name: 'Nuke', cost: 2200, costLabel: '2,200 CR · ×1 BUNDLE', costColor: '#ff2a20',
    dmg: 90, rad: 75, bundle: 1, clusters: 0, pen: false, barColor: '#ff2a20',
    badge: 'DEVASTATOR',
    desc: 'The single highest damage and largest blast radius in the game. Wins the exchange — rewrites the map.',
    art: (
      <div className="relative w-24 h-24 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-16 h-16 rounded-full"
          style={{ background: 'radial-gradient(circle at 35% 35%,#ff8060,#c2321f,#3a0e08)', filter: 'drop-shadow(0 0 14px #ff2a20)' }}
        />
        {[0, 0.6, 1.2].map((delay, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border-2"
            style={{ inset: `${-6 - i * 8}px`, borderColor: 'rgba(255,42,32,0.35)' }}
            animate={{ opacity: [0.5, 0], scale: [0.8, 1.6] }}
            transition={{ duration: 2, delay, repeat: Infinity, ease: 'easeOut' }}
          />
        ))}
      </div>
    ),
  },
  {
    id: 'mirv', name: 'MIRV', cost: 1500, costLabel: '1,500 CR · ×3 BUNDLE', costColor: '#c084fc',
    dmg: 35, rad: 15, bundle: 3, clusters: 5, pen: false, barColor: '#c084fc',
    badge: '5-WAY SPLIT',
    desc: 'Splits into 5 sub-shells at the apex of its arc, each detonating independently below. Covers ground a single warhead can’t.',
    art: (
      <div className="relative w-24 h-16 flex items-center justify-center">
        <div className="w-8 h-8 clip-angled" style={{ background: 'linear-gradient(135deg,#d8a8ff,#8040c0)', filter: 'drop-shadow(0 0 8px #c084fc88)' }} />
        {[0, 72, 144, 216, 288].map((angle, i) => (
          <motion.div
            key={i}
            className="absolute w-2.5 h-2.5 rounded-full"
            style={{ background: '#c084fc' }}
            animate={{
              x: Math.cos((angle * Math.PI) / 180) * 26,
              y: Math.sin((angle * Math.PI) / 180) * 16,
              opacity: [0.3, 1, 0.3],
            }}
            transition={{ duration: 1.8, delay: i * 0.14, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>
    ),
  },
  {
    id: 'cluster', name: 'Cluster', cost: 1000, costLabel: '1,000 CR · ×2 BUNDLE', costColor: '#ffd040',
    dmg: 20, rad: 7, bundle: 2, clusters: 6, pen: false, barColor: '#ffd040',
    badge: 'AREA DENIAL',
    desc: 'Splits into 6 sub-shells right on impact. Weak per hit, brutal for denying a whole stretch of terrain.',
    art: (
      <div className="relative w-24 h-16 flex items-center justify-center">
        <div className="w-8 h-8 clip-angled" style={{ background: 'linear-gradient(135deg,#ffb830,#ff7010)', filter: 'drop-shadow(0 0 8px #ffd04088)' }} />
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{ background: '#ffb030' }}
            animate={{
              x: Math.cos((angle * Math.PI) / 180) * 22,
              y: Math.sin((angle * Math.PI) / 180) * 16,
              opacity: [0.3, 1, 0.3],
            }}
            transition={{ duration: 1.8, delay: i * 0.12, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>
    ),
  },
  {
    id: 'penetrator', name: 'Penetrator', cost: 600, costLabel: '600 CR · ×5 BUNDLE', costColor: '#60c0ff',
    dmg: 50, rad: 11, bundle: 5, clusters: 0, pen: true, barColor: '#1a90ff',
    badge: 'BUNKER BUSTER',
    desc: 'Burrows through terrain before detonating. Defeats enemies hiding behind hills or dug in deep — cheap, too.',
    art: (
      <div className="relative w-12 h-24 flex flex-col items-center justify-center">
        <div className="w-3 h-5 clip-angled" style={{ background: 'linear-gradient(to bottom,#c0e0ff,#6090d0)', filter: 'drop-shadow(0 0 6px #1a90ff88)' }} />
        <div className="w-3 h-12 rounded-sm" style={{ background: 'linear-gradient(to bottom,#80b0e0,#4080c0,#2060a0)' }} />
        <div className="w-8 h-4 clip-angled" style={{ background: 'linear-gradient(to bottom,#4060a0,#304080)' }} />
      </div>
    ),
  },
];

// Real values — src/Core/Constants.h `DEFENSES[]`. The armory's right-hand
// rack: what a tank buys to survive the next volley instead of winning the
// last one.
const defences = [
  {
    id: 'shield_cell', name: 'Shield Cell', costLabel: '500 CR · +40 SHIELD',
    color: '#50d2ff',
    desc: 'Raises the energy dome\u2019s capacity and tops it back up. Stacks to 200 HP of shield.',
  },
  {
    id: 'mag_field', name: 'Mag Field', costLabel: '900 CR · DEFLECT ×1',
    color: '#96beff',
    desc: 'Coil lanes orbiting the hull. A shell that enters the bubble is thrown straight back out — one charge per deflection, three lanes maximum.',
  },
  {
    id: 'aegis_dome', name: 'Aegis Dome', costLabel: '1,200 CR · \u221220% DAMAGE',
    color: '#78ebdc',
    desc: 'A wider, faceted shell over the shield. Bleeds 20% off everything that gets through, per tier, up to three tiers.',
  },
  {
    id: 'reactive_armor', name: 'React Armor', costLabel: '800 CR · EATS 1 HIT',
    color: '#ffaa46',
    desc: 'Plates bolted to the flanks. Each one detonates outward and cancels a hit whole — damage, shield drain and all.',
  },
];

function StatBar({ label, value, max, unit, color, animKey }: { label: string; value: number; max: number; unit: string; color: string; animKey: number }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-xs text-muted w-14 flex-shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-bg border border-line-2 relative overflow-hidden">
        <motion.div
          key={`${label}-${animKey}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: [0.22, 0.68, 0, 1.2], delay: 0.05 }}
          style={{ background: color, height: '100%', boxShadow: `0 0 8px ${color}` }}
        />
      </div>
      <span className="font-mono text-xs text-ink w-14 text-right flex-shrink-0 tabular-nums">{value}{unit}</span>
    </div>
  );
}

export default function Arsenal() {
  const [sel, setSel] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const select = (i: number) => { setSel(i); setAnimKey(k => k + 1); };
  const w = weapons[sel];

  return (
    <section id="arsenal" className="relative py-24 md:py-28 px-6 bg-bg-2">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-block font-mono text-xs text-amber-2 border border-amber/40 px-4 py-1.5 mb-4 tracking-widest">
            ORDNANCE
          </div>
          <h2 className="font-display text-2xl md:text-4xl text-cream tracking-tight uppercase">Arsenal</h2>
          <p className="font-mono text-sm text-muted mt-3">All 7 weapons, real numbers — select one to inspect</p>
          <p className="font-mono text-xs text-muted-2 mt-2">
            In game each one is built as a live wireframe — the MIRV bus
            separates its warheads, the cluster canister spills its bomblets —
            beside a dossier typed onto a green phosphor CRT
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Weapon selector list */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-2.5">
            {weapons.map((wp, i) => (
              <motion.button
                key={wp.id}
                onClick={() => select(i)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.97 }}
                className={`relative text-left px-4 py-2.5 border transition-all duration-200 clip-angled-sm ${
                  sel === i ? 'border-amber bg-amber/8' : 'border-line bg-panel hover:border-line-2'
                }`}
              >
                {sel === i && (
                  <motion.div
                    layoutId="weapon-indicator"
                    className="absolute left-0 top-0 bottom-0 w-0.5 bg-amber"
                    style={{ boxShadow: '0 0 8px #d69a1f' }}
                  />
                )}
                <div className="font-mono text-sm text-cream">{wp.name}</div>
                <div className="font-mono text-[10px] mt-0.5" style={{ color: wp.costColor }}>{wp.costLabel}</div>
              </motion.button>
            ))}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={w.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="relative bg-panel border p-8 clip-angled h-full"
                style={{ borderColor: sel > 0 ? `${w.barColor}40` : 'var(--line)' }}
              >
                {w.badge && (
                  <div className="absolute top-0 right-6 font-mono text-[10px] px-3 py-1 text-bg font-bold" style={{ background: w.barColor }}>
                    {w.badge}
                  </div>
                )}

                <div className="flex items-start gap-6 mb-8 flex-wrap">
                  <div className="flex items-center justify-center w-28 h-28 bg-bg border border-line flex-shrink-0">
                    {w.art}
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-cream mb-2 uppercase">{w.name}</h3>
                    <div className="font-mono text-sm" style={{ color: w.costColor }}>{w.costLabel}</div>
                    {(w.clusters > 0 || w.pen) && (
                      <div className="font-mono text-xs text-muted mt-2">
                        {w.clusters > 0 && `Splits into ${w.clusters} sub-shells`}
                        {w.pen && 'Penetrates terrain before detonating'}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <StatBar label="DAMAGE" value={w.dmg} max={MAX_DMG} unit=" hp" color={w.barColor} animKey={animKey} />
                  <StatBar label="BLAST" value={w.rad} max={MAX_RAD} unit="px" color={w.barColor} animKey={animKey} />
                </div>

                <p className="font-mono text-sm text-ink leading-relaxed">{w.desc}</p>

                <div
                  className="absolute inset-0 pointer-events-none opacity-20"
                  style={{ background: `radial-gradient(ellipse at 80% 80%, ${w.barColor}20, transparent 60%)` }}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Defensive rack ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-20 mb-10"
        >
          <div className="inline-block font-mono text-xs text-teal border border-teal/40 px-4 py-1.5 mb-4 tracking-widest">
            DEFENSE
          </div>
          <h2 className="font-display text-2xl md:text-4xl text-cream tracking-tight uppercase">
            Defensive Systems
          </h2>
          <p className="font-mono text-sm text-muted mt-3">
            The armory&apos;s other rack — four ways to still be there next turn
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {defences.map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className="relative bg-panel border p-5 clip-angled-sm"
              style={{ borderColor: `${d.color}40` }}
            >
              <div className="w-8 h-0.5 mb-4" style={{ background: d.color, boxShadow: `0 0 8px ${d.color}` }} />
              <h3 className="font-display text-lg text-cream uppercase">{d.name}</h3>
              <div className="font-mono text-[11px] mt-1" style={{ color: d.color }}>{d.costLabel}</div>
              <p className="font-mono text-xs text-ink leading-relaxed mt-3">{d.desc}</p>
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{ background: `radial-gradient(ellipse at 80% 90%, ${d.color}20, transparent 65%)` }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
