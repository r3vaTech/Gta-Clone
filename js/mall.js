import * as THREE from 'three';
import { blockStart, HALF, pointBlocked } from './city.js';
import { showToast } from './hud.js';
import { sfxPickup, sfxMissionPass } from './sound.js';

// THE GALLERIA: glass doors on a mid-town block, and behind them (well,
// behind a teleport) a real interior — food court, a fountain that eats
// coins, and a daily gift kiosk. The room floats out past the harbor
// where nobody will ever walk to it.

function galleriaSignTexture() {
  const c = document.createElement('canvas');
  c.width = 768; c.height = 192;
  const g = c.getContext('2d');
  g.fillStyle = '#102a32';
  g.fillRect(0, 0, c.width, c.height);
  g.strokeStyle = '#49d0c0';
  g.lineWidth = 8;
  g.strokeRect(8, 8, c.width - 16, c.height - 16);
  g.fillStyle = '#f7d27b';
  g.font = '900 58px Arial';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText('THE GALLERIA', c.width / 2, 78);
  g.fillStyle = '#b8f1e7';
  g.font = '700 25px Arial';
  g.fillText('OPEN BUILDING  •  PRESS E TO ENTER', c.width / 2, 139);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function initMall(scene, world, save) {
  let door = new THREE.Vector3(blockStart(5) + 8, 0, blockStart(6) + 8);
  const probe = new THREE.Vector3(door.x, 1, door.z);
  if (pointBlocked(probe, world.city.colliders, 2)) door = new THREE.Vector3(blockStart(5) + 30, 0, blockStart(6) + 3);

  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 3.4, 0.5),
    new THREE.MeshStandardMaterial({ color: 0x3a4a5a, metalness: 0.5, roughness: 0.3 })
  );
  frame.position.copy(door).setY(1.7);
  scene.add(frame);
  const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(2.4, 2.8),
    new THREE.MeshBasicMaterial({ color: 0x9fd8f7, transparent: true, opacity: 0.5, side: THREE.DoubleSide })
  );
  glass.position.copy(door).add(new THREE.Vector3(0, 1.6, 0.3));
  scene.add(glass);
  const doorMesh = new THREE.Mesh(
    new THREE.BoxGeometry(2.15, 2.7, 0.12),
    new THREE.MeshStandardMaterial({ color: 0x294452, metalness: 0.25, roughness: 0.35 })
  );
  const doorPivot = new THREE.Group();
  doorPivot.position.copy(door).add(new THREE.Vector3(-1.075, 0, 0.38));
  doorMesh.position.set(1.075, 1.45, 0);
  doorPivot.add(doorMesh);
  scene.add(doorPivot);
  const sign = new THREE.Mesh(
    new THREE.PlaneGeometry(5.4, 1.35),
    new THREE.MeshBasicMaterial({ map: galleriaSignTexture(), side: THREE.DoubleSide })
  );
  sign.position.copy(door).add(new THREE.Vector3(0, 4.35, 0.05));
  scene.add(sign);
  const canopy = new THREE.Mesh(
    new THREE.BoxGeometry(4.1, 0.18, 1.4),
    new THREE.MeshStandardMaterial({ color: 0x183b43, emissive: 0x0b3034, emissiveIntensity: 0.5, roughness: 0.45 })
  );
  canopy.position.copy(door).add(new THREE.Vector3(0, 3.15, 0.1));
  scene.add(canopy);
  const archMat = new THREE.MeshStandardMaterial({ color: 0xd39a4c, emissive: 0x4a2710, emissiveIntensity: 0.25, roughness: 0.55 });
  for (const x of [-3.0, 3.0]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.28, 4.2, 0.28), archMat);
    post.position.copy(door).add(new THREE.Vector3(x, 2.1, -0.05));
    scene.add(post);
  }
  const archBeam = new THREE.Mesh(new THREE.BoxGeometry(6.3, 0.3, 0.32), archMat);
  archBeam.position.copy(door).add(new THREE.Vector3(0, 4.15, -0.05));
  scene.add(archBeam);
  const entranceLight = new THREE.PointLight(0x49d0c0, 2.2, 12);
  entranceLight.position.copy(door).add(new THREE.Vector3(0, 2.5, 1.2));
  scene.add(entranceLight);
  // Two short light strips point toward the door without adding another circular marker.
  const stripMat = new THREE.MeshBasicMaterial({ color: 0x49d0c0, transparent: true, opacity: 0.65 });
  for (const x of [-1.15, 1.15]) {
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.035, 3.2), stripMat);
    strip.position.copy(door).add(new THREE.Vector3(x, 0.08, 2.1));
    scene.add(strip);
  }

  // the interior: a lit platform on stilts out in the bay (inside the
  // player-bounds envelope — clampPlayerBounds allows x up to HALF+256)
  const room = new THREE.Vector3(HALF + 150, 30, -250);
  const stilt = new THREE.Mesh(
    new THREE.CylinderGeometry(2.2, 3, 30, 8),
    new THREE.MeshStandardMaterial({ color: 0x5a6068, roughness: 0.8 })
  );
  stilt.position.set(room.x, 15, room.z);
  scene.add(stilt);
  const floorMat = new THREE.MeshStandardMaterial({ color: 0xd8d2c8, roughness: 0.85 });
  const floor = new THREE.Mesh(new THREE.BoxGeometry(36, 1, 26), floorMat);
  floor.position.set(room.x, 29.5, room.z);
  scene.add(floor);
  world.city.colliders.push({ x0: room.x - 18, x1: room.x + 18, z0: room.z - 13, z1: room.z + 13, h: 30 });
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xb8ccd8, roughness: 0.7 });
  for (const [w, h, x, z, rot] of [[36, 6, 0, -13, 0], [36, 6, 0, 13, 0], [26, 6, -18, 0, 1], [26, 6, 18, 0, 1]]) {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.4), wallMat);
    wall.position.set(room.x + x, 33, room.z + z);
    if (rot) wall.rotation.y = Math.PI / 2;
    scene.add(wall);
  }
  const light = new THREE.PointLight(0xfff2d8, 2.4, 46);
  light.position.set(room.x, 35.5, room.z);
  scene.add(light);
  // the fountain
  const fountain = new THREE.Mesh(
    new THREE.CylinderGeometry(2, 2.4, 0.8, 12),
    new THREE.MeshStandardMaterial({ color: 0x7cb8d8, roughness: 0.3 })
  );
  fountain.position.set(room.x, 30.4, room.z);
  scene.add(fountain);
  // the gift kiosk
  const kiosk = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.6, 1.2), new THREE.MeshStandardMaterial({ color: 0xc95a8a, roughness: 0.6 }));
  kiosk.position.set(room.x + 12, 30.8, room.z - 8);
  scene.add(kiosk);
  const prop = (w, h, d, x, y, z, color) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color, roughness: 0.75 }));
    m.position.set(room.x + x, y, room.z + z);
    scene.add(m);
    return m;
  };
  prop(7, 1.1, 1.2, -8, 30.9, -8, 0x835d40); // reception counter
  prop(2.4, 0.45, 0.8, -8, 32.0, -8, 0xe2b15f); // counter top
  for (const x of [-4, 1, 6]) prop(2.2, 0.45, 0.8, x, 30.6, 6.5, 0x536b75); // seating
  for (const x of [-12, 12]) {
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.7, 0.7, 8), new THREE.MeshStandardMaterial({ color: 0xb56f42 }));
    pot.position.set(room.x + x, 30.7, room.z + 7.5);
    scene.add(pot);
    const plant = new THREE.Mesh(new THREE.ConeGeometry(1.1, 2.7, 8), new THREE.MeshStandardMaterial({ color: 0x3f8152 }));
    plant.position.set(room.x + x, 32.2, room.z + 7.5);
    scene.add(plant);
  }

  world.mall = {
    door, room, doorMesh, doorPivot, doorOpen: 0, enterT: 0,
    fountainPos: fountain.position, kioskPos: kiosk.position,
    returnPos: null, giftDay: save?.mallGiftDay ?? -99, tossed: 0,
  };
}

