import NavBar      from '@/components/NavBar';
import Hero        from '@/components/Hero';
import Ticker      from '@/components/Ticker';
import Screenshots from '@/components/Screenshots';
import Mechanics   from '@/components/Mechanics';
import Scenarios   from '@/components/Scenarios';
import Arsenal     from '@/components/Arsenal';
import Terrains    from '@/components/Terrains';
import Offline     from '@/components/Offline';
import ShareCodes  from '@/components/ShareCodes';
import Controls    from '@/components/Controls';
import Specs       from '@/components/Specs';
import Download    from '@/components/Download';
import Footer      from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <NavBar />
      <Hero />
      <Ticker />
      <Screenshots />
      <Mechanics />
      <Scenarios />
      <Arsenal />
      <Terrains />
      <Offline />
      <ShareCodes />
      <Controls />
      <Specs />
      <Download />
      <Footer />
    </main>
  );
}
