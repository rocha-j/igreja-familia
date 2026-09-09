import { motion } from 'framer-motion';
import type { Theme } from '../../hooks/useTheme';
import './ThemeToggle.css';

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isLight = theme === 'light';

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-label={isLight ? 'Ativar modo escuro' : 'Ativar modo claro'}
      aria-pressed={isLight}
    >
      <svg viewBox="0 0 32 40" width="22" height="28" aria-hidden="true">
        <line x1="16" y1="24" x2="16" y2="36" stroke="var(--text-nav)" strokeWidth="1.5" />
        <line x1="10" y1="36" x2="22" y2="36" stroke="var(--text-nav)" strokeWidth="1.5" />
        <path d="M4 12L16 2L28 12L24 24H8L4 12Z" stroke="var(--text-nav)" strokeWidth="1.5" fill="none" />
        <motion.g
          animate={{
            opacity: isLight ? 1 : 0.15,
            scale: isLight ? 1 : 0.7,
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: '16px 15px' }}
        >
          <circle cx="16" cy="15" r="5" fill="var(--gold)" />
        </motion.g>
      </svg>
    </button>
  );
}