export function updateMall(world, dt, pressed) {
  const ml = world.mall;
  if (!ml) return;
  const player = world.player;
  world.mallHint = null;
  const onFoot = !player.inCar && !player.inHeli && !player.inBoat;
  if (!onFoot) return;

  ml.doorOpen = Math.max(0, ml.doorOpen - dt * 1.8);
  ml.doorPivot.rotation.y = -Math.min(1, ml.doorOpen) * Math.PI * 0.48;
  if (ml.enterT > 0) {
    ml.enterT -= dt;
    if (ml.enterT <= 0) {
      ml.returnPos = player.pos.clone();
      player.pos.set(ml.room.x - 14, 30.2, ml.room.z);
      player.vy = 0;
      sfxPickup();
      showToast('THE GALLERIA — welcome inside');
    }
    return;
  }

  // street door → inside
  if (player.pos.y < 3 && Math.hypot(player.pos.x - ml.door.x, player.pos.z - ml.door.z) < 2.5) {
    world.mallHint = 'Press <b>E</b> — THE GALLERIA is open';
    if (pressed['KeyE']) {
      ml.doorOpen = 1;
      ml.enterT = 0.42;
      player.heading = Math.atan2(ml.door.z - player.pos.z, ml.door.x - player.pos.x);
      showToast('Door open — entering THE GALLERIA');
    }
    return;
  }

  // inside?
  if (Math.abs(player.pos.y - 30) > 4 || Math.hypot(player.pos.x - ml.room.x, player.pos.z - ml.room.z) > 26) return;
  player.pos.x = Math.min(ml.room.x + 16, Math.max(ml.room.x - 15.5, player.pos.x));
  player.pos.z = Math.min(ml.room.z + 10.5, Math.max(ml.room.z - 10.5, player.pos.z));

  // exit near the west edge
  if (player.pos.x < ml.room.x - 12) {
    world.mallHint = 'Press <b>E</b> to leave THE GALLERIA';
    if (pressed['KeyE']) {
      const back = ml.returnPos || ml.door;
      player.pos.set(back.x + 1.5, 0.2, back.z + 1.5);
      player.vy = 0;
      return;
    }
  }

  // the fountain takes donations
  if (Math.hypot(player.pos.x - ml.fountainPos.x, player.pos.z - ml.fountainPos.z) < 3.4) {
    world.mallHint = 'Press <b>E</b> — toss a dollar in the fountain (it judges you)';
    if (pressed['KeyE'] && world.money >= 1) {
      world.money -= 1;
      ml.tossed++;
      sfxPickup();
      if (ml.tossed % 20 === 0) { world.money += 100; showToast('The fountain, moved by your persistence, refunds $100'); }
      else showToast(ml.tossed % 2 ? 'Plink.' : 'Plonk.');
    }
    return;
  }

  // daily gift kiosk
  if (Math.hypot(player.pos.x - ml.kioskPos.x, player.pos.z - ml.kioskPos.z) < 2.6) {
    if (ml.giftDay === world.dailyDay) { world.mallHint = 'GIFT KIOSK — one per customer per day, the sign is very firm'; return; }
    world.mallHint = 'Press <b>E</b> — the GIFT KIOSK owes every visitor one daily mystery box';
    if (pressed['KeyE']) {
      ml.giftDay = world.dailyDay;
      const roll = Math.random();
      if (roll < 0.5) { const c = 50 + Math.floor(Math.random() * 150); world.money += c; showToast(`Mystery box: $${c}`); }
      else if (roll < 0.8) { world.player.health = world.maxHealth; showToast('Mystery box: a spa voucher — full health'); }
      else { world.money += 500; sfxMissionPass(); showToast('Mystery box: JACKPOT — $500'); }
      world.onSave?.();
    }
  }
}
