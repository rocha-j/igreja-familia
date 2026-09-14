import { motion } from 'framer-motion';
import type { ScheduleProgram } from '../../data/schedule';
import { StaggerItem } from '../Reveal/Reveal';
import './ScheduleCard.css';

export function ScheduleCard({ program, index }: { program: ScheduleProgram; index: number }) {
  return (
    <StaggerItem className="schedule-card">
      <span className="schedule-card__icon-wrap">
        <motion.span
          className="schedule-card__ping"
          animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
          transition={{
            duration: 2.6,
            repeat: Infinity,
            ease: 'easeOut',
            delay: index * 0.5,
          }}
        />
        <span className="schedule-card__icon-frame">
          <img src={program.icon} alt="" className="schedule-card__icon" />
        </span>
      </span>

      <span className="schedule-card__name">{program.title}</span>

      <div className="schedule-card__times">
        {program.schedule.map((entry, i) => (
          <div key={i} className="schedule-card__time-row">
            <span className="schedule-card__day">{entry.day}</span>
            {entry.time && <span className="schedule-card__time">{entry.time}</span>}
          </div>
        ))}
      </div>
    </StaggerItem>
  );
}
