import type { SocialLink } from '../../data/socialLinks';
import { StaggerItem } from '../Reveal/Reveal';
import { SocialIcon } from '../SocialIcon/SocialIcon';
import './NetworkCard.css';

export function NetworkCard({ link }: { link: SocialLink }) {
  return (
    <StaggerItem className="network-card">
      <a href={link.href} target="_blank" rel="noopener noreferrer" className="network-card__link">
        <span className="network-card__icon-wrap">
          <span className="network-card__icon">
            <SocialIcon icon={link.icon} />
          </span>
        </span>

        <span className="network-card__name">{link.label}</span>
        <span className="network-card__tagline">{link.tagline}</span>

        <span className="network-card__arrow">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </a>
    </StaggerItem>
  );
}
