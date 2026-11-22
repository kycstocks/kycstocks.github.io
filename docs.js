/**
 * docs.js — KYCStock
 * Master document library.
 * To add a PDF:
 *  1. Upload the file to the /pdfs/ folder in GitHub
 *  2. Add an entry below following the same structure
 *  3. Commit — site updates in ~30 seconds
 *
 * The date is optional. When omitted, it defaults to the current date.
 */

const publicationDate = (() => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
})();

const DOCS = [
  // ── SAMPLE ENTRIES — replace with real PDFs ─────────────────
  {
    id: "HFCL-R-26",
    title: "Third Eye View 26",
    company: "HFCL",
    ticker: "HFCL",
    category: "research",
    date: "2026-11-15",
    year: "Q2 FY27",
    pages: 5,
    size: "323 KB",
    description: "HFCL_Limited Forensic",
    file: "pdfs/HFCL_Limited Forensic.pdf",
    tags: [ "HFCL","Third Eye View", "Q2 FY27"],
  },
  {
    id: "Ather Energy -R-26",
    title: "Third Eye View 26",
    company: "Ather Energy Limited",
    ticker: "ATHERENERG",
    category: "research",
    year: "Q2 FY27",
    pages: 3,
    size: "349 KB",
    description: "Ather Energy_Forensic",
    file: "pdfs/Ather Energy_Forensic.pdf",
    tags: [ "ATHERENERG","Third Eye View", "Q2 FY27"],
  },
  {
    id: "Aeroflex-R-26",
    title: "Third Eye View 26",
    company: "Aeroflex Industries Limited",
    ticker: "AEROFLEX",
    category: "research",
    date: "2026-11-15",
    year: "Q2 FY27",
    pages: 4,
    size: "240 KB",
    description: "Aeroflex_Forensic",
    file: "pdfs/Aeroflex_Forensic.pdf",
    tags: [ "AEROFLEX","Third Eye View", "Q2 FY27"],
  },
  {
    id: "STLTECH-R-26",
    title: "Third Eye View 26",
    company: "Sterlite Technologies Ltd.",
    ticker: "STLTECH",
    category: "research",
    date: "2026-11-15",
    year: "Q2 FY27",
    pages: 6,
    size: "378 KB",
    description: "Sterlite Technologies Limited_Forensic",
    file: "pdfs/Sterlite Technologies Limited_Forensic.pdf",
    tags: [ "STLTECH","Third Eye View", "Q2 FY27"],
  },
  {
    id: "Morepen-R-26",
    title: "Third Eye View 26",
    company: "Morepen Laboratories Limited",
    ticker: "MOREPENLAB",
    category: "research",
    date: "2026-11-15",
    year: "Q2 FY27",
    pages: 5,
    size: "323 KB",
    description: "Morepen Laboratories Limited_Forensic",
    file: "pdfs/Morepen Laboratories Limited_Forensic.pdf",
    tags: [ "MOREPENLAB","Third Eye View", "Q2 FY27"],
  },
  {
    id: "HSCL-R-26",
    title: "Third Eye View 26",
    company: "Himadri Speciality Chemical Ltd.",
    ticker: "HSCL",
    category: "research",
    date: "2026-11-15",
    year: "Q2 FY27",
    pages: 4,
    size: "354 KB",
    description: "HSCL_Forensic",
    file: "pdfs/HSCL_Forensic.pdf",
    tags: [ "HSCL","Third Eye View", "Q2 FY27"],
  },
  {
    id: "RIR-R-26",
    title: "Third Eye View 26",
    company: "RIR Power Electronics Ltd.",
    ticker: "RIRPOWER",
    category: "research",
    date: "2026-11-15",
    year: "Q2 FY27",
    pages: 5,
    size: "349 KB",
    description: "RIR_POWER Forensic",
    file: "pdfs/RIR_POWER Forensic.pdf",
    tags: [ "RIRPOWER","Third Eye View", "Q2 FY27"],
  },
  {
    id: "Sammaan-Capital-R-26",
    title: "Third Eye View 26",
    company: "Sammaan Capital Ltd.",
    ticker: "SAMMAANCAP",
    category: "research",
    date: "2026-11-15",
    year: "Q2 FY27",
    pages: 4,
    size: "325 KB",
    description: "Sammaan_Capital Forensic",
    file: "pdfs/Sammaan_Capital Forensic.pdf",
    tags: [ "SAMMAANCAP","Third Eye View", "Q2 FY27"],
  },
  // ── Q3 FY26 earnings call transcripts ───────────────────────
  {
    id: "HFCL-CC-Q3FY26",
    title: "Q3 FY26 Earnings Call Transcript",
    company: "HFCL",
    ticker: "HFCL",
    category: "concall",
    date: "2026-02-03",
    year: "Q3 FY26",
    description: "Official Q3 FY26 conference call transcript filed with BSE.",
    file: "https://www.bseindia.com/xml-data/corpfiling/AttachHis/4b343f8f-c184-416f-902d-f13fa9638bad.pdf",
    tags: [ "HFCL", "Con-Call Transcript", "Q3 FY26" ],
  },
  {
    id: "HSCL-CC-Q3FY26",
    title: "Q3 FY26 Earnings Call Transcript",
    company: "Himadri Speciality Chemical Ltd.",
    ticker: "HSCL",
    category: "concall",
    date: "2026-01-28",
    year: "Q3 FY26",
    description: "Official transcript of the Q3 and nine-month FY26 call held on 21 January 2026.",
    file: "https://www.himadri.com/pdf/HSCLTranscript28012026.pdf",
    tags: [ "HSCL", "Con-Call Transcript", "Q3 FY26" ],
  },
  {
    id: "RIRPOWER-CC-Q3FY26",
    title: "Q3 FY26 Earnings Call Transcript",
    company: "RIR Power Electronics Ltd.",
    ticker: "RIRPOWER",
    category: "concall",
    date: "2026-02-17",
    year: "Q3 FY26",
    description: "Official Q3 FY26 earnings conference call transcript, held on 17 February 2026.",
    file: "https://investors.rirpowersemi.com/financial_result_and_report_pdfs/Ctq0uduaRJ3a0ceUc8VGJMDhphsavnf1Cv8YDI68/Veritas-RIRPower-Feb17-2026.pdf",
    tags: [ "RIRPOWER", "Con-Call Transcript", "Q3 FY26" ],
  },
  {
    id: "SAMMAANCAP-CC-Q3FY26",
    title: "Q3 FY26 Earnings Call Transcript",
    company: "Sammaan Capital Ltd.",
    ticker: "SAMMAANCAP",
    category: "concall",
    date: "2026-02-10",
    year: "Q3 FY26",
    description: "Official Q3 FY26 conference call transcript filed with BSE.",
    file: "https://www.bseindia.com/xml-data/corpfiling/AttachLive/a0fcc0c3-47b0-4ce7-a31d-c1e05af43285.pdf",
    tags: [ "SAMMAANCAP", "Con-Call Transcript", "Q3 FY26" ],
  },
  {
    id: "STLTECH-CC-Q3FY26",
    title: "Q3 FY26 Earnings Call Transcript",
    company: "Sterlite Technologies Ltd.",
    ticker: "STLTECH",
    category: "concall",
    date: "2026-01-23",
    year: "Q3 FY26",
    description: "Official Q3 FY26 earnings call transcript from Sterlite Technologies.",
    file: "https://www.stl.tech/pdf/investors/earning-call-transcripts/Earnings-Call-Transcript-Q3-FY26.pdf",
    tags: [ "STLTECH", "Con-Call Transcript", "Q3 FY26" ],
  },
  // ── Q1 and Q2 FY27 earnings call transcripts ────────────────
  {
    id: "HSCL-CC-Q1FY27",
    title: "Q1 FY27 Earnings Call Transcript",
    company: "Himadri Speciality Chemical Ltd.",
    ticker: "HSCL",
    category: "concall",
    date: "2026-07-16",
    year: "Q1 FY27",
    description: "Official Q1 FY27 earnings conference call transcript from Himadri.",
    file: "https://www.himadri.com/pdf/Transcript_Q1_FY%202026-27_16.07.2026.pdf",
    tags: [ "HSCL", "Con-Call Transcript", "Q1 FY27" ],
  },
  {
    id: "RIRPOWER-CC-Q1FY27",
    title: "Q1 FY27 Earnings Call Transcript",
    company: "RIR Power Electronics Ltd.",
    ticker: "RIRPOWER",
    category: "concall",
    date: "2026-08-13",
    year: "Q1 FY27",
    description: "Official Q1 FY27 earnings conference call transcript from RIR Power Electronics.",
    file: "https://investors.rirpowersemi.com/financial_result_and_report_pdfs/438NAomutTFm5qOpI0JXLxU4JyH2wrDiKKPROUqG/Earnings-Call-Transcript---30-06-2026.pdf",
    tags: [ "RIRPOWER", "Con-Call Transcript", "Q1 FY27" ],
  },
  {
    id: "STLTECH-CC-Q1FY27",
    title: "Q1 FY27 Earnings Call Transcript",
    company: "Sterlite Technologies Ltd.",
    ticker: "STLTECH",
    category: "concall",
    date: "2026-07-24",
    year: "Q1 FY27",
    description: "Official Q1 FY27 earnings call transcript from Sterlite Technologies.",
    file: "https://stl.tech/wp-content/uploads/2026/07/Transcript-July-24-2026.pdf",
    tags: [ "STLTECH", "Con-Call Transcript", "Q1 FY27" ],
  },
  {
    id: "STLTECH-CC-Q2FY27",
    title: "Q2 FY27 Earnings Call Transcript",
    company: "Sterlite Technologies Ltd.",
    ticker: "STLTECH",
    category: "concall",
    date: "2026-10-23",
    year: "Q2 FY27",
    description: "Official Q2 FY27 earnings call transcript from Sterlite Technologies.",
    file: "https://stl.tech/wp-content/uploads/2026/10/Investor-Earnings-Transcript.pdf",
    tags: [ "STLTECH", "Con-Call Transcript", "Q2 FY27" ],
  },
].map(doc => ({ ...doc, date: doc.date || publicationDate }));

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
