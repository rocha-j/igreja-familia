import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { distance, stagger, transition } from '../../motion/tokens';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'span';
}

export function Reveal({ children, delay = 0, y = distance.lg, className, as = 'div' }: RevealProps) {
  const animation = {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: false, amount: 0.3 },
    transition: { ...transition.base, delay },
  } as const;

  if (as === 'span') {
    return (
      <motion.span className={className} {...animation}>
        {children}
      </motion.span>
    );
  }

  return (
    <motion.div className={className} {...animation}>
      {children}
    </motion.div>
  );
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerGroup({ children, className, staggerDelay = stagger.base }: StaggerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className, y = distance.md }: RevealProps) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        visible: { opacity: 1, y: 0, transition: transition.base },
      }}
    >
      {children}
    </motion.div>
  );
}
