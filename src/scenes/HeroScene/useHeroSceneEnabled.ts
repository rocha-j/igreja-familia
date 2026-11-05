import { useState } from 'react';
import { useMediaQuery } from '../../motion/useMediaQuery';

function webglAvailable(): boolean {
  try {
    const probe = document.createElement('canvas');
    if (!(probe.getContext('webgl') ?? probe.getContext('experimental-webgl'))) return false;
  } catch {
    return false;
  }
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  if (nav.connection?.saveData) return false;
  if (nav.deviceMemory !== undefined && nav.deviceMemory <= 2) return false;
  return true;
}

/**
 * The WebGL Hero only runs when it can do so comfortably: no reduced-motion
 * preference, a screen at least tablet wide, WebGL available, and no
 * data-saver / low-memory hint. Everywhere else the static photo stays.
 */
export function useHeroSceneEnabled(): boolean {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const wide = useMediaQuery('(min-width: 768px)');
  const [capable] = useState(webglAvailable);
  return capable && wide && !reduced;
}
