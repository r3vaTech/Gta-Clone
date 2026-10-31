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

The starter-job implementation remains native to this repository. It does not copy the React/Vite application or its assets. Future selected adaptations are vehicle profiles/upgrades, named map destinations, a collapsible quick-action surface, and focused smoke checks.

## Not copied

The source repositories have different runtime architectures and feature boundaries. Their React components, bundler configuration, map data, OSM snapshot, assets, and multiplayer/modal claims are not copied into this build. Concepts are adapted only when they fit the existing plain ES-module game and THE MAINLAND roadmap.
