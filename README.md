# Travel Route Builder

Design and visualize multi-country travel routes using an interactive graph. Search any country, drag it onto the canvas, connect routes, and export/import your plan as JSON. Cycle prevention and rule-based “blocked routes” included. Optional country **shape nodes filled with flags** for extra flair.

---

## Tech Stack

- **Next.js 15 (App Router)** + **React 19** + **TypeScript**
- **React Flow (XYFlow)** for the canvas (`@xyflow/react`)
- **Tailwind CSS** for UI
- **Zustand** for state (graph store + persistence)
- **REST Countries API** for search (`https://restcountries.com`)
- **Geo (optional):** `world-atlas`, `topojson-client`, `d3-geo`, `iso-3166-1` (country shapes)
- **Tooling:** ESLint (flat config) + Prettier + simple-import-sort + unused-imports

---

## Features

- Drag & drop countries (name + flag) from search onto the graph
- Connect countries to define routes (supports branching)
- **Cycle prevention** (no loops unless allowed)
- **Rules JSON** to block specific routes (e.g., Spain → Greece)
- **Export/Import** graph JSON (serializable classes)
- **Initial nodes** on first load (configurable)
- **Optional:** country **shape nodes** clipped with the **flag image**

---

## Project Structure (high level)

```
app/
  page.tsx, layout.tsx, globals.css
components/
  FlowCanvas.tsx, Sidebar.tsx, Topbar.tsx, CountryShapeNode.tsx*
lib/
  graph/
    core.ts (Graph, BaseNode, Edge)
    nodes.ts (CountryNode)
    serializer.ts (Graph ↔ JSON)
    rules.ts (blocked route rules)
    utils.tsx (RF mapping, cycle detection)
  geo.ts* (TopoJSON → GeoJSON helpers)
  countries.ts (REST Countries search)
  store.ts (Zustand store + persistence)
  utils.ts (downloadJson)
config/
  blocked-routes.json
```

\* only when using shape nodes

---

## Setup & Run

### 0) Requirements
- Node.js 18+
- Yarn (or npm/pnpm)

### 1) Install deps
```bash
npm i
# or: yarn
```

### 2) Dev server
```bash
npm run dev
# open http://localhost:3000
```

### 3) Build & start
```bash
npm run build
npm run start
```

## Rules JSON

- File: `config/blocked-routes.json`
- **No comments allowed** (valid JSON only)
- Example:
```json
{
  "allowLoops": false,
  "blockedPairs": [
    { "from": "ESP", "to": "GRC" },
    { "from": "USA", "to": "PRK" }
  ]
}
```

---

## Initial Nodes (example)

```json
[
  { "id": "FRA", "position": { "x": 80, "y": 80 }, "data": { "code": "FRA", "label": "France", "flag": "https://flagcdn.com/w40/fr.png", "region": "Europe" } },
  { "id": "ESP", "position": { "x": 260, "y": 140 }, "data": { "code": "ESP", "label": "Spain", "flag": "https://flagcdn.com/w40/es.png", "region": "Europe" } },
  { "id": "DEU", "position": { "x": 440, "y": 60 }, "data": { "code": "DEU", "label": "Germany", "flag": "https://flagcdn.com/w40/de.png", "region": "Europe" } },
  { "id": "ITA", "position": { "x": 420, "y": 180 }, "data": { "code": "ITA", "label": "Italy", "flag": "https://flagcdn.com/w40/it.png", "region": "Europe" } },
  { "id": "GRC", "position": { "x": 600, "y": 140 }, "data": { "code": "GRC", "label": "Greece", "flag": "https://flagcdn.com/w40/gr.png", "region": "Europe" } }
]
```

Seed them in the store on first run (unless a saved graph exists).

---

## Roadmap

### v0.9.0 (Current)
- Core graph classes (serializable)
- Search & drag countries (REST Countries)
- Connect routes, branching, cycle prevention
- Rules JSON for blocked routes
- Export/Import JSON, localStorage persistence
- Optional country shape nodes w/ flags
- ESLint/Prettier with import sorting, on-save fixes

### v1.0.0
- Upgrade UI
- Non-blocking toasts (replace `alert`)
- Edge labels (transport mode, duration, cost)
- Delete edges

### v1.1.0
- Suggested countries (based on rules)
- Alternative countries blocked routes
- Additional node types (Place/Hotel/Airport) + icons
- Edge variants (multiple transport options between same nodes)
- Route validation & warnings (missing visas, blocked borders—configurable)

### v1.2.0
- Backend persistence (Server Actions → Postgres/S3)
- Shareable links, project multi-save, auth

### v1.3.0
- Rules editor UI with JSON schema validation
- i18n (EN/KA), offline-ready (PWA)
- Tests with Vitest + React Testing Library

---

Happy routing!
