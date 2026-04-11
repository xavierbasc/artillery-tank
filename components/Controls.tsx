'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, Smartphone } from 'lucide-react';

const keyboardControls = [
  { key: '← →',    action: 'Adjust barrel angle' },
  { key: '↑ ↓',    action: 'Adjust shot power' },
  { key: 'Space',  action: 'Fire!' },
  { key: 'Tab',    action: 'Cycle weapon' },
  { key: 'Enter',  action: 'Confirm / buy in shop' },
  { key: 'Esc',    action: 'Pause / close shop' },
];

const touchControls = [
  { key: 'Drag left',     action: 'Adjust barrel angle' },
  { key: 'Drag right',    action: 'Adjust shot power' },
  { key: 'FIRE button',   action: 'Fire!' },
  { key: 'Tap weapon',    action: 'Buy in shop' },
  { key: 'Tap DONE',      action: 'Close shop' },
  { key: 'Long press',    action: 'Pause menu' },
];

const flow = ['01 · Aim', '02 · Power', '03 · Fire', '04 · Boom', '05 · Shop'];

export default function Controls() {
  const [mode, setMode] = useState<'keyboard' | 'touch'>('keyboard');
  const controls = mode === 'keyboard' ? keyboardControls : touchControls;

  return (
    <section id="controls" className="relative py-28 px-6 bg-[#080808]">
      <div className="absolute inset-0 bg-grid-subtle bg-[length:40px_40px] opacity-30 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block font-mono text-xs text-[#ff5f00] border border-[#ff5f00]/40 px-4 py-1.5 mb-4 tracking-widest">
            BRIEFING
          </div>
          <h2 className="font-pixel text-2xl md:text-3xl text-white tracking-tight">
            Rules of Engagement
          </h2>
        </motion.div>

        {/* Turn flow */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-0 mb-14 flex-wrap"
        >
          {flow.map((step, i) => (
            <div key={step} className="flex items-center">
              <div className={`font-mono text-xs px-4 py-3 border ${
                i === 0
                  ? 'border-[#ff5f00] text-[#ff5f00] bg-[#ff5f00]/8'
                  : 'border-[#1e1e2e] text-[#404060] hover:border-[#2e2e4e] hover:text-[#606080]'
              } transition-colors cursor-default clip-angled-sm`}>
                {step}
              </div>
              {i < flow.length - 1 && (
                <div className="w-6 h-px bg-gradient-to-r from-[#1e1e2e] via-[#ff5f00]/40 to-[#1e1e2e] flex-shrink-0" />
              )}
            </div>
          ))}
        </motion.div>

        {/* Toggle */}
        <div className="flex justify-center mb-10">
          <div className="relative flex bg-[#0a0a10] border border-[#1e1e2e] p-1 clip-angled">
            <motion.div
              layoutId="control-tab"
              className="absolute top-1 bottom-1 bg-[#ff5f00]/20 border border-[#ff5f00]/40"
              style={{
                left:  mode === 'keyboard' ? '4px' : '50%',
                right: mode === 'keyboard' ? '50%' : '4px',
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            />
            {(['keyboard', 'touch'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`relative z-10 flex items-center gap-2 px-6 py-2.5 font-mono text-xs transition-colors duration-200 ${
                  mode === m ? 'text-[#ff8c00]' : 'text-[#404060] hover:text-[#606080]'
                }`}
              >
                {m === 'keyboard' ? <Keyboard size={14} /> : <Smartphone size={14} />}
                {m === 'keyboard' ? 'Keyboard' : 'Touch'}
              </button>
            ))}
          </div>
        </div>

        {/* Controls table */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="bg-[#0a0a10] border border-[#1e1e2e] clip-angled overflow-hidden"
          >
            <div className="px-4 py-2 border-b border-[#1e1e2e] bg-[#0d0d16] flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#ff5f00]" />
              <span className="font-mono text-xs text-[#404060] uppercase tracking-widest">
                {mode === 'keyboard' ? 'Keyboard Controls' : 'Touch Controls'}
              </span>
            </div>
            <table className="w-full">
              <tbody>
                {controls.map((c, i) => (
                  <motion.tr
                    key={c.key}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="border-b border-[#1e1e2e] last:border-0 group hover:bg-[#ff5f00]/4 transition-colors"
                  >
                    <td className="px-5 py-3.5 w-36">
                      <kbd className="font-mono text-xs text-[#ffd040] bg-[#1a1a2a] border border-[#2a2a3e] px-2.5 py-1 whitespace-nowrap">
                        {c.key}
                      </kbd>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-sans text-sm text-[#606078] group-hover:text-[#909090] transition-colors">
                        {c.action}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
