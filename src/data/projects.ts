import type { ProjectConfig } from './types';

/**
 * CENTRAL PROJECT CONFIGURATION — NEXUS
 * Add P-05, P-06... here without rewriting the application.
 * `angle` is the radial slot around the AI core (degrees, 0 = +X right).
 * `color` is the module accent; `story` is the visual mini-story beats.
 */
export const PROJECTS: ProjectConfig[] = [
  {
    id: 'P-01',
    title: 'VectorPilot',
    industry: 'AI & SaaS',
    tagline: 'Live AI operations',
    url: 'https://merry-basbousa-3ed9d0.netlify.app/',
    screenshot: '/assets/projects/p01-vectorpilot.png',
    description:
      'A product experience for an AI cost-management platform, combining pricing structure, live usage analytics, and dense product information into a clear interface.',
    features: ['AI Copilot', 'Live cost analytics', 'Key management', 'Usage dashboards'],
    stack: ['React', 'TypeScript', 'Real-time data', 'Analytics UI'],
    keywords: ['INTELLIGENCE', 'DATA', 'AI', 'SOFTWARE', 'SAAS'],
    angle: 0,
    color: '#38bdf8',
    colorAlt: '#2563eb',
    visualIdentity: 'neural',
  },
  {
    id: 'P-02',
    title: 'Medora',
    industry: 'Healthcare',
    tagline: 'Premium telehealth',
    url: 'https://scintillating-heliotrope-c5de50.netlify.app/',
    screenshot: '/assets/projects/p02-medora.png',
    description:
      'A trust-first healthcare experience built around clear information, provider discovery, and patient-facing states, with emphasis on calm hierarchy and accessibility.',
    features: ['Video visits', 'Private records', 'Prescriptions', 'Care team'],
    stack: ['React', 'TypeScript', 'Dashboard UI', 'Booking flows'],
    keywords: ['CARE', 'HEALTH DATA', 'MONITORING', 'HEALTHCARE'],
    angle: 90,
    color: '#2dd4bf',
    colorAlt: '#0ea5e9',
    visualIdentity: 'medical',
  },
  {
    id: 'P-03',
    title: 'FleetAxis',
    industry: 'Logistics',
    tagline: 'Fleet command center',
    url: 'https://deft-crisp-2d7ac4.netlify.app/',
    screenshot: '/assets/projects/p03-fleetaxis.png',
    description:
      'An operations-focused interface for fleet tracking, shipment status, and decision-making in data-dense environments, designed for fast scanning and clear action.',
    features: ['Live fleet map', 'Shipment tracking', 'Geofence alerts', 'Utilization reports'],
    stack: ['React', 'TypeScript', 'Maps & GPS', 'Real-time feed'],
    keywords: ['ORIGIN', 'ROUTE', 'TRACKING', 'DELIVERY', 'LOGISTICS'],
    angle: 180,
    color: '#60a5fa',
    colorAlt: '#4f46e5',
    visualIdentity: 'logistics',
  },
  {
    id: 'P-04',
    title: 'Civella',
    industry: 'Real Estate',
    tagline: 'Property discovery',
    url: 'https://bright-smakager-89a790.netlify.app/',
    screenshot: '/assets/projects/p04-civella.png',
    description:
      'A premium property-search experience combining editorial presentation, structured listings, and information-rich browsing.',
    features: ['Map search', 'Market analytics', 'Agent workspace', '3D tours'],
    stack: ['React', 'TypeScript', 'Listings engine', 'Data viz'],
    keywords: ['SPACE', 'PROPERTY', 'LOCATION', 'ARCHITECTURE', 'REAL ESTATE'],
    angle: 270,
    color: '#a78bfa',
    colorAlt: '#2563eb',
    visualIdentity: 'architectural',
  },
];

export const projectById = (id: string | null): ProjectConfig | null =>
  PROJECTS.find((p) => p.id === id) ?? null;
