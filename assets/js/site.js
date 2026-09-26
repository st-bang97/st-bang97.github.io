/* Page behavior: keep data-driven sections current, the paper overview window,
   scroll motion, and chart animation. */
(function () {
  'use strict';

  var R = window.SiteRender;
  var papers = window.PUBLICATIONS || [];
  var data = { papers: papers, research: window.RESEARCH || { layers: [] } };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var onPublicationsPage = !!document.querySelector('[data-region="publication-list"]');

  // The HTML ships prerendered by tools/build.mjs. Re-render only when the data
  // files changed after the last build, so visitors never see stale entries.
  if (R) {
    document.querySelectorAll('[data-region]').forEach(function (el) {
      var make = R.regions[el.getAttribute('data-region')];
      if (!make) return;
      var html = make(data);
      var sig = R.hash(html);
      if (el.getAttribute('data-sig') !== sig) {
        el.innerHTML = html;
        el.setAttribute('data-sig', sig);
      }
    });
  }

  /* Count-up for the numbers next to the speedup bars. */
  function countUp(root, delay) {
    if (reduceMotion) return;
    root.querySelectorAll('.bar-value[data-value]').forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-value'));
      var decimals = ((el.textContent.split('.')[1] || '').match(/\d/g) || []).length;
      var show = function (v) { el.textContent = v.toFixed(decimals) + '×'; };
      show(0);
      setTimeout(function () {
        var start = null;
        requestAnimationFrame(function tick(now) {
          if (start === null) start = now;
          var p = Math.min(1, (now - start) / 900);
          show(target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(tick);
        });
      }, delay);
    });
  }

  /* Paper overview window ------------------------------------------------ */

  var dialog = null;
  var current = -1;
  var returnFocus = null;

  function buildDialog() {
    dialog = document.createElement('dialog');
    dialog.className = 'pd';
    dialog.setAttribute('aria-labelledby', 'pd-title');
    dialog.innerHTML =
      '<div class="pd-shell">' +
      '<button class="pd-close" type="button" aria-label="Close overview"></button>' +
      '<div class="pd-scroll"><div class="pd-content"></div></div>' +
      '<nav class="pd-nav" aria-label="Other papers">' +
      '<button class="pd-prev" type="button"><span aria-hidden="true">←</span><span class="pd-name"></span></button>' +
      '<span class="pd-count"></span>' +
      '<button class="pd-next" type="button"><span class="pd-name"></span><span aria-hidden="true">→</span></button>' +
      '</nav></div>';
    document.body.appendChild(dialog);

    dialog.querySelector('.pd-close').addEventListener('click', closeDialog);
    dialog.querySelector('.pd-prev').addEventListener('click', function () { step(-1); });
    dialog.querySelector('.pd-next').addEventListener('click', function () { step(1); });
    dialog.addEventListener('cancel', function (event) { event.preventDefault(); closeDialog(); });
    dialog.addEventListener('click', function (event) { if (event.target === dialog) closeDialog(); });
    dialog.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') { event.preventDefault(); step(-1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); step(1); }
    });
  }

  function fill(index, direction) {
    var paper = papers[index];
    var shell = dialog.querySelector('.pd-shell');
    var content = dialog.querySelector('.pd-content');
    current = index;
    shell.className = 'pd-shell t-' + paper.thread;
    content.innerHTML = R.overview(paper, !onPublicationsPage);
    dialog.querySelector('.pd-scroll').scrollTop = 0;

    var prev = papers[(index - 1 + papers.length) % papers.length];
    var next = papers[(index + 1) % papers.length];
    dialog.querySelector('.pd-prev .pd-name').textContent = prev.shortTitle;
    dialog.querySelector('.pd-next .pd-name').textContent = next.shortTitle;
    dialog.querySelector('.pd-prev').setAttribute('aria-label', 'Previous paper: ' + prev.shortTitle);
    dialog.querySelector('.pd-next').setAttribute('aria-label', 'Next paper: ' + next.shortTitle);
    dialog.querySelector('.pd-count').textContent = (index + 1) + ' / ' + papers.length;

    if (direction && !reduceMotion && content.animate) {
      content.animate([
        { opacity: 0, transform: 'translateX(' + (direction * 18) + 'px)' },
        { opacity: 1, transform: 'none' }
      ], { duration: 260, easing: 'cubic-bezier(.2,.7,.2,1)' });
    }
    countUp(content, 300);
  }

  function openDialog(id, trigger) {
    var index = papers.findIndex(function (p) { return p.id === id; });
    if (index < 0 || !R || typeof HTMLDialogElement !== 'function') return false;
    if (!dialog) buildDialog();
    returnFocus = trigger || document.activeElement;
    fill(index, 0);
    if (!dialog.open) {
      dialog.classList.remove('is-closing');
      dialog.showModal();
      document.documentElement.classList.add('pd-lock');
    }
    return true;
  }

  function closeDialog() {
    if (!dialog || !dialog.open || dialog.classList.contains('is-closing')) return;
    var finish = function () {
      dialog.classList.remove('is-closing');
      dialog.close();
      document.documentElement.classList.remove('pd-lock');
      if (returnFocus && document.contains(returnFocus)) returnFocus.focus({ preventScroll: true });
    };
    if (reduceMotion) { finish(); return; }
    dialog.classList.add('is-closing');
    setTimeout(finish, 170);
  }

  function step(direction) {
    fill((current + direction + papers.length) % papers.length, direction);
  }

  document.addEventListener('click', function (event) {
    var trigger = event.target.closest('[data-overview]');
    if (trigger) {
      openDialog(trigger.getAttribute('data-overview'), trigger);
      return;
    }
    // On the home page, links to a paper entry open its overview in place.
    // Modified clicks still open the publication list.
    var link = event.target.closest('a[href^="publications.html#"]');
    if (!link || onPublicationsPage || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (dialog && dialog.contains(link)) return;
    if (openDialog(link.getAttribute('href').split('#')[1], link)) event.preventDefault();
  });

  // publications.html#reclaimx marks that entry and opens its overview.
  function openFromHash() {
    if (!onPublicationsPage) return;
    var id = decodeURIComponent(location.hash.slice(1));
    var entry = id && document.getElementById(id);
    if (!entry || !entry.classList.contains('pub')) return;
    document.querySelectorAll('.pub.is-target').forEach(function (el) { el.classList.remove('is-target'); });
    entry.classList.add('is-target');
    openDialog(id, entry.querySelector('.toggle'));
  }
  openFromHash();
  window.addEventListener('hashchange', openFromHash);

  /* Header state ------------------------------------------------------------ */

  var header = document.querySelector('.site-header');
  function updateHeader() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  /* Scroll motion -------------------------------------------------------------- */

  document.addEventListener('click', function (event) {
    var toggle = event.target.closest('.cite-toggle');
    if (toggle) {
      var panel = document.getElementById(toggle.getAttribute('aria-controls'));
      if (!panel) return;
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', open ? 'false' : 'true');
      panel.hidden = open;
      return;
    }
    var copy = event.target.closest('.cite-copy');
    if (!copy) return;
    var pre = copy.parentElement.querySelector('pre');
    var label = copy.textContent;
    function selectText() {
      var range = document.createRange();
      range.selectNodeContents(pre);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      copy.textContent = 'Selected: press Ctrl+C';
    }
    function copied() {
      copy.textContent = 'Copied';
      setTimeout(function () { copy.textContent = label; }, 1600);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(pre.textContent).then(copied, selectText);
    } else {
      selectText();
    }
  });

  if (reduceMotion || !('IntersectionObserver' in window)) return;

  var fold = window.innerHeight * 0.92;
  var groups = new Map();
  document.querySelectorAll(
    '.section-head, .section-title, .research-thesis, .card, .topic-item, .stack-title, .stack, .layer, ' +
    '.side-section, .tech, .contact-line, .pub, .pub-year-label'
  ).forEach(function (el) {
    if (el.getBoundingClientRect().top < fold) return;  // already on screen
    var n = groups.get(el.parentElement) || 0;
    groups.set(el.parentElement, n + 1);
    el.style.setProperty('--delay', Math.min(n, 4) * 60 + 'ms');
    el.classList.add('reveal');
  });
  document.documentElement.classList.add('motion-ready');

  var revealer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      revealer.unobserve(entry.target);
    });
  }, { threshold: 0, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { revealer.observe(el); });

  // At the very bottom of the page nothing can scroll further into view, so show what is left.
  window.addEventListener('scroll', function () {
    if (window.innerHeight + window.scrollY < document.documentElement.scrollHeight - 4) return;
    document.querySelectorAll('.reveal:not(.is-in)').forEach(function (el) { el.classList.add('is-in'); });
  }, { passive: true });

  // Speedup bars grow, and their numbers count up, when the chart comes into view.
  document.querySelectorAll('.card .chart').forEach(function (chart) {
    if (chart.getBoundingClientRect().top < window.innerHeight) {
      countUp(chart, 750);
      return;
    }
    chart.classList.add('chart-wait');
    var watcher = new IntersectionObserver(function (entries) {
      if (!entries.some(function (e) { return e.isIntersecting; })) return;
      chart.classList.remove('chart-wait');
      chart.classList.add('chart-go');
      countUp(chart, 150);
      watcher.disconnect();
    }, { threshold: 0.35 });
    watcher.observe(chart);
  });
})();
