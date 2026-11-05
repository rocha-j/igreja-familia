import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { useCallback, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollContext, type ScrollApi } from './scrollContext';
import { scroll } from './tokens';
import { useMediaQuery } from './useMediaQuery';

gsap.registerPlugin(ScrollTrigger);

/** A pinned section sits inside a spacer; its anchor target is the spacer's top. */
function targetTop(el: HTMLElement): number {
  const host = el.parentElement?.classList.contains('pin-spacer') ? el.parentElement : el;
  return host.getBoundingClientRect().top + window.scrollY;
}

/**
 * Smooth scrolling (Lenis) driving GSAP ScrollTrigger. With reduced motion the
 * page keeps the browser's native scrolling and the stories fall back to
 * static layouts, so nothing here runs.
 */
export function ScrollProvider({ children }: { children: ReactNode }) {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const lenisRef = useRef<Lenis | null>(null);
  const { pathname } = useLocation();

  // /m owns its scrolling (snap-driven pages + horizontal card tracks): Lenis would
  // hijack the wheel on the document and keep it from reaching those scrollers.
  const nativeScroll = pathname === '/m';

  useEffect(() => {
    if (reduced || nativeScroll) return;
    const instance = new Lenis({ lerp: scroll.lerp, smoothWheel: true });
    const tick = (time: number) => instance.raf(time * 1000);
    instance.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    lenisRef.current = instance;
    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      lenisRef.current = null;
    };
  }, [reduced, nativeScroll]);

  const scrollTo = useCallback((target: number | HTMLElement) => {
    const y = typeof target === 'number' ? target : targetTop(target);
    const active = lenisRef.current;
    if (active) active.scrollTo(y, { duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) });
    else window.scrollTo({ top: y });
  }, []);

  // In-page links ("#somos" or "/igreja-familia/#somos" on the same page) glide to their section.
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
      const anchor = (event.target as Element | null)?.closest?.('a[href]');
      if (!(anchor instanceof HTMLAnchorElement) || anchor.target === '_blank') return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return;
      const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!el) return;
      event.preventDefault();
      history.pushState(null, '', url.hash);
      scrollTo(el);
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [scrollTo]);

  // A new page changes every trigger position.
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  const api = useMemo<ScrollApi>(() => ({ scrollTo }), [scrollTo]);
  return <ScrollContext.Provider value={api}>{children}</ScrollContext.Provider>;
}
