import logoDark from '../../assets/logoDark.png';
import logoLight from '../../assets/logoLightIcon.png';
import type { Theme } from '../../hooks/useTheme';
import { AnimatedText } from '../AnimatedText/AnimatedText';
import { OrganicLines } from '../OrganicLines/OrganicLines';
import { ParallaxImage } from '../ParallaxImage/ParallaxImage';
import { PillarsSwitcher } from '../PillarsSwitcher/PillarsSwitcher';
import { Reveal } from '../Reveal/Reveal';
import { SectionLabel } from '../SectionLabel/SectionLabel';
import './AboutSection.css';

interface AboutSectionProps {
  theme: Theme;
}

export function AboutSection({ theme }: AboutSectionProps) {
  return (
    <section id="somos" className="section section--alt about">
      <img
        src={theme === 'dark' ? logoDark : logoLight}
        alt=""
        className="about__watermark"
        aria-hidden="true"
      />
      <OrganicLines variant="top-right" />

      <div className="container about__grid">
        <div className="about__copy">
          <SectionLabel title="SOMOS" />

          <AnimatedText
            as="h2"
            className="about__title"
            text="SOMOS UMA FAMÍLIA QUE AMA A DEUS, AMA PESSOAS E TRANSFORMA O MUNDO."
            goldWords={['DEUS', 'PESSOAS', 'MUNDO']}
          />

          <Reveal delay={0.15}>
            <p className="about__text">
              Acreditamos que igreja é mais que um lugar. É uma família. Um lugar de amor, graça e
              propósito.
            </p>
          </Reveal>

          <Reveal delay={0.25}>
            <a href="#programacao" className="about__cta link-underline">
              Conheça Nossa História →
            </a>
          </Reveal>
        </div>

        <Reveal delay={0.2} className="about__image-wrap">
          <ParallaxImage
            className="about__image"
            src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80"
            alt="Família reunida sorrindo em comunhão na igreja"
          />
        </Reveal>
      </div>

      <div className="container">
        <PillarsSwitcher />
      </div>
    </section>
  );
}
