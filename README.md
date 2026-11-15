# KYCStock — Know Your Company, Know Your Stock

A free PDF document library for Indian stock market research.

**Live Site:** https://kycstocks.github.io

## What it hosts
- Annual Reports
- Research Reports (Brokerages)
- Con-Call Transcripts
- SEBI / Regulatory Orders
- MCA Filings
- Investor Presentations

## How to add a PDF

1. Upload the PDF to the `/pdfs/` folder
2. Open `docs.js` and add an entry:

```js
{
  id: "unique-id",
  title: "Annual Report FY 2024-25",
  company: "Company Name Ltd",
  ticker: "TICKER",
  category: "annual-report",   // See categories below
  date: "2025-05-20",
  year: "FY25",
  pages: 180,
  size: "12 MB",
  description: "Brief description of the document.",
  file: "pdfs/filename.pdf",
  tags: ["Company", "Annual Report", "FY25"],
},
```

### Categories
| Value | Label |
|---|---|
| `annual-report` | Annual Report |
| `research` | Research Report |
| `concall` | Con-Call Transcript |
| `sebi` | SEBI / Regulatory |
| `mca` | MCA Filing |
| `investor-presentation` | Investor Presentation |

## Deployment
This site uses GitHub Pages. Every commit auto-deploys in ~30 seconds.

Enable GitHub Pages: Repo Settings → Pages → Source: main branch → / (root)
