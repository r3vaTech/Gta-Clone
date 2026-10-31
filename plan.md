# THE MAINLAND — implementation plan

## Product direction

THE MAINLAND is a realistic 3D multiplayer urban-life simulator and RPG inspired by everyday life in Oshodi, Lagos. It is a fictionalized, respectful interpretation rather than a 1:1 reconstruction of real people or locations. The player creates a character and builds a life through work, money, housing, businesses, relationships, reputation, gossip, conflict, crime, corruption, and the law.

Tagline: **Your City. Your People. Your Story.**

## Foundation and conversion strategy

Reuse the current Three.js browser foundation, procedural city renderer, NPC/traffic simulation, vehicles, mobile controls, HUD, save utilities, and static preview workflow. Retire or isolate the superhero/fantasy systems (web swinging, kaiju, zombies, jetpack, boss rushes, military escalation, casino-heavy progression) instead of presenting them as THE MAINLAND content.

The multiplayer layer must be authoritative. A Node.js `ws` service will own rooms, player presence, shared NPC/event state, economy transactions, jobs, property ownership, relationship consequences, and law outcomes. Clients may predict local movement for responsiveness, but the server validates actions and broadcasts revisioned snapshots. The public client will read a versioned WebSocket bootstrap config; no credentials or private endpoints will be shipped in the client.

## First playable vertical slice

The first milestone should make the concept legible with a small but complete loop:

1. Join a named multiplayer room and see other players.
2. Create a simple character with name, appearance preset, background, and starting goal.
3. Explore one Oshodi-inspired district with market frontage, a bus interchange, residential streets, a mechanic/workshop, a local office, and a police post.
4. Take one starter job (delivery, transport assistance, or shop shift), complete it, and receive a wallet payout.
5. Track daily expenses and rent; rent pressure creates meaningful choices rather than arbitrary failure.
6. Rent a modest room and return to it between sessions.
7. Meet scheduled NPCs who have routines, relationships, secrets, and rumor hooks.
8. Trigger one dynamic gossip/scandal event that can spread between nearby NPCs and players.
9. Resolve one landlord dispute and one law encounter through dialogue/choice rather than only combat.
10. Persist character, wallet, housing, reputation, job progress, and event consequences.

## Systems after the slice

- Multiple jobs and career paths: transport, trading, office work, creative work, public service, and informal work.
- Businesses: inventory, staff, rent, licensing, customer flow, protection pressure, and reinvestment.
- Relationships: friendship, romance, family, betrayal, trust, and social reputation.
- City economy: wages, rent, prices, scarcity, transport costs, business supply, and city events.
- Law and corruption: fines, permits, mediation, police encounters, court/appeal flows, and consequences.
- NPC simulation: schedules, needs, relationships, secrets, memories, rumor propagation, and event participation.
- Multiplayer rooms: bounded capacity, reconnect grace, spectators, room expiry, rate limits, protocol versions, and recovery UI.

## Visual and interaction direction

**Design movement:** a cinematic Lagos street-life title treatment carried from the supplied loading reference into the complete game shell: warm late-afternoon light, humid haze, layered signage, worn materials, transport yellow, graphite framing, and restrained but confident UI overlays.

**Core principles:** recognizable everyday detail; social readability over spectacle; the loading/start screen establishes place before play; color and sound communicate place; consequences remain visible in the environment.

**Color philosophy:** black and graphite create a cinematic frame, warm gold carries identity and action, transport yellow signals movement and opportunity, faded teal anchors navigation, and selective red/orange alerts communicate risk. Bright color belongs to commerce, transport, and social signals rather than fantasy effects.

**Layout paradigm:** a cinematic loading cover transitions into a split start command deck, then collapses into a diegetic city-first view with compact edge HUDs. The player should read the street, nearby people, and current social/economic pressure before reading menus.

**Signature elements:** a full-bleed loading image with real boot progress; a bold gold brush-stroke/underline motif; a route-and-routine clock; rumor bubbles/whispers that surface near people; and compact wallet/rent/reputation cards.

**Typography:** use the existing readable sans-serif system for gameplay, with heavy condensed labels for transport, job, and alert states and a high-contrast italic display treatment for the title, slogan, and loading status.

**Loading behavior:** show the supplied `1661108F-741F-433B-B938-11DCACC24240.png` as the cinematic boot artwork, overlay a live progress/status strip, then fade into the interactive start deck. The start deck keeps character creation and first-life choices, but presents them as a deliberate new-life setup instead of a legacy prototype menu. Desktop and mobile use the same hierarchy with responsive stacking.

## Project structure

```text
index.html              Client shell, mobile HUD, loading/start experience
js/main.js              Client world loop, scene composition, local player prediction
js/city.js              Fictionalized district layout, roads, landmarks, routes
js/npc.js               NPC movement, schedules, local presentation of server state
js/life.js              Character, needs, jobs, housing, routines, social hooks
js/economy.js           Wallet, rent, prices, businesses, validated action requests
js/relationships.js     Trust, romance, family, betrayal, gossip links
js/law.js               Disputes, police interactions, fines, permits, consequences
js/multiplayer.js       WebSocket connection, room state, revisioned snapshots
server/index.mjs        Authoritative Node/ws service and health endpoint
server/protocol.mjs     Message validation, protocol/build version, rate limits
server/rooms.mjs        Room membership, reconnect grace, bounded capacity
server/simulation.mjs   Shared clock, NPC/event simulation, economy/referee rules
public/multiplayer/      Versioned bootstrap configuration for the client
plan.md                 Approved implementation and design direction
TODO.md                 Outcome-based delivery list
```

## Multiplayer constraints

The first networked build should target bounded social rooms rather than a persistent MMO. Start with 8–16 active players per room, a server-issued room-scoped resume token, revisioned snapshots, stale-message rejection, reconnect grace, heartbeat cleanup, and an explicit unavailable state when the WebSocket service is not configured. The game should remain playable in a local single-player fallback only during development; the public multiplayer build must not pretend that a disconnected client is online.

## Asset direction

Prefer procedural city geometry and the existing renderer during the first slice. Add distinctive 3D models only after the visual roles are approved: market stall kit, bus/interchange props, storefront signs, room interiors, police-post props, and player/avatar body presets. Avoid copying real brand marks or depicting identifiable private individuals.

## First build success criteria

A player can join a room, create a character, see another connected player, walk through the first district, complete the starter job, receive a validated payout, rent a room, encounter a scheduled NPC, make a dialogue choice in a landlord/law interaction, and see a gossip consequence reflected in the local HUD and another player's view. Reload/reconnect behavior and an unavailable-service state must be explicit and tested.
