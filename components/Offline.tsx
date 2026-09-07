'use client';
import { motion } from 'framer-motion';
import { WifiOff, Database, EyeOff, Package } from 'lucide-react';

const points = [
  { icon: WifiOff, title: 'No servers', desc: 'There is no networking code anywhere in the codebase — no sockets, no HTTP client, nothing to reach out to. The one outward link is the SHARE button on the main menu, which hands a URL to your browser and nothing else.' },
  { icon: EyeOff, title: 'No accounts, no telemetry', desc: 'Nothing is measured, logged remotely, or phoned home. What happens on your machine stays on your machine.' },
  { icon: Package, title: 'Self-contained binary', desc: 'Every library it needs is linked statically and every image asset is embedded in the executable — the game runs from a single file, no install directory to keep intact.' },
  { icon: Database, title: 'Audio with no audio files', desc: 'Cannon fire and explosions are synthesised sample-by-sample at run time. The soundtrack is the only audio data on disk — everything else is generated math.' },
];

export default function Offline() {
  return (
    <section id="offline" className="relative py-24 md:py-32 px-6 bg-bg overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(46,168,154,0.06) 0%, transparent 55%)' }}
      />

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <div className="inline-block font-mono text-xs text-teal-2 border border-teal/40 px-4 py-1.5 mb-6 tracking-widest">
            NO SERVERS · NO ACCOUNTS · NO TELEMETRY
          </div>
          <h2 className="font-display leading-[0.95] uppercase text-cream" style={{ fontSize: 'clamp(2rem, 6vw, 3.6rem)' }}>
            It Runs. That&apos;s <span className="text-teal-2 glow-teal">All</span> It Does.
          </h2>
          <p className="font-mono text-sm md:text-base text-ink max-w-2xl mx-auto mt-6 leading-relaxed">
            No login screen, no EULA to click through, no background process
            checking in with anyone. Compile it once and it will run exactly
            the same in ten years, on a machine with no internet connection
            at all — a small argument for both privacy and preservation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-line mt-14">
          {points.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="bg-panel p-7 flex gap-4"
              >
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-teal/10 border border-teal/20">
                  <Icon size={18} className="text-teal-2" />
                </div>
                <div>
                  <h3 className="font-mono text-sm font-bold text-cream mb-1.5">{p.title}</h3>
                  <p className="font-mono text-xs text-ink leading-relaxed">{p.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
