/**
 * Pre-baked ExtractionResult for the sample SOW (G8/G22): deterministic,
 * instant, free — no live LLM in the demo build. Citation model mirrors
 * PRD §5 extractions.citations: {page, quote, confidence}.
 */

export type Confidence = "verified" | "inferred" | "low";

export interface Citation {
  id: string;
  page: number;
  quote: string;
  confidence: Confidence;
}

export interface PlanTask {
  id: string;
  title: string;
  estimateH: number;
  dueOffsetDays: number;
  owner: string;
}

export interface Deliverable {
  id: string;
  title: string;
  description: string;
  citeId: string | null;
  tasks: PlanTask[];
}

export interface Milestone {
  id: string;
  title: string;
  due: string;
  citeId: string | null;
}

export interface BudgetItem {
  id: string;
  label: string;
  amount: string;
  citeId: string | null;
}

export const CITATIONS: Record<string, Citation> = {
  c_kickoff: {
    id: "c_kickoff",
    page: 2,
    quote:
      "Engagement commences within two (2) weeks of countersignature, at a mutually agreed kickoff call.",
    confidence: "verified",
  },
  c_audit: {
    id: "c_audit",
    page: 3,
    quote:
      "Agency will deliver a comprehensive technical SEO audit covering 47 checkpoints across crawlability, indexation, and site speed.",
    confidence: "verified",
  },
  c_kw: {
    id: "c_kw",
    page: 4,
    quote:
      "A keyword strategy targeting no fewer than 120 commercial and informational terms, prioritized by opportunity score.",
    confidence: "verified",
  },
  c_gap: {
    id: "c_gap",
    page: 4,
    quote:
      "Including a competitor gap analysis across the Client's five (5) named competitors.",
    confidence: "verified",
  },
  c_content: {
    id: "c_content",
    page: 5,
    quote:
      "Eight (8) SEO content briefs per month, each with target keyword, outline, and internal-linking recommendations.",
    confidence: "verified",
  },
  c_links: {
    id: "c_links",
    page: 7,
    quote:
      "Ongoing link outreach securing placements on domains of Domain Rating 40 or higher, minimum four (4) per month.",
    confidence: "verified",
  },
  c_retainer: {
    id: "c_retainer",
    page: 10,
    quote:
      "Monthly retainer of $4,500, invoiced on the first business day of each month, net-15 terms.",
    confidence: "verified",
  },
  c_setup: {
    id: "c_setup",
    page: 10,
    quote: "one-time onboarding and configuration fee",
    confidence: "low",
  },
};

