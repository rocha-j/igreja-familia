// Motion tokens for JS animations (framer-motion).
// Keep in sync with the --ease-* / --duration-* / --dist-* / --stagger
// custom properties in src/styles/tokens.css.

export const ease = [0.16, 1, 0.3, 1] as const;

export const duration = {
  fast: 0.3,
  base: 0.6,
  slow: 0.9,
} as const;

// Vertical travel for entrances (px)
export const distance = {
  sm: 16,
  md: 24,
  lg: 28,
} as const;

export const stagger = {
  tight: 0.06,
  base: 0.08,
} as const;

export const transition = {
  fast: { duration: duration.fast, ease },
  base: { duration: duration.base, ease },
  slow: { duration: duration.slow, ease },
} as const;
