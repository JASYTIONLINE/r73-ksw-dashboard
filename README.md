# Brownsville Kuk Sool Won Student Dashboard

A static, responsive website and student dashboard for Brownsville Kuk Sool Won students, families, and instructors. The site explains the school, provides instructor contact paths, and gives current students a browser-based tool for reviewing rank requirements and tracking training progress.

- **Live site:** [https://jasytionline.github.io/r73-ksw-dashboard/](https://jasytionline.github.io/r73-ksw-dashboard/)
- **Repository:** [https://github.com/JASYTIONLINE/r73-ksw-dashboard](https://github.com/JASYTIONLINE/r73-ksw-dashboard)
- **Project reflection:** [REFLECTION.md](REFLECTION.md)
- **Course milestone:** CMPA 4303 Project 02: Final MVP

## P02 Delivery Package
Project 02 asks for three deliverables, and this repository is organized around those requirements.

- **Deployed, functional project:** The project is published through GitHub Pages at the live URL above.
- **Expanded README:** This document is the source-of-truth project contract for the final MVP. It explains what the project is, why it exists, how to access it, what tools were used, what features are promised, and what changed from P01 to P02.
- **Reflection document:** [REFLECTION.md](REFLECTION.md) is a separate personal reflection covering decisions, what worked, what I would change, and what I learned.

## What Is This?
This is a static website built with HTML, CSS, and vanilla JavaScript for Brownsville Kuk Sool Won. It combines a public-facing school website with a student-facing training dashboard.

Visitors can learn what the Brownsville Kuk Sool Won project is, find instructor contact actions, open a weekly focus resource, and navigate to the Student Dashboard. Current students can use the dashboard to choose a WKSA testing band and current rank, review rank-aligned requirements, track progress with status controls, and see progress summaries based on the same filtered curriculum data.

The final MVP is intentionally scoped. It does not include accounts, a production backend, an admin editor, or a full media library. It focuses on a complete, usable static site and a working student dashboard that supports training preparation between classes.

## Why It Exists
Students preparing for rank promotion often track requirements through memory, paper notes, screenshots, or verbal reminders. That can make it hard to know what to practice next, especially between classes.

This project gives students and families one place to check rank-aligned requirements, track personal progress, and find available study resources. It is not an official grading system and does not replace instructor evaluation. It is a preparation and reference tool that supports students before they ask an instructor for final readiness feedback.

The project also exists as a course deliverable. It demonstrates planning, implementation, deployment, iteration, documentation, and reflection in a real web project.

## How To Access It
Open the deployed site here:

[https://jasytionline.github.io/r73-ksw-dashboard/](https://jasytionline.github.io/r73-ksw-dashboard/)

For final submission testing, open the live URL in a normal browser and in a private/incognito window. This confirms that the public deployment loads without relying on local files, cached data, or development-only paths.

## Tools Used
- **HTML:** Page structure for the landing page, dashboard, about page, contact page, and study-resource page.
- **CSS:** Shared layout, responsive behavior, theme styling, button states, mobile navigation, and dashboard tables.
- **Vanilla JavaScript:** Dashboard filtering, progress status updates, local storage, modal behavior, study-resource links, and scroll controls.
- **JSON and CSV:** Curriculum data starts from CSV and is served to the dashboard as JSON.
- **Node.js:** Runs utility scripts such as `scripts/csv-to-app-syllabus-db.mjs` for data generation.
- **Git and GitHub:** Version control, repository hosting, and project history.
- **GitHub Pages:** Static deployment for the live site.
- **Cursor and Visual Studio Code:** Development, editing, debugging, planning, and documentation workflow.

## Final Feature Contract
This section is the feature checklist for the final MVP. Features listed here must be available in the delivered site, with mobile layouts prioritized for efficient browsing and page-specific tasks.

### Sitewide Features
- Public landing page for Brownsville Kuk Sool Won.
- Primary navigation to Home, Student Dashboard, and About from the main site pages.
- Clear Student Dashboard access from the main navigation.
- Contact Instructor actions for scheduling a private session, requesting an assessment, and sending a general inquiry.
- School contact information with address and phone number.
- Weekly Focus access for the current featured training resource.
- Consistent visual theme across the landing page, dashboard, about page, contact page, and study-resource page.
- Keyboard-visible focus styles for major buttons and controls.

### Student Dashboard Features
- WKSA testing band selection: Age 8 & under, Age 9-12, and Age 13 & over.
- Current rank selection from White Belt through Jyo Kyo Nim.
- Student name selection with manual-entry option.
- Student ID, school location, testing eligibility, next testing date, and membership fields.
- Browser-local persistence for student profile and progress information.
- Testing For card showing the next-rank technique sets for the selected age band and rank.
- Progress Summary split into To Learn and Maintain groups.
- Requirements grouped by proficiency, category, and technique set.
- Per-skill status controls for Untrained, In Progress, Trained, and Proficient.
- Study resources dropdown for completed curated resources.
- Reset/Clear Data action for locally saved dashboard information.
- Desktop scroll controls for moving through dashboard sections.

### Mobile Access And Prioritization
Mobile mode keeps site-level access to the important project features, but it does not repeat every desktop sidebar utility on every secondary page. The layout changes to improve user experience by removing redundant mobile content from pages where it distracts from the main task.

On phones and narrow screens, the homepage carries the full public utility flow: school identity, Student Dashboard access, Weekly Focus, Contact Instructor actions, Mind / Body / Soul branding, and school contact details. The Student Dashboard mobile view prioritizes the Kuk Sool Won hero, Weekly Focus, and the dashboard controls/content. The About mobile view prioritizes the dashboard explanation, purpose, proficiency levels, important notes, and contact information.

Duplicate sidebar navigation, contact blocks, and repeated utility panels may be hidden on secondary mobile pages when the same actions remain available elsewhere in the mobile site flow. This keeps mobile browsing focused and efficient without removing the feature from the final project.

## What Changed From P01 To P02
P01 established the core project: a static, deployed dashboard that could load curriculum data and show student rank requirements. P02 focuses on making the project more complete, consistent, and usable. The main direction is to protect the original dashboard scope while improving the parts a student or parent would notice first: navigation, button behavior, mobile layout, contact actions, documentation, and clarity of final scope.

- **Age-band requirement logic:** The dashboard now treats WKSA testing band as part of the requirements workflow instead of relying only on current rank.
- **Grouped dashboard requirements:** Requirements are organized by proficiency, category, and technique set so students do not have to scan one long list.
- **Progress summaries:** The dashboard gives students a clearer summary of what they need to learn and what they need to maintain.
- **Contact workflow improvements:** Instructor contact actions are split into clearer categories for private sessions, assessments, and general questions.
- **Mobile UX prioritization:** P02 keeps important features available in the mobile site flow while hiding redundant sidebar utilities on secondary pages so users can browse more efficiently.
- **Study-resource scope control:** The dashboard keeps a Study resources dropdown for completed curated resources, but the per-row Study column is not part of the final MVP.
- **Save/Load scope control:** Visible import/export progress controls are not part of the final MVP because the student-facing workflow needs more polish before release.
- **Removed admin/editor scope:** The backend JSON editor is not part of the final project promise.
- **Removed placeholder scope:** Coming Soon pages and placeholder study-resource promises are not part of the final MVP.
- **Documentation:** The README and `REFLECTION.md` are updated for Project 02 and must match the deployed site.

## How To Use The Dashboard
1. Open the live site.
2. Go to the Student Dashboard.
3. Choose the student testing band and current rank.
4. Review the Testing For card and the progress summary.
5. Open requirement sections by proficiency, category, and technique set.
6. Use the status dropdowns to track practice progress.
7. Use the Study resources dropdown when a completed curated resource is available.
8. Use Contact Instructor actions from the homepage or contact paths when a student needs a private session, assessment, or general help.

## Project Structure
- `index.html` - landing page and primary public entry point.
- `dashboard.html` - main student dashboard and client-side logic.
- `about.html` - project purpose, audience, and usage guidance.
- `contact.html` - direct contact page for instructor outreach.
- `contents/Skills/sc010-foundations/tie-your-belt.html` - completed study-resource page.
- `assets/css/style.css` - shared layout, dashboard structure, responsive behavior, and reusable component sizing.
- `assets/css/dragon.css` - active visual theme, colors, buttons, focus states, and themed component borders.
- `assets/css/home.css` - home page layout, landing-page spacing, and responsive home-page behavior.
- `assets/js/sidebar-feature.js` - Weekly Focus sidebar behavior.
- `assets/data/csv/ksw-syllabus.csv` - curriculum authoring source.
- `assets/data/json/app-syllabus.db.json` - dashboard runtime data.
- `scripts/` - data conversion and maintenance utilities.
- `REFLECTION.md` - P02 reflection document.

## Technical Notes
The site is intentionally static. There is no production server, account system, database, authentication layer, or admin/editor interface. GitHub Pages can host the project because all runtime behavior happens in the browser.

The dashboard loads `assets/data/json/app-syllabus.db.json`. It supports the current data shape and older legacy shapes, then normalizes the data in memory before rendering the UI. Profile and progress information use `localStorage`, so data is tied to the browser and device. Clearing site data can remove local progress.

The CSS is split by responsibility: `style.css` handles shared structure, `dragon.css` handles the active visual theme, and `home.css` handles the landing page.

## Local Development
No build step is required for the site itself.

1. Clone the repository.
2. Open `index.html` directly or serve the repository root with a static file server.
3. To regenerate the dashboard JSON from CSV, run:

```bash
node scripts/csv-to-app-syllabus-db.mjs
```

4. Review the generated `assets/data/json/app-syllabus.db.json` before committing it.

## Final QA/QC Checklist
Before submitting P02, use this checklist to confirm the deployed project and repository are ready:

- The live GitHub Pages URL loads in a normal browser and in a private/incognito window.
- All pages listed in this README load without errors.
- Main navigation works on the landing page, dashboard, about page, contact page, and study-resource page.
- Every internal link, external link, `mailto:`, and `tel:` action works.
- The desktop feature list in this README is fully available in desktop/PC view.
- Mobile mode preserves site-level access to key features while prioritizing page-specific content on secondary pages.
- Secondary mobile pages hide redundant sidebar utilities only when those actions remain available elsewhere in the mobile site flow.
- Contact Instructor actions are accessible through the mobile homepage and contact paths.
- The Student Dashboard is easy to find and understand.
- The homepage clearly explains Brownsville Kuk Sool Won and the Student Dashboard purpose within the first few seconds.
- Dashboard controls work for WKSA testing band, current rank, student profile fields, Study resources, progress status controls, and Clear Data.
- Images and videos load without broken browser placeholders.
- No Coming Soon pages, placeholder content, filler text, or unfinished study-resource promises are part of the final user flow.
- No backend JSON editor or admin/editor path is promised or linked.
- The site is usable on desktop, tablet, and phone widths.
- Buttons stay inside their containers and remain readable.
- Keyboard focus is visible on major buttons and controls.
- The browser console has no errors during normal use.
- `README.md` reflects the deployed Project 02 version.
- `REFLECTION.md` exists, matches the final project story, and addresses decisions, what worked, what I would do differently, and what I learned.
- The repository has been reviewed for unnecessary leftover files before final submission.

## Known Limits And Future Improvements
- Progress is local to the browser because there is no account system or backend.
- The dashboard JavaScript is still concentrated in `dashboard.html`; splitting it into modules would improve maintainability.
- A future version could add instructor/admin tools, authentication, cloud sync, import/export controls, and a fuller media library.

## License
See [LICENSE](LICENSE) in the repository root.
