'use client';
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { asset } from '@/lib/asset';

const shots = [
  {
    src: '/shots/menu.png',
    title: 'Main Menu',
    desc: 'Procedural pixel-art title scene, rendered entirely in-engine',
    accent: '#d69a1f',
    span: 'col-span-1 md:col-span-2',
  },
  {
    src: '/shots/gameplay.png',
    title: 'Battle',
    desc: 'Live HUD, trajectory guide, destructible heightmap terrain',
    accent: '#ffb92e',
    span: 'col-span-1',
  },
  {
    src: '/shots/shop.png',
    title: 'Armory',
    desc: 'Two racks — ordnance and defensive systems — beside a 3D datalink',
    accent: '#2ea89a',
    span: 'col-span-1',
  },
  {
    src: '/shots/defense.png',
    title: 'Defensive Rack',
    desc: 'Shield cells, mag fields, aegis domes and reactive plates, on a live hologram',
    accent: '#5fd6c6',
    span: 'col-span-1',
  },
  {
    src: '/shots/playersetup.png',
    title: 'Player Setup',
    desc: 'Two to six tanks, local multiplayer — humans or AI',
    accent: '#5fd6c6',
    span: 'col-span-1',
  },
  {
    src: '/shots/howtoplay.png',
    title: 'How To Play',
    desc: 'Keyboard and mouse on a labelled diagram, plus a field briefing on wind, ground and shields',
    accent: '#c2321f',
    span: 'col-span-1',
  },
  {
    src: '/shots/weaponselect.png',
    title: 'Arm Up',
    desc: 'Pre-match loadout — every player spends their opening credits',
    accent: '#2ea89a',
    span: 'col-span-1',
  },
  {
    src: '/shots/combat.png',
    title: 'Combat HUD',
    desc: 'Turn banner, draining turn clock and floating damage for every hit',
    accent: '#ff5b3d',
    span: 'col-span-1',
  },
  {
    src: '/shots/options.png',
    title: 'Settings',
    desc: 'Four tabs — audio, video, game and accessibility — each option explained in place',
    accent: '#5fd6c6',
    span: 'col-span-1',
  },
  {
    src: '/shots/options-access.png',
    title: 'Accessibility',
    desc: 'Reduced motion, a colourblind-safe player set and a one-tap reset',
    accent: '#a06fd6',
    span: 'col-span-1',
  },
  {
    src: '/shots/pause.png',
    title: 'Pause',
    desc: 'Resume, bail to the menu or quit — without losing the round',
    accent: '#d69a1f',
    span: 'col-span-1',
  },
  {
    src: '/shots/gameover.png',
    title: 'Match Debrief',
    desc: 'Rounds, shots, accuracy, damage, kills and best hit, then your rank',
    accent: '#ffb92e',
    span: 'col-span-1 md:col-span-2',
  },
  {
    src: '/shots/highscores.png',
    title: 'High Scores',
    desc: 'Local table and rivals — share codes typed in on an on-screen keypad',
    accent: '#c2321f',
    span: 'col-span-1',
  },
  {
    src: '/shots/credits.png',
    title: 'Credits',
    desc: 'A shell arcs across the starfield as the roll climbs',
    accent: '#5fd6c6',
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

export default function Screenshots() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const close = useCallback(() => setLightbox(null), []);
  const prev  = useCallback(() => setLightbox(i => (i === null ? null : (i + shots.length - 1) % shots.length)), []);
  const next  = useCallback(() => setLightbox(i => (i === null ? null : (i + 1) % shots.length)), []);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, close, prev, next]);

  return (
    <section id="arena" className="relative py-24 md:py-28 px-6 bg-bg-2">
      <div className="absolute inset-0 bg-grid opacity-25 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="inline-block font-mono text-xs text-amber-2 border border-amber/40 px-4 py-1.5 mb-4 tracking-widest">
            FIELD FOOTAGE
          </div>
          <h2 className="font-display text-2xl md:text-4xl text-cream tracking-tight uppercase">
            In-Game Screenshots
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line"
        >
          {shots.map((s, i) => (
            <motion.figure
              key={s.src}
              variants={item}
              className={`relative group bg-panel overflow-hidden m-0 ${s.span}`}
            >
              <button
                onClick={() => setLightbox(i)}
                className="relative block w-full overflow-hidden cursor-zoom-in"
                aria-label={`Expand screenshot: ${s.title}`}
              >
                <img
                  src={asset(s.src)}
                  alt={`${s.title} — ${s.desc}`}
                  width={1280}
                  height={720}
                  loading="lazy"
                  className="w-full h-auto block pixelated transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ boxShadow: `inset 0 0 0 2px ${s.accent}80` }}
                />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-bg/70 p-1.5">
                  <Expand size={14} color={s.accent} />
                </div>
              </button>

              <figcaption className="flex items-baseline justify-between px-4 py-3 border-t border-line gap-3">
                <span className="font-mono text-xs font-bold tracking-wide flex-shrink-0" style={{ color: s.accent }}>
                  {s.title}
                </span>
                <span className="font-mono text-xs text-muted text-right">{s.desc}</span>
              </figcaption>

              <div
                className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 opacity-30 group-hover:opacity-60 transition-opacity pointer-events-none"
                style={{ borderColor: s.accent }}
              />
            </motion.figure>
          ))}
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-bg/96 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
            role="dialog"
            aria-modal="true"
            aria-label={shots[lightbox].title}
            onClick={close}
          >
            <button
              onClick={(e) => { e.stopPropagation(); close(); }}
              className="absolute top-5 right-5 text-cream/70 hover:text-amber-2 p-2 z-10"
              aria-label="Close"
            >
              <X size={26} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 text-cream/60 hover:text-amber-2 p-2 z-10"
              aria-label="Previous screenshot"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 text-cream/60 hover:text-amber-2 p-2 z-10"
              aria-label="Next screenshot"
            >
              <ChevronRight size={32} />
            </button>

            <motion.div
              key={lightbox}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={asset(shots[lightbox].src)}
                alt={`${shots[lightbox].title} — ${shots[lightbox].desc}`}
                className="w-full h-auto pixelated border border-line-2"
              />
              <div className="flex items-baseline justify-between mt-3 px-1">
                <span className="font-mono text-sm font-bold" style={{ color: shots[lightbox].accent }}>
                  {shots[lightbox].title}
                </span>
                <span className="font-mono text-xs text-muted">{shots[lightbox].desc}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
