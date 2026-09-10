export type ProductGroup =
  | "Home & Property"
  | "Business Funding"
  | "Working Capital & Trade"
  | "Personal & Lifestyle"
  | "Vehicle & Special Situations";

export type Product = {
  slug: string;
  code: string;
  title: string;
  tagline: string;
  group: ProductGroup;
  facts: { label: string; value: string }[];
  about: string;
  features: string[];
  eligibility: string[];
  documents: string[];
};

const KYC = "KYC (PAN, Aadhaar, address proof)";
const INCOME = "Income proof (salary slips, ITR, bank statements)";
const BUSINESS_DOCS = "Business proof (GST returns, ITR with financials, 12-month banking)";
const PROPERTY_DOCS = "Property documents (agreement, chain of title, tax receipts)";

export const PRODUCTS: Product[] = [
  {
    slug: "home-loan",
    code: "HL",
    title: "Home Loan",
    tagline: "Structured approvals, even in complex profiles.",
    group: "Home & Property",
    facts: [
      { label: "Interest rate", value: "From 8.10%* p.a." },
      { label: "Loan amount", value: "Up to ₹10 Cr" },
      { label: "Tenure", value: "Up to 30 years" },
    ],
    about:
      "Home loans for ready-to-move, under-construction, plot purchase or self-construction. We match your profile with the lender most likely to approve your case — including files other intermediaries have already returned.",
    features: [
      "Floating and fixed rate options",
      "Pre-approved sanctions for fast property closures",
      "Balance transfer with top-up",
      "Smart Saver / Max Gain overdraft linkage",
      "Joint applications and tax-benefit structuring under 80C & 24(b)",
    ],
    eligibility: [
      "Indian resident, age 21 — 65",
      "Stable income — salaried (₹30,000+/month) or self-employed (2+ years ITR)",
      "CIBIL score 700+ preferred (lower considered case-by-case)",
    ],
    documents: [KYC, INCOME, PROPERTY_DOCS],
  },
  {
    slug: "loan-against-property",
    code: "LAP",
    title: "Loan Against Property",
    tagline: "Turn your property into powerful capital.",
    group: "Home & Property",
    facts: [
      { label: "Loan amount", value: "Up to 80% of property value" },
      { label: "Interest rate", value: "From 8.75%* p.a." },
      { label: "Tenure", value: "Up to 20 years" },
    ],
    about:
      "Raise large-ticket funding against residential, commercial or industrial property while retaining full ownership and use of the asset.",
    features: [
      "Residential, commercial and industrial collateral accepted",
      "Income, banking and GST programme cases",
      "Top-up on an existing mortgage",
      "Term loan or drop-line overdraft structure",
    ],
    eligibility: [
      "Property owner, age 21 — 70 at maturity",
      "Clear and marketable title with complete chain documents",
      "Demonstrable repayment capacity through income or banking",
    ],
    documents: [KYC, INCOME, PROPERTY_DOCS],
  },
  {
    slug: "lease-rental-discounting",
    code: "LRD",
    title: "Lease Rental Discounting",
    tagline: "Borrow against your rental income — keep the asset.",
    group: "Home & Property",
    facts: [
      { label: "Interest rate", value: "From 8.50%* p.a." },
      { label: "Loan amount", value: "Up to 90% of rentals" },
      { label: "Tenure", value: "Aligned to lease term" },
    ],
    about:
      "Convert a registered lease into an upfront lump sum. The loan is serviced by the rent itself, so your cash flow stays intact.",
    features: [
      "Funding against registered commercial or retail leases",
      "Corporate and MNC tenant profiles preferred",
      "Escrow-based repayment structure",
      "Refinance of an existing LRD facility",
    ],
    eligibility: [
      "Registered lease with adequate residual term",
      "Creditworthy tenant with clean rent-credit history",
      "Clear property title in the borrower's name",
    ],
    documents: [KYC, "Registered lease deed and rent receipts", PROPERTY_DOCS],
  },
  {
    slug: "balance-transfer",
    code: "BT",
    title: "Balance Transfer",
    tagline: "Lower your cost. Upgrade your loan.",
    group: "Home & Property",
    facts: [
      { label: "Use case", value: "Home / LAP / Business" },
      { label: "Benefit", value: "Lower rate + top-up" },
      { label: "Savings", value: "Verified before you move" },
    ],
    about:
      "We run a written savings comparison on your outstanding loan, then manage the full transfer — including a structured top-up where you are eligible.",
    features: [
      "Rate reduction on home, LAP and business loans",
      "Top-up at mortgage pricing",
      "Tenure or EMI reduction, your choice",
      "End-to-end coordination with the existing lender",
    ],
    eligibility: [
      "12+ months of clean repayment on the existing loan",
      "No recent bounces or DPDs",
      "Property and income documents available for fresh appraisal",
    ],
    documents: [
      KYC,
      INCOME,
      "Existing loan statement, sanction letter and foreclosure quote",
      PROPERTY_DOCS,
    ],
  },
  {
    slug: "dlod",
    code: "DLOD",
    title: "Drop-Line Overdraft (Secured)",
    tagline: "Flexible credit that reduces as you repay.",
    group: "Home & Property",
    facts: [
      { label: "Structure", value: "Secured drop-line OD" },
      { label: "LTV", value: "Up to 80% of property" },
      { label: "Interest", value: "Charged on usage only" },
    ],
    about:
      "A sanctioned limit against property that steps down over the tenure. You pay interest only on what you actually use.",
    features: [
      "Limit against residential or commercial property",
      "Monthly or quarterly drop-line schedule",
      "No prepayment penalty on most lenders",
      "Ideal for lumpy or seasonal cash needs",
    ],
    eligibility: [
      "Property owner with clear title",
      "Business or professional income with 2+ years of vintage",
      "Satisfactory banking conduct",
    ],
    documents: [KYC, BUSINESS_DOCS, PROPERTY_DOCS],
  },

  {
    slug: "business-loan",
    code: "BL",
    title: "Business Loan",
    tagline: "Funding designed for business growth.",
    group: "Business Funding",
    facts: [
      { label: "Loan amount", value: "Up to ₹5 Cr" },
      { label: "Tenure", value: "12 — 60 months" },
      { label: "Collateral", value: "Not required" },
    ],
    about:
      "Growth capital for expansion, inventory, hiring or equipment — structured around your cash-flow cycle rather than a generic template.",
    features: [
      "Unsecured funding with no collateral",
      "GST, banking and balance-sheet programmes",
      "Multi-lender parallel processing",
      "Disbursal in as little as 5 working days",
    ],
    eligibility: [
      "Business vintage of 2+ years",
      "Annual turnover above ₹40 lakh",
      "Filed ITR and GST returns for the last 2 years",
    ],
    documents: [KYC, BUSINESS_DOCS, "Ownership proof of the business entity"],
  },
  {
    slug: "cgtmse",
    code: "CGTMSE",
    title: "CGTMSE Funding",
    tagline: "Collateral-free funding for business growth.",
    group: "Business Funding",
    facts: [
      { label: "Loan amount", value: "Up to ₹10 Cr" },
      { label: "Interest rate", value: "From 9%* p.a." },
      { label: "Security", value: "Government guarantee cover" },
    ],
    about:
      "Credit guaranteed by the CGTMSE scheme, letting young MSMEs raise substantial funding without pledging an asset.",
    features: [
      "Term loan and working-capital combinations",
      "No collateral or third-party guarantee",
      "Guarantee fee handled and explained upfront",
      "Suitable for manufacturing, trading and services units",
    ],
    eligibility: [
      "Registered micro or small enterprise (Udyam)",
      "Business vintage of 1+ year",
      "Viable project report and clean credit history",
    ],
    documents: [KYC, BUSINESS_DOCS, "Udyam registration and project report"],
  },
  {
    slug: "unsecured-term-loan",
    code: "UTL",
    title: "Unsecured Term Loan",
    tagline: "Business funding without collateral.",
    group: "Business Funding",
    facts: [
      { label: "Loan amount", value: "Up to ₹5 Cr" },
      { label: "Tenure", value: "12 — 60 months" },
      { label: "Security", value: "None" },
    ],
    about:
      "A fixed-tenure business loan with predictable EMIs, priced against your banking turnover and filed financials.",
    features: [
      "Fixed EMI with a clear amortisation schedule",
      "Multiple lenders compared before login",
      "Part-prepayment options after the lock-in",
      "Top-up on satisfactory track record",
    ],
    eligibility: [
      "Business vintage of 2+ years",
      "Consistent banking credits across 12 months",
      "CIBIL 700+ for the entity and promoters",
    ],
    documents: [KYC, BUSINESS_DOCS],
  },
  {
    slug: "unsecured-dod",
    code: "DOD",
    title: "Unsecured DOD",
    tagline: "Flexible capital, available when you need it.",
    group: "Business Funding",
    facts: [
      { label: "Structure", value: "Drop-line overdraft" },
      { label: "Limit", value: "Up to ₹2 Cr" },
      { label: "Interest", value: "On utilisation only" },
    ],
    about:
      "An unsecured drop-line overdraft that gives you a standby limit without locking you into a full EMI from day one.",
    features: [
      "Withdraw and repay as required",
      "Interest only on the utilised amount",
      "Limit steps down over the sanctioned tenure",
      "No collateral required",
    ],
    eligibility: [
      "Business vintage of 3+ years",
      "Healthy average bank balance",
      "Clean repayment record on existing facilities",
    ],
    documents: [KYC, BUSINESS_DOCS],
  },
  {
    slug: "project-funding",
    code: "PROJ",
    title: "Project Funding",
    tagline: "Structured capital for builders and large projects.",
    group: "Business Funding",
    facts: [
      { label: "Funding", value: "Up to 75% of project cost" },
      { label: "Use", value: "Construction & development" },
      { label: "Structure", value: "Milestone-linked disbursal" },
    ],
    about:
      "Construction and development finance structured against approvals, cost of project and expected receivables, with disbursal tied to milestones.",
    features: [
      "Residential, commercial and industrial projects",
      "Land plus construction funding combinations",
      "Escrow and receivable-based repayment",
      "Coordination with legal, technical and valuation teams",
    ],
    eligibility: [
      "Approved plans and clear land title",
      "Promoter contribution already invested",
      "Track record of completed projects preferred",
    ],
    documents: [
      KYC,
      "Project report with cost and revenue workings",
      "Approvals, plans and land title documents",
    ],
  },

  {
    slug: "working-capital",
    code: "WC",
    title: "Working Capital",
    tagline: "Smart liquidity for business continuity.",
    group: "Working Capital & Trade",
    facts: [
      { label: "Facility", value: "OD / CC / BD" },
      { label: "Limit", value: "Linked to turnover" },
      { label: "Renewal", value: "Annual" },
    ],
    about:
      "Assessed limits that keep stock, debtors and payroll funded through the operating cycle — including enhancement or takeover of an existing bank limit.",
    features: [
      "Cash credit, overdraft and bill discounting",
      "Limit enhancement and takeover from existing banks",
      "Stock and debtor statement handling",
      "Consortium and multiple-banking arrangements",
    ],
    eligibility: [
      "Business vintage of 2+ years",
      "Audited financials for the last 2 years",
      "Working-capital gap demonstrable from the balance sheet",
    ],
    documents: [KYC, BUSINESS_DOCS, "Audited financials and stock / debtor statements"],
  },
  {
    slug: "cash-credit",
    code: "CC",
    title: "Cash Credit",
    tagline: "A revolving limit that funds your day-to-day operations.",
    group: "Working Capital & Trade",
    facts: [
      { label: "Facility", value: "Revolving credit limit" },
      { label: "Limit", value: "Linked to stock & debtors" },
      { label: "Security", value: "Hypothecation of current assets" },
    ],
    about:
      "A revolving limit secured against stock and receivables, drawn and repaid as often as your cycle demands.",
    features: [
      "Drawing power reviewed monthly",
      "Interest charged only on the drawn balance",
      "Renewable annually with enhancement",
      "Works alongside term loans and trade facilities",
    ],
    eligibility: [
      "Trading or manufacturing entity with regular stock movement",
      "Audited financials and GST compliance",
      "Satisfactory conduct of existing accounts",
    ],
    documents: [KYC, BUSINESS_DOCS, "Stock and debtor ageing statements"],
  },
  {
    slug: "overdraft-limit",
    code: "OD",
    title: "Overdraft Limit",
    tagline: "Withdraw beyond your balance, up to a sanctioned ceiling.",
    group: "Working Capital & Trade",
    facts: [
      { label: "Facility", value: "Account overdraft" },
      { label: "Interest", value: "Charged on usage only" },
      { label: "Security", value: "Secured or unsecured" },
    ],
    about:
      "A standby cushion attached to your current account for short gaps between payables and collections.",
    features: [
      "Secured against property, FD or securities — or unsecured",
      "No EMI; service interest monthly",
      "Instant availability once sanctioned",
      "Annual renewal with limit review",
    ],
    eligibility: [
      "Operating current account with steady credits",
      "Business or professional income proof",
      "Clean bureau record",
    ],
    documents: [KYC, BUSINESS_DOCS],
  },
  {
    slug: "bank-guarantee",
    code: "BG",
    title: "Bank Guarantee",
    tagline: "The bank's assurance that backs your commitments.",
    group: "Working Capital & Trade",
    facts: [
      { label: "Type", value: "Financial / Performance" },
      { label: "Use", value: "Tenders, contracts, deposits" },
      { label: "Margin", value: "From 10%" },
    ],
    about:
      "A written undertaking from your bank that assures the beneficiary of payment or performance, so you can bid and contract with confidence.",
    features: [
      "Financial and performance guarantees",
      "Bid bond, EMD, security deposit and advance payment BGs",
      "Competitive commission and margin negotiation",
      "Quick issuance and amendment handling",
    ],
    eligibility: [
      "Existing or new banking relationship",
      "Margin money or acceptable collateral",
      "Contract or tender documents supporting the request",
    ],
    documents: [KYC, BUSINESS_DOCS, "Tender / contract copy and BG format"],
  },
  {
    slug: "letter-of-credit",
    code: "LC",
    title: "Letter of Credit",
    tagline: "Secure supplier and trade transactions with confidence.",
    group: "Working Capital & Trade",
    facts: [
      { label: "Type", value: "Inland / Import LC" },
      { label: "Use", value: "Supplier & trade payments" },
      { label: "Usance", value: "Sight or up to 180 days" },
    ],
    about:
      "Bank-backed payment assurance to your supplier, letting you negotiate better credit terms without blocking your own cash.",
    features: [
      "Inland and import letters of credit",
      "Sight and usance structures",
      "Buyer's credit tie-ups where applicable",
      "Documentation and discrepancy support",
    ],
    eligibility: [
      "Established trading or manufacturing operations",
      "Assessed LC limit or full margin",
      "Supplier contract or proforma invoice",
    ],
    documents: [KYC, BUSINESS_DOCS, "Proforma invoice and supplier agreement"],
  },
  {
    slug: "working-capital-term-loan",
    code: "WCTL",
    title: "Working Capital Term Loan",
    tagline: "Term funding to repair a stretched operating cycle.",
    group: "Working Capital & Trade",
    facts: [
      { label: "Structure", value: "Term loan on WC gap" },
      { label: "Tenure", value: "24 — 84 months" },
      { label: "Use", value: "Cycle correction & consolidation" },
    ],
    about:
      "Converts an overdrawn or irregular working-capital position into a structured term loan with a repayment schedule your cash flow can carry.",
    features: [
      "Regularises stretched CC / OD accounts",
      "Consolidates multiple short-term obligations",
      "Moratorium options on select lenders",
      "Can be combined with a fresh WC limit",
    ],
    eligibility: [
      "Viable business with an identifiable working-capital gap",
      "Audited financials for the last 2 years",
      "Promoter contribution where required",
    ],
    documents: [KYC, BUSINESS_DOCS, "Audited financials and existing sanction letters"],
  },

  {
    slug: "personal-loan",
    code: "PL",
    title: "Personal Loan",
    tagline: "Fast liquidity, structured for affordability.",
    group: "Personal & Lifestyle",
    facts: [
      { label: "Loan amount", value: "Up to ₹50 lakh" },
      { label: "Tenure", value: "12 — 72 months" },
      { label: "Disbursal", value: "As fast as 48 hours" },
    ],
    about:
      "Collateral-free funding for weddings, medical costs, travel, renovation or debt consolidation — sized so the EMI actually fits.",
    features: [
      "No collateral or guarantor",
      "Minimal documentation, digital processing",
      "Balance transfer at lower rates",
      "Salaried and self-employed profiles",
    ],
    eligibility: [
      "Age 21 — 60",
      "Net monthly income of ₹25,000+ (salaried) or 2 years ITR (self-employed)",
      "CIBIL score 700+ preferred",
    ],
    documents: [KYC, INCOME],
  },
  {
    slug: "loan-against-securities",
    code: "LAS",
    title: "Loan Against Securities",
    tagline: "Unlock funds without selling investments.",
    group: "Personal & Lifestyle",
    facts: [
      { label: "LTV", value: "Up to 80% on debt, 50% on equity" },
      { label: "Structure", value: "Overdraft limit" },
      { label: "Interest", value: "On usage only" },
    ],
    about:
      "Pledge shares, mutual funds, bonds or insurance policies for an overdraft limit while your portfolio stays invested and keeps compounding.",
    features: [
      "Shares, mutual funds, bonds and policies accepted",
      "Limit revised as portfolio value moves",
      "No EMI — service interest monthly",
      "Same-day setup on approved securities",
    ],
    eligibility: [
      "Portfolio in approved securities held in your name",
      "Demat account with a recognised depository",
      "Age 18+, Indian resident",
    ],
    documents: [KYC, "Demat holding statement", "Portfolio / policy documents"],
  },
  {
    slug: "education-loan",
    code: "EL",
    title: "Education Loan",
    tagline: "Structured funding for future success.",
    group: "Personal & Lifestyle",
    facts: [
      { label: "Loan amount", value: "Up to ₹1.5 Cr" },
      { label: "Tenure", value: "Up to 15 years" },
      { label: "Benefit", value: "Section 80E deduction" },
    ],
    about:
      "Secured and unsecured education funding for study in India or abroad, covering tuition, living costs, travel and equipment.",
    features: [
      "Collateral and non-collateral options",
      "Moratorium through the course plus grace period",
      "Tax benefit on interest under Section 80E",
      "Support with university and visa documentation",
    ],
    eligibility: [
      "Confirmed admission to a recognised institution",
      "Indian resident co-applicant with income proof",
      "Collateral for higher-ticket overseas courses",
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
    code: "NCL",
    title: "New Car Loan",
    tagline: "Drive out with up to 100% on-road funding.",
    group: "Vehicle & Special Situations",
    facts: [
      { label: "Funding", value: "Up to 100% on-road" },
      { label: "Tenure", value: "12 — 84 months" },
      { label: "Interest rate", value: "From 8.75%* p.a." },
    ],
    about:
      "On-road funding for new passenger and commercial vehicles, with dealer coordination handled from quote to delivery.",
    features: [
      "Up to 100% on-road price funding",
      "Dealer and insurance coordination",
      "Attractive pricing for salaried profiles",
      "Quick sanction with minimal paperwork",
    ],
    eligibility: [
      "Age 21 — 65 with regular income",
      "Salaried or self-employed with 1+ year of stability",
      "CIBIL score 700+ preferred",
    ],
    documents: [KYC, INCOME, "Vehicle quotation from the dealer"],
  },
  {
    slug: "used-car-loan",
    code: "UCL",
    title: "Used Car Loan",
    tagline: "Pre-owned, properly financed.",
    group: "Vehicle & Special Situations",
    facts: [
      { label: "Funding", value: "Up to 90% of valuation" },
      { label: "Vehicle age", value: "Up to 10 years at maturity" },
      { label: "Tenure", value: "12 — 60 months" },
    ],
    about:
      "Funding for pre-owned cars bought from dealers or private sellers, with independent valuation arranged for you.",
    features: [
      "Dealer and private-sale purchases",
      "Independent valuation support",
      "RC transfer and hypothecation handling",
      "Competitive rates against the vehicle's condition",
    ],
    eligibility: [
      "Age 21 — 65 with verifiable income",
      "Vehicle within lender age norms",
      "Clean RC and insurance history",
    ],
    documents: [KYC, INCOME, "RC copy, insurance and valuation report"],
  },
  {
    slug: "car-refinance",
    code: "CRF",
    title: "Car Refinance",
    tagline: "Raise cash against the car you already own.",
    group: "Vehicle & Special Situations",
    facts: [
      { label: "Funding", value: "Up to 150% of valuation" },
      { label: "Use", value: "Any personal or business need" },
      { label: "Tenure", value: "12 — 60 months" },
    ],
    about:
      "Loan against an owned vehicle — including top-up over the current valuation for strong profiles — while you keep driving the car.",
    features: [
      "Loan against an unencumbered vehicle",
      "Top-up over valuation for eligible profiles",
      "Takeover of an existing vehicle loan",
      "Fast processing with minimal documents",
    ],
    eligibility: [
      "Vehicle registered in the applicant's name",
      "No outstanding hypothecation, or a takeover-ready loan",
      "Verifiable income and clean bureau",
    ],
    documents: [KYC, INCOME, "RC, insurance and existing loan statement if any"],
  },
  {
    slug: "private-funding",
    code: "PF",
    title: "Private Funding",
    tagline: "When timelines are tight and the bank route is closed.",
    group: "Vehicle & Special Situations",
    facts: [
      { label: "Turnaround", value: "3 — 7 days" },
      { label: "Security", value: "Property backed" },
      { label: "Use", value: "Bridge & short-term needs" },
    ],
    about:
      "Short-term, property-backed funding from vetted private lenders for bridge situations, auction purchases or urgent settlements — with terms explained in writing before you commit.",
    features: [
      "Fast sanction and disbursal",
      "Bridge finance until bank takeover",
      "Flexible on profile and documentation",
      "Exit plan structured at the time of sanction",
    ],
    eligibility: [
      "Marketable property offered as security",
      "Clear repayment or takeover exit plan",
      "Ownership documents available for verification",
    ],
    documents: [KYC, PROPERTY_DOCS, "Purpose note and exit plan"],
  },
];

export const PRODUCT_GROUPS: {
  name: ProductGroup;
  heading: string;
  description: string;
}[] = [
  {
    name: "Home & Property",
    heading: "Funding against walls and titles.",
    description:
      "Home loans, LAP, lease rental discounting, balance transfers and drop-line overdrafts against property.",
  },
  {
    name: "Business Funding",
    heading: "Capital sized to your business cycle.",
    description:
      "Term loans, CGTMSE collateral-free funding, drop-line overdrafts and project funding for growing businesses.",
  },
  {
    name: "Working Capital & Trade",
    heading: "Keep operations liquid and moving.",
    description:
      "Cash credit, overdraft limits, bank guarantees, letters of credit and working-capital term loans.",
  },
  {
    name: "Personal & Lifestyle",
    heading: "Personal goals, properly funded.",
    description:
      "Personal loans, loans against securities and education funding for India and overseas.",
  },
  {
    name: "Vehicle & Special Situations",
    heading: "Vehicles, bridges and urgent files.",
    description:
      "New and used car loans, car refinance, and private funding for time-critical requirements.",
  },
];

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
