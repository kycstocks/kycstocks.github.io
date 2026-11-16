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
    category: "Research Report",
    date: "2026-11-15",
    year: "FY26",
    pages: 5,
    size: "1 MB",
    description: "HFCL_Limited_Forensic___Cycle-Normalized_Analysis",
    file: "pdfs/HFCL_Limited_Forensic___Cycle-Normalized_Analysis",
    tags: [ "HFCL","HFCL-R-26","Research Report", "FY26"],
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
