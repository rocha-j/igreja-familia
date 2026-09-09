import { schedule } from '../../data/schedule';
import { AnimatedText } from '../AnimatedText/AnimatedText';
import { ParallaxImage } from '../ParallaxImage/ParallaxImage';
import { Reveal, StaggerGroup, StaggerItem } from '../Reveal/Reveal';
import { SectionLabel } from '../SectionLabel/SectionLabel';
import './ScheduleSection.css';

const SCHEDULE_PHOTO =
  'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1200&q=80';

export function ScheduleSection() {
  return (
    <section id="programacao" className="section section--alt schedule">
      <div className="container schedule__grid">
        <Reveal className="schedule__image-wrap">
          <ParallaxImage
            className="schedule__image"
            src={SCHEDULE_PHOTO}
            alt="Congregação da Igreja Família louvando em um culto"
          />
        </Reveal>

        <div className="schedule__copy">
          <SectionLabel title="PROGRAMAÇÃO" />

          <AnimatedText
            as="h2"
            className="schedule__title"
            text="VENHA VIVER ESSA EXPERIÊNCIA"
            goldWords={['EXPERIÊNCIA']}
          />

          <Reveal delay={0.15}>
            <p className="schedule__text">
              Separamos um tempo especial pra você, sua família e seus amigos. Seja na sua primeira
              visita ou sempre, você vai encontrar um lugar aqui.
            </p>
          </Reveal>

          <StaggerGroup className="schedule__list">
            {schedule.map((program) => (
              <StaggerItem key={program.id} className="schedule__item">
                <span className="schedule__item-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                    <path
                      d="M12 7v5l3.5 2"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <div className="schedule__item-info">
                  <span className="schedule__item-title">{program.title}</span>
                  <div className="schedule__item-times">
                    {program.schedule.map((entry, index) => (
                      <span key={index} className="schedule__item-time-row">
                        <span className="schedule__item-day">{entry.day}</span>
                        <span className="schedule__item-time">{entry.time}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>

          <Reveal delay={0.3}>
            <a href="#onde-estamos" className="btn btn-primary schedule__cta">
              Nos Visite →
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
