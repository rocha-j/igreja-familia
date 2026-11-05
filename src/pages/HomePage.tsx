import { AboutSection } from '../components/AboutSection/AboutSection';
import { Footer } from '../components/Footer/Footer';
import { Header } from '../components/Header/Header';
import { GivingSection } from '../components/GivingSection/GivingSection';
import { HeroSection } from '../components/HeroSection/HeroSection';
import { LocationSection } from '../components/LocationSection/LocationSection';
import { NetworksSection } from '../components/NetworksSection/NetworksSection';
import { ScheduleSection } from '../components/ScheduleSection/ScheduleSection';

export function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <ScheduleSection />
        <NetworksSection />
        <GivingSection />
        <LocationSection />
      </main>
      <Footer />
    </>
  );
}
