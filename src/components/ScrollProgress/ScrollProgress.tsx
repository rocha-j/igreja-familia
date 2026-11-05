import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import logoLight from '../../assets/logoLightIcon.png';
import { useActiveSection } from '../../hooks/useActiveSection';
import './ScrollProgress.css';

const SECTIONS = [
  { id: 'hero', title: 'INÍCIO' },
  { id: 'somos', title: 'SOMOS' },
  { id: 'programacao', title: 'PROGRAMAÇÃO' },
  { id: 'redes', title: 'NOSSAS REDES' },
  { id: 'onde-estamos', title: 'ONDE ESTAMOS' },
  { id: 'footer', title: 'CONTATO' },
];

export function ScrollProgress() {
  // The icon makes a single, slow turn over the whole page. It is driven by a
  // motion value, so scrolling never triggers a React re-render, and it stays
  // still for people who prefer reduced motion.
  const { scrollYProgress } = useScroll();
  const reduceMotion = useReducedMotion();
  const rotate = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 360]);
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
            <motion.img
              src={logoLight}
              alt=""
              className="scroll-progress__marker-icon"
              style={{ rotate }}
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
