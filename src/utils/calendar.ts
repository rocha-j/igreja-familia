import type { ScheduleEntry } from '../data/schedule';

// Everything here is read in the church's time zone (São Bernardo do Campo),
// so "today" and "next meeting" do not depend on the visitor's own clock zone.
const TIME_ZONE = 'America/Sao_Paulo';

export const WEEKDAY_LETTERS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'] as const;
const WEEKDAY_NAMES = [
  'domingo',
  'segunda-feira',
  'terça-feira',
  'quarta-feira',
  'quinta-feira',
  'sexta-feira',
  'sábado',
] as const;
const MONTH_NAMES = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
] as const;

export interface CalendarDay {
  year: number;
  /** 0 = January */
  month: number;
  day: number;
}

export interface ChurchNow extends CalendarDay {
  /** 0 = Sunday */
  weekday: number;
  minutes: number;
}

export function churchNow(now: Date = new Date()): ChurchNow {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return {
    year: Number(get('year')),
    month: Number(get('month')) - 1,
    day: Number(get('day')),
    weekday: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday')),
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
  };
}

const utc = (d: CalendarDay) => Date.UTC(d.year, d.month, d.day);

export function weekdayIndex(dayName: string): number | undefined {
  const i = WEEKDAY_NAMES.indexOf(dayName.toLowerCase() as (typeof WEEKDAY_NAMES)[number]);
  return i === -1 ? undefined : i;
}

/** The seven dates (Sunday to Saturday) of the week that contains today. */
export function currentWeek(today: ChurchNow): { weekday: number; day: number }[] {
  return Array.from({ length: 7 }, (_, weekday) => {
    const date = new Date(utc(today));
    date.setUTCDate(today.day - today.weekday + weekday);
    return { weekday, day: date.getUTCDate() };
  });
}

export function monthGrid(today: CalendarDay) {
  const first = new Date(Date.UTC(today.year, today.month, 1)).getUTCDay();
  const days = new Date(Date.UTC(today.year, today.month + 1, 0)).getUTCDate();
  return { label: MONTH_NAMES[today.month], year: today.year, leadingBlanks: first, days };
}

/** Day of the month of the fourth Saturday. */
export function fourthSaturday(year: number, month: number): number {
  const first = new Date(Date.UTC(year, month, 1)).getUTCDay();
  return 1 + ((6 - first + 7) % 7) + 21;
}

export function nextFourthSaturday(today: CalendarDay): CalendarDay {
  const thisMonth = fourthSaturday(today.year, today.month);
  if (thisMonth >= today.day) return { year: today.year, month: today.month, day: thisMonth };
  const month = (today.month + 1) % 12;
  const year = today.month === 11 ? today.year + 1 : today.year;
  return { year, month, day: fourthSaturday(year, month) };
}

export interface NextMeeting {
  date: CalendarDay & { weekday: number };
  time?: string;
  /** "hoje", "amanhã" or "em 3 dias" */
  relative: string;
  /** "Domingo, 8 de novembro às 10h" */
  label: string;
}

function describe(from: CalendarDay, to: CalendarDay, time?: string): NextMeeting {
  const weekday = new Date(utc(to)).getUTCDay();
  const days = Math.round((utc(to) - utc(from)) / 86_400_000);
  const relative = days === 0 ? 'hoje' : days === 1 ? 'amanhã' : `em ${days} dias`;
  const name = WEEKDAY_NAMES[weekday];
  const date = `${name.charAt(0).toUpperCase()}${name.slice(1)}, ${to.day} de ${MONTH_NAMES[to.month]}`;
  return { date: { ...to, weekday }, time, relative, label: time ? `${date} às ${time}` : date };
}

function parseTime(time: string): number | null {
  const match = /^(\d{1,2})h(\d{2})?$/.exec(time.trim());
  return match ? Number(match[1]) * 60 + Number(match[2] ?? 0) : null;
}

/** The next meeting among weekly entries (wrapping into next week), or null. */
export function nextWeekly(entries: ScheduleEntry[], now: Date = new Date()): NextMeeting | null {
  const current = churchNow(now);
  const nowMinuteOfWeek = current.weekday * 1440 + current.minutes;
  const week = 7 * 1440;

  let best: { wait: number; entry: ScheduleEntry } | null = null;
  for (const entry of entries) {
    const weekday = weekdayIndex(entry.day);
    const minutes = entry.time ? parseTime(entry.time) : null;
    if (weekday === undefined || minutes === null) continue;
    const wait = (weekday * 1440 + minutes - nowMinuteOfWeek + week) % week;
    if (best === null || wait < best.wait) best = { wait, entry };
  }
  if (!best) return null;

  const when = churchNow(new Date(now.getTime() + best.wait * 60_000));
  return describe(current, when, best.entry.time);
}

export function nextMonthlySaturday(now: Date = new Date()): NextMeeting {
  const today = churchNow(now);
  return describe(today, nextFourthSaturday(today));
}
