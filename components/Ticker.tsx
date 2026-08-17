const FACTS = [
  '9 TERRAIN SHAPES',
  '× 8 BIOMES',
  '× 4 PALETTE VARIANTS',
  '= 32 DISTINCT LOOKS',
  '·',
  'UNLIMITED PROCEDURAL LEVELS',
  '·',
  'ZERO SERVERS',
  'ZERO ACCOUNTS',
  'ZERO TELEMETRY',
  '·',
  '2,048-PARTICLE POOL',
  '60 Hz FIXED TIMESTEP',
  '·',
  'AUDIO SYNTHESISED IN REAL TIME — NO .WAV FILES',
  '·',
  'UP TO 10 TANKS, LOCAL MULTIPLAYER',
  '·',
  'SHARE CODES OVER THE PHONE — NO INTERNET NEEDED',
  '·',
];

export default function Ticker() {
  const items = [...FACTS, ...FACTS]; // duplicated for seamless loop
  return (
    <div
      className="relative z-10 border-y border-line bg-panel/80 backdrop-blur-sm overflow-hidden py-2.5"
      role="presentation"
    >
      <div className="flex whitespace-nowrap ticker-track w-max">
        {items.map((f, i) => (
          <span key={i} className="font-mono text-[11px] tracking-[0.2em] text-amber/80 px-5 flex-shrink-0">
            {f}
          </span>
        ))}
      </div>
    </div>
  );
}
