/* viewer.js — KYCStock PDF viewer page */

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id     = params.get("id") || "";
  const doc    = getDocById(id);

  if (!doc) {
    document.querySelector(".viewer-main").innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:16px;color:#8896a8;">
        <div style="font-size:3rem">📄</div>
        <h3 style="font-size:1.1rem;color:#0f1117;">Document not found</h3>
        <a href="index.html" style="color:#2563eb;font-size:0.9rem;">← Back to Library</a>
      </div>`;
    return;
  }

  // ── Topbar info ──────────────────────────────────────
  document.title = `${doc.title} — ${doc.company} | KYCStock`;
  document.getElementById("v-company").textContent = doc.ticker + " · " + doc.company;
  document.getElementById("v-title").textContent   = doc.title;
  document.getElementById("v-download").href       = doc.file;
  document.getElementById("v-download").setAttribute("download", doc.file.split("/").pop());
  document.getElementById("v-open").href           = doc.file;

  // ── Sidebar ──────────────────────────────────────────
  const CAT_LABELS = {
    "annual-report":         "Annual Report",
    "research":              "Research Report",
    "concall":               "Con-Call Transcript",
    "sebi":                  "SEBI / Regulatory",
    "mca":                   "MCA Filing",
    "investor-presentation": "Investor Presentation",
  };
  document.getElementById("vsb-company").textContent  = doc.company;
  document.getElementById("vsb-ticker").textContent   = doc.ticker;
  document.getElementById("vsb-category").textContent = CAT_LABELS[doc.category] || doc.category;
  document.getElementById("vsb-date").textContent     = new Date(doc.date).toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" });
  document.getElementById("vsb-year").textContent     = doc.year || "—";
  document.getElementById("vsb-desc").textContent     = doc.description || "—";

  // ── Related docs ─────────────────────────────────────
  const related = getRelatedDocs(id);
  const relEl   = document.getElementById("vsb-related-list");
  if (related.length) {
    relEl.innerHTML = related.map(r => `
      <a href="viewer.html?id=${r.id}" class="related-item">
        <span class="related-title">${r.title}</span>
        <span class="related-date">${new Date(r.date).toLocaleDateString("en-IN",{month:"short",year:"numeric"})}</span>
      </a>`).join("");
  } else {
    relEl.innerHTML = `<span style="font-size:0.8rem;color:#8896a8;">No other documents from this company yet.</span>`;
  }

  // ── PDF frame ────────────────────────────────────────
  const frame    = document.getElementById("pdf-frame");
  const loading  = document.getElementById("pdf-loading");
  const fallback = document.getElementById("pdf-fallback");

  frame.src = doc.file;
  frame.onload  = () => { loading.style.display = "none"; };
  frame.onerror = () => {
    loading.style.display = "none";
    frame.style.display   = "none";
    fallback.hidden       = false;
    document.getElementById("fallback-download").href = doc.file;
    document.getElementById("fallback-open").href     = doc.file;
  };

  // Hide loading after 8s failsafe
  setTimeout(() => { loading.style.display = "none"; }, 8000);
});
