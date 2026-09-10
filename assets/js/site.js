(function () {
  'use strict';

  const publications = Array.isArray(window.PUBLICATIONS) ? window.PUBLICATIONS : [];
  const publicationById = new Map(publications.map(publication => [publication.id, publication]));
  const homeOverviewPanel = document.getElementById('home-paper-detail');
  let homeOverviewSource = null;

  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[character]));
  const safeId = value => String(value).replace(/[^a-zA-Z0-9_-]/g, '-');
  const linkLabels = {
    doi: 'DOI', project: 'Project', paper: 'Paper', code: 'Code',
    codeExamples: 'Code & examples', slides: 'Slides'
  };

  const renderLinks = links => Object.entries(links || {}).map(([kind, url]) =>
    `<a class="paper-link" href="${escapeHtml(url)}" target="_blank" rel="noopener">${escapeHtml(linkLabels[kind] || kind)} <span aria-hidden="true">↗</span></a>`
  ).join('');

  const renderVenue = (publication, includeYear = false) => `
    <span class="venue-badge" title="${escapeHtml(publication.venue)}">${escapeHtml(publication.venueBadge || publication.venueShort)}</span>
    ${includeYear ? `<span class="venue-year">${escapeHtml(publication.year)}</span>` : ''}`;

  const renderKeywords = (publication, compact = false) => {
    const keywords = publication.tags || [];
    if (!keywords.length) return '';
    return `<div class="${compact ? 'home-keywords' : 'pub-tags'}">${keywords.map(keyword =>
      `<span class="${compact ? 'home-keyword' : 'tag'}">${escapeHtml(keyword)}</span>`
    ).join('')}</div>`;
  };

  const renderDetail = (publication, compact = false) => {
    const figure = publication.figure ? `
      <a class="paper-figure" href="${escapeHtml(publication.figure)}" target="_blank" rel="noopener" aria-label="Open ${escapeHtml(publication.homeTitle || publication.title)} overview figure at full size">
        <img src="${escapeHtml(publication.figure)}" alt="${escapeHtml(publication.figureAlt || '')}" loading="lazy">
        <span class="paper-figure-caption">View full-size figure <span aria-hidden="true">↗</span></span>
      </a>` : '';
    return `<div class="${compact ? 'home-detail-grid' : 'paper-detail-grid'}">
      ${figure}
      <div class="paper-explanation">
        <p class="paper-status">${escapeHtml(publication.status || publication.venue)}</p>
        <div class="detail-block"><h4>Problem</h4><p>${escapeHtml(publication.details.problem)}</p></div>
        <div class="detail-block"><h4>Key idea</h4><p>${escapeHtml(publication.details.idea)}</p></div>
        <div class="detail-block"><h4>Result</h4><p>${escapeHtml(publication.details.result)}</p></div>
      </div>
    </div>`;
  };

  const renderOutcome = publication => publication.outcome ? `
    <div class="paper-outcome">
      <span class="outcome-number">${publication.outcome.prefix ? `<span class="outcome-prefix">${escapeHtml(publication.outcome.prefix)}</span>` : ''}${escapeHtml(publication.outcome.value)}</span>
      <span class="outcome-label">${escapeHtml(publication.outcome.label)}</span>
    </div>
    <p class="outcome-context">${escapeHtml(publication.outcome.context)}</p>` : '';

  const homePublicationCard = publication => {
    const publicationId = safeId(publication.id);
    return `<article class="home-publication-card" data-home-card="${publicationId}" data-paper-area="${escapeHtml(publication.researchArea || 'memory')}">
      <div class="paper-card-top"><div class="home-pub-venue">${renderVenue(publication, true)}</div>${publication.note ? `<span class="home-author-note">${escapeHtml(publication.note)}</span>` : ''}</div>
      <h3><button class="home-title-button" type="button" data-home-overview="${publicationId}" aria-controls="home-paper-detail" aria-expanded="false">${escapeHtml(publication.homeTitle || publication.title)}</button></h3>
      <p class="home-pub-summary">${escapeHtml(publication.homeSummary || publication.summary)}</p>
      ${renderOutcome(publication)}
      ${renderKeywords(publication, true)}
      <div class="home-pub-actions">
        <button class="home-overview-button" type="button" data-home-overview="${publicationId}" aria-controls="home-paper-detail" aria-expanded="false" aria-label="Open ${escapeHtml(publication.homeTitle || publication.title)} overview"><span>Overview</span><span data-overview-symbol aria-hidden="true">+</span></button>
        <div class="home-card-links">${renderLinks(publication.links)}</div>
      </div>
    </article>`;
  };

  const publicationCard = publication => {
    const publicationId = safeId(publication.id);
    const detailId = `details-${publicationId}`;
    const headingId = `title-${publicationId}`;
    const authors = publication.authors.map(author => author === 'Seongtae Bang'
      ? `<strong>${escapeHtml(author)}</strong>` : escapeHtml(author)).join(', ');
    return `<article class="publication-card" id="${publicationId}" data-paper-area="${escapeHtml(publication.researchArea || 'memory')}"${publication.details ? ` data-publication-detail="${detailId}"` : ''}>
      <div class="pub-year">${escapeHtml(publication.year)}</div>
      <div class="pub-body">
        <div class="pub-venue">${renderVenue(publication)}</div>
        <h3 id="${headingId}">${publication.details
          ? `<button class="publication-title-button" type="button" data-publication-overview="${detailId}" aria-controls="${detailId}" aria-expanded="false">${escapeHtml(publication.title)}</button>`
          : escapeHtml(publication.title)}</h3>
        <p class="authors">${authors}${publication.note ? ` <span class="author-note">${escapeHtml(publication.note)}</span>` : ''}</p>
        <p class="pub-summary">${escapeHtml(publication.summary)}</p>
        ${renderKeywords(publication)}
        <div class="pub-actions">
          ${publication.details ? `<button class="paper-details-toggle" type="button" data-publication-overview="${detailId}" aria-controls="${detailId}" aria-expanded="false"><span>Overview</span><span data-overview-symbol aria-hidden="true">+</span></button>` : ''}
          <div class="pub-links">${renderLinks(publication.links)}</div>
        </div>
        ${publication.details ? `<div class="paper-details" id="${detailId}" role="region" aria-labelledby="${headingId}" hidden>${renderDetail(publication)}</div>` : ''}
      </div>
    </article>`;
  };

  const renderPublications = (selector, selectedOnly) => {
    const container = document.querySelector(selector);
    if (!container) return;
    const orderedPublications = publications.filter(publication => !selectedOnly || publication.selected)
      .slice().sort((first, second) => second.year - first.year || Number(second.selected) - Number(first.selected));
    container.innerHTML = orderedPublications.length ? orderedPublications.map(publicationCard).join('')
      : '<p class="empty-notice">Publication entries could not be loaded. Please reload the page.</p>';
  };

  const renderHomePublications = () => {
    const container = document.getElementById('home-publications');
    if (!container) return;
    const selectedPublications = publications.filter(publication => publication.selected);
    container.innerHTML = selectedPublications.length ? selectedPublications.map(homePublicationCard).join('')
      : '<p class="empty-notice">Publication entries could not be loaded. Please reload the page.</p>';
  };

  const setExpandedState = (trigger, expanded) => {
    trigger.setAttribute('aria-expanded', String(expanded));
    const symbol = trigger.querySelector('[data-overview-symbol]');
    if (symbol) symbol.textContent = expanded ? '−' : '+';
    if (trigger.classList.contains('home-overview-button')) {
      const publication = publicationById.get(trigger.dataset.homeOverview);
      trigger.setAttribute('aria-label', `${expanded ? 'Close' : 'Open'} ${publication?.homeTitle || 'publication'} overview`);
    }
  };

  const setPublicationPanel = (panel, expanded) => {
    panel.hidden = !expanded;
    document.querySelectorAll('[data-publication-overview]').forEach(trigger => {
      if (trigger.dataset.publicationOverview === panel.id) setExpandedState(trigger, expanded);
    });
    panel.closest('.publication-card')?.classList.toggle('active', expanded);
  };

  const togglePublicationOverview = detailId => {
    const panel = document.getElementById(detailId);
    if (!panel) return;
    const shouldExpand = panel.hidden;
    document.querySelectorAll('.paper-details:not([hidden])').forEach(openPanel => setPublicationPanel(openPanel, false));
    setPublicationPanel(panel, shouldExpand);
  };

  const resetHomeOverview = () => {
    if (!homeOverviewPanel) return;
    homeOverviewPanel.hidden = true;
    homeOverviewPanel.innerHTML = '';
    delete homeOverviewPanel.dataset.openPaper;
    document.querySelectorAll('[data-home-overview]').forEach(trigger => setExpandedState(trigger, false));
    document.querySelectorAll('[data-home-card]').forEach(card => card.classList.remove('active'));
  };

  const placeHomeOverview = publicationId => {
    const grid = document.getElementById('home-publications');
    if (!grid || !homeOverviewPanel) return;
    const cards = Array.from(grid.querySelectorAll('[data-home-card]'));
    const selectedCard = cards.find(card => card.dataset.homeCard === publicationId);
    if (!selectedCard) return;
    // Actual row positions remain correct when font size or column count changes.
    const selectedRowTop = selectedCard.offsetTop;
    const cardsInRow = cards.filter(card => Math.abs(card.offsetTop - selectedRowTop) < 2);
    const rowEndCard = cardsInRow[cardsInRow.length - 1] || selectedCard;
    rowEndCard.after(homeOverviewPanel);
  };

  const openHomeOverview = (publication, sourceTrigger) => {
    if (!homeOverviewPanel || !publication.details) return;
    const isSamePublication = !homeOverviewPanel.hidden && homeOverviewPanel.dataset.openPaper === publication.id;
    resetHomeOverview();
    if (isSamePublication) return;
    homeOverviewSource = sourceTrigger;
    homeOverviewPanel.innerHTML = `
      <div class="home-detail-header">
        <div><div class="detail-venue-line">${renderVenue(publication, true)}</div><h3 id="home-detail-title">${escapeHtml(publication.title)}</h3></div>
        <button class="close-overview" type="button" data-close-home-overview>Close <span aria-hidden="true">×</span></button>
      </div>
      ${renderDetail(publication, true)}
      <div class="detail-footer"><div class="pub-links">${renderLinks(publication.links)}</div><a class="text-link" href="publications.html#${safeId(publication.id)}">Full publication entry <span aria-hidden="true">↗</span></a></div>`;
    placeHomeOverview(publication.id);
    homeOverviewPanel.dataset.openPaper = publication.id;
    homeOverviewPanel.hidden = false;
    document.querySelectorAll('[data-home-overview]').forEach(trigger => {
      if (trigger.dataset.homeOverview === publication.id) setExpandedState(trigger, true);
    });
    document.querySelector(`[data-home-card="${safeId(publication.id)}"]`)?.classList.add('active');
  };

  const closeHomeOverview = () => {
    resetHomeOverview();
    homeOverviewSource?.focus({ preventScroll: true });
  };

  const revealLinkedPublication = () => {
    let publicationId;
    try { publicationId = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
    if (!publicationById.has(publicationId)) return;
    const publication = document.getElementById(publicationId);
    const panel = document.getElementById(`details-${safeId(publicationId)}`);
    if (!publication || !panel) return;
    document.querySelectorAll('.paper-details:not([hidden])').forEach(openPanel => setPublicationPanel(openPanel, false));
    setPublicationPanel(panel, true);
    // Rendering the data-driven list must finish before a fragment can scroll to it.
    requestAnimationFrame(() => publication.scrollIntoView({ block: 'start', behavior: 'instant' }));
  };

  renderHomePublications();
  renderPublications('#selected-publications', true);
  renderPublications('#all-publications', false);
  revealLinkedPublication();
  window.addEventListener('hashchange', revealLinkedPublication);

  document.addEventListener('click', event => {
    const publicationTrigger = event.target.closest('[data-publication-overview]');
    if (publicationTrigger) {
      togglePublicationOverview(publicationTrigger.dataset.publicationOverview);
      return;
    }
    const homeTrigger = event.target.closest('[data-home-overview]');
    if (homeTrigger) {
      const publication = publicationById.get(homeTrigger.dataset.homeOverview);
      if (publication) openHomeOverview(publication, homeTrigger);
      return;
    }
    if (event.target.closest('[data-close-home-overview]')) {
      closeHomeOverview();
      return;
    }
    const publicationCard = event.target.closest('[data-publication-detail]');
    if (publicationCard && !event.target.closest('a, button, .paper-details') && !window.getSelection()?.toString()) {
      togglePublicationOverview(publicationCard.dataset.publicationDetail);
    }
  });

  const navButton = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const closeNavigation = () => {
    if (!navButton || !navLinks) return;
    navLinks.classList.remove('open');
    navButton.setAttribute('aria-expanded', 'false');
  };
  if (navButton && navLinks) {
    navButton.hidden = false;
    navLinks.dataset.collapsible = 'true';
    navButton.addEventListener('click', () => {
      const expanded = navButton.getAttribute('aria-expanded') !== 'true';
      navButton.setAttribute('aria-expanded', String(expanded));
      navLinks.classList.toggle('open', expanded);
    });
    navLinks.addEventListener('click', event => { if (event.target.closest('a')) closeNavigation(); });
    document.addEventListener('click', event => {
      if (!event.target.closest('.site-header') && navButton.getAttribute('aria-expanded') === 'true') closeNavigation();
    });
  }
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (navButton?.getAttribute('aria-expanded') === 'true') {
      closeNavigation();
      navButton.focus();
    } else if (event.target.closest('#home-paper-detail')) {
      closeHomeOverview();
    } else {
      const openPanel = event.target.closest('.paper-details');
      if (openPanel) {
        setPublicationPanel(openPanel, false);
        openPanel.closest('.publication-card')?.querySelector('.publication-title-button')?.focus();
      }
    }
  });

  let overviewResizeTimer;
  window.addEventListener('resize', () => {
    window.clearTimeout(overviewResizeTimer);
    overviewResizeTimer = window.setTimeout(() => {
      if (homeOverviewPanel && !homeOverviewPanel.hidden && homeOverviewPanel.dataset.openPaper) {
        // Remove the inserted full-width row before measuring the new card rows.
        const publicationId = homeOverviewPanel.dataset.openPaper;
        homeOverviewPanel.hidden = true;
        placeHomeOverview(publicationId);
        homeOverviewPanel.hidden = false;
      }
      if (window.matchMedia('(min-width: 35.001rem)').matches) closeNavigation();
    }, 100);
  }, { passive: true });

  document.querySelectorAll('[data-current-year]').forEach(element => { element.textContent = new Date().getFullYear(); });
  document.querySelectorAll('[data-technology-logo]').forEach(logo => {
    const hideUnavailableLogo = () => { logo.hidden = true; };
    logo.addEventListener('error', hideUnavailableLogo, { once: true });
    if (logo.complete && !logo.naturalWidth) hideUnavailableLogo();
  });
})();
