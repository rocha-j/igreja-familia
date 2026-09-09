export interface NavItem {
  label: string;
  href: string;
}

export const navigation: NavItem[] = [
  { label: 'Início', href: '/#hero' },
  { label: 'Sobre', href: '/#somos' },
  { label: 'Programação', href: '/#programacao' },
  { label: 'Nossas Redes', href: '/#redes' },
  { label: 'Contribua', href: '/doacoes' },
];
