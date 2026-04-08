# Brownsville Kuk Sool Won Dashboard

This project is a student-facing progress dashboard for Brownsville Kuk Sool Won (KSW).  
It helps students track rank requirements, maintain training progress over time, and recover their data after browser cache loss by exporting/importing local JSON.

## Tech Stack

- HTML, CSS, JavaScript (static site)
- Curriculum data from `assets/data/ksw-syllabus.json`
- Source-of-truth CSV at `private/ksw-roadmap-db.csv`
- `localStorage` for per-user progress and personal profile persistence
- GitHub repository + GitHub Pages deployment

## Features by Page

### `index.html` (Home)

- Responsive top and sidebar navigation to all pages
- CTA mailto button for introductory session requests
- JavaScript pulse animation loop for CTA button (respects `prefers-reduced-motion`)

### `about.html` (About)

- Purpose, usage, and proficiency guidance content
- Static instructional page with shared site navigation
- No page-specific JavaScript logic (content-focused page)

### `contact.html` (Contact)

- Instructor audit request quick action via mailto button
- Shared site navigation and contact context
- No page-specific JavaScript logic (action-link page)

### `dashboard.html` (Student Dashboard)

- Personal info form (11 fields) including rank, testing dates, membership, and renewal
- Dynamic rank title synchronization from selected rank option
- Requirements split into:
  - `Rank R — to learn`
  - `Rank < R — maintain`
- Requirements rendered as rank-grouped tables with columns:
  - `Description`
  - `Learning Objective`
  - `Status` (dropdown)
- Status options: `Untrained`, `In Progress`, `Trained`, `Proficient`
- Type/category subheadings rendered within each rank section
- Type/category ordering by `categoryPriority` (low to high), with stable fallback alphabetical ordering
- Sticky/pinned navigation behavior and sidebar back-to-top button
- Right-side up/down jump controls that move header-to-header (`h1`-`h6`) through `.page-content`
- Mobile behavior: scroll jump controls hidden on smaller screens
- Blocking modal system for guided confirmation flows (`Proceed` / `Cancel`)
- Export flow: user guidance modal, then download of updated JSON snapshot
- Import flow: guidance + confirmation modal, then local JSON load and apply
- Clear data flow: confirmation modal, clears local data, restores original server JSON state
- Live status messaging area for load/import/export/reset outcomes
- Contact action buttons for session scheduling and assessment requests

## JavaScript Features by Page

### `index.html`

- CTA pulse scheduler with periodic class toggling
- Accessibility-aware motion handling via `matchMedia('(prefers-reduced-motion: reduce)')`

### `about.html`

- No JavaScript features currently implemented

### `contact.html`

- No JavaScript features currently implemented

### `dashboard.html`

- JSON load from `assets/data/ksw-syllabus.json`
- Local state hydration/merge:
  - status overrides by item key
  - user profile values (11 fields)
- Status normalization (`Retrain` -> `In Progress`) for compatibility
- Requirements filtering by selected current rank
- Grouping logic by curriculum rank, then by skill type/category
- Type/category sorting with `categoryPriority`
- Dynamic table generation with per-row status select controls
- Change handlers to persist status and profile updates to `localStorage`
- Export serializer that includes:
  - curriculum items (with current status values)
  - user profile object
  - supporting metadata from loaded payload
- Import parser/validator with friendly error handling
- Modal controller utilities:
  - open/close lifecycle
  - keyboard support (`Escape`)
  - backdrop click handling
  - configurable proceed/cancel callbacks
- Reset routine that clears local keys and reloads baseline data from server (cache-busted)
- Scroll navigation utilities:
  - dynamic anchor collection from page headers
  - jump up/down navigation
  - responsive control positioning relative to `.page-content`

## Data Pipeline

### CSV -> JSON generator

Run:

```bash
node scripts/csv-to-syllabus-json.mjs
```

The generator now:

- Parses the full CSV (including repeated section headers)
- Preserves existing dashboard-compatible fields:
  - `items`
  - `beltStepLabels`
- Adds a generic `objects` map containing all object groups found in CSV
- Builds `categoryPriority` from `Priority` rows for dashboard sort order

Commit the updated `assets/data/ksw-syllabus.json` so GitHub Pages serves the latest data.

## Out of Scope (Current)

- Authentication/login system
- Instructor admin dashboard
- Cloud database-backed user accounts
- Internal messaging platform
- Full LMS/media portal
