# Seongtae Bang, academic homepage

Static site for GitHub Pages (https://st-bang97.github.io). Plain HTML, CSS, and JavaScript; no Jekyll and no npm packages.

## Structure

| Path | What it is |
| --- | --- |
| `index.html` | Home: profile, result charts, publication cards, research focus and stack diagram, news, skills, education, contact |
| `publications.html` | Full publication list with one-figure overviews |
| `research.html` | Redirect to `index.html#research` (keeps old links working) |
| `404.html` | Not-found page (uses absolute `/assets/...` paths) |
| `assets/js/publications.js` | **Publication data, single source of truth** |
| `assets/js/research.js` | Layers of the "Across the system stack" diagram |
| `assets/js/render.js` | HTML templates shared by the browser and the build script |
| `assets/js/site.js` | Overview toggles and deep links (`publications.html#reclaimx`) |
| `assets/css/site.css` | All styles |
| `assets/images/papers/` | Overview figures (SVG, 760×420 viewBox) |
| `assets/images/og-card.png` | Link-preview image (1200×630) |
| `tools/build.mjs` | Prerenders data-driven sections into the HTML |

## Updating content

1. Edit `assets/js/publications.js` (papers) or `assets/js/research.js` (map lanes, ongoing work). Field descriptions are at the top of each file.
2. Run the build so the HTML itself contains the rendered sections (search engines, link previews, and readers without JavaScript see them):

   ```bash
   node tools/build.mjs
   ```

   It fills every `<!-- region:NAME -->` block, stamps "Updated <Month YYYY>" in the footer, and refreshes `sitemap.xml`. Node 16 or newer, no dependencies.
3. Commit and push.

If you forget step 2, the site still shows the new data: `site.js` re-renders a section whenever its data no longer matches the prerendered HTML.

`site.js` also opens the paper overview window (from the Overview buttons, paper figures, publication titles, and any `publications.html#id` link on the home page), animates the result charts, and fades sections in on scroll. All motion is skipped when the visitor's system asks for reduced motion.

Edit the profile text, Research Focus, News, Technical skills, and Education directly in `index.html`.

### Common edits

- **Paper moves from "to appear" to published:** set `status: 'published'`, complete `citation` (volume, pages), and add `links.doi`.
- **Author-version PDF:** put it in `assets/papers/` and add `links.pdf: 'assets/papers/NAME.pdf'`. Add PDFs only for published papers whose copyright form allows it.
- **Home page cards:** `selected: true` shows a paper as a figure card, in the order of the data file.
- **Result charts:** `highlight: true` plus a `result` object shows a paper as a chart card under the profile. Values are speedups over a 1× baseline.
- **Stack diagram:** list paper ids under the layer they change in `assets/js/research.js`; the pill color follows the paper's `thread`.
- **CV:** replace `assets/cv/seongtae-bang-cv.pdf` with the new PDF (same file name); the header, profile, and contact links already point to it.
- **Google Scholar:** uncomment the Scholar line in the profile links of `index.html` and paste the profile URL.
- **Photo:** replace `assets/images/profile.jpg` with a 3:4 image around 600×800 px.
- **Link preview:** `assets/images/og-card.png` is referenced from the page `<head>`; regenerate it when the headline papers change.

## Deploy

GitHub → Settings → Pages → Deploy from a branch → `main` → `/ (root)`. Every push to `main` publishes the site.
