# Brownsville Kuk Sool Won Dashboard

This project is a student-facing progress dashboard for Brownsville Kuk Sool Won (KSW).  
Its purpose is to help students track rank requirements, monitor progress toward their next test date, and request an instructor audit.

## Project Scope (Week 02 MVP)

The MVP focuses on a simple, buildable dashboard:

- Student selects current rank from a dropdown
- Student selects next testing date from a calendar input
- Dashboard displays required material for the selected rank
- Student tracks each requirement using a 4-level proficiency state:
  - Untrained
  - Exposed
  - Trained
  - Proficient
- Student progress is saved locally in the browser
- Student can contact the instructor through a simple audit request email link

## Out of Scope for MVP

To keep this project realistic for the course timeline, the following are intentionally excluded:

- Training video/media portal
- Instructor dashboard
- Authentication/login system
- Internal messaging platform
- Full LMS/Canvas-style system

## Tech Approach

- HTML, CSS, JavaScript
- One local JSON data source for curriculum requirements
- `localStorage` for persisted student progress state
- GitHub repository and GitHub Pages deployment

## Current Goal

Build a clean landing page and student dashboard that are easy to use, easy to maintain, and aligned with KSW rank progression and testing preparation.
