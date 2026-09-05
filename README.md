# Seongtae Bang — Academic Homepage

A lightweight academic homepage designed for GitHub Pages. No Jekyll, npm, or build step is required.

## Structure

- `index.html` — main homepage
- `research.html` — research overview
- `publications.html` — complete publication list
- `assets/js/publications.js` — **single source of truth for publication entries**
- `assets/css/style.css` — shared styling
- `assets/images/favicon.svg` — favicon
- `.nojekyll` — serve directly as a static site

## Update publications

Edit only `assets/js/publications.js`. New entries automatically appear on `publications.html`; set `selected: true` to also show them on the homepage and research page.

## Deploy

Copy these files to the root of `st-bang97/st-bang97.github.io` and push to `main`.

```bash
git add .
git commit -m "Build academic homepage"
git push origin main
```

In GitHub: **Settings → Pages → Deploy from a branch → main → /(root)**.

## Profile image

The current homepage references the public GitHub avatar directly. To use a local high-resolution photo instead, place it at `assets/images/profile.jpg` and replace the `img src` in `index.html` with `assets/images/profile.jpg`.

## CV

When a CV PDF is ready, place it at `assets/cv/seongtae-bang-cv.pdf` and add a CV button to the hero section.

## Homepage sections

The homepage includes research areas, current research, technical skills, publications with interactive paper overviews, education, and contact information.

## Public code

pNet-gem5 code and execution examples: https://github.com/caslab-yonsei/pNet-gem5
