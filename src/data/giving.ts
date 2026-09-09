export interface GivingChannel {
  id: string;
  title: string;
  eyebrow?: string;
  description: string;
  pixKey: string;
  pixDescription: string;
}

export const givingChannels: GivingChannel[] = [
  {
    id: 'nova-casa',
    title: 'Uma Nova Casa',
    description:
      'Faça parte deste projeto! Faça sua doação através do QR Code ao lado, ou através da chave Pix.',
    pixKey: 'familiaemprojeto.ofc@gmail.com',
    pixDescription: 'Uma Nova Casa',
  },
  {
    id: 'dizimos-ofertas',
    title: 'Dízimos & Ofertas',
    eyebrow: '2 Coríntios 9:7',
    description:
      'Cada um contribua segundo propôs no seu coração: não com tristeza, ou por necessidade; porque Deus ama ao que dá com alegria.',
    pixKey: 'igrejafamiliaa@gmail.com',
    pixDescription: 'Dizimos e Ofertas',
  },
  {
    id: 'missao-familia',
    title: 'Missão Família',
    eyebrow: 'Contribua e nos ajude nas ações sociais',
    description: 'Para conhecer os projetos e ajudar de outras maneiras, procure o líder de missões, Paulo César.',
    pixKey: 'missaoigrejafamiliaa@gmail.com',
    pixDescription: 'Missao Familia',
  },
];
