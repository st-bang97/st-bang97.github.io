(function () {
  const normalizeAuthor = (name) => name === 'Seongtae Bang'
    ? '<strong>Seongtae Bang</strong>'
    : name;

  const publicationCard = (paper) => {
    const links = Object.entries(paper.links || {}).map(([kind, url]) => {
      const labels = { doi: 'DOI', project: 'Project', paper: 'Paper', code: 'Code', slides: 'Slides' };
      return `<a class="paper-link" href="${url}" target="_blank" rel="noopener">${labels[kind] || kind}</a>`;
    }).join('');

    const note = paper.note ? `<span class="author-note">${paper.note}</span>` : '';
    const tags = (paper.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('');

    return `
      <article class="publication-card" id="${paper.id}">
        <div class="pub-year">${paper.year}</div>
        <div class="pub-body">
          <div class="pub-venue">${paper.venueShort}</div>
          <h3>${paper.title}</h3>
          <p class="authors">${paper.authors.map(normalizeAuthor).join(', ')} ${note}</p>
          <p class="pub-summary">${paper.summary}</p>
          <div class="pub-tags">${tags}</div>
          <div class="pub-links">${links}</div>
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

  renderPublications('#selected-publications', true);
  renderPublications('#all-publications', false);

  const navButton = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navButton && navLinks) {
    navButton.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navButton.setAttribute('aria-expanded', String(open));
    });
  }

  document.querySelectorAll('[data-current-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
})();
