import { schedule } from '../../data/schedule';
import { AnimatedText } from '../AnimatedText/AnimatedText';
import { OrganicLines } from '../OrganicLines/OrganicLines';
import { Reveal, StaggerGroup } from '../Reveal/Reveal';
import { SectionLabel } from '../SectionLabel/SectionLabel';
import { ScheduleCard } from './ScheduleCard';
import './ScheduleSection.css';

export function ScheduleSection() {
  return (
    <section id="programacao" className="section section--alt schedule">
      <OrganicLines variant="top-right" />

      <div className="container">
        <div className="schedule__intro">
          <SectionLabel title="PROGRAMAÇÃO" />

          <AnimatedText
            as="h2"
            className="schedule__title"
            text="VENHA VIVER ESSA EXPERIÊNCIA"
            accentWords={['EXPERIÊNCIA']}
          />

          <Reveal delay={0.15}>
            <p className="schedule__text">
              Separamos um tempo especial pra você, sua família e seus amigos. Seja na sua primeira
              visita ou sempre, você vai encontrar um lugar aqui.
            </p>
          </Reveal>
        </div>

        <StaggerGroup className="schedule__grid">
          {schedule.map((program) => (
            <ScheduleCard key={program.id} program={program} />
          ))}
        </StaggerGroup>

        <Reveal delay={0.3} className="schedule__cta-wrap">
          <a href="#onde-estamos" className="btn btn-primary schedule__cta">
            Nos Visite →
          </a>
        </Reveal>
      </div>
    </section>
  );
}
