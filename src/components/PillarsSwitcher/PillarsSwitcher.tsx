import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { pillars } from '../../data/pillars';
import { Reveal } from '../Reveal/Reveal';
import './PillarsSwitcher.css';

const AUTO_ADVANCE_MS = 6000;

export function PillarsSwitcher() {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function startTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % pillars.length);
    }, AUTO_ADVANCE_MS);
  }

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function selectPillar(index: number) {
    setActive(index);
    startTimer();
  }

  const current = pillars[active];

  return (
    <div className="pillars">
      <Reveal className="pillars__tabs" y={16}>
        {pillars.map((pillar, index) => (
          <button
            key={pillar.id}
            type="button"
            className={`pillars__tab ${index === active ? 'is-active' : ''}`}
            onClick={() => selectPillar(index)}
          >
            <span className="pillars__tab-word">{pillar.word}</span>
            <span className="pillars__tab-subtitle">{pillar.subtitle}</span>
            <span className="pillars__tab-track">
              {index === active && (
                <motion.span
                  key={`${pillar.id}-${active}`}
                  className="pillars__tab-progress"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: AUTO_ADVANCE_MS / 1000, ease: 'linear' }}
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
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            aria-hidden="true"
          >
            {current.word}
          </motion.span>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id + '-text'}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="pillars__panel"
          >
            <p className="pillars__panel-text">{current.text}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
