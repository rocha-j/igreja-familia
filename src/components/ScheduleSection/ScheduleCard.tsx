import { motion } from 'framer-motion';
import type { ScheduleProgram } from '../../data/schedule';
import { StaggerItem } from '../Reveal/Reveal';
import './ScheduleCard.css';

export function ScheduleCard({ program, index }: { program: ScheduleProgram; index: number }) {
  return (
    <StaggerItem className="schedule-card">
      <motion.div
        className="schedule-card__float"
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: index * 0.35,
        }}
      >
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
              <div key={i} className="schedule-card__time-row">
                <span className="schedule-card__day">{entry.day}</span>
                {entry.time && <span className="schedule-card__time">{entry.time}</span>}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </StaggerItem>
  );
}
