import cultosIcon from '../assets/logoBadge.jpg';
import institutoSaberIcon from '../assets/iconInstitutoSaber.jpg';
import prosperIcon from '../assets/iconProspere.jpg';

export interface ScheduleEntry {
  day: string;
  time?: string;
}

export interface ScheduleProgram {
  id: string;
  title: string;
  icon: string;
  schedule: ScheduleEntry[];
}

export const schedule: ScheduleProgram[] = [
  {
    id: 'cultos',
    title: 'Cultos',
    icon: cultosIcon,
    schedule: [
      { day: 'Quarta-feira', time: '19h30' },
      { day: 'Domingo', time: '10h' },
      { day: 'Domingo', time: '18h30' },
    ],
  },
  {
    id: 'instituto-saber',
    title: 'Instituto Saber',
    icon: institutoSaberIcon,
    schedule: [{ day: 'Domingo', time: '8h30' }],
  },
  {
    id: 'prospere',
    title: 'Prospere',
    icon: prosperIcon,
    schedule: [{ day: 'Todo Quarto Sábado do Mês' }],
  },
];
