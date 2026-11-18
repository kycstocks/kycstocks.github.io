/* viewer.js — KYCStock PDF viewer page */

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id") || "";
  const doc = getDocById(id);

  if (!doc) {
    document.querySelector(".viewer-main").innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:16px;color:#8896a8;">
        <div style="font-size:3rem">📄</div>
        <h3 style="font-size:1.1rem;color:#0f1117;">Document not found</h3>
        <a href="index.html" style="color:#2563eb;font-size:0.9rem;">← Back to Library</a>
      </div>`;
    return;
  }

  // Resolve relative PDF paths against the page URL and safely encode spaces.
  const pdfUrl = new URL(doc.file, document.baseURI).href;
  const fileName = decodeURIComponent(new URL(pdfUrl).pathname.split("/").pop() || "document.pdf");

  // ── Topbar info ──────────────────────────────────────
  document.title = `${doc.title} — ${doc.company} | KYCStock`;
  document.getElementById("v-company").textContent = `${doc.ticker} · ${doc.company}`;
  document.getElementById("v-title").textContent = doc.title;

  const downloadLink = document.getElementById("v-download");
  downloadLink.href = pdfUrl;
  downloadLink.setAttribute("download", fileName);
  const openLink = document.getElementById("v-open");
  openLink.href = pdfUrl;
  openLink.rel = "noopener noreferrer";

  // ── Sidebar ──────────────────────────────────────────
  const CAT_LABELS = {
    "annual-report": "Annual Report",
    "research": "Research Report",
    "concall": "Con-Call Transcript",
    "sebi": "SEBI / Regulatory",
    "mca": "MCA Filing",
    "investor-presentation": "Investor Presentation",
  };
  document.getElementById("vsb-company").textContent = doc.company;
  document.getElementById("vsb-ticker").textContent = doc.ticker;
  document.getElementById("vsb-category").textContent = CAT_LABELS[doc.category] || doc.category;
  document.getElementById("vsb-date").textContent = new Date(doc.date).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
  document.getElementById("vsb-year").textContent = doc.year || "—";
  document.getElementById("vsb-desc").textContent = doc.description || "—";

  // ── Related docs ─────────────────────────────────────
  const related = getRelatedDocs(id);
  const relEl = document.getElementById("vsb-related-list");
  if (related.length) {
    relEl.innerHTML = related.map(r => `
      <a href="viewer.html?id=${encodeURIComponent(r.id)}" class="related-item">
        <span class="related-title">${r.title}</span>
        <span class="related-date">${new Date(r.date).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</span>
      </a>`).join("");
  } else {
    relEl.innerHTML = `<span style="font-size:0.8rem;color:#8896a8;">No other documents from this company yet.</span>`;
  }

  // ── PDF frame ────────────────────────────────────────
  const frame = document.getElementById("pdf-frame");
  const loading = document.getElementById("pdf-loading");
  const fallback = document.getElementById("pdf-fallback");
  const fallbackDownload = document.getElementById("fallback-download");
  const fallbackOpen = document.getElementById("fallback-open");

  // CSS display rules can override the browser's default [hidden] styling.
  // Set inline display explicitly so the fallback never covers the PDF on load.
  fallback.hidden = true;
  fallback.style.display = "none";
  fallbackDownload.href = pdfUrl;
  fallbackDownload.setAttribute("download", fileName);
  fallbackOpen.href = pdfUrl;
  fallbackOpen.rel = "noopener noreferrer";

  let finished = false;
  const showFallback = () => {
    if (finished) return;
    finished = true;
    loading.style.display = "none";
    fallback.hidden = false;
    fallback.style.display = "flex";
  };

  frame.addEventListener("load", () => {
    if (finished) return;
    finished = true;
    loading.style.display = "none";
  }, { once: true });
  frame.addEventListener("error", showFallback, { once: true });

  // Chrome's built-in PDF viewer can render PDFs directly in an iframe. The
  // fragment requests its toolbar while preserving native browser controls.
  frame.src = `${pdfUrl}#toolbar=1&navpanes=0&view=FitH`;

  // Some PDF hosts block iframe embedding, and iframe load events cannot
  // reliably detect that. Keep Open/Download available if loading takes too long.
  window.setTimeout(showFallback, 12000);
});
