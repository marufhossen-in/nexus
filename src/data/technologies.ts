import type { TechCategory } from './types';

/** Connected technology ecosystem. No invented proficiency percentages. */
export const TECH_STACK: TechCategory[] = [
  { id: 'frontend', label: 'FRONTEND', items: ['React', 'TypeScript', 'Three.js / R3F', 'GSAP', 'Vite', 'CSS Systems'] },
  { id: 'backend', label: 'BACKEND', items: ['Node.js', 'REST APIs', 'Auth flows', 'WebSockets'] },
  { id: 'database', label: 'DATABASE', items: ['PostgreSQL', 'MongoDB', 'Realtime stores'] },
  { id: 'devops', label: 'DEVOPS', items: ['Netlify', 'Vercel', 'CI pipelines', 'Preview deploys'] },
  { id: 'tools', label: 'TOOLS', items: ['Git', 'Figma', 'Postman', 'DevTools'] },
];
