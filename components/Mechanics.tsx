'use client';
import { motion } from 'framer-motion';
import { Zap, Layers, Music, Wind, ShoppingCart, Smartphone } from 'lucide-react';

const cards = [
  {
    icon: Zap,
    title: 'Destructible Terrain',
    desc: 'Every explosion carves a physically accurate crater into the heightmap. Midpoint Displacement generates a unique landscape each round — no two battles are alike.',
    accent: '#ff5f00',
    span: 'col-span-1 md:col-span-2',
    big: true,
  },
  {
    icon: Layers,
    title: 'Multi-layer Particles',
    desc: '2,048-particle pool. Additive white flash → orange shockwave → physics debris → rising smoke. Three blending passes, zero allocations in-game.',
    accent: '#ff8c00',
    span: 'col-span-1',
  },
  {
    icon: Music,
    title: 'Synth + MOD Audio',
    desc: 'Cannon shots and explosions synthesised in real-time. Menu and battle each play a MOD tracker soundtrack via SDL3 AudioStream.',
    accent: '#a040ff',
    span: 'col-span-1',
  },
  {
    icon: Wind,
    title: 'Wind Physics',
    desc: 'Randomised wind changes every turn, pushing both projectiles and smoke. Factor it in — or miss and blame the weather.',
    accent: '#1a90ff',
    span: 'col-span-1',
  },
  {
    icon: ShoppingCart,
    title: 'Shop & Economy',
    desc: 'Earn credits by landing hits. Spend them on Nukes, Clusters, and Penetrators between rounds.',
    accent: '#ffd040',
    span: 'col-span-1',
  },
  {
    icon: Smartphone,
    title: 'Touch + Keyboard',
    desc: 'Full multitouch and keyboard support. Pixel-perfect on any screen from 320px mobile to 4K desktop.',
    accent: '#00d4aa',
    span: 'col-span-1',
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};
const item = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 0.68, 0, 1.2] } },
};

export default function Mechanics() {
  return (
    <section id="features" className="relative py-28 px-6 bg-[#080808]">
      {/* Grid texture */}
      <div className="absolute inset-0 bg-grid-subtle bg-[length:40px_40px] opacity-40 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-block font-mono text-xs text-[#ff5f00] border border-[#ff5f00]/40 px-4 py-1.5 mb-4 tracking-widest">
            MECHANICS
          </div>
          <h2 className="font-pixel text-2xl md:text-3xl text-white tracking-tight">
            Battlefield Systems
          </h2>
        </motion.div>

        {/* Bento grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#1a1a2a]"
        >
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <motion.article
                key={c.title}
                variants={item}
                whileHover={{ scale: 1.01 }}
                className={`relative group bg-[#0a0a12] p-8 overflow-hidden ${c.span ?? ''}`}
                style={{ '--accent': c.accent } as React.CSSProperties}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 20% 20%, ${c.accent}12 0%, transparent 65%)` }}
                />

                {/* Corner accent */}
                <div
                  className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 opacity-30 group-hover:opacity-60 transition-opacity"
                  style={{ borderColor: c.accent }}
                />

                {/* Glass border top */}
                <div
                  className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, transparent, ${c.accent}, transparent)` }}
                />

                <div className="relative z-10">
                  <div
                    className="w-10 h-10 rounded flex items-center justify-center mb-5 border border-white/5"
                    style={{ background: `${c.accent}18` }}
                  >
                    <Icon size={18} style={{ color: c.accent }} />
                  </div>

                  <h3
                    className="font-mono text-sm font-bold mb-3 tracking-wide"
                    style={{ color: c.accent }}
                  >
                    {c.title}
                  </h3>

                  <p className="font-sans text-sm text-[#606078] leading-relaxed">
                    {c.desc}
                  </p>

                  {c.big && (
                    <div className="mt-6 grid grid-cols-3 gap-4">
                      {[['640×360', 'Resolution'], ['60 Hz', 'Fixed step'], ['5', 'Platforms']].map(([n, l]) => (
                        <div key={l} className="border border-[#1e1e2e] px-3 py-2">
                          <div className="font-pixel text-xs text-[#ff5f00]">{n}</div>
                          <div className="font-mono text-xs text-[#404060] mt-1">{l}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
