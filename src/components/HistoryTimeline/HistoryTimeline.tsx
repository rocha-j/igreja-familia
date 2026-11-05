import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, useRef, useState } from 'react';
import churchBuilding from '../../assets/churchBuilding.jpg';
import { milestones } from '../../data/history';
import { PIN_MIN_WIDTH, scroll } from '../../motion/tokens';
import { createTree, type GrowingTree } from '../../motion/tree';
import { useScrollStories } from '../../motion/useMediaQuery';
import { AnimatedText } from '../AnimatedText/AnimatedText';
import { SectionLabel } from '../SectionLabel/SectionLabel';
import './HistoryTimeline.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * "Somos": the church's story told by scrolling. On wide screens the section
 * pins and the scroll drives five milestones, a tree that grows leaf by leaf
 * and the reveal of the facade photo. With reduced motion or on narrow
 * screens it is a plain static list.
 */
export function HistoryTimeline() {
  const animated = useScrollStories(PIN_MIN_WIDTH);
  const [active, setActive] = useState(0);

  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const image = useRef<HTMLDivElement>(null);
  const ticks = useRef<(HTMLElement | null)[]>([]);
  const tree = useRef<GrowingTree | null>(null);

  useLayoutEffect(() => {
    if (!svg.current) return;
    tree.current = createTree(svg.current);
    tree.current.render(1);
    return () => {
      tree.current?.destroy();
      tree.current = null;
    };
  }, []);

  useLayoutEffect(() => {
    const grown = tree.current;
    if (!animated || !root.current || !pin.current || !grown) {
      grown?.render(1);
      return;
    }

    const count = milestones.length;
    let target = 0;
    let shown = 0;
    let last = -1;
    grown.render(0);

    // The tree eases toward the scroll position so it grows without jumps.
    const follow = () => {
      if (shown === target) return;
      shown += (target - shown) * 0.08;
      if (Math.abs(target - shown) < 0.0005) shown = target;
      grown.render(shown);
    };
    gsap.ticker.add(follow);

    const photo = image.current;
    const tickEls = ticks.current;
    const picture = photo?.querySelector('img') ?? null;
    const trigger = ScrollTrigger.create({
      trigger: root.current,
      start: 'top top',
      end: () => `+=${Math.round(window.innerHeight * scroll.pinLength)}`,
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
        ticks.current.forEach((tick, i) => {
          if (tick) tick.style.transform = `scaleX(${Math.min(1, Math.max(0, p * count - i))})`;
        });
        target = p;
        if (photo) photo.style.clipPath = `inset(${((1 - Math.min(1, p * 2.2)) * 42).toFixed(1)}% 0 0 0)`;
        if (picture) picture.style.transform = `scale(${(1.12 - 0.12 * p).toFixed(3)})`;
      },
    });

    return () => {
      gsap.ticker.remove(follow);
      trigger.kill();
      setActive(0);
      if (photo) photo.style.clipPath = '';
      if (picture) picture.style.transform = '';
      tickEls.forEach((tick) => {
        if (tick) tick.style.transform = '';
      });
      grown.render(1);
    };
  }, [animated]);

  return (
    <section id="somos" ref={root} className={`section section--alt history ${animated ? 'is-pinned' : 'is-static'}`}>
      <div ref={pin} className="history__pin">
        <svg
          ref={svg}
          className="history__tree"
          viewBox="0 0 400 700"
          preserveAspectRatio="xMidYMax meet"
          aria-hidden="true"
        />

        <div className="container history__grid">
          <div className="history__copy">
            <SectionLabel title="SOMOS" />

            <AnimatedText
              as="h2"
              className="history__title"
              text="5 ANOS DE UMA HISTÓRIA ESCRITA POR DEUS"
              accentWords={['5', 'DEUS']}
            />

            <div className="history__stack">
              {milestones.map((m, i) => (
                <article key={m.id} className={`history__ms ${!animated || i === active ? 'is-on' : ''}`}>
                  <div className="history__big">{m.big}</div>
                  <h3 className="history__ms-title">{m.title}</h3>
                  <p className="history__ms-text">{m.text}</p>
                </article>
              ))}
            </div>

            <div className="history__ticks" aria-hidden="true">
              {milestones.map((m, i) => (
                <i key={m.id}>
                  <b
                    ref={(el) => {
                      ticks.current[i] = el;
                    }}
                  />
                </i>
              ))}
            </div>

            <a href="#programacao" className="history__cta link-underline">
              Venha Nos Visitar →
            </a>
          </div>

          <div className="history__media">
            <div ref={image} className="history__img">
              <img src={churchBuilding} alt="Fachada da Igreja Família" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
