import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import type { ReactElement } from 'react';
import { projectById } from '../../data/projects';
import { useNexusState } from '../../state/store';
import { useIsTouch } from '../../hooks/useNexus';

/** Desktop custom cursor: dot + ring, VIEW state on module hover. */
export function CustomCursor(): ReactElement | null {
  const touch = useIsTouch();
  const { hoveredProject, previewProject } = useNexusState();
  const dot = useRef<HTMLDivElement>(null!);
  const ring = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    if (touch) return;
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.08 });
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.08 });
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.32, ease: 'power3' });
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.32, ease: 'power3' });
    const move = (e: MouseEvent): void => {
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, [touch]);

  if (touch || previewProject) return null;
  const view = hoveredProject !== null;

  return (
    <>
      <div ref={dot} className="nx-cursor-dot" />
      <div ref={ring} className={`nx-cursor-ring${view ? ' view' : ''}`}>
        <em>{view ? 'VIEW' : ''}</em>
      </div>
    </>
  );
}

/** Module tooltip following the cursor (desktop only). */
export function Tooltip(): ReactElement | null {
  const touch = useIsTouch();
  const { hoveredProject, onlineCount } = useNexusState();
  const box = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    if (touch) return;
    const move = (e: MouseEvent): void => {
      if (!box.current) return;
      box.current.style.transform = `translate(${e.clientX + 22}px, ${e.clientY + 18}px)`;
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, [touch]);

  const p = projectById(hoveredProject);
  if (touch || !p) return null;
  const online = onlineCount >= 4;

  return (
    <div ref={box} className="nx-tooltip" style={{ top: 0, left: 0 }}>
      <b>{p.id}</b> — {p.industry.toUpperCase()}
      <br />
      {p.title} · {p.tagline}
      <br />
      STATUS: <span className="go">{online ? '● ONLINE' : '○ AWAKENING'}</span>
      <br />
      <span className="go">VIEW PROJECT →</span>
    </div>
  );
}
