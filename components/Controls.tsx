'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, Smartphone, Mouse } from 'lucide-react';

const keyboardControls = [
  { key: '← →',    action: 'Adjust barrel angle' },
  { key: '↑ ↓',    action: 'Adjust shot power' },
  { key: 'Space',  action: 'Fire' },
  { key: 'Tab',    action: 'Cycle weapon' },
  { key: 'D',      action: 'Cycle the engaged defence system' },
  { key: 'S',      action: 'Share the game (main menu)' },
  { key: 'Enter',  action: 'Confirm / buy in shop' },
  { key: 'Esc',    action: 'Pause / close shop — the pause menu is where you save and exit' },
];

const mouseControls = [
  { key: 'Drag in play area', action: 'Aim the barrel at the cursor (atan2 from the turret)' },
  { key: 'Click',             action: 'Select menu items, shop rows, buttons' },
];

const touchControls = [
  { key: 'Drag left half',   action: 'Adjust barrel angle' },
  { key: 'Drag right half',  action: 'Adjust shot power' },
  { key: 'Pull back from your tank', action: 'Slingshot gesture — angle and power in one drag' },
  { key: 'FIRE button',      action: 'Fire — bottom-right corner, full bar height' },
  { key: '◀ icon ▶',         action: 'Change weapon without opening the picker' },
  { key: 'Defence chip',     action: 'Switch the engaged protection' },
  { key: 'Tap weapon row',   action: 'Buy in shop' },
  { key: 'QUIT button',      action: 'Leave the match — bottom-left corner' },
];

const flow = ['01 · Aim', '02 · Power', '03 · Fire', '04 · Boom', '05 · Shop'];

const modes = {
  keyboard: { icon: Keyboard, label: 'Keyboard', rows: keyboardControls },
  mouse:    { icon: Mouse,    label: 'Mouse',    rows: mouseControls },
  touch:    { icon: Smartphone, label: 'Touch',  rows: touchControls },
} as const;

export default function Controls() {
  const [mode, setMode] = useState<keyof typeof modes>('keyboard');
  const active = modes[mode];

  return (
    <section id="controls" className="relative py-24 md:py-28 px-6 bg-bg">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-block font-mono text-xs text-amber-2 border border-amber/40 px-4 py-1.5 mb-4 tracking-widest">
            BRIEFING
          </div>
          <h2 className="font-display text-2xl md:text-4xl text-cream tracking-tight uppercase">
            Rules of Engagement
          </h2>
          <p className="font-mono text-sm text-muted mt-4">
            Three complete, independent input schemes — keyboard, mouse-drag aiming, and full touch.
          </p>
        </motion.div>

        {/* Turn flow */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-0 mb-12 flex-wrap"
        >
          {flow.map((step, i) => (
            <div key={step} className="flex items-center">
              <div className={`font-mono text-xs px-4 py-3 border ${
                i === 0
                  ? 'border-amber text-amber-2 bg-amber/8'
                  : 'border-line text-muted hover:border-line-2 hover:text-ink'
              } transition-colors cursor-default clip-angled-sm`}>
                {step}
              </div>
              {i < flow.length - 1 && (
                <div className="w-6 h-px bg-gradient-to-r from-line via-amber/40 to-line flex-shrink-0" />
              )}
            </div>
          ))}
        </motion.div>

        {/* Toggle */}
        <div className="flex justify-center mb-10">
          <div className="relative flex bg-panel border border-line p-1 clip-angled">
            <motion.div
              layoutId="control-tab"
              className="absolute top-1 bottom-1 bg-amber/20 border border-amber/40"
              style={{
                left:  mode === 'keyboard' ? '4px' : mode === 'mouse' ? '33.5%' : undefined,
                right: mode === 'touch' ? '4px' : undefined,
                width: mode !== 'touch' && mode !== 'keyboard' ? '33%' : undefined,
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            />
            {(Object.keys(modes) as (keyof typeof modes)[]).map(m => {
              const Icon = modes[m].icon;
              return (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`relative z-10 flex items-center gap-2 px-5 py-2.5 font-mono text-xs transition-colors duration-200 ${
                    mode === m ? 'text-amber-2' : 'text-muted hover:text-ink'
                  }`}
                >
                  <Icon size={14} />
                  {modes[m].label}
                </button>
              );
            })}
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
            className="bg-panel border border-line clip-angled overflow-hidden"
          >
            <div className="px-4 py-2 border-b border-line bg-panel-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber" />
              <span className="font-mono text-xs text-muted uppercase tracking-widest">
                {active.label} controls
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px]">
                <tbody>
                  {active.rows.map((c, i) => (
                    <motion.tr
                      key={c.key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="border-b border-line last:border-0 group hover:bg-amber/4 transition-colors"
                    >
                      <td className="px-5 py-3.5 w-48">
                        <kbd className="font-mono text-xs text-amber-2 bg-panel-2 border border-line-2 px-2.5 py-1 whitespace-nowrap">
                          {c.key}
                        </kbd>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-sm text-ink group-hover:text-cream transition-colors">
                          {c.action}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
