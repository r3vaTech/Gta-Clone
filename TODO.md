# THE MAINLAND delivery outcomes

## Current priority — realism pass before TODO continuation
- Redesign the whole presentation from loading screen to gameplay: use the supplied cinematic Lagos/Oshodi image as the boot artwork, show real loading progress/status, transition into a deliberate THE MAINLAND start deck, and carry the black/graphite/gold/transport-yellow visual language into the in-game HUD.
- Keep the project as a game build and do not convert or publish it as a permanent website.
- Redesign the visual identity around the supplied THE MAINLAND emblem: black, graphite, warm gold, and controlled teal accents rather than the inherited prototype palette.
- Redesign the gameplay UI around the supplied reference: branded top-left corner, first-day mission card, top-right player level/XP/cash/profile card, readable district minimap with district label, bottom Inventory/Map/Jobs/Skills/Social/Settings dock, and a bottom-right movement/interact control legend.
- Enforce spatial zones: vehicles on asphalt, pedestrians and lamps on sidewalks, doors on property thresholds, and civic/commercial landmarks inside deliberate plazas.
- Improve the road system first: lane readability, intersections, sidewalks, traffic flow, and street-scale visual detail.
- Improve the car system second: believable proportions, wheel/road contact, lighting, braking, acceleration, steering, and traffic behavior.
- Add visible signalized intersections and make traffic respect red and amber phases.
- Return to the Mainland life-loop outcomes after the road and car pass is accepted.

## 1. Rebrand and establish the fictionalized Mainland district
- Replace the current Open City/superhero presentation with THE MAINLAND identity and the tagline “Your City. Your People. Your Story.”
- Preserve a realistic, fictionalized Oshodi-inspired district direction without copying real private individuals or protected brand marks.
- Keep mobile and desktop game entry usable while the new slice is under construction.

## 2. Deliver the first playable character and life loop
- Implemented first slice: Galleria starter shift, package pickup, street delivery, wallet payout, and saved completion count.
- Let a player create a character with a name, appearance preset, background, and starting goal.
- Let the player explore the first district, take a starter job, receive a wallet payout, track expenses, rent a room, and persist progress.
- Make the minimap readable and intentionally designed for navigation: clear roads, player position, district landmarks, and a distinct marker for the first accessible building.
- Add a prominent Mainland welcome/teaser arch that helps orient the player toward the first district destination without adding more confusing rings or boxes.
- Make buildings enterable through visible doors; allow interiors to restrict actions by building type, so not every building exposes every job, purchase, or social action.

## 3. Deliver living NPCs and social consequences
- NPCs must have visible routines and local relationships that evolve on a shared city clock.
- Add one gossip/scandal event whose rumor state can spread between nearby NPCs and players.
- Add one landlord dispute and one law encounter resolved through dialogue/choice with visible consequences.

## 4. Add authoritative multiplayer foundation
- Provide bounded rooms for the first networked slice, with a target of 8–16 active players per room.
- The server must own room membership, shared NPC/event state, economy transactions, and validated actions.
- Add protocol/build identifiers, revisioned snapshots, input/action validation, rate limits, heartbeat cleanup, reconnect grace, and explicit unavailable-service UI.
- Show other connected players in the district and keep local movement responsive through client prediction/correction.

## 5. Validate the first vertical slice
- Verify character creation, room join, player presence, job payout, rent, persistence, NPC routine, gossip consequence, landlord/law choices, disconnect/reconnect behavior, and room isolation.
- Keep the current temporary preview working for the client and report multiplayer service readiness separately from static-page readiness.
