# Reference review

Reviewed on 2026-10-31:

- [r3vaTech/The-mainlanf](https://github.com/r3vaTech/The-mainlanf)
- [r3vaTech/The-mainland-game](https://github.com/r3vaTech/The-mainland-game)

The first URL is spelled `The-mainlanf` in GitHub and is a valid repository. The likely corrected URL `The-mainland` does not exist.

## Selected patterns

### From The-mainlanf

- A layered HUD that separates money, time, daypart/status, health, activity alerts, and navigation instead of placing everything in one control cluster.
- A compact/Zen HUD mode for seeing the street with less screen furniture.
- A collapsible bottom action dock for phone, jobs, inventory, map, radio, camera, and settings.
- Named destinations with short descriptions and direct navigation affordances in the district map.
- Localized Nigerian street-life language and events such as danfo routes, NEPA status, market activity, and go-slow traffic.

### From The-mainland-game

- A step-based job panel with a route strip, shift number, progress state, reward, and clear next action.
- Vehicle profiles with explicit handling values and upgrade tradeoffs instead of treating every car as the same.
- Deterministic game-state modules and automated checks for traffic, motion, saving, tuning, and jobs.
- A strong performance discipline: shared geometry/materials, bounded streamed world data, and explicit smoke/build checks.

## Applied to this build

The adapted pass now reshapes the plain Three.js HUD shell: dark zinc status cards, amber/teal accents, cash/time/wanted status, a top-right minimap, a compact player-vitals card, a collapsible bottom quick-action dock, and a **MAINLAND HUSTLE** activity card. The activity card shows the current shift number, Galleria route, pickup/delivery step, progress bar, and reward without covering the map or mobile controls.

The supplied THE MAINLAND emblem is now the start-screen identity anchor. The city foundation is also being restyled around graphite/black surfaces, warm gold civic details, controlled teal accents, and explicit spatial zoning: asphalt for vehicles, sidewalks for lamps and pedestrians, property thresholds for doors, and plazas for civic/commercial landmarks.

The latest authored-corridor pass adapts the references’ strongest world-building ideas: named low-rise frontages, drainage grates, hazard curb accents, utility poles, a sheltered bus stop, and dedicated yellow-and-green Danfo minibuses with open passenger doors, route signage, wheel animation, lane spacing, and bus-stop pauses. These are implemented as native Three.js modules in `city.js` and `danfo.js`, not copied source code.

The starter-job implementation remains native to this repository. It does not copy the React/Vite application or its assets. Future selected adaptations are vehicle profiles/upgrades, named map destinations, a collapsible quick-action surface, and focused smoke checks.

The supplied cinematic loading artwork now anchors the complete presentation rather than only the start logo: a real boot progress strip and district-status copy transition into a black/graphite/gold start deck, while the gameplay HUD carries the same gold action emphasis and transport-yellow identity.

The supplied gameplay reference now informs the active HUD hierarchy: a small branded corner, first-day mission brief, profile/level/XP/cash card, round district minimap with district chip, bottom navigation dock, and a right-side control legend. The structure is implemented in the existing plain HTML/CSS/ES-module shell and remains responsive on touch devices.

## Not copied

The source repositories have different runtime architectures and feature boundaries. Their React components, bundler configuration, map data, OSM snapshot, assets, and multiplayer/modal claims are not copied into this build. Concepts are adapted only when they fit the existing plain ES-module game and THE MAINLAND roadmap.
