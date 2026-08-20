import NavBar      from '@/components/NavBar';
import Hero        from '@/components/Hero';
import Ticker      from '@/components/Ticker';
import Screenshots from '@/components/Screenshots';
import Mechanics   from '@/components/Mechanics';
import Scenarios   from '@/components/Scenarios';
import Battlefields from '@/components/Battlefields';
import Arsenal     from '@/components/Arsenal';
import Terrains    from '@/components/Terrains';
import Offline     from '@/components/Offline';
import ShareCodes  from '@/components/ShareCodes';
import Controls    from '@/components/Controls';
import Specs       from '@/components/Specs';
import Download    from '@/components/Download';
import ShareGame   from '@/components/ShareGame';
import Footer      from '@/components/Footer';
import { SITE_URL, SITE_NAME } from '@/lib/site';

// VideoGame structured data. Every field traces to something documented in
// the game's own source (src/Core/Constants.h, .claude/rules/STATE.md) or to
// how the game is actually distributed. The `offers` block asserts price 0
// because that is literally true of this page: the builds are handed out
// here at no cost and there is no payment path anywhere in the product.
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'VideoGame',
  name: SITE_NAME,
  description:
    'A turn-based artillery game with destructible pixel-art terrain, inspired by Scorched Earth. Local multiplayer, procedural levels, 100% offline.',
  genre: ['Artillery', 'Turn-Based Strategy', 'Tactics'],
  gamePlatform: ['macOS', 'Windows', 'Linux', 'Android'],
  applicationCategory: 'Game',
  operatingSystem: 'macOS, Windows 10/11, Linux, Android 7.0+',
  url: SITE_URL,
  image: `${SITE_URL}og-image.png`,
  screenshot: [
    `${SITE_URL}shots/menu.png`,
    `${SITE_URL}shots/gameplay.png`,
    `${SITE_URL}shots/shop.png`,
    `${SITE_URL}shots/playersetup.png`,
    `${SITE_URL}shots/howtoplay.png`,
  ],
  // Matches the name already shipped in the macOS bundle copyright and the
  // git history. The project deliberately anonymised the fuller legal name
  // out of its credits screen, so it doesn't belong in indexable metadata.
  author: {
    '@type': 'Person',
    name: 'Javier Bascones',
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
    url: `${SITE_URL}#download`,
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NavBar />
      <main>
        <Hero />
        <Ticker />
        <Screenshots />
        <Mechanics />
        <Scenarios />
        <Battlefields />
        <Arsenal />
        <Terrains />
        <Offline />
        <ShareCodes />
        <Controls />
        <Specs />
        <Download />
        <ShareGame />
      </main>
      <Footer />
    </>
  );
}
