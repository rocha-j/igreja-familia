import { motion } from 'framer-motion';
import { AnimatedText } from '../AnimatedText/AnimatedText';
import { Reveal } from '../Reveal/Reveal';
import { SectionLabel } from '../SectionLabel/SectionLabel';
import './LocationSection.css';

export function LocationSection() {
  return (
    <section id="onde-estamos" className="section location">
      <div className="container location__grid">
        <div>
          <SectionLabel title="ONDE ESTAMOS" />
          <AnimatedText as="h2" className="location__title" text="ONDE ESTAMOS" />

          <Reveal delay={0.15}>
            <address className="location__address">
              Av. Wallace Simonsen, 414
              <br />
              Nova Petrópolis
              <br />
              São Bernardo do Campo - SP, 09771-210
            </address>
          </Reveal>

          <Reveal delay={0.25}>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Av.+Wallace+Simonsen%2C+414+-+Nova+Petr%C3%B3polis%2C+S%C3%A3o+Bernardo+do+Campo+-+SP%2C+09771-210"
              target="_blank"
              rel="noopener noreferrer"
              className="location__cta link-underline"
            >
              Ver no Mapa →
            </a>
          </Reveal>
        </div>

        <motion.div
          className="location__map"
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <iframe
            title="Mapa da Igreja Família — Av. Wallace Simonsen, 414, Nova Petrópolis, São Bernardo do Campo - SP"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3653.2527373491116!2d-46.54520709999999!3d-23.702666999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce422f55f16241%3A0x2d891678b09eee7a!2sAv.%20Wallace%20Simonsen%2C%20414%20-%20Nova%20Petr%C3%B3polis%2C%20S%C3%A3o%20Bernardo%20do%20Campo%20-%20SP%2C%2009771-210!5e0!3m2!1sen!2sbr!4v1788382267430!5m2!1sen!2sbr"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </motion.div>
      </div>
    </section>
  );
}
