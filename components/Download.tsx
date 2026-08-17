'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Copy, Check, Terminal } from 'lucide-react';

const REPO_URL = 'https://github.com/xavierbasc/artillery-tank-app';
const BUILD_LINES = [
  'git clone ' + REPO_URL + '.git',
  'cd artillery-tank-app',
  'cmake -B build -DCMAKE_BUILD_TYPE=Release',
  'cmake --build build -j8',
];

const notes = [
  'SDL3 is fetched and built automatically via CMake FetchContent if it isn’t already on your system — no separate SDK install.',
  'CMake 3.20+ and a C++20 compiler are the only hard requirements. No IDE, no account, no license key.',
  'Windows, macOS and Linux build from the same CMakeLists.txt; iOS and Android have their own toolchain branches in the same tree.',
];

export default function Download() {
  const [copied, setCopied] = useState(false);
  const cmd = BUILD_LINES.join('\n');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — silently ignore */
    }
  };

  return (
    <section id="download" className="relative py-24 md:py-28 px-6 bg-bg overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #d69a1f, transparent 70%)' }}
        />
      </div>
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      <div className="relative max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="inline-block font-mono text-xs text-amber-2 border border-amber/40 px-4 py-1.5 mb-4 tracking-widest">
            SOURCE, NOT STORE
          </div>
          <h2 className="font-display text-2xl md:text-4xl text-cream tracking-tight uppercase mb-4">
            Build It Yourself
          </h2>
          <p className="font-mono text-sm text-muted max-w-lg mx-auto leading-relaxed">
            There is no store page and no prebuilt installer — this is a source
            repository you compile locally, the same way the game itself
            never phones home once it&apos;s running.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-panel border border-line clip-angled overflow-hidden text-left mb-10"
        >
          <div className="flex items-center justify-between gap-3 px-5 py-3 bg-panel-2 border-b border-line">
            <div className="flex items-center gap-2 min-w-0">
              <Terminal size={14} className="text-amber-2 flex-shrink-0" />
              <span className="font-mono text-xs text-muted tracking-widest truncate">BUILD.SH</span>
            </div>
            <button
              onClick={copy}
              className="flex-shrink-0 flex items-center gap-2 font-mono text-xs text-cream border border-line-2 px-3 py-1.5 hover:border-amber/60 hover:text-amber-2 transition-colors"
              aria-label="Copy build commands"
            >
              {copied ? <Check size={13} className="text-teal-2" /> : <Copy size={13} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="p-5 md:p-6 font-mono text-xs md:text-sm text-ink leading-relaxed overflow-x-auto">
{BUILD_LINES.map((l, i) => (
  <div key={i}>
    <span className="text-amber-2">$ </span>
    <span>{l}</span>
  </div>
))}
          </pre>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-left space-y-2 mb-12 max-w-xl mx-auto"
        >
          {notes.map((n) => (
            <li key={n} className="font-mono text-xs text-muted leading-relaxed flex gap-2">
              <span className="text-amber-2 flex-shrink-0">›</span>
              {n}
            </li>
          ))}
        </motion.ul>

        <motion.a
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-mono text-sm font-bold text-bg bg-amber-2 border-2 border-amber-2 px-7 py-3 clip-angled hover:bg-cream hover:border-cream transition-colors duration-200 no-underline"
        >
          <Github size={16} />
          VIEW SOURCE ON GITHUB
        </motion.a>
      </div>
    </section>
  );
}
