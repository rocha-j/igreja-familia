export const DESKTOP_FLAG = 'prefer-desktop-site';

/** Phones (small + touch) are sent to the horizontal mobile experience once per tab. */
export function shouldUseMobileExperience(): boolean {
  try {
    if (sessionStorage.getItem(DESKTOP_FLAG)) return false;
  } catch {
    /* storage blocked: fall through */
  }
  return matchMedia('(max-width: 640px) and (pointer: coarse)').matches;
}
