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
        bg:        '#0a0b0d',
        'bg-2':    '#0d0f12',
        panel:     '#15181c',
        'panel-2': '#1b1f24',
        line:      '#262b31',
        'line-2':  '#33393f',

        amber:      '#d69a1f',
        'amber-2':  '#ffb92e',
        'amber-dim':'#8a6318',
        teal:       '#2ea89a',
        'teal-2':   '#5fd6c6',
        red:        '#c2321f',
        'red-2':    '#ff5b3d',
        green:      '#4a9a3f',

        cream: '#ece0c4',
        ink:   '#c7cad1',
        muted: '#6b7078',
        'muted-2': '#454a51',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        mono:    ['var(--font-mono)', 'monospace'],
        pixel:   ['var(--font-pixel)', 'monospace'],
      },
      backgroundImage: {
        grid: `
          linear-gradient(rgba(214,154,31,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(214,154,31,0.05) 1px, transparent 1px)
        `,
      },
      backgroundSize: {
        grid: '40px 40px',
      },
    },
  },
  plugins: [],
};

export default config;
