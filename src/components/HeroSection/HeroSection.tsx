import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { lazy, Suspense, useLayoutEffect, useRef } from 'react';
import heroChurch from '../../assets/heroChurch.jpg';
import { distance, transition } from '../../motion/tokens';
import { useMediaQuery } from '../../motion/useMediaQuery';
import { useHeroSceneEnabled } from '../../scenes/HeroScene/useHeroSceneEnabled';
import { AnimatedText } from '../AnimatedText/AnimatedText';
import './HeroSection.css';

gsap.registerPlugin(ScrollTrigger);

// Three.js is only fetched when the WebGL Hero is actually going to run.
const HeroScene = lazy(() => import('../../scenes/HeroScene/HeroScene'));

export function HeroSection() {
  const root = useRef<HTMLElement>(null);
  const sceneEnabled = useHeroSceneEnabled();
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');

  // Scrolling past the Hero lifts its text away, as if walking in through the door.
  useLayoutEffect(() => {
    if (reduced || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.to('.hero__inner', {
        yPercent: -14,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom 25%', scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="hero" ref={root} className="hero">
      <div className="hero__bg" />
      {sceneEnabled && (
        <Suspense fallback={null}>
          <HeroScene src={heroChurch} />
        </Suspense>
      )}
      <div className="hero__overlay" />

      <div className="container hero__content">
        <div className="hero__inner">
          <AnimatedText
            as="h1"
            className="hero__title"
            text="UM LUGAR PRA CHAMAR DE LAR"
            accentWords={['LAR']}
            delay={0.2}
          />

          <motion.p
            className="hero__text"
            initial={{ opacity: 0, y: distance.sm }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition.base, delay: 0.6 }}
          >
            Nossas portas estão sempre abertas. Venha conhecer a Igreja Família e fazer parte dessa
            história.
          </motion.p>

          <motion.div
            className="hero__actions"
            initial={{ opacity: 0, y: distance.sm }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition.base, delay: 0.75 }}
          >
            <a href="#onde-estamos" className="btn btn-primary">
              Como Chegar
            </a>
            <a href="#somos" className="btn btn-secondary">
              Conheça Nossa História
            </a>
          </motion.div>
        </div>
      </div>

      <motion.a
        href="#somos"
        className="hero__scroll-indicator"
        aria-label="Role para baixo e descubra"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
      >
        <span className="hero__scroll-circle">
          <span className="hero__scroll-dot" />
        </span>
        <span className="hero__scroll-label">Role para baixo e descubra</span>
      </motion.a>
    </section>
  );
}
