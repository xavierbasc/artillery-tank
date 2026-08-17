import { Github } from 'lucide-react';

const CODE_REPO = 'https://github.com/xavierbasc/artillery-tank-app';

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
            Turn-based artillery, built with SDL3 and C++20. No servers, no accounts, no telemetry.
          </div>
        </div>

        <nav className="flex items-center gap-6">
          {[
            ['Gallery',  '#arena'],
            ['Arsenal',  '#arsenal'],
            ['Offline',  '#offline'],
            ['Build',    '#download'],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="font-mono text-xs text-muted hover:text-amber-2 transition-colors"
            >
              {label}
            </a>
          ))}
          <a
            href={CODE_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-amber-2 transition-colors"
            aria-label="Source code on GitHub"
          >
            <Github size={16} />
          </a>
        </nav>
      </div>
    </footer>
  );
}
