'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy, Send, MessageCircle } from 'lucide-react';
import { SITE_URL, SITE_NAME } from '@/lib/site';

// One line of copy shared everywhere, so a link posted from the game and one
// posted from this page read the same in the chat.
const PITCH = `${SITE_NAME} — pixel-art artillery with destructible terrain. Free, offline, no accounts:`;

const targets = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    color: '#25D366',
    icon: MessageCircle,
    href: `https://wa.me/?text=${encodeURIComponent(`${PITCH} ${SITE_URL}`)}`,
  },
  {
    id: 'telegram',
    label: 'Telegram',
    color: '#2AABEE',
    icon: Send,
    href: `https://t.me/share/url?url=${encodeURIComponent(SITE_URL)}&text=${encodeURIComponent(PITCH)}`,
  },
  {
    id: 'x',
    label: 'X',
    color: '#e8ecf3',
    icon: null,
    href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(PITCH)}&url=${encodeURIComponent(SITE_URL)}`,
  },
];

export default function ShareGame() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SITE_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard blocked (insecure context / denied) — the links still work */
    }
  };

  // id distinto de #share, que ya lo usa la sección de share codes de la tabla
  // de puntuaciones: dos secciones con el mismo id rompen el ancla del menú.
  return (
    <section id="tell-a-friend" className="relative py-20 px-6 bg-bg-2 border-t border-line">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative max-w-3xl mx-auto text-center">
        <div className="inline-block font-mono text-xs text-amber-2 border border-amber/40 px-4 py-1.5 mb-4 tracking-widest">
          PASS IT ON
        </div>
        <h2 className="font-display text-2xl md:text-4xl text-cream tracking-tight uppercase">
          Artillery is better with a rival
        </h2>
        <p className="font-mono text-sm text-muted mt-3 mb-8">
          Send the link — they play on the same couch, or beat your score and
          send back a share code
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {targets.map((t, i) => {
            const Icon = t.icon;
            return (
              <motion.a
                key={t.id}
                href={t.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                whileHover={{ y: -3 }}
                className="flex items-center gap-2 px-5 py-3 bg-panel border clip-angled-sm font-mono text-sm text-cream"
                style={{ borderColor: `${t.color}55` }}
              >
                {Icon
                  ? <Icon size={16} style={{ color: t.color }} />
                  : <span className="font-display text-base" style={{ color: t.color }}>X</span>}
                {t.label}
              </motion.a>
            );
          })}

          <motion.button
            onClick={copy}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.18 }}
            whileHover={{ y: -3 }}
            className="flex items-center gap-2 px-5 py-3 bg-panel border border-amber/50 clip-angled-sm font-mono text-sm text-amber-2"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Link copied' : 'Copy link'}
          </motion.button>
        </div>

        <p className="font-mono text-[11px] text-muted-2 mt-6">
          The game has the same button: <span className="text-amber-2">SHARE</span> in the
          top-right corner of the main menu
        </p>
      </div>
    </section>
  );
}
