import { useEffect, useRef } from 'react';
import type { ReactElement } from 'react';
import { PROJECTS } from './data/projects';
import { PORTFOLIO } from './data/portfolio';
import {
  focusProject,
  initEnvironment,
  live,
  openPreview,
  phaseForProgress,
  setOnlineCount,
  setPhase,
  setResolved,
  setTheme,
  statusForPhase,
  useNexusState,
} from './state/store';
import type { Quality, ThemeChoice } from './state/store';
import { clamp01, detectWebGL, smoothstep } from './utils/three';
import { NexusScene } from './components/Nexus/NexusScene';
import { LoadingScreen } from './components/UI/LoadingScreen';
import { CustomCursor, Tooltip } from './components/UI/Cursor';
import { Hud } from './components/UI/Hud';
import { Navigation } from './components/Navigation/Navigation';
import { ProjectPreview } from './components/Project/ProjectPreview';
import { Sections } from './components/Sections/Sections';

/** Beautiful fallback when WebGL is unavailable — all links stay functional. */
function Fallback(): ReactElement {
  return (
    <div className="nx-fallback">
      <p className="nx-eyebrow">NEXUS // DIGITAL PRODUCT ENGINEERING</p>
      <h1>NEXUS</h1>
      <p className="nx-role">{PORTFOLIO.role}</p>
      <p className="nx-prose" style={{ textAlign: 'center' }}>
        Your device could not initialize WebGL, so the immersive interface is bypassed. Every selected build below remains fully accessible.
      </p>
      <div className="nx-grid" style={{ maxWidth: 1080, width: '100%' }}>
        {PROJECTS.map((p) => (
          <article key={p.id} className="nx-card">
            <div className="nx-shot">
              <img src={p.screenshot} alt={`${p.title} screenshot`} />
              <span className="nx-shot-id">{p.id}</span>
            </div>
            <div className="nx-card-body">
              <span className="nx-industry">{p.industry}</span>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <a className="nx-live" href={p.url} target="_blank" rel="noreferrer">
                OPEN LIVE PROJECT ↗
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function App(): ReactElement {
  const { booted, webgl, previewProject, focusedProject, onlineCount, phase, theme, resolved } =
    useNexusState();
  const spacer = useRef<HTMLDivElement>(null!);
  const hero = useRef<HTMLDivElement>(null!);
  const hint = useRef<HTMLDivElement>(null!);

  /* environment detection (once) */
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 760px)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const gl = detectWebGL();
    let quality: Quality = isMobile ? 'MEDIUM' : 'HIGH';
    const nav = navigator as Navigator & { deviceMemory?: number };
    if ((navigator.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4) {
      quality = quality === 'HIGH' ? 'MEDIUM' : 'LOW';
    }
    initEnvironment({ webgl: gl, isMobile, reducedMotion, quality });
  }, []);

  /* theme choice: persisted, defaults to system */
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem('nexus-theme');
    } catch {
      saved = null;
    }
    const choice: ThemeChoice =
      saved === 'dark' || saved === 'light' || saved === 'system' ? saved : 'system';
    setTheme(choice);
  }, []);

  /* resolve system → dark/light, live-follow OS changes in system mode */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const apply = (): void => {
      setResolved(theme === 'system' ? (mq.matches ? 'light' : 'dark') : theme);
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [theme]);

  /* publish theme to DOM + persist choice */
  useEffect(() => {
    document.documentElement.dataset.theme = resolved;
    try {
      localStorage.setItem('nexus-theme', theme);
    } catch {
      /* private mode — ignore */
    }
  }, [resolved, theme]);

  /* ONE central scroll orchestrator → live values + state machine */
  useEffect(() => {
    if (!webgl) return;
    let raf = 0;
    const update = (): void => {
      raf = 0;
      const el = spacer.current;
      if (!el) return;
      const total = Math.max(1, el.offsetHeight - window.innerHeight);
      const p = clamp01(window.scrollY / total);
      live.progress = p;
      live.activation = smoothstep(0.04, 0.32, p);
      live.energy = smoothstep(0.3, 0.56, p);
      live.online = clamp01((p - 0.45) / 0.3) * 4;
      setOnlineCount(Math.round(live.online));
      const st = phaseForProgress(p);
      // focus/preview overlay the scroll phase without destroying it
      if (!focusedProject && !previewProject) setPhase(st);
      // cinematic overlay fades (direct DOM — no re-renders at scroll rate)
      if (hero.current) {
        const o = 1 - smoothstep(0.02, 0.3, p);
        hero.current.style.opacity = String(o);
        hero.current.style.transform = `translateY(${-p * 160}px)`;
        hero.current.style.visibility = o <= 0.01 ? 'hidden' : 'visible';
      }
      if (hint.current) {
        const ho = 1 - smoothstep(0.0, 0.1, p);
        hint.current.style.opacity = String(ho);
        hint.current.style.visibility = ho <= 0.01 ? 'hidden' : 'visible';
      }
    };
    const onScroll = (): void => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [webgl, focusedProject, previewProject]);

  /* focus → preview sequencing (camera travels first, panel follows) */
  const focusedSnap = focusedProject;
  useEffect(() => {
    if (!focusedSnap || previewProject) return;
    const t = window.setTimeout(() => openPreview(focusedSnap), 750);
    return () => window.clearTimeout(t);
  }, [focusedSnap, previewProject]);

  if (!webgl) {
    return (
      <div id="core">
        <Navigation />
        <Fallback />
      </div>
    );
  }

  const dimmed = focusedProject !== null || previewProject !== null;

  return (
    <div id="core">
      <LoadingScreen />
      <div className={`nx-canvas-wrap${dimmed ? ' dimmed' : ''}`}>
        {booted && <NexusScene />}
      </div>
      <Navigation />
      <Hud />
      <CustomCursor />
      <Tooltip />

      {/* cinematic scroll zone */}
      <div ref={spacer} className="nx-cinematic">
        <div className="nx-hero-sticky">
          <div ref={hero}>
            <p className="nx-eyebrow">NEXUS // DIGITAL PRODUCT ENGINEERING</p>
            <h1 className="nx-title">NEXUS</h1>
            <p className="nx-role">{PORTFOLIO.role}</p>
            <div className="nx-status-line" style={{ justifyContent: 'center' }}>
              <span className={`nx-dot${onlineCount >= 4 ? '' : ' amber'}`} />
              {statusForPhase(phase, onlineCount)}
            </div>
          </div>
          {booted && onlineCount >= 4 && !previewProject && (
            <div className="nx-module-nav">
              {PROJECTS.map((p) => (
                <button key={p.id} className="nx-module-btn" onClick={() => focusProject(p.id)}>
                  <small>{p.id}</small>
                  {p.industry.toUpperCase()}
                </button>
              ))}
            </div>
          )}
          <div ref={hint} className="nx-scroll-hint">
            SCROLL TO ACTIVATE
          </div>
        </div>
      </div>

      <Sections />
      <ProjectPreview />
    </div>
  );
}
