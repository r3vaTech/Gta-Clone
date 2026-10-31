import * as THREE from 'three';

// City layout: N x N blocks separated by roads, surrounded by a perimeter road.
export const BLOCK = 60;
export const ROAD = 16;
export const N = 10; // 10x10 grid — a bigger metropolis (was 8x8)
export const CITY = N * BLOCK + (N + 1) * ROAD; // 624
export const HALF = CITY / 2;

export const roadCenter = (i) => -HALF + ROAD / 2 + i * (BLOCK + ROAD);
export const blockStart = (i) => -HALF + ROAD + i * (BLOCK + ROAD);

// Building facades: a wall map + an emissive map (lit windows only, used at night).
function windowTextures(base) {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 512;
  const g = c.getContext('2d');
  const e = document.createElement('canvas');
  e.width = 256; e.height = 512;
  const ge = e.getContext('2d');

  g.fillStyle = base;
  g.fillRect(0, 0, 256, 512);
  ge.fillStyle = '#000';
  ge.fillRect(0, 0, 256, 512);

  // concrete weathering
  for (let i = 0; i < 700; i++) {
    g.fillStyle = `rgba(${Math.random() < 0.5 ? '255,255,255' : '0,0,0'},${Math.random() * 0.05})`;
    g.fillRect(Math.random() * 256, Math.random() * 512, 3, 3);
  }

  const office = Math.random() < 0.5;
  const glassTints = ['#5a7186', '#516478', '#62798e', '#46586a', '#6a8298'];

  if (office) {
    // glass ribbon floors
    for (let y = 14; y < 492; y += 26) {
      g.fillStyle = 'rgba(0,0,0,0.35)';
      g.fillRect(8, y - 2, 240, 20); // recess
      for (let x = 10; x < 244; x += 20) {
        // day look is always glass; warm light comes from the emissive map at night
        g.fillStyle = glassTints[(Math.random() * glassTints.length) | 0];
        g.fillRect(x, y, 17, 16);
        if (Math.random() < 0.42) { ge.fillStyle = '#e8a23a'; ge.fillRect(x, y, 17, 16); }
      }
      // floor slab line
      g.fillStyle = 'rgba(0,0,0,0.3)';
      g.fillRect(0, y + 19, 256, 3);
    }
  } else {
    // apartment punched windows
    for (let y = 16; y < 490; y += 30) {
      for (let x = 14; x < 236; x += 26) {
        g.fillStyle = 'rgba(0,0,0,0.4)';
        g.fillRect(x - 2, y - 2, 20, 24); // frame shadow
        g.fillStyle = glassTints[(Math.random() * glassTints.length) | 0];
        g.fillRect(x, y, 16, 20);
        if (Math.random() < 0.42) { ge.fillStyle = '#e8a23a'; ge.fillRect(x, y, 16, 20); }
        // sill
        g.fillStyle = 'rgba(255,255,255,0.12)';
        g.fillRect(x - 2, y + 20, 20, 2);
      }
    }
  }

  // parapet band at the top
  g.fillStyle = 'rgba(0,0,0,0.28)';
  g.fillRect(0, 0, 256, 8);

  // street grime at the bottom
  const grime = g.createLinearGradient(0, 512, 0, 430);
  grime.addColorStop(0, 'rgba(10,10,8,0.4)');
  grime.addColorStop(1, 'rgba(10,10,8,0)');
  g.fillStyle = grime;
  g.fillRect(0, 430, 256, 82);

  const map = new THREE.CanvasTexture(c);
  map.colorSpace = THREE.SRGBColorSpace;
  const emissive = new THREE.CanvasTexture(e);
  emissive.colorSpace = THREE.SRGBColorSpace;
  return { map, emissive };
}

