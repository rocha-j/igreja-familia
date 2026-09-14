import { AboutSection } from '../components/AboutSection/AboutSection';
import { Footer } from '../components/Footer/Footer';
import { Header } from '../components/Header/Header';
import { HeroSection } from '../components/HeroSection/HeroSection';
import { LocationSection } from '../components/LocationSection/LocationSection';
import { NetworksSection } from '../components/NetworksSection/NetworksSection';
import { ScheduleSection } from '../components/ScheduleSection/ScheduleSection';
import { ScrollProgress } from '../components/ScrollProgress/ScrollProgress';

export function HomePage() {
  return (
    <>
      <Header />
      <ScrollProgress />
      <main>
        <HeroSection />
        <AboutSection />
        <ScheduleSection />
        <NetworksSection />
        <LocationSection />
      </main>
      <Footer />
    </>
  );
}
