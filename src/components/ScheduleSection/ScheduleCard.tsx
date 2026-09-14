import type { ScheduleProgram } from '../../data/schedule';
import { StaggerItem } from '../Reveal/Reveal';
import './ScheduleCard.css';

export function ScheduleCard({ program }: { program: ScheduleProgram }) {
  return (
    <StaggerItem className="schedule-card">
      <span className="schedule-card__icon-wrap">
        <img src={program.icon} alt="" className="schedule-card__icon" />
      </span>

      <span className="schedule-card__name">{program.title}</span>

      <div className="schedule-card__times">
        {program.schedule.map((entry, index) => (
          <div key={index} className="schedule-card__time-row">
            <span className="schedule-card__day">{entry.day}</span>
            {entry.time && <span className="schedule-card__time">{entry.time}</span>}
          </div>
        ))}
      </div>
    </StaggerItem>
  );
}
