export interface SocialLink {
  id: string;
  label: string;
  href: string;
  icon: 'instagram' | 'facebook' | 'youtube';
  tagline: string;
}

export const socialLinks: SocialLink[] = [
  {
    id: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/igrejafamilia.ofc?stkn=MXUxYzBjM3NrdjlpZA==',
    icon: 'instagram',
    tagline: 'Fotos e bastidores do dia a dia',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    href: 'https://www.facebook.com/share/19MnJtm5ys/',
    icon: 'facebook',
    tagline: 'Novidades, eventos e comunidade',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    href: 'https://youtube.com/@igrejafamiliasbc?si=zU_TippOsKkfdx8U',
    icon: 'youtube',
    tagline: 'Cultos e mensagens completas',
  },
];
