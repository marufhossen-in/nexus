import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import type { ReactElement } from 'react';
import { PROJECTS } from '../../data/projects';
import { setBooted, useNexusState } from '../../state/store';

/** Premium boot screen tied to REAL asset readiness (screenshot preload). */
export function LoadingScreen(): ReactElement | null {
  const { booted } = useNexusState();
  const root = useRef<HTMLDivElement>(null!);
  const bar = useRef<HTMLElement>(null!);
  const pct = useRef<HTMLSpanElement>(null!);
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;
    const t0 = performance.now();
    let loaded = 0;
    const total = PROJECTS.length;
    const paint = (): void => {
      const p = Math.round((loaded / total) * 100);
      if (bar.current) bar.current.style.width = `${p}%`;
      if (pct.current) pct.current.textContent = `${p}%`;
    };
    const finish = (): void => {
      const wait = Math.max(0, 1400 - (performance.now() - t0));
      window.setTimeout(() => {
        gsap.to(root.current, {
          opacity: 0,
          duration: 0.7,
          ease: 'power2.inOut',
          onComplete: () => setBooted(),
        });
      }, wait);
    };
    paint();
    PROJECTS.forEach((p) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        loaded += 1;
        paint();
        if (loaded >= total) finish();
      };
      img.src = p.screenshot;
    });
  }, []);

  if (booted) return null;

  return (
    <div ref={root} className="nx-loader" role="status" aria-label="Loading NEXUS">
      <h1>NEXUS</h1>
      <p>BOOTING AI CORE…</p>
      <div className="nx-loadbar">
        <i ref={bar} />
      </div>
      <span ref={pct} className="nx-loadpct">0%</span>
      <p style={{ letterSpacing: '0.2em', fontSize: 10 }}>NEURAL SYSTEM // PROJECT MODULES</p>
    </div>
  );
}
