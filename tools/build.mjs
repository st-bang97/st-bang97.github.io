#!/usr/bin/env node
/*
 * Prerender the data-driven sections into the HTML files.
 *
 *   node tools/build.mjs
 *
 * Run after editing assets/js/publications.js or assets/js/research.js, then
 * commit the changed HTML. No dependencies; Node 16 or newer.
 *
 * Fills every <!-- region:NAME --> ... <!-- /region:NAME --> block using the
 * same templates the browser uses (assets/js/render.js), refreshes the
 * matching data-sig attributes, stamps the year and "Updated" month in the footer,
 * and updates <lastmod> in sitemap.xml.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => readFileSync(join(root, rel), 'utf8');

const sandbox = { window: {} };
vm.createContext(sandbox);
for (const file of ['assets/js/publications.js', 'assets/js/research.js', 'assets/js/render.js']) {
  vm.runInContext(read(file), sandbox, { filename: file });
}
const { SiteRender: R, PUBLICATIONS: papers, RESEARCH: research } = sandbox.window;
const data = { papers, research };

const now = new Date();
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'];
const month = `${MONTHS[now.getMonth()]} ${now.getFullYear()}`;
const isoMonth = now.toISOString().slice(0, 7);
const isoDay = now.toISOString().slice(0, 10);

const rendered = {};
const render = (name) => {
  if (!(name in rendered)) {
    const make = R.regions[name];
    if (!make) throw new Error(`Unknown region "${name}"`);
    rendered[name] = make(data);
  }
  return rendered[name];
};

let changed = 0;
for (const page of ['index.html', 'publications.html']) {
  const before = read(page);
  let html = before.replace(
    /<!-- region:([\w-]+) -->[\s\S]*?<!-- \/region:\1 -->/g,
    (_, name) => name === 'updated'
      ? `<!-- region:updated --><time datetime="${isoMonth}">${month}</time><!-- /region:updated -->`
      : name === 'year'
        ? `<!-- region:year -->${now.getFullYear()}<!-- /region:year -->`
        : `<!-- region:${name} -->\n${render(name)}<!-- /region:${name} -->`
  );
  html = html.replace(
    /data-region="([\w-]+)" data-sig="[^"]*"/g,
    (_, name) => `data-region="${name}" data-sig="${R.hash(render(name))}"`
  );
  if (html !== before) {
    writeFileSync(join(root, page), html);
    changed++;
    console.log(`updated ${page}`);
  }
}

const sitemap = read('sitemap.xml');
const nextSitemap = sitemap.replace(/<lastmod>[^<]*<\/lastmod>/g, `<lastmod>${isoDay}</lastmod>`);
if (nextSitemap !== sitemap) {
  writeFileSync(join(root, 'sitemap.xml'), nextSitemap);
  console.log('updated sitemap.xml');
}

console.log(changed ? 'Done. Commit the changed files.' : 'Already up to date.');
