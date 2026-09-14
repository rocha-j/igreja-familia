import './OrganicLines.css';

interface OrganicLinesProps {
  variant?: 'top-right' | 'bottom-left' | 'full';
  className?: string;
}

export function OrganicLines({ variant = 'top-right', className }: OrganicLinesProps) {
  return (
    <svg
      className={`organic-lines organic-lines--${variant} ${className ?? ''}`}
      viewBox="0 0 600 400"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <path
        d="M-20 340C120 300 180 180 340 210C460 232 500 120 620 80"
        stroke="var(--accent)"
        strokeOpacity="0.35"
        strokeWidth="1"
      />
      <path
        d="M-40 60C100 120 160 40 320 90C440 128 520 40 640 60"
        stroke="var(--accent)"
        strokeOpacity="0.18"
        strokeWidth="1"
      />
      <circle cx="80" cy="330" r="2.5" fill="var(--accent)" fillOpacity="0.6" />
      <circle cx="420" cy="150" r="2" fill="var(--accent)" fillOpacity="0.5" />
      <circle cx="560" cy="300" r="1.5" fill="var(--accent)" fillOpacity="0.4" />
    </svg>
  );
}
