import { motion } from 'framer-motion';
import { AnimatedText } from '../AnimatedText/AnimatedText';
import './HeroSection.css';

export function HeroSection() {
  return (
    <section id="hero" className="hero">
      <div className="hero__bg" />
      <div className="hero__overlay" />

      <div className="container hero__content">
        <AnimatedText
          as="h1"
          className="hero__title"
          text="JUNTOS TRANSFORMANDO VIDAS"
          accentWords={['TRANSFORMANDO']}
          delay={0.3}
        />

        <motion.p
          className="hero__text"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          Somos uma família que ama a Deus, ama pessoas e transforma o mundo.
        </motion.p>

        <motion.div
          className="hero__actions"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
        >
          <a href="#onde-estamos" className="btn btn-primary">
            Nos Visite
          </a>
          <a href="#somos" className="btn btn-secondary">
            Saiba Mais
          </a>
        </motion.div>
      </div>

      <motion.a
        href="#somos"
        className="hero__scroll-indicator"
        aria-label="Role para baixo e descubra"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 1.3 }}
      >
        <span className="hero__scroll-circle">
          <span className="hero__scroll-dot" />
        </span>
        <span className="hero__scroll-label">Role para baixo e descubra</span>
      </motion.a>
    </section>
  );
}
