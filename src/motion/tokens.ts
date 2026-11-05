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

// Scroll-driven motion (Lenis + GSAP ScrollTrigger)
export const scroll = {
  /** Lenis smoothing: lower is smoother/slower. */
  lerp: 0.1,
  /** Seconds ScrollTrigger lags behind the scrollbar when scrubbing. */
  scrub: 0.5,
  /** Viewport heights of scrolling consumed by a pinned story section. */
  pinLength: 3.4,
} as const;

/** Viewport widths below which pinned scroll stories fall back to a static layout. */
export const PIN_MIN_WIDTH = 901;