function roadTexture() {
  const c = document.createElement('canvas');
  c.width = 128; c.height = 128;
  const g = c.getContext('2d');
  g.fillStyle = '#28282d';
  g.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 350; i++) {
    g.fillStyle = `rgba(255,255,255,${Math.random() * 0.035})`;
    g.fillRect(Math.random() * 128, Math.random() * 128, 2, 2);
  }
  for (let i = 0; i < 60; i++) {
    g.fillStyle = `rgba(0,0,0,${Math.random() * 0.25})`;
    g.fillRect(Math.random() * 128, Math.random() * 128, 4, 3);
  }
  g.fillStyle = '#a8954a';
  g.fillRect(62, 8, 4, 48);
  g.fillRect(62, 72, 4, 48);
  g.fillStyle = '#e2e0d2';
  g.fillRect(5, 0, 2, 128);
  g.fillRect(121, 0, 2, 128);
  g.fillStyle = 'rgba(232,232,224,0.78)';
  for (let y = 0; y < 128; y += 22) {
    g.fillRect(31, y, 2, 11);
    g.fillRect(95, y, 2, 11);
  }
  g.fillStyle = '#8e8e90';
  g.fillRect(2, 0, 2, 128);
  g.fillRect(124, 0, 2, 128);
  const t = new THREE.CanvasTexture(c);
  t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function billboardTexture() {
  const words = ['VICE 24H', 'CLUCKIN', 'OPEN CITY', 'SPRUNK', 'LIQUOR', 'MOTEL', 'CASINO', 'BURGER'];
  const colors = ['#ff3d6e', '#3dd2ff', '#ffd23d', '#7dff5a', '#ff7a3d', '#c95aff'];
  const c = document.createElement('canvas');
  c.width = 256; c.height = 96;
  const g = c.getContext('2d');
  g.fillStyle = '#0a0a10';
  g.fillRect(0, 0, 256, 96);
  const col = colors[(Math.random() * colors.length) | 0];
  g.strokeStyle = col;
  g.lineWidth = 5;
  g.strokeRect(6, 6, 244, 84);
  g.fillStyle = col;
  g.font = 'bold 38px Arial';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(words[(Math.random() * words.length) | 0], 128, 50);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function helipadTexture() {
  const c = document.createElement('canvas');
  c.width = 128; c.height = 128;
  const g = c.getContext('2d');
  g.fillStyle = '#2a2c30';
  g.fillRect(0, 0, 128, 128);
  g.strokeStyle = '#e8c84a';
  g.lineWidth = 6;
  g.beginPath();
  g.arc(64, 64, 50, 0, Math.PI * 2);
  g.stroke();
  g.fillStyle = '#e8c84a';
  g.font = 'bold 64px Arial';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText('H', 64, 68);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function buildCity(scene) {
  const colliders = [];   // {x0,z0,x1,z1,h}
  const buildings = [];
  const pedRects = [];
  const roadXs = [];
  const roadZs = [];
  const helipads = [];
  const windowMats = []; // facade materials, dimmed/lit by the day/night cycle

  // scrubland beyond the city
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(CITY * 3, CITY * 3),
    new THREE.MeshLambertMaterial({ color: 0x344437 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.05;
  ground.receiveShadow = true;
  scene.add(ground);

  // asphalt base slab
  const slab = new THREE.Mesh(
    new THREE.PlaneGeometry(CITY, CITY),
    new THREE.MeshLambertMaterial({ color: 0x1d1d22 })
  );
  slab.rotation.x = -Math.PI / 2;
  slab.receiveShadow = true;
  scene.add(slab);

  // roads
  const roadTex = roadTexture();
  const roadGeo = new THREE.PlaneGeometry(ROAD, CITY);
  roadGeo.rotateX(-Math.PI / 2);
  for (let i = 0; i <= N; i++) {
    const cx = roadCenter(i);
    roadXs.push(cx);
    roadZs.push(cx);

    const tv = roadTex.clone();
    tv.needsUpdate = true;
    tv.wrapT = THREE.RepeatWrapping;
    tv.repeat.set(1, CITY / ROAD);
    const v = new THREE.Mesh(roadGeo, new THREE.MeshLambertMaterial({ map: tv }));
    v.position.set(cx, 0.04, 0);
    v.receiveShadow = true;
    scene.add(v);

    const th = roadTex.clone();
    th.needsUpdate = true;
    th.wrapT = THREE.RepeatWrapping;
    th.repeat.set(1, CITY / ROAD);
    const h = new THREE.Mesh(roadGeo, new THREE.MeshLambertMaterial({ map: th }));
    h.position.set(0, 0.08, cx);
    h.rotation.y = Math.PI / 2;
    h.receiveShadow = true;
    scene.add(h);
  }
  // raised curbs and zebra crossings give intersections a readable street scale
  const curbMat = new THREE.MeshStandardMaterial({ color: 0x9b9b98, roughness: 0.88 });
  for (let i = 0; i <= N; i++) {
    const cx = roadCenter(i);
    for (const side of [-1, 1]) {
      const curb = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.18, CITY), curbMat);
      curb.position.set(cx + side * (ROAD / 2 + 0.16), 0.12, 0);
      curb.receiveShadow = true;
      scene.add(curb);
      const curbH = new THREE.Mesh(new THREE.BoxGeometry(CITY, 0.18, 0.34), curbMat);
      curbH.position.set(0, 0.12, cx + side * (ROAD / 2 + 0.16));
      curbH.receiveShadow = true;
      scene.add(curbH);
    }
  }
  const crossingMat = new THREE.MeshStandardMaterial({ color: 0xe5e2d7, roughness: 0.78 });
  for (let i = 0; i <= N; i += 2) {
    for (let j = 0; j <= N; j += 2) {
      const x = roadCenter(i);
      const z = roadCenter(j);
      for (let k = -3; k <= 3; k++) {
        const stripeV = new THREE.Mesh(new THREE.BoxGeometry(ROAD - 2, 0.025, 0.38), crossingMat);
        stripeV.position.set(x, 0.105, z + k * 0.72);
        scene.add(stripeV);
        const stripeH = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.025, ROAD - 2), crossingMat);
        stripeH.position.set(x + k * 0.72, 0.11, z);
        scene.add(stripeH);
      }
    }
  }

  // gritty desaturated building palette, windows glow at dusk
  const winSets = ['#202328', '#29251f', '#1d3035', '#3a3025', '#263139', '#332923'].map(windowTextures);
  const roofMat = new THREE.MeshLambertMaterial({ color: 0x111216 });
  const roofPropMat = new THREE.MeshLambertMaterial({ color: 0x34302a });
  const sidewalkMat = new THREE.MeshLambertMaterial({ color: 0x625d54 });
  const grassMat = new THREE.MeshLambertMaterial({ color: 0x344b37 });
  const trunkMat = new THREE.MeshLambertMaterial({ color: 0x4b3322 });
  const leafMat = new THREE.MeshLambertMaterial({ color: 0x2f5c3a });
  const trunkGeo = new THREE.CylinderGeometry(0.22, 0.3, 1.6, 6);
  const leafGeo = new THREE.ConeGeometry(1.7, 3.6, 8);
  const acGeo = new THREE.BoxGeometry(2.2, 1.4, 2.2);
  const antennaGeo = new THREE.CylinderGeometry(0.08, 0.08, 7, 4);

  function addTree(x, z) {
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.set(x, 0.8, z);
    trunk.castShadow = true;
    scene.add(trunk);
    const leaf = new THREE.Mesh(leafGeo, leafMat);
    leaf.position.set(x, 3.2, z);
    leaf.castShadow = true;
    scene.add(leaf);
    colliders.push({ x0: x - 0.5, z0: z - 0.5, x1: x + 0.5, z1: z + 0.5, h: 5 });
  }

  const padTex = helipadTexture();
  let parkCount = 0;

  for (let bi = 0; bi < N; bi++) {
    for (let bj = 0; bj < N; bj++) {
      const sx = blockStart(bi);
      const sz = blockStart(bj);
      const cx = sx + BLOCK / 2;
      const cz = sz + BLOCK / 2;
      const isPark = (bi + bj * N) % 11 === 4;

      const walk = new THREE.Mesh(new THREE.BoxGeometry(BLOCK, 0.24, BLOCK), sidewalkMat);
      walk.position.set(cx, 0.12, cz);
      walk.receiveShadow = true;
      scene.add(walk);

      pedRects.push({ x0: sx + 2, z0: sz + 2, x1: sx + BLOCK - 2, z1: sz + BLOCK - 2 });

      if (isPark) {
        const hasPad = parkCount < 2;
        parkCount++;
        const grass = new THREE.Mesh(new THREE.BoxGeometry(BLOCK - 10, 0.2, BLOCK - 10), grassMat);
        grass.position.set(cx, 0.26, cz);
        grass.receiveShadow = true;
        scene.add(grass);

        if (hasPad) {
          const pad = new THREE.Mesh(
            new THREE.CylinderGeometry(7.5, 7.5, 0.3, 24),
            new THREE.MeshLambertMaterial({ map: padTex })
          );
          pad.position.set(cx, 0.42, cz);
          scene.add(pad);
          helipads.push(new THREE.Vector3(cx, 0.6, cz));
        }

        for (let t = 0; t < 7; t++) {
          const tx = cx + (Math.random() - 0.5) * (BLOCK - 20);
          const tz = cz + (Math.random() - 0.5) * (BLOCK - 20);
          if (hasPad && Math.abs(tx - cx) < 11 && Math.abs(tz - cz) < 11) continue;
          addTree(tx, tz);
        }
        continue;
      }

      for (let li = 0; li < 2; li++) {
        for (let lj = 0; lj < 2; lj++) {
          const lotX = sx + 5 + li * 25 + 12.5;
          const lotZ = sz + 5 + lj * 25 + 12.5;
          const w = 17 + Math.random() * 6;
          const d = 17 + Math.random() * 6;
          const hgt = 12 + Math.floor(Math.random() * 9) * 6;
          const set = winSets[(Math.random() * winSets.length) | 0];
          const sideMat = new THREE.MeshStandardMaterial({
            map: set.map,
            emissive: 0xffffff,
            emissiveMap: set.emissive,
            emissiveIntensity: 0.06,
            roughness: 0.92,
            metalness: 0.0,
          });
          windowMats.push(sideMat);
          const geo = new THREE.BoxGeometry(w, hgt, d);
          const b = new THREE.Mesh(geo, [sideMat, sideMat, roofMat, roofMat, sideMat, sideMat]);
          b.position.set(lotX, hgt / 2 + 0.2, lotZ);
          b.castShadow = true;
          b.receiveShadow = true;
          scene.add(b);
          const collider = { x0: lotX - w / 2, z0: lotZ - d / 2, x1: lotX + w / 2, z1: lotZ + d / 2, h: hgt + 0.5 };
          colliders.push(collider);
          const doorCandidates = [
            new THREE.Vector3(lotX, 0, collider.z1 + 1.5),
            new THREE.Vector3(lotX, 0, collider.z0 - 1.5),
            new THREE.Vector3(collider.x1 + 1.5, 0, lotZ),
            new THREE.Vector3(collider.x0 - 1.5, 0, lotZ),
          ].filter((p) => p.x > sx + 4 && p.x < sx + BLOCK - 4 && p.z > sz + 4 && p.z < sz + BLOCK - 4);
          const door = doorCandidates[0] || new THREE.Vector3(lotX, 0, Math.min(sz + BLOCK - 4, collider.z1 + 1.5));
          buildings.push({
            center: new THREE.Vector3(lotX, 0, lotZ),
            door,
            type: hgt >= 30 ? 'office' : (hgt <= 18 ? 'home' : 'shop'),
            collider,
          });

          // rooftop clutter: AC units + antennas
          const top = hgt + 0.2;
          if (Math.random() < 0.7) {
            const ac = new THREE.Mesh(acGeo, roofPropMat);
            ac.position.set(lotX + (Math.random() - 0.5) * (w - 5), top + 0.7, lotZ + (Math.random() - 0.5) * (d - 5));
            ac.castShadow = true;
            scene.add(ac);
          }
          if (Math.random() < 0.35) {
            const ant = new THREE.Mesh(antennaGeo, roofPropMat);
            ant.position.set(lotX + (Math.random() - 0.5) * (w - 6), top + 3.5, lotZ + (Math.random() - 0.5) * (d - 6));
            scene.add(ant);
          }
          // glowing billboard on some tall buildings, facing the road
          if (hgt >= 30 && Math.random() < 0.3) {
            const bb = new THREE.Mesh(
              new THREE.PlaneGeometry(11, 4.2),
              new THREE.MeshBasicMaterial({ map: billboardTexture() })
            );
            const face = (Math.random() * 4) | 0;
            const y = hgt - 4;
            if (face === 0) { bb.position.set(lotX, y, lotZ + d / 2 + 0.15); }
            else if (face === 1) { bb.position.set(lotX, y, lotZ - d / 2 - 0.15); bb.rotation.y = Math.PI; }
            else if (face === 2) { bb.position.set(lotX + w / 2 + 0.15, y, lotZ); bb.rotation.y = Math.PI / 2; }
            else { bb.position.set(lotX - w / 2 - 0.15, y, lotZ); bb.rotation.y = -Math.PI / 2; }
            scene.add(bb);
          }
        }
      }
    }
  }

  // Authored Mainland starter corridor: a readable bus-stop edge with drains,
  // utility poles, hazard curbs, and named low-rise frontages. These props are
  // only placed after a clear-footprint check so they stay off the road and
  // do not overlap generated buildings.
  const starterRouteZ = roadCenter(Math.floor(N / 2));
  const starterSidewalkZ = starterRouteZ + ROAD / 2 + 3.4;
  const starterStops = [new THREE.Vector3(20, 0, starterRouteZ + 3.2)];
  const starterAccent = new THREE.MeshStandardMaterial({ color: 0xc89532, roughness: 0.5, metalness: 0.25 });
  const starterConcrete = new THREE.MeshStandardMaterial({ color: 0x514d49, roughness: 0.9 });
  const starterPoleMat = new THREE.MeshStandardMaterial({ color: 0x1c1d20, roughness: 0.72, metalness: 0.2 });
  for (let x = -54; x <= 54; x += 9) {
    const grate = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.5), starterConcrete);
    grate.position.set(x, 0.08, starterRouteZ + ROAD / 2 + 0.55);
    scene.add(grate);
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.035, 0.32), starterAccent);
    stripe.position.set(x + 3.1, 0.13, starterRouteZ + ROAD / 2 + 0.28);
    scene.add(stripe);
  }
  for (const x of [-48, -16, 16, 48]) {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.14, 5.8, 6), starterPoleMat);
    pole.position.set(x, 2.9, starterSidewalkZ + 1.8);
    pole.castShadow = true;
    scene.add(pole);
    const crossbar = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.1, 0.1), starterConcrete);
    crossbar.position.set(x, 5.55, starterSidewalkZ + 1.8);
    scene.add(crossbar);
  }
  const shelter = new THREE.Group();
  const shelterRoof = new THREE.Mesh(new THREE.BoxGeometry(7.6, 0.18, 2.4), starterAccent);
  shelterRoof.position.y = 2.65;
  shelter.add(shelterRoof);
  for (const x of [-3.2, 3.2]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.16, 2.5, 0.16), starterConcrete);
    post.position.set(x, 1.25, 0);
    shelter.add(post);
  }
  const bench = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.24, 0.55), starterConcrete);
  bench.position.set(0, 0.8, 0.35);
  shelter.add(bench);
  shelter.position.set(starterStops[0].x, 0.14, starterSidewalkZ + 2.4);
  scene.add(shelter);
  const busSign = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.1, 0.12), starterAccent);
  busSign.position.set(starterStops[0].x - 4.5, 2.25, starterSidewalkZ + 1.8);
  scene.add(busSign);
  const frontageNames = ['MAMA TITI KITCHEN', 'ORITA MARKET ROW', 'MAINLAND PHARMACY', 'CIVIC SERVICES'];
  for (let i = 0; i < frontageNames.length; i++) {
    const x = -42 + i * 28;
    const z = starterRouteZ + 22;
    const probe = new THREE.Vector3(x, 1, z);
    if (pointBlocked(probe, colliders, 3.2)) continue;
    const group = new THREE.Group();
    const width = 17;
    const depth = 8;
    const height = 6 + (i % 2) * 2;
    const wall = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), new THREE.MeshStandardMaterial({ color: [0x443a31, 0x303b3b, 0x3a332b, 0x36363b][i], roughness: 0.9 }));
    wall.position.y = height / 2;
    wall.castShadow = true;
    group.add(wall);
    const roof = new THREE.Mesh(new THREE.BoxGeometry(width + 0.5, 0.22, depth + 0.4), starterConcrete);
    roof.position.y = height + 0.12;
    group.add(roof);
    const awning = new THREE.Mesh(new THREE.BoxGeometry(width - 1.2, 0.16, 1.1), starterAccent);
    awning.position.set(0, 3.05, depth / 2 + 0.5);
    group.add(awning);
    const signCanvas = document.createElement('canvas');
    signCanvas.width = 512; signCanvas.height = 88;
    const sg = signCanvas.getContext('2d');
    sg.fillStyle = '#111216'; sg.fillRect(0, 0, 512, 88);
    sg.strokeStyle = '#c89532'; sg.lineWidth = 5; sg.strokeRect(4, 4, 504, 80);
    sg.fillStyle = '#f6e6ba'; sg.font = '900 28px Arial'; sg.textAlign = 'center'; sg.textBaseline = 'middle';
    sg.fillText(frontageNames[i], 256, 44);
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 1.24), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(signCanvas) }));
    sign.position.set(0, 4.6, depth / 2 + 0.06);
    group.add(sign);
    group.position.set(x, 0.18, z);
    scene.add(group);
    colliders.push({ x0: x - width / 2, x1: x + width / 2, z0: z - depth / 2, z1: z + depth / 2, h: height + 0.5 });
  }

  // Street-scale Oshodi details: the corridor gets drainage, market shade,
  // roadside signboards, and overhead utility lines. All of these live on the
  // property-side sidewalk strip rather than in the traffic lanes.
  const drainMat = new THREE.MeshStandardMaterial({ color: 0x272a2a, roughness: 0.98 });
  const drain = new THREE.Mesh(new THREE.BoxGeometry(112, 0.12, 0.72), drainMat);
  drain.position.set(0, 0.12, starterRouteZ + ROAD / 2 + 1.35);
  scene.add(drain);
  for (let x = -54; x <= 54; x += 7) {
    const cover = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.06, 0.82), starterConcrete);
    cover.position.set(x, 0.2, starterRouteZ + ROAD / 2 + 1.35);
    scene.add(cover);
  }
  const umbrellaColors = [0xd6493f, 0xf0b93d, 0x2d6f61, 0xc26b32];
  const stallXs = [-42, -24, -6, 36, 52];
  for (let i = 0; i < stallXs.length; i++) {
    const x = stallXs[i];
    if (Math.abs(x - starterStops[0].x) < 8) continue;
    const stall = new THREE.Group();
    const table = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.65, 1.7), new THREE.MeshStandardMaterial({ color: 0x715039, roughness: 0.9 }));
    table.position.y = 0.55;
    stall.add(table);
    const goods = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.18, 1.25), new THREE.MeshStandardMaterial({ color: [0xb86d2b, 0x5a8b45, 0xd8ba44][i % 3], roughness: 0.82 }));
    goods.position.y = 0.93;
    stall.add(goods);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 2.9, 6), starterPoleMat);
    pole.position.y = 1.75;
    stall.add(pole);
    const canopy = new THREE.Mesh(new THREE.ConeGeometry(2.25, 0.72, 8), new THREE.MeshStandardMaterial({ color: umbrellaColors[i % umbrellaColors.length], roughness: 0.78 }));
    canopy.position.y = 3.12;
    canopy.rotation.y = Math.PI / 8;
    stall.add(canopy);
    stall.position.set(x, 0.18, starterRouteZ + ROAD / 2 + 6.2);
    scene.add(stall);
  }
  const signCanvas = document.createElement('canvas');
  signCanvas.width = 384; signCanvas.height = 128;
  const signCtx = signCanvas.getContext('2d');
  signCtx.fillStyle = '#164f4b'; signCtx.fillRect(0, 0, 384, 128);
  signCtx.strokeStyle = '#d9c77a'; signCtx.lineWidth = 6; signCtx.strokeRect(6, 6, 372, 116);
  signCtx.fillStyle = '#f5ecd0'; signCtx.font = '900 30px Arial'; signCtx.textAlign = 'center'; signCtx.textBaseline = 'middle';
  signCtx.fillText('OSHODI  /  MILE 2', 192, 53);
  signCtx.font = '800 18px Arial'; signCtx.fillText('MARKET CORRIDOR', 192, 91);
  const routeBoard = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 1.6), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(signCanvas) }));
  routeBoard.position.set(-47, 3.45, starterRouteZ + ROAD / 2 + 1.8);
  routeBoard.rotation.y = Math.PI;
  scene.add(routeBoard);
  for (const x of [-48, -16, 16, 48]) {
    for (let wire = 0; wire < 3; wire++) {
      const points = [
        new THREE.Vector3(x - 16, 5.75 + wire * 0.14, starterSidewalkZ + 1.8),
        new THREE.Vector3(x - 8, 5.35 + wire * 0.14, starterSidewalkZ + 1.8),
        new THREE.Vector3(x, 5.75 + wire * 0.14, starterSidewalkZ + 1.8),
        new THREE.Vector3(x + 8, 5.35 + wire * 0.14, starterSidewalkZ + 1.8),
        new THREE.Vector3(x + 16, 5.75 + wire * 0.14, starterSidewalkZ + 1.8),
      ];
      const cable = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: 0x17191b, transparent: true, opacity: 0.82 }));
      scene.add(cable);
    }
  }
  const starterCorridor = { routeZ: starterRouteZ, busStops: starterStops };

  // street lamps at intersections (warm sodium glow)
  const poleGeo = new THREE.CylinderGeometry(0.12, 0.12, 5.4, 6);
  const poleMat = new THREE.MeshLambertMaterial({ color: 0x2c2c32 });
  const bulbGeo = new THREE.SphereGeometry(0.32, 8, 6);
  const bulbMat = new THREE.MeshLambertMaterial({ color: 0xffd9a0, emissive: 0xcc8b35 });
  const glowGeo = new THREE.CircleGeometry(4.5, 16);
  glowGeo.rotateX(-Math.PI / 2);
  const glowMat = new THREE.MeshBasicMaterial({ color: 0xffb850, transparent: true, opacity: 0.04, depthWrite: false });
  for (let i = 0; i <= N; i += 2) {
    for (let j = 0; j <= N; j += 2) {
      // Keep furniture on the property-side corner sidewalk, never in the asphalt.
      const x = roadCenter(i) + ROAD / 2 + 4.2;
      const z = roadCenter(j) + ROAD / 2 + 4.2;
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.set(x, 2.7, z);
      pole.castShadow = true;
      scene.add(pole);
      const bulb = new THREE.Mesh(bulbGeo, bulbMat);
      bulb.position.set(x, 5.5, z);
      scene.add(bulb);
      const glow = new THREE.Mesh(glowGeo, glowMat);
      glow.position.set(x, 0.3, z);
      scene.add(glow);
    }
  }
  const signalPoleMat = new THREE.MeshLambertMaterial({ color: 0x252930 });
  const signalBodyMat = new THREE.MeshLambertMaterial({ color: 0x111318 });
  const signalRedMat = new THREE.MeshLambertMaterial({ color: 0xd83935, emissive: 0x5d1111 });
  const signalAmberMat = new THREE.MeshLambertMaterial({ color: 0xd39b32, emissive: 0x4b2e08 });
  const signalGreenMat = new THREE.MeshLambertMaterial({ color: 0x3ca86b, emissive: 0x0d3d25 });
  for (let i = 0; i <= N; i += 2) {
    for (let j = 0; j <= N; j += 2) {
      const x = roadCenter(i) + ROAD / 2 + 5.0;
      const z = roadCenter(j) + ROAD / 2 + 5.0;
      const signalPole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 4.4, 6), signalPoleMat);
      signalPole.position.set(x, 2.2, z);
      scene.add(signalPole);
      const signalHead = new THREE.Mesh(new THREE.BoxGeometry(0.42, 1.15, 0.28), signalBodyMat);
      signalHead.position.set(x, 4.25, z);
      scene.add(signalHead);
      for (const [y, mat] of [[4.62, signalRedMat], [4.25, signalAmberMat], [3.88, signalGreenMat]]) {
        const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.105, 8, 6), mat);
        lamp.position.set(x, y, z - 0.16);
        scene.add(lamp);
      }
    }
  }

  const mid = Math.floor(N / 2);
  const spawn = new THREE.Vector3(roadCenter(mid), 0, roadCenter(mid));

  return { colliders, buildings, pedRects, roadXs, roadZs, spawn, helipads, windowMats, lampGlowMat: glowMat, bulbMat, starterCorridor };
}

