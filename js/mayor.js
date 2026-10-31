import * as THREE from 'three';
import { pointBlocked, ROAD } from './city.js';
import { showToast, showNews, showMissionMsg } from './hud.js';
import { sfxMissionPass, sfxPickup } from './sound.js';

// City Hall: the crown got you respect — now get power. Win the office
// (crown + reputation + a very legal $20,000 campaign donation) and the
// policy desk is yours: how hard the police push, how thick the traffic
// runs, how loose the Lucky 7 pays. Plus a salary, obviously. This city
// pays its criminals best when they're elected.

const CAMPAIGN_COST = 20000;
const REP_NEEDED = 2000;
const SALARY = 800;

const POLICE_STANCES = [
  { name: 'CHILL', heat: 0.5, extra: 0 },     // heat fades twice as fast
  { name: 'NORMAL', heat: 1, extra: 0 },
  { name: 'MARTIAL', heat: 1.8, extra: 1 },   // more cops, stubborn stars
];
const TRAFFIC_MODES = [
  { name: 'CALM', flow: 0.6 },
  { name: 'NORMAL', flow: 1 },
  { name: 'GRIDLOCK', flow: 1.5 },
];
const CASINO_MODES = [
  { name: 'HOUSE RULES', odds: 0 },  // jackpots nearly never
  { name: 'NORMAL', odds: 1 },
  { name: 'LOOSE SLOTS', odds: 2 },  // the city eats the losses
];

export function initMayor(scene, world, save) {
  // Civic hall lives in the block-side plaza beside the spawn intersection,
  // never on the asphalt lane where the old prototype placed it.
  const plazaOffset = ROAD / 2 + 22;
  let hallPos = world.city.spawn.clone().add(new THREE.Vector3(plazaOffset, 0, -plazaOffset));
  const probe = new THREE.Vector3(hallPos.x, 1, hallPos.z);
  if (pointBlocked(probe, world.city.colliders, 2)) hallPos = world.city.spawn.clone().add(new THREE.Vector3(-plazaOffset, 0, -plazaOffset));

  const plaza = new THREE.Mesh(
    new THREE.BoxGeometry(26, 0.22, 24),
    new THREE.MeshStandardMaterial({ color: 0x28262a, roughness: 0.85, metalness: 0.08 })
  );
  plaza.position.copy(hallPos).setY(0.11);
  plaza.receiveShadow = true;
  scene.add(plaza);
  const plazaTrim = new THREE.Mesh(
    new THREE.BoxGeometry(22, 0.035, 20),
    new THREE.MeshBasicMaterial({ color: 0xc89532 })
  );
  plazaTrim.position.copy(hallPos).setY(0.24);
  scene.add(plazaTrim);

  const base = new THREE.Mesh(
    new THREE.BoxGeometry(12, 0.6, 8),
    new THREE.MeshStandardMaterial({ color: 0x17181b, roughness: 0.72, metalness: 0.18 })
  );
  base.position.copy(hallPos).setY(0.3);
  scene.add(base);
  for (const dx of [-4, -2, 0, 2, 4]) {
    const col = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.36, 4.2, 10),
      new THREE.MeshStandardMaterial({ color: 0xc89532, roughness: 0.5, metalness: 0.32 })
    );
    col.position.set(hallPos.x + dx, 2.6, hallPos.z + 2.3);
    col.castShadow = true;
    scene.add(col);
  }
  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(12.6, 0.7, 3.2),
    new THREE.MeshStandardMaterial({ color: 0xc89532, roughness: 0.48, metalness: 0.28 })
  );
  roof.position.copy(hallPos).add(new THREE.Vector3(0, 4.9, 1.7));
  scene.add(roof);
  const doorPos = hallPos.clone().add(new THREE.Vector3(0, 0, 4.15));
  const door = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 3.0, 0.18),
    new THREE.MeshStandardMaterial({ color: 0x08090b, emissive: 0x4b2c08, emissiveIntensity: 0.35, metalness: 0.55, roughness: 0.3 })
  );
  door.position.copy(doorPos).setY(1.55);
  scene.add(door);
  const steps = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.28, 1.8), new THREE.MeshStandardMaterial({ color: 0x555159, roughness: 0.8 }));
  steps.position.copy(hallPos).add(new THREE.Vector3(0, 0.18, 4.8));
  scene.add(steps);
  const c = document.createElement('canvas');
  c.width = 192; c.height = 40;
  const g = c.getContext('2d');
  g.fillStyle = '#6a6656'; g.fillRect(0, 0, 192, 40);
  g.fillStyle = '#f2eeda'; g.font = 'bold 20px Georgia'; g.textAlign = 'center';
  g.fillText('CITY HALL', 96, 27);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(5, 1.05), new THREE.MeshBasicMaterial({ map: tex }));
  sign.position.copy(hallPos).add(new THREE.Vector3(0, 4.2, 2.45));
  sign.rotation.y = Math.PI;
  scene.add(sign);

  world.policy = { police: 1, traffic: 1, casino: 1, ...(save?.policy || {}) };
  world.mayor = {
    hallPos: doorPos,
    elected: !!save?.mayor,
    salaryDay: save?.salaryDay ?? -1,
  };
}

