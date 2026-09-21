import {
  ArrowLeftRight,
  Banknote,
  Briefcase,
  Building2,
  CalendarRange,
  Car,
  CarFront,
  CreditCard,
  Gauge,
  GraduationCap,
  Handshake,
  HardHat,
  Home,
  KeyRound,
  RefreshCw,
  Repeat,
  PieChart,
  ScrollText,
  ShieldCheck,
  Stamp,
  Stethoscope,
  Store,
  TrendingDown,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type ProductGroup =
  | "Property Finance"
  | "Business Growth"
  | "Cash Flow & Trade"
  | "Personal & Education"
  | "Vehicles & Special Cases";

export type Product = {
  slug: string;
  icon: LucideIcon;
  title: string;
  tagline: string;
  group: ProductGroup;
  facts: { label: string; value: string }[];
  about: string;
  features: string[];
  eligibility: string[];
  documents: string[];
  /** Only for products where paperwork genuinely differs by applicant type. */
  documentCategories?: { label: string; description: string; items: string[] }[];
  /** For sensitive/informal products we don't want to spell out publicly — show only the top facts, then a direct "contact us" instead of features/eligibility/documents. */
  minimalDisclosure?: boolean;
};

const KYC = "KYC (PAN, Aadhaar, address proof)";
const INCOME = "Income proof (salary slips, ITR, bank statements)";
const BUSINESS_DOCS = "Business proof (GST returns, ITR with financials, 12-month banking)";
const PROPERTY_DOCS = "Property papers (agreement, title chain, tax receipts)";
const PHOTOS = "Passport-size photographs of applicant and co-applicant";

// Income-proof paperwork for secured loans varies enough by applicant type
// that it's shown as its own tab rather than folded into one flat list.
const SALARIED_DOCS = [
  "Last 3 months' salary slips",
  "Last 6 months' bank statement showing salary credits",
  "Latest Form 16, or last 2 years' Form 16",
  "Offer or appointment letter, if under 1 year with the current employer",
];
const SELF_EMPLOYED_DOCS = [
  "Last 3 years' ITR with computation of income",
  "Last 3 years' audited financials — P&L and balance sheet, where applicable",
  "Last 12 months' bank statements (savings and current account)",
  "Business proof — GST registration, shop licence, partnership deed or MOA/AOA as applicable",
];
const NRI_DOCS = [
  "Passport and valid visa copy",
  "Last 6 months' salary slips and a copy of the employment contract",
  "Last 12 months' NRE/NRO account statements",
  "Power of Attorney (POA) in favour of a resident Indian representative, for signing if the applicant can't be present in India",
  "A resident Indian co-applicant's PAN card and address proof",
];
export const APPLICANT_CATEGORY_LABELS = ["Salaried", "Self-Employed", "NRI"];

const APPLICANT_DOC_CATEGORIES = [
  {
    label: "Salaried",
    description:
      "You draw a fixed monthly salary from an employer. Lenders mainly check salary slips, Form 16 and bank credits.",
    items: SALARIED_DOCS,
  },
  {
    label: "Self-Employed",
    description:
      "You run a business, practice a profession, or freelance. Lenders look at ITRs, audited financials and business banking.",
    items: SELF_EMPLOYED_DOCS,
  },
  {
    label: "NRI",
    description:
      "You live and work outside India. Expect visa, passport and NRE/NRO account checks, plus a resident co-applicant.",
    items: NRI_DOCS,
  },
];

export const PRODUCTS: Product[] = [
  {
    slug: "home-loan",
    icon: Home,
    title: "Home Loan",
    tagline: "The keys to your home, without the runaround.",
    group: "Property Finance",
    facts: [
      { label: "Interest rate", value: "From 7.10%* p.a." },
      { label: "Loan amount", value: "Up to ₹10 Cr" },
      { label: "Tenure", value: "Up to 30 years" },
      { label: "Minimum ticket size", value: "₹20 Lakh" },
    ],
    about:
      "Whether it's a ready flat, an under-construction project, a self-build or a plot purchase, we shortlist the lender likely to sanction fastest for your profile — and push a stalled or declined file to someone better placed to say yes.",
    features: [
      "Choice of floating or fixed-rate options",
      "Pre-approved offers checked where your bank runs such a programme",
      "Balance transfer with top-up if a better rate appears later",
      "Home-loan-linked overdraft (offset account) to trim interest",
      "Joint-applicant structuring for tax breaks under 80C and 24(b)",
    ],
    eligibility: [
      "Resident Indian, generally 21–65 (up to around 70 for self-employed) at loan maturity",
      "Salaried with take-home income from about ₹25,000/month, or self-employed with 2–3 years of ITR",
      "Cash salary accepted as income proof too, not just bank-credited salary",
      "A CIBIL score near 700 gets the sharpest rate; lower scores are reviewed case by case, not auto-rejected",
    ],
    documents: [KYC, PROPERTY_DOCS, PHOTOS],
    documentCategories: APPLICANT_DOC_CATEGORIES,
  },
  {
    slug: "loan-against-property",
    icon: Building2,
    title: "Loan Against Property",
    tagline: "Your property's value, working for you.",
    group: "Property Finance",
    facts: [
      { label: "Loan amount", value: "Up to 100% of property value" },
      { label: "Interest rate", value: "From 7.50%* p.a." },
      { label: "Tenure", value: "Up to 20 years" },
      { label: "Minimum ticket size", value: "₹20 Lakh" },
    ],
    about:
      "Borrow against a residential, commercial or industrial property you already own — for expansion, debt consolidation, a medical bill, or any need the bank doesn't need to approve of. You keep ownership and keep using the property throughout.",
    features: [
      "Residential, commercial and industrial property accepted as security",
      "Income-based, banking-based and GST-based assessment tracks",
      "Top-up available on a mortgage you already hold",
      "Term loan or a reducing overdraft, your call",
    ],
    eligibility: [
      "Property owner, generally 21–70 years of age when the loan matures",
      "Clean and marketable title with the full ownership chain on record",
      "Demonstrable repayment capacity via income, business banking or rental receipts — cash salary accepted too, not just bank-credited salary",
    ],
    documents: [KYC, PROPERTY_DOCS, PHOTOS],
    documentCategories: APPLICANT_DOC_CATEGORIES,
  },
  {
    slug: "lease-rental-discounting",
    icon: Store,
    title: "Lease Rental Discounting",
    tagline: "Rent today becomes capital today.",
    group: "Property Finance",
    facts: [
      { label: "Interest rate", value: "From 7.50%* p.a." },
      { label: "Loan amount", value: "Up to 90% of future rentals" },
      { label: "Tenure", value: "Aligned to the lease, typically up to 15 years" },
    ],
    about:
      "Get a lump sum upfront against a registered lease on commercial or retail space. The tenant's rent services the EMI, so your own cash flow stays untouched.",
    features: [
      "For registered commercial and retail leases",
      "Sharper pricing when the tenant is a corporate or MNC covenant",
      "Rent routed through an escrow arrangement",
      "Refinance of an LRD loan you already have",
    ],
    eligibility: [
      "A registered lease with sufficient residual tenure to run",
      "A dependable tenant with an uninterrupted rent-payment record",
      "Property title held in the borrower's own name",
    ],
    documents: [KYC, "Registered lease deed and rent receipts", PROPERTY_DOCS],
  },
  {
    slug: "balance-transfer",
    icon: ArrowLeftRight,
    title: "Balance Transfer",
    tagline: "Same loan, smaller bill.",
    group: "Property Finance",
    facts: [
      { label: "Use case", value: "Home / LAP / Business" },
      { label: "Benefit", value: "Lower rate + top-up" },
      { label: "Savings", value: "Shown in writing first" },
    ],
    about:
      "We lay your current loan next to sharper offers from other lenders, in writing, before you decide — then run the switch end to end, adding a top-up if your profile qualifies.",
    features: [
      "Better pricing available on home, LAP and business loans",
      "Top-up sanctioned at mortgage-linked pricing, not personal-loan pricing",
      "Trim the EMI or shorten the tenure — you choose which",
      "We liaise with your existing lender on foreclosure and transfer",
    ],
    eligibility: [
      "A track record of on-time EMIs for at least the last 12 months",
      "No recent bounces or delayed payments on the existing loan",
      "Income documents and property papers ready for a fresh credit review",
    ],
    documents: [
      KYC,
      INCOME,
      "Current loan statement, sanction letter and foreclosure letter",
      PROPERTY_DOCS,
    ],
  },
  {
    slug: "dlod",
    icon: TrendingDown,
    title: "Drop-Line Overdraft (Secured)",
    tagline: "A credit line that shrinks as you pay.",
    group: "Property Finance",
    facts: [
      { label: "Structure", value: "Secured drop-line overdraft" },
      { label: "LTV", value: "Up to 80% of property value" },
      { label: "Interest rate", value: "From 9.75%* p.a. on the drawn balance" },
    ],
    about:
      "A property-backed limit that steps down over the tenure, with interest charged only on what you actually draw — useful when your cash needs rise and fall through the year.",
    features: [
      "Secured against a residential or commercial property",
      "The sanctioned limit reduces on a monthly or quarterly schedule",
      "Typically no prepayment penalty on the reducing portion",
      "Suited to seasonal or uneven cash requirements",
    ],
    eligibility: [
      "Clear, marketable title in the applicant's name",
      "At least two years of business or professional income",
      "A steady banking track record over the preceding 12 months",
    ],
    documents: [KYC, BUSINESS_DOCS, PROPERTY_DOCS],
  },

  {
    slug: "business-loan",
    icon: Briefcase,
    title: "Business Loan",
    tagline: "Fuel for your next big move.",
    group: "Business Growth",
    facts: [
      { label: "Loan amount", value: "Up to ₹5 Cr" },
      { label: "Interest rate", value: "From 14%* p.a." },
      { label: "Tenure", value: "12 — 60 months" },
      { label: "Collateral", value: "Not required" },
      { label: "Minimum ticket size", value: "₹2 Lakh" },
    ],
    about:
      "Quick, collateral-free funding for expansion, inventory, hiring or new equipment, assessed mainly off your GST filings and bank statements rather than a stack of audited financials — so it moves fast.",
    features: [
      "No collateral or third-party guarantee needed",
      "Assessed on GST returns, banking and financial statements",
      "Multiple lenders run in parallel to find the best fit",
      "Funds disbursed in as few as 5 working days",
    ],
    eligibility: [
      "At least 2 years of business vintage",
      "Annual turnover of roughly ₹40 lakh or above",
      "The last two years of ITR and GST returns filed on time",
    ],
    documents: [KYC, BUSINESS_DOCS, "Proof of business ownership"],
  },
  {
    slug: "cgtmse",
    icon: ShieldCheck,
    title: "CGTMSE Funding",
    tagline: "Government-backed funding, no collateral.",
    group: "Business Growth",
    facts: [
      { label: "Loan amount", value: "Up to ₹10 Cr" },
      { label: "Interest rate", value: "From 9%* p.a." },
      { label: "Security", value: "Government guarantee cover" },
    ],
    about:
      "Loans covered under the CGTMSE guarantee scheme, letting young MSMEs borrow meaningful amounts without pledging property or bringing in a guarantor.",
    features: [
      "Structured as a term loan, a working capital limit, or a blend of both",
      "No collateral and no third-party guarantor required",
      "Guarantee fee (typically under 1.5% p.a. of the sanctioned amount) explained upfront",
      "Open to manufacturing, trading and service enterprises",
    ],
    eligibility: [
      "Udyam-registered as a micro or small enterprise",
      "At least 1 year of operating history",
      "A workable business/project plan and a clean credit history",
    ],
    documents: [KYC, BUSINESS_DOCS, "Udyam registration and project report"],
  },
  {
    slug: "unsecured-term-loan",
    icon: Handshake,
    title: "Unsecured Term Loan",
    tagline: "Fixed EMIs, zero security.",
    group: "Business Growth",
    facts: [
      { label: "Loan amount", value: "Up to ₹5 Cr" },
      { label: "Interest rate", value: "From 11.50%* p.a." },
      { label: "Tenure", value: "12 — 60 months" },
      { label: "Security", value: "None" },
    ],
    about:
      "A larger, fully-financials-based term loan for businesses with clean audited numbers — fixed tenure, fixed EMI, priced off your bank turnover and filings rather than a quick GST-only scorecard.",
    features: [
      "Fixed EMI on a defined repayment schedule",
      "Offers benchmarked across several lenders before you commit",
      "Part-prepayment allowed once the initial lock-in ends",
      "Top-up available after a clean repayment run",
    ],
    eligibility: [
      "At least 3 years in business with audited or CA-certified financials",
      "Consistent bank credits through the preceding 12 months",
      "A CIBIL score of 680 or higher for the business and its promoters",
    ],
    documents: [KYC, BUSINESS_DOCS],
  },
  {
    slug: "unsecured-dod",
    icon: Gauge,
    title: "Unsecured DOD",
    tagline: "Standby cash, no EMI from day one.",
    group: "Business Growth",
    facts: [
      { label: "Structure", value: "Unsecured drop-line overdraft" },
      { label: "Limit", value: "Up to ₹2 Cr" },
      { label: "Interest rate", value: "From 13.50%* p.a. on the drawn balance" },
    ],
    about:
      "A collateral-free overdraft that tapers down over its tenure — draw when the business needs it, repay when it doesn't, and pay interest only on the running balance.",
    features: [
      "Draw and repay as often as needed",
      "Interest charged only on the amount outstanding",
      "The limit steps down over the tenure",
      "No property or asset pledge required",
    ],
    eligibility: [
      "At least 3 years of business operations",
      "A healthy average balance across current accounts",
      "No adverse remarks on existing credit facilities",
    ],
    documents: [KYC, BUSINESS_DOCS],
  },
  {
    slug: "project-funding",
    icon: HardHat,
    title: "Project Funding",
    tagline: "Finance that builds as you build.",
    group: "Business Growth",
    facts: [
      { label: "Funding", value: "Up to 75% of project cost" },
      { label: "Interest rate", value: "From 12%* p.a." },
      { label: "Use", value: "Construction & development" },
      { label: "Release", value: "Stage by stage" },
    ],
    about:
      "Construction and development funding sized to approvals, project cost and projected sales, released in stages as work progresses rather than as one upfront cheque.",
    features: [
      "Residential, commercial and industrial developments",
      "Combined land-and-construction funding where needed",
      "Repayment structured through escrow and sales receivables",
      "Legal, technical and valuation checks coordinated on your behalf",
    ],
    eligibility: [
      "Sanctioned building plans and clear, marketable land title",
      "The developer's own contribution already committed to the project",
      "A track record of completed projects is preferred, though not always mandatory",
    ],
    documents: [
      KYC,
      "Project report with cost and sales projections",
      "Approvals, plans and land title documents",
    ],
  },

  {
    slug: "working-capital",
    icon: RefreshCw,
    title: "Working Capital",
    tagline: "Keep the wheels of business turning.",
    group: "Cash Flow & Trade",
    facts: [
      { label: "Facility", value: "OD / CC / BD" },
      { label: "Limit", value: "Linked to turnover" },
      { label: "Renewal", value: "Annual" },
    ],
    about:
      "Limits sized around your stock, receivables and payroll cycle — new, enhanced, or simply taken over from your current bank if the terms there have gone stale.",
    features: [
      "Cash credit, overdraft and bill-discounting limits",
      "Enhancement or takeover of a limit you already run",
      "Stock and debtor statements prepared and filed for you",
      "Consortium or multiple-banking arrangements structured where useful",
    ],
    eligibility: [
      "At least 3 years of business operations",
      "Annual turnover of ₹2 Cr or above, with audited financial statements",
      "A visible working-capital gap in the balance sheet",
    ],
    documents: [KYC, BUSINESS_DOCS, "Audited financials and stock / debtor statements"],
  },
  {
    slug: "cash-credit",
    icon: Banknote,
    title: "Cash Credit",
    tagline: "Draw, repay, repeat — as business demands.",
    group: "Cash Flow & Trade",
    facts: [
      { label: "Facility", value: "Revolving credit limit" },
      { label: "Limit", value: "Linked to stock & debtors" },
      { label: "Security", value: "Hypothecation of current assets" },
    ],
    about:
      "A revolving limit against your stock and receivables — draw it down, sell through, repay, and draw again as your operating cycle repeats.",
    features: [
      "Drawing power reassessed monthly against stock statements",
      "Interest charged only on the utilised portion",
      "Renewed annually, with headroom to scale as turnover grows",
      "Works alongside term loans and other trade facilities",
    ],
    eligibility: [
      "A trading or manufacturing business with a regular stock cycle",
      "Audited financials and GST filings in good order",
      "Satisfactory conduct on existing current accounts",
    ],
    documents: [KYC, BUSINESS_DOCS, "Stock and debtor ageing statements"],
  },
  {
    slug: "overdraft-limit",
    icon: CreditCard,
    title: "Overdraft Limit",
    tagline: "A safety cushion on your current account.",
    group: "Cash Flow & Trade",
    facts: [
      { label: "Facility", value: "Account overdraft" },
      { label: "Interest", value: "Charged on usage only" },
      { label: "Security", value: "Secured or unsecured" },
    ],
    about:
      "A pre-approved cushion on your current account that absorbs the short gap between paying suppliers and getting paid by customers.",
    features: [
      "Available secured (property, FDs, securities) or unsecured",
      "No EMI — just interest on the running balance each month",
      "Live and usable as soon as it's sanctioned",
      "Reviewed and renewed on an annual cycle",
    ],
    eligibility: [
      "An active current account with regular credits",
      "Documented proof of business or professional income",
      "A clean credit report with no ongoing defaults",
    ],
    documents: [KYC, BUSINESS_DOCS],
  },
  {
    slug: "bank-guarantee",
    icon: Stamp,
    title: "Bank Guarantee",
    tagline: "Win the contract with your bank behind you.",
    group: "Cash Flow & Trade",
    facts: [
      { label: "Type", value: "Financial / Performance" },
      { label: "Use", value: "Tenders, contracts, deposits" },
      { label: "Margin", value: "10% – 25% cash margin" },
    ],
    about:
      "Your bank's written commitment to the counterparty that you'll pay or perform — so you can bid for and sign contracts with confidence.",
    features: [
      "Financial and performance guarantees",
      "Bid bonds, EMDs, security deposits and advance-payment BGs",
      "Commission and margin requirement negotiated on your behalf",
      "Fast issuance and amendments when terms change",
    ],
    eligibility: [
      "An existing or freshly opened banking relationship",
      "Margin money or suitable collateral to back the guarantee",
      "Tender or contract documents supporting the request",
    ],
    documents: [KYC, BUSINESS_DOCS, "Tender / contract copy and BG format"],
  },
  {
    slug: "letter-of-credit",
    icon: ScrollText,
    title: "Letter of Credit",
    tagline: "Suppliers paid on time, your cash kept free.",
    group: "Cash Flow & Trade",
    facts: [
      { label: "Type", value: "Inland / Import LC" },
      { label: "Use", value: "Supplier & trade payments" },
      { label: "Usance", value: "Sight or up to 180 days" },
    ],
    about:
      "A bank-backed payment promise to your supplier — it usually gets you better credit terms without tying up your own working capital.",
    features: [
      "Inland and import LCs",
      "Sight or usance structures",
      "Buyer's credit tie-ups arranged where available",
      "Support with documentation and resolving discrepancies",
    ],
    eligibility: [
      "An established trading or manufacturing business",
      "A sanctioned LC limit, or full cash margin in its absence",
      "A supplier contract or proforma invoice on file",
    ],
    documents: [KYC, BUSINESS_DOCS, "Proforma invoice and supplier agreement"],
  },
  {
    slug: "working-capital-term-loan",
    icon: CalendarRange,
    title: "Working Capital Term Loan",
    tagline: "Reset a stretched cash cycle.",
    group: "Cash Flow & Trade",
    facts: [
      { label: "Structure", value: "Term loan on WC gap" },
      { label: "Tenure", value: "12 — 60 months" },
      { label: "Use", value: "Cycle reset & consolidation" },
    ],
    about:
      "Converts an overdrawn or irregular working-capital account into a term loan with a repayment schedule your cash flow can actually sustain.",
    features: [
      "Regularises stretched cash-credit or overdraft accounts",
      "Consolidates several short-term dues into one facility",
      "Moratorium period available with select lenders",
      "Can run alongside a freshly sanctioned working-capital limit",
    ],
    eligibility: [
      "A viable business with an identifiable working-capital gap",
      "Two years of audited financial statements",
      "Promoter contribution where the lender asks for one",
    ],
    documents: [KYC, BUSINESS_DOCS, "Audited financials and existing sanction letters"],
  },

  {
    slug: "personal-loan",
    icon: Wallet,
    title: "Personal Loan",
    tagline: "Money for life's plans, minus the paperwork.",
    group: "Personal & Education",
    facts: [
      { label: "Interest rate", value: "From 10.49%* p.a." },
      { label: "Loan amount", value: "Up to ₹1 Cr" },
      { label: "Tenure", value: "12 — 60 months" },
      { label: "Disbursal", value: "As fast as 48 hours" },
      { label: "Minimum ticket size", value: "₹2 Lakh" },
    ],
    about:
      "Collateral-free funds for a wedding, medical bill, travel or clearing costlier debt — sized so the EMI actually fits your monthly budget, not just your eligibility limit.",
    features: [
      "No security or guarantor needed",
      "Minimal paperwork, handled fully online",
      "Refinance to a lower rate later if one becomes available",
      "Open to both salaried and self-employed applicants",
    ],
    eligibility: [
      "Between roughly 21 and 60 years of age",
      "Salaried take-home from about ₹25,000/month, or 2 years of ITR if self-employed",
      "A CIBIL score of 700+ for the best rate; scores from the mid-600s may still qualify at a higher rate",
    ],
    documents: [KYC, INCOME],
  },
  {
    slug: "loan-against-securities",
    icon: TrendingUp,
    title: "Loan Against Securities",
    tagline: "Borrow on your portfolio, stay invested.",
    group: "Personal & Education",
    facts: [
      { label: "LTV", value: "Up to 80% on debt instruments, 50% on listed shares" },
      { label: "Structure", value: "Overdraft limit" },
      { label: "Interest rate", value: "From 9.75%* p.a." },
    ],
    about:
      "Pledge shares, bonds or insurance policies for an overdraft line instead of selling them — your holdings stay invested and keep compounding while the limit sits in reserve.",
    features: [
      "Shares, bonds, insurance policies and debt instruments accepted",
      "The limit moves with the value of the pledged portfolio",
      "No EMI — interest applies only to what's drawn",
      "Same-day setup on lender-approved securities",
    ],
    eligibility: [
      "Approved securities held in the applicant's own name",
      "A demat account with a recognised depository",
      "Resident Indian, 21 years or older",
    ],
    documents: [KYC, "Demat holding statement", "Portfolio / policy documents"],
  },
  {
    slug: "loan-against-mutual-funds",
    icon: PieChart,
    title: "Loan Against Mutual Funds",
    tagline: "Borrow against your units, without redeeming them.",
    group: "Personal & Education",
    facts: [
      { label: "LTV", value: "Up to 85% on debt funds, 75% on equity funds" },
      { label: "Structure", value: "Overdraft limit" },
      { label: "Interest rate", value: "From 9.99%* p.a." },
    ],
    about:
      "A lien gets marked on your mutual fund units through the RTA (CAMS or KFintech) — your SIPs and investments carry on undisturbed while you draw against the units as an overdraft.",
    features: [
      "Equity, debt and hybrid schemes accepted as collateral",
      "Units remain invested and keep earning returns",
      "No EMI — interest applies only to the amount drawn",
      "Digital lien marking, usually completed the same day",
    ],
    eligibility: [
      "Mutual fund units held in the applicant's own name",
      "Scheme falls on the lender's approved AMC/fund list",
      "Resident Indian, 18 years or older",
    ],
    documents: [KYC, "Mutual fund statement / CAS", "Folio details"],
  },
  {
    slug: "professional-loan",
    icon: Stethoscope,
    title: "Professional Loan",
    tagline: "Built for doctors, CAs and other qualified professionals.",
    group: "Personal & Education",
    facts: [
      { label: "Loan amount", value: "Up to ₹75 lakh" },
      { label: "Interest rate", value: "From 10.99%* p.a." },
      { label: "Tenure", value: "12 — 84 months" },
      { label: "Collateral", value: "Usually unsecured" },
    ],
    about:
      "An unsecured facility built specifically for doctors, CAs, architects and other registered professionals — for setting up or expanding a practice, buying equipment, or covering working capital — typically priced better than a plain personal loan on the strength of the qualification.",
    features: [
      "Preferential pricing tied to your professional registration",
      "No collateral for most ticket sizes",
      "Usable for practice setup, equipment purchase or working capital",
      "Faster turnaround with lighter documentation than a business loan",
    ],
    eligibility: [
      "A recognised professional qualification or registration (MBBS, CA, CS, architecture, engineering, etc.)",
      "A minimum number of years in active practice, as set by the lender",
      "A credit score in the low-to-mid 700s is typical for the better rate slabs",
    ],
    documents: [KYC, INCOME, "Professional registration / degree certificate"],
  },
  {
    slug: "education-loan",
    icon: GraduationCap,
    title: "Education Loan",
    tagline: "Invest in the degree, not the worry.",
    group: "Personal & Education",
    facts: [
      { label: "Loan amount", value: "Up to ₹1.5 Cr" },
      { label: "Interest rate", value: "From 8.15%* p.a." },
      { label: "Tenure", value: "Up to 15 years" },
      { label: "Benefit", value: "Section 80E deduction" },
      { label: "Minimum ticket size", value: "₹8 Lakh" },
    ],
    about:
      "Funding for study in India or abroad — tuition, living costs, travel and equipment. Collateral-backed loans get the lowest rates; unsecured loans for study abroad are priced higher but move faster.",
    features: [
      "Available with or without collateral, depending on the amount",
      "No EMIs during the course, plus a moratorium/grace period after",
      "Interest is tax-deductible in full under Section 80E, with no upper cap",
      "Support with university and visa-related documentation",
    ],
    eligibility: [
      "Confirmed admission to a recognised institution in India or abroad",
      "An earning co-applicant based in India",
      "Collateral typically expected once the loan crosses the unsecured threshold, especially for overseas study",
    ],
    documents: [
      KYC,
      "Admission letter and fee structure",
      "Co-applicant income proof",
      "Academic records",
    ],
  },

  {
    slug: "new-car-loan",
    icon: Car,
    title: "New Car Loan",
    tagline: "From showroom to driveway, fully funded.",
    group: "Vehicles & Special Cases",
    facts: [
      { label: "Funding", value: "Up to 100% on-road" },
      { label: "Tenure", value: "12 — 84 months" },
      { label: "Interest rate", value: "From 8.75%* p.a." },
    ],
    about:
      "On-road financing for new cars, with the dealer paperwork — invoice, insurance, RTO — handled from quotation through to delivery.",
    features: [
      "Funding up to 100% of the on-road price for eligible profiles",
      "Dealer and insurance coordination handled on your behalf",
      "Sharper pricing for salaried applicants with a stable employer",
      "Fast sanction on light documentation",
    ],
    eligibility: [
      "Typically 21–65 years old, with a regular, documented income",
      "At least 1 year in the current job or business",
      "A CIBIL score of 650+ is usually enough; 750+ unlocks the sharpest rates",
    ],
    documents: [KYC, INCOME, "Dealer's vehicle quotation"],
  },
  {
    slug: "used-car-loan",
    icon: CarFront,
    title: "Used Car Loan",
    tagline: "A great pre-owned car, sensibly financed.",
    group: "Vehicles & Special Cases",
    facts: [
      { label: "Funding", value: "Up to 90% of valuation" },
      { label: "Vehicle age", value: "Up to 8 years at loan end" },
      { label: "Interest rate", value: "From 10.25%* p.a." },
      { label: "Tenure", value: "12 — 60 months" },
    ],
    about:
      "Financing for a second-hand car bought from a dealer or a private seller, with an independent valuation arranged so both sides know the car is fairly priced.",
    features: [
      "Dealer or private-seller purchases both financed",
      "Independent valuation arranged by the lender",
      "RC transfer and hypothecation endorsement handled",
      "Rate reflects the car's age, condition and valuation",
    ],
    eligibility: [
      "Around 21–65 years old, with income that can be documented",
      "The car falls within the lender's maximum age limit",
      "A clean RC, with no lapses in the insurance history",
    ],
    documents: [KYC, INCOME, "RC copy, insurance and valuation report"],
  },
  {
    slug: "car-refinance",
    icon: Repeat,
    title: "Car Refinance",
    tagline: "Your car can fund your next plan.",
    group: "Vehicles & Special Cases",
    facts: [
      { label: "Funding", value: "Up to 150% of valuation for strong profiles" },
      { label: "Interest rate", value: "From 12.50%* p.a." },
      { label: "Use", value: "Any personal or business need" },
      { label: "Tenure", value: "12 — 60 months" },
    ],
    about:
      "Raise cash against a car you already own free and clear — strong income profiles can sometimes borrow above the car's current valuation — and keep driving it while you repay.",
    features: [
      "Financing on a car with no existing loan against it",
      "Top-up above valuation available to well-qualified applicants",
      "Takeover of an existing car loan also possible",
      "Fast processing on minimal paperwork",
    ],
    eligibility: [
      "Car registered in the applicant's own name",
      "No existing loan on the car, or one that can be taken over cleanly",
      "Documented income and a credit report free of active defaults",
    ],
    documents: [KYC, INCOME, "RC, insurance and any current loan statement"],
  },
  {
    slug: "private-funding",
    icon: KeyRound,
    title: "Private Funding",
    tagline: "Fast money when the clock is ticking.",
    group: "Vehicles & Special Cases",
    facts: [
      { label: "Security", value: "No property required" },
      { label: "Interest rate", value: "2% – 3% per month" },
      { label: "Repayment", value: "EMI charged twice a month" },
      { label: "Eligibility", value: "Self-employed, turnover up to ₹30 Cr" },
    ],
    about:
      "Short-term, unsecured funds from vetted private lenders for self-employed profiles that need cash fast — every rate and repayment term set out in writing before you commit, since private credit is priced well above bank rates.",
    features: [],
    eligibility: [],
    documents: [],
    minimalDisclosure: true,
  },
];

export const PRODUCT_GROUPS: {
  name: ProductGroup;
  heading: string;
  description: string;
}[] = [
  {
    name: "Property Finance",
    heading: "Make your property work for you.",
    description:
      "Everything from a first home purchase to unlocking equity already sitting in a property you own.",
  },
  {
    name: "Business Growth",
    heading: "Funding that keeps pace with your business.",
    description:
      "Whether it's working capital fast or collateral-free funding to scale, structured for businesses actually moving.",
  },
  {
    name: "Cash Flow & Trade",
    heading: "Money moving, operations humming.",
    description:
      "The day-to-day financial plumbing — credit lines, guarantees and limits that keep operations from stalling.",
  },
  {
    name: "Personal & Education",
    heading: "For life's big moments.",
    description:
      "For the moments that don't wait — a medical bill, a degree abroad, or funds against what you've already invested.",
  },
  {
    name: "Vehicles & Special Cases",
    heading: "Wheels, bridges and urgent deadlines.",
    description:
      "A new car, a better rate on the one you're driving, or funding when a deadline won't wait.",
  },
];

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
