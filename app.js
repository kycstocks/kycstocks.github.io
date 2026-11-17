/* app.js — KYCStock home page logic */

// ── State ─────────────────────────────────────────────
let currentCat   = "all";
let currentQuery = "";
let currentSort  = "date-desc";

// ── Category config ───────────────────────────────────
const CAT_CONFIG = {
  "annual-report":          { label: "Annual Report",          icon: "📊", color: "#2563eb" },
  "research":               { label: "Third Eye View",         icon: "👁️", color: "#7c3aed" },
  "concall":                { label: "Con-Call Transcript",    icon: "🎙️", color: "#059669" },
  "sebi":                   { label: "SEBI / Regulatory",      icon: "⚖️", color: "#dc2626" },
  "mca":                    { label: "MCA Filing",             icon: "🗂️", color: "#0891b2" },
  "investor-presentation":  { label: "Investor Presentation",  icon: "📈", color: "#d97706" },
};

function getCatLabel(cat) { return CAT_CONFIG[cat]?.label || cat; }
function getCatIcon(cat)  { return CAT_CONFIG[cat]?.icon  || "📄"; }
function getCatColor(cat) { return CAT_CONFIG[cat]?.color || "#6b7280"; }

// ── Filter + Sort ─────────────────────────────────────
function getFiltered() {
  let list = [...DOCS];

  if (currentCat !== "all") {
    list = list.filter(d => d.category === currentCat);
  }

  if (currentQuery.trim()) {
    const q = currentQuery.trim().toLowerCase();
    list = list.filter(d =>
      d.title.toLowerCase().includes(q)      ||
      d.company.toLowerCase().includes(q)    ||
      d.ticker.toLowerCase().includes(q)     ||
      d.description.toLowerCase().includes(q)||
      (d.tags || []).some(t => t.toLowerCase().includes(q))
    );
  }

  list.sort((a, b) => {
    switch (currentSort) {
      case "date-asc":  return new Date(a.date) - new Date(b.date);
      case "date-desc": return new Date(b.date) - new Date(a.date);
      case "name-asc":  return a.company.localeCompare(b.company);
      case "name-desc": return b.company.localeCompare(a.company);
      default:          return 0;
    }
  });

  return list;
}

// ── Render document card ──────────────────────────────
function renderCard(doc) {
  const icon  = getCatIcon(doc.category);
  const color = getCatColor(doc.category);
  const label = getCatLabel(doc.category);
  const date  = new Date(doc.date).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" });

  return `
    <article class="doc-card" onclick="openDoc('${doc.id}')">
      <div class="doc-card-top">
        <div class="doc-cat-badge" style="background:${color}18;color:${color};border-color:${color}30">
          ${icon} ${label}
        </div>
        <div class="doc-year-badge">${doc.year || ""}</div>
      </div>
      <div class="doc-icon-wrap" style="background:${color}10">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z"/><path d="M14 2v6h6"/><path d="M8 13h8"/><path d="M8 17h5"/></svg>
      </div>
      <div class="doc-card-body">
        <div class="doc-company">${doc.ticker} · ${doc.company}</div>
        <div class="doc-title">${doc.title}</div>
        <div class="doc-desc">${doc.description}</div>
      </div>
      <div class="doc-card-footer">
        <div class="doc-meta">
          <span class="doc-date">${date}</span>
          ${doc.pages ? `<span class="doc-sep">·</span><span class="doc-pages">${doc.pages} pages</span>` : ""}
          ${doc.size  ? `<span class="doc-sep">·</span><span class="doc-size">${doc.size}</span>` : ""}
        </div>
        <div class="doc-actions">
          <button class="doc-btn doc-btn-view" onclick="event.stopPropagation();openDoc('${doc.id}')">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            View
          </button>
          <a class="doc-btn doc-btn-download" href="${doc.file}" download onclick="event.stopPropagation()">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download
          </a>
        </div>
      </div>
    </article>
  `;
}

// ── Render grid ───────────────────────────────────────
function renderGrid() {
  const list   = getFiltered();
  const grid   = document.getElementById("doc-grid");
  const empty  = document.getElementById("empty-state");
  const count  = document.getElementById("results-count");
  const qLabel = document.getElementById("results-query");

  if (!list.length) {
    grid.innerHTML = "";
    empty.hidden   = false;
    count.textContent = "0 documents";
  } else {
    grid.innerHTML = list.map(renderCard).join("");
    empty.hidden   = true;
    count.textContent = `${list.length} document${list.length !== 1 ? "s" : ""}`;
  }

  qLabel.textContent = currentQuery
    ? `for "${currentQuery}"`
    : currentCat !== "all" ? `in ${getCatLabel(currentCat)}` : "";
}

// ── Open document ─────────────────────────────────────
window.openDoc = function(id) {
  window.location = `viewer.html?id=${id}`;
};

// ── Reset filters ─────────────────────────────────────
window.resetFilters = function() {
  currentCat = "all"; currentQuery = "";
  document.querySelectorAll(".filter-tab").forEach(t => t.classList.toggle("active", t.dataset.cat === "all"));
  document.getElementById("search-input").value = "";
  document.getElementById("search-clear").hidden = true;
  renderGrid();
};

// ── Update stats ──────────────────────────────────────
function updateStats() {
  document.getElementById("stat-total").textContent     = DOCS.length;
  document.getElementById("stat-companies").textContent = getUniqueCompanies().length;
}

// ── Event wiring ──────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  // Filter tabs
  document.querySelectorAll(".filter-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      currentCat = btn.dataset.cat;
      document.querySelectorAll(".filter-tab").forEach(t => t.classList.remove("active"));
      btn.classList.add("active");
      renderGrid();
    });
  });

  // Search
  const inp = document.getElementById("search-input");
  const clr = document.getElementById("search-clear");
  inp.addEventListener("input", e => {
    currentQuery = e.target.value;
    clr.hidden   = !currentQuery;
    renderGrid();
  });
  clr.addEventListener("click", () => {
    inp.value = ""; currentQuery = "";
    clr.hidden = true;
    inp.focus();
    renderGrid();
  });

  // Sort
  document.getElementById("sort-select").addEventListener("change", e => {
    currentSort = e.target.value;
    renderGrid();
  });

  updateStats();
  renderGrid();
});
