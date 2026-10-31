# THE MAINLAND

**Your City. Your People. Your Story.**

THE MAINLAND is a realistic, fictionalized 3D urban-life simulator inspired by everyday life in a busy Lagos mainland district. This repository contains the current browser-playable game build: a living city prototype where players will eventually create a character, find work, earn money, rent a home, build relationships, and deal with the consequences of ordinary decisions.

The world is inspired by the energy and street scale of Oshodi, Lagos, but uses fictional locations, characters, businesses, and events.

## Current build status

The active development branch is `our-build`. The current build focuses on:

- A readable urban road grid with sidewalks, curbs, lane markings, zebra crossings, and signalized intersections.
- Traffic cars that follow lanes, rotate with their direction of travel, brake for hazards, respect red and amber signal phases, and use headlights/brake lights.
- Mobile-friendly HUD and minimap navigation.
- A visible Galleria landmark with an outward-facing hinged door, readable interior lighting, seating, reception counter, plants, fountain, and kiosk.
- Enterable residential, shop, and office building shells with restricted actions by building type.
- A grounded character creator with backgrounds, starter goals, and saved life-profile data.
- A first Mainland starter shift: sign up at the Galleria, collect a package, deliver it across the district, receive a wallet payout, and save completed-shift progress.
- A reference-inspired HUD shell with dark status cards, amber/teal accents, top-right minimap, compact vitals, collapsible quick actions, and a Mainland activity card showing shift, route, progress, and reward without covering navigation controls.
- A new Mainland visual direction anchored by the supplied cinematic emblem: graphite buildings, black asphalt, warm gold civic/commercial details, controlled teal accents, and sidewalk-safe landmark placement.
- An authored starter corridor with named low-rise frontages, drainage grates, hazard curb accents, utility poles, a sheltered bus stop, and deliberate property-side placement.
- Dedicated yellow-and-green Danfo minibuses with open passenger-side doors, route signage, wheel animation, lane movement, traffic spacing, and bus-stop pauses.
- A cinematic boot sequence using the supplied Lagos/Oshodi loading artwork, live district-status progress, and a fade into the interactive character/life setup deck.
- A unified black/graphite/gold presentation from loading screen through gameplay HUD, with gold action emphasis, transport-yellow identity, and tighter responsive mobile hierarchy.
- A reference-led gameplay HUD with a branded corner, first-day mission brief, player profile/level/XP/cash card, district-labelled minimap, bottom Inventory/Map/Jobs/Skills/Social/Settings dock, and a compact movement/interact legend.
- An expanded Oshodi-inspired corridor with open drains and covers, market umbrellas and stalls, utility wires, a route board, and pedestrian-scale frontage details kept off the asphalt.
- Animated Danfo variants for Oshodi, Mile 2, Mushin, and Yaba with route boards, mirrors, roof rails, passenger-door boarding motion, suspension bounce, synchronized wheel spin, turn indicators, and brake-light cues.

The next planned step is to extend the first life loop with expenses and renting, then return to NPC routines and social consequences.

## Run locally

This is kept as a game build and is not being converted into a permanent hosted website. Run it locally with any static file server:

```bash
npm start
```

Or:

```bash
npx -y http-server -p 8080 -c-1 . --host 0.0.0.0
```

Then open `http://localhost:8080` and select **PLAY**.

## Temporary preview

The current development preview is available while the local game server is running:

<https://8080-i35yjs5bj3k6lvpgtsvjr-3a113fa0.us4.manus.computer/>

This URL is temporary and is not the production home of the game.

## Controls

### On foot

| Input | Action |
| --- | --- |
| W A S D | Move |
| Shift | Sprint |
| Space | Jump |
| Mouse | Look around / aim |
| E | Enter or leave vehicles and buildings; interact with nearby actions |
| M | Open the full city map |
| P / Esc | Pause |
| Left Click | Use the currently equipped weapon |
| 1–6 / X | Select or cycle weapons |

### Vehicles

| Input | Action |
| --- | --- |
| W A S D | Drive |
| Space | Handbrake |
| R | Cycle radio station |
| E | Exit the vehicle when stopped |
| Left Click | Fire the tank cannon when operating a tank |

### Mobile

Use the virtual joystick and contextual action buttons. The minimap is positioned in the top-right navigation area to avoid the movement controls.

## Road and vehicle realism roadmap

The current realism pass is being built in this order:

1. Road scale, lane readability, sidewalks, curbs, crossings, and intersections.
2. Signalized intersections and traffic stopping behavior.
3. Vehicle proportions, wheel contact, acceleration, braking, steering, reversing, and collision response.
4. Danfo routes, bus-stop interactions, parked-car placement, turn behavior, and street-side vehicle interactions.
5. Extend the Mainland life loop from starter work into housing, expenses, and daily consequences.

## Mainland product roadmap

### Character and first life loop

- Character name, appearance preset, background, and starter goal.
- A first district with starter jobs and visible payouts.
- Wallet, expenses, rent, housing, and saved progress.
- Readable minimap landmarks and accessible buildings.

### Living city and social consequences

- NPC routines tied to the shared city clock.
- Relationships, gossip, and one spreading scandal event.
- A landlord dispute with dialogue choices.
- A law encounter with visible consequences.

### Multiplayer foundation

The multiplayer layer will be added after the first single-player vertical slice is stable. The intended first networked room is bounded to approximately 8–16 active players, with server-owned room membership, shared events, validated actions, persistence, reconnect handling, and an explicit unavailable-service state.

## Version control

Development work is tracked on the `our-build` branch. Each meaningful feature pass should include:

1. A focused implementation.
2. Syntax and diff validation.
3. A README or TODO update when the product state changes.
4. A descriptive Git commit.
5. A push to the GitHub fork.

Latest gameplay pass: authored starter corridor, realistic roadside zoning, and Danfo transit; see `git log` for the exact commit history.

Repository: <https://github.com/r3vaTech/Gta-Clone/tree/our-build>

## Project structure

```text
index.html       HUD, start screen, styles, and Three.js import map
js/main.js       Game loop, player, camera, vehicles, world state, persistence
js/city.js       Roads, sidewalks, buildings, intersections, street props
js/car.js        Vehicle meshes, driving physics, wheels, lights, collisions
js/npc.js        Pedestrians, traffic spawning, traffic behavior
js/danfo.js      Authored Danfo minibuses and starter-corridor transit behavior
mainland-loading.png  Supplied cinematic Lagos/Oshodi loading artwork
js/mall.js       Galleria landmark, door, interior, and interactions
js/buildings.js  Generic enterable residential/shop/office interiors
js/hud.js        HUD, minimap, mobile navigation, and status panels
TODO.md          Outcome-based product roadmap and current priorities
plan.md          Conversion plan for THE MAINLAND
REFERENCE_NOTES.md Reviewed ideas from the two related Mainland repositories
```

## Tech stack

- Three.js loaded from a CDN through the import map in `index.html`.
- Plain JavaScript ES modules.
- Procedural WebAudio for game sound.
- LocalStorage for prototype progress persistence.
- Static local serving for the development game build.

## Credits and source base

THE MAINLAND is being developed as a custom game build from the public `25nyak/Gta-Clone` codebase. The active development fork is maintained at `r3vaTech/Gta-Clone`.
