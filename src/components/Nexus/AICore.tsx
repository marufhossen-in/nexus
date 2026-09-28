import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ReactElement } from 'react';
import { Brain } from './Brain';
import { live, useNexusState } from '../../state/store';

const DAIS_D1 = new THREE.Color('#0a1226');
const DAIS_L1 = new THREE.Color('#d9e2f4');
const DAIS_D2 = new THREE.Color('#070d1e');
const DAIS_L2 = new THREE.Color('#c6d1ea');

/** AI CORE — brain + volumetric glow + processor dais. */
export function AICore(): ReactElement {
  const { reducedMotion } = useNexusState();
  const ring = useRef<THREE.Mesh>(null!);
  const glow = useRef<THREE.SpriteMaterial>(null!);
  const strip = useRef<THREE.MeshBasicMaterial>(null!);
  const daisA = useRef<THREE.MeshStandardMaterial>(null!);
  const daisB = useRef<THREE.MeshStandardMaterial>(null!);

  const glowTex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 256;
    const g = c.getContext('2d');
    if (g) {
      const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
      grd.addColorStop(0, 'rgba(140,200,255,0.85)');
      grd.addColorStop(0.35, 'rgba(56,130,246,0.32)');
      grd.addColorStop(1, 'rgba(2,6,20,0)');
      g.fillStyle = grd;
      g.fillRect(0, 0, 256, 256);
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);

  useFrame((st) => {
    const t = st.clock.elapsedTime;
    if (!reducedMotion) ring.current.rotation.z = t * 0.25;
    const act = live.activation;
    const lm = live.lightMix;
    glow.current.opacity = (0.16 + act * 0.42) * (1 - lm * 0.75);
    strip.current.color.setRGB(0.1 + act * 0.15, 0.32 + act * 0.45, 0.95);
    daisA.current.color.copy(DAIS_D1).lerp(DAIS_L1, lm);
    daisB.current.color.copy(DAIS_D2).lerp(DAIS_L2, lm);
    daisA.current.metalness = 0.9 - lm * 0.65;
    daisB.current.metalness = 0.85 - lm * 0.6;
    daisA.current.roughness = 0.35 + lm * 0.2;
    daisB.current.roughness = 0.45 + lm * 0.15;
  });

  return (
    <group position={[0, 0.4, 0]}>
      <sprite scale={[7.5, 7.5, 1]}>
        <spriteMaterial
          ref={glow}
          map={glowTex}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>
      <Brain />
      {/* processor dais */}
      <mesh position={[0, -2.05, 0]}>
        <cylinderGeometry args={[2.0, 2.35, 0.4, 48]} />
        <meshStandardMaterial ref={daisA} color="#0a1226" metalness={0.9} roughness={0.35} />
      </mesh>
      <mesh ref={ring} position={[0, -1.83, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.0, 0.03, 8, 96]} />
        <meshBasicMaterial ref={strip} color="#1d4ed8" toneMapped={false} />
      </mesh>
      <mesh position={[0, -2.45, 0]}>
        <cylinderGeometry args={[2.5, 2.7, 0.22, 48]} />
        <meshStandardMaterial ref={daisB} color="#070d1e" metalness={0.85} roughness={0.45} />
      </mesh>
    </group>
  );
}
