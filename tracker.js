/* Third Eye View stock scoring and ranking. */
(() => {
  'use strict';

  const STORAGE_KEY = 'kycstock-third-eye-view-scores-v1';
  const FACTORS = ['financials', 'demand', 'marketShare', 'balanceSheet'];
  const FACTOR_LABELS = ['Financials', 'Product demand', 'Market share', 'Net debt & working capital'];
  const docs = (window.DOCS || []).filter(doc => doc.category === 'research');
  const companies = [...new Map(docs.map(doc => [doc.ticker, doc])).values()]
    .sort((a, b) => a.company.localeCompare(b.company));
  const tbody = document.getElementById('ranking-rows');
  const search = document.getElementById('tracker-search');
  const emptyResults = document.getElementById('empty-results');
  let scores = loadScores();
  let saveTimer;

  function loadScores() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
    } catch (error) {
      return {};
    }
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  }

  function scoreFor(ticker) {
    const item = scores[ticker] || {};
    return FACTORS.map(key => {
      const value = item[key];
      return value === '' || value === null || value === undefined || !Number.isFinite(Number(value)) || Number(value) < 0 || Number(value) > 10
        ? null : Number(value);
    });
  }

  function overallFor(ticker) {
    const values = scoreFor(ticker);
    return values.every(value => value !== null)
      ? values.reduce((sum, value) => sum + value, 0) / FACTORS.length : null;
  }

  function render() {
    const query = search.value.trim().toLowerCase();
    const ranked = companies.map(doc => ({ doc, total: overallFor(doc.ticker) }));
    ranked.sort((a, b) => {
      if (a.total !== null && b.total !== null && a.total !== b.total) return b.total - a.total;
      if (a.total !== null && b.total === null) return -1;
      if (a.total === null && b.total !== null) return 1;
      return a.doc.company.localeCompare(b.doc.company);
    });

    const visible = ranked.filter(({ doc }) => `${doc.company} ${doc.ticker}`.toLowerCase().includes(query));
    let position = 0;
    tbody.innerHTML = visible.map(({ doc, total }) => {
      const values = scoreFor(doc.ticker);
      const rank = total === null ? '—' : `#${++position}`;
      const inputs = FACTORS.map((factor, index) => `
        <td><label class="score-label"><span class="sr-only">${FACTOR_LABELS[index]} score for ${escapeHtml(doc.company)}</span>
          <input class="score-input" type="number" min="0" max="10" step="0.5" inputmode="decimal" placeholder="—" value="${values[index] === null ? '' : values[index]}" data-ticker="${escapeHtml(doc.ticker)}" data-factor="${factor}" aria-label="${FACTOR_LABELS[index]} score, 0 to 10"></label></td>`).join('');
      const totalMarkup = total === null
        ? '<span class="unscored">Add all 4 scores</span>'
        : `<strong class="overall-score">${total.toFixed(2)}</strong><span class="score-bar"><i style="width:${total * 10}%"></i></span>`;
      return `<tr>
        <td class="rank-cell">${rank}</td>
        <td class="company-cell"><strong>${escapeHtml(doc.company)}</strong><span>${escapeHtml(doc.ticker)}</span></td>
        ${inputs}
        <td class="total-cell">${totalMarkup}</td>
        <td><a class="report-link" href="${escapeHtml(doc.file)}" target="_blank" rel="noopener">View report ↗</a></td>
      </tr>`;
    }).join('');

    emptyResults.hidden = visible.length > 0;
    document.getElementById('company-count').textContent = String(companies.length);
    document.getElementById('scored-count').textContent = String(ranked.filter(item => item.total !== null).length);
    tbody.querySelectorAll('.score-input').forEach(input => input.addEventListener('input', onScoreInput));
  }

  function onScoreInput(event) {
    const input = event.currentTarget;
    const value = input.value.trim();
    if (value !== '' && (!Number.isFinite(Number(value)) || Number(value) < 0 || Number(value) > 10)) {
      input.setCustomValidity('Enter a score from 0 to 10.');
      input.reportValidity();
      return;
    }
    input.setCustomValidity('');
    const ticker = input.dataset.ticker;
    scores[ticker] = scores[ticker] || {};
    scores[ticker][input.dataset.factor] = value === '' ? null : Number(value);
    render();
    const next = [...tbody.querySelectorAll('.score-input')].find(field => field.dataset.ticker === ticker && field.dataset.factor === input.dataset.factor);
    if (next) { next.focus(); next.setSelectionRange?.(next.value.length, next.value.length); }
    clearTimeout(saveTimer);
    document.getElementById('saved-indicator').textContent = 'Saving…';
    saveTimer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
        document.getElementById('saved-indicator').textContent = 'Saved in this browser.';
      } catch (error) {
        document.getElementById('saved-indicator').textContent = 'Could not save locally; check browser storage settings.';
      }
    }, 250);
  }

  document.getElementById('reset-scores').addEventListener('click', () => {
    if (!window.confirm('Clear every score saved for this tracker in this browser?')) return;
    scores = {};
    localStorage.removeItem(STORAGE_KEY);
    document.getElementById('saved-indicator').textContent = 'Scores cleared.';
    render();
  });

  document.getElementById('export-csv').addEventListener('click', () => {
    const ranked = companies.map(doc => ({ doc, total: overallFor(doc.ticker) }));
    ranked.sort((a, b) => a.total === null ? (b.total === null ? a.doc.company.localeCompare(b.doc.company) : 1) : b.total === null ? -1 : b.total - a.total);
    let rank = 0;
    const rows = [['Rank', 'Company', 'Ticker', ...FACTOR_LABELS, 'Overall score / 10', 'Report']];
    ranked.forEach(({ doc, total }) => {
      const values = scoreFor(doc.ticker);
      rows.push([total === null ? '' : String(++rank), doc.company, doc.ticker, ...values.map(value => value === null ? '' : String(value)), total === null ? '' : total.toFixed(2), doc.file]);
    });
    const csv = rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\r\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' }));
    link.download = 'kycstock-third-eye-view-rankings.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  });

  search.addEventListener('input', render);
  render();
})();
