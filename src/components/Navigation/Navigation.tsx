import type { ReactElement } from 'react';
import { setTheme, useNexusState } from '../../state/store';
import type { ThemeChoice } from '../../state/store';
import { useScrolled } from '../../hooks/useNexus';

const LINKS: Array<{ href: string; label: string }> = [
  { href: '#about', label: 'APPROACH' },
  { href: '#projects', label: 'WORK' },
  { href: '#capabilities', label: 'CAPABILITIES' },
  { href: '#contact', label: 'CONTACT' },
];

function ThemeIcon({ kind }: { kind: ThemeChoice }): ReactElement {
  const common = {
    width: 15,
    height: 15,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  } as const;
  if (kind === 'light') {
    return (
      <svg {...common} aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
      </svg>
    );
  }
  if (kind === 'dark') {
    return (
      <svg {...common} aria-hidden="true">
        <path d="M20 13.5A8 8 0 0 1 10.5 4 8 8 0 1 0 20 13.5Z" />
      </svg>
    );
  }
  return (
    <svg {...common} aria-hidden="true">
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M9 20h6M12 16v4" />
    </svg>
  );
}

const THEME_ORDER: ThemeChoice[] = ['system', 'dark', 'light'];
const THEME_LABEL: Record<ThemeChoice, string> = {
  system: 'System theme (follows OS)',
  dark: 'Dark theme',
  light: 'Light theme',
};

export function Navigation(): ReactElement | null {
  const { booted, theme } = useNexusState();
  const scrolled = useScrolled(60);
  if (!booted) return null;
  return (
    <nav className={`nx-nav${scrolled ? ' scrolled' : ''}`} aria-label="Primary">
      <a href="#core" className="nx-logo">
        <span className="nx-logo-mark">
          <i />
        </span>
        NEXUS
      </a>
      <div className="nx-nav-right">
        <div className="nx-links">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </div>
        <div className="nx-theme" role="group" aria-label="Color theme">
          {THEME_ORDER.map((t) => (
            <button
              key={t}
              data-tbtn={t}
              className={theme === t ? 'active' : ''}
              title={THEME_LABEL[t]}
              aria-label={THEME_LABEL[t]}
              aria-pressed={theme === t}
              onClick={() => setTheme(t)}
            >
              <ThemeIcon kind={t} />
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
