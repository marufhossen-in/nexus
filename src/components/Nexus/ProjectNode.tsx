import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import type { ReactElement } from 'react';
import type { ProjectConfig, VisualIdentity } from '../../data/types';
import { focusProject, live, setHoveredProject, useNexusState } from '../../state/store';
import { clamp01, makeLabelTexture } from '../../utils/three';

/* ---------------- industry 3D motifs ---------------- */

function Motif({ kind, color }: { kind: VisualIdentity; color: string }): ReactElement {
  const g = useRef<THREE.Group>(null!);
  const dot = useRef<THREE.Mesh>(null);

  const ecg = useMemo(() => {
    if (kind !== 'medical') return null;
    const pts = [
      [-0.52, 0, 0], [-0.28, 0, 0], [-0.2, 0.16, 0], [-0.12, -0.16, 0],
      [-0.02, 0.3, 0], [0.08, -0.06, 0], [0.18, 0.04, 0], [0.3, 0, 0], [0.52, 0, 0],
    ].map(([x, y, z]) => new THREE.Vector3(x, y, z));
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 64, 0.028, 8, false);
  }, [kind]);

  useEffect(() => {
    return () => {
      ecg?.dispose();
    };
  }, [ecg]);

  useFrame((st) => {
    const t = st.clock.elapsedTime;
    if (kind === 'medical') {
      g.current.scale.setScalar(1 + Math.sin(t * 4.4) * 0.09);
    } else {
      g.current.rotation.y = t * 0.7;
    }
    if (dot.current) {
      const a = t * 1.9;
      dot.current.position.set(Math.cos(a) * 0.4, Math.sin(a) * 0.4, 0);
    }
  });

  if (kind === 'medical') {
    return (
      <group ref={g}>
        {ecg && (
          <mesh geometry={ecg}>
            <meshBasicMaterial color={color} toneMapped={false} />
          </mesh>
        )}
      </group>
    );
  }
  if (kind === 'logistics') {
    return (
      <group ref={g}>
        <mesh rotation={[0, 0, -0.4]}>
          <torusGeometry args={[0.4, 0.025, 8, 40, Math.PI * 1.35]} />
          <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.85} />
        </mesh>
        <mesh ref={dot}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
        <mesh position={[0.36, -0.34, 0]}>
          <coneGeometry args={[0.05, 0.14, 10]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
        <mesh position={[-0.42, 0.1, 0]}>
          <coneGeometry args={[0.05, 0.14, 10]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
      </group>
    );
  }
  if (kind === 'architectural') {
    return (
      <group ref={g}>
        {[
          [-0.33, 0.3], [-0.11, 0.56], [0.11, 0.42], [0.33, 0.68],
        ].map(([x, h], i) => (
          <mesh key={i} position={[x, h / 2 - 0.3, 0]}>
            <boxGeometry args={[0.17, h, 0.17]} />
            <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.9} />
          </mesh>
        ))}
        <mesh position={[0.33, 0.62, 0]}>
          <sphereGeometry args={[0.05, 10, 10]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
      </group>
    );
  }
  // neural (AI & SaaS)
  return (
    <group ref={g}>
      <mesh>
        <octahedronGeometry args={[0.3, 0]} />
        <meshBasicMaterial color={color} wireframe toneMapped={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
      <mesh rotation={[Math.PI / 2.3, 0.4, 0]}>
        <torusGeometry args={[0.42, 0.015, 8, 40]} />
        <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

/* ---------------- project terminal ---------------- */

interface Props {
  project: ProjectConfig;
  index: number;
  texture: THREE.Texture;
  basePos: THREE.Vector3;
}

const BODY_DARK = new THREE.Color('#05070f');
const BODY_LIT = new THREE.Color('#0e1830');
const LBODY_DARK = new THREE.Color('#8b98b8');
const LBODY_LIT = new THREE.Color('#d9e2f4');
const FRAME_D = new THREE.Color('#0a1226');
const FRAME_L = new THREE.Color('#dfe7f7');
const TMP_BODY = new THREE.Color('#ffffff');

export function ProjectNode({ project, index, texture, basePos }: Props): ReactElement {
  const { booted, focusedProject, previewProject, hoveredProject, reducedMotion, resolved } =
    useNexusState();
  const group = useRef<THREE.Group>(null!);
  const screenMesh = useRef<THREE.Mesh>(null!);
  const screenMat = useRef<THREE.MeshBasicMaterial>(null!);
  const bodyMat = useRef<THREE.MeshStandardMaterial>(null!);
  const frameMat = useRef<THREE.MeshStandardMaterial>(null!);
  const ledMat = useRef<THREE.MeshBasicMaterial>(null!);
  const labelMat = useRef<THREE.SpriteMaterial>(null!);
  const labelSprite = useRef<THREE.Sprite>(null!);
  const ringMat = useRef<THREE.MeshBasicMaterial>(null!);
  const online = useRef(0);
  const hoverS = useRef(1);
  const yaw = useRef(0);
  const worldPos = useMemo(() => new THREE.Vector3(), []);

  const focused = focusedProject === project.id || previewProject === project.id;
  const hovered = hoveredProject === project.id;
  const dimmed = (focusedProject !== null || previewProject !== null) && !focused;

  const isLight = resolved === 'light';
  const labelTex = useMemo(
    () => makeLabelTexture(project.id, project.industry, project.color, isLight),
    [project.id, project.industry, project.color, isLight],
  );

  useEffect(() => {
    return () => {
      labelTex.dispose();
    };
  }, [labelTex]);

  const accent = useMemo(() => new THREE.Color(project.color), [project.color]);
  const accentDeep = useMemo(
    () => new THREE.Color(project.color).multiplyScalar(0.55),
    [project.color],
  );
  const stripStyle = useMemo(
    () =>
      isLight
        ? new THREE.Color(project.color).multiplyScalar(0.62).getStyle()
        : project.color,
    [project.color, isLight],
  );

  useFrame((st, dt) => {
    const t = st.clock.elapsedTime;
    const lm = live.lightMix;
    const target = clamp01(live.online - index * 0.9);
    online.current += (target - online.current) * Math.min(1, dt * 2.6);
    const o = online.current;
    const e = o * o * (3 - 2 * o);

    // rise + float
    const floatY = reducedMotion || o < 0.95 ? 0 : Math.sin(t * 1.2 + index * 1.7) * 0.06;
    group.current.position.set(basePos.x, basePos.y - 0.75 * (1 - e) + floatY, basePos.z);

    // hover scale
    const hs = hovered || focused ? 1.06 : 1;
    hoverS.current += (hs - hoverS.current) * Math.min(1, dt * 6);
    group.current.scale.setScalar(hoverS.current);

    // holographic terminal yaw — screenshots always face the visitor
    group.current.getWorldPosition(worldPos);
    const dx = st.camera.position.x - worldPos.x;
    const dz = st.camera.position.z - worldPos.z;
    const targetLocal = Math.atan2(dx, dz) - live.orbit;
    const yawTarget = Math.atan2(
      Math.sin(targetLocal),
      Math.cos(targetLocal),
    );
    yaw.current = THREE.MathUtils.damp(yaw.current, yawTarget, 5.5, dt);
    group.current.rotation.y = yaw.current;

    // screen mechanical reveal
    const sr = clamp01((o - 0.3) / 0.6);
    screenMesh.current.scale.set(1, Math.max(0.001, sr), 1);
    screenMat.current.opacity = sr;
    // Keep the real project screenshots readable: reduce highlight intensity
    // instead of letting the white UI areas wash into the bloom.
    screenMat.current.color.setScalar(dimmed ? 0.18 : 0.82);

    // body + frame: dark metal in dark mode, light silver in light mode
    bodyMat.current.color.lerpColors(BODY_DARK, BODY_LIT, e);
    TMP_BODY.lerpColors(LBODY_DARK, LBODY_LIT, e);
    bodyMat.current.color.lerp(TMP_BODY, lm);
    frameMat.current.color.copy(FRAME_D).lerp(FRAME_L, lm);
    // metals need an env map — in light mode go satin so silver reads
    const metal = 0.85 - lm * 0.62;
    bodyMat.current.metalness = metal;
    frameMat.current.metalness = metal + 0.05;
    bodyMat.current.roughness = 0.4 + lm * 0.2;
    frameMat.current.roughness = 0.35 + lm * 0.2;
    bodyMat.current.emissive
      .copy(accent)
      .lerp(accentDeep, lm)
      .multiplyScalar(e * (dimmed ? 0.04 : 0.22));
    ledMat.current.opacity = e * (0.55 + 0.45 * Math.sin(t * 3 + index * 2));
    labelMat.current.opacity = (0.3 + 0.7 * e) * (dimmed ? 0.3 : 1);
    // labels resolve as modules awaken (reduces dormant clutter)
    const ls = 0.62 + 0.38 * e;
    labelSprite.current.scale.set(2.6 * ls, 0.85 * ls, 1);
    ringMat.current.opacity = hovered || focused ? 0.9 : 0.1 + e * 0.15;
  });

  const onOver = (ev: ThreeEvent<PointerEvent>): void => {
    ev.stopPropagation();
    if (!booted) return;
    setHoveredProject(project.id);
    document.body.style.cursor = 'pointer';
  };
  const onOut = (): void => {
    setHoveredProject(null);
    document.body.style.cursor = '';
  };
  const onClick = (ev: ThreeEvent<MouseEvent>): void => {
    ev.stopPropagation();
    if (!booted) return;
    focusProject(project.id);
  };

  return (
    <group
      ref={group}
      position={[basePos.x, basePos.y - 0.75, basePos.z]}
      onPointerOver={onOver}
      onPointerOut={onOut}
      onClick={onClick}
    >
      {/* pedestal base */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[2.5, 0.5, 1.7]} />
        <meshStandardMaterial ref={bodyMat} color="#05070f" metalness={0.85} roughness={0.4} />
      </mesh>
      {/* terminal frame */}
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[2.6, 1.7, 0.22]} />
        <meshStandardMaterial ref={frameMat} color="#0a1226" metalness={0.9} roughness={0.35} />
      </mesh>
      {/* holographic screenshot — toneMapped off for maximum sharpness */}
      <mesh ref={screenMesh} position={[0, 0.75, 0.12]}>
        <planeGeometry args={[2.35, 1.32]} />
        <meshBasicMaterial
          ref={screenMat}
          map={texture}
          toneMapped
          transparent
          opacity={0}
        />
      </mesh>
      {/* emissive edge strips */}
      {[-1.33, 1.33].map((x) => (
        <mesh key={x} position={[x, 0.75, 0]}>
          <boxGeometry args={[0.05, 1.7, 0.24]} />
          <meshBasicMaterial color={stripStyle} toneMapped={false} />
        </mesh>
      ))}
      <mesh position={[0, 1.63, 0]}>
        <boxGeometry args={[2.6, 0.05, 0.24]} />
        <meshBasicMaterial color={stripStyle} toneMapped={false} />
      </mesh>
      {/* LEDs */}
      {[-0.2, 0, 0.2].map((x) => (
        <mesh key={x} position={[x, -0.5, 0.87]}>
          <sphereGeometry args={[0.045, 10, 10]} />
          <meshBasicMaterial ref={x === 0 ? ledMat : undefined} color={stripStyle} toneMapped={false} transparent opacity={0} />
        </mesh>
      ))}
      {/* industry identity motif */}
      <group position={[0, 2.15, 0]}>
        <Motif kind={project.visualIdentity} color={stripStyle} />
      </group>
      {/* ID label sprite */}
      <sprite ref={labelSprite} position={[0, 2.95, 0]} scale={[1.6, 0.53, 1]}>
        <spriteMaterial ref={labelMat} map={labelTex} transparent opacity={0.3} depthWrite={false} />
      </sprite>
      {/* hover ring */}
      <mesh position={[0, -0.85, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.95, 0.03, 8, 64]} />
        <meshBasicMaterial ref={ringMat} color={stripStyle} toneMapped={false} transparent opacity={0.1} />
      </mesh>
    </group>
  );
}
