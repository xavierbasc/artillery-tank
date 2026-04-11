import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import NavBar    from '@/components/NavBar';
import Mechanics from '@/components/Mechanics';
import Arsenal   from '@/components/Arsenal';
import Controls  from '@/components/Controls';
import Specs     from '@/components/Specs';
import Download  from '@/components/Download';
import Footer    from '@/components/Footer';

// Canvas components — client-only (no SSR)
const BattlefieldCanvas = dynamic(() => import('@/components/BattlefieldCanvas'), { ssr: false });
const DemoCanvas        = dynamic(() => import('@/components/DemoCanvas'),        { ssr: false });

export default function Home() {
  return (
    <main>
      <NavBar />

      {/* ═══════════════════════════════════ HERO ═══════════════════════════ */}
      <section
        id="top"
        className="relative min-h-screen flex flex-col overflow-hidden bg-[#050508]"
      >
        <BattlefieldCanvas />
        <div className="scanlines" />

        {/* Vignette */}
        <div className="absolute inset-0 z-[2] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(0,0,0,0.75) 100%)' }} />

        {/* Grid overlay */}
        <div className="absolute inset-0 z-[1] bg-grid-subtle bg-[length:40px_40px] opacity-30 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 text-center px-6 pt-28 pb-16 gap-8">

          {/* Eyebrow */}
          <div
            className="font-mono text-xs text-[#ff5f00] tracking-[0.3em] uppercase"
            style={{ textShadow: '0 0 16px #ff5f00, 0 0 32px rgba(255,95,0,0.3)' }}
          >
            Turn-Based Artillery Warfare
          </div>

          {/* Title */}
          <h1 className="font-pixel leading-tight">
            <div className="text-white" style={{ fontSize: 'clamp(2rem, 7vw, 4.5rem)' }}>
              TERRA<span style={{ color: '#ff5f00', textShadow: '0 0 24px #ff5f00, 0 0 48px rgba(255,95,0,0.4)', animation: 'glitch 6s infinite' }}>SHELL</span>
            </div>
            <div
              className="block text-[#ffd040]"
              style={{
                fontSize: 'clamp(1.4rem, 5vw, 3rem)',
                letterSpacing: '0.16em',
                textShadow: '0 0 30px rgba(255,208,64,0.6), 0 0 60px rgba(255,208,64,0.2)',
              }}
            >
              FRACTURE
            </div>
          </h1>

          {/* Subtitle */}
          <p className="font-sans text-sm text-[#606080] max-w-md leading-relaxed">
            Destroy terrain. Outgun your enemy.<br />
            Every shot reshapes the battlefield forever.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="#download"
              className="font-mono text-sm text-white bg-[#ff5f00] border-2 border-[#ff5f00] px-8 py-3 clip-angled hover:bg-[#ff8c00] hover:border-[#ff8c00] transition-all duration-200 no-underline"
              style={{ boxShadow: '0 0 24px rgba(255,95,0,0.45)', animation: 'pulse-fire 2.5s ease-in-out infinite' }}
            >
              ⚡ GET THE GAME
            </a>
            <a
              href="#arena"
              className="font-mono text-sm text-[#c0c0e0] bg-transparent border-2 border-[#2a2a3e] px-8 py-3 clip-angled hover:border-[#ffd040] hover:text-[#ffd040] transition-all duration-200 no-underline"
            >
              WATCH DEMO
            </a>
          </div>

          {/* Stats strip */}
          <div className="flex items-center flex-wrap justify-center gap-0">
            {[
              ['4',     'Weapons'],
              ['2048',  'Particles'],
              ['60Hz',  'Physics'],
              ['5',     'Platforms'],
            ].map(([n, l], i, arr) => (
              <div key={l} className="flex items-center">
                <div className="flex flex-col items-center px-6 py-3 bg-[#0a0a12]/80 border border-[#1e1e2e]">
                  <span className="font-pixel text-base text-[#ffd040]" style={{ textShadow: '0 0 10px rgba(255,208,64,0.4)' }}>{n}</span>
                  <span className="font-mono text-xs text-[#404060] mt-1 tracking-widest">{l}</span>
                </div>
                {i < arr.length - 1 && <div className="w-px h-10 bg-[#1e1e2e]" />}
              </div>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div className="relative z-10 text-center pb-8">
          <span className="font-mono text-xs text-[#ff5f00] animate-bob inline-block">▼</span>
        </div>
      </section>

      {/* ═══════════════════════════════════ DEMO ═══════════════════════════ */}
      <section id="arena" className="bg-black border-t border-b border-[#1e1e2e] flex flex-col items-center py-14 px-4">
        <div className="w-full max-w-4xl">
          {/* Bar */}
          <div className="flex items-center gap-4 px-4 py-2.5 bg-[#0d0d18] border border-[#1e1e2e] border-b-0 flex-wrap">
            <span className="font-mono text-xs text-white bg-[#ff5f00] px-3 py-0.5 tracking-widest animate-pulse-fire">
              LIVE SIMULATION
            </span>
            <span className="font-mono text-xs text-[#404060]">
              Destructible terrain · Cluster sub-shells · Wind physics · Screen shake
            </span>
          </div>
          {/* Canvas wrapper */}
          <div
            className="border border-[#1e1e2e] overflow-hidden"
            style={{
              boxShadow: '0 0 60px rgba(255,95,0,0.12), 0 0 120px rgba(255,95,0,0.05), inset 0 0 40px rgba(0,0,0,0.8)',
            }}
          >
            <div className="relative">
              <DemoCanvas />
              {/* Scanlines overlay on demo */}
              <div className="absolute inset-0 pointer-events-none scanlines opacity-40" />
            </div>
          </div>
        </div>
      </section>

      <Mechanics />
      <Arsenal />
      <Controls />
      <Specs />
      <Download />
      <Footer />
    </main>
  );
}
