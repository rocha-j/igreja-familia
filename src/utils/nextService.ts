import type { ScheduleEntry } from '../data/schedule';

const WEEKDAYS: Record<string, number> = {
  domingo: 0,
  'segunda-feira': 1,
  'terça-feira': 2,
  'quarta-feira': 3,
  'quinta-feira': 4,
  'sexta-feira': 5,
  sábado: 6,
};

// The church is in São Bernardo do Campo: "next service" must not depend on
// the visitor's own time zone.
const TIME_ZONE = 'America/Sao_Paulo';

function parseTime(time: string): number | null {
  // "19h30" -> 1170 minutes, "10h" -> 600
  const match = /^(\d{1,2})h(\d{2})?$/.exec(time.trim());
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2] ?? 0);
}

function nowInChurchTime(now: Date): { weekday: number; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  return { weekday, minutes: Number(get('hour')) * 60 + Number(get('minute')) };
}

/** Index of the entry that starts next (wrapping into next week), or null. */
export function getNextEntryIndex(entries: ScheduleEntry[], now: Date = new Date()): number | null {
  return getNextEntry(entries, now)?.index ?? null;
}

/** The next entry plus the minutes until it starts, or null. */
export function getNextEntry(
  entries: ScheduleEntry[],
  now: Date = new Date(),
): { index: number; wait: number } | null {
  const current = nowInChurchTime(now);
  const currentMinuteOfWeek = current.weekday * 1440 + current.minutes;
  const week = 7 * 1440;

  let best: { index: number; wait: number } | null = null;
  entries.forEach((entry, index) => {
    const weekday = WEEKDAYS[entry.day.toLowerCase()];
    const minutes = entry.time ? parseTime(entry.time) : null;
    if (weekday === undefined || minutes === null) return;

    const wait = (weekday * 1440 + minutes - currentMinuteOfWeek + week) % week;
    if (best === null || wait < best.wait) best = { index, wait };
  });

  return best;
}

/** Weekday index (0 = Sunday) for a schedule day name such as "Quarta-feira", or undefined. */
export function weekdayOf(day: string): number | undefined {
  return WEEKDAYS[day.toLowerCase()];
}
