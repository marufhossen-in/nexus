import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ReactElement } from 'react';
import { live } from '../../state/store';
import { clamp01 } from '../../utils/three';

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FRAG = /* glsl */ `
uniform float uTime;
uniform float uProgress;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uIntensity;
varying vec2 vUv;
void main() {
  float u = vUv.x;
  float on = 1.0 - smoothstep(uProgress - 0.015, uProgress + 0.015, u);
  float head = (1.0 - smoothstep(0.0, 0.14, uProgress - u)) * step(u, uProgress);
  float f = fract(u * 16.0 - uTime * 2.4);
  float pulse = smoothstep(0.0, 0.1, f) * (1.0 - smoothstep(0.1, 0.55, f));
  vec3 col = mix(uColorA, uColorB, pulse);
  float a = on * (0.16 + pulse * 0.85 * uIntensity + head * 1.4);
  gl_FragColor = vec4(col * (0.7 + uIntensity), a);
}
`;

const DOT_D = new THREE.Color('#d8f3ff');
const DOT_L = new THREE.Color('#1d4ed8');

interface Props {
  dir: THREE.Vector3;
  nodePos: THREE.Vector3;
  colorA: string;
  colorB: string;
  index: number;
}

/** One of exactly four circuit-like energy currents: CORE → PROJECT. */
export function EnergyPath({ dir, nodePos, colorA, colorB, index }: Props): ReactElement {
  const mat = useRef<THREE.ShaderMaterial>(null!);
  const dotA = useRef<THREE.Mesh>(null!);
  const dotB = useRef<THREE.Mesh>(null!);
  const dotMatA = useRef<THREE.MeshBasicMaterial>(null!);
  const dotMatB = useRef<THREE.MeshBasicMaterial>(null!);
  const prog = useRef(0);

  const { curve, geometry, material } = useMemo(() => {
    const d = dir.clone().setY(0).normalize();
    const perp = new THREE.Vector3(-d.z, 0, d.x);
    const bend = index % 2 === 0 ? 1 : -1;
    const from = new THREE.Vector3(d.x * 1.5, 0.45, d.z * 1.5);
    const to = nodePos.clone().addScaledVector(d, -1.55);
    to.y = nodePos.y + 0.4;
    const pts = [
      from,
      from.clone().addScaledVector(d, 1.6).addScaledVector(perp, 0.85 * bend).add(new THREE.Vector3(0, 0.25, 0)),
      to.clone().addScaledVector(d, -1.9).addScaledVector(perp, 0.85 * bend).add(new THREE.Vector3(0, 0.1, 0)),
      to,
    ];
    const curve = new THREE.CatmullRomCurve3(pts);
    const geometry = new THREE.TubeGeometry(curve, 72, 0.035, 8, false);
    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uColorA: { value: new THREE.Color(colorA) },
        uColorB: { value: new THREE.Color(colorB) },
        uIntensity: { value: 0.4 },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    return { curve, geometry, material };
  }, [dir, nodePos, colorA, colorB, index]);

  const baseA = useMemo(() => new THREE.Color(colorA), [colorA]);
  const baseB = useMemo(() => new THREE.Color(colorB), [colorB]);
  const deepA = useMemo(() => new THREE.Color(colorA).multiplyScalar(0.38), [colorA]);
  const deepB = useMemo(() => new THREE.Color(colorB).multiplyScalar(0.38), [colorB]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame((st, dt) => {
    const t = st.clock.elapsedTime;
    const lm = live.lightMix;
    const target = clamp01((live.energy - index * 0.1) / 0.62);
    prog.current += (target - prog.current) * Math.min(1, dt * 3.2);
    const p = prog.current;
    mat.current.uniforms.uTime.value = t;
    mat.current.uniforms.uProgress.value = p;
    mat.current.uniforms.uIntensity.value = 0.35 + live.energy * 0.95;
    mat.current.uniforms.uColorA.value.copy(baseA).lerp(deepA, lm);
    mat.current.uniforms.uColorB.value.copy(baseB).lerp(deepB, lm);
    dotMatA.current.color.copy(DOT_D).lerp(DOT_L, lm);
    dotMatB.current.color.copy(baseB).lerp(deepB, lm);
    const show = p > 0.9;
    dotA.current.visible = show;
    dotB.current.visible = show;
    if (show) {
      curve.getPoint((t * 0.32 + index * 0.13) % 1, tmp);
      dotA.current.position.copy(tmp);
      curve.getPoint((t * 0.32 + index * 0.13 + 0.5) % 1, tmp);
      dotB.current.position.copy(tmp);
      const s = 1 + Math.sin(t * 9 + index) * 0.25;
      dotA.current.scale.setScalar(s);
      dotB.current.scale.setScalar(2 - s);
    }
  });

  return (
    <group>
      <mesh geometry={geometry}>
        <primitive object={material} attach="material" ref={mat} />
      </mesh>
      <mesh ref={dotA} visible={false}>
        <sphereGeometry args={[0.075, 12, 12]} />
        <meshBasicMaterial ref={dotMatA} color="#d8f3ff" toneMapped={false} transparent opacity={0.95} />
      </mesh>
      <mesh ref={dotB} visible={false}>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshBasicMaterial ref={dotMatB} color={colorB} toneMapped={false} transparent opacity={0.95} />
      </mesh>
    </group>
  );
}
