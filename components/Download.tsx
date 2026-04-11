'use client';
import { motion } from 'framer-motion';

const stores = [
  {
    name: 'App Store',
    sub: 'Download on the',
    accent: '#d0d0d0',
    border: '#333',
    hoverBorder: '#e0e0e0',
    hoverGlow: 'rgba(200,200,200,0.2)',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
    ),
  },
  {
    name: 'Google Play',
    sub: 'Get it on',
    accent: '#3ddc84',
    border: '#1a4a30',
    hoverBorder: '#3ddc84',
    hoverGlow: 'rgba(61,220,132,0.2)',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M3.18 23.76a1.05 1.05 0 01-.54-.15 1.1 1.1 0 01-.52-.96V1.35a1.1 1.1 0 01.52-.96 1.07 1.07 0 011.1.04l17.46 10.65a1.1 1.1 0 010 1.84L3.74 23.57a1.07 1.07 0 01-.56.19z"/>
      </svg>
    ),
  },
  {
    name: 'Steam',
    sub: 'Available on',
    accent: '#c6d4df',
    border: '#2a3d50',
    hoverBorder: '#c6d4df',
    hoverGlow: 'rgba(198,212,223,0.2)',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.718L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.606 0 11.979 0z"/>
      </svg>
    ),
  },
  {
    name: 'PC & Mac',
    sub: 'Direct download',
    accent: '#4090d0',
    border: '#1a2d44',
    hoverBorder: '#4090d0',
    hoverGlow: 'rgba(64,144,208,0.25)',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
      </svg>
    ),
  },
];

export default function Download() {
  return (
    <section id="download" className="relative py-28 px-6 bg-[#0a0a12] overflow-hidden">
      {/* Background ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #ff5f00, transparent 70%)' }} />
      </div>
      <div className="absolute inset-0 bg-grid-subtle bg-[length:40px_40px] opacity-25 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="inline-block font-mono text-xs text-[#ff5f00] border border-[#ff5f00]/40 px-4 py-1.5 mb-4 tracking-widest">
            DEPLOYMENT
          </div>
          <h2 className="font-pixel text-2xl md:text-3xl text-[#ffd040] glow-gold mb-4 tracking-tight">
            Get the Game
          </h2>
          <p className="font-sans text-sm text-[#505070] max-w-md mx-auto leading-relaxed">
            Available on all major platforms. Pick yours and start the bombardment.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-14">
          {stores.map((s, i) => (
            <motion.a
              key={s.name}
              href="#"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4, boxShadow: `0 8px 32px ${s.hoverGlow}` }}
              whileTap={{ scale: 0.97 }}
              className="relative flex items-center gap-4 px-5 py-4 bg-[#0a0a10] border clip-angled text-left group no-underline"
              style={{ borderColor: s.border }}
              onClick={e => e.preventDefault()}
            >
              {/* Hover border */}
              <motion.div
                className="absolute inset-0 clip-angled pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                style={{ border: `1px solid ${s.hoverBorder}`, transition: 'opacity 0.2s' }}
              />

              <div style={{ color: s.accent, opacity: 0.7 }} className="flex-shrink-0 group-hover:opacity-100 transition-opacity">
                {s.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-mono text-xs text-[#404060]">{s.sub}</div>
                <div className="font-mono text-sm text-white mt-0.5">{s.name}</div>
              </div>

              <div className="font-mono text-xs text-[#ff5f00] border border-[#ff5f00]/40 px-2 py-0.5 flex-shrink-0">
                Soon
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="font-sans text-sm text-[#404060] leading-loose"
        >
          Stay in the loop — contact{' '}
          <strong className="text-[#c0c0e0] font-medium">Javier Bascones Velázquez</strong>
          <br />
          <a
            href="mailto:javier.bascones@gmail.com"
            className="text-[#ffd040] hover:underline transition-all"
          >
            javier.bascones@gmail.com
          </a>
        </motion.div>
      </div>
    </section>
  );
}
