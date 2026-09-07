import { Apple, AppWindow, Terminal, Smartphone, Store, Package, Download as DownloadIcon, TriangleAlert, MousePointerClick, Lock } from 'lucide-react';
import { asset } from '@/lib/asset';
import { getDownloads, type DownloadEntry } from '@/lib/downloads';

// Server component — file sizes below are stat()'d from web/public/downloads/
// at build time (see lib/downloads.ts). No invented numbers: a platform with
// no binary in that folder yet just shows no size, not a guess.

const ICONS: Record<string, typeof Apple> = {
  macos: Apple,
  ios: Smartphone,
  windows: AppWindow,
  windowsmsix: Package,
  linux: Terminal,
  linuxtar: Terminal,
  android: Smartphone,
};

const SMARTSCREEN_NOTE =
  'The installer isn’t signed with a code-signing certificate, so Windows SmartScreen will flag it as unrecognised. Click "More info", then "Run anyway". It installs to Program Files with Start-menu and desktop shortcuts, and uninstalls from Settings › Apps.';

const DEB_NOTE =
  'Install with "sudo apt install ./TerraShellFracture-Linux-amd64.deb". It drops the game in /opt, puts a terrashell-fracture launcher on PATH and adds a desktop entry. Built against Debian 12, so it also runs on newer Ubuntu and derivatives.';

const IOS_NOTE =
  'Out now on the App Store for iPhone and iPad. A downloadable build isn’t something Apple allows a website to hand out — iOS installs through the App Store or TestFlight and nowhere else. One purchase covers the Mac version too.';

const MACOS_NOTE =
  'Out now on the Mac App Store, universal for Apple Silicon and Intel. It shares a listing with the iPhone build, so a single purchase covers both.';

const MSIX_NOTE =
  'The same build in MSIX, the format the Microsoft Store uses. It ships unsigned, and Windows will not install an unsigned MSIX — you would have to sign it yourself with your own certificate. For a normal install use the installer above, or wait for the Microsoft Store listing, which Microsoft signs for you.';

const ANDROID_NOTE =
  'Signed APK, straight from this page — Android allows it where iOS does not. You will need to let your browser or file manager install from an unknown source the first time. The Google Play listing is on its way.';

const TARBALL_NOTE =
  'For distros that don’t use .deb: unpack anywhere and run ./TerraShellFracture from inside the folder — it reads its music from the assets/ directory next to the binary.';

function Card({ entry }: { entry: DownloadEntry }) {
  const Icon = ICONS[entry.id] ?? DownloadIcon;
  const warning =
    entry.id === 'macos'    ? MACOS_NOTE       :
    entry.id === 'windows'  ? SMARTSCREEN_NOTE :
    entry.id === 'windowsmsix' ? MSIX_NOTE      :
    entry.id === 'linux'    ? DEB_NOTE         :
    entry.id === 'linuxtar' ? TARBALL_NOTE     :
    entry.id === 'android'  ? ANDROID_NOTE     :
    entry.id === 'ios'      ? IOS_NOTE         : null;

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

        {entry.store && (
          <div className="flex items-center gap-2 font-mono text-[11px] tracking-widest text-amber-2 uppercase">
            <Store size={13} className="flex-shrink-0" />
            {/* Una ficha publicada se enlaza; una que aún no existe se anuncia.
                Prometer "próximamente" sobre algo que ya está a la venta manda
                a la gente a buscarlo a mano. */}
            <span>{entry.storeUrl ? `On the ${entry.store}` : `Coming soon · ${entry.store}`}</span>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 mt-auto">
          <span className="font-mono text-xs text-muted-2 tracking-wide">
            {entry.available ? entry.sizeLabel
              : entry.storeUrl ? 'On sale'
              : entry.store ? 'Store release' : '—'}
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
          ) : entry.storeUrl ? (
            <a
              href={entry.storeUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Get TerraShell Fracture on the ${entry.store}`}
              className="cut-sm [--cut-edge:var(--amber-2)] [--cut-fill:var(--amber-2)] hover:[--cut-edge:var(--cream)] hover:[--cut-fill:var(--cream)] inline-flex items-center gap-2 font-mono text-xs font-bold text-bg px-4 py-2 transition-colors duration-200 no-underline"
            >
              <Store size={14} />
              GET IT
            </a>
          ) : (
            <span
              aria-disabled="true"
              title={entry.store
                ? `${entry.platform} ships through the ${entry.store}`
                : `No ${entry.platform} build published yet`}
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
            Windows, Linux and Android install straight from here, with the
            Windows build also packaged as MSIX. iPhone, iPad and Mac come from
            the App Store, on one listing — a single purchase covers all three.
            Windows is headed for the Microsoft Store too. Everything runs
            fully offline once it&apos;s on your machine, exactly like the rest
            of the game.
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
