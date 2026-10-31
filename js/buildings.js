import * as THREE from 'three';
import { HALF } from './city.js';
import { showToast } from './hud.js';

const TYPE_LABEL = { home: 'RESIDENTIAL ROOM', shop: 'LOCAL SHOP', office: 'OFFICE SPACE' };

function addInterior(scene, world) {
  const room = new THREE.Vector3(HALF + 190, 30, 110);
  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(30, 1, 22),
    new THREE.MeshStandardMaterial({ color: 0xb5a58e, roughness: 0.84 })
  );
  floor.position.set(room.x, 29.5, room.z);
  scene.add(floor);
  world.city.colliders.push({ x0: room.x - 15, x1: room.x + 15, z0: room.z - 11, z1: room.z + 11, h: 30 });
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x354550, roughness: 0.8 });
  for (const [w, h, x, z, rot] of [[30, 5, 0, -11, 0], [30, 5, 0, 11, 0], [22, 5, -15, 0, 1], [22, 5, 15, 0, 1]]) {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.35), wallMat);
    wall.position.set(room.x + x, 32, room.z + z);
    if (rot) wall.rotation.y = Math.PI / 2;
    scene.add(wall);
  }
  const light = new THREE.PointLight(0xffd99a, 3.4, 42);
  light.position.set(room.x, 35, room.z);
  scene.add(light);
  const fill = new THREE.HemisphereLight(0xffe4bd, 0x2e414a, 1.1);
  fill.position.set(room.x, 34, room.z);
  scene.add(fill);
  const action = new THREE.Mesh(
    new THREE.BoxGeometry(4, 1.1, 1.3),
    new THREE.MeshStandardMaterial({ color: 0x3b8e83, emissive: 0x123f3b, emissiveIntensity: 0.6 })
  );
  action.position.set(room.x + 5, 30.9, room.z - 5);
  scene.add(action);
  return { room, actionPos: action.position };
}

export function initBuildings(scene, world) {
  const interior = addInterior(scene, world);
  world.buildings = {
    entries: world.city.buildings || [],
    interior,
    active: null,
    returnPos: null,
    enterT: 0,
    hint: null,
  };
}

export function updateBuildings(world, dt, pressed) {
  const state = world.buildings;
  if (!state) return;
  const player = world.player;
  state.hint = null;
  if (player.inCar || player.inHeli || player.inBoat) return;

  if (state.enterT > 0) {
    state.enterT -= dt;
    if (state.enterT <= 0) {
      player.pos.set(state.interior.room.x - 11, 30.2, state.interior.room.z);
      player.vy = 0;
      player.heading = Math.PI / 2;
      world.cameraYawTarget = Math.PI / 2;
      world.cameraYawT = 1.4;
      showToast(`${TYPE_LABEL[state.active.type]} — actions are limited here`);
    }
    return;
  }

  if (state.active) {
    player.pos.x = Math.min(state.interior.room.x + 11.2, Math.max(state.interior.room.x - 11.2, player.pos.x));
    player.pos.z = Math.min(state.interior.room.z + 8.8, Math.max(state.interior.room.z - 8.8, player.pos.z));
    if (player.pos.x < state.interior.room.x - 10) {
      state.hint = 'Press <b>E</b> to leave this building';
      if (pressed['KeyE']) {
        const back = state.returnPos || state.active.door;
        player.pos.set(back.x, 0.2, back.z + 1.2);
        player.vy = 0;
        state.active = null;
      }
      return;
    }
    if (Math.hypot(player.pos.x - state.interior.actionPos.x, player.pos.z - state.interior.actionPos.z) < 3) {
      const type = state.active.type;
      const action = type === 'home' ? 'Rest here to recover — housing actions will be added next' :
        type === 'shop' ? 'Shop counter: purchases are restricted to this building type' :
        'Office desk: job actions are restricted to this building type';
      state.hint = `Press <b>E</b> — ${action}`;
      if (pressed['KeyE']) showToast(action);
    }
    return;
  }

  let nearest = null;
  let best = 2.6;
  for (const entry of state.entries) {
    if (world.mall?.door && Math.hypot(entry.door.x - world.mall.door.x, entry.door.z - world.mall.door.z) < 5) continue;
    const d = Math.hypot(entry.door.x - player.pos.x, entry.door.z - player.pos.z);
    if (d < best) { best = d; nearest = entry; }
  }
  if (!nearest) return;
  state.hint = `Press <b>E</b> to enter ${TYPE_LABEL[nearest.type]}`;
  if (pressed['KeyE']) {
    state.active = nearest;
    state.returnPos = player.pos.clone();
    state.enterT = 0.35;
    player.vel.set(0, 0, 0);
    player.heading = Math.atan2(nearest.door.z - player.pos.z, nearest.door.x - player.pos.x);
    showToast('Door open — entering building');
  }
}