// numbers the rest of the game reads
export function policeHeat(world) { return POLICE_STANCES[world.policy?.police ?? 1].heat; }
export function policeExtra(world) { return POLICE_STANCES[world.policy?.police ?? 1].extra; }
export function trafficFlow(world) { return TRAFFIC_MODES[world.policy?.traffic ?? 1].flow; }
export function casinoOdds(world) { return CASINO_MODES[world.policy?.casino ?? 1].odds; }

export function updateMayor(world, dt, pressed) {
  const m = world.mayor;
  if (!m) return;
  const player = world.player;
  world.mayorHint = null;
  const d = Math.hypot(player.pos.x - m.hallPos.x, player.pos.z - m.hallPos.z);
  if (d > 5 || player.inCar || player.inHeli) return;

  if (!m.elected) {
    if (!world.crowned) {
      world.mayorHint = 'CITY HALL — "come back when you\'re somebody" (be crowned King first)';
      return;
    }
    if ((world.rep | 0) < REP_NEEDED) {
      world.mayorHint = `CITY HALL — the King needs ${REP_NEEDED} reputation to run (you: ${world.rep | 0})`;
      return;
    }
    world.mayorHint = `Press <b>E</b> to RUN FOR MAYOR — $${CAMPAIGN_COST} campaign, landslide guaranteed`;
    if (pressed['KeyE']) {
      if (world.money < CAMPAIGN_COST) { showToast('The campaign chest is light'); return; }
      world.money -= CAMPAIGN_COST;
      m.elected = true;
      world.fwT = 4; // fireworks, naturally
      if (world.stats) world.stats.mayor = 1;
      sfxMissionPass();
      showMissionMsg('🏛 MAYOR OF THE CITY', 'Elected in a landslide. Turnout: suspicious. Mandate: absolute.', '#ffd24a');
      showNews('the new mayor\'s first act: declaring the election "extremely legitimate"');
      world.onSave?.();
    }
    return;
  }

  // the policy desk
  world.nearKiosk = true;
  const p = world.policy;
  const salaryReady = m.salaryDay !== world.dailyDay;
  world.mayorHint = 'POLICY DESK — ' +
    `<b>1</b> Police: ${POLICE_STANCES[p.police].name} · ` +
    `<b>2</b> Traffic: ${TRAFFIC_MODES[p.traffic].name} · ` +
    `<b>3</b> Casino: ${CASINO_MODES[p.casino].name} · ` +
    `<b>4</b> Salary ${salaryReady ? `$${SALARY}` : '✔ paid'}`;

  if (pressed['Digit1']) {
    p.police = (p.police + 1) % POLICE_STANCES.length;
    sfxPickup();
    showToast(`POLICE STANCE: ${POLICE_STANCES[p.police].name}`);
    showNews(p.police === 0 ? 'the mayor slashes the police budget; the police send a fruit basket'
      : p.police === 2 ? 'martial policing announced — downtown grumbles, criminals sweat'
        : 'police funding returns to normal, whatever that means');
    world.onSave?.();
  }
  if (pressed['Digit2']) {
    p.traffic = (p.traffic + 1) % TRAFFIC_MODES.length;
    sfxPickup();
    showToast(`TRAFFIC POLICY: ${TRAFFIC_MODES[p.traffic].name}`);
    world.onSave?.();
  }
  if (pressed['Digit3']) {
    p.casino = (p.casino + 1) % CASINO_MODES.length;
    sfxPickup();
    showToast(`CASINO REGULATION: ${CASINO_MODES[p.casino].name}`);
    showNews(p.casino === 2 ? 'the Lucky 7 ordered to "loosen up" — economists faint' :
      p.casino === 0 ? 'casino odds tightened; the house sends the mayor flowers' :
        'gambling regulation returns to baseline');
    world.onSave?.();
  }
  if (pressed['Digit4'] && salaryReady) {
    m.salaryDay = world.dailyDay;
    world.money += SALARY;
    sfxMissionPass();
    showToast(`MAYORAL SALARY +$${SALARY} — public service is its own reward, plus this`);
    world.onSave?.();
  }
}
