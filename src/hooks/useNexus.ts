import { useEffect, useState } from 'react';
import { useNexusState } from '../state/store';

/** Re-export for convenient imports. */
export { useNexusState };

/** True on touch-first devices (no hover / custom cursor). */
export function useIsTouch(): boolean {
  const [touch] = useState<boolean>(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches,
  );
  return touch;
}

/** Tracks window.scrollY with a single rAF-throttled listener. */
export function useScrolled(threshold = 40): boolean {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let raf = 0;
    const onScroll = (): void => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > threshold));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [threshold]);
  return scrolled;
}
