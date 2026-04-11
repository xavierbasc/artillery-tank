import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'fire':     '#ff5f00',
        'fire-2':   '#ff8c00',
        'gold':     '#ffd040',
        'danger':   '#ff2a20',
        'teal':     '#00d4aa',
        'electric': '#1a90ff',
        'surface':  '#0d0d0d',
        'panel':    '#111116',
        'border':   '#1e1e2e',
        'border-2': '#2a2a3e',
      },
      fontFamily: {
        pixel:  ['"Press Start 2P"', 'monospace'],
        sans:   ['Inter', 'system-ui', 'sans-serif'],
        mono:   ['"Space Mono"', 'monospace'],
      },
      animation: {
        'pulse-fire': 'pulse-fire 2.5s ease-in-out infinite',
        'glitch':     'glitch 6s infinite',
        'bob':        'bob 2s ease-in-out infinite',
        'ember':      'ember 3s ease-in infinite',
        'scanline':   'scanline 8s linear infinite',
        'blink':      'blink 1s step-end infinite',
      },
      keyframes: {
        'pulse-fire': {
          '0%,100%': { boxShadow: '0 0 20px rgba(255,95,0,0.4)' },
          '50%':     { boxShadow: '0 0 45px rgba(255,95,0,0.8), 0 0 80px rgba(255,95,0,0.2)' },
        },
        'glitch': {
          '0%,93%,100%': { clipPath: 'none', transform: 'none' },
          '94%': { clipPath: 'inset(20% 0 60% 0)', transform: 'translateX(-3px)', filter: 'hue-rotate(90deg)' },
          '95%': { clipPath: 'inset(60% 0 10% 0)', transform: 'translateX(3px)' },
          '96%': { clipPath: 'none', transform: 'none', filter: 'none' },
        },
        'bob': {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(6px)' },
        },
        'scanline': {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'blink': {
          '0%,100%': { opacity: '1' },
          '50%':     { opacity: '0' },
        },
      },
      backgroundImage: {
        'grid-subtle': `
          linear-gradient(rgba(255,95,0,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,95,0,0.04) 1px, transparent 1px)
        `,
      },
      backgroundSize: {
        'grid-subtle': '40px 40px',
      },
    },
  },
  plugins: [],
};

export default config;
