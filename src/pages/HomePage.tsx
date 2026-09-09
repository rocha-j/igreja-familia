import { AboutSection } from '../components/AboutSection/AboutSection';
import { Footer } from '../components/Footer/Footer';
import { Header } from '../components/Header/Header';
import { HeroSection } from '../components/HeroSection/HeroSection';
import { LocationSection } from '../components/LocationSection/LocationSection';
import { NetworksSection } from '../components/NetworksSection/NetworksSection';
import { ScheduleSection } from '../components/ScheduleSection/ScheduleSection';
import { ScrollProgress } from '../components/ScrollProgress/ScrollProgress';
import { useTheme } from '../hooks/useTheme';

export function HomePage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <ScrollProgress theme={theme} />
      <main>
        <HeroSection />
        <AboutSection theme={theme} />
        <ScheduleSection />
        <NetworksSection theme={theme} />
        <LocationSection />
      </main>
      <Footer theme={theme} />
    </>
  );
}
