/* Deterministic research-report metadata ranking. */
(() => {
  'use strict';

  const DAY_MS = 24 * 60 * 60 * 1000;
  const YEAR_DAYS = 365;
  const PAGE_CAP = 10;
  const researchDocs = (window.DOCS || []).filter(doc => doc && doc.category === 'research');
  const tbody = document.getElementById('ranking-rows');
  const search = document.getElementById('tracker-search');
  const emptyResults = document.getElementById('empty-results');
  const today = new Date();
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[char]);
  }

  function dateValue(value) {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return null;
    const timestamp = Date.parse(`${value}T00:00:00Z`);
    return Number.isFinite(timestamp) ? timestamp : null;
  }

  function scoreReport(doc) {
    const timestamp = dateValue(doc.date);
    const parsedPages = Number(doc.pages);
    const pages = Number.isFinite(parsedPages) && parsedPages >= 0 ? parsedPages : null;
    const ageDays = timestamp === null ? null : Math.max(0, (todayUtc - timestamp) / DAY_MS);
    const recencyPoints = ageDays === null ? 0 : 5 * Math.max(0, 1 - ageDays / YEAR_DAYS);
    const lengthPoints = pages === null ? 0 : 5 * Math.min(pages, PAGE_CAP) / PAGE_CAP;
    const hasMetadata = timestamp !== null || pages !== null;

    return {
      doc,
      timestamp,
      pages,
      recencyPoints,
      lengthPoints,
      score: hasMetadata ? recencyPoints + lengthPoints : null
    };
  }

  // One row per ticker. If a ticker has multiple reports, use its newest one.
  const byTicker = new Map();
  for (const doc of researchDocs) {
    const ticker = String(doc.ticker || doc.company || doc.id || '').trim();
    if (!ticker) continue;
    const candidate = scoreReport(doc);
    const current = byTicker.get(ticker);
    if (!current || (candidate.timestamp ?? -Infinity) > (current.timestamp ?? -Infinity)) {
      byTicker.set(ticker, candidate);
    }
  }

  const companies = [...byTicker.values()];
  const ranked = () => [...companies].sort((a, b) => {
    if (a.score !== null && b.score !== null && a.score !== b.score) return b.score - a.score;
    if (a.score !== null && b.score === null) return -1;
    if (a.score === null && b.score !== null) return 1;
    return String(a.doc.company || '').localeCompare(String(b.doc.company || ''));
  });

  function displayDate(timestamp, original) {
    if (timestamp === null) return original ? escapeHtml(original) : '—';
    return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }).format(timestamp);
  }

  function render() {
    const query = search.value.trim().toLowerCase();
    const visible = ranked().filter(({ doc }) => `${doc.company || ''} ${doc.ticker || ''} ${doc.description || ''}`.toLowerCase().includes(query));

    tbody.innerHTML = visible.map((item, index) => {
      const { doc, timestamp, pages, score } = item;
      const href = String(doc.file || '#');
      const safeHref = escapeHtml(href);
      const scoreMarkup = score === null
        ? '<span class="unscored">Metadata unavailable</span>'
        : `<strong class="overall-score">${score.toFixed(2)}</strong><span class="score-bar"><i style="width:${Math.max(0, Math.min(100, score * 10))}%"></i></span>`;
      const reportLabel = doc.description || doc.title || 'View report';
      return `<tr>
        <td class="rank-cell">${score === null ? '—' : `#${index + 1}`}</td>
        <td class="company-cell"><strong>${escapeHtml(doc.company || 'Unknown company')}</strong><span>${escapeHtml(doc.ticker || '')}</span></td>
        <td>${displayDate(timestamp, doc.date)}</td>
        <td>${pages === null ? '—' : escapeHtml(pages)}</td>
        <td>${escapeHtml(reportLabel)}</td>
        <td class="total-cell">${scoreMarkup}</td>
        <td><a class="report-link" href="${safeHref}" target="_blank" rel="noopener">View report ↗</a></td>
      </tr>`;
    }).join('');

    emptyResults.hidden = visible.length > 0;
    document.getElementById('company-count').textContent = String(companies.length);
    document.getElementById('scored-count').textContent = String(researchDocs.length);
    document.getElementById('ranking-status').textContent = `Automatically ranked ${companies.length} companies from ${researchDocs.length} research reports.`;
  }

  document.getElementById('export-csv').addEventListener('click', () => {
    const rows = [['Rank', 'Company', 'Ticker', 'Report date', 'Pages', 'Description', 'Metadata score / 10', 'Report']];
    let position = 0;
    ranked().forEach(({ doc, pages, score }) => {
      rows.push([
        score === null ? '' : String(++position), doc.company || '', doc.ticker || '', doc.date || '',
        pages === null ? '' : String(pages), doc.description || '', score === null ? '' : score.toFixed(2), doc.file || ''
      ]);
    });
    const csv = rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\r\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' }));
    link.download = 'kycstock-research-metadata-ranking.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  });

  search.addEventListener('input', render);
  render();
})();
