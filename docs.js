/**
 * docs.js — KYCStock
 * Master document library.
 * To add a PDF:
 *  1. Upload the file to the /pdfs/ folder in GitHub
 *  2. Add an entry below following the same structure
 *  3. Commit — site updates in ~30 seconds
 */

const DOCS = [
  // ── SAMPLE ENTRIES — replace with real PDFs ─────────────────
  {
    id: "HFCL-R-26",
    title: "Research Reports 26",
    company: "HFCL",
    ticker: "HFCL",
    category: "research",
    date: "2026-11-15",
    year: "Q3 FY26",
    pages: 5,
    size: "323 KB",
    description: "HFCL_Limited Forensic",
    file: "pdfs/HFCL_Limited Forensic.pdf",
    tags: [ "HFCL","Research Reports", "Q3 FY26"],
  },
   {
    id: "HSCL-R-26",
    title: "Research Reports 26",
    company: "Himadri Speciality Chemical Ltd.",
    ticker: "HSCL",
    category: "research",
    date: "2026-11-15",
    year: "Q3 FY26",
    pages: 4,
    size: "354 KB",
    description: "HSCL_Forensic",
    file: "pdfs/HSCL_Forensic.pdf",
    tags: [ "HSCL","Research Reports", "Q3 FY26"],
  },
  {
    id: "RIR-R-26",
    title: "Research Reports 26",
    company: "RIR Power Electronics Ltd.",
    ticker: "RIRPOWER",
    category: "research",
    date: "2026-11-15",
    year: "Q3 FY26",
    pages: 5,
    size: "349 KB",
    description: "RIR_POWER Forensic",
    file: "pdfs/RIR_POWER Forensic.pdf",
    tags: [ "RIRPOWER","Research Reports", "Q3 FY26"],
  },
  {
    id: "Sammaan Capital-R-26",
    title: "Research Reports 26",
    company: "Sammaan Capital Ltd.",
    ticker: "SAMMAANCAP",
    category: "research",
    date: "2026-11-15",
    year: "Q3 FY26",
    pages: 4,
    size: "325 KB",
    description: "Sammaan_Capital Forensic",
    file: "pdfs/Sammaan_Capital Forensic.pdf",
    tags: [ "SAMMAANCAP","Research Reports", "Q3 FY26"],
  },
];

/**
 * Get unique companies from DOCS
 */
function getUniqueCompanies() {
  return [...new Set(DOCS.map(d => d.company))];
}

/**
 * Get unique categories from DOCS
 */
function getCategories() {
  return [...new Set(DOCS.map(d => d.category))];
}

/**
 * Find a document by ID
 */
function getDocById(id) {
  return DOCS.find(d => d.id === id) || null;
}

/**
 * Get related documents (same company, different document)
 */
function getRelatedDocs(docId, limit = 4) {
  const doc = getDocById(docId);
  if (!doc) return [];
  return DOCS.filter(d => d.id !== docId && d.company === doc.company).slice(0, limit);
}
