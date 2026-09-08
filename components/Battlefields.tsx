'use client';
import { motion } from 'framer-motion';
import { asset } from '@/lib/asset';

// Every image here is a real capture, all taken in one run of the game's
// screenshot mode (see UpdateScreenshotMode, "Battle gallery" / "Sky gallery"):
// the same missile lands at the same spot a second earlier, so what differs
// between shots is only the battlefield.
interface Shot { src: string; name: string; tag: string; desc: string; accent: string }

const arenas: Shot[] = [
  { src: '/shots/arena-soil.png',    name: 'Soil',     tag: 'SOIL',
    desc: 'The baseline dirt every other terrain is measured against',  accent: '#8a9a4a' },
  { src: '/shots/arena-sand.png',    name: 'Sand',     tag: 'SAND',
    desc: 'Loose dunes — the widest craters, debris thrown furthest',   accent: '#d69a1f' },
  { src: '/shots/arena-rock.png',    name: 'Rock',     tag: 'ROCK',
    desc: 'Granite that barely gives — tight, shallow craters',         accent: '#8a8f9a' },
  { src: '/shots/arena-clay.png',    name: 'Clay',     tag: 'CLAY',
    desc: 'Heavy wet ground, a slow and reluctant collapse',            accent: '#b4643c' },
  { src: '/shots/arena-snow.png',    name: 'Snow',     tag: 'SNOW',
    desc: 'Soft drifts that slide a long way once something breaks',    accent: '#9fc8e8' },
  { src: '/shots/arena-lava.png',    name: 'Volcanic', tag: 'LAVA',
    desc: 'Cinder cones under a burning sky, debris comes off glowing', accent: '#e0642c' },
  { src: '/shots/arena-crystal.png', name: 'Crystal',  tag: 'CRYSTAL',
    desc: 'The hardest ground in the game, twin moons overhead',        accent: '#b07ae0' },
  { src: '/shots/arena-jungle.png',  name: 'Jungle',   tag: 'JUNGLE',
    desc: 'Root-bound soil under a dead treeline',                      accent: '#4aa06a' },
];

const skies: Shot[] = [
  { src: '/shots/sky-storm.png',    name: 'Thunderstorm', tag: 'STORM',
    desc: 'Bolts strike the field — a hit breaks a shield outright',     accent: '#9fb6e8' },
  { src: '/shots/sky-rain.png',     name: 'Rain',         tag: 'RAIN',
    desc: 'Downpour slanted by the same wind that bends your shot',      accent: '#5fd6c6' },
  { src: '/shots/sky-skyline.png',  name: 'City Skyline', tag: 'NIGHT STARS',
    desc: 'A lit downtown on the horizon, windows switching on and off', accent: '#ffb92e' },
  { src: '/shots/sky-fog.png',      name: 'Fog',          tag: 'FOG',
    desc: 'Low grey haze that swallows the far parallax layers',         accent: '#c8d0dc' },
  { src: '/shots/sky-redsky.png',   name: 'Red Sky',      tag: 'RED SKY',
    desc: 'Amber glow over the volcanic ridges',                         accent: '#c2321f' },
  { src: '/shots/sky-night.png',    name: 'Moonless Night', tag: 'NIGHT',
    desc: 'Starfield, a ringed planet, and very little else to see by',  accent: '#8a7ae0' },
  { src: '/shots/sky-overcast.png', name: 'Overcast',     tag: 'OVERCAST',
    desc: 'Heavy cloud over ruins — the game’s default gloom',      accent: '#8a8f9a' },
  { src: '/shots/sky-snow.png',     name: 'Snowfall',     tag: 'SNOW',
    desc: 'Flakes in three depths — the nearest drift past in front of the tanks', accent: '#dce8f5' },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 0.68, 0, 1.2] as const } },
};

function Grid({ shots }: { shots: Shot[] }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.05 }}
      className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-line"
    >
      {shots.map((s) => (
        <motion.figure key={s.src} variants={item} className="bg-panel group overflow-hidden">
          <div className="relative overflow-hidden">
            {/* Plain <img>: next/image doesn't apply basePath in a static
                export, which would break every src under the project path. */}
            <img
              src={asset(s.src)}
              alt={`TerraShell Fracture — ${s.name} battlefield`}
              width={1280}
              height={720}
              loading="lazy"
              className="block w-full h-auto transition-transform duration-500 group-hover:scale-[1.03]"
              style={{ imageRendering: 'pixelated' }}
            />
            <span className="absolute top-0 left-0 h-full w-[3px]"
                  style={{ background: s.accent }} aria-hidden="true" />
          </div>
          <figcaption className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-4 py-3 border-t border-line">
            <span className="font-display text-base text-cream uppercase tracking-wide">{s.name}</span>
            <span className="font-mono text-[11px] tracking-widest" style={{ color: s.accent }}>{s.tag}</span>
            <span className="font-mono text-[11px] text-muted leading-snug w-full md:w-auto md:ml-auto md:text-right">
              {s.desc}
            </span>
          </figcaption>
        </motion.figure>
      ))}
    </motion.div>
  );
}

export default function Battlefields() {
  return (
    <section id="battlefields" className="relative py-24 md:py-28 px-6 bg-bg">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-block font-mono text-xs text-amber-2 border border-amber/40 px-4 py-1.5 mb-4 tracking-widest">
            FIFTEEN BATTLEFIELDS
          </div>
          <h2 className="font-display text-2xl md:text-4xl text-cream tracking-tight uppercase">
            One Shell, Every Battlefield
          </h2>
          <p className="font-mono text-sm text-muted mt-4 max-w-2xl mx-auto leading-relaxed">
            The same missile, the same moment after impact, across every biome
            and every sky the generator can deal you. Terrain shape, palette,
            horizon and weather all hang off one seed, so no two rounds are
            fought on the same ground.
          </p>
        </motion.div>

        <h3 className="font-mono text-xs text-teal-2 tracking-widest text-center mb-5">
          EIGHT BIOMES — EACH WITH ITS OWN BLAST PHYSICS
        </h3>
        <Grid shots={arenas} />

        <h3 className="font-mono text-xs text-teal-2 tracking-widest text-center mt-16 mb-5">
          SEVEN SKIES — WEATHER, HORIZON AND LIGHT
        </h3>
        <Grid shots={skies} />
      </div>
    </section>
  );
}
