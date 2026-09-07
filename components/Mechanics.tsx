'use client';
import { motion } from 'framer-motion';
import { Zap, Layers, Music, CloudLightning, ShoppingCart, Shield, Wrench, Crosshair } from 'lucide-react';

const cards = [
  {
    icon: Zap,
    title: 'Destructible Terrain',
    desc: 'Every explosion carves a physically accurate crater into the heightmap along the true bottom arc of the blast — a permanent scar, not a decal. Midpoint displacement builds a new landscape every round, and a landing-pad pass guarantees two flat footholds always exist, so no shape ever produces an impossible shot.',
    accent: '#d69a1f',
    span: 'col-span-1 md:col-span-2',
    big: true,
  },
  {
    icon: Layers,
    title: 'Layered Explosions',
    desc: '2,048-particle pool driving 6 blending layers per hit — white flash, inner pulse, a double-layered shockwave ring, physics debris, rising embers and smoke — sized per weapon so a Baby Missile and a Nuke never look alike. Blasts run wide and slow enough to watch, over a seven-layer detonation synthesised on the spot: the rip, the punch, shrapnel scattered across the stereo field and two delayed echoes coming back off the terrain. Every blast also leaves a persistent scorch decal on the ground, and the chunks it throws come to rest as rubble that stays planted on the surface — even after a later shell reshapes the hill beneath it.',
    accent: '#ff5b3d',
    span: 'col-span-1',
  },
  {
    icon: Music,
    title: 'Synth + MOD Audio',
    desc: 'Cannon shots and explosions are synthesised in real time — square-wave sweeps and filtered noise, no .wav files anywhere. Menu and battle each run a MOD tracker soundtrack through libxmp over an SDL3 AudioStream.',
    accent: '#a06fd6',
    span: 'col-span-1',
  },
  {
    icon: CloudLightning,
    title: 'Storms & Lightning',
    desc: 'Overcast, fog, rain, red-sky, moonless night and full thunderstorms — clouds drift with the wind, rain slants with it, and a storm bolt hits like a shell: it breaks a shield outright, and an unshielded tank goes up with the full death sequence.',
    accent: '#5fd6c6',
    span: 'col-span-1',
  },
  {
    icon: Wrench,
    title: 'Tanks That Show Damage',
    desc: 'Wheels spin, suspension flexes and the antenna sways as you drive the barrel. Below 60% HP the hull picks up dents and soot; below 30% it leaks smoke and sparks. Livery pattern varies by player slot, so shared colours never look like reskins.',
    accent: '#4a9a3f',
    span: 'col-span-1',
  },
  {
    icon: ShoppingCart,
    title: 'Shop & Economy',
    desc: `Start every match with ${'5,000'} credits and earn ${'300'} more per confirmed hit. The armory has two racks — ordnance on the left, defensive systems on the right — with a rotating 3D model and a dossier typed onto a CRT for whatever you have selected. No penalty for a clean miss.`,
    accent: '#ffb92e',
    span: 'col-span-1',
  },
  {
    icon: Shield,
    title: 'Shields & Defence Rack',
    desc: 'The energy dome is a 72-point arc clipped to the ground, shifting cyan → orange → red as it degrades. Shield cells raise its 40 HP up to 200; an aegis dome widens it and bleeds 20% off every hit; a mag field throws incoming shells back out before they land; reactive plates detonate outward and cancel a hit whole. Whichever system you engage takes the next hit first.',
    accent: '#2ea89a',
    span: 'col-span-1',
  },
  {
    icon: Crosshair,
    title: 'Bots That Range In',
    desc: 'Enemy tanks walk their fire onto you. Each bot watches where its own shell landed and corrects the next shot from the miss — the artillery bracket — so a ridge or a cliff between you buys a turn or two, not the whole match. They also visit the armory: shield cells and reactive plates first, then ordnance that escalates with the level, up to a nuke deep into a run. Low skill barely learns and never touches the heavy stuff; high skill brackets in fast and saves the expensive shell for once it has your range.',
    accent: '#e0553c',
    span: 'col-span-1',
  },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };
const item = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 0.68, 0, 1.2] } } };

export default function Mechanics() {
  return (
    <section id="features" className="relative py-24 md:py-28 px-6 bg-bg">
      <div className="absolute inset-0 bg-grid opacity-25 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-block font-mono text-xs text-amber-2 border border-amber/40 px-4 py-1.5 mb-4 tracking-widest">
            MECHANICS
          </div>
          <h2 className="font-display text-2xl md:text-4xl text-cream tracking-tight uppercase">
            Battlefield Systems
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line"
        >
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <motion.article
                key={c.title}
                variants={item}
                className={`relative group bg-panel p-8 overflow-hidden ${c.span ?? ''}`}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 20% 20%, ${c.accent}14 0%, transparent 65%)` }}
                />
                <div
                  className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 opacity-30 group-hover:opacity-60 transition-opacity"
                  style={{ borderColor: c.accent }}
                />
                <div
                  className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, transparent, ${c.accent}, transparent)` }}
                />

                <div className="relative z-10">
                  <div
                    className="w-10 h-10 flex items-center justify-center mb-5 border border-white/5"
                    style={{ background: `${c.accent}18` }}
                  >
                    <Icon size={18} style={{ color: c.accent }} />
                  </div>

                  <h3 className="font-mono text-sm font-bold mb-3 tracking-wide" style={{ color: c.accent }}>
                    {c.title}
                  </h3>

                  <p className="font-mono text-xs text-ink leading-relaxed">
                    {c.desc}
                  </p>

                  {c.big && (
                    <div className="mt-6 grid grid-cols-3 gap-4">
                      {[['640×360', 'Resolution'], ['60 Hz', 'Fixed step'], ['2,048', 'Particles']].map(([n, l]) => (
                        <div key={l} className="border border-line px-3 py-2">
                          <div className="font-display text-xs text-amber-2">{n}</div>
                          <div className="font-mono text-[10px] text-muted mt-1">{l}</div>
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
