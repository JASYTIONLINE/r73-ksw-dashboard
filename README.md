# Brownsville Kuk Sool Won Dashboard

Brownsville Kuk Sool Won Dashboard is both:

- an academic software engineering project (planning, requirements traceability, and iterative delivery), and
- a live student-facing web tool currently used for real curriculum tracking.

The application helps students track belt-rank requirements, update training status by skill, and preserve progress/profile data locally with export/import backup support.

## Project Context

### Academic context

- Developed as a structured course project with milestone-based scope.
- Emphasis on requirements implementation, user-centered iteration, and maintainable code.
- Instructor review focus areas:
  - functional completeness against requirements,
  - quality of documentation and traceability,
  - operational correctness for real-world usage.

### Live deployment context

- This project is deployed as a static site and actively used in a real dojo workflow.
- Curriculum source data is maintained in CSV and converted to JSON for browser delivery.
- Design decisions prioritize reliability, clarity for students, and low-maintenance operations.

## Architecture Overview

- Frontend: static HTML/CSS/vanilla JavaScript
- Data source:
  - authoring source: `private/ksw-roadmap-db.csv`
  - runtime source: `assets/data/ksw-syllabus.json`
- Persistence: browser `localStorage` (per user/browser)
- Deployment: GitHub repository and GitHub Pages hosting

## Repository Structure

- `index.html`: public landing page
- `about.html`: project/tool purpose and user guidance
- `contact.html`: instructor contact workflow
- `dashboard.html`: primary student workflow and all interactive dashboard logic
- `assets/css/`: shared and theme styling
- `assets/data/ksw-syllabus.json`: generated curriculum payload used by the app
- `private/ksw-roadmap-db.csv`: editable source-of-truth data
- `scripts/csv-to-syllabus-json.mjs`: CSV-to-JSON build script

## Current Feature Set by Page

### `index.html` (Home)

- Responsive desktop/mobile navigation.
- Introductory call-to-action with prefilled email intent.
- Motion-enhanced CTA pulse behavior that respects reduced-motion preferences.

### `about.html` (About)

- Describes purpose, intended users, and practical usage flow.
- Defines proficiency interpretation for student self-tracking.
- Serves as user-facing documentation page in the live product.

### `contact.html` (Contact)

- Fast action path for instructor communication and audit requests.
- Maintains simple, low-friction email workflow appropriate for static hosting.

### `dashboard.html` (Student Dashboard)

- Personal profile form (11 student fields) with automatic persistence.
- Rank selection with synchronized rank title behavior.
- Curriculum rendering by selected rank, split into:
  - `to learn` (`rank === selected rank`)
  - `maintain` (`rank < selected rank`)
- Requirements rendered in grouped tables with:
  - `Description`
  - `Learning Objective`
  - `Status` (dropdown)
- Status lifecycle options:
  - `Untrained`
  - `In Progress`
  - `Trained`
  - `Proficient`
- Type/category grouping under each rank section.
- Category display ordering based on priority list from JSON (`categoryPriority` / `Priority` object rows).
- Import/export JSON workflow for recovery and device/browser continuity.
- Blocking confirmation/instruction modals for export, import, and clear-data flows.
- Clear-data control to reset user-local state and restore baseline server data.
- Sticky sidebar helpers:
  - back-to-top button,
  - right-side up/down jump controls (header-to-header navigation),
  - responsive behavior (controls hidden on smaller screens).

## JavaScript Feature Inventory by Page

### `index.html`

- Timed CTA animation scheduler.
- `prefers-reduced-motion` safeguard for accessibility.

### `about.html`

- No page-specific JavaScript behavior.

### `contact.html`

- No page-specific JavaScript behavior.

### `dashboard.html`

- Fetch and hydrate syllabus payload from JSON.
- Defensive parsing and normalization of persisted status values.
- Local status map keyed by skill key.
- Local persistence for all personal profile fields.
- Dynamic filtering by selected rank.
- Grouping pipeline:
  - by curriculum rank,
  - then by category/type,
  - then ordered by category priority.
- Dynamic DOM/table generation for requirement rows.
- Status dropdown change handling with immediate persistence.
- Export serializer includes:
  - curriculum payload with live status state,
  - user profile object.
- Import validator and payload apply flow.
- Modal controller with proceed/cancel callbacks, backdrop handling, and keyboard close behavior.
- Cache-busted baseline reload path for full reset.
- Scroll/jump navigation helpers tied to page headings.

## Data Model and Pipeline

### Source of truth

- Curriculum content, glossary labels, and category priority are maintained in:
  - `private/ksw-roadmap-db.csv`

### Build step

Run from repository root:

```bash
node scripts/csv-to-syllabus-json.mjs
```

### Generated JSON behavior

`scripts/csv-to-syllabus-json.mjs` currently:

- parses the full CSV, including repeated section headers,
- preserves dashboard-compatible typed outputs:
  - `items`
  - `beltStepLabels`
- emits a generic `objects` map to support future object types without parser rewrites,
- derives `categoryPriority` from `Priority` rows to drive category display order.

After running the generator, commit `assets/data/ksw-syllabus.json` so production serves updated curriculum data.

## Persistence, Recovery, and Operational Notes

- Student progress/profile persistence is browser-local (`localStorage`).
- Clearing browser cache/storage removes local state unless backup JSON is imported.
- Export/import exists specifically to support recovery after cache loss and continuity across sessions.
- This design intentionally avoids server-side accounts/databases for simplicity and operational cost.

## Quality and Review Notes (Instructor-Facing)

- Requirements have been implemented through iterative enhancement with backward-compatible updates.
- Data and UI responsibilities are separated:
  - CSV/JSON pipeline in script,
  - runtime rendering/persistence in dashboard JS.
- Feature additions prioritize user clarity and recoverability over framework complexity.
- Documentation now reflects both the academic rationale and live operational usage.

## Out of Scope (Current Phase)

- Authentication and role-based access control.
- Instructor/admin backend dashboard.
- Centralized cloud database for user profiles.
- Real-time messaging platform.
- Full LMS/media delivery subsystem.
