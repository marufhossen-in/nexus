import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import type { ReactElement } from 'react';
import { PROJECTS, projectById } from '../../data/projects';
import { live, setQuality, useNexusState } from '../../state/store';
import { cameraForProgress, focusCameraFor, nodePosition, orbitRadius } from '../../utils/three';
import { AICore } from './AICore';
import { ProjectOrbit } from './ProjectOrbit';
import { PlexusBackground } from './PlexusBackground';

/** Cinematic camera — one controller, smooth damping, never teleports. */
function CameraRig(): null {
  const { isMobile, reducedMotion, focusedProject, resolved } = useNexusState();
  const pos = useRef(new THREE.Vector3(0, 4.2, 16.0));
  const tgt = useRef(new THREE.Vector3(0, -0.1, 0));
  const first = useRef(true);

  useFrame((st, dt) => {
    const cam = st.camera;
    // smooth theme crossfade for all 3D materials
    const lt = resolved === 'light' ? 1 : 0;
    live.lightMix += (lt - live.lightMix) * Math.min(1, dt * 3);
    let want: { pos: THREE.Vector3; tgt: THREE.Vector3 };
    if (focusedProject) {
      const p = projectById(focusedProject);
      if (p) {
        const np = nodePosition(p.angle, orbitRadius(isMobile), 0.35);
        want = focusCameraFor(np, isMobile);
      } else {
        want = cameraForProgress(live.progress, isMobile);
      }
    } else {
      want = cameraForProgress(live.progress, isMobile);
    }
    if (first.current) {
      pos.current.copy(want.pos);
      tgt.current.copy(want.tgt);
      first.current = false;
    }
    const lambda = focusedProject ? 2.6 : 2.0;
    const d = Math.min(dt, 0.05);
    pos.current.x = THREE.MathUtils.damp(pos.current.x, want.pos.x, lambda, d);
    pos.current.y = THREE.MathUtils.damp(pos.current.y, want.pos.y, lambda, d);
    pos.current.z = THREE.MathUtils.damp(pos.current.z, want.pos.z, lambda, d);
    tgt.current.x = THREE.MathUtils.damp(tgt.current.x, want.tgt.x, lambda + 0.5, d);
    tgt.current.y = THREE.MathUtils.damp(tgt.current.y, want.tgt.y, lambda + 0.5, d);
    tgt.current.z = THREE.MathUtils.damp(tgt.current.z, want.tgt.z, lambda + 0.5, d);
    cam.position.copy(pos.current);
    if (!reducedMotion && !focusedProject) {
      cam.position.x += Math.sin(st.clock.elapsedTime * 0.3) * 0.1;
      cam.position.y += Math.sin(st.clock.elapsedTime * 0.23) * 0.07;
    }
    cam.lookAt(tgt.current);
  });
  return null;
}

/** Automatic quality step-down if the GPU can't hold frame rate. */
function PerfMonitor(): null {
  const { booted, quality } = useNexusState();
  const frames = useRef(0);
  const time = useRef(0);
  const q = useRef(quality);
  q.current = quality;

  useFrame((_st, dt) => {
    if (!booted) return;
    frames.current += 1;
    time.current += dt;
    if (time.current >= 3) {
      const fps = frames.current / time.current;
      frames.current = 0;
      time.current = 0;
      if (fps < 36) {
        if (q.current === 'HIGH') setQuality('MEDIUM');
        else if (q.current === 'MEDIUM') setQuality('LOW');
      }
    }
  });
  return null;
}

export function NexusScene(): ReactElement {
  const { quality, resolved } = useNexusState();
  const dpr: [number, number] =
    quality === 'HIGH' ? [1, 2] : quality === 'MEDIUM' ? [1, 1.5] : [1, 1];
  const light = resolved === 'light';
  const bg = light ? '#dfe7f6' : '#02040c';

  return (
    <Canvas
      dpr={dpr}
      camera={{ fov: 42, near: 0.1, far: 140, position: [0, 4.2, 16.0] }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={[bg]} />
      <fog attach="fog" args={[bg, 26, 64]} />
      <ambientLight color={light ? '#bcd0f5' : '#1e3a8a'} intensity={light ? 1.7 : 0.7} />
      <directionalLight position={[-6, 9, -6]} color="#60a5fa" intensity={light ? 1.1 : 0.7} />
      <directionalLight position={[6, 4, 8]} color="#1d4ed8" intensity={light ? 0.6 : 0.35} />
      <CameraRig />
      <PerfMonitor />
      <Suspense fallback={null}>
        <AICore />
        <ProjectOrbit key={PROJECTS.length} />
        <PlexusBackground />
      </Suspense>
      {quality !== 'LOW' && (
        <EffectComposer multisampling={0}>
          <Bloom
            mipmapBlur
            intensity={light ? 0.18 : 0.34}
            luminanceThreshold={light ? 0.92 : 0.88}
            luminanceSmoothing={0.12}
          />
          <Vignette darkness={light ? 0.45 : 0.72} offset={0.28} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
