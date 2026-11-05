import { createContext, useContext } from 'react';

export interface ScrollApi {
  /** Scroll to a Y offset or element, smoothly when Lenis is active. */
  scrollTo: (target: number | HTMLElement) => void;
}

export const ScrollContext = createContext<ScrollApi>({
  scrollTo: (target) => {
    if (typeof target === 'number') window.scrollTo({ top: target });
    else target.scrollIntoView();
  },
});

export function useScroll() {
  return useContext(ScrollContext);
}
