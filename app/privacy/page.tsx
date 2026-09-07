import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, WifiOff, HardDrive, Share2, Mail } from 'lucide-react';
import { SITE_URL, SITE_NAME } from '@/lib/site';

// Página propia y no un ancla de la portada: App Store Connect, Google Play y
// Microsoft Store piden una URL cuyo contenido principal sea la política. Un
// enlace a "#privacy" en medio de una landing es motivo de rechazo habitual.
export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    `${SITE_NAME} collects nothing. No accounts, no analytics, no advertising and no network requests — everything the game saves stays on your device.`,
  alternates: { canonical: `${SITE_URL}privacy/` },
  openGraph: {
    title: `Privacy Policy · ${SITE_NAME}`,
    description:
      'The game collects no data at all: no accounts, no analytics, no advertising, no network requests.',
    url: `${SITE_URL}privacy/`,
  },
};

const LAST_UPDATED = '20 August 2026';

function Card({ icon: Icon, title, children }: {
  icon: typeof WifiOff; title: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-panel border border-line clip-angled-sm p-6">
      <div className="flex items-center gap-3 mb-3">
        <Icon size={18} className="text-teal-2 flex-shrink-0" />
        <h2 className="font-display text-base text-cream uppercase tracking-wide">{title}</h2>
      </div>
      <div className="font-mono text-sm text-ink leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

export default function Privacy() {
  return (
    <main className="relative min-h-screen bg-bg px-6 py-20">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      <div className="relative max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs text-muted hover:text-amber-2 transition-colors mb-10"
        >
          <ArrowLeft size={14} /> Back to {SITE_NAME}
        </Link>

        <div className="inline-block font-mono text-xs text-teal-2 border border-teal/40 px-4 py-1.5 mb-5 tracking-widest">
          PRIVACY POLICY
        </div>
        <h1 className="font-display text-3xl md:text-5xl text-cream uppercase leading-[0.95] mb-5">
          Nothing to <span className="text-teal-2 glow-teal">collect</span>
        </h1>
        <p className="font-mono text-sm text-ink leading-relaxed mb-3">
          {SITE_NAME} does not collect, transmit, sell or share any personal
          data. There is no account to create, no analytics, no advertising and
          no tracking of any kind. The game contains no networking code: it
          never contacts a server, because there is no server.
        </p>
        <p className="font-mono text-xs text-muted-2 mb-12">
          Last updated: {LAST_UPDATED}. Applies to the iOS, macOS, Windows,
          Linux and Android versions of the game.
        </p>

        <div className="space-y-5">
          <Card icon={WifiOff} title="Data we collect">
            <p>
              <span className="text-cream">None.</span> The app asks for no
              personal information and has no way to send any: there are no
              sockets, no HTTP client and no third-party SDKs, analytics
              libraries or advertising networks compiled into it.
            </p>
            <p>
              It requests no permissions — no camera, microphone, location,
              contacts, photos or Bluetooth. The camera, microphone and
              Bluetooth usage strings you may see listed on the App Store are
              required by Apple because the cross-platform framework the game is
              built on links those system libraries; the game never calls them.
            </p>
          </Card>

          <Card icon={HardDrive} title="What stays on your device">
            <p>
              Your settings, your squad names, your local high-score table and
              any rival scores you have imported are written to the app&apos;s
              own storage folder on your device, and never leave it. Nobody
              else — including us — can read them.
            </p>
            <p>
              Deleting the app deletes that data. There is no cloud copy and no
              way to restore it.
            </p>
          </Card>

          <Card icon={Share2} title="When you choose to share">
            <p>
              Two features hand something to another app at your request, and
              only when you tap them. <span className="text-cream">SHARE</span>{' '}
              opens WhatsApp, Telegram or your browser with a link to this page;{' '}
              <span className="text-cream">COPY</span> puts a score code on your
              clipboard. What happens next is governed by whichever app you send
              it to, not by us.
            </p>
            <p>
              A score code contains only the run it describes — a name you typed,
              a level, a score — and nothing about you or your device.
            </p>
          </Card>

          <Card icon={Mail} title="Stores, crash reports and children">
            <p>
              If you install from the App Store or Google Play, those stores
              handle the download and the purchase (the game is free) under
              their own privacy policies. They may show us aggregated,
              anonymised statistics — downloads per country, for example — that
              cannot identify anyone.
            </p>
            <p>
              If you have turned on crash sharing in your operating system, your
              device may send anonymised crash reports through Apple or Google.
              We use them only to fix crashes, and they carry no personal data.
            </p>
            <p>
              The game is safe for children: it collects nothing, shows no ads,
              has no in-app purchases and offers no chat or user-generated
              content.
            </p>
          </Card>
        </div>

        <div className="mt-10 bg-panel-2 border border-line clip-angled-sm p-6">
          <h2 className="font-display text-base text-cream uppercase tracking-wide mb-3">
            Contact
          </h2>
          <p className="font-mono text-sm text-ink leading-relaxed">
            Questions about this policy:{' '}
            <a
              href="mailto:javier.bascones@gmail.com"
              className="text-amber-2 hover:underline"
            >
              javier.bascones@gmail.com
            </a>
          </p>
          <p className="font-mono text-xs text-muted-2 mt-3">
            If this policy ever changes, the new version replaces this page and
            the date above changes with it. Since the game collects no data,
            any change can only be a clarification.
          </p>
        </div>
      </div>
    </main>
  );
}
