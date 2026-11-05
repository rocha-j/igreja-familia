import { useSyncExternalStore } from 'react';

/** Subscribes to a CSS media query. Returns false on the server. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (notify) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', notify);
      return () => mql.removeEventListener('change', notify);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** True when pinned scroll stories should run: a wide screen and no reduced-motion preference. */
export function useScrollStories(minWidth: number): boolean {
  const wide = useMediaQuery(`(min-width: ${minWidth}px)`);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  return wide && !reduced;
}
