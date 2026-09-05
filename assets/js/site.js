(function () {
  const normalizeAuthor = (name) => name === 'Seongtae Bang'
    ? '<strong>Seongtae Bang</strong>'
    : name;

  const escapeId = (value) => String(value).replace(/[^a-zA-Z0-9_-]/g, '-');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const linkLabels = {
    doi: 'DOI',
    project: 'Project',
    paper: 'Paper',
    code: 'Code',
    codeExamples: 'Code & examples',
    slides: 'Slides'
  };

  const renderLinks = (links) => Object.entries(links || {}).map(([kind, url]) =>
    `<a class="paper-link" href="${url}" target="_blank" rel="noopener">${linkLabels[kind] || kind}</a>`
  ).join('');

  const venueMarkup = (paper, includeYear = false) => {
    const badge = paper.venueBadge || paper.venueShort;
    return `<span class="venue-badge" title="${paper.venue}">${badge}</span>${includeYear ? `<span class="venue-year">${paper.year}</span>` : ''}`;
  };

  const renderKeywords = (paper, compact = false) => {
    const tags = paper.tags || [];
    if (!tags.length) return '';
    const className = compact ? 'home-keywords' : 'pub-tags';
    const itemClass = compact ? 'home-keyword' : 'tag';
    return `<div class="${className}">${tags.map(tag => `<span class="${itemClass}">${tag}</span>`).join('')}</div>`;
  };

  const detailMarkup = (paper, compact = false) => `
    <div class="${compact ? 'home-detail-grid' : 'paper-detail-grid'}">
      <a class="paper-figure" href="${paper.figure}" target="_blank" rel="noopener" aria-label="Open ${paper.title} overview figure">
        <img src="${paper.figure}" alt="${paper.figureAlt || ''}" loading="lazy">
      </a>
      <div class="paper-explanation">
        <div class="paper-status">${paper.status || paper.venue}</div>
        <div class="detail-block"><h4>Problem</h4><p>${paper.details.problem}</p></div>
        <div class="detail-block"><h4>Key idea</h4><p>${paper.details.idea}</p></div>
        <div class="detail-block"><h4>Result</h4><p>${paper.details.result}</p></div>
      </div>
    </div>`;

  const publicationCard = (paper) => {
    const note = paper.note ? `<span class="author-note">${paper.note}</span>` : '';
    const detailId = `details-${escapeId(paper.id)}`;
    const detailPanel = paper.details
      ? `<div class="paper-details" id="${detailId}" hidden>${detailMarkup(paper)}</div>`
      : '';

    return `
      <article class="publication-card" id="${paper.id}" ${paper.details ? `data-publication-detail="${detailId}"` : ''}>
        <div class="pub-year">${paper.year}</div>
        <div class="pub-body">
          <div class="pub-venue">${venueMarkup(paper)}</div>
          <h3>${paper.details
            ? `<button class="publication-title-button" type="button" aria-expanded="false" aria-controls="${detailId}" data-publication-overview="${detailId}">${paper.title}</button>`
            : paper.title}</h3>
          <p class="authors">${paper.authors.map(normalizeAuthor).join(', ')} ${note}</p>
          <p class="pub-summary">${paper.summary}</p>
          ${renderKeywords(paper)}
          <div class="pub-actions">
            ${paper.details ? `<button class="paper-details-toggle" type="button" aria-expanded="false" aria-controls="${detailId}" data-publication-overview="${detailId}">Overview</button>` : ''}
            <div class="pub-links">${renderLinks(paper.links)}</div>
          </div>
          ${detailPanel}
        </div>
      </article>`;
  };

  const homePublicationCard = (paper) => {
    const note = paper.note ? `<span class="home-author-note">${paper.note}</span>` : '';
    return `
      <article class="home-publication-card" data-home-card="${paper.id}">
        <a class="home-pub-thumb" href="#home-paper-detail" data-home-overview="${paper.id}" aria-expanded="false" aria-controls="home-paper-detail" aria-label="Open ${paper.title} overview">
          <img src="${paper.figure}" alt="" loading="lazy">
        </a>
        <div class="home-pub-content">
          <div class="home-pub-venue">${venueMarkup(paper, true)}</div>
          <h3><a href="#home-paper-detail" data-home-overview="${paper.id}" aria-expanded="false" aria-controls="home-paper-detail">${paper.homeTitle || paper.title}</a></h3>
          <p>${paper.homeSummary || paper.summary}</p>
          ${renderKeywords(paper, true)}
          ${note}
          <div class="home-pub-actions">
            <button type="button" class="home-overview-button" data-home-overview="${paper.id}" aria-expanded="false" aria-controls="home-paper-detail">Overview</button>
            ${renderLinks(paper.links)}
          </div>
        </div>
      </article>`;
  };

  const renderPublications = (selector, selectedOnly) => {
    const target = document.querySelector(selector);
    if (!target || !window.PUBLICATIONS) return;
    const papers = window.PUBLICATIONS
      .filter(p => selectedOnly ? p.selected : true)
      .sort((a, b) => b.year - a.year || Number(b.selected) - Number(a.selected));
    target.innerHTML = papers.map(publicationCard).join('');
  };

  const renderHomePublications = () => {
    const target = document.querySelector('#home-publications');
    if (!target || !window.PUBLICATIONS) return;
    const order = ['reclaimx', 'replayopt', 'ariadne', 'safe'];
    const papers = order.map(id => window.PUBLICATIONS.find(p => p.id === id)).filter(Boolean);
    target.innerHTML = papers.map(homePublicationCard).join('');
  };

  const animateOpen = (element) => {
    element.getAnimations().forEach(animation => animation.cancel());
    element.hidden = false;
    if (reducedMotion) return;
    element.animate([
      { opacity: 0, transform: 'translateY(-8px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], {
      duration: 280,
      easing: 'cubic-bezier(.2,.7,.2,1)'
    });
  };

  const animateClose = (element, onFinish) => {
    element.getAnimations().forEach(animation => animation.cancel());
    if (reducedMotion) {
      onFinish();
      return;
    }
    const animation = element.animate([
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: 0, transform: 'translateY(-6px)' }
    ], {
      duration: 180,
      easing: 'ease'
    });
    animation.addEventListener('finish', onFinish, { once: true });
  };

  const setPublicationTriggerState = (detailId, open) => {
    document.querySelectorAll(`[data-publication-overview="${detailId}"]`).forEach(trigger => {
      trigger.setAttribute('aria-expanded', String(open));
      if (trigger.classList.contains('paper-details-toggle')) {
        trigger.textContent = open ? 'Hide overview' : 'Overview';
      }
    });
    const panel = document.getElementById(detailId);
    const card = panel ? panel.closest('.publication-card') : null;
    if (card) card.classList.toggle('active', open);
  };

  const closePublicationPanel = (panel) => {
    if (!panel || panel.hidden) return;
    const detailId = panel.id;
    setPublicationTriggerState(detailId, false);
    animateClose(panel, () => { panel.hidden = true; });
  };

  const togglePublicationOverview = (detailId) => {
    const panel = document.getElementById(detailId);
    if (!panel) return;
    const isOpen = !panel.hidden;

    if (isOpen) {
      closePublicationPanel(panel);
      return;
    }

    document.querySelectorAll('.paper-details:not([hidden])').forEach(other => {
      if (other !== panel) closePublicationPanel(other);
    });

    setPublicationTriggerState(detailId, true);
    animateOpen(panel);
  };

  const resetHomeOverviewTriggers = () => {
    document.querySelectorAll('[data-home-overview]').forEach(trigger => {
      trigger.setAttribute('aria-expanded', 'false');
      if (trigger.classList.contains('home-overview-button')) {
        trigger.textContent = 'Overview';
      }
    });
    document.querySelectorAll('[data-home-card]').forEach(card => card.classList.remove('active'));
  };

  const getGridColumnCount = (grid) => {
    const template = window.getComputedStyle(grid).gridTemplateColumns;
    if (!template || template === 'none') return 1;
    return Math.max(1, template.trim().split(/\s+/).length);
  };

  const placeHomeDetailBelowSelectedRow = (paperId) => {
    const grid = document.querySelector('#home-publications');
    const detail = document.querySelector('#home-paper-detail');
    if (!grid || !detail) return;

    const cards = Array.from(grid.querySelectorAll('[data-home-card]'));
    const selected = cards.find(card => card.dataset.homeCard === paperId);
    if (!selected) return;

    const selectedIndex = cards.indexOf(selected);
    const columns = getGridColumnCount(grid);
    const rowEndIndex = Math.min(
      Math.floor(selectedIndex / columns) * columns + columns - 1,
      cards.length - 1
    );

    cards[rowEndIndex].after(detail);
  };

  const openHomeOverview = (paper, sourceTrigger) => {
    const detail = document.querySelector('#home-paper-detail');
    if (!detail) return;

    const isSameOpenPaper = !detail.hidden && detail.dataset.openPaper === paper.id;
    resetHomeOverviewTriggers();

    if (isSameOpenPaper) {
      animateClose(detail, () => {
        detail.hidden = true;
        detail.innerHTML = '';
        delete detail.dataset.openPaper;
      });
      return;
    }

    placeHomeDetailBelowSelectedRow(paper.id);

    document.querySelectorAll(`[data-home-overview="${paper.id}"]`).forEach(trigger => {
      trigger.setAttribute('aria-expanded', 'true');
      if (trigger.classList.contains('home-overview-button')) {
        trigger.textContent = 'Hide overview';
      }
    });

    const card = document.querySelector(`[data-home-card="${paper.id}"]`);
    if (card) card.classList.add('active');

    detail.dataset.openPaper = paper.id;
    detail.innerHTML = `<div class="home-detail-header"><div><div class="detail-venue-line">${venueMarkup(paper, true)}</div><h3>${paper.title}</h3>${renderKeywords(paper, true)}</div><a href="publications.html#${paper.id}">Full entry →</a></div>${detailMarkup(paper, true)}`;
    animateOpen(detail);

    if (!reducedMotion && sourceTrigger && window.innerWidth <= 820) {
      window.setTimeout(() => {
        detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 80);
    }
  };

  const setupMotion = () => {
    if (reducedMotion) return;

    document.body.classList.add('motion-ready');

    const heroItems = Array.from(document.querySelectorAll('.intro-copy > *, .profile-photo'));
    heroItems.forEach((element, index) => {
      element.classList.add('motion-item');
      element.style.setProperty('--motion-delay', `${index * 55}ms`);
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => heroItems.forEach(element => element.classList.add('is-visible')));
    });

    const revealItems = Array.from(document.querySelectorAll(
      '.section-title, .home-publication-card, .topic-item, .home-side-section, .contact-line, .narrative-block, .publication-card, .tech-brand-card'
    ));

    revealItems.forEach((element, index) => {
      element.classList.add('motion-item');
      element.style.setProperty('--motion-delay', `${(index % 4) * 45}ms`);
    });

    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        instance.unobserve(entry.target);
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -5% 0px'
    });

    revealItems.forEach(element => observer.observe(element));
  };

  renderHomePublications();
  renderPublications('#selected-publications', true);
  renderPublications('#all-publications', false);
  setupMotion();

  document.addEventListener('click', (event) => {
    const publicationTrigger = event.target.closest('[data-publication-overview]');
    if (publicationTrigger) {
      event.preventDefault();
      togglePublicationOverview(publicationTrigger.dataset.publicationOverview);
      return;
    }

    const publicationCard = event.target.closest('[data-publication-detail]');
    if (publicationCard && !event.target.closest('a, button, .paper-details')) {
      togglePublicationOverview(publicationCard.dataset.publicationDetail);
      return;
    }

    const homeTrigger = event.target.closest('[data-home-overview]');
    if (homeTrigger) {
      event.preventDefault();
      if (!window.PUBLICATIONS) return;
      const paper = window.PUBLICATIONS.find(p => p.id === homeTrigger.dataset.homeOverview);
      if (!paper || !paper.details) return;
      openHomeOverview(paper, homeTrigger);
    }
  });

  const navButton = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navButton && navLinks) {
    navButton.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navButton.setAttribute('aria-expanded', String(open));
    });
  }

  const header = document.querySelector('.site-header');
  const updateHeaderState = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });

  let resizeTimer;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      const detail = document.querySelector('#home-paper-detail');
      if (detail && !detail.hidden && detail.dataset.openPaper) {
        placeHomeDetailBelowSelectedRow(detail.dataset.openPaper);
      }
    }, 100);
  });

  document.querySelectorAll('[data-current-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
})();
