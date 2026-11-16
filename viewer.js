/* viewer.js — KYCStock PDF viewer page */

const PDF_VIEWER = {
  pdfDoc: null,
  pageNum: 1,
  scale: 1.2,
  loading: false,
};

function updatePageIndicator() {
  const indicator = document.getElementById("page-indicator");
  if (!indicator || !PDF_VIEWER.pdfDoc) return;
  indicator.textContent = `Page ${PDF_VIEWER.pageNum} / ${PDF_VIEWER.pdfDoc.numPages}`;
}

function showPdfFallback() {
  const fallback = document.getElementById("pdf-fallback");
  const loading = document.getElementById("pdf-loading");
  if (fallback) fallback.hidden = false;
  if (loading) loading.style.display = "none";
}

function updateCanvasSize(canvas, viewport) {
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  canvas.style.width = `${Math.min(viewport.width, window.innerWidth * 0.8)}px`;
  canvas.style.height = "auto";
}

function renderCurrentPage() {
  const canvas = document.getElementById("pdf-canvas");
  const loading = document.getElementById("pdf-loading");

  if (!canvas || !PDF_VIEWER.pdfDoc) return;

  if (loading) loading.style.display = "none";

  PDF_VIEWER.pdfDoc.getPage(PDF_VIEWER.pageNum).then(page => {
    const viewport = page.getViewport({ scale: PDF_VIEWER.scale });
    const context = canvas.getContext("2d");

    updateCanvasSize(canvas, viewport);

    const renderTask = page.render({
      canvasContext: context,
      viewport
    });

    renderTask.promise.then(() => {
      updatePageIndicator();
    }).catch(() => {
      showPdfFallback();
    });
  }).catch(() => {
    showPdfFallback();
  });
}

function changePage(delta) {
  if (!PDF_VIEWER.pdfDoc) return;
  const nextPage = PDF_VIEWER.pageNum + delta;
  if (nextPage >= 1 && nextPage <= PDF_VIEWER.pdfDoc.numPages) {
    PDF_VIEWER.pageNum = nextPage;
    renderCurrentPage();
  }
}

function changeZoom(delta) {
  const nextScale = Math.max(0.75, Math.min(2.5, PDF_VIEWER.scale + delta));
  PDF_VIEWER.scale = nextScale;
  renderCurrentPage();
}

async function loadPdfIntoCanvas(docFile) {
  if (!window.pdfjsLib) {
    showPdfFallback();
    return;
  }

  window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

  try {
    const response = await fetch(docFile);
    if (!response.ok) throw new Error("PDF fetch failed");

    const pdfBytes = await response.arrayBuffer();
    const pdfDoc = await window.pdfjsLib.getDocument({ data: new Uint8Array(pdfBytes) }).promise;

    PDF_VIEWER.pdfDoc = pdfDoc;
    PDF_VIEWER.pageNum = 1;
    PDF_VIEWER.scale = 1.2;
    renderCurrentPage();
  } catch (error) {
    console.error("PDF render error:", error);
    showPdfFallback();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id") || "";
  const doc = getDocById(id);

  const prevPageBtn = document.getElementById("prev-page");
  const nextPageBtn = document.getElementById("next-page");
  const zoomOutBtn = document.getElementById("zoom-out");
  const zoomInBtn = document.getElementById("zoom-in");

  if (prevPageBtn) prevPageBtn.addEventListener("click", () => changePage(-1));
  if (nextPageBtn) nextPageBtn.addEventListener("click", () => changePage(1));
  if (zoomOutBtn) zoomOutBtn.addEventListener("click", () => changeZoom(-0.2));
  if (zoomInBtn) zoomInBtn.addEventListener("click", () => changeZoom(0.2));

  if (!doc) {
    document.querySelector(".viewer-main").innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:16px;color:#8896a8;">
        <div style="font-size:3rem">📄</div>
        <h3 style="font-size:1.1rem;color:#0f1117;">Document not found</h3>
        <a href="index.html" style="color:#2563eb;font-size:0.9rem;">← Back to Library</a>
      </div>`;
    return;
  }

  document.title = `${doc.title} — ${doc.company} | KYCStock`;
  document.getElementById("v-company").textContent = doc.ticker + " · " + doc.company;
  document.getElementById("v-title").textContent = doc.title;
  document.getElementById("v-download").href = doc.file;
  document.getElementById("v-download").setAttribute("download", doc.file.split("/").pop());
  document.getElementById("v-open").href = doc.file;

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
  document.getElementById("vsb-date").textContent = new Date(doc.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  document.getElementById("vsb-year").textContent = doc.year || "—";
  document.getElementById("vsb-desc").textContent = doc.description || "—";

  const related = getRelatedDocs(id);
  const relEl = document.getElementById("vsb-related-list");
  if (related.length) {
    relEl.innerHTML = related.map(r => `
      <a href="viewer.html?id=${r.id}" class="related-item">
        <span class="related-title">${r.title}</span>
        <span class="related-date">${new Date(r.date).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</span>
      </a>
    `).join("");
  } else {
    relEl.innerHTML = `<span style="font-size:0.8rem;color:#8896a8;">No other documents from this company yet.</span>`;
  }

  const fallbackDownload = document.getElementById("fallback-download");
  const fallbackOpen = document.getElementById("fallback-open");
  if (fallbackDownload) fallbackDownload.href = doc.file;
  if (fallbackOpen) fallbackOpen.href = doc.file;

  loadPdfIntoCanvas(doc.file);
});