export const DELIVERABLES: Deliverable[] = [
  {
    id: "d1",
    title: "Technical SEO audit — 47 checkpoints",
    description: "Crawlability, indexation, and site-speed audit with prioritized fixes.",
    citeId: "c_audit",
    tasks: [
      { id: "t1", title: "Full crawl + index coverage review", estimateH: 6, dueOffsetDays: 14, owner: "Maya" },
      { id: "t2", title: "Core Web Vitals + speed diagnostics", estimateH: 4, dueOffsetDays: 18, owner: "Maya" },
      { id: "t3", title: "Prioritized fix roadmap workshop", estimateH: 2, dueOffsetDays: 28, owner: "Leo" },
    ],
  },
  {
    id: "d2",
    title: "Keyword strategy — 120 target terms",
    description: "Commercial + informational terms ranked by opportunity score.",
    citeId: "c_kw",
    tasks: [
      { id: "t4", title: "Seed list + search-volume pull", estimateH: 3, dueOffsetDays: 10, owner: "Leo" },
      { id: "t5", title: "Opportunity scoring model", estimateH: 3, dueOffsetDays: 16, owner: "Leo" },
    ],
  },
  {
    id: "d3",
    title: "Competitor gap analysis",
    description: "Five named competitors; content and link gaps.",
    citeId: "c_gap",
    tasks: [
      { id: "t6", title: "Competitor crawl + rankings snapshot", estimateH: 4, dueOffsetDays: 20, owner: "Maya" },
      { id: "t7", title: "Gap report + recommendations", estimateH: 3, dueOffsetDays: 26, owner: "Leo" },
    ],
  },
  {
    id: "d4",
    title: "Content briefs — 8 per month",
    description: "Keyword, outline, and internal-linking recs per brief.",
    citeId: "c_content",
    tasks: [
      { id: "t8", title: "Editorial calendar (Q1)", estimateH: 2, dueOffsetDays: 30, owner: "Ana" },
      { id: "t9", title: "First batch: 8 briefs", estimateH: 8, dueOffsetDays: 45, owner: "Ana" },
    ],
  },
  {
    id: "d5",
    title: "Link outreach — DR 40+ placements",
    description: "Minimum four placements per month on DR 40+ domains.",
    citeId: "c_links",
    tasks: [
      { id: "t10", title: "Prospect list + outreach sequences", estimateH: 5, dueOffsetDays: 35, owner: "Ana" },
      { id: "t11", title: "Month-1 placements (4)", estimateH: 6, dueOffsetDays: 60, owner: "Ana" },
    ],
  },
  {
    id: "d6",
    title: "Monthly reporting dashboard",
    description: "Rankings, traffic, conversions — live dashboard plus monthly readout.",
    citeId: null, // inferred — no grounded quote (renders warning badge, lands in tray)
    tasks: [
      { id: "t12", title: "Dashboard build + KPI wiring", estimateH: 4, dueOffsetDays: 30, owner: "Maya" },
    ],
  },
];

export const MILESTONES: Milestone[] = [
  { id: "m1", title: "Kickoff call", due: "Within 2 weeks of signature", citeId: "c_kickoff" },
  { id: "m2", title: "Audit delivered", due: "Day 30", citeId: "c_audit" },
  { id: "m3", title: "First content batch", due: "Day 45", citeId: "c_content" },
];

export const BUDGET: BudgetItem[] = [
  { id: "b1", label: "Monthly retainer", amount: "$4,500/mo", citeId: "c_retainer" },
  { id: "b2", label: "Setup fee", amount: "$2,000", citeId: "c_setup" }, // low confidence
];

/** Sample SOW rendered as paginated rich text (demo build: HTML document
 *  viewer stands in for pdf.js; citation spans are the highlight quads). */
export interface DocSegment {
  text: string;
  citeId?: string;
}
export interface DocPage {
  n: number;
  heading: string;
  paras: DocSegment[][];
}

