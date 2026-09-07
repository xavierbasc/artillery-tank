import { asset } from '@/lib/asset';

export default function Footer() {
  return (
    <footer className="bg-bg border-t border-line px-6 py-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <div className="font-display text-sm mb-1 uppercase">
            <span className="text-cream">Terra</span>
            <span className="text-amber-2">Shell</span>
          </div>
          <div className="font-mono text-xs text-amber-2 tracking-[0.3em]">FRACTURE</div>
          <div className="font-mono text-xs text-muted mt-2">
            Turn-based artillery, built with C++. No servers, no accounts, no telemetry.
          </div>
        </div>

        <nav className="flex items-center flex-wrap justify-center gap-x-6 gap-y-2" aria-label="Footer">
          {[
            ['Gallery',   '#arena'],
            ['Arsenal',   '#arsenal'],
            ['Offline',   '#offline'],
            ['Download',  '#download'],
            ['Tell a friend', '#tell-a-friend'],
            // Ruta propia, no ancla: las tiendas exigen una URL cuyo contenido
            // principal sea la política de privacidad.
            ['Privacy',   asset('/privacy/')],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="font-mono text-xs text-muted hover:text-amber-2 transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
