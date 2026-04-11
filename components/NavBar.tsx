'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const links = [
  { label: 'Demo',     href: '#arena' },
  { label: 'Features', href: '#features' },
  { label: 'Arsenal',  href: '#arsenal' },
  { label: 'Controls', href: '#controls' },
  { label: 'Tech',     href: '#specs' },
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
          ? 'bg-[#080808]/90 backdrop-blur-md border-b border-[#1e1e2e]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <a href="#top" className="font-pixel text-xs leading-none flex items-center gap-0">
          <span className="text-white">TERRA</span>
          <span className="text-[#ff5f00] glow-fire">SHELL</span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <li key={l.href}>
              <a
                href={l.href}
                className="font-mono text-xs text-[#606080] hover:text-[#ff8c00] transition-colors duration-200"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href="#download"
          className="hidden md:flex items-center gap-2 font-mono text-xs text-[#ffd040] border border-[#ffd040]/40 px-4 py-2 clip-angled-sm hover:bg-[#ffd040]/10 hover:border-[#ffd040] transition-all duration-200"
        >
          GET THE GAME
        </a>

        {/* Mobile burger */}
        <button
          onClick={() => setOpen(o => !o)}
          className="md:hidden text-[#ff5f00] p-1"
          aria-label="Toggle menu"
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
            className="md:hidden bg-[#0a0a0a] border-b border-[#1e1e2e] overflow-hidden"
          >
            <ul className="px-6 py-4 flex flex-col gap-4">
              {links.map(l => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="font-mono text-sm text-[#909090] hover:text-[#ff8c00] transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#download"
                  onClick={() => setOpen(false)}
                  className="font-mono text-sm text-[#ffd040] border border-[#ffd040]/40 px-4 py-2 inline-block"
                >
                  GET THE GAME
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
