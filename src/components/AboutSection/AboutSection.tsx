import churchBuilding from '../../assets/churchBuilding.jpg';
import logoLight from '../../assets/logoLightIcon.png';
import { AnimatedText } from '../AnimatedText/AnimatedText';
import { OrganicLines } from '../OrganicLines/OrganicLines';
import { ParallaxImage } from '../ParallaxImage/ParallaxImage';
import { PillarsSwitcher } from '../PillarsSwitcher/PillarsSwitcher';
import { Reveal } from '../Reveal/Reveal';
import { SectionLabel } from '../SectionLabel/SectionLabel';
import './AboutSection.css';

const HISTORY_PARAGRAPHS = [
  'Tudo começou em julho de 2020, em meio à pandemia: uma visão que nasceu anos antes, um discipulado na sala de uma casa e cinco pessoas dispostas a caminhar juntas. Em 2021, realizamos nosso primeiro culto oficial com apenas R$ 253,00 em caixa e Deus supriu cada detalhe.',
  'De uma sala, passamos por um hotel e por uma garagem até chegarmos ao endereço onde estamos hoje, em São Bernardo do Campo. Em cada etapa, vidas foram restauradas, famílias foram alcançadas e uma pequena família se tornou uma igreja inteira incluindo uma missão a Moçambique, onde mais de 600 pessoas decidiram entregar suas vidas a Jesus.',
  'Hoje, celebrando 5 anos, seguimos com a mesma convicção que nos trouxe até aqui: amar a Deus, amar pessoas e continuar escrevendo essa história.',
];

export function AboutSection() {
  return (
    <section id="somos" className="section section--alt about">
      <img
        src={logoLight}
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
            accentWords={['DEUS', 'PESSOAS', 'MUNDO']}
          />

          {HISTORY_PARAGRAPHS.map((paragraph, i) => (
            <Reveal key={paragraph} delay={0.15 + i * 0.08}>
              <p className="about__text">{paragraph}</p>
            </Reveal>
          ))}

          <Reveal delay={0.4}>
            <a href="#programacao" className="about__cta link-underline">
              Venha Nos Visitar →
            </a>
          </Reveal>
        </div>

        <Reveal delay={0.2} className="about__image-wrap">
          <ParallaxImage className="about__image" src={churchBuilding} alt="Fachada da Igreja Família" />
        </Reveal>
      </div>

      <div className="container">
        <PillarsSwitcher />
      </div>
    </section>
  );
}
