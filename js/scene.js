/* Three.js hero: warp-field particles + wireframe geometry.
   Subtle, cinematic, mouse-reactive. Pauses when tab hidden. */
import * as THREE from 'three';

const canvas = document.getElementById('webgl');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let renderer = null;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
} catch (e) { renderer = null; }

export function setHeroFade(p) {
  if (canvas) canvas.style.opacity = String(1 - p * 0.55);
}
window.setHeroFade = setHeroFade;

if (!renderer) {
  if (canvas) canvas.style.display = 'none';
} else {
  init();
}

function init() {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0a0b, 0.055);

  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.set(0, 0, 9);

  /* ---------- warp-field particle streaks ---------- */
  const COUNT = 900;
  const positions = new Float32Array(COUNT * 3);
  const speeds = new Float32Array(COUNT);
  const colors = new Float32Array(COUNT * 3);
  const neon = new THREE.Color(0x39ff14);
  const cream = new THREE.Color(0xf4f1e8);

  for (let i = 0; i < COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 26;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 4;
    speeds[i] = 0.02 + Math.random() * 0.09;
    const c = Math.random() < 0.22 ? neon : cream;
    colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const pMat = new THREE.PointsMaterial({
    size: 0.055, vertexColors: true, transparent: true, opacity: 0.85,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true
  });
  scene.add(new THREE.Points(pGeo, pMat));

  /* ---------- wireframe icosahedron ---------- */
  const icoGeo = new THREE.IcosahedronGeometry(1.9, 1);
  const icoWire = new THREE.LineSegments(
    new THREE.WireframeGeometry(icoGeo),
    new THREE.LineBasicMaterial({ color: 0x39ff14, transparent: true, opacity: 0.5 })
  );
  icoWire.position.set(4.6, 0.6, -2.5);
  scene.add(icoWire);

  const icoSolid = new THREE.Mesh(
    icoGeo,
    new THREE.MeshBasicMaterial({ color: 0x0a0a0b, transparent: true, opacity: 0.55 })
  );
  icoSolid.position.copy(icoWire.position);
  icoSolid.scale.setScalar(0.985);
  scene.add(icoSolid);

  /* ---------- floating rings ---------- */
  const rings = [];
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.7 + i * 0.55, 0.012, 8, 90),
      new THREE.MeshBasicMaterial({ color: 0xf4f1e8, transparent: true, opacity: 0.28 - i * 0.07 })
    );
    ring.position.set(-5.5 + i * 1.1, -1.6 + i * 1.3, -4 - i);
    ring.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    scene.add(ring);
    rings.push(ring);
  }

  /* ---------- interaction ---------- */
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener('pointermove', (e) => {
    mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  let running = true;
  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) requestAnimationFrame(tick);
  });

  const clock = new THREE.Clock();
  function tick() {
    if (!running) return;
    requestAnimationFrame(tick);
    const t = clock.getElapsedTime();

    const pos = pGeo.attributes.position.array;
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3 + 2] += speeds[i];
      if (pos[i * 3 + 2] > 6) {
        pos[i * 3 + 2] = -16;
        pos[i * 3] = (Math.random() - 0.5) * 26;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      }
    }
    pGeo.attributes.position.needsUpdate = true;

    icoWire.rotation.y = t * 0.18;
    icoWire.rotation.x = t * 0.1;
    icoSolid.rotation.copy(icoWire.rotation);
    icoWire.position.y = 0.6 + Math.sin(t * 0.7) * 0.25;
    icoSolid.position.y = icoWire.position.y;
    rings.forEach((r, i) => {
      r.rotation.z = t * (0.12 + i * 0.05);
      r.position.y += Math.sin(t * 0.6 + i * 2) * 0.0012;
    });

    mouse.x += (mouse.tx - mouse.x) * 0.045;
    mouse.y += (mouse.ty - mouse.y) * 0.045;
    camera.position.x = mouse.x * 0.7;
    camera.position.y = -mouse.y * 0.45;
    camera.lookAt(0, 0, -2);

    renderer.render(scene, camera);
  }

  if (reduceMotion) {
    renderer.render(scene, camera); // single static frame
  } else {
    tick();
  }
}
