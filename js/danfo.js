import * as THREE from 'three';
import { HALF } from './city.js';

function makeSignTexture(text) {
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 64;
  const g = canvas.getContext('2d');
  g.fillStyle = '#111216'; g.fillRect(0, 0, canvas.width, canvas.height);
  g.strokeStyle = '#c89532'; g.lineWidth = 4; g.strokeRect(3, 3, canvas.width - 6, canvas.height - 6);
  g.fillStyle = '#f5e7bd'; g.font = '900 22px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(text, canvas.width / 2, canvas.height / 2 + 1);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createDanfo() {
  const group = new THREE.Group();
  const wheels = [];
  const yellow = new THREE.MeshStandardMaterial({ color: 0xd6a52e, roughness: 0.52, metalness: 0.16 });
  const green = new THREE.MeshStandardMaterial({ color: 0x24613e, roughness: 0.6, metalness: 0.08 });
  const black = new THREE.MeshStandardMaterial({ color: 0x121316, roughness: 0.82, metalness: 0.12 });
  const glass = new THREE.MeshStandardMaterial({ color: 0x283e46, roughness: 0.16, metalness: 0.55, transparent: true, opacity: 0.88 });
  const chrome = new THREE.MeshStandardMaterial({ color: 0xb2b6ad, roughness: 0.22, metalness: 0.86 });
  const light = new THREE.MeshBasicMaterial({ color: 0xffe7a1 });
  const red = new THREE.MeshBasicMaterial({ color: 0xd94b3f });
  const box = (size, pos, material) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
    mesh.position.set(...pos); mesh.castShadow = true; mesh.receiveShadow = true; group.add(mesh); return mesh;
  };

  box([2.25, 0.36, 4.8], [0, 0.7, 0], black);
  box([2.18, 0.95, 4.5], [0, 1.28, 0], yellow);
  box([2.24, 0.18, 4.65], [0, 1.8, 0], green);
  box([2.2, 0.18, 4.6], [0, 2.06, 0], yellow);
  box([2.02, 0.68, 0.16], [0, 1.33, 2.24], glass);
  box([2.02, 0.68, 0.16], [0, 1.33, -2.24], glass);
  box([0.16, 0.7, 1.7], [-1.08, 1.36, -1.32], glass);
  box([0.16, 0.7, 1.05], [-1.08, 1.36, 1.62], glass);
  // Passenger side is intentionally open in the centre, like a working Danfo.
  box([0.16, 0.72, 1.0], [1.08, 1.35, -1.72], yellow);
  box([0.16, 0.72, 0.72], [1.08, 1.35, 1.84], yellow);
  box([0.08, 0.82, 1.0], [1.12, 1.4, 0.86], chrome);
  box([0.08, 0.82, 1.0], [1.12, 1.4, -0.16], chrome);
  box([2.08, 0.13, 0.15], [0, 1.0, 2.46], chrome);
  box([0.48, 0.24, 0.16], [-0.66, 1.08, 2.49], light);
  box([0.48, 0.24, 0.16], [0.66, 1.08, 2.49], light);
  box([0.48, 0.24, 0.16], [-0.66, 1.08, -2.49], red);
  box([0.48, 0.24, 0.16], [0.66, 1.08, -2.49], red);

  const route = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.34), new THREE.MeshBasicMaterial({ map: makeSignTexture('OSHODI') }));
  route.position.set(0, 1.72, 2.34); route.rotation.y = Math.PI; group.add(route);

  for (const x of [-0.92, 0.92]) {
    for (const z of [-1.5, 1.5]) {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.22, 14), black);
      wheel.rotation.z = Math.PI / 2; wheel.position.set(x, 0.42, z); wheel.castShadow = true; group.add(wheel); wheels.push(wheel);
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.235, 10), chrome);
      hub.rotation.z = Math.PI / 2; hub.position.copy(wheel.position); group.add(hub);
    }
  }
  return { group, wheels };
}

export function initDanfos(scene, world) {
  const routeZ = world.city.starterCorridor?.routeZ ?? world.city.roadZs[Math.floor(world.city.roadZs.length / 2)];
  const stopX = world.city.starterCorridor?.busStops?.[0]?.x ?? 20;
  const buses = [];
  const specs = [
    { x: -92, lane: routeZ - 3.2, direction: 1, speed: 9.2 },
    { x: 48, lane: routeZ - 3.2, direction: 1, speed: 10.4 },
    { x: 108, lane: routeZ + 3.2, direction: -1, speed: 8.7 },
    { x: -34, lane: routeZ + 3.2, direction: -1, speed: 9.8 },
  ];
  for (const spec of specs) {
    const model = createDanfo();
    model.group.position.set(spec.x, 0.08, spec.lane);
    model.group.rotation.y = spec.direction > 0 ? Math.PI / 2 : -Math.PI / 2;
    scene.add(model.group);
    buses.push({ ...spec, group: model.group, wheels: model.wheels, stopTimer: 0, stoppedAtStop: false });
  }
  world.danfos = { buses, routeZ, stopX };
}

export function updateDanfos(world, dt) {
  const state = world.danfos;
  if (!state) return;
  const allVehicles = [...(world.traffic || []), ...state.buses];
  for (const bus of state.buses) {
    if (bus.stopTimer > 0) bus.stopTimer = Math.max(0, bus.stopTimer - dt);
    if (!bus.stoppedAtStop && Math.abs(bus.group.position.x - state.stopX) < 2.8) {
      bus.stopTimer = 1.5;
      bus.stoppedAtStop = true;
    }
    if (bus.stoppedAtStop && ((bus.direction > 0 && bus.group.position.x > state.stopX + 12) || (bus.direction < 0 && bus.group.position.x < state.stopX - 12))) {
      bus.stoppedAtStop = false;
    }
    let speed = bus.stopTimer > 0 ? 0 : bus.speed;
    let lead = Infinity;
    for (const other of allVehicles) {
      if (other === bus || !other.group && !other.pos) continue;
      const pos = other.group?.position || other.pos;
      const sameLane = Math.abs(pos.z - bus.group.position.z) < 2.4;
      const ahead = (pos.x - bus.group.position.x) * bus.direction;
      if (sameLane && ahead > 0 && ahead < lead) lead = ahead;
    }
    if (lead < 10) speed *= Math.max(0, Math.min(1, (lead - 2.5) / 7.5));
    bus.group.position.x += bus.direction * speed * dt;
    bus.group.rotation.y = bus.direction > 0 ? Math.PI / 2 : -Math.PI / 2;
    for (const wheel of bus.wheels) wheel.rotation.x -= bus.direction * speed * dt / 0.38;
    if (bus.direction > 0 && bus.group.position.x > HALF - 24) bus.group.position.x = -HALF + 24;
    if (bus.direction < 0 && bus.group.position.x < -HALF + 24) bus.group.position.x = HALF - 24;
  }
}
