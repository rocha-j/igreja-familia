export interface Milestone {
  id: string;
  /** Large display text for the milestone: a year, a figure or a single word. */
  big: string;
  title: string;
  text: string;
}

export const milestones: Milestone[] = [
  {
    id: 'sala',
    big: '2020',
    title: 'Uma sala, cinco pessoas',
    text: 'Em julho, em meio à pandemia, uma visão que nasceu anos antes vira discipulado na sala de uma casa, com cinco pessoas dispostas a caminhar juntas.',
  },
  {
    id: 'primeiro-culto',
    big: 'R$ 253',
    title: 'O primeiro culto oficial',
    text: 'Em 2021, o primeiro culto acontece com apenas R$ 253,00 em caixa. Deus supriu cada detalhe.',
  },
  {
    id: 'caminhada',
    big: 'Caminhada',
    title: 'Da sala ao endereço de hoje',
    text: 'Passamos por um hotel e por uma garagem até chegar a São Bernardo do Campo. Em cada etapa, vidas foram restauradas e famílias alcançadas.',
  },
  {
    id: 'mocambique',
    big: '+600',
    title: 'Missão em Moçambique',
    text: 'Uma pequena família se tornou uma igreja inteira, com uma missão a Moçambique em que mais de 600 pessoas decidiram entregar a vida a Jesus.',
  },
  {
    id: 'hoje',
    big: '5 anos',
    title: 'Seguimos escrevendo',
    text: 'Com a mesma convicção que nos trouxe até aqui: amar a Deus, amar pessoas e continuar escrevendo essa história.',
  },
];
