# Brownsville Kuk Sool Won Student Dashboard

Static student dashboard for curriculum tracking: **age band × rank** requirement sets (from data mappings), progressive disclosure by category and technique set, local progress and profile persistence, and CSV-sourced syllabus data.

| | |
|--|--|
| **Live site** | [https://jasytionline.github.io/r73-ksw-dashboard/](https://jasytionline.github.io/r73-ksw-dashboard/) |
| **Repository** | [https://github.com/JASYTIONLINE/r73-ksw-dashboard](https://github.com/JASYTIONLINE/r73-ksw-dashboard) |

## Course deliverable (Project 01)

This repository satisfies **Project 01 — Ship Your First Milestone** README expectations. Map each assignment section to the headings below.

| Assignment requirement | Where to read it |
|------------------------|------------------|
| **What is this?** | [Project 01 — What is this?](#project-01-what-is-this) |
| **Why does it exist?** | [Project 01 — Why does it exist?](#project-01-why-does-it-exist) |
| **What tools did I use?** | [Project 01 — What tools did I use?](#project-01-what-tools-did-i-use) |
| **How to visit it** | [Project 01 — How to visit the deployed site](#project-01-how-to-visit-the-deployed-site) |

Technical depth (architecture, file layout, build commands, features) lives under [Developer documentation](#developer-documentation).

---

## Project 01 — What is this?

This is a **static website** (HTML, CSS, vanilla JavaScript) that serves as a **student progress dashboard** for Brownsville Kuk Sool Won. Students choose **age band** aligned with **WKSA testing charts**: **Junior (age 12 & under)** vs **Adult & Youth (age 13 & over)**, plus **current rank**; the dashboard loads the requirement **mapping** for that pair (see [Data pipeline](#data-pipeline)), shows **To learn** vs **Maintain** lists, and nests tables under **category → technique set** to reduce visual overload. They can record a per-skill status, store profile and progress in the browser, and export or import JSON as a backup. Curriculum data is shipped as JSON generated from an internal CSV. The same codebase supports an academic milestone (course project) and a **live** deployment on GitHub Pages.

Because this is a **student-built, course-evaluated** project, the source includes **internal documentation in the form of in-code comments** that go beyond what you would normally expect in a lean production codebase. Comments explain intent, theory where it helps, and how major sections execute so **instructors and peers can review the work**, and so the author can return later and still understand each part. Toward the **final project** submission, that documentation layer is expected to grow—**more extensive than typical**—to match the learning and review goals of the assignment.

## Project 01 — Why does it exist?

Students preparing for promotion tests often track requirements in scattered ways (notes, memory, screenshots). Class time is limited, so most prep happens outside the school. This project gives **one place** to see rank-aligned requirements and self-track progress before instructor evaluation. **Primary audience:** students at Brownsville Kuk Sool Won. Instructors and parents can use it as a shared reference. It is a **personal preparation tool**, not an official grading system. The motivation is both **course learning** (shipping a real, deployed web project with documentation) and **practical use** for the school community.

## Project 01 — What tools did I use?

| Tool | Why I chose it |
|------|----------------|
| **Cursor** | Primary editor; fast iteration and integrated AI-assisted editing and debugging. |
| **Visual Studio Code** | Backup editor; familiar and reliable for quick edits outside Cursor. |
| **HTML, CSS, JavaScript (no framework)** | Keeps the stack small, readable, and easy to deploy as static files without build tooling for the app itself. |
| **GitHub** | Version control, collaboration, and hosting integration. |
| **GitHub Desktop / Git** | Day-to-day commits, branches, and sync with `origin`. |
| **GitHub Pages** | Free static hosting tied to the repo; simple publish path for the live site. |
| **Node.js** | Runs the CSV→JSON generator (`scripts/csv-to-app-syllabus-db.mjs`); no app server required in production. |
| **Cursor AI / ChatGPT** | Planning, debugging, and implementation support; I review and own the resulting code. |

## Project 01 — How to visit the deployed site

- **Deployed application:** [https://jasytionline.github.io/r73-ksw-dashboard/](https://jasytionline.github.io/r73-ksw-dashboard/)  
- **Source repository:** [https://github.com/JASYTIONLINE/r73-ksw-dashboard](https://github.com/JASYTIONLINE/r73-ksw-dashboard)

Open the live URL in a normal or private browser window to confirm you see the current build (avoid stale cache if you changed the site recently).

---

## Developer documentation

### Prerequisites

- **Node.js** (for regenerating syllabus JSON from CSV). Version aligned with your local dev environment is sufficient; no framework install required for the static site.

### Architecture overview

- **Frontend:** static HTML/CSS/vanilla JavaScript.
- **Data:** canonical spreadsheet export in `assets/data/csv/ksw-syllabus.csv`; runtime database in `assets/data/json/app-syllabus.db.json`. The dashboard accepts **either** shape: (1) **top-level maps** — keys such as `Rank`, `skillCatagory`, `SKILL` (each an object keyed by id), `skillStatus`, `student`, etc.; or (2) a **legacy envelope** with `tables` (arrays), `items`, `beltStepLabels`, and optional `version` — as produced by `node scripts/csv-to-app-syllabus-db.mjs`. The client normalizes (1) into (2) in memory for the UI.
- **Persistence:** `localStorage` per browser (full syllabus snapshot after first load, status overrides, profile). The committed JSON seeds the browser only when no saved snapshot exists; thereafter local data wins until the user resets, clears site data, or imports a file.
  - Local-only storage can be lost if the user clears site data, switches browsers or devices, or storage is reset—there is no server-side account in this architecture. Export and import of a JSON snapshot were added so progress and profile can be recovered without a backend, mitigating that limitation.
- **Hosting:** GitHub Pages from this repository.

### Local development

1. Clone the repository.
2. Open `index.html` or serve the repo root with any static file server if you prefer.
3. After editing `assets/data/csv/ksw-syllabus.csv`, regenerate the app database JSON from the repo root:

```bash
node scripts/csv-to-app-syllabus-db.mjs
```

Commit updated `assets/data/json/app-syllabus.db.json` when you want production to match.

### Repository structure

- `index.html` — landing page  
- `about.html` — purpose and usage guidance  
- `contact.html` — legacy file only (not linked in navigation; see note below)  
- `dashboard.html` — dashboard UI and client-side logic  
- `assets/css/` — layout and theme styles  
- `assets/data/json/app-syllabus.db.json` — curriculum database (loaded by the dashboard; may be top-level maps or legacy envelope)  
- `assets/data/csv/ksw-syllabus.csv` — authoring source for the CSV → JSON generator  
- `scripts/csv-to-app-syllabus-db.mjs` — `ksw-syllabus.csv` → legacy-envelope JSON at `assets/data/json/app-syllabus.db.json` (do not run this if you are maintaining the map-shaped JSON by hand)  
- `scripts/export-ksw-syllabus-csv.js` — legacy envelope only; exits with an error if the JSON is map-shaped  

### Feature summary by page

**`index.html`** — Navigation, CTA mailto, optional CTA animation (respects `prefers-reduced-motion`). On **phones and small tablets** (≤768px), the sidebar is hidden in favor of a **fixed top navigation bar**; the same **Contact US** address block used in the desktop sidebar is **duplicated at the bottom** of the home column so contact info stays visible without the sidebar.

**`about.html`** — Static content: purpose, audience, proficiency guidance. The **page footer** is a single **Contact US** mailto card (gold “button” styling aligned with the theme), not the full dashboard-style footer (site link row + address tagline). The body uses an `about-page` class for that layout.

**`contact.html`** — The standalone contact page is **disabled in the UI as redundant**: instructor contact is covered by the shared **Contact Instructor** mailto bar (same actions) on Dashboard, About, and related pages, so the site no longer links to `contact.html`. The file remains in the repo for reference and direct URL access; see the HTML comment at the top of that file.

**`dashboard.html`** — Profile fields (persisted), **age band** (Junior 12 & under / Adult & Youth 13+) and **rank** selection, syllabus filtering from **`requirementsByAgeBand`** when present, otherwise from **`items`** using **`thirteenPlus` / `twelveDown`** (or legacy **`rank`**) for “to learn” vs “maintain”, **progressive disclosure** (`<details>`: category → learning-objective set → table), columns description / learning objective name / status, category order from `categoryPriority`, optional friendly labels via `categoryDisplayNames` and `learningObjectiveDisplayNames`, export/import JSON with modals, clear-data reset, sidebar navigation helpers and scroll jump controls (scroll controls are hidden on small screens where they would crowd the layout).

- **Progress Summary** — Live **totals** and **per-status counts** for **Untrained**, **In Progress**, **Trained**, and **Proficient**, calculated from the **same filtered requirement rows** as the two main sections (not from hidden skills). Counts are **split into two panels**: **To learn** (keys mapped to the current rank for the selected age band) and **Maintain** (keys mapped to any lower rank for that band). The section updates when the user changes **Age**, **Current Rank**, any requirement status, loads or imports data, or when curriculum load fails. On wide viewports the two panels sit **side by side** with spacing and bordered panels; on narrow screens they **stack**.

### Stylesheets (quick map)

- **`assets/css/style.css`** — Shared layout, dashboard tables, mobile fixed nav offset, progress summary grid, requirement tables, progressive-disclosure summaries.
- **`assets/css/dragon.css`** — Dragoneye theme (colors, cards, buttons, About-specific footer chrome where applicable).
- **`assets/css/home.css`** — Home page gold/maroon layout, home-only mobile nav tweaks.

### JavaScript behavior (high level)

- Loads syllabus from `localStorage` when a snapshot exists, otherwise fetches `assets/data/json/app-syllabus.db.json` once and saves a snapshot; merges saved status and profile keys from `localStorage`.
- Resolves **To learn** / **Maintain** from **`requirementsByAgeBand`** when present; otherwise from **`items`** using **`thirteenPlus`** (Adult & Youth) vs **`twelveDown`** (Junior), with **`rank`** as fallback. Map-shaped repo JSON is normalized on load. Imports that still use legacy keys `under-18` / `over-18` are normalized on load. Older exports without mappings still load: the client falls back to per-age **`syllabusByAgeGroup[band].items`** and rank filtering when present.
- Renders requirements with **progressive disclosure**; status dropdowns persist per skill key (`data-item-key`).
- **Progress Summary** recomputes from the filtered lists and saved statuses (see `getLearnMaintainBundle()` and `updateProgressSummary()` in `dashboard.html`).
- Export includes curriculum snapshot plus user object; import validates and applies.
- Modal flows for export, import, and reset; header-based scroll jumps within `.page-content`.

### Data pipeline

Run `node scripts/csv-to-app-syllabus-db.mjs` after editing `assets/data/csv/ksw-syllabus.csv`.

The generator parses the full CSV (including repeated headers) and emits JSON with a numeric **`version`** (see the file for the current value):

| Field | Role |
|--------|------|
| **`items`** | Master skill catalog (legacy envelope): one row per skill `key` / `keyId`, with **`thirteenPlus`** / **`twelveDown`** as belt-step ranks 1–16 (CSV generator), `rank` as fallback, `type`, `learningObjective`, `name`, `description`, etc. |
| **`requirementsByAgeBand`** | Optional: for each of **`junior`** and **`adult-youth`**, maps rank (`"1"` … `"16"`) to ordered skill keys. When absent, the dashboard derives learn/maintain from **`items`** only. |
| **`syllabusByAgeGroup`** | Metadata only (`source` paths); keys **`junior`** and **`adult-youth`** match the age bands above. |
| **`categoryDisplayNames`**, **`learningObjectiveDisplayNames`** | Optional maps from raw CSV strings to friendlier labels in disclosure headings (empty objects until you add entries). |
| **`beltStepLabels`**, **`categoryPriority`**, **`objects`** | Same roles as before. |

The build checks **referential integrity**: every key listed under `requirementsByAgeBand` must exist in **`items`**. Duplicate `key` values in the Syllibus section are skipped with a console warning.

**Legacy JSON:** Imports that only have top-level `items` (and optional older `syllabusByAgeGroup` item arrays) still work; status overrides reapply across every item array present in the file.

### Persistence and operations

Progress and profile data live in the browser only unless the user exports JSON. Clearing site data removes local state unless they re-import a backup.

### Out of scope (current phase)

- Authentication, instructor admin backend, centralized user database, real-time messaging, full LMS/media portal.

---

## License

See [LICENSE](LICENSE) in the repository root.
