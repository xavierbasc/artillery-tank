'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const weapons = [
  {
    id: 'shell',
    name: 'Shell',
    cost: '∞  FREE',
    costColor: '#606080',
    dmg: 30, rad: 32, spd: 75,
    barColor: '#ff8c00',
    badge: null,
    desc: 'The backbone of every strategy. Reliable, fast, unlimited. Master the arc before spending credits.',
    flavour: 'Standard ordnance. No excuses, no mercy.',
    art: (
      <div className="relative w-24 h-10 flex items-center justify-center">
        <div className="absolute w-20 h-5 rounded-full" style={{ background: 'linear-gradient(to right,#b0a050,#e0d870,#b0a050)', filter: 'drop-shadow(0 0 6px #ffd04088)' }} />
        <div className="absolute right-0 w-4 h-4 clip-angled-sm" style={{ background: '#e0c040' }} />
        <div className="absolute left-0 w-8 h-2 rounded-l-full" style={{ background: 'linear-gradient(to right,transparent,rgba(255,200,80,0.4))' }} />
      </div>
    ),
  },
  {
    id: 'nuke',
    name: 'Nuke',
    cost: '5,000 CR',
    costColor: '#ff2a20',
    dmg: 85, rad: 100, spd: 60,
    barColor: '#ff2a20',
    badge: 'DEVASTATOR',
    desc: 'Screen-filling white flash. Obliterates a third of the map. Win the war — lose the landscape.',
    flavour: 'Mutually assured terrain destruction.',
    art: (
      <div className="relative w-24 h-24 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-16 h-16 rounded-full"
          style={{ background: 'radial-gradient(circle at 35% 35%,#80ff60,#20aa20,#104010)', filter: 'drop-shadow(0 0 14px #40ff40)' }}
        />
        {[0, 0.6, 1.2].map((delay, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border-2 border-green-400/30"
            style={{ inset: `${-6 - i * 8}px` }}
            animate={{ opacity: [0.5, 0], scale: [0.8, 1.6] }}
            transition={{ duration: 2, delay, repeat: Infinity, ease: 'easeOut' }}
          />
        ))}
      </div>
    ),
  },
  {
    id: 'cluster',
    name: 'Cluster',
    cost: '3,000 CR',
    costColor: '#ffd040',
    dmg: 20, rad: 15, spd: 80,
    barColor: '#ffd040',
    badge: 'AREA DENIAL',
    desc: 'Splits into 6 sub-shells on impact. Excellent area denial — terrible for precision work.',
    flavour: 'Why hit once when you can hit everywhere?',
    art: (
      <div className="relative w-24 h-16 flex items-center justify-center">
        <div className="w-10 h-10 clip-angled" style={{ background: 'linear-gradient(135deg,#ffb830,#ff7010)', filter: 'drop-shadow(0 0 8px #ffd04088)' }} />
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full"
            style={{ background: '#ffb030' }}
            animate={{
              x: Math.cos(angle * Math.PI / 180) * 24,
              y: Math.sin(angle * Math.PI / 180) * 18,
              opacity: [0.3, 1, 0.3],
            }}
            transition={{ duration: 1.8, delay: i * 0.12, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>
    ),
  },
  {
    id: 'penetrator',
    name: 'Penetrator',
    cost: '2,000 CR',
    costColor: '#60c0ff',
    dmg: 50, rad: 27, spd: 90,
    barColor: '#1a90ff',
    badge: 'BUNKER BUSTER',
    desc: 'Burrows underground before detonating. Defeats enemies hiding behind hills or dug in deep.',
    flavour: 'No hill is tall enough. No shelter deep enough.',
    art: (
      <div className="relative w-12 h-24 flex flex-col items-center justify-center">
        <div className="w-3 h-5 clip-angled" style={{ background: 'linear-gradient(to bottom,#c0e0ff,#6090d0)', filter: 'drop-shadow(0 0 6px #1a90ff88)' }} />
        <div className="w-3 h-12 rounded-sm" style={{ background: 'linear-gradient(to bottom,#80b0e0,#4080c0,#2060a0)' }} />
        <div className="w-8 h-4 clip-angled" style={{ background: 'linear-gradient(to bottom,#4060a0,#304080)' }} />
      </div>
    ),
  },
];

function StatBar({ label, value, color, animKey }: { label: string; value: number; color: string; animKey: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-xs text-[#404060] w-8 flex-shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-[#111] border border-[#1e1e2e] relative overflow-hidden">
        <motion.div
          key={`${label}-${animKey}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.9, ease: [0.22, 0.68, 0, 1.2], delay: 0.05 }}
          style={{ background: color, height: '100%', boxShadow: `0 0 8px ${color}` }}
        />
      </div>
      <span className="font-mono text-xs text-[#606080] w-7 text-right flex-shrink-0">{value}</span>
    </div>
  );
}

export default function Arsenal() {
  const [sel,      setSel]      = useState(0);
  const [animKey,  setAnimKey]  = useState(0);

  const select = (i: number) => {
    setSel(i);
    setAnimKey(k => k + 1);
  };

  const w = weapons[sel];

  return (
    <section id="arsenal" className="relative py-28 px-6 bg-[#0d0d12]">
      <div className="absolute inset-0 bg-grid-subtle bg-[length:40px_40px] opacity-30 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block font-mono text-xs text-[#ff5f00] border border-[#ff5f00]/40 px-4 py-1.5 mb-4 tracking-widest">
            ORDNANCE
          </div>
          <h2 className="font-pixel text-2xl md:text-3xl text-white tracking-tight">Arsenal</h2>
          <p className="font-sans text-sm text-[#505070] mt-3">Select a weapon to inspect</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Weapon selector list */}
          <div className="lg:col-span-2 flex flex-row lg:flex-col gap-3">
            {weapons.map((wp, i) => (
              <motion.button
                key={wp.id}
                onClick={() => select(i)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.97 }}
                className={`relative flex-1 lg:flex-none text-left px-4 py-3 border transition-all duration-200 clip-angled-sm ${
                  sel === i
                    ? 'border-[#ff5f00] bg-[#ff5f00]/8'
                    : 'border-[#1e1e2e] bg-[#0a0a10] hover:border-[#2e2e4e]'
                }`}
              >
                {sel === i && (
                  <motion.div
                    layoutId="weapon-indicator"
                    className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#ff5f00]"
                    style={{ boxShadow: '0 0 8px #ff5f00' }}
                  />
                )}
                <div className="font-mono text-sm text-white">{wp.name}</div>
                <div className="font-mono text-xs mt-0.5" style={{ color: wp.costColor }}>{wp.cost}</div>
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
                className="relative bg-[#0a0a10] border border-[#1e1e2e] p-8 clip-angled h-full"
                style={{ borderColor: sel > 0 ? `${w.barColor}40` : '#1e1e2e' }}
              >
                {/* Badge */}
                {w.badge && (
                  <div
                    className="absolute top-0 right-6 font-mono text-xs px-3 py-1 text-black"
                    style={{ background: w.barColor }}
                  >
                    {w.badge}
                  </div>
                )}

                {/* Art + name */}
                <div className="flex items-start gap-6 mb-8">
                  <div className="flex items-center justify-center w-28 h-28 bg-[#080810] border border-[#1e1e2e]">
                    {w.art}
                  </div>
                  <div>
                    <h3 className="font-pixel text-xl text-white mb-2">{w.name}</h3>
                    <div className="font-mono text-sm" style={{ color: w.costColor }}>{w.cost}</div>
                    <div className="font-mono text-xs text-[#404060] mt-3 italic">"{w.flavour}"</div>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-3 mb-8">
                  <StatBar label="DMG" value={w.dmg} color={w.barColor} animKey={animKey} />
                  <StatBar label="RAD" value={w.rad} color={w.barColor} animKey={animKey} />
                  <StatBar label="SPD" value={w.spd} color={w.barColor} animKey={animKey} />
                </div>

                {/* Description */}
                <p className="font-sans text-sm text-[#606078] leading-relaxed">{w.desc}</p>

                {/* Glow */}
                <div
                  className="absolute inset-0 pointer-events-none rounded-none opacity-20"
                  style={{ background: `radial-gradient(ellipse at 80% 80%, ${w.barColor}20, transparent 60%)` }}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
