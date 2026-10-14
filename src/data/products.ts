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

export type ChecklistIntakeField =
  | { key: string; label: string; type: "text"; placeholder?: string; format?: "amount" }
  | { key: string; label: string; type: "select"; options: string[] }
  | { key: string; label: string; type: "date" };

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
  /** A short highlighted line shown above the USPs on a minimal-disclosure product's page. */
  pullQuote?: string;
  /** Extra questions asked in the checklist-download form, on top of name/phone — per Mahesh's intake list for these products. */
  checklistIntake?: ChecklistIntakeField[];
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
      "A home loan helps you buy a ready flat, a flat in an under-construction project, or a plot, or build your own house. We look at your income and documents, then compare options from different Banks and NBFCs that may suit your profile. If one lender delays or does not approve your file, we can explore other lenders that may be a better fit.",
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
      "A CIBIL score near 700 or above may help you get a better rate; lower scores are reviewed case by case",
    ],
    documents: [KYC, PROPERTY_DOCS, PHOTOS],
    documentCategories: APPLICANT_DOC_CATEGORIES,
    checklistIntake: [
      {
        key: "loanRequirement",
        label: "Loan Requirement",
        type: "select",
        options: ["Home Loan", "Balance Transfer", "Top-Up", "Other"],
      },
      {
        key: "propertyType",
        label: "Property Type",
        type: "select",
        options: ["Builder Purchase", "Resale"],
      },
      { key: "possessionDate", label: "Possession Date", type: "date" },
      {
        key: "loanAmount",
        label: "Loan Amount Required",
        type: "text",
        placeholder: "e.g. 50,00,000",
        format: "amount",
      },
    ],
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
      "A loan against property lets you borrow money using a residential, commercial or industrial property that you already own. You can use it to grow your business, combine other loans, pay a medical bill or meet other needs. Lenders may have rules on how the money can be used. You keep ownership of the property and can continue to use it while you repay.",
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
      "Lease rental discounting gives you a lump sum today against the rent you will receive from a registered lease on commercial or retail space. The tenant's rent is used to pay the EMI, so your own cash flow is not needed for it.",
    features: [
      "For registered commercial and retail leases",
      "Pricing may be better when the tenant is a well-known company",
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
      "A balance transfer means moving your current loan to another lender that may offer better terms. We put your existing loan next to offers from other lenders, in writing, so you can compare before you decide. If you choose to switch, we guide you through the whole process. A top-up may also be possible if your profile qualifies.",
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
      "This is a limit against your property that reduces step by step over the loan period. You pay interest only on the amount you actually use. It can suit you if your need for cash goes up and down during the year.",
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
      "A business loan without collateral for needs such as expansion, stock, hiring or new equipment. Lenders mainly look at your GST returns and bank statements, so you may not need a full set of audited financials. This can make the process quicker.",
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
      "These are loans covered by the CGTMSE guarantee scheme. The scheme helps young MSMEs borrow without giving property as security or arranging a guarantor. The amount you can borrow depends on the lender and the scheme rules.",
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
      "A term loan without collateral for businesses with clean, audited financials. The loan has a fixed period and a fixed EMI. The lender decides the amount based on your bank turnover and filings, not only a quick GST check.",
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
      "An overdraft without collateral where the limit reduces over the loan period. Use the money when your business needs it and repay when you can. You pay interest only on the amount you have used.",
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
      "Funding for construction and development projects. The amount depends on your approvals, project cost and expected sales. The money is released in stages as the work moves ahead, not all at once.",
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
      "Working capital is the money a business needs for its day-to-day running. The limit is set around your stock, the payments you are waiting for from customers, and your salary and payment cycle. You can get a new limit, increase an existing one, or move your account from your current bank if its terms no longer suit you.",
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
      "A limit that you can use again and again, backed by your stock and the payments due from your customers. Draw money when you need it, repay it as sales come in, and draw again as your business cycle repeats.",
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
      "An overdraft is a ready limit on your current account. It helps cover the short gap between paying your suppliers and receiving payment from your customers.",
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
      "A bank guarantee is a written promise from the bank to the other party that you will pay or complete the work as agreed. It helps you bid for and sign contracts with more confidence.",
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
      "A letter of credit is a payment promise given by the bank to your supplier. It may help you get better credit terms without using your own working capital.",
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
      "This turns an overdrawn or irregular working-capital account into a term loan with a fixed repayment plan. The plan is set so that it matches what your cash flow can handle.",
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
      "A personal loan needs no collateral. You can use it for a wedding, a medical bill, travel, or to clear a more costly debt. We help you choose an amount and EMI that fit your monthly budget, not just the maximum you are eligible for.",
    features: [
      "No security or guarantor needed",
      "Minimal paperwork, handled fully online",
      "Refinance to a lower rate later if one becomes available",
      "Open to both salaried and self-employed applicants",
    ],
    eligibility: [
      "Between roughly 21 and 60 years of age",
      "Salaried take-home from about ₹25,000/month, or 2 years of ITR if self-employed",
      "A CIBIL score of 700+ may help you get a better rate; scores from the mid-600s may still be considered at a higher rate",
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
      "You can pledge shares, bonds or insurance policies to get an overdraft limit, instead of selling them. Your investments stay in place, and the limit is there when you need it. Lenders accept only certain securities and set their own limits.",
    features: [
      "Shares, bonds, insurance policies and debt instruments accepted",
      "The limit moves with the value of the pledged portfolio",
      "No EMI — interest applies only to what's drawn",
      "Quick setup on lender-approved securities",
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
      "The lender marks a lien on your mutual fund units through the registrar (CAMS or KFintech). Your SIPs and investments continue as before, and you can draw money against the units as an overdraft.",
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
      "A loan without collateral for doctors, CAs, architects and other registered professionals. You can use it to start or grow a practice, buy equipment or meet working capital needs. Depending on the lender's policy, the terms may be better than a regular personal loan because of your professional qualification.",
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
      "Funding for studies in India or abroad, covering tuition, living costs, travel and equipment. Loans with collateral usually have lower interest rates. Loans without collateral for studying abroad usually cost more but can be quicker to process.",
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
    checklistIntake: [
      {
        key: "loanAmount",
        label: "Loan Amount Required",
        type: "text",
        placeholder: "e.g. 15,00,000",
        format: "amount",
      },
      { key: "courseName", label: "Course Name", type: "text" },
      {
        key: "courseDuration",
        label: "Course Duration",
        type: "text",
        placeholder: "e.g. 2 years",
      },
      { key: "courseStartDate", label: "Course Start Date", type: "date" },
      { key: "universityName", label: "University Name", type: "text" },
      { key: "country", label: "Country", type: "text" },
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
      "Financing for the on-road price of a new car. We help with the dealer paperwork, such as the invoice, insurance and RTO, from quotation to delivery.",
    features: [
      "Funding up to 100% of the on-road price for eligible profiles",
      "Dealer and insurance coordination handled on your behalf",
      "Pricing may be better for salaried applicants with a stable employer",
      "Fast sanction on light documentation",
    ],
    eligibility: [
      "Typically 21–65 years old, with a regular, documented income",
      "At least 1 year in the current job or business",
      "A CIBIL score of 650+ is usually considered; 750+ may help you get better rates",
    ],
    documents: [KYC, INCOME, "Dealer's vehicle quotation"],
    checklistIntake: [
      {
        key: "purchaseFrom",
        label: "Purchase From",
        type: "select",
        options: ["Dealer", "Resale"],
      },
      {
        key: "loanAmount",
        label: "Loan Amount Required",
        type: "text",
        placeholder: "e.g. 8,00,000",
        format: "amount",
      },
    ],
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
      "Financing for a second-hand car from a dealer or a private seller. We arrange an independent valuation so both sides can check that the price is fair.",
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
    checklistIntake: [
      {
        key: "purchaseFrom",
        label: "Purchase From",
        type: "select",
        options: ["Dealer", "Resale"],
      },
      {
        key: "loanAmount",
        label: "Loan Amount Required",
        type: "text",
        placeholder: "e.g. 8,00,000",
        format: "amount",
      },
    ],
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
      "Raise money against a car you already own and have fully paid for. In some cases, strong income profiles may be able to borrow more than the car's current value. You keep driving the car while you repay.",
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
    checklistIntake: [
      {
        key: "loanAmount",
        label: "Loan Amount Required",
        type: "text",
        placeholder: "e.g. 5,00,000",
        format: "amount",
      },
    ],
  },
  {
    slug: "private-funding",
    icon: KeyRound,
    title: "Private Funding",
    tagline: "Fast money when the clock is ticking.",
    group: "Vehicles & Special Cases",
    facts: [
      { label: "Security", value: "No property required" },
      { label: "Interest rate", value: "From ~2.70% per month" },
      { label: "Turnaround", value: "24 – 48 hours" },
      { label: "Repayment", value: "EMI charged twice a month" },
      { label: "Eligibility", value: "Self-employed, turnover up to ₹30 Cr" },
    ],
    about:
      "Short-term funds without collateral from private lenders, for self-employed people who need cash quickly. Private credit usually costs much more than bank loans, so we share every rate and repayment term in writing before you decide.",
    pullQuote:
      "Whatever funding amount you need, we aim for a quick 24–48 hour turnaround. The amount and the timing depend on your business profile and documents.",
    features: [
      "Full funding amount — whatever your eligible business requirement calls for",
      "Fast turnaround — funding arranged within 24–48 hours",
      "Rate and terms evaluated on your business profile, turnover and profitability",
      "Structured without collateral, subject to the case and profile",
      "Flexible EMI/repayment terms, discussed and structured to your need",
      "Interest is never cut upfront — you receive the full agreed funding amount",
      "Processing fee and documentation charges as per the applicable structure",
    ],
    eligibility: [],
    documents: [],
    minimalDisclosure: true,
  },
];

/** Every product, including any staff have hidden. PRODUCTS itself holds only the visible ones. */
const ALL_PRODUCTS: Product[] = [...PRODUCTS];

/**
 * Hides loan products staff switched off in the CRM. Edits the PRODUCTS list in place so every
 * page, menu and link that reads it drops them at once; their pages become "not found".
 */
export function setHiddenProducts(hiddenSlugs: string[]) {
  const hidden = new Set(hiddenSlugs);
  PRODUCTS.length = 0;
  PRODUCTS.push(...ALL_PRODUCTS.filter((p) => !hidden.has(p.slug)));
}

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
