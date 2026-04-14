# Brownsville Kuk Sool Won Student Dashboard

Static student dashboard for belt-rank curriculum tracking: rank-driven requirements, local progress and profile persistence, and CSV-sourced syllabus data.

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

This is a **static website** (HTML, CSS, vanilla JavaScript) that serves as a **student progress dashboard** for Brownsville Kuk Sool Won. Students choose their current rank and see syllabus requirements filtered to that step; they can record a per-skill status, store profile and progress in the browser, and export or import JSON as a backup. Curriculum data is shipped as JSON generated from an internal CSV. The same codebase supports an academic milestone (course project) and a **live** deployment on GitHub Pages.

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
| **Node.js** | Runs the CSV→JSON generator (`scripts/csv-to-syllabus-json.mjs`); no app server required in production. |
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
- **Data:** authoring in `private/ksw-roadmap-db.csv`; runtime payload in `assets/data/ksw-syllabus.json`.
- **Persistence:** `localStorage` per browser (status overrides, profile).
  - Local-only storage can be lost if the user clears site data, switches browsers or devices, or storage is reset—there is no server-side account in this architecture. Export and import of a JSON snapshot were added so progress and profile can be recovered without a backend, mitigating that limitation.
- **Hosting:** GitHub Pages from this repository.

### Local development

1. Clone the repository.
2. Open `index.html` or serve the repo root with any static file server if you prefer.
3. After editing `private/ksw-roadmap-db.csv`, regenerate JSON from the repo root:

```bash
node scripts/csv-to-syllabus-json.mjs
```

Commit updated `assets/data/ksw-syllabus.json` when you want production to match.

### Repository structure

- `index.html` — landing page  
- `about.html` — purpose and usage guidance  
- `contact.html` — legacy file only (not linked in navigation; see note below)  
- `dashboard.html` — dashboard UI and client-side logic  
- `assets/css/` — layout and theme styles  
- `assets/data/ksw-syllabus.json` — generated curriculum payload  
- `private/ksw-roadmap-db.csv` — source-of-truth data (not served as static assets by default)  
- `scripts/csv-to-syllabus-json.mjs` — CSV→JSON build script  

### Feature summary by page

**`index.html`** — Navigation, CTA mailto, optional CTA animation (respects `prefers-reduced-motion`).

**`about.html`** — Static content: purpose, audience, proficiency guidance.

**`contact.html`** — The standalone contact page is **disabled in the UI as redundant**: instructor contact is covered by the shared **Contact Instructor** mailto bar (same actions) on Dashboard, About, and related pages, so the site no longer links to `contact.html`. The file remains in the repo for reference and direct URL access; see the HTML comment at the top of that file.

**`dashboard.html`** — Profile fields (persisted), rank selection and syllabus filtering (“to learn” vs “maintain”), tables (description / learning objective / status), category order from `categoryPriority`, export/import JSON with modals, clear-data reset, sidebar navigation helpers and scroll jump controls (responsive).

### JavaScript behavior (high level)

- Loads syllabus JSON; merges saved status and profile from `localStorage`.
- Renders requirements by rank and category; status dropdowns persist per skill key.
- Export includes curriculum snapshot plus user object; import validates and applies.
- Modal flows for export, import, and reset; header-based scroll jumps within `.page-content`.

### Data pipeline

The generator parses the full CSV (including repeated headers), emits `items`, `beltStepLabels`, `categoryPriority`, and a generic `objects` map for forward-compatible object types. See script comments in `scripts/csv-to-syllabus-json.mjs`.

### Persistence and operations

Progress and profile data live in the browser only unless the user exports JSON. Clearing site data removes local state unless they re-import a backup.

### Out of scope (current phase)

- Authentication, instructor admin backend, centralized user database, real-time messaging, full LMS/media portal.

---

## License

See [LICENSE](LICENSE) in the repository root.
