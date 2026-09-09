import type { SocialLink } from '../../data/socialLinks';

const common = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function SocialIcon({ icon }: { icon: SocialLink['icon'] }) {
  switch (icon) {
    case 'instagram':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'facebook':
      return (
        <svg {...common}>
          <path d="M15 8h-2a2 2 0 00-2 2v10M9 13h4" />
          <path d="M15 3H9a6 6 0 00-6 6v6a6 6 0 006 6h6a6 6 0 006-6V9a6 6 0 00-6-6z" />
        </svg>
      );
    case 'youtube':
      return (
        <svg {...common}>
          <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
          <path d="M10.5 9.5l5 2.5-5 2.5v-5z" fill="currentColor" stroke="none" />
        </svg>
      );
    default:
      return null;
  }
}
