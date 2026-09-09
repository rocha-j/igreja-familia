export interface ScheduleEntry {
  day: string;
  time: string;
}

export interface ScheduleProgram {
  id: string;
  title: string;
  schedule: ScheduleEntry[];
}

export const schedule: ScheduleProgram[] = [
  {
    id: 'cultos',
    title: 'Cultos',
    schedule: [
      { day: 'Quarta-feira', time: '19h30' },
      { day: 'Domingo', time: '10h' },
      { day: 'Domingo', time: '18h30' },
    ],
  },
  {
    id: 'instituto-saber',
    title: 'Instituto Saber',
    schedule: [{ day: 'Domingo', time: '8h30' }],
  },
];
