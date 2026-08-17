'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Trophy, Radio, Users } from 'lucide-react';

const EXAMPLE_CODE = 'TSF1-6MRW-0000-005W-AM26-J0T9-XC0B-5N';

const steps = [
  {
    icon: Trophy,
    title: '1 · Play',
    desc: 'Every match tracks your level reached, accuracy, kills and difficulty into a local top-20 board — no account, no setup.',
  },
  {
    icon: Radio,
    title: '2 · Read it out',
    desc: 'Any entry on your board resolves to a short text code — 26 Crockford Base32 symbols chosen to be unambiguous when read aloud or dictated over the phone.',
  },
  {
    icon: Users,
    title: '3 · Type it in',
    desc: 'Your friend enters the code into their own copy of the game. Your score lands in their table tagged RIVAL, forever, with zero servers in between.',
  },
];

export default function ShareCodes() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EXAMPLE_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — silently ignore */
    }
  };

  return (
    <section id="share" className="relative py-24 md:py-28 px-6 bg-bg-2">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="inline-block font-mono text-xs text-amber-2 border border-amber/40 px-4 py-1.5 mb-4 tracking-widest">
            SNEAKERNET LEADERBOARDS
          </div>
          <h2 className="font-display text-2xl md:text-4xl text-cream tracking-tight uppercase">
            Share Codes
          </h2>
          <p className="font-mono text-sm text-muted mt-4 max-w-xl mx-auto leading-relaxed">
            A local high-score table you can still compare with a friend —
            without either of you ever going online.
          </p>
        </motion.div>

        {/* Example code */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="plate clip-angled max-w-xl mx-auto mb-16 overflow-hidden"
        >
          <div className="flex items-center gap-3 px-5 py-2.5 bg-panel-2 border-b border-line">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-amber" />
              <div className="w-2.5 h-2.5 rounded-full bg-teal" />
              <div className="w-2.5 h-2.5 rounded-full bg-green" />
            </div>
            <span className="font-mono text-[11px] text-muted tracking-widest">EXAMPLE — ONE ENTRY, ONE CODE</span>
          </div>
          <div className="p-6 flex items-center justify-between gap-4 flex-wrap">
            <code className="font-mono text-sm md:text-base text-amber-2 break-all">{EXAMPLE_CODE}</code>
            <button
              onClick={copy}
              className="flex-shrink-0 flex items-center gap-2 font-mono text-xs text-cream border border-line-2 px-3 py-2 hover:border-amber/60 hover:text-amber-2 transition-colors"
              aria-label="Copy example share code"
            >
              {copied ? <Check size={14} className="text-teal-2" /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="px-6 pb-5 font-mono text-[11px] text-muted leading-relaxed">
            Name, score, level, accuracy, kills, difficulty and a tamper-detecting
            checksum, packed losslessly into 26 symbols — the checksum alone
            rejects 99.3% of mistyped or corrupted codes before they can pollute
            your table.
          </div>
        </motion.div>

        {/* 3-step flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-panel p-7"
              >
                <div className="w-10 h-10 flex items-center justify-center mb-4 bg-amber/10 border border-amber/20">
                  <Icon size={18} className="text-amber-2" />
                </div>
                <h3 className="font-mono text-sm font-bold text-cream mb-2 tracking-wide">{s.title}</h3>
                <p className="font-mono text-xs text-ink leading-relaxed">{s.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
