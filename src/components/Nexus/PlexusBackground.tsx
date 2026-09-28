import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ReactElement } from 'react';
import { live, useNexusState } from '../../state/store';

const DUST_D = new THREE.Color('#67e8f9');
const DUST_L = new THREE.Color('#0284c7');

/** Deep digital neural network — subordinate to the core. No floor grid. */
export function PlexusBackground(): ReactElement {
  const { quality, reducedMotion } = useNexusState();
  const group = useRef<THREE.Group>(null!);
  const pts = useRef<THREE.Points>(null!);
  const lines = useRef<THREE.LineSegments>(null!);
  const dust = useRef<THREE.Points>(null!);
  const ptsMat = useRef<THREE.PointsMaterial>(null!);
  const dustMat = useRef<THREE.PointsMaterial>(null!);

  const { positions, linePositions, dustPositions } = useMemo(() => {
    const N = 2600;
    const positions = new Float32Array(N * 3);
    const v = new THREE.Vector3();
    for (let i = 0; i < N; i++) {
      v.randomDirection().multiplyScalar(16 + Math.random() * 24);
      positions[i * 3] = v.x;
      positions[i * 3 + 1] = v.y * 0.7;
      positions[i * 3 + 2] = v.z;
    }
    // sparse connections between sampled points
    const segs: number[] = [];
    for (let i = 0; i < 240; i++) {
      const a = Math.floor(Math.random() * N);
      const b = Math.floor(Math.random() * N);
      const dx = positions[a * 3] - positions[b * 3];
      const dy = positions[a * 3 + 1] - positions[b * 3 + 1];
      const dz = positions[a * 3 + 2] - positions[b * 3 + 2];
      if (dx * dx + dy * dy + dz * dz < 64) {
        segs.push(
          positions[a * 3], positions[a * 3 + 1], positions[a * 3 + 2],
          positions[b * 3], positions[b * 3 + 1], positions[b * 3 + 2],
        );
      }
    }
    const D = 340;
    const dustPositions = new Float32Array(D * 3);
    for (let i = 0; i < D; i++) {
      v.randomDirection().multiplyScalar(3 + Math.random() * 8);
      dustPositions[i * 3] = v.x;
      dustPositions[i * 3 + 1] = Math.abs(v.y) * 0.6 - 1;
      dustPositions[i * 3 + 2] = v.z;
    }
    return { positions, linePositions: new Float32Array(segs), dustPositions };
  }, []);

  useEffect(() => {
    const n = quality === 'HIGH' ? 2600 : quality === 'MEDIUM' ? 1500 : 600;
    pts.current.geometry.setDrawRange(0, n);
    const segCount = Math.floor(linePositions.length / 6);
    const l = quality === 'HIGH' ? segCount : quality === 'MEDIUM' ? Math.floor(segCount * 0.6) : Math.floor(segCount * 0.3);
    lines.current.geometry.setDrawRange(0, l * 2);
  }, [quality, linePositions]);

  useFrame((st) => {
    const t = st.clock.elapsedTime;
    if (!reducedMotion) {
      group.current.rotation.y = t * 0.008;
      dust.current.rotation.y = -t * 0.02;
    }
    const breathe = reducedMotion ? 0.6 : 0.45 + Math.sin(t * 0.7) * 0.18;
    ptsMat.current.opacity = breathe * (0.35 + live.activation * 0.65);
    dustMat.current.color.copy(DUST_D).lerp(DUST_L, live.lightMix);
  });

  return (
    <group>
      <group ref={group}>
        <points ref={pts}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          </bufferGeometry>
          <pointsMaterial
            ref={ptsMat}
            size={0.14}
            color="#2c5cb8"
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            sizeAttenuation
          />
        </points>
        <lineSegments ref={lines}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
          </bufferGeometry>
          <lineBasicMaterial color="#274b8f" transparent opacity={0.35} blending={THREE.AdditiveBlending} depthWrite={false} />
        </lineSegments>
      </group>
      <points ref={dust}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={dustMat}
          size={0.05}
          color="#67e8f9"
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  );
}
