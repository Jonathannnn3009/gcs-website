import {
  ArrowLeftRight,
  Briefcase,
  Building2,
  Car,
  GraduationCap,
  Home,
  RefreshCw,
  ShieldCheck,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type CaseStudyGroup = "Home & Property" | "Business & Cash Flow" | "Personal Goals";

export type CaseStudy = {
  slug: string;
  icon: LucideIcon;
  group: CaseStudyGroup;
  category: string;
  headline: string;
  amountLabel: string;
  productSlug: string;
  productLabel: string;
  clientProfile: string;
  challenge: string;
  structuring: string;
  outcome: string;
  image: string;
};

/** Display order and section labels for the grouped case-studies grid. */
export const CASE_STUDY_GROUPS: CaseStudyGroup[] = [
  "Home & Property",
  "Business & Cash Flow",
  "Personal Goals",
];

/**
 * Illustrative scenarios modelled on GCS's real product lineup and typical
 * ticket sizes. Anonymized placeholders — no real customer data. Swap in a
 * real, consenting client's story per case as they become available.
 */
export const CASE_STUDIES: CaseStudy[] = [
  // ── Home & Property ────────────────────────────────────
  {
    slug: "home-loan-non-conventional-income",
    icon: Home,
    group: "Home & Property",
    category: "Home Loan · Non-Conventional Income",
    headline: "₹2.4 crore sanctioned — no salary slip, no problem",
    amountLabel: "₹2.4 Crore",
    productSlug: "home-loan",
    productLabel: "Home Loan",
    clientProfile:
      "A self-employed architect running an established design practice in Thane, with strong monthly billings but no salary slip and income that varies year to year.",
    challenge:
      'Two banks rejected the application at the initial screening stage, citing "income not verifiable" — a common outcome for self-employed applicants whose income doesn\'t fit a standard salaried-income template.',
    structuring:
      "GCS reviewed 18 months of banking activity and client-billing records alongside the applicant's ITRs, and matched the profile with a lender whose underwriting norms specifically accommodate self-employed and professional income assessed on banking turnover rather than salary slips.",
    outcome:
      "₹2.4 crore home loan sanctioned by the matched lender, against the client's target property in Thane.",
    image: "/brand/case-detail-goals-meeting.png",
  },
  {
    slug: "lap-balance-transfer-business-expansion",
    icon: Building2,
    group: "Home & Property",
    category: "Loan Against Property · Balance Transfer + Top-Up",
    headline: "₹2.6 crore unlocked — one property, a lower rate, fresh capital to expand",
    amountLabel: "₹2.6 Crore",
    productSlug: "loan-against-property",
    productLabel: "Loan Against Property",
    clientProfile:
      "A growing trading business owner in Mumbai carrying an existing Loan Against Property from another lender at a rate that had crept up over three years, wanting extra funds to expand inventory.",
    challenge:
      "The client's existing lender had no incentive to reduce the rate on a running facility, and a fresh application elsewhere would have meant re-starting the entire property and income verification process from scratch.",
    structuring:
      "GCS reviewed the existing loan's outstanding principal, tenure and current rate, and identified a lender offering a materially better rate for a balance transfer plus an additional top-up sized to the client's business requirement — combining both into a single new facility.",
    outcome:
      "₹2.6 crore facility approved (existing ₹1.8 crore transferred + ₹80 lakh fresh top-up), with a lower monthly EMI than the client's original loan despite the additional funds.",
    image: "/brand/case-detail-business-handshake.png",
  },
  {
    slug: "home-loan-review-savings",
    icon: ArrowLeftRight,
    group: "Home & Property",
    category: "Home Loan Balance Transfer · Existing Customer Loan Review",
    headline: "₹4,200 shaved off every EMI — one question nobody had asked in 5 years",
    amountLabel: "₹4,200/mo saved",
    productSlug: "balance-transfer",
    productLabel: "Balance Transfer",
    clientProfile:
      "A salaried couple in Mumbai, five years into a home loan taken with their salary-account bank at the time, who had never checked whether a better rate was available elsewhere.",
    challenge:
      "The couple weren't aware their current rate had fallen behind what new-to-bank customers were being offered elsewhere for a similar profile — a common blind spot, since most borrowers only revisit a home loan when something goes wrong.",
    structuring:
      "GCS ran a loan review — outstanding principal, remaining tenure, current rate and applicable transfer costs — and compared this against balance-transfer offers from lenders in its network for the client's current profile.",
    outcome:
      "Loan transferred to a new lender at a lower rate, reducing the monthly EMI by roughly ₹4,200 for the remaining tenure, with no change to the loan amount or the property.",
    image: "/brand/case-detail-family-goals.png",
  },

  // ── Business & Cash Flow ───────────────────────────────
  {
    slug: "cgtmse-collateral-free-msme",
    icon: ShieldCheck,
    group: "Business & Cash Flow",
    category: "CGTMSE Funding · Collateral-Free Business Loan",
    headline: "₹62 lakh funded — zero collateral, one government guarantee",
    amountLabel: "₹62 Lakh",
    productSlug: "cgtmse",
    productLabel: "CGTMSE Funding",
    clientProfile:
      "A growing manufacturing unit in Navi Mumbai, two years into operations, with consistent GST filings and healthy banking turnover, but no owned commercial or residential property to offer as collateral.",
    challenge:
      "Most business-loan lenders wanted collateral given the business's short operating history, effectively ruling out standard secured business loan routes for the funding the business needed.",
    structuring:
      "GCS structured the application under the CGTMSE (Credit Guarantee Fund Trust for Micro and Small Enterprises) route, where a government-backed guarantee substitutes for physical collateral, and matched the client with a lender empanelled for CGTMSE-backed lending.",
    outcome: "₹62 lakh collateral-free business loan sanctioned under the CGTMSE scheme.",
    image: "/brand/case-detail-shop-growth.png",
  },
  {
    slug: "business-loan-banking-strength",
    icon: Briefcase,
    group: "Business & Cash Flow",
    category: "Business Loan · Banking-Strength Underwriting",
    headline: "₹55 lakh sanctioned — on banking strength, not the ITR",
    amountLabel: "₹55 Lakh",
    productSlug: "business-loan",
    productLabel: "Business Loan",
    clientProfile:
      "An established trading firm in Mumbai, three years in business, with strong monthly banking credits but an ITR that understated real turnover — common for cash-heavy trading businesses.",
    challenge:
      "Standard business-loan underwriting leans heavily on ITR-declared income, and an ITR-only assessment would have supported a much smaller loan than the business could actually service.",
    structuring:
      "GCS built the case around 12 months of banking turnover and GST filings rather than ITR alone, and matched the profile with a lender whose credit policy weighs banking strength for trading businesses.",
    outcome:
      "₹55 lakh unsecured business loan sanctioned — nearly double what an ITR-only assessment would have supported.",
    image: "/brand/case-detail-construction.png",
  },
  {
    slug: "working-capital-seasonal-bridge",
    icon: RefreshCw,
    group: "Business & Cash Flow",
    category: "Working Capital · Seasonal Cash-Flow Bridge",
    headline: "₹68 lakh working capital — released before the order was lost",
    amountLabel: "₹68 Lakh",
    productSlug: "working-capital",
    productLabel: "Working Capital",
    clientProfile:
      "A garment exporter in Navi Mumbai with a strong seasonal order book, but cash tied up in receivables right when a large new order needed raw-material payment upfront.",
    challenge:
      "The business's own cash was locked in 60-90 day receivables, and the new order's supplier wanted advance payment — a timing mismatch that had nothing to do with the business's underlying health.",
    structuring:
      "GCS structured a cash credit facility sized to the business's stock and receivables cycle, rather than a fixed-term loan that wouldn't flex with the seasonal pattern.",
    outcome:
      "₹68 lakh working capital limit sanctioned, drawn against as needed rather than disbursed as a lump sum.",
    image: "/brand/case-detail-celebrate.png",
  },

  // ── Personal Goals ─────────────────────────────────────
  {
    slug: "personal-loan-fast-turnaround",
    icon: Wallet,
    group: "Personal Goals",
    category: "Personal Loan · Fast Turnaround",
    headline: "₹24 lakh, disbursed in days — when a medical bill couldn't wait",
    amountLabel: "₹24 Lakh",
    productSlug: "personal-loan",
    productLabel: "Personal Loan",
    clientProfile:
      "A senior salaried IT professional in Pune with a clean credit history, strong take-home pay and stable employment, needing funds quickly for a major family medical emergency.",
    challenge:
      "Time was the constraint, not eligibility — the client needed funds within days, and going lender-by-lender to compare processing timelines would have cost valuable time.",
    structuring:
      "Given the client's clean profile, GCS routed the application directly to a lender known for minimal documentation and fast turnaround for salaried applicants with strong credit scores.",
    outcome:
      "₹24 lakh personal loan sanctioned and disbursed within a few working days of application.",
    image: "/brand/case-detail-family-priorities.png",
  },
  {
    slug: "education-loan-co-applicant",
    icon: GraduationCap,
    group: "Personal Goals",
    category: "Education Loan · Co-Applicant Structuring",
    headline: "₹22 lakh for a degree abroad — one lender said no, structuring said yes",
    amountLabel: "₹22 Lakh",
    productSlug: "education-loan",
    productLabel: "Education Loan",
    clientProfile:
      "A student from Pune admitted to a postgraduate professional course abroad, whose parents' individual income wasn't, on its own, sufficient to meet a single lender's income criteria for the full loan amount.",
    challenge:
      "The family's instinct was to apply with just one parent as co-applicant against their salary alone, which fell short of what most lenders wanted to see for a loan of this size.",
    structuring:
      "GCS reviewed the combined household income and identified a lender willing to consider both parents as joint co-applicants, alongside the standard admission and cost documentation for the course.",
    outcome:
      "₹22 lakh education loan sanctioned, covering tuition and living costs for the course.",
    image: "/brand/case-detail-savings-jar.png",
  },
  {
    slug: "new-car-loan-zero-down",
    icon: Car,
    group: "Personal Goals",
    category: "New Car Loan · 100% On-Road Funding",
    headline: "100% on-road funding — a first car, zero down payment",
    amountLabel: "100% On-Road",
    productSlug: "new-car-loan",
    productLabel: "New Car Loan",
    clientProfile:
      "A first-time car buyer in Pune, two years into a salaried role, wanting to avoid a large down payment on a new hatchback.",
    challenge:
      "Most lenders cap funding at 85-90% of the on-road price for a first-time borrower with limited credit history, leaving a down payment gap the client hadn't budgeted for.",
    structuring:
      "GCS matched the client with a lender offering on-road funding — covering registration and insurance, not just the ex-showroom price — for well-qualified salaried applicants.",
    outcome: "100% on-road funding approved, with no down payment required at delivery.",
    image: "/brand/case-detail-approved.png",
  },
];

export const getCaseStudy = (slug: string) => CASE_STUDIES.find((c) => c.slug === slug);
