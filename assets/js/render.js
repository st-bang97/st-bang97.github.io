/*
 * HTML templates shared by the browser (assets/js/site.js) and the prerender
 * script (tools/build.mjs), so both always produce identical markup.
 */
(function (root) {
  'use strict';

  var SELF = 'Seongtae Bang';
  var LINK_ORDER = ['pdf', 'doi', 'code', 'slides', 'video', 'project'];
  var LINK_LABELS = { pdf: 'PDF', doi: 'DOI', code: 'Code', slides: 'Slides', video: 'Talk', project: 'Project' };

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function byId(papers) {
    var map = {};
    papers.forEach(function (p) { map[p.id] = p; });
    return map;
  }

  // Older first; papers.js lists newest first.
  function chronological(papers) {
    return function (a, b) { return a.year - b.year || papers.indexOf(b) - papers.indexOf(a); };
  }

  function role(paper) {
    if (paper.authors[0] === SELF) return 'First author';
    if ((paper.equal || []).indexOf(SELF) >= 0) return 'Co-first author';
    return '';
  }

  function authors(paper) {
    var equal = paper.equal || [];
    return paper.authors.map(function (name) {
      var text = esc(name) + (equal.indexOf(name) >= 0 ? '<sup>*</sup>' : '');
      return name === SELF ? '<strong>' + text + '</strong>' : text;
    }).join(', ');
  }

  function badges(paper) {
    var r = role(paper);
    return '<div class="badges">' +
      '<span class="venue-badge">' + esc(paper.venue) + '</span>' +
      '<span class="badge-year">' + paper.year + (paper.status === 'to-appear' ? ', to appear' : '') + '</span>' +
      (r ? '<span class="role-badge">' + r + '</span>' : '') +
      '</div>';
  }

  function tags(paper) {
    return (paper.tags || []).length
      ? '<ul class="tags">' + paper.tags.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>'
      : '';
  }

  function links(paper) {
    var all = paper.links || {};
    return LINK_ORDER.filter(function (key) { return all[key]; }).map(function (key) {
      var external = /^https?:/.test(all[key]);
      return '<a href="' + esc(all[key]) + '"' + (external ? ' target="_blank" rel="noopener"' : '') + '>' + LINK_LABELS[key] + '</a>';
    }).join('');
  }

  function overviewButton(paper) {
    return '<button class="toggle" type="button" aria-haspopup="dialog" data-overview="' + esc(paper.id) + '">Overview</button>';
  }

  // Bold the numbers that carry a result (4×, 90.6%, 46 Gbps).
  function emphasize(text) {
    return esc(text).replace(/(\d+(?:\.\d+)?(?:×|%| Gbps))/g, '<strong>$1</strong>');
  }

  function overviewText(paper) {
    var d = paper.details;
    return '<dl class="overview-text">' +
      '<div><dt>Prior work</dt><dd>' + esc(d.prior) + '</dd></div>' +
      '<div><dt>Key insight</dt><dd>' + esc(d.insight) + '</dd></div>' +
      '<div><dt>Approach</dt><dd>' + esc(d.approach) + '</dd></div>' +
      '<div><dt>Result</dt><dd>' + esc(d.result) + '</dd></div>' +
      '</dl>';
  }

  function times(value) {
    return (Number.isInteger(value) ? value.toFixed(1) : String(value)) + '×';
  }

  /* Speedup bars against a 1x baseline, the way results appear in the papers. */
  function chart(paper) {
    var r = paper.result;
    if (!r || !(r.bars || []).length) return '';
    var top = Math.max(5, Math.ceil(Math.max.apply(null, r.bars.map(function (b) { return b.value; }))));
    var rows = r.bars.map(function (b) {
      return '<div class="bar-row"><span class="bar-label">' + esc(b.label) + '</span>' +
        '<span class="bar-track"><span class="bar-fill" style="--w:' + (b.value / top * 100).toFixed(1) + '%"></span></span>' +
        '<span class="bar-value" data-value="' + b.value + '">' + times(b.value) + '</span></div>';
    }).join('');
    return '<figure class="chart" style="--one:' + (100 / top).toFixed(1) + '%">' +
      '<figcaption>' + esc(r.metric) + '</figcaption>' + rows +
      '<div class="bar-row bar-axis" aria-hidden="true"><span></span><span class="bar-track"><span class="bar-one">1× baseline</span></span><span></span></div>' +
      '</figure>';
  }

  /* Home: result cards for the headline papers. */
  function highlightCard(paper) {
    return '\n<article class="result t-' + esc(paper.thread) + '">' + badges(paper) +
      '<h3><a href="publications.html#' + esc(paper.id) + '">' + esc(paper.shortTitle) + '</a></h3>' +
      '<p class="result-teaser">' + esc(paper.teaser) + '</p>' +
      chart(paper) +
      '</article>';
  }

  /* Home: figure card for a selected paper. */
  function featuredCard(paper) {
    return '\n<article class="card t-' + esc(paper.thread) + '" id="card-' + esc(paper.id) + '">' +
      '<button class="card-figure" type="button" aria-haspopup="dialog" aria-label="' + esc(paper.shortTitle) + ' overview" data-overview="' + esc(paper.id) + '">' +
      '<img src="' + esc(paper.mechanism || paper.figure) + '" alt="' + esc(paper.mechanism ? paper.mechanismAlt : paper.figureAlt) + '" width="760" height="420" loading="lazy"></button>' +
      '<div class="card-body">' + badges(paper) +
      '<h3 class="card-title">' + esc(paper.shortTitle) + '</h3>' +
      '<p class="card-teaser">' + esc(paper.teaser) + '</p>' +
      '<p class="key-result">' + esc(paper.keyResult) + '</p>' +
      tags(paper) +
      '<div class="actions">' + overviewButton(paper) + links(paper) + '</div>' +
      '</div></article>';
  }

  /* Publications page: one entry. */
  function publicationEntry(paper) {
    return '\n<article class="pub t-' + esc(paper.thread) + '" id="' + esc(paper.id) + '">' +
      badges(paper) +
      '<h3 class="pub-title"><button type="button" aria-haspopup="dialog" data-overview="' + esc(paper.id) + '">' + esc(paper.title) + '</button></h3>' +
      '<p class="pub-authors">' + authors(paper) + '</p>' +
      '<p class="pub-venue">' + esc(paper.citation) + '</p>' +
      '<p class="pub-summary">' + esc(paper.summary) + '</p>' +
      '<p class="key-result">' + esc(paper.keyResult) + '</p>' +
      tags(paper) +
      '<div class="actions">' + overviewButton(paper) + links(paper) + '</div>' +
      '<div class="overview pub-overview print-only">' +
      '<a class="pub-figure" href="' + esc(paper.figure) + '" target="_blank" rel="noopener">' +
      '<img src="' + esc(paper.figure) + '" alt="' + esc(paper.figureAlt) + '" width="760" height="420" loading="lazy"></a>' +
      (paper.mechanism
        ? '<a class="pub-figure" href="' + esc(paper.mechanism) + '" target="_blank" rel="noopener">' +
          '<img src="' + esc(paper.mechanism) + '" alt="' + esc(paper.mechanismAlt) + '" width="760" height="420" loading="lazy"></a>'
        : '') +
      overviewText(paper) +
      '</div></article>';
  }

  function step(label, text, kind) {
    return '<li class="pd-step' + (kind ? ' is-' + kind : '') + '">' +
      '<span class="pd-step-label">' + label + '</span><p>' + emphasize(text) + '</p></li>';
  }

  function figureBlock(src, alt, caption) {
    return '<figure class="pd-fig"><figcaption class="pd-figcap">' + caption + '</figcaption>' +
      '<a class="pd-figure" href="' + esc(src) + '" target="_blank" rel="noopener">' +
      '<img src="' + esc(src) + '" alt="' + esc(alt) + '" width="760" height="420">' +
      '<span class="pd-zoom">Open full-size figure</span></a></figure>';
  }

  /* Paper overview window (built in the browser only). */
  function overview(paper, withEntryLink) {
    var d = paper.details;
    var entry = withEntryLink
      ? '<a href="publications.html#' + esc(paper.id) + '">Full entry</a>'
      : '';
    return '<header class="pd-head">' + badges(paper) +
      '<h2 class="pd-title" id="pd-title">' + esc(paper.shortTitle) + '</h2>' +
      '<p class="pd-lead">' + esc(paper.teaser) + '</p>' +
      '<p class="pd-fulltitle">' + esc(paper.title) + '</p>' +
      '<p class="pd-authors">' + authors(paper) + '</p></header>' +
      figureBlock(paper.figure, paper.figureAlt, 'Key idea') +
      '<ol class="pd-flow">' +
      step('Prior work', d.prior, 'prior') + step('Key insight', d.insight, 'key') +
      '</ol>' +
      (paper.mechanism ? figureBlock(paper.mechanism, paper.mechanismAlt, 'How it works') : '') +
      '<ol class="pd-flow pd-flow-next">' +
      step('Approach', d.approach) + step('Result', d.result, 'result') +
      '</ol>' +
      '<div class="pd-bottom">' +
      (paper.result ? chart(paper) : '<p class="key-result pd-key">' + esc(paper.keyResult) + '</p>') +
      '<div class="pd-meta">' + tags(paper) + '<div class="actions">' + links(paper) + entry + '</div></div>' +
      '</div>';
  }

  function publicationList(papers) {
    var years = [];
    papers.forEach(function (p) { if (years.indexOf(p.year) < 0) years.push(p.year); });
    years.sort(function (a, b) { return b - a; });
    var html = years.map(function (year) {
      return '\n<section class="pub-year" aria-labelledby="year-' + year + '">' +
        '<h2 class="pub-year-label" id="year-' + year + '">' + year + '</h2>' +
        '<div class="pub-year-list">' +
        papers.filter(function (p) { return p.year === year; }).map(publicationEntry).join('') +
        '\n</div></section>';
    }).join('');
    var hasEqual = papers.some(function (p) { return (p.equal || []).length > 0; });
    return html + (hasEqual ? '\n<p class="footnote"><sup>*</sup> Equal contribution.</p>' : '') + '\n';
  }

  /* Home: the system stack, software on top, with each paper on the layer it changes. */
  function stackDiagram(papers, research) {
    var map = byId(papers);
    var layers = (research.layers || []).map(function (layer, i) {
      var pills = (layer.papers || []).map(function (id) { return map[id]; }).filter(Boolean)
        .sort(chronological(papers))
        .map(function (p) {
          return '<a class="pill t-' + esc(p.thread) + '" href="publications.html#' + esc(p.id) + '">' +
            esc(p.shortTitle) + '<small>' + esc(p.venueShort) + '</small></a>';
        })
        .concat((layer.ongoing || []).map(function (o) {
          return '<span class="pill pill-ongoing t-' + esc(o.thread) + '">' + esc(o.name) + '<small>ongoing</small></span>';
        }));
      return '\n<li class="layer" style="--depth:' + i + '">' +
        '<strong class="layer-name">' + esc(layer.name) + '</strong>' +
        '<span class="layer-tools">' + esc(layer.tools) + '</span>' +
        '<div class="layer-papers">' + pills.join('') + '</div></li>';
    }).join('');
    return '<div class="stack">' +
      '<p class="stack-end">Software</p>' +
      '<ol class="layers" aria-label="System stack, from software to hardware">' + layers + '\n</ol>' +
      '<p class="stack-end">Hardware</p></div>\n';
  }

  function hash(text) {
    var h = 5381;
    for (var i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) >>> 0;
    return h.toString(36);
  }

  var regions = {
    'highlights': function (data) {
      return data.papers.filter(function (p) { return p.highlight && p.result; }).map(highlightCard).join('') + '\n';
    },
    'featured-publications': function (data) {
      return data.papers.filter(function (p) { return p.selected; }).map(featuredCard).join('') + '\n';
    },
    'research-stack': function (data) { return stackDiagram(data.papers, data.research); },
    'publication-list': function (data) { return publicationList(data.papers); }
  };

  root.SiteRender = { regions: regions, hash: hash, esc: esc, overview: overview };
})(typeof window !== 'undefined' ? window : globalThis);
