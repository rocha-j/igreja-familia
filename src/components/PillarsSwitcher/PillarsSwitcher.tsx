import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { pillars } from '../../data/pillars';
import { useScroll } from '../../motion/scrollContext';
import { distance, PIN_MIN_WIDTH, scroll, transition } from '../../motion/tokens';
import { useScrollStories } from '../../motion/useMediaQuery';
import { Reveal } from '../Reveal/Reveal';
import './PillarsSwitcher.css';

gsap.registerPlugin(ScrollTrigger);

const AUTO_ADVANCE_MS = 6000;

/**
 * Amar / Servir / Restaurar. On wide screens the section pins and scrolling
 * moves through the three pillars; elsewhere it is the tabbed switcher that
 * advances on its own and pauses on hover/focus (and never runs with reduced
 * motion).
 */
export function PillarsSwitcher() {
  const [active, setActive] = useState(0);
  const [interacting, setInteracting] = useState(false);
  const reduceMotion = useReducedMotion();
  const scrollDriven = useScrollStories(PIN_MIN_WIDTH);
  const { scrollTo } = useScroll();

  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const fills = useRef<(HTMLElement | null)[]>([]);
  const trigger = useRef<ScrollTrigger | null>(null);

  // WCAG 2.2.2: auto-advancing content must be pausable. It stops while the
  // user hovers/focuses the switcher, and never runs with reduced motion.
  const paused = interacting || !!reduceMotion;

  // One timeout per slide: selecting a tab changes `active`, which restarts it.
  useEffect(() => {
    if (paused || scrollDriven) return;
    const id = setTimeout(() => {
      setActive((prev) => (prev + 1) % pillars.length);
    }, AUTO_ADVANCE_MS);
    return () => clearTimeout(id);
  }, [active, paused, scrollDriven]);

  useLayoutEffect(() => {
    if (!scrollDriven || !root.current || !pin.current) return;
    const count = pillars.length;
    let last = -1;
    const st = ScrollTrigger.create({
      trigger: root.current,
      start: 'top top',
      end: () => `+=${Math.round(window.innerHeight * (scroll.pinLength - 1))}`,
      pin: pin.current,
      scrub: scroll.scrub,
      anticipatePin: 1,
      onUpdate: (self) => {
        const p = self.progress;
        const idx = Math.min(count - 1, Math.floor(p * count));
        if (idx !== last) {
          last = idx;
          setActive(idx);
        }
        fills.current.forEach((fill, i) => {
          if (fill) fill.style.transform = `scaleX(${Math.min(1, Math.max(0, p * count - i))})`;
        });
      },
    });
    trigger.current = st;
    return () => {
      st.kill();
      trigger.current = null;
      setActive(0);
    };
  }, [scrollDriven]);

  function selectPillar(index: number) {
    const st = trigger.current;
    if (scrollDriven && st) {
      scrollTo(st.start + (st.end - st.start) * ((index + 0.5) / pillars.length));
      return;
    }
    setActive(index);
  }

  const current = pillars[active];

  return (
    <section
      id="pilares"
      ref={root}
      className={`section pillars-section ${scrollDriven ? 'is-pinned' : ''}`}
    >
      <div ref={pin} className="pillars-section__pin">
        <div className="container">
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
                  onClick={() => selectPillar(index)}
                >
                  <span className="pillars__tab-subtitle">{pillar.subtitle}</span>
                  <span className="pillars__tab-word">{pillar.word}</span>
                  <span className="pillars__tab-track">
                    {scrollDriven ? (
                      <span
                        className="pillars__tab-progress pillars__tab-progress--scrub"
                        ref={(el) => {
                          fills.current[index] = el;
                        }}
                      />
                    ) : (
                      index === active && (
                        <motion.span
                          key={`${pillar.id}-${paused ? 'paused' : 'running'}`}
                          className="pillars__tab-progress"
                          initial={{ width: paused ? '100%' : '0%' }}
                          animate={{ width: '100%' }}
                          transition={paused ? { duration: 0 } : { duration: AUTO_ADVANCE_MS / 1000, ease: 'linear' }}
                        />
                      )
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
                  <span className="pillars__panel-label">{current.word}</span>
                  <p className="pillars__panel-text">{current.text}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
