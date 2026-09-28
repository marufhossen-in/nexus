/**
 * WORK SECTION COPY — richer per-project content for the "WORK" showcase
 * (browser-mockup shots, hover-video previews, chips). Kept separate from
 * data/projects.ts, which still drives the 3D scene / orbit modules.
 */

export interface WorkItem {
  id: string;
  accent: 'saas' | 'health' | 'logistics' | 'estate';
  flip: boolean;
  industry: string;
  title: string;
  domain: string;
  url: string;
  urlLabel: string;
  main: string;
  alt: string;
  video: string;
  description: string;
  chips: string[];
  role: string;
  arch: { label: string; domain: boolean }[];
}

export const WORK: WorkItem[] = [
  {
    id: 'P-01',
    accent: 'saas',
    flip: false,
    industry: 'AI & SaaS',
    title: 'VectorPilot — AI cost observability',
    domain: 'Data & intelligence',
    url: 'https://merry-basbousa-3ed9d0.netlify.app/',
    urlLabel: 'merry-basbousa-3ed9d0.netlify.app',
    main: '/assets/final/p1-main.jpg',
    alt: '/assets/final/p1-alt.jpg',
    video: '/assets/videos/p1-preview.mp4',
    description:
      'A product experience for an AI cost-management platform, combining pricing structure, live usage analytics, and dense product information into a clear marketing and product-facing interface.',
    chips: ['Design system', 'Data UI', 'Pricing architecture', 'Responsive'],
    role: 'Frontend architecture & build',
    arch: [
      { label: 'Design system', domain: false },
      { label: 'Component core', domain: false },
      { label: 'Interaction layer', domain: false },
      { label: 'Data & intelligence', domain: true },
    ],
  },
  {
    id: 'P-02',
    accent: 'health',
    flip: true,
    industry: 'Healthcare',
    title: 'Medora — care that comes to you',
    domain: 'Clarity & trust',
    url: 'https://scintillating-heliotrope-c5de50.netlify.app/',
    urlLabel: 'scintillating-heliotrope-c5de50.netlify.app',
    main: '/assets/final/p2-main.jpg',
    alt: '/assets/final/p2-alt.jpg',
    video: '/assets/videos/p2-preview.mp4',
    description:
      'A trust-first healthcare experience built around clear information, provider discovery, and patient-facing states. The interface emphasizes calm hierarchy, accessibility, and clarity across the experience.',
    chips: ['Trust UI', 'Accessibility', 'Content architecture', 'Responsive'],
    role: 'Frontend architecture & build',
    arch: [
      { label: 'Design system', domain: false },
      { label: 'Component core', domain: false },
      { label: 'Interaction layer', domain: false },
      { label: 'Clarity & trust', domain: true },
    ],
  },
  {
    id: 'P-03',
    accent: 'logistics',
    flip: false,
    industry: 'Logistics',
    title: 'FleetAxis — operational intelligence',
    domain: 'Fleet & route ops',
    url: 'https://deft-crisp-2d7ac4.netlify.app/',
    urlLabel: 'deft-crisp-2d7ac4.netlify.app',
    main: '/assets/final/p3-main.jpg',
    alt: '/assets/final/p3-alt.jpg',
    video: '/assets/videos/p3-preview.mp4',
    description:
      'An operations-focused interface for fleet tracking, shipment status, and decision-making in data-dense environments. The layout is designed for fast scanning and clear action.',
    chips: ['Data density', 'Map UI', 'Status systems', 'Responsive'],
    role: 'Frontend architecture & build',
    arch: [
      { label: 'Design system', domain: false },
      { label: 'Component core', domain: false },
      { label: 'Interaction layer', domain: false },
      { label: 'Fleet & route ops', domain: true },
    ],
  },
  {
    id: 'P-04',
    accent: 'estate',
    flip: true,
    industry: 'Real Estate',
    title: 'Civela — precision property search',
    domain: 'Spatial search',
    url: 'https://bright-smakager-89a790.netlify.app/',
    urlLabel: 'bright-smakager-89a790.netlify.app',
    main: '/assets/final/p4-main.jpg',
    alt: '/assets/final/p4-alt.jpg',
    video: '/assets/videos/p4-preview.mp4',
    description:
      'A premium property-search experience combining editorial presentation, structured listings, and information-rich browsing. The goal is to make dense property data feel clear and usable.',
    chips: ['Editorial UI', 'Listing systems', 'Data visualization', 'Responsive'],
    role: 'Frontend architecture & build',
    arch: [
      { label: 'Design system', domain: false },
      { label: 'Component core', domain: false },
      { label: 'Interaction layer', domain: false },
      { label: 'Spatial search', domain: true },
    ],
  },
];

export const PRINCIPLES = [
  {
    id: 'P·1',
    title: 'Architecture before aesthetics',
    body: 'We define structure, hierarchy, states, and component relationships before layering visual treatment. This gives the interface a foundation that can support new features without becoming inconsistent.',
  },
  {
    id: 'P·2',
    title: 'One language, every screen',
    body: 'Typography, spacing, color, components, and interaction follow a coherent set of rules, so the product feels consistent from the first screen to the last.',
  },
  {
    id: 'P·3',
    title: 'Performance is a feature',
    body: 'We consider rendering cost, assets, responsiveness, and interaction performance during implementation — not after the interface is finished.',
  },
  {
    id: 'P·4',
    title: 'Motion with intent',
    body: 'Animation should improve understanding, feedback, and hierarchy. We use motion to clarify interaction and reinforce the experience, not to add noise.',
  },
];

export const CAPABILITIES = [
  {
    id: 'C·01',
    title: 'Frontend Architecture',
    body: 'We plan information structure, component boundaries, state behavior, and scalable implementation before visual polish — so the product has a foundation that can grow.',
    tags: ['SPA & MPA', 'State design', 'Scalability'],
  },
  {
    id: 'C·02',
    title: 'Design Systems',
    body: 'We build reusable foundations for typography, color, spacing, components, and motion, giving teams a consistent source of truth across the product.',
    tags: ['Design tokens', 'Component libraries', 'Documentation'],
  },
  {
    id: 'C·03',
    title: 'Interactive & 3D',
    body: 'We create interactive and WebGL experiences that are treated as part of the product — with considered motion, real-time visuals, and graceful fallbacks across devices.',
    tags: ['Three.js / WebGL', 'Shading', 'Camera systems'],
  },
  {
    id: 'C·04',
    title: 'Performance Engineering',
    body: 'We account for rendering cost, asset weight, loading behavior, and GPU usage throughout implementation. Performance is measured as part of delivery, not assumed.',
    tags: ['Core Web Vitals', 'Lazy loading', 'Render budgets'],
  },
  {
    id: 'C·05',
    title: 'Responsive & Accessible UI',
    body: 'We build semantic, keyboard-friendly interfaces with clear focus states and responsive behavior, including experiences that remain usable when animation or 3D is reduced or disabled.',
    tags: ['WCAG practice', 'Keyboard-first', '360px → 4K'],
  },
  {
    id: 'C·06',
    title: 'Motion & Micro-interaction',
    body: 'We use motion to explain interaction, hierarchy, feedback, and change. Every transition has a reason to exist.',
    tags: ['Scroll systems', 'Easing design', 'Reduced-motion'],
  },
];
