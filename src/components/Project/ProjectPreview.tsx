import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import type { ReactElement } from 'react';
import { projectById } from '../../data/projects';
import { closePreview, useNexusState } from '../../state/store';

/**
 * Project preview — opens from the 3D module (scale/origin animation),
 * closes with a reversed timeline restoring the NEXUS system.
 */
export function ProjectPreview(): ReactElement | null {
  const { previewProject } = useNexusState();
  const back = useRef<HTMLDivElement>(null!);
  const panel = useRef<HTMLDivElement>(null!);
  const p = projectById(previewProject);

  useEffect(() => {
    if (!previewProject) return;
    document.body.classList.add('preview-open');
    gsap.fromTo(
      back.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.35, ease: 'power2.out' },
    );
    gsap.fromTo(
      panel.current,
      { opacity: 0, scale: 0.92, y: 34, transformOrigin: '50% 60%' },
      { opacity: 1, scale: 1, y: 0, duration: 0.65, ease: 'expo.out' },
    );
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('preview-open');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewProject]);

  const handleClose = (): void => {
    gsap.to(panel.current, {
      opacity: 0,
      scale: 0.94,
      y: 22,
      duration: 0.4,
      ease: 'power2.in',
    });
    gsap.to(back.current, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => closePreview(),
    });
  };

  if (!p) return null;

  return (
    <div
      ref={back}
      className="nx-preview-backdrop"
      onClick={(e) => {
        if (e.target === back.current) handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`${p.id} ${p.title} preview`}
    >
      <div ref={panel} className="nx-preview">
        <div className="nx-preview-top">
          <span>
            {p.id} // {p.industry.toUpperCase()} — ONLINE
          </span>
          <button onClick={handleClose} aria-label="Close preview">
            CLOSE ✕
          </button>
        </div>
        <div className="nx-preview-shot">
          <img src={p.screenshot} alt={`${p.title} — selected build screenshot`} />
        </div>
        <div className="nx-preview-body">
          <span className="nx-industry">{p.industry}</span>
          <h2>{p.title}</h2>
          <span className="nx-preview-tag">{p.tagline.toUpperCase()}</span>
          <p>{p.description}</p>
          <div className="nx-story" aria-label="Project story">
            {p.keywords.map((k, i) => (
              <span key={k} style={{ display: 'contents' }}>
                <span>{k}</span>
                {i < p.keywords.length - 1 && <i>→</i>}
              </span>
            ))}
          </div>
          <div className="nx-chips">
            {p.features.map((f) => (
              <span key={f} className="nx-chip">
                {f}
              </span>
            ))}
            {p.stack.map((s) => (
              <span key={s} className="nx-chip">
                {s}
              </span>
            ))}
          </div>
          <div className="nx-preview-actions">
            <a className="nx-btn-primary" href={p.url} target="_blank" rel="noreferrer">
              OPEN LIVE PROJECT ↗
            </a>
            <button className="nx-btn-ghost" onClick={handleClose}>
              RETURN TO CORE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
