import * as THREE from 'three';
import { showToast, setHint } from './hud.js';
import { sfxMissionPass, sfxPickup } from './sound.js';

function makeBeacon(scene, color) {
  const group = new THREE.Group();
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 3.2, 8),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8 })
  );
  pole.position.y = 1.6;
  group.add(pole);
  const flag = new THREE.Mesh(
    new THREE.ConeGeometry(0.55, 0.9, 4),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.92 })
  );
  flag.rotation.z = Math.PI / 2;
  flag.position.set(0.35, 2.8, 0);
  group.add(flag);
  const glow = new THREE.PointLight(color, 1.5, 8);
  glow.position.set(0, 2.2, 0);
  group.add(glow);
  scene.add(group);
  return group;
}

function chooseStops(world) {
  const roads = world.city.roadXs;
  const mid = Math.max(1, Math.floor(roads.length / 2));
  const pickup = new THREE.Vector3(roads[mid], 0, Math.min(world.city.roadZs[mid] + 48, 260));
  const drop = new THREE.Vector3(roads[Math.min(roads.length - 1, mid + 1)], 0, pickup.z + 34);
  return { pickup, drop };
}

export function initMainlandJob(scene, world, save = {}) {
  const stops = chooseStops(world);
  const pickupMarker = makeBeacon(scene, 0xf4c84a);
  const dropMarker = makeBeacon(scene, 0x49d0c0);
  pickupMarker.visible = false;
  dropMarker.visible = false;
  world.mainlandJob = {
    phase: 'offer',
    completed: save.mainlandJobDone | 0,
    reward: 250,
    pickup: stops.pickup,
    drop: stops.drop,
    pickupMarker,
    dropMarker,
    hint: null,
  };
}

function beginShift(world) {
  const job = world.mainlandJob;
  job.phase = 'pickup';
  job.reward = 250 + job.completed * 25;
  job.pickupMarker.position.copy(job.pickup);
  job.pickupMarker.visible = true;
  job.dropMarker.visible = false;
  sfxPickup();
  showToast('SHIFT ACCEPTED — collect the package at the yellow flag');
  world.onSave?.();
}

function collectPackage(world) {
  const job = world.mainlandJob;
  job.phase = 'deliver';
  job.pickupMarker.visible = false;
  job.dropMarker.position.copy(job.drop);
  job.dropMarker.visible = true;
  sfxPickup();
  showToast('PACKAGE COLLECTED — deliver it to the teal flag');
}

function completeShift(world) {
  const job = world.mainlandJob;
  world.money += job.reward;
  job.completed++;
  job.phase = 'offer';
  job.dropMarker.visible = false;
  sfxMissionPass();
  showToast(`SHIFT COMPLETE +$${job.reward} — wallet balance $${world.money}`);
  world.onSave?.();
}

export function updateMainlandJob(world, dt, pressed) {
  const job = world.mainlandJob;
  if (!job) return;
  job.hint = null;
  if (world.player.inCar || world.player.inHeli || world.player.inBoat) return;

  const player = world.player;
  const galleria = world.mall?.door;
  if (job.phase === 'offer') {
    if (galleria && Math.hypot(player.pos.x - galleria.x, player.pos.z - galleria.z) < 4.2) {
      job.hint = 'Press <b>E</b> — ask about a starter shift at THE GALLERIA';
      if (pressed['KeyE']) beginShift(world);
    }
    return;
  }

  const target = job.phase === 'pickup' ? job.pickup : job.drop;
  const distance = Math.hypot(player.pos.x - target.x, player.pos.z - target.z);
  if (distance > 7) {
    job.hint = job.phase === 'pickup'
      ? 'STARTER SHIFT — follow the yellow flag to collect the package'
      : 'STARTER SHIFT — follow the teal flag to deliver the package';
    return;
  }

  if (job.phase === 'pickup') {
    job.hint = 'Press <b>E</b> — collect the package';
    if (pressed['KeyE']) collectPackage(world);
  } else {
    job.hint = 'Press <b>E</b> — hand over the package';
    if (pressed['KeyE']) completeShift(world);
  }
}
