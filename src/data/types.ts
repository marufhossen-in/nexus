export type VisualIdentity = 'neural' | 'medical' | 'logistics' | 'architectural';

export interface ProjectConfig {
  id: string;
  title: string;
  industry: string;
  tagline: string;
  url: string;
  screenshot: string;
  description: string;
  features: string[];
  stack: string[];
  /** Mini-story beats, rendered as visual chips — never long paragraphs. */
  keywords: string[];
  /** Radial slot around the AI core in degrees. 0 = right, 90 = top. */
  angle: number;
  color: string;
  colorAlt: string;
  visualIdentity: VisualIdentity;
}

export interface TechCategory {
  id: string;
  label: string;
  items: string[];
}
