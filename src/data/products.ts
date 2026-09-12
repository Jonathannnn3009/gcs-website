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
};

const KYC = "KYC (PAN, Aadhaar, address proof)";
const INCOME = "Income proof (salary slips, ITR, bank statements)";
const BUSINESS_DOCS = "Business proof (GST returns, ITR with financials, 12-month banking)";
const PROPERTY_DOCS = "Property papers (agreement, title chain, tax receipts)";

export const PRODUCTS: Product[] = [
  {
    slug: "home-loan",
    icon: Home,
    title: "Home Loan",
    tagline: "The keys to your home, without the runaround.",
    group: "Property Finance",
    facts: [
      { label: "Interest rate", value: "From 8.10%* p.a." },
      { label: "Loan amount", value: "Up to ₹10 Cr" },
      { label: "Tenure", value: "Up to 30 years" },
    ],
    about:
      "Whether it's a ready flat, an under-construction project, a plot or a self-build, we put your file in front of the lender best placed to approve it — even if another bank has said no before.",
    features: [
      "Choice of floating or fixed rates",
      "Pre-approved sanctions so you can close deals fast",
      "Switch lenders later with a top-up",
      "Home-loan-linked overdraft to cut interest",
      "Joint-applicant and tax-saving structuring (80C & 24(b))",
    ],
    eligibility: [
      "Resident Indian aged 21–65",
      "Salaried with ₹30,000+ monthly income, or self-employed with 2 years of ITR",
      "Credit score around 700+ (lower scores reviewed individually)",
    ],
    documents: [KYC, INCOME, PROPERTY_DOCS],
  },
  {
    slug: "loan-against-property",
    icon: Building2,
    title: "Loan Against Property",
    tagline: "Your property's value, working for you.",
    group: "Property Finance",
    facts: [
      { label: "Loan amount", value: "Up to 80% of property value" },
      { label: "Interest rate", value: "From 8.75%* p.a." },
      { label: "Tenure", value: "Up to 20 years" },
    ],
    about:
      "Borrow a large sum against a residential, commercial or industrial property — you keep ownership and keep using it.",
    features: [
      "Homes, shops, offices and factories accepted as security",
      "Income, banking-based and GST-based programmes",
      "Top-up on a mortgage you already have",
      "Choose a term loan or a reducing overdraft",
    ],
    eligibility: [
      "Property owner, up to 70 years at loan end",
      "Clean, marketable title with full chain documents",
      "Repayment capacity shown through income or bank credits",
    ],
    documents: [KYC, INCOME, PROPERTY_DOCS],
  },
  {
    slug: "lease-rental-discounting",
    icon: Store,
    title: "Lease Rental Discounting",
    tagline: "Rent today becomes capital today.",
    group: "Property Finance",
    facts: [
      { label: "Interest rate", value: "From 8.50%* p.a." },
      { label: "Loan amount", value: "Up to 90% of rentals" },
      { label: "Tenure", value: "Aligned to lease term" },
    ],
    about:
      "Get a lump sum upfront against a registered lease. The rent pays the EMI, so your own cash flow is untouched.",
    features: [
      "For registered commercial and retail leases",
      "Best terms with corporate or MNC tenants",
      "Rent routed through an escrow account",
      "Refinance of an existing LRD loan",
    ],
    eligibility: [
      "Registered lease with enough time left to run",
      "Reliable tenant with a clean rent record",
      "Property title in the borrower's name",
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
      "We put your current loan side by side with better offers in writing, then handle the switch end to end — adding a top-up if you qualify.",
    features: [
      "Lower rates on home, LAP and business loans",
      "Top-up priced like a mortgage",
      "Cut your EMI or your tenure — you decide",
      "We coordinate with your current lender",
    ],
    eligibility: [
      "At least 12 months of on-time repayments",
      "No recent bounces or missed EMIs",
      "Income and property papers ready for a fresh review",
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
      { label: "Structure", value: "Secured drop-line OD" },
      { label: "LTV", value: "Up to 80% of property" },
      { label: "Interest", value: "Only on what you use" },
    ],
    about:
      "A property-backed limit that reduces step by step over the tenure, with interest charged only on the amount you draw.",
    features: [
      "Secured on residential or commercial property",
      "Limit steps down monthly or quarterly",
      "Usually no prepayment charges",
      "Handy for seasonal or uneven cash needs",
    ],
    eligibility: [
      "Owner with clear title",
      "2+ years of business or professional income",
      "Healthy banking track record",
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
      { label: "Tenure", value: "12 — 60 months" },
      { label: "Collateral", value: "Not required" },
    ],
    about:
      "Money for expansion, inventory, hiring or new equipment — shaped around how cash actually moves through your business.",
    features: [
      "No collateral needed",
      "GST, banking and financials-based programmes",
      "Several lenders processed in parallel",
      "Funds in as few as 5 working days",
    ],
    eligibility: [
      "Business running for 2+ years",
      "Annual turnover of ₹40 lakh or more",
      "Last 2 years of ITR and GST filed",
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
      "Loans covered by the CGTMSE guarantee scheme, so young MSMEs can borrow meaningful amounts without pledging property.",
    features: [
      "Term loan, working capital or both",
      "No collateral or third-party guarantor",
      "Guarantee fee explained before you sign",
      "For manufacturing, trading and service units",
    ],
    eligibility: [
      "Udyam-registered micro or small enterprise",
      "At least 1 year in business",
      "Workable project plan and clean credit history",
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
      { label: "Tenure", value: "12 — 60 months" },
      { label: "Security", value: "None" },
    ],
    about:
      "A business loan with a set tenure and predictable EMIs, priced on your bank turnover and filed financials.",
    features: [
      "Fixed EMI with a clear repayment schedule",
      "Offers from several lenders compared first",
      "Part-prepay once the lock-in ends",
      "Top-up after a good repayment run",
    ],
    eligibility: [
      "2+ years in business",
      "Steady bank credits over the last 12 months",
      "Credit score of 700+ for the business and promoters",
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
      { label: "Structure", value: "Drop-line overdraft" },
      { label: "Limit", value: "Up to ₹2 Cr" },
      { label: "Interest", value: "Only on what you use" },
    ],
    about:
      "An unsecured overdraft that reduces over time — draw when you need to, and pay interest only on what you use.",
    features: [
      "Draw and repay freely",
      "Interest only on the amount used",
      "Limit tapers over the tenure",
      "No collateral",
    ],
    eligibility: [
      "3+ years in business",
      "Healthy average bank balance",
      "Clean record on existing loans",
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
      { label: "Use", value: "Construction & development" },
      { label: "Release", value: "Stage by stage" },
    ],
    about:
      "Construction and development funding based on approvals, project cost and expected sales, released stage by stage.",
    features: [
      "Residential, commercial and industrial projects",
      "Land plus construction combinations",
      "Repayment through escrow and sales receivables",
      "Legal, technical and valuation teams coordinated",
    ],
    eligibility: [
      "Sanctioned plans and clear land title",
      "Developer's own share already invested",
      "Completed projects on record preferred",
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
      "Limits sized to fund your stock, receivables and payroll through each cycle — including taking over or enhancing a limit you already have.",
    features: [
      "Cash credit, overdraft and bill discounting",
      "Enhancement or takeover of existing limits",
      "Stock and debtor statements handled for you",
      "Consortium and multiple-bank setups",
    ],
    eligibility: [
      "2+ years in business",
      "Audited financials for 2 years",
      "A working-capital gap visible in the balance sheet",
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
      "A revolving limit backed by your stock and receivables that you can use and refill as often as your cycle needs.",
    features: [
      "Drawing power updated every month",
      "Interest only on what's drawn",
      "Renewed yearly, with room to grow",
      "Pairs with term loans and trade lines",
    ],
    eligibility: [
      "Trading or manufacturing business with regular stock turnover",
      "Audited financials and GST filings in order",
      "Good conduct on current accounts",
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
      { label: "Interest", value: "Only on what you use" },
      { label: "Security", value: "Secured or unsecured" },
    ],
    about:
      "A pre-approved limit on your current account that covers short gaps between paying suppliers and getting paid.",
    features: [
      "Backed by property, FDs or securities — or unsecured",
      "No EMI; just monthly interest",
      "Ready to use once sanctioned",
      "Reviewed and renewed every year",
    ],
    eligibility: [
      "Active current account with regular credits",
      "Proof of business or professional income",
      "Clean credit report",
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
      { label: "Margin", value: "From 10%" },
    ],
    about:
      "Your bank's written promise to the other party that you'll pay or perform — so you can bid and sign with confidence.",
    features: [
      "Financial and performance guarantees",
      "Bid bonds, EMDs, security deposits and advance-payment BGs",
      "Commission and margin negotiated for you",
      "Fast issue and amendments",
    ],
    eligibility: [
      "An existing or new bank relationship",
      "Margin money or suitable collateral",
      "Tender or contract papers backing the request",
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
      "A bank-backed payment promise to your supplier, helping you get better credit terms without tying up your own funds.",
    features: [
      "Inland and import LCs",
      "Sight and usance options",
      "Buyer's credit tie-ups where available",
      "Help with documents and discrepancies",
    ],
    eligibility: [
      "Established trading or manufacturing business",
      "Sanctioned LC limit or full margin",
      "Supplier contract or proforma invoice",
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
      { label: "Tenure", value: "24 — 84 months" },
      { label: "Use", value: "Cycle reset & consolidation" },
    ],
    about:
      "Turns an overdrawn or irregular working-capital account into a term loan with a repayment plan your cash flow can handle.",
    features: [
      "Regularises stretched CC and OD accounts",
      "Rolls several short-term dues into one",
      "Moratorium available with select lenders",
      "Can sit alongside a fresh working-capital limit",
    ],
    eligibility: [
      "Viable business with a clear working-capital gap",
      "2 years of audited financials",
      "Promoter contribution where needed",
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
      { label: "Loan amount", value: "Up to ₹50 lakh" },
      { label: "Tenure", value: "12 — 72 months" },
      { label: "Disbursal", value: "As fast as 48 hours" },
    ],
    about:
      "Collateral-free funds for a wedding, medical bills, travel, a home makeover or clearing debts — sized so the EMI sits comfortably.",
    features: [
      "No security or guarantor",
      "Light documentation, fully digital",
      "Switch to a lower rate later",
      "For salaried and self-employed",
    ],
    eligibility: [
      "Aged 21–60",
      "₹25,000+ monthly take-home (salaried) or 2 years of ITR (self-employed)",
      "Credit score around 700+",
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
      { label: "LTV", value: "Up to 80% on debt, 50% on equity" },
      { label: "Structure", value: "Overdraft limit" },
      { label: "Interest", value: "Only on what you use" },
    ],
    about:
      "Pledge shares, mutual funds, bonds or insurance policies for an overdraft limit — your investments stay put and keep growing.",
    features: [
      "Shares, mutual funds, bonds and policies accepted",
      "Limit adjusts as your portfolio moves",
      "No EMI — pay monthly interest",
      "Same-day setup on approved securities",
    ],
    eligibility: [
      "Approved securities held in your name",
      "Demat account with a recognised depository",
      "Resident Indian, 18+",
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
      { label: "LTV", value: "Up to 80% on debt, 50% on equity funds" },
      { label: "Structure", value: "Overdraft limit" },
      { label: "Interest", value: "Only on what you use" },
    ],
    about:
      "A lien is marked on your mutual fund units through the RTA (CAMS/KFintech) — you keep your investment and SIPs running while unlocking an overdraft against it.",
    features: [
      "Equity, debt and hybrid schemes accepted",
      "Units stay invested and continue earning returns",
      "No EMI — pay monthly interest on the drawn amount",
      "Digital lien marking, usually same-day",
    ],
    eligibility: [
      "Mutual fund units held in your own name",
      "Approved AMC/scheme list of the lender",
      "Resident Indian, 18+",
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
      { label: "Tenure", value: "12 — 84 months" },
      { label: "Collateral", value: "Usually unsecured" },
    ],
    about:
      "A dedicated unsecured product for doctors, CAs, architects, engineers and other qualified professionals — for setting up or expanding a practice, equipment, or working capital, usually priced better than a standard personal loan.",
    features: [
      "Preferential rates for qualified professionals",
      "No collateral for most ticket sizes",
      "Practice setup, equipment or working capital",
      "Fast turnaround with minimal documentation",
    ],
    eligibility: [
      "Recognised professional degree/registration (MBBS, CA, CS, architect, engineer, etc.)",
      "Minimum years in practice as per lender policy",
      "Credit score around 700+",
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
      { label: "Tenure", value: "Up to 15 years" },
      { label: "Benefit", value: "Section 80E deduction" },
    ],
    about:
      "Funding for study in India or overseas — tuition, living costs, travel and equipment — with or without collateral.",
    features: [
      "With or without collateral",
      "No EMIs during the course plus a grace period",
      "Tax deduction on interest under Section 80E",
      "Help with university and visa paperwork",
    ],
    eligibility: [
      "Confirmed admission to a recognised institution",
      "Earning co-applicant based in India",
      "Collateral for larger overseas amounts",
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
      "On-road finance for new cars and commercial vehicles, with the dealer paperwork handled from quote to delivery.",
    features: [
      "Up to 100% of the on-road price",
      "Dealer and insurance coordination",
      "Sharp pricing for salaried buyers",
      "Quick sanction, little paperwork",
    ],
    eligibility: [
      "Aged 21–65 with regular income",
      "At least 1 year in your job or business",
      "Credit score around 700+",
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
      { label: "Vehicle age", value: "Up to 10 years at loan end" },
      { label: "Tenure", value: "12 — 60 months" },
    ],
    about:
      "Loans for second-hand cars from dealers or private sellers, with an independent valuation arranged for you.",
    features: [
      "Dealer or private-seller purchases",
      "Independent valuation arranged",
      "RC transfer and hypothecation handled",
      "Rates that reflect the car's condition",
    ],
    eligibility: [
      "Aged 21–65 with provable income",
      "Car within the lender's age limits",
      "Clean RC and insurance history",
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
      { label: "Funding", value: "Up to 150% of valuation" },
      { label: "Use", value: "Any personal or business need" },
      { label: "Tenure", value: "12 — 60 months" },
    ],
    about:
      "Raise money against a car you already own — strong profiles can even borrow above its value — and keep driving it.",
    features: [
      "Loan on a car with no existing loan",
      "Top-up above valuation for strong profiles",
      "Take over an existing car loan",
      "Quick processing, minimal documents",
    ],
    eligibility: [
      "Car registered in your name",
      "No existing loan, or one ready to be taken over",
      "Provable income and a clean credit report",
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
      { label: "Turnaround", value: "3 — 7 days" },
      { label: "Security", value: "Property backed" },
      { label: "Use", value: "Bridge & short-term needs" },
    ],
    about:
      "Short-term, property-backed funds from vetted private lenders for bridge needs, auction buys or urgent settlements — every term explained in writing first.",
    features: [
      "Quick sanction and release",
      "Bridge until a bank takes over",
      "Flexible on profile and paperwork",
      "Exit route agreed at sanction",
    ],
    eligibility: [
      "Marketable property as security",
      "Clear plan to repay or refinance",
      "Ownership papers ready for checks",
    ],
    documents: [KYC, PROPERTY_DOCS, "Purpose note and repayment plan"],
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
      "Home loans, loans against property, rental discounting, balance transfers and property-backed overdrafts.",
  },
  {
    name: "Business Growth",
    heading: "Funding that keeps pace with your business.",
    description:
      "Term loans, collateral-free CGTMSE cover, overdrafts and project finance for businesses on the move.",
  },
  {
    name: "Cash Flow & Trade",
    heading: "Money moving, operations humming.",
    description:
      "Cash credit, overdrafts, bank guarantees, letters of credit and term loans that steady your working capital.",
  },
  {
    name: "Personal & Education",
    heading: "For life's big moments.",
    description:
      "Personal loans, loans against your investments and education funding for India or abroad.",
  },
  {
    name: "Vehicles & Special Cases",
    heading: "Wheels, bridges and urgent deadlines.",
    description:
      "New and used car loans, car refinance and fast private funding when time is short.",
  },
];

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
