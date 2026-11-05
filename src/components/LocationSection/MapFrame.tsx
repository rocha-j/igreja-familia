import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, useRef, useState } from 'react';
import { useMediaQuery } from '../../motion/useMediaQuery';
import './MapFrame.css';

gsap.registerPlugin(ScrollTrigger);

interface MapFrameProps {
  title: string;
  src: string;
}

/**
 * The map opens from a rounded cut-out as it scrolls into view: the frame
 * widens, the map settles from a slight zoom, a warm tint fades away and three
 * rings pulse on the church's spot. The map only reacts to touch/scroll after
 * a click, so it never traps the page's own scrolling.
 */
export function MapFrame({ title, src }: MapFrameProps) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [pinging, setPinging] = useState(false);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');

  useLayoutEffect(() => {
    if (reduced || !root.current) return;
    const ctx = gsap.context(() => {
      const trigger = { trigger: root.current, scrub: true } as const;
      gsap.fromTo(
        root.current,
        { clipPath: 'inset(16% 10% round 32px)' },
        { clipPath: 'inset(0% 0% round 12px)', ease: 'none', scrollTrigger: { ...trigger, start: 'top 92%', end: 'top 35%' } },
      );
      gsap.fromTo(
        '.map-frame__iframe',
        { scale: 1.22 },
        { scale: 1, ease: 'none', scrollTrigger: { ...trigger, start: 'top 92%', end: 'center 55%' } },
      );
      gsap.fromTo(
        '.map-frame__tint',
        { opacity: 1 },
        { opacity: 0, ease: 'none', scrollTrigger: { ...trigger, start: 'top 60%', end: 'center 45%' } },
      );
      ScrollTrigger.create({ trigger: root.current, start: 'top 65%', once: true, onEnter: () => setPinging(true) });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div
      ref={root}
      className={`map-frame ${active ? 'is-active' : ''} ${pinging ? 'is-pinging' : ''}`}
      onMouseLeave={() => setActive(false)}
    >
      <iframe
        className="map-frame__iframe"
        title={title}
        src={src}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
      <div className="map-frame__tint" aria-hidden="true" />
      <div className="map-frame__ping" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <button type="button" className="map-frame__shield" onClick={() => setActive(true)}>
        Toque para explorar o mapa
      </button>
    </div>
  );
}