// Push a circle (pos, r) out of every AABB collider it overlaps.
// Pass maxY to ignore colliders shorter than the entity's altitude (helicopters).
export function resolveCircle(pos, r, colliders, maxY = -Infinity) {
  let hit = null;
  for (const c of colliders) {
    if (maxY > (c.h ?? Infinity)) continue;
    const cx = Math.max(c.x0, Math.min(pos.x, c.x1));
    const cz = Math.max(c.z0, Math.min(pos.z, c.z1));
    let dx = pos.x - cx;
    let dz = pos.z - cz;
    const d2 = dx * dx + dz * dz;
    if (d2 >= r * r) continue;
    let d = Math.sqrt(d2);
    if (d < 1e-4) {
      const px = Math.min(pos.x - c.x0, c.x1 - pos.x) + r;
      const pz = Math.min(pos.z - c.z0, c.z1 - pos.z) + r;
      if (px < pz) {
        const sign = (pos.x - c.x0 < c.x1 - pos.x) ? -1 : 1;
        pos.x += sign * px;
        hit = { nx: sign, nz: 0 };
      } else {
        const sign = (pos.z - c.z0 < c.z1 - pos.z) ? -1 : 1;
        pos.z += sign * pz;
        hit = { nx: 0, nz: sign };
      }
    } else {
      const nx = dx / d;
      const nz = dz / d;
      pos.x += nx * (r - d);
      pos.z += nz * (r - d);
      hit = { nx, nz };
    }
  }
  return hit;
}

// Highest walkable surface under a point: rooftops of colliders whose footprint
// contains the point and whose top is at or just below the probe height, else
// street level. Pass probeY = the height BEFORE this frame's fall so a fast
// drop can never skip straight through a roof — buildings are solid brick.
export function groundHeight(pos, colliders, pad = 0.1, probeY = pos.y) {
  let g = 0;
  for (const c of colliders) {
    if (pos.x < c.x0 - pad || pos.x > c.x1 + pad || pos.z < c.z0 - pad || pos.z > c.z1 + pad) continue;
    const top = (c.h ?? 0) - 0.3; // collider tops sit 0.3 above the visible roof
    if (top > g && probeY >= top - 0.5) g = top;
  }
  return g;
}

// True if a point is inside any collider that reaches above the point's height.
export function pointBlocked(pos, colliders, pad = 0.3) {
  for (const c of colliders) {
    if (pos.y > (c.h ?? Infinity)) continue;
    if (pos.x > c.x0 - pad && pos.x < c.x1 + pad && pos.z > c.z0 - pad && pos.z < c.z1 + pad) return true;
  }
  return false;
}
