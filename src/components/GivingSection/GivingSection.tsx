import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, useRef } from 'react';
import { givingChannels } from '../../data/giving';
import { useMediaQuery } from '../../motion/useMediaQuery';
import { AnimatedText } from '../AnimatedText/AnimatedText';
import { NavAnchor } from '../NavAnchor/NavAnchor';
import { Reveal } from '../Reveal/Reveal';
import { SectionLabel } from '../SectionLabel/SectionLabel';
import './GivingSection.css';

gsap.registerPlugin(ScrollTrigger);

// The verse and its reference come from the giving data, so the home page and
// the donations page always quote the same text.
const verseChannel = givingChannels.find((channel) => channel.id === 'dizimos-ofertas');

/**
 * "Contribua": a short invitation (a verse and one button) that leads to the
 * donations page. A thin stem with leaves grows as the section scrolls in.
 */
export function GivingSection() {
  const root = useRef<HTMLElement>(null);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');

  useLayoutEffect(() => {
    if (reduced || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.to('.giving__stem-line', {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top 75%', end: 'center 40%', scrub: true },
      });
      gsap.from('.giving__leaf', {
        opacity: 0,
        scale: 0.4,
        transformOrigin: '50% 100%',
        stagger: 0.25,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top 60%', end: 'center 35%', scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  if (!verseChannel) return null;

  return (
    <section id="contribua" ref={root} className="section section--alt giving">
      <svg className="giving__stem" viewBox="0 0 200 320" fill="none" aria-hidden="true">
        <path className="giving__stem-line" pathLength={1} d="M100 320 C 96 250, 108 200, 100 150 S 92 70, 100 30" />
        <path className="giving__leaf" d="M99 210 C 60 200, 40 170, 38 140 C 72 142, 96 168, 99 210Z" />
        <path className="giving__leaf" d="M102 150 C 140 144, 162 114, 164 84 C 130 86, 106 112, 102 150Z" />
        <path className="giving__leaf" d="M99 92 C 72 86, 58 66, 58 46 C 82 48, 97 66, 99 92Z" />
      </svg>

      <div className="container giving__in">
        <SectionLabel title="CONTRIBUA" />

        <AnimatedText as="h2" className="giving__title" text="SEMEIE COM ALEGRIA" accentWords={['ALEGRIA']} />

        <Reveal delay={0.15}>
          <blockquote className="giving__verse">
            <p>“{verseChannel.description}”</p>
            <cite>{verseChannel.eyebrow}</cite>
          </blockquote>
        </Reveal>

        <Reveal delay={0.25}>
          <NavAnchor href="/doacoes" className="btn btn-primary">
            Quero doar →
          </NavAnchor>
        </Reveal>
      </div>
    </section>
  );
}
