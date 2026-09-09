import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import './ParallaxImage.css';

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  strength?: number;
}

export function ParallaxImage({ src, alt, className, strength = 40 }: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-strength, strength]);

  return (
    <div className={`parallax-image ${className ?? ''}`} ref={ref}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ y }}
        initial={{ scale: 1.08, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}
