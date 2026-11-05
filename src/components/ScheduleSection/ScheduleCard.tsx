import type { ScheduleProgram } from '../../data/schedule';
import { getNextEntryIndex } from '../../utils/nextService';
import { StaggerItem } from '../Reveal/Reveal';
import './ScheduleCard.css';

export function ScheduleCard({ program }: { program: ScheduleProgram }) {
  // Only the services ("Cultos") get a "next one" highlight.
  const nextIndex = program.id === 'cultos' ? getNextEntryIndex(program.schedule) : null;

  return (
    <StaggerItem className="schedule-card">
      <span className="schedule-card__icon-wrap">
        <span className="schedule-card__icon-frame">
          <img src={program.icon} alt="" className="schedule-card__icon" />
        </span>
      </span>

      <span className="schedule-card__divider" aria-hidden="true" />

      <div className="schedule-card__body">
        <span className="schedule-card__name">{program.title}</span>

        <div className="schedule-card__times">
          {program.schedule.map((entry, i) => (
            <div key={i} className={`schedule-card__time-row ${i === nextIndex ? 'is-next' : ''}`}>
              <span className="schedule-card__day">{entry.day}</span>
              {entry.time && <span className="schedule-card__time">{entry.time}</span>}
              {i === nextIndex && <span className="schedule-card__next-tag">Próximo culto</span>}
            </div>
          ))}
        </div>
      </div>
    </StaggerItem>
  );
}
