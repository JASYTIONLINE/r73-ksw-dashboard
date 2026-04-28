# Brownsville Kuk Sool Won Student Dashboard

A static, responsive student dashboard for Brownsville Kuk Sool Won students to view rank requirements, track practice progress, and access study resources from a live GitHub Pages site.

- **Live site:** [https://jasytionline.github.io/r73-ksw-dashboard/](https://jasytionline.github.io/r73-ksw-dashboard/)
- **Repository:** [https://github.com/JASYTIONLINE/r73-ksw-dashboard](https://github.com/JASYTIONLINE/r73-ksw-dashboard)
- **Project reflection:** [REFLECTION.md](REFLECTION.md)
- **Course milestone:** Project 02 Final Delivery

## P02 Delivery Package
Project 02 asks for three deliverables, and this repository is organized around those requirements.

- **Deployed, functional project:** The dashboard is published through GitHub Pages at the live URL above.
- **Expanded README:** This document explains the current project, why it exists, tools used, how to visit it, what changed from P01 to P02, and the technical structure.
- **Reflection document:** [REFLECTION.md](REFLECTION.md) is a separate personal reflection covering decisions, what worked, what I would change, and what I learned.

## What Is This?
This is a static website built with HTML, CSS, and vanilla JavaScript. It serves as a student-facing progress dashboard for Brownsville Kuk Sool Won.

Students choose a WKSA testing band, select their current rank, and review the skills connected to their rank path. The dashboard groups requirements by proficiency, category, and technique set so the material is easier to scan than a single long checklist. Students can update each requirement with a status such as Untrained, In Progress, Trained, or Proficient, and the progress summary updates from the same filtered requirement data.

The site also includes a landing page, an about page, contact actions, a weekly focus link, and study-resource pages. For P02, the dashboard keeps the Study resources dropdown but hides the per-row Study column so the requirements table stays focused on the original skill-tracking scope.

## Why It Exists
Students preparing for rank promotion often track requirements through memory, paper notes, screenshots, or verbal reminders. That can make it hard to know what to practice next, especially between classes.

This project gives students and families one place to check rank-aligned requirements, track personal progress, and find available study resources. It is not an official grading system and does not replace instructor evaluation. It is a preparation and reference tool that supports students before they ask an instructor for final readiness feedback.

The project also exists as a course deliverable. It demonstrates planning, implementation, deployment, iteration, documentation, and reflection in a real web project.

## How To Visit The Site
Open the deployed site here:

[https://jasytionline.github.io/r73-ksw-dashboard/](https://jasytionline.github.io/r73-ksw-dashboard/)

For final submission testing, open the live URL in a normal browser and in a private/incognito window. This helps confirm that the public deployment loads without relying on local files, cached data, or development-only paths.

## Tools Used
- **HTML:** Page structure for the landing page, dashboard, about page, contact page, and study-resource pages.
- **CSS:** Shared layout, responsive behavior, theme styling, button states, mobile navigation, and dashboard tables.
- **Vanilla JavaScript:** Dashboard filtering, progress status updates, local storage, modals, study-resource links, and scroll controls.
- **JSON and CSV:** Curriculum data starts from CSV and is served to the dashboard as JSON.
- **Node.js:** Runs utility scripts such as `scripts/csv-to-app-syllabus-db.mjs` for data generation.
- **Git and GitHub:** Version control, repository hosting, and project history.
- **GitHub Pages:** Static deployment for the live site.
- **Cursor and Visual Studio Code:** Development, editing, debugging, and documentation workflow.

## Current Features
- Landing page with school branding, CTA, instructor contact actions, mobile navigation, and Weekly Focus access.
- Dashboard with WKSA testing band selection: Age 8 & under, Age 9-12, and Age 13 & over.
- Rank-based requirement filtering from the curriculum data.
- Progressive disclosure for requirement groups so students can expand only the sections they need.
- Progress summary split into To Learn and Maintain groups.
- Per-skill status controls for Untrained, In Progress, Trained, and Proficient.
- Browser-local persistence for profile and status information.
- Study resources dropdown remains available for curated resources, while the per-row Study column is temporarily hidden for P02 scope control.
- Responsive layout improvements for desktop, tablet, and phone widths.
- Keyboard-visible focus styles for buttons and important controls.
- Optional local JSON editor for maintaining the curriculum data.

## What Changed From P01 To P02
P01 established the core project: a static, deployed dashboard that could load curriculum data and show student rank requirements. P02 focused on making the project more complete, consistent, and usable.

- **Updated project description:** The project is now documented as a fuller student dashboard with rank filtering, progress summaries, study-resource links, responsive layout, and P02 delivery documents.
- **Visual consistency:** Navigation, page titles, contact labels, address text, button states, and theme styling were tightened across the landing page, dashboard, about page, legacy contact page, and study-resource pages.
- **Interaction consistency:** Buttons now have stronger shared sizing and focus behavior. Long labels are allowed to wrap instead of running outside their boxes.
- **Mobile usability:** The Weekly Focus feature now appears in the mobile home page flow. The dashboard requirements area was adjusted to reduce unwanted left-right scrolling and keep the visible Learning Objective and Status columns readable.
- **Content completeness:** The per-row Study column was temporarily hidden from the dashboard requirements table. The requirements list still shows all skills, and the Study resources dropdown remains available for curated resources.
- **Feature scope decision:** Visible Save/Load progress controls were hidden for this delivery because they added interface complexity. The import/export code remains in the project so the feature can be restored in a later iteration.
- **Asset cleanup:** The landing page logo now uses an existing PNG asset instead of a BMP path with encoded spaces.
- **Tooling polish:** The optional JSON editor received cleaner file-picker markup and visible focus states.
- **Documentation:** The README was rewritten for P02 and a separate `REFLECTION.md` was added.

## How To Use The Dashboard
1. Open the live site.
2. Go to the Student Dashboard.
3. Choose the student testing band and current rank.
4. Review the Testing For card and the progress summary.
5. Open requirement sections by proficiency, category, and technique set.
6. Use the status dropdowns to track practice progress.
7. Use the Study resources dropdown when a curated resource is available.
8. Use Contact Instructor actions when a student needs a private session, assessment, or general help.

## Project Structure
- `index.html` - landing page and primary public entry point.
- `dashboard.html` - main student dashboard and client-side logic.
- `about.html` - project purpose, audience, and usage guidance.
- `contact.html` - legacy direct-access contact page; current contact actions are in the shared sidebar.
- `contents/Skills/sc010-foundations/` - study-resource pages.
- `assets/css/style.css` - shared layout and dashboard structure.
- `assets/css/dragon.css` - visual theme, colors, buttons, and focus states.
- `assets/css/home.css` - home page layout and responsive behavior.
- `assets/js/sidebar-feature.js` - Weekly Focus sidebar behavior.
- `assets/data/csv/ksw-syllabus.csv` - curriculum authoring source.
- `assets/data/json/app-syllabus.db.json` - dashboard runtime data.
- `scripts/` - data conversion and maintenance utilities.
- `backend/json-interface.html` - optional local curriculum JSON editor.
- `REFLECTION.md` - P02 reflection document.

## Technical Notes
The site is intentionally static. There is no production server, account system, database, or authentication layer. GitHub Pages can host the project because all runtime behavior happens in the browser.

The dashboard loads `assets/data/json/app-syllabus.db.json`. It supports the current data shape and older legacy shapes, then normalizes the data in memory before rendering the UI. Profile and progress information use `localStorage`, so data is tied to the browser and device. Clearing site data can remove local progress.

The visible import/export controls are hidden in the current P02 interface, but the underlying code is still present. This was a scope decision: the feature is useful, but the interface needs more polish before it returns as a visible student-facing workflow.

## Local Development
No build step is required for the site itself.

1. Clone the repository.
2. Open `index.html` directly or serve the repository root with a static file server.
3. To regenerate the dashboard JSON from CSV, run:

```bash
node scripts/csv-to-app-syllabus-db.mjs
```

4. Review the generated `assets/data/json/app-syllabus.db.json` before committing it.
5. If using the optional JSON editor, open `backend/json-interface.html` from a local server rooted at the repository so relative paths resolve correctly.

## Final Delivery Checklist
Before submitting P02, these are the checks used for the project:

- The live GitHub Pages URL loads.
- The README reflects the current project, not the older P01 version.
- `REFLECTION.md` exists and addresses decisions, what worked, what I would do differently, and what I learned.
- Main navigation works on the landing page, dashboard, about page, contact page, and study-resource pages.
- Contact links open email actions.
- Images load without broken browser placeholders.
- The Study resources dropdown remains available, and the per-row Study column is hidden so the dashboard does not present incomplete resource links.
- The site is usable on desktop, tablet, and phone widths.
- Buttons stay inside their containers and remain readable.
- The dashboard requirements section is usable on mobile without unnecessary horizontal scrolling.
- Keyboard focus is visible on major buttons and controls.
- The browser console should be checked before final submission.
- The repository should be reviewed for unnecessary leftover files before final submission.

## Known Limits And Future Improvements
- Progress is local to the browser because there is no account system or backend.
- The dashboard JavaScript is still concentrated in `dashboard.html`; splitting it into modules would improve maintainability.
- Full study-resource pages are still being developed for many skills, so the per-row Study column is hidden until that content is ready.
- Import/export progress controls are present in code but hidden until the student-facing workflow is clearer.
- A future version could add instructor/admin tools, authentication, cloud sync, and a fuller media library.

## License
See [LICENSE](LICENSE) in the repository root.
