import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface AnimatedTextProps {
  text: string;
  className?: string;
  accentWords?: string[];
  delay?: number;
  as?: 'h1' | 'h2' | 'h3';
}

function renderWord(word: string, isAccent: boolean, key: number) {
  return (
    <span key={key} style={{ display: 'inline-block', overflow: 'hidden', paddingBottom: '0.08em' }}>
      <motion.span
        style={{ display: 'inline-block', color: isAccent ? 'var(--accent)' : undefined }}
        variants={{
          hidden: { y: '110%' },
          visible: { y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
        }}
      >
        {word}&nbsp;
      </motion.span>
    </span>
  );
}

export function AnimatedText({ text, className, accentWords = [], delay = 0, as = 'h2' }: AnimatedTextProps) {
  const words = text.split(' ');

  const content: ReactNode = words.map((word, i) => {
    const bare = word.replace(/[.,!?]/g, '');
    const isAccent = accentWords.some((g) => g.toUpperCase() === bare.toUpperCase());
    return renderWord(word, isAccent, i);
  });

  const motionProps = {
    className,
    initial: 'hidden',
    whileInView: 'visible',
    viewport: { once: false, amount: 0.5 },
    transition: { staggerChildren: 0.06, delayChildren: delay },
  } as const;

  if (as === 'h1') return <motion.h1 {...motionProps}>{content}</motion.h1>;
  if (as === 'h3') return <motion.h3 {...motionProps}>{content}</motion.h3>;
  return <motion.h2 {...motionProps}>{content}</motion.h2>;
}
