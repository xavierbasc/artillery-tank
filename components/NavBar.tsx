'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const links = [
  { label: 'Gallery',   href: '#arena' },
  { label: 'Worlds',    href: '#scenarios' },
  { label: 'Arsenal',   href: '#arsenal' },
  { label: 'Offline',   href: '#offline' },
  { label: 'Share',     href: '#share' },
  { label: 'Controls',  href: '#controls' },
  { label: 'Tech',      href: '#specs' },
];

export default function NavBar() {
  const [open,      setOpen]      = useState(false);
  const [scrolled,  setScrolled]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-bg/92 backdrop-blur-md border-b border-line'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <a href="#top" className="font-display text-sm leading-none flex items-center gap-1 no-underline uppercase">
          <span className="text-cream">Terra</span>
          <span className="text-amber-2 glow-amber">Shell</span>
        </a>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-6">
          {links.map(l => (
            <li key={l.href}>
              <a
                href={l.href}
                className="font-mono text-xs text-muted hover:text-amber-2 transition-colors duration-200"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href="#download"
          className="hidden lg:flex items-center gap-2 font-mono text-xs text-amber-2 border border-amber/40 px-4 py-2 clip-angled-sm hover:bg-amber/10 hover:border-amber transition-all duration-200"
        >
          BUILD &amp; RUN
        </a>

        {/* Mobile burger */}
        <button
          onClick={() => setOpen(o => !o)}
          className="lg:hidden text-amber-2 p-1"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-bg-2 border-b border-line overflow-hidden"
          >
            <ul className="px-6 py-4 flex flex-col gap-4">
              {links.map(l => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="font-mono text-sm text-ink hover:text-amber-2 transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#download"
                  onClick={() => setOpen(false)}
                  className="font-mono text-sm text-amber-2 border border-amber/40 px-4 py-2 inline-block"
                >
                  BUILD &amp; RUN
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
