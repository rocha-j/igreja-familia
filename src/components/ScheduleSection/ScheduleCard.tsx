import type { ScheduleProgram } from '../../data/schedule';
import {
  currentWeek,
  fourthSaturday,
  monthGrid,
  churchNow,
  nextMonthlySaturday,
  nextWeekly,
  weekdayIndex,
  WEEKDAY_LETTERS,
} from '../../utils/calendar';
import { getNextEntryIndex } from '../../utils/nextService';
import { StaggerItem } from '../Reveal/Reveal';
import './ScheduleCard.css';

function WeekStrip({ program }: { program: ScheduleProgram }) {
  const today = churchNow();
  const meetingDays = new Set(program.schedule.map((e) => weekdayIndex(e.day)));
  return (
    <div className="schedule-card__week" role="img" aria-label="Semana atual, com os dias de encontro marcados">
      {currentWeek(today).map(({ weekday, day }) => (
        <span
          key={weekday}
          className={`schedule-card__wd ${meetingDays.has(weekday) ? 'is-meeting' : ''} ${weekday === today.weekday ? 'is-today' : ''}`}
        >
          <small>{WEEKDAY_LETTERS[weekday]}</small>
          <b>{day}</b>
        </span>
      ))}
    </div>
  );
}

function MonthGrid() {
  const today = churchNow();
  const grid = monthGrid(today);
  const hit = fourthSaturday(today.year, today.month);
  return (
    <div className="schedule-card__month" role="img" aria-label="Mês atual, com o quarto sábado marcado">
      <div className="schedule-card__month-head">
        <b>{grid.label}</b>
        <small>{grid.year}</small>
      </div>
      {WEEKDAY_LETTERS.map((letter, i) => (
        <span key={i} className="schedule-card__mw">
          {letter}
        </span>
      ))}
      {Array.from({ length: grid.leadingBlanks }, (_, i) => (
        <span key={`b${i}`} />
      ))}
      {Array.from({ length: grid.days }, (_, i) => {
        const day = i + 1;
        return (
          <span
            key={day}
            className={`schedule-card__md ${day === hit ? 'is-meeting' : ''} ${day === today.day ? 'is-today' : ''}`}
          >
            {day}
          </span>
        );
      })}
    </div>
  );
}

export function ScheduleCard({ program }: { program: ScheduleProgram }) {
  const monthly = program.schedule.every((e) => weekdayIndex(e.day) === undefined);
  // Only the services ("Cultos") get a "next one" highlight inside the times list.
  const nextIndex = program.id === 'cultos' ? getNextEntryIndex(program.schedule) : null;
  const next = monthly ? nextMonthlySaturday() : nextWeekly(program.schedule);

  return (
    <StaggerItem className="schedule-card">
      <div className="schedule-card__head">
        <span className="schedule-card__icon-wrap">
          <span className="schedule-card__icon-frame">
            <img src={program.icon} alt="" className="schedule-card__icon" />
          </span>
        </span>
        <div>
          <span className="schedule-card__name">{program.title}</span>
          <small className="schedule-card__cadence">{monthly ? 'Todo quarto sábado do mês' : 'Toda semana'}</small>
        </div>
      </div>

      {monthly ? <MonthGrid /> : <WeekStrip program={program} />}

      {!monthly && (
        <div className="schedule-card__times">
          {program.schedule.map((entry, i) => (
            <div key={i} className={`schedule-card__time-row ${i === nextIndex ? 'is-next' : ''}`}>
              <span className="schedule-card__day">{entry.day}</span>
              {entry.time && <span className="schedule-card__time">{entry.time}</span>}
              {i === nextIndex && <span className="schedule-card__next-tag">Próximo culto</span>}
            </div>
          ))}
        </div>
      )}

      {next && (
        <div className="schedule-card__next" aria-live="polite">
          <small>Próximo encontro · {next.relative}</small>
          <b>{next.label}</b>
        </div>
      )}
    </StaggerItem>
  );
}
