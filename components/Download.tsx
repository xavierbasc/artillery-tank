import { Apple, AppWindow, Terminal, Smartphone, Download as DownloadIcon, TriangleAlert, MousePointerClick, Lock } from 'lucide-react';
import { asset } from '@/lib/asset';
import { getDownloads, type DownloadEntry } from '@/lib/downloads';

// Server component — file sizes below are stat()'d from web/public/downloads/
// at build time (see lib/downloads.ts). No invented numbers: a platform with
// no binary in that folder yet just shows no size, not a guess.

const ICONS: Record<string, typeof Apple> = {
  macos: Apple,
  windows: AppWindow,
  linux: Terminal,
  linuxtar: Terminal,
  android: Smartphone,
};

const GATEKEEPER_NOTE =
  'Open the disk image and drag the app into Applications. The build is signed ad-hoc, not notarised by Apple, so the first launch needs a right-click (or Control-click) on the app, then "Open" and confirm — once only.';

const SMARTSCREEN_NOTE =
  'The installer isn’t signed with a code-signing certificate, so Windows SmartScreen will flag it as unrecognised. Click "More info", then "Run anyway". It installs to Program Files with Start-menu and desktop shortcuts, and uninstalls from Settings › Apps.';

const DEB_NOTE =
  'Install with "sudo apt install ./TerraShellFracture-Linux-amd64.deb". It drops the game in /opt, puts a terrashell-fracture launcher on PATH and adds a desktop entry. Built against Debian 12, so it also runs on newer Ubuntu and derivatives.';

const TARBALL_NOTE =
  'For distros that don’t use .deb: unpack anywhere and run ./TerraShellFracture from inside the folder — it reads its music from the assets/ directory next to the binary.';

function Card({ entry }: { entry: DownloadEntry }) {
  const Icon = ICONS[entry.id] ?? DownloadIcon;
  const warning =
    entry.id === 'macos'    ? GATEKEEPER_NOTE  :
    entry.id === 'windows'  ? SMARTSCREEN_NOTE :
    entry.id === 'linux'    ? DEB_NOTE         :
    entry.id === 'linuxtar' ? TARBALL_NOTE     : null;

  return (
    <div className="relative flex flex-col bg-panel border border-line clip-angled-sm overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-line bg-panel-2">
        <Icon size={20} className="text-amber-2 flex-shrink-0" />
        <div className="min-w-0">
          <div className="font-display text-base text-cream uppercase tracking-wide">{entry.platform}</div>
          <div className="font-mono text-[11px] text-muted truncate">{entry.requirement}</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between p-5 gap-4">
        {warning && (
          <div className="flex gap-2 font-mono text-[11px] text-muted-2 leading-relaxed bg-bg/50 border border-line px-3 py-2.5">
            <TriangleAlert size={26} className="text-amber-2 flex-shrink-0 mt-0.5" />
            <span className="text-ink/90">{warning}</span>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 mt-auto">
          <span className="font-mono text-xs text-muted-2 tracking-wide">
            {entry.sizeLabel ?? '—'}
          </span>
          {/* A build that isn't in public/downloads/ yet must not ship a live
              link — that would be a 404 on the one button people came for. */}
          {entry.available ? (
            <a
              href={asset(entry.path)}
              download
              aria-label={`Download TerraShell Fracture for ${entry.platform}`}
              className="cut-sm [--cut-edge:var(--amber-2)] [--cut-fill:var(--amber-2)] hover:[--cut-edge:var(--cream)] hover:[--cut-fill:var(--cream)] inline-flex items-center gap-2 font-mono text-xs font-bold text-bg px-4 py-2 transition-colors duration-200 no-underline"
            >
              <DownloadIcon size={14} />
              {'.' + entry.filename.split('.').slice(1).join('.').toUpperCase()}
            </a>
          ) : (
            <span
              aria-disabled="true"
              title={`No ${entry.platform} build published yet`}
              className="cut-sm [--cut-edge:var(--line-2)] [--cut-fill:var(--panel)] inline-flex items-center gap-2 font-mono text-xs font-bold text-muted-2 px-4 py-2 cursor-not-allowed select-none"
            >
              <DownloadIcon size={14} />
              SOON
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Download() {
  const downloads = getDownloads();

  return (
    <section id="download" className="relative py-24 md:py-28 px-6 bg-bg overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #d69a1f, transparent 70%)' }}
        />
      </div>
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center">
        <div className="mb-12">
          <div className="inline-block font-mono text-xs text-amber-2 border border-amber/40 px-4 py-1.5 mb-4 tracking-widest">
            OFFICIAL BUILDS
          </div>
          <h2 className="font-display text-2xl md:text-4xl text-cream tracking-tight uppercase mb-4">
            Download TerraShell Fracture
          </h2>
          <p className="font-mono text-sm text-muted max-w-xl mx-auto leading-relaxed">
            Prebuilt, ready-to-run binaries — pick your platform below.
            Everything runs fully offline once it&apos;s on your machine, exactly
            like the rest of the game.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 text-left">
          {downloads.map((entry) => (
            <Card key={entry.id} entry={entry} />
          ))}
        </div>

        <div className="flex items-start gap-2.5 max-w-xl mx-auto text-left font-mono text-xs text-muted leading-relaxed">
          <Lock size={14} className="text-muted-2 flex-shrink-0 mt-0.5" />
          <span>
            The source lives in a private repository, so there&apos;s no public
            code to browse or clone right now — what&apos;s here are the
            compiled binaries themselves, free to download and keep.
          </span>
        </div>

        <div className="flex items-center justify-center gap-2 mt-6 font-mono text-[11px] text-muted-2">
          <MousePointerClick size={12} />
          <span>Having trouble opening a downloaded build? See the platform notes above.</span>
        </div>
      </div>
    </section>
  );
}
