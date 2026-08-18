// Reads web/public/downloads/ at build time (this module only ever runs on
// the server / during `next build` static generation — output: 'export'
// prerenders the page once, so fs access here is safe and never ships to
// the client). Binaries are dropped in after the fact by whoever cuts the
// release; we never invent a file size for something we can't stat.
import fs from 'fs';
import path from 'path';

export interface DownloadEntry {
  id: string;
  platform: string;
  filename: string;
  requirement: string;
  /** Root-relative path — pass through lib/asset.ts `asset()` before rendering. */
  path: string;
  /** Human-readable size, or null if the file isn't present at build time. */
  sizeLabel: string | null;
  available: boolean;
}

const CATALOG: Array<Pick<DownloadEntry, 'id' | 'platform' | 'filename' | 'requirement'>> = [
  { id: 'macos',   platform: 'macOS',   filename: 'TerraShellFracture-macOS.dmg',          requirement: 'macOS · Apple Silicon & Intel · disk image' },
  { id: 'windows', platform: 'Windows', filename: 'TerraShellFracture-Windows-Setup.exe',  requirement: 'Windows 10/11 · 64-bit · installer' },
  { id: 'linux',   platform: 'Linux',   filename: 'TerraShellFracture-Linux-amd64.deb',    requirement: 'Debian/Ubuntu · x86-64 · .deb package' },
  { id: 'linuxtar',platform: 'Linux (portable)', filename: 'TerraShellFracture-Linux.tar.gz', requirement: 'Any distro · x86-64 · unpack and run' },
  { id: 'android', platform: 'Android', filename: 'TerraShellFracture-Android.apk',        requirement: 'Android 7.0+ · arm64' },
];

function formatSize(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
  return `${mb < 10 ? mb.toFixed(1) : Math.round(mb)} MB`;
}

export function getDownloads(): DownloadEntry[] {
  const dir = path.join(process.cwd(), 'public', 'downloads');
  return CATALOG.map((entry) => {
    let sizeLabel: string | null = null;
    let available = false;
    try {
      const stat = fs.statSync(path.join(dir, entry.filename));
      if (stat.isFile() && stat.size > 0) {
        available = true;
        sizeLabel = formatSize(stat.size);
      }
    } catch {
      available = false;
    }
    return { ...entry, path: `/downloads/${entry.filename}`, sizeLabel, available };
  });
}
