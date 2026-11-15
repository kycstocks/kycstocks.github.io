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
    category: "Research Reports",
    date: "2026-11-15",
    year: "FY26",
    pages: 5,
    size: "1 MB",
    description: "HFCL_Limited_Forensic___Cycle-Normalized_Analysis",
    file: "pdfs/HFCL_Limited_Forensic___Cycle-Normalized_Analysis",
    tags: [ "HFCL", "Research Reports 26", "FY26"],
  },
  {
    id: "reliance-ar-fy25",
    title: "Annual Report FY 2024-25",
    company: "Reliance Industries Ltd",
    ticker: "RELIANCE",
    category: "annual-report",
    date: "2025-07-01",
    year: "FY25",
    pages: 320,
    size: "28 MB",
    description: "Reliance Industries FY25 Annual Report covering O2C, Jio, Retail, and New Energy business segments.",
    file: "pdfs/Reliance_Annual_Report_FY25.pdf",
    tags: ["Reliance", "Jio", "Retail", "Annual Report", "FY25"],
  },
  {
    id: "hdfc-ar-fy25",
    title: "Annual Report FY 2024-25",
    company: "HDFC Bank Ltd",
    ticker: "HDFCBANK",
    category: "annual-report",
    date: "2025-07-15",
    year: "FY25",
    pages: 420,
    size: "35 MB",
    description: "HDFC Bank FY25 Annual Report — first full year after merger with HDFC Ltd. Covers retail, wholesale, and treasury operations.",
    file: "pdfs/HDFC_Bank_Annual_Report_FY25.pdf",
    tags: ["HDFC Bank", "Banking", "Annual Report", "FY25"],
  },
  {
    id: "tcs-q4fy25-concall",
    title: "Q4 FY25 Earnings Call Transcript",
    company: "Tata Consultancy Services Ltd",
    ticker: "TCS",
    category: "concall",
    date: "2025-04-17",
    year: "FY25",
    pages: 22,
    size: "1.2 MB",
    description: "Transcript of TCS Q4 FY25 earnings call with CEO K. Krithivasan and CFO Samir Seksaria. Includes Q&A session.",
    file: "pdfs/TCS_Q4FY25_Concall_Transcript.pdf",
    tags: ["TCS", "Concall", "Q4 FY25", "Earnings"],
  },
  {
    id: "reliance-q4fy25-concall",
    title: "Q4 FY25 Earnings Call Transcript",
    company: "Reliance Industries Ltd",
    ticker: "RELIANCE",
    category: "concall",
    date: "2025-04-25",
    year: "FY25",
    pages: 28,
    size: "1.8 MB",
    description: "Transcript of RIL Q4 FY25 earnings call with Mukesh Ambani and CFO team. Covers Jio, Retail, O2C and New Energy.",
    file: "pdfs/Reliance_Q4FY25_Concall_Transcript.pdf",
    tags: ["Reliance", "Concall", "Q4 FY25", "Earnings"],
  },
  {
    id: "tcs-ip-fy25",
    title: "FY25 Investor Presentation",
    company: "Tata Consultancy Services Ltd",
    ticker: "TCS",
    category: "investor-presentation",
    date: "2025-05-16",
    year: "FY25",
    pages: 48,
    size: "5 MB",
    description: "TCS FY25 annual earnings presentation covering revenue breakdown, deal wins, GenAI pipeline, and guidance.",
    file: "pdfs/TCS_Investor_Presentation_FY25.pdf",
    tags: ["TCS", "Investor Presentation", "FY25"],
  },
  {
    id: "sebi-order-adani-2023",
    title: "SEBI Investigation Report — Adani Group",
    company: "Adani Enterprises Ltd",
    ticker: "ADANIENT",
    category: "sebi",
    date: "2024-01-03",
    year: "2024",
    pages: 35,
    size: "2.5 MB",
    description: "SEBI's investigation report on Adani Group shareholding pattern and regulatory compliance findings.",
    file: "pdfs/SEBI_Adani_Investigation_2024.pdf",
    tags: ["SEBI", "Adani", "Regulatory", "Investigation"],
  },
  {
    id: "infosys-ar-fy25",
    title: "Annual Report FY 2024-25",
    company: "Infosys Ltd",
    ticker: "INFY",
    category: "annual-report",
    date: "2025-06-28",
    year: "FY25",
    pages: 290,
    size: "22 MB",
    description: "Infosys FY25 Annual Report including IFRS financials, ESG report, and business outlook.",
    file: "pdfs/Infosys_Annual_Report_FY25.pdf",
    tags: ["Infosys", "IT", "Annual Report", "FY25"],
  },
  {
    id: "kotak-research-tcs",
    title: "TCS Initiating Coverage — Buy, TP ₹4,500",
    company: "Tata Consultancy Services Ltd",
    ticker: "TCS",
    category: "research",
    date: "2025-06-10",
    year: "2025",
    pages: 32,
    size: "3.1 MB",
    description: "Kotak Securities initiating coverage on TCS with Buy rating and 12-month target price of ₹4,500. GenAI tailwinds thesis.",
    file: "pdfs/Kotak_TCS_Initiation_Jun2025.pdf",
    tags: ["TCS", "Research", "Kotak", "Buy", "Initiating Coverage"],
  },
  {
    id: "mca-tcs-mgt7-fy25",
    title: "Annual Return (Form MGT-7) FY 2024-25",
    company: "Tata Consultancy Services Ltd",
    ticker: "TCS",
    category: "mca",
    date: "2024-11-15",
    year: "FY25",
    pages: 45,
    size: "2.8 MB",
    description: "TCS Annual Return filed with Ministry of Corporate Affairs for FY 2024-25.",
    file: "pdfs/TCS_MGT7_FY25.pdf",
    tags: ["TCS", "MCA", "MGT-7", "Annual Return"],
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
