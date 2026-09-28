import { useSyncExternalStore } from 'react';

/**
 * NEXUS master cinematic state machine.
 * One explicit store — no scattered booleans.
 */

export type NexusPhase =
  | 'BOOT'
  | 'DORMANT'
  | 'BRAIN_REVEAL'
  | 'CORE_ACTIVE'
  | 'ENERGY_CONNECTING'
  | 'MODULE_AWAKENING'
  | 'SYSTEM_ONLINE'
  | 'PORTFOLIO_REVEAL'
  | 'PROJECT_FOCUS'
  | 'PROJECT_PREVIEW';

export type Quality = 'LOW' | 'MEDIUM' | 'HIGH';

/** Theme choice: explicit dark/light, or follow the OS automatically. */
export type ThemeChoice = 'dark' | 'light' | 'system';
export type ResolvedTheme = 'dark' | 'light';

export interface NexusState {
  phase: NexusPhase;
  booted: boolean;
  focusedProject: string | null;
  previewProject: string | null;
  hoveredProject: string | null;
  quality: Quality;
  reducedMotion: boolean;
  webgl: boolean;
  isMobile: boolean;
  onlineCount: number;
  theme: ThemeChoice;
  resolved: ResolvedTheme;
}

/** High-frequency mutable values — read inside useFrame / rAF, never subscribed. */
export const live = {
  progress: 0, // cinematic scroll 0..1
  activation: 0, // brain activation 0..1
  energy: 0, // energy flow 0..1
  online: 0, // modules online 0..4 (float, staggered per module)
  dim: 0, // focus dim target 0..1 (damped on read side)
  orbit: Math.PI / 4, // orbit group rotation.y (written by ProjectOrbit)
  lightMix: 0, // 0 = dark theme, 1 = light theme (damped for smooth transitions)
};

const initialState: NexusState = {
  phase: 'BOOT',
  booted: false,
  focusedProject: null,
  previewProject: null,
  hoveredProject: null,
  quality: 'HIGH',
  reducedMotion: false,
  webgl: true,
  isMobile: false,
  onlineCount: 0,
  theme: 'system',
  resolved: 'dark',
};

let state: NexusState = initialState;
const listeners = new Set<() => void>();

export function getNexusState(): NexusState {
  return state;
}

function emit(): void {
  listeners.forEach((l) => l());
}

export function subscribeNexus(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function useNexusState(): NexusState {
  return useSyncExternalStore(subscribeNexus, getNexusState, getNexusState);
}

function patch(p: Partial<NexusState>): void {
  state = { ...state, ...p };
  emit();
}

/* ---------------- explicit transitions ---------------- */

/** Scroll-driven phases may move freely both directions (reversible scroll). */
const SCROLL_PHASES: NexusPhase[] = [
  'DORMANT',
  'BRAIN_REVEAL',
  'CORE_ACTIVE',
  'ENERGY_CONNECTING',
  'MODULE_AWAKENING',
  'SYSTEM_ONLINE',
  'PORTFOLIO_REVEAL',
];

export function setPhase(next: NexusPhase): void {
  const cur = state.phase;
  if (cur === next) return;
  if (cur === 'BOOT' && next !== 'DORMANT') return; // boot must settle first
  if (next === 'BOOT') return; // never return to boot
  // Focus / preview are overlays — they never destroy the scroll phase.
  if (cur === 'PROJECT_FOCUS' || cur === 'PROJECT_PREVIEW') {
    if (!SCROLL_PHASES.includes(next) && next !== 'PROJECT_FOCUS' && next !== 'PROJECT_PREVIEW') return;
  }
  patch({ phase: next });
}

export function phaseForProgress(p: number): NexusPhase {
  if (p < 0.06) return 'DORMANT';
  if (p < 0.18) return 'BRAIN_REVEAL';
  if (p < 0.32) return 'CORE_ACTIVE';
  if (p < 0.5) return 'ENERGY_CONNECTING';
  if (p < 0.68) return 'MODULE_AWAKENING';
  if (p < 0.86) return 'SYSTEM_ONLINE';
  return 'PORTFOLIO_REVEAL';
}

/* ---------------- actions ---------------- */

export function setBooted(): void {
  patch({ booted: true });
  setPhase('DORMANT');
}

export function setHoveredProject(id: string | null): void {
  if (state.hoveredProject !== id) patch({ hoveredProject: id });
}

export function focusProject(id: string): void {
  patch({ focusedProject: id, hoveredProject: null });
  setPhase('PROJECT_FOCUS');
}

export function openPreview(id: string): void {
  patch({ previewProject: id, focusedProject: id });
  setPhase('PROJECT_PREVIEW');
}

export function closePreview(): void {
  const fallback = phaseForProgress(live.progress);
  patch({ previewProject: null, focusedProject: null });
  setPhase(fallback);
}

export function setOnlineCount(n: number): void {
  if (state.onlineCount !== n) patch({ onlineCount: n });
}

export function setQuality(q: Quality): void {
  if (state.quality !== q) patch({ quality: q });
}

export function setTheme(t: ThemeChoice): void {
  if (state.theme !== t) patch({ theme: t });
}

export function setResolved(r: ResolvedTheme): void {
  if (state.resolved !== r) patch({ resolved: r });
}

export function initEnvironment(env: {
  webgl: boolean;
  isMobile: boolean;
  reducedMotion: boolean;
  quality: Quality;
}): void {
  patch(env);
}

/** Human-readable status for HUD / hero. */
export function statusForPhase(phase: NexusPhase, online: number): string {
  switch (phase) {
    case 'BOOT':
      return 'BOOTING AI CORE…';
    case 'DORMANT':
      return 'SYSTEM DORMANT — AWAITING ACTIVATION';
    case 'BRAIN_REVEAL':
      return 'NEURAL SYSTEM EMERGING';
    case 'CORE_ACTIVE':
      return 'AI CORE ACTIVE';
    case 'ENERGY_CONNECTING':
      return 'ENERGY ROUTING TO MODULES';
    case 'MODULE_AWAKENING':
      return `MODULES AWAKENING — ${online}/4 ONLINE`;
    case 'SYSTEM_ONLINE':
      return 'ALL MODULES ONLINE';
    case 'PORTFOLIO_REVEAL':
      return 'PORTFOLIO REVEALED';
    case 'PROJECT_FOCUS':
      return 'MODULE FOCUS';
    case 'PROJECT_PREVIEW':
      return 'PROJECT PREVIEW';
  }
}
