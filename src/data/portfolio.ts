/**
 * PORTFOLIO DATA — NEXUS
 * Only real, supplied information. Everything here is editable by the developer.
 * Nothing is invented: no fake clients, companies, awards or statistics.
 */
export const PORTFOLIO = {
  identity: 'NEXUS',
  role: 'DIGITAL PRODUCT & FRONTEND ENGINEERING AGENCY',
  core: 'AI CORE',
  /** Short system line shown under the identity. Edit freely. */
  line: 'Digital products — designed, engineered, and built as one system.',
  about: [
    'NEXUS is a digital product and frontend engineering agency. We design and engineer high-quality digital product experiences for teams that need more than a polished interface.',
    'From frontend architecture and design systems to interaction, performance, and responsive implementation, we build systems that are clear, scalable, and ready for real-world use.',
  ],
  /** Contact channels — replace with real links. */
  contact: {
    email: 'hello@nexus.dev',
    github: '#',
    linkedin: '#',
    x: '#',
  },
  approach: [
    {
      id: 'A-01',
      title: 'Architecture before aesthetics',
      body: 'We define structure, hierarchy, states, and component relationships before layering visual treatment, giving the interface a foundation that can support new features.',
    },
    {
      id: 'A-02',
      title: 'One language across the product',
      body: 'We keep typography, spacing, color, components, and interaction within a coherent system, so the product feels consistent from the first screen to the last.',
    },
    {
      id: 'A-03',
      title: 'Performance is part of the build',
      body: 'We consider rendering cost, assets, responsiveness, and interaction performance during implementation — not after the interface is finished.',
    },
    {
      id: 'A-04',
      title: 'Motion with a purpose',
      body: 'We use motion to improve understanding, feedback, and hierarchy — reinforcing the experience rather than adding noise.',
    },
  ],
  journey: [
    { id: 'J-01', phase: 'CORE', title: 'Foundations', body: 'HTML, CSS, JavaScript — the neural substrate.' },
    { id: 'J-02', phase: 'NETWORK', title: 'Modern frontend', body: 'React, TypeScript, real-time UI, data visualization.' },
    { id: 'J-03', phase: 'SYSTEM', title: 'Full stack depth', body: 'APIs, databases, auth, deployments — complete systems.' },
    { id: 'J-04', phase: 'NEXUS', title: 'Immersive experiences', body: 'WebGL, 3D interaction, cinematic storytelling on the web.' },
  ],
} as const;
