import type { ReactElement } from 'react';
import { statusForPhase, useNexusState } from '../../state/store';

/** Bottom-left system status HUD (desktop). */
export function Hud(): ReactElement | null {
  const { booted, phase, onlineCount, quality, focusedProject } = useNexusState();
  if (!booted) return null;
  return (
    <div className="nx-hud" aria-hidden="true">
      AI CORE <b>● ACTIVE</b>
      <br />
      MODULES <b>{onlineCount}/4</b> <span className="ok">ONLINE</span>
      <br />
      PHASE <b>{phase}</b>
      <br />
      {focusedProject ? (
        <>FOCUS <b>{focusedProject}</b></>
      ) : (
        <>QUALITY <b>{quality}</b></>
      )}
      <br />
      {statusForPhase(phase, onlineCount)}
    </div>
  );
}
