# NEXUS — Extreme Cinematic 3D Portfolio Experience

> A 3D AI operating system that reveals a developer's portfolio.

A visitor enters a dark digital universe, witnesses an AI brain activate,
watches electric energy travel to four industry modules (AI & SaaS, Healthcare,
Logistics, Real Estate), then scrolls into the full portfolio. Every module opens
a preview with the **real project screenshot** and a live-project link.

## Run

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

## Stack

- React 19 + TypeScript + Vite
- Three.js + React Three Fiber + Drei
- GSAP + ScrollTrigger (scroll timeline, UI reveals, modal transitions)
- @react-three/postprocessing (selective bloom + vignette)

## How it works

- **State machine** (`src/state/store.ts`): `BOOT → DORMANT → BRAIN_REVEAL →
  CORE_ACTIVE → ENERGY_CONNECTING → MODULE_AWAKENING → SYSTEM_ONLINE →
  PORTFOLIO_REVEAL`, with `PROJECT_FOCUS` / `PROJECT_PREVIEW` overlays.
  One store, no scattered booleans.
- **Scroll orchestration** (`src/App.tsx`): a single rAF-throttled listener drives
  `live` values (progress / activation / energy / online) consumed in `useFrame`.
  Fully reversible — scrolling up deactivates the system smoothly.
- **Camera** (`NexusScene → CameraRig`): one damped controller interpolating
  between 7 keyframed poses + per-module focus poses. Never teleports.
- **Modules** (`ProjectNode`): layered hardware terminals with emissive strips,
  LEDs, industry identity motifs (neural / ECG / route / architecture), canvas
  ID labels, and tone-mapped-off screenshot planes for maximum sharpness.
- **Energy** (`EnergyPath`): exactly four circuit-like shader tubes with
  directional flow, traveling pulses and activation heads.
- **Performance**: LOW/MEDIUM/HIGH quality tiers, adaptive DPR, draw-range
  scaling, FPS auto-step-down, zero shadow maps, capped pixel ratio.
- **Fallbacks**: elegant no-WebGL portfolio, `prefers-reduced-motion` support,
  keyboard access (Tab / Enter / Esc), responsive mobile layout.

## Themes — Dark / Light / System

The nav-bar toggle (monitor / moon / sun) switches between three modes:

- **System** (default) — follows the OS automatically via
  `prefers-color-scheme`, live-updating if the OS theme changes.
- **Dark** — the signature infinite digital universe.
- **Light** — a bright command center: light environment, silver hardware,
  deep-blue energy.

The choice persists in `localStorage`. The 3D scene crossfades smoothly
(`live.lightMix` drives every material), and all UI re-themes through CSS
variables in `src/theme.css`.

## Add a project (P-05…)

1. Append an entry in `src/data/projects.ts` (id, title, industry, url,
   screenshot, angle, colors, visual identity).
2. Drop the screenshot in `public/assets/projects/`.
3. The orbit, energy paths, nav, cards and previews pick it up automatically.

## Edit identity / contact

`src/data/portfolio.ts` — name, role, about, approach, journey, contact links.
No portfolio facts are invented; everything here is placeholder-editable.

## Screenshots

Real captures of the four live deployments (3200×1800) live in
`public/assets/projects/`. To re-capture, use any headless browser at
1600×900 @2x against the URLs in `src/data/projects.ts`.
