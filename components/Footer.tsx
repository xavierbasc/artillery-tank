import { Github, Mail } from 'lucide-react';

export default function Footer() {
  const year = 2026;
  return (
    <footer className="bg-[#050508] border-t border-[#1e1e2e] px-6 py-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="font-pixel text-sm mb-1">
            <span className="text-white">TERRA</span>
            <span className="text-[#ff5f00]">SHELL</span>
          </div>
          <div className="font-mono text-xs text-[#ff5f00] tracking-[0.3em]">FRACTURE</div>
          <div className="font-sans text-xs text-[#303050] mt-2">
            &copy; {year} Javier Bascones Velázquez
          </div>
        </div>

        <nav className="flex items-center gap-6">
          {[
            ['Contact',        'mailto:javier.bascones@gmail.com'],
            ['Privacy',        '#'],
            ['Press Kit',      '#'],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="font-mono text-xs text-[#303050] hover:text-[#ff8c00] transition-colors"
            >
              {label}
            </a>
          ))}
          <a
            href="https://github.com/xavierbasc/terrashell-fracture"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#303050] hover:text-[#ff8c00] transition-colors"
            aria-label="Source code"
          >
            <Github size={16} />
          </a>
          <a
            href="mailto:javier.bascones@gmail.com"
            className="text-[#303050] hover:text-[#ff8c00] transition-colors"
            aria-label="Email"
          >
            <Mail size={16} />
          </a>
        </nav>
      </div>
    </footer>
  );
}
