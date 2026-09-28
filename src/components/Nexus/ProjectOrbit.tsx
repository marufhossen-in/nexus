import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import type { ReactElement } from 'react';
import { PROJECTS } from '../../data/projects';
import { live, useNexusState } from '../../state/store';
import { nodePosition, orbitRadius } from '../../utils/three';
import { EnergyPath } from './EnergyPath';
import { ProjectNode } from './ProjectNode';

/** Rotating ecosystem: exactly four nodes + four energy paths. */
export function ProjectOrbit(): ReactElement {
  const { isMobile, reducedMotion, focusedProject } = useNexusState();
  const group = useRef<THREE.Group>(null!);
  const textures = useTexture(PROJECTS.map((p) => p.screenshot)) as THREE.Texture[];

  useEffect(() => {
    textures.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 16;
      t.minFilter = THREE.LinearMipmapLinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.needsUpdate = true;
    });
  }, [textures]);

  const radius = orbitRadius(isMobile);
  const slots = useMemo(
    () =>
      PROJECTS.map((p) => {
        const pos = nodePosition(p.angle, radius, 0.35);
        const dir = pos.clone().setY(0).normalize();
        return { project: p, pos, dir };
      }),
    [radius],
  );

  useEffect(() => {
    // start at 45° so no module blocks the core in the entry frame
    group.current.rotation.y = Math.PI / 4;
    live.orbit = Math.PI / 4;
  }, []);

  useFrame((_st, dt) => {
    if (reducedMotion) {
      live.orbit = group.current.rotation.y;
      return;
    }
    const g = group.current;
    if (focusedProject) {
      // lock alignment so the camera meets the focused module precisely
      const target = Math.round(g.rotation.y / (Math.PI * 2)) * Math.PI * 2;
      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, target, 3, dt);
    } else {
      const sequencing = live.energy > 0.02 && live.energy < 0.98 ? 0.35 : 1;
      g.rotation.y += dt * 0.055 * sequencing;
    }
    live.orbit = g.rotation.y;
  });

  return (
    <group ref={group} rotation={[0, Math.PI / 4, 0]}>
      {slots.map((s, i) => (
        <EnergyPath
          key={`e-${s.project.id}`}
          dir={s.dir}
          nodePos={s.pos}
          colorA={s.project.colorAlt}
          colorB={s.project.color}
          index={i}
        />
      ))}
      {slots.map((s, i) => (
        <ProjectNode
          key={s.project.id}
          project={s.project}
          index={i}
          texture={textures[i]}
          basePos={s.pos}
        />
      ))}
    </group>
  );
}
