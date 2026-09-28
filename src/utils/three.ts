import * as THREE from 'three';

export const clamp01 = (x: number): number => Math.min(1, Math.max(0, x));

export const smoothstep = (a: number, b: number, x: number): number => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** Radial slot → world position. 0°=+X right, 90°=−Z far, 180°=−X, 270°=+Z near. */
export function nodePosition(angleDeg: number, radius: number, y = 0.5): THREE.Vector3 {
  const a = (angleDeg * Math.PI) / 180;
  return new THREE.Vector3(Math.cos(a) * radius, y, -Math.sin(a) * radius);
}

export function orbitRadius(isMobile: boolean): number {
  return isMobile ? 5.1 : 6.4;
}

/* ---------------- camera keyframes ---------------- */

interface CamKey {
  p: number;
  pos: [number, number, number];
  tgt: [number, number, number];
}

const KEYS: CamKey[] = [
  { p: 0.0, pos: [0, 4.2, 16.0], tgt: [0, -0.1, 0] },
  { p: 0.12, pos: [0, 2.6, 11.6], tgt: [0, 0.2, 0] },
  { p: 0.25, pos: [0, 1.25, 8.1], tgt: [0, 0.3, 0] },
  { p: 0.42, pos: [5.4, 3.4, 10.6], tgt: [0, 0.1, 0] },
  { p: 0.6, pos: [0, 5.4, 12.8], tgt: [0, 0, 0] },
  { p: 0.8, pos: [0, 7.4, 14.4], tgt: [0, 0, 0] },
  { p: 1.0, pos: [0, 9.2, 16.8], tgt: [0, -0.6, 0] },
];

export function cameraForProgress(
  p: number,
  isMobile: boolean,
): { pos: THREE.Vector3; tgt: THREE.Vector3 } {
  const c = clamp01(p);
  let i = 0;
  while (i < KEYS.length - 2 && c > KEYS[i + 1].p) i++;
  const a = KEYS[i];
  const b = KEYS[i + 1];
  const t = clamp01((c - a.p) / Math.max(0.0001, b.p - a.p));
  const s = t * t * (3 - 2 * t);
  const m = isMobile ? 1.28 : 1;
  const pos = new THREE.Vector3(
    (a.pos[0] + (b.pos[0] - a.pos[0]) * s) * m,
    a.pos[1] + (b.pos[1] - a.pos[1]) * s + (isMobile ? 0.8 : 0),
    (a.pos[2] + (b.pos[2] - a.pos[2]) * s) * m,
  );
  const tgt = new THREE.Vector3(
    a.tgt[0] + (b.tgt[0] - a.tgt[0]) * s,
    a.tgt[1] + (b.tgt[1] - a.tgt[1]) * s,
    a.tgt[2] + (b.tgt[2] - a.tgt[2]) * s,
  );
  return { pos, tgt };
}

/** Camera pose when a module is focused: between core and node, looking at the node. */
export function focusCameraFor(
  nodePos: THREE.Vector3,
  isMobile: boolean,
): { pos: THREE.Vector3; tgt: THREE.Vector3 } {
  const dir = nodePos.clone().setY(0).normalize();
  const dist = isMobile ? 5.4 : 4.6;
  const pos = nodePos.clone().addScaledVector(dir, -dist).add(new THREE.Vector3(0, 2.35, 0));
  // For the near (+Z) module, lift the camera so the brain doesn't block the view.
  if (dir.z > 0.7) pos.y += 1.1;
  const tgt = nodePos.clone().add(new THREE.Vector3(0, 0.75, 0));
  return { pos, tgt };
}

/* ---------------- procedural helpers ---------------- */

/** Evenly distributed points on a sphere (Fibonacci lattice). */
export function fibonacciSphere(count: number, radius: number): Float32Array {
  const out = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const th = golden * i;
    out[i * 3] = Math.cos(th) * r * radius;
    out[i * 3 + 1] = y * radius;
    out[i * 3 + 2] = Math.sin(th) * r * radius;
  }
  return out;
}

/** Crisp canvas-sprite label — no runtime font downloads needed. */
export function makeLabelTexture(
  id: string,
  industry: string,
  color: string,
  light = false,
): THREE.CanvasTexture {
  const ink = light ? '#0b1530' : '#ffffff';
  const sub = light ? new THREE.Color(color).multiplyScalar(0.6).getStyle() : color;
  const rule = light ? 'rgba(11,21,48,0.4)' : 'rgba(255,255,255,0.35)';
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 168;
  const g = c.getContext('2d');
  if (g) {
    g.clearRect(0, 0, 512, 168);
    g.textAlign = 'center';
    g.fillStyle = ink;
    g.font = '600 62px "Space Grotesk", system-ui, sans-serif';
    g.fillText(id, 256, 70);
    g.fillStyle = sub;
    g.font = '500 30px "IBM Plex Mono", monospace';
    g.fillText(industry.toUpperCase().split('').join(' '), 256, 126);
    g.fillStyle = rule;
    g.fillRect(156, 146, 200, 2);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/** Detect WebGL availability for the fallback branch. */
export function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('webgl'))
    );
  } catch {
    return false;
  }
}
