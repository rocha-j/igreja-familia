import logoDark from '../../assets/logoDark.png';
import logoLight from '../../assets/logoLightIcon.png';
import { useActiveSection } from '../../hooks/useActiveSection';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import type { Theme } from '../../hooks/useTheme';
import './ScrollProgress.css';

const SECTIONS = [
  { id: 'hero', title: 'INÍCIO' },
  { id: 'somos', title: 'SOMOS' },
  { id: 'programacao', title: 'PROGRAMAÇÃO' },
  { id: 'redes', title: 'NOSSAS REDES' },
  { id: 'onde-estamos', title: 'ONDE ESTAMOS' },
  { id: 'footer', title: 'CONTATO' },
];

interface ScrollProgressProps {
  theme: Theme;
}

export function ScrollProgress({ theme }: ScrollProgressProps) {
  // Raw scroll fraction (0-1) — used only for the icon's spin, so it keeps
  // turning smoothly with every pixel scrolled.
  const rawProgress = useScrollProgress();
  const activeId = useActiveSection(SECTIONS.map((s) => s.id));

  // The list items are evenly spaced by flexbox, not by how tall each section
  // actually is, so the fill/marker must snap to the active item's position
  // (by index) rather than to raw scroll % — otherwise they drift apart.
  const activeIndex = Math.max(
    0,
    SECTIONS.findIndex((s) => s.id === activeId)
  );
  const sectionProgress = activeIndex / (SECTIONS.length - 1);

  return (
    <nav className="scroll-progress" aria-label="Progresso de navegação da página">
      <div className="scroll-progress__track">
        <div className="scroll-progress__fill" style={{ height: `${sectionProgress * 100}%` }}>
          <span className="scroll-progress__marker">
            <img
              src={theme === 'dark' ? logoDark : logoLight}
              alt=""
              className="scroll-progress__marker-icon"
              style={{ transform: `rotate(${rawProgress * 1800}deg)` }}
            />
          </span>
        </div>
      </div>
      <ul className="scroll-progress__list">
        {SECTIONS.map((s) => (
          <li key={s.id} className={s.id === activeId ? 'is-active' : ''}>
            <a href={`#${s.id}`}>
              <span className="scroll-progress__title">{s.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
