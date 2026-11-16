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

  // ── Topbar info ──────────────────────────────────────
  document.title = `${doc.title} — ${doc.company} | KYCStock`;
  document.getElementById("v-company").textContent = doc.ticker + " · " + doc.company;
  document.getElementById("v-title").textContent = doc.title;
  document.getElementById("v-download").href = doc.file;
  document.getElementById("v-download").setAttribute("download", doc.file.split("/").pop());
  document.getElementById("v-open").href = doc.file;
  document.getElementById("v-open").rel = "noopener noreferrer";

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
    day: "numeric", month: "long", year: "numeric"
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

  // ── PDF.js viewer ────────────────────────────────────
  const main = document.querySelector(".viewer-main");
  const frame = document.getElementById("pdf-frame");
  const loading = document.getElementById("pdf-loading");
  const fallback = document.getElementById("pdf-fallback");
  const downloadFallback = document.getElementById("fallback-download");
  const openFallback = document.getElementById("fallback-open");

  // Use PDF.js rather than the browser's optional native PDF plugin so inline
  // viewing works consistently on mobile and desktop browsers.
  frame.style.display = "none";
  fallback.style.display = "none"; // The stylesheet's display:flex overrides [hidden].
  downloadFallback.href = doc.file;
  downloadFallback.setAttribute("download", doc.file.split("/").pop());
  openFallback.href = doc.file;
  openFallback.rel = "noopener noreferrer";

  const viewer = document.createElement("section");
  viewer.setAttribute("aria-label", "PDF document viewer");
  Object.assign(viewer.style, {
    position: "absolute", inset: "0", display: "none", flexDirection: "column",
    background: "#525659", overflow: "hidden"
  });

  const toolbar = document.createElement("div");
  Object.assign(toolbar.style, {
    display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
    minHeight: "48px", padding: "6px 12px", background: "#323639", color: "#fff",
    font: "14px Inter, sans-serif", flexShrink: "0"
  });

  const makeButton = (label, title) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.title = title;
    Object.assign(button.style, {
      border: "1px solid #666", borderRadius: "4px", padding: "5px 10px",
      background: "#45494d", color: "#fff", cursor: "pointer", font: "inherit"
    });
    return button;
  };

  const previous = makeButton("‹", "Previous page");
  const next = makeButton("›", "Next page");
  const zoomOut = makeButton("−", "Zoom out");
  const zoomIn = makeButton("+", "Zoom in");
  const pageStatus = document.createElement("span");
  pageStatus.setAttribute("aria-live", "polite");
  const zoomStatus = document.createElement("span");
  toolbar.append(previous, next, pageStatus, zoomOut, zoomIn, zoomStatus);

  const pageArea = document.createElement("div");
  Object.assign(pageArea.style, {
    flex: "1", overflow: "auto", display: "flex", justifyContent: "center",
    alignItems: "flex-start", padding: "18px", boxSizing: "border-box"
  });
  const canvas = document.createElement("canvas");
  Object.assign(canvas.style, {
    display: "block", maxWidth: "100%", height: "auto", background: "#fff",
    boxShadow: "0 2px 12px rgba(0,0,0,.35)"
  });
  pageArea.appendChild(canvas);
  viewer.append(toolbar, pageArea);
  main.insertBefore(viewer, frame);

  let pdfDocument;
  let pageNumber = 1;
  let zoom = 1;
  let renderTask;
  let renderSequence = 0;
  let resizeTimer;

  const showFallback = (message) => {
    loading.style.display = "none";
    viewer.style.display = "none";
    frame.style.display = "none";
    fallback.hidden = false;
    fallback.style.display = "flex";
    if (message) {
      const explanation = fallback.querySelector("p");
      if (explanation) explanation.textContent = message;
    }
  };

  const renderPage = async () => {
    if (!pdfDocument) return;
    const sequence = ++renderSequence;
    if (renderTask) {
      renderTask.cancel();
      renderTask = null;
    }

    try {
      const page = await pdfDocument.getPage(pageNumber);
      if (sequence !== renderSequence) return;

      const unscaled = page.getViewport({ scale: 1 });
      const availableWidth = Math.max(240, pageArea.clientWidth - 36);
      const scale = Math.min(1.5, (availableWidth / unscaled.width) * zoom);
      const viewport = page.getViewport({ scale });
      const outputScale = Math.min(window.devicePixelRatio || 1, 2);
      const context = canvas.getContext("2d", { alpha: false });

      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;
      pageStatus.textContent = `${pageNumber} / ${pdfDocument.numPages}`;
      zoomStatus.textContent = `${Math.round(zoom * 100)}%`;
      previous.disabled = pageNumber <= 1;
      next.disabled = pageNumber >= pdfDocument.numPages;
      previous.style.opacity = previous.disabled ? "0.5" : "1";
      next.style.opacity = next.disabled ? "0.5" : "1";

      renderTask = page.render({
        canvasContext: context,
        viewport,
        transform: outputScale === 1 ? null : [outputScale, 0, 0, outputScale, 0, 0]
      });
      await renderTask.promise;
      if (sequence === renderSequence) {
        loading.style.display = "none";
        viewer.style.display = "flex";
      }
    } catch (error) {
      if (error && error.name === "RenderingCancelledException") return;
      console.error("Unable to render PDF page", error);
      showFallback("This PDF could not be displayed. You can still download it or open it in a new tab.");
    }
  };

  previous.addEventListener("click", () => {
    if (pageNumber > 1) { pageNumber--; renderPage(); }
  });
  next.addEventListener("click", () => {
    if (pdfDocument && pageNumber < pdfDocument.numPages) { pageNumber++; renderPage(); }
  });
  zoomOut.addEventListener("click", () => {
    zoom = Math.max(0.5, zoom - 0.2);
    renderPage();
  });
  zoomIn.addEventListener("click", () => {
    zoom = Math.min(2, zoom + 0.2);
    renderPage();
  });
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(renderPage, 150);
  });

  const loadPdfJs = () => new Promise((resolve, reject) => {
    if (window.pdfjsLib) { resolve(window.pdfjsLib); return; }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.onload = () => window.pdfjsLib ? resolve(window.pdfjsLib) : reject(new Error("PDF.js did not initialize"));
    script.onerror = () => reject(new Error("PDF.js could not be downloaded"));
    document.head.appendChild(script);
  });

  loadPdfJs()
    .then(pdfjsLib => {
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      return pdfjsLib.getDocument({ url: doc.file }).promise;
    })
    .then(pdf => {
      pdfDocument = pdf;
      return renderPage();
    })
    .catch(error => {
      console.error("Unable to load PDF", error);
      showFallback("The PDF could not be loaded. Check that the file exists, then download it or open it in a new tab.");
    });
});
