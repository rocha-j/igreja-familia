import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { pillars } from '../../data/pillars';
import { distance, transition } from '../../motion/tokens';
import { Reveal } from '../Reveal/Reveal';
import './PillarsSwitcher.css';

const AUTO_ADVANCE_MS = 6000;

export function PillarsSwitcher() {
  const [active, setActive] = useState(0);
  const [interacting, setInteracting] = useState(false);
  const reduceMotion = useReducedMotion();
  // WCAG 2.2.2: auto-advancing content must be pausable. It stops while the
  // user hovers/focuses the switcher, and never runs with reduced motion.
  const paused = interacting || !!reduceMotion;

  // One timeout per slide: selecting a tab changes `active`, which restarts it.
  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => {
      setActive((prev) => (prev + 1) % pillars.length);
    }, AUTO_ADVANCE_MS);
    return () => clearTimeout(id);
  }, [active, paused]);

  const current = pillars[active];

  return (
    <div
      className="pillars"
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocus={() => setInteracting(true)}
      onBlur={() => setInteracting(false)}
    >
      <Reveal className="pillars__tabs" y={16}>
        {pillars.map((pillar, index) => (
          <button
            key={pillar.id}
            type="button"
            className={`pillars__tab ${index === active ? 'is-active' : ''}`}
            onClick={() => setActive(index)}
          >
            <span className="pillars__tab-word">{pillar.word}</span>
            <span className="pillars__tab-subtitle">{pillar.subtitle}</span>
            <span className="pillars__tab-track">
              {index === active && (
                <motion.span
                  key={`${pillar.id}-${paused ? 'paused' : 'running'}`}
                  className="pillars__tab-progress"
                  initial={{ width: paused ? '100%' : '0%' }}
                  animate={{ width: '100%' }}
                  transition={paused ? { duration: 0 } : { duration: AUTO_ADVANCE_MS / 1000, ease: 'linear' }}
                />
              )}
            </span>
          </button>
        ))}
      </Reveal>

      <div className="pillars__display">
        <AnimatePresence mode="wait">
          <motion.span
            key={current.id + '-word'}
            className="pillars__watermark"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={transition.base}
            aria-hidden="true"
          >
            {current.word}
          </motion.span>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id + '-text'}
            initial={{ opacity: 0, y: distance.sm }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -distance.sm }}
            transition={transition.base}
            className="pillars__panel"
          >
            <p className="pillars__panel-text">{current.text}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
