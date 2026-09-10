# Seongtae Bang — Academic Homepage

A responsive academic portfolio for GitHub Pages. Plain HTML, CSS, and JavaScript; no framework, dependencies, or build step.

## Structure

- `index.html` — introduction, selected work, research directions, background, and contact
- `research.html` — research areas, current work, and selected publications
- `publications.html` — complete publication list with expandable overviews
- `assets/js/publications.js` — single source of truth for publication entries
- `assets/js/site.js` — publication rendering, accessible overview controls, fragment links, and mobile navigation
- `assets/css/style.css` — shared theme, responsive layouts, and reduced-motion rules
- `assets/images/` — original profile photograph, favicon, and research figures
- `.nojekyll` — serve the repository directly as a static site

## Update publications

Edit `assets/js/publications.js`. Entries appear on the full publication page; `selected: true` also includes an entry on the homepage and research page. Preserve author order, venue, acceptance status, figure paths, and public artifact links.

Optional `outcome` fields (`prefix`, `value`, `label`, and `context`) show a result on the homepage. Keep the comparison and evaluation conditions in `context`, and keep the full explanation in `details.result`. Set `researchArea` to `memory`, `training`, or `architecture` for the corresponding accent.

Existing links such as `publications.html#reclaimx` continue to work and automatically expand the referenced publication. Overview buttons support the keyboard; Escape closes a focused overview and returns focus to its trigger. Mobile navigation remains available without JavaScript. Motion respects the visitor's reduced-motion preference.

## Content and disclosure

The redesign retains the publication records, acceptance statuses, education dates, affiliation, photograph, and figures in the original repository. The ASPLOS 2027 acceptance remains an unnamed machine-learning systems paper. Do not publish its title or additional unpublished research details without an explicit content update from the owner.

Research outcome highlights summarize the results already recorded in the publication data; they are not newly measured benchmarks.

## Deploy

GitHub Pages serves the repository root from `main`. Merging a reviewed change into `main` updates the public website.

## Local checks

```bash
node --check assets/js/site.js
node --check assets/js/publications.js
git diff --check
```

Check that local `src` and `href` references exist and that publication IDs remain unique when editing content. Remote technology logos are decorative; the tool names remain readable if a provider is unavailable.

## Profile and CV

The portrait is `assets/images/profile.jpg`. A CV link can be added once a public CV is available; no placeholder download is shown.
