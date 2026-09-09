import logoDark from '../../assets/logoDark.png';
import logoLight from '../../assets/logoLightIcon.png';
import { socialLinks } from '../../data/socialLinks';
import type { Theme } from '../../hooks/useTheme';
import { AnimatedText } from '../AnimatedText/AnimatedText';
import { Reveal, StaggerGroup } from '../Reveal/Reveal';
import { SectionLabel } from '../SectionLabel/SectionLabel';
import { NetworkCard } from './NetworkCard';
import './NetworksSection.css';

interface NetworksSectionProps {
  theme: Theme;
}

export function NetworksSection({ theme }: NetworksSectionProps) {
  return (
    <section id="redes" className="section networks">
      <img
        src={theme === 'dark' ? logoDark : logoLight}
        alt=""
        className="networks__watermark"
        aria-hidden="true"
      />
      <div className="container">
        <SectionLabel title="NOSSAS REDES" />

        <AnimatedText as="h2" className="networks__title" text="SIGA NOSSAS REDES" goldWords={['REDES']} />

        <Reveal delay={0.15}>
          <p className="networks__text">
            Acompanhe os bastidores, cultos e novidades da Igreja Família nas nossas redes sociais.
          </p>
        </Reveal>

        <StaggerGroup className="networks__grid">
          {socialLinks.map((link, index) => (
            <NetworkCard key={link.id} link={link} index={index} />
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
