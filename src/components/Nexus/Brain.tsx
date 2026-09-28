import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ReactElement } from 'react';
import { live, useNexusState } from '../../state/store';
import { fibonacciSphere } from '../../utils/three';

const FRESNEL_VERT = /* glsl */ `
varying vec3 vN;
varying vec3 vV;
void main() {
  vN = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vV = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`;

const FRESNEL_FRAG = /* glsl */ `
uniform vec3 uColor;
uniform float uIntensity;
varying vec3 vN;
varying vec3 vV;
void main() {
  float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.4);
  gl_FragColor = vec4(uColor * f * uIntensity, f * uIntensity);
}
`;

// dark → light theme color pairs
const PTS_D = new THREE.Color('#4cc3ff');
const PTS_L = new THREE.Color('#1e40af');
const WIRE_D = new THREE.Color('#2f6bff');
const WIRE_L = new THREE.Color('#1e3a8a');
const FRE_D = new THREE.Color('#38bdf8');
const FRE_L = new THREE.Color('#1e40af');
const CORE_L = new THREE.Color('#1d4ed8');

/** THE AI BRAIN — translucent neural core, wireframe shell, gyro rings. */
export function Brain(): ReactElement {
  const { quality, reducedMotion } = useNexusState();
  const group = useRef<THREE.Group>(null!);
  const gyroA = useRef<THREE.Mesh>(null!);
  const gyroB = useRef<THREE.Mesh>(null!);
  const pointsMat = useRef<THREE.PointsMaterial>(null!);
  const coreMat = useRef<THREE.MeshBasicMaterial>(null!);
  const wireMat = useRef<THREE.MeshBasicMaterial>(null!);
  const light = useRef<THREE.PointLight>(null!);

  const count = quality === 'HIGH' ? 1500 : quality === 'MEDIUM' ? 900 : 450;
  const positions = useMemo(() => fibonacciSphere(count, 0.92), [count]);

  const fresnel = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: FRESNEL_VERT,
        fragmentShader: FRESNEL_FRAG,
        uniforms: {
          uColor: { value: new THREE.Color('#38bdf8') },
          uIntensity: { value: 0.4 },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [],
  );

  useFrame((st, dt) => {
    const t = st.clock.elapsedTime;
    const act = live.activation;
    const lm = live.lightMix;
    const spin = reducedMotion ? 0 : 0.1 + act * 0.5;
    group.current.rotation.y += dt * spin;
    if (!reducedMotion) {
      gyroA.current.rotation.x = t * 0.42;
      gyroA.current.rotation.y = t * 0.21;
      gyroB.current.rotation.y = -t * 0.3;
      gyroB.current.rotation.z = t * 0.16;
    }
    const breathe = reducedMotion ? 0 : Math.sin(t * 1.6) * 0.02;
    group.current.scale.setScalar(Math.max(0.001, 0.68 + act * 0.32 + breathe));
    pointsMat.current.opacity = 0.2 + act * 0.8;
    pointsMat.current.size = 0.028 + act * 0.032;
    pointsMat.current.color.copy(PTS_D).lerp(PTS_L, lm);
    wireMat.current.opacity = 0.16 + act * 0.36;
    wireMat.current.color.copy(WIRE_D).lerp(WIRE_L, lm);
    coreMat.current.color.setRGB(0.35 + act * 0.45, 0.62 + act * 0.3, 1).lerp(CORE_L, lm * 0.85);
    fresnel.uniforms.uColor.value.copy(FRE_D).lerp(FRE_L, lm);
    fresnel.uniforms.uIntensity.value = (0.4 + act * 1.35) * (1 - lm * 0.55);
    light.current.intensity = 3 + act * 16;
  });

  return (
    <group ref={group}>
      {/* neural particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={pointsMat}
          size={0.045}
          color="#4cc3ff"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
      {/* wireframe neural shell */}
      <mesh>
        <icosahedronGeometry args={[1.12, 2]} />
        <meshBasicMaterial ref={wireMat} wireframe color="#2f6bff" transparent opacity={0.16} />
      </mesh>
      {/* fresnel consciousness shell */}
      <mesh scale={1.02}>
        <sphereGeometry args={[1.18, 48, 48]} />
        <primitive object={fresnel} attach="material" />
      </mesh>
      {/* bright core */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial ref={coreMat} color="#7dd3fc" toneMapped={false} />
      </mesh>
      {/* processor gyro rings */}
      <mesh ref={gyroA} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[1.55, 0.018, 8, 128]} />
        <meshBasicMaterial color="#2563eb" transparent opacity={0.8} toneMapped={false} />
      </mesh>
      <mesh ref={gyroB} rotation={[Math.PI / 1.7, Math.PI / 5, 0]}>
        <torusGeometry args={[1.85, 0.014, 8, 128]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.55} toneMapped={false} />
      </mesh>
      <pointLight ref={light} color="#3b82f6" intensity={5} distance={24} decay={1.6} />
    </group>
  );
}