export const DOC_PAGES: DocPage[] = [
  {
    n: 1,
    heading: "Statement of Work — Acme Outdoor Co × Northbeam Digital",
    paras: [
      [{ text: "This Statement of Work (“SOW”) is entered into by Acme Outdoor Co (“Client”) and Northbeam Digital LLC (“Agency”) and is governed by the Master Services Agreement dated May 12, 2026." }],
      [{ text: "The engagement covers search engine optimization services for acmeoutdoor.com, including technical remediation, content strategy, and authority building, as detailed herein." }],
    ],
  },
  {
    n: 2,
    heading: "1. Term & Commencement",
    paras: [
      [
        { text: "The initial term is twelve (12) months. " },
        { text: "Engagement commences within two (2) weeks of countersignature, at a mutually agreed kickoff call.", citeId: "c_kickoff" },
        { text: " Either party may terminate with sixty (60) days written notice after month six." },
      ],
      [{ text: "Client will designate a primary point of contact with authority to approve deliverables within five (5) business days of submission." }],
    ],
  },
  {
    n: 3,
    heading: "2. Technical Foundations",
    paras: [
      [
        { text: "Agency will deliver a comprehensive technical SEO audit covering 47 checkpoints across crawlability, indexation, and site speed.", citeId: "c_audit" },
        { text: " Findings will be prioritized by estimated impact and engineering effort, and reviewed in a working session with Client's development team." },
      ],
      [{ text: "Remediation of identified issues is the responsibility of Client's engineering team; Agency will provide specifications and acceptance criteria for each fix." }],
    ],
  },
  {
    n: 4,
    heading: "3. Keyword & Competitive Strategy",
    paras: [
      [
        { text: "Agency will produce " },
        { text: "a keyword strategy targeting no fewer than 120 commercial and informational terms, prioritized by opportunity score.", citeId: "c_kw" },
      ],
      [
        { text: "The strategy will map terms to existing and net-new pages, " },
        { text: "including a competitor gap analysis across the Client's five (5) named competitors.", citeId: "c_gap" },
      ],
    ],
  },
  {
    n: 5,
    heading: "4. Content Program",
    paras: [
      [
        { text: "Agency will supply " },
        { text: "eight (8) SEO content briefs per month, each with target keyword, outline, and internal-linking recommendations.", citeId: "c_content" },
        { text: " Client's in-house writers retain authorship; Agency reviews drafts for search intent alignment." },
      ],
      [{ text: "The first content batch is due no later than day 45 of the engagement, aligned to the editorial calendar approved at kickoff." }],
    ],
  },
  {
    n: 6,
    heading: "5. Assumptions",
    paras: [
      [{ text: "Client warrants CMS access, analytics access (GA4 and Search Console), and a staging environment will be granted within ten (10) business days of kickoff. Delays extend dependent deadlines day-for-day." }],
    ],
  },
  {
    n: 7,
    heading: "6. Authority Building",
    paras: [
      [
        { text: "Agency will conduct " },
        { text: "ongoing link outreach securing placements on domains of Domain Rating 40 or higher, minimum four (4) per month.", citeId: "c_links" },
        { text: " Placements are reported monthly with full URL and metric documentation." },
      ],
      [{ text: "Agency will not engage in link schemes prohibited by search engine guidelines; all outreach is manual and editorial." }],
    ],
  },
  {
    n: 8,
    heading: "7. Out of Scope",
    paras: [
      [{ text: "Paid media management, web development beyond specifications, PR retainers, and non-English markets are out of scope for this SOW and may be quoted separately." }],
    ],
  },
  {
    n: 9,
    heading: "8. Reporting & Communication",
    paras: [
      [{ text: "Agency will maintain shared visibility into rankings, organic traffic, and conversion trends, reviewed in a monthly readout with Client stakeholders. Weekly async updates are provided via Client's preferred channel." }],
    ],
  },
  {
    n: 10,
    heading: "9. Fees",
    paras: [
      [
        { text: "Client will pay a " },
        { text: "monthly retainer of $4,500, invoiced on the first business day of each month, net-15 terms.", citeId: "c_retainer" },
        { text: " Fees are exclusive of third-party tooling agreed in advance." },
      ],
      [
        { text: "A " },
        { text: "one-time onboarding and configuration fee", citeId: "c_setup" },
        { text: " may apply per Exhibit B, subject to final scoping." },
      ],
    ],
  },
  {
    n: 11,
    heading: "10. Stakeholders",
    paras: [
      [{ text: "Client: Dana Reyes (Marketing Director, primary), Sam Okada (Engineering Lead). Agency: account manager to be assigned at kickoff, supported by SEO strategy and content leads." }],
    ],
  },
  {
    n: 12,
    heading: "Signatures",
    paras: [
      [{ text: "Executed by the duly authorized representatives of the parties as of the SOW Effective Date. Acme Outdoor Co — Dana Reyes. Northbeam Digital LLC — J. Whitfield." }],
    ],
  },
];

export function extractionStats() {
  const items =
    DELIVERABLES.length +
    DELIVERABLES.reduce((a, d) => a + d.tasks.length, 0) +
    MILESTONES.length +
    BUDGET.length;
  const needsReview =
    DELIVERABLES.filter((d) => !d.citeId).length +
    BUDGET.filter((b) => b.citeId && CITATIONS[b.citeId].confidence === "low").length;
  return { items, verified: items - needsReview, needsReview };
}
