import {
  ArrowLeftRight,
  Banknote,
  Briefcase,
  Building2,
  CalendarRange,
  Car,
  CarFront,
  Cog,
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
  Truck,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type ProductGroup =
  | "Property Finance"
  | "Business Growth"
  | "Cash Flow & Trade"
  | "Personal, Education, Vehicle & Other Loans";

/** Show a question only when another question has one of these answers (and is itself showing). */
export type ShowWhen = { key: string; values: string[] };

export type ChecklistIntakeField =
  | { key: string; label: string; type: "text"; placeholder?: string; format?: "amount"; showWhen?: ShowWhen }
  | { key: string; label: string; type: "select"; options: string[]; showWhen?: ShowWhen }
  | { key: string; label: string; type: "date"; showWhen?: ShowWhen };

/** What a lender may charge besides interest: shown as a small two-column table on the loan page. */
export type ChargesInfo = {
  intro: string;
  rows: { label: string; value: string }[];
  note?: string;
};

/** Extra guidance for applicants who live abroad. */
export type NriInfo = {
  heading: string;
  intro: string;
  points: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
  note: string;
};

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
  /** Fees and other charges, in plain words, where the loan has them. */
  charges?: ChargesInfo;
  /** A fuller section for NRI applicants, on loans that lenders offer to them. */
  nri?: NriInfo;
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
  "Last 2 years' ITR and Form 26AS, if your income is taxable",
  "Details of existing loans, with EMIs and statements",
];
const SELF_EMPLOYED_DOCS = [
  "Last 3 years' ITR with computation of income",
  "Last 3 years' audited financials — P&L and balance sheet, where applicable",
  "Last 12 months' bank statements (savings and current account)",
  "Business proof — GST registration, shop licence, partnership deed or MOA/AOA as applicable",
  "GST returns for the last 12 months, where registered",
  "Details of existing loans, with EMIs and statements",
];
const NRI_DOCS = [
  "Valid passport, and your visa, work permit or residence permit (OCI or PIO card, if you hold one)",
  "Employment contract or appointment letter, and your last 3 to 6 months' salary slips from abroad",
  "Last 6 months' overseas salary-account statements, and last 12 months' NRE/NRO account statements",
  "Self-employed NRIs: business registration or licence, last 2 years' tax returns and financial statements",
  "Last filed income tax return of your country of residence (for example W-2, P60), and Indian ITRs if you file them",
  "Overseas address proof and your permanent address proof in India",
  "Details of existing loans, in India or abroad",
  "A resident Indian co-applicant's KYC (PAN and address proof), if the lender asks for one",
  "Power of Attorney (POA) in favour of a resident Indian, if you cannot be in India to sign",
];
export const APPLICANT_CATEGORY_LABELS = ["Salaried", "Self-Employed", "NRI"];

const APPLICANT_DOC_CATEGORIES = [
  {
    label: "Salaried",
    description:
      "You draw a fixed monthly salary from an employer, in a private company, a government job or a public-sector unit. Lenders mainly check your salary slips, Form 16 and the salary credits in your bank account, and how long you have been with your employer. A steady job and a regular record of salary credits usually make the process simpler.",
    items: SALARIED_DOCS,
  },
  {
    label: "Self-Employed",
    description:
      "You run a business, practise a profession such as medicine, accountancy or architecture, or work as a freelancer. Lenders look at your ITRs, your financial statements, your GST returns and your business bank statements to judge how steady your income is. Returns filed on time and accounts in order make approval easier.",
    items: SELF_EMPLOYED_DOCS,
  },
  {
    label: "NRI",
    description:
      "You live and work outside India, for example in the Gulf, the UK, the US or Singapore. Lenders check your passport, visa, your job or business abroad and your NRE or NRO account, and some ask for a resident Indian co-applicant. The paperwork can be completed from abroad with a Power of Attorney. See the NRI section below for how it works.",
    items: NRI_DOCS,
  },
];

/** Salaried and self-employed only, for loans lenders do not usually offer to NRIs. */
const RESIDENT_DOC_CATEGORIES = APPLICANT_DOC_CATEGORIES.filter((c) => c.label !== "NRI");

const PROPRIETOR_DOCS = [
  "Proprietor's KYC: PAN, Aadhaar and address proof",
  "Business proof: GST registration, Udyam, shop licence or equivalent",
  "Last 3 years' ITR with computation of income",
  "Last 3 years' financial statements (P&L and balance sheet), audited where applicable",
  "Last 12 months' current and savings account statements",
  "GST returns for the last 12 months, where registered",
  "Details of existing loans, with EMIs and statements",
];
const PARTNERSHIP_DOCS = [
  "Partnership deed or LLP agreement, and registration proof",
  "PAN of the firm or LLP, and KYC of every partner",
  "Last 3 years' ITR of the firm and of the partners",
  "Last 3 years' audited financial statements of the firm",
  "Last 12 months' bank statements of the firm",
  "GST returns for the last 12 months",
  "Details of existing loans, with EMIs and statements",
];
const COMPANY_DOCS = [
  "Certificate of incorporation, MOA and AOA",
  "Company PAN, and KYC of every director and promoter",
  "List of directors and the shareholding pattern",
  "Last 3 years' audited financial statements and ITR of the company",
  "Last 12 months' current account statements",
  "GST returns for the last 12 months",
  "Board resolution authorising the loan, and details of existing loans",
];
/** For business loans, where the paperwork follows how the business is set up. */
const BUSINESS_DOC_CATEGORIES = [
  {
    label: "Proprietor / Professional",
    description:
      "You run a business in your own name, or practise a profession such as medicine, law, accountancy or architecture. There is no separate company, so the lender looks at you and the business together: your ITRs, your financial statements and your business bank account. Clear books and returns filed on time help a lot.",
    items: PROPRIETOR_DOCS,
  },
  {
    label: "Partnership / LLP",
    description:
      "The business is a partnership firm or an LLP. The lender checks the firm's registration, its financials and its bank statements, and also the standing of each partner, so every partner's KYC and tax returns are usually needed. A signed partnership deed that allows borrowing keeps things smooth.",
    items: PARTNERSHIP_DOCS,
  },
  {
    label: "Company",
    description:
      "The business is a private or public limited company. The lender checks the incorporation papers, the directors and the shareholding, the company's audited financials and its bank statements. A board resolution authorising the loan is usually needed, and directors may be asked to stand as guarantors.",
    items: COMPANY_DOCS,
  },
];
const LRD_DOC_CATEGORIES = [
  {
    label: "Individual owner",
    description: "You own the let-out property in your own name, or jointly with family. The lender looks at the lease, the rent you receive and your income tax returns. A registered lease with a reliable tenant, and rent paid regularly into your bank account, makes the file strong.",
    items: [
      "Owner's KYC: PAN, Aadhaar and address proof",
      "Registered lease deed and the tenant's KYC",
      "Last 12 months' rent receipts and the bank statement showing the rent",
      "Last 3 years' ITR showing the rental income",
      "Property title documents and the latest property tax receipt",
    ],
  },
  {
    label: "Company / Firm",
    description: "The property is owned by a company, firm or LLP. The lender checks the entity's papers, the lease and the tenant, the rent received and the financials. The loan is usually repaid from the rent, so a long lease with a well-known tenant is a big plus.",
    items: [
      "Constitution papers: incorporation certificate, MOA and AOA, or partnership deed",
      "KYC of the company or firm and of its directors or partners",
      "Registered lease deed and the tenant's KYC",
      "Last 12 months' rent receipts and the bank statement showing the rent",
      "Last 3 years' audited financials and ITR",
      "Property title documents and the latest property tax receipt",
    ],
  },
  {
    label: "NRI",
    description: "You live and work outside India and own the let-out property in India. The lender checks the lease, the rent paid into your NRO account, and your overseas income and documents. A Power of Attorney can complete the signing in India for you.",
    items: NRI_DOCS,
  },
];
const EDUCATION_DOC_CATEGORIES = [
  {
    label: "Student",
    description: "The person who will study. The lender looks at the course and the institution, the total cost and your academic record, along with a co-applicant who shares the loan. Having your admission letter and fee details ready speeds things up, and for study abroad your visa papers come in later.",
    items: [
      "Student's KYC: PAN or Aadhaar, and passport for study abroad",
      "Admission letter or offer letter from the institution",
      "Fee structure and the cost of the course, with living costs if you want them covered",
      "Mark sheets and certificates from the last two qualifications",
      "Entrance or language test score card, where applicable (for example GRE, GMAT, IELTS)",
      "Visa or I-20, once you have it, for study abroad",
    ],
  },
  {
    label: "Co-applicant: Salaried",
    description: "A parent or guardian in India who earns a salary and shares the loan. The lender looks at their salary slips, bank statements, tax returns and credit history, because they are the main source of repayment during and after the course.",
    items: SALARIED_DOCS,
  },
  {
    label: "Co-applicant: Self-Employed",
    description: "A parent or guardian in India who runs a business or practises a profession. The lender looks at their tax returns, financial statements, business bank statements and credit history, because they are the main source of repayment during and after the course.",
    items: SELF_EMPLOYED_DOCS,
  },
];

const NRI_HOME_LOAN: NriInfo = {
  heading: "Home loans for NRIs",
  intro:
    "If you live and work abroad, you can still buy or build a home in India with a loan from an Indian Bank or NBFC. Much of the process can be done online, and a Power of Attorney lets a trusted person in India sign for you. We help you find lenders that lend to NRIs and guide you through each step.",
  points: [
    {
      title: "Who counts as an NRI",
      body: "Indian citizens who live and work outside India. Many lenders also accept Persons of Indian Origin (PIO) and Overseas Citizens of India (OCI) cardholders.",
    },
    {
      title: "What you can buy",
      body: "Residential and commercial property in India. NRIs cannot buy agricultural land, plantation property or a farmhouse without special permission from the RBI.",
    },
    {
      title: "Your income abroad",
      body: "Lenders look for a stable job or business overseas, with an employment contract, salary slips and overseas bank statements. Your foreign income is converted to rupees when they assess it. The minimum income and job period differ by lender.",
    },
    {
      title: "How you repay",
      body: "EMIs are usually paid from your NRE or NRO account in India, or from funds you send from abroad. The lender will tell you which routes it accepts.",
    },
    {
      title: "Loan amount and tenure",
      body: "Lenders may fund a smaller share of the property value for NRIs than for residents, and the tenure is often a little shorter. Your expert will confirm each lender's limits for your case.",
    },
    {
      title: "Signing from abroad",
      body: "A registered Power of Attorney in favour of a trusted resident Indian can sign for you in India. It is usually attested by the Indian embassy or consulate, or notarised and apostilled as the country requires. Some lenders may ask for a short visit or a video verification.",
    },
    {
      title: "Tax benefits",
      body: "NRIs who repay a home loan may be able to claim deductions on the principal and the interest, as residents can, under the tax rules in force. Please check your own position with a CA.",
    },
    {
      title: "A resident co-applicant",
      body: "Some lenders ask for a close family member living in India as co-applicant. It can help with local follow-up and with assessing the income.",
    },
  ],
  faqs: [
    {
      q: "Can an NRI get a home loan in India?",
      a: "Yes. Many Banks and NBFCs lend to NRIs to buy, build or renovate a home in India. Approval depends on your overseas income, how stable your job or business is, your credit history and the property.",
    },
    {
      q: "Do I need to be in India to apply?",
      a: "Not always. Most of the application can be done online or by courier, and a Power of Attorney can cover the signing in India. Some lenders may ask for a visit or a video verification.",
    },
    {
      q: "Which documents do NRIs need?",
      a: "Usually your passport and visa, your employment contract, recent salary slips, overseas and NRE/NRO bank statements, address proof abroad and in India, and the property papers. Use the NRI tab in the paperwork list above, and download the NRI checklist for the full list.",
    },
    {
      q: "Is my foreign salary accepted as income?",
      a: "Yes, usually. Lenders convert it to rupees and ask for proof such as your contract, salary slips and bank statements. Some also ask for a tax return from your country of residence.",
    },
    {
      q: "Can I repay from my overseas account?",
      a: "Most lenders collect EMIs from your NRE or NRO account in India, funded by money you send from abroad. Ask which routes your lender accepts.",
    },
    {
      q: "Can I get a loan against a property I already own in India?",
      a: "A few lenders offer it to NRIs, with extra checks on the property and your income. Tell us your case and we will tell you which lenders to approach.",
    },
  ],
  note: "NRI lending is governed by RBI and FEMA rules and each lender's own policy, and the rules can change. We share general information here. Your expert will confirm what applies to you.",
};

const NRI_LAP: NriInfo = {
  heading: "Loan against property for NRIs",
  intro:
    "NRIs who own a residential or commercial property in India can sometimes borrow against it. Fewer lenders offer this than home loans, and they check the property and your income more closely. We can tell you which lenders to approach.",
  points: [
    {
      title: "Who can apply",
      body: "NRIs, and often PIO and OCI cardholders, who own the property in their own name or jointly, with a clear title.",
    },
    {
      title: "Which property",
      body: "Residential and commercial property in India. Agricultural land, plantation property and farmhouses are not accepted for NRIs without RBI permission.",
    },
    {
      title: "How the money can be used",
      body: "Lenders restrict some uses, and rules on moving funds out of India apply. Money is generally used inside India, for example for business, medical or personal needs. Confirm your plan with us before applying.",
    },
    {
      title: "Income checks",
      body: "Lenders may look at your overseas income, your rental income from the property, and your NRE/NRO account statements.",
    },
    {
      title: "Repayment",
      body: "EMIs are usually paid from your NRE or NRO account in India.",
    },
    {
      title: "Signing from abroad",
      body: "A registered Power of Attorney in favour of a trusted resident Indian can complete the signing and the mortgage in India, attested as the lender requires.",
    },
  ],
  faqs: [
    {
      q: "Can an NRI take a loan against property in India?",
      a: "Yes, with select lenders. They usually want a property with a clear title, proof of your overseas income and your NRE/NRO account statements.",
    },
    {
      q: "Can I send the money abroad?",
      a: "There are limits on moving funds out of India under FEMA and RBI rules, and lenders restrict how the money is used. Ask us before you plan, so we can check what applies.",
    },
    {
      q: "Do I need a Power of Attorney?",
      a: "If you cannot be in India to sign, yes. A Power of Attorney in favour of a trusted resident Indian lets them complete the signing and the mortgage for you.",
    },
  ],
  note: "NRI lending is governed by RBI and FEMA rules and each lender's own policy, and the rules can change. We share general information here. Your expert will confirm what applies to you.",
};

// What a lender may charge besides interest. Written as a general guide: every lender sets its own fees.
const CHARGES_NOTE =
  "These are general guides and every lender sets its own fees. Your expert will share the exact charges in writing before you sign.";
const CHARGES_PROPERTY: ChargesInfo = {
  intro:
    "Besides interest, a lender may charge a few fees. It helps to know them before you apply, so there are no surprises.",
  rows: [
    {
      label: "Processing fee",
      value:
        "A percentage of the loan amount plus GST, often somewhere between about 0.5% and 1.5%. Some lenders reduce or waive it during offers.",
    },
    {
      label: "Legal and valuation charges",
      value:
        "A fee for the lender's legal check of the property papers and for a valuation visit. It is usually a fixed amount and depends on the lender and the property.",
    },
    {
      label: "Stamp duty, registration and insurance",
      value:
        "Stamp duty and registration follow your state's rules. Property or loan insurance is charged only where you take it.",
    },
    {
      label: "Foreclosure and part-prepayment",
      value:
        "Floating-rate loans to individuals generally carry no prepayment or foreclosure charge under RBI rules. A fixed-rate loan may charge a small percentage of the amount you prepay.",
    },
  ],
  note: CHARGES_NOTE,
};
const CHARGES_UNSECURED: ChargesInfo = {
  intro:
    "Besides interest, a lender may charge a few fees. It helps to know them before you apply, so there are no surprises.",
  rows: [
    {
      label: "Processing fee",
      value:
        "A percentage of the loan amount plus GST, often somewhere between about 1% and 3% for loans without security. It varies by lender and profile.",
    },
    {
      label: "Documentation and other charges",
      value: "Some lenders add a small fixed fee for documentation or a statement of account.",
    },
    {
      label: "Foreclosure and part-prepayment",
      value:
        "Closing the loan early may carry a charge, usually a percentage of the outstanding amount, and some lenders allow it only after a minimum period. Ask before you prepay.",
    },
  ],
  note: CHARGES_NOTE,
};
const CHARGES_VEHICLE: ChargesInfo = {
  intro:
    "Besides interest, a lender may charge a few fees. It helps to know them before you apply, so there are no surprises.",
  rows: [
    {
      label: "Processing fee",
      value:
        "A percentage of the loan amount plus GST, often somewhere between about 0.5% and 2%. Some lenders reduce or waive it during offers.",
    },
    {
      label: "Documentation and hypothecation charges",
      value:
        "A small fee for the paperwork, and for recording the lender's charge on the vehicle's registration (RC).",
    },
    {
      label: "Foreclosure and part-prepayment",
      value:
        "Closing early may carry a charge, usually a percentage of the outstanding amount, depending on the lender and how long you have held the loan.",
    },
  ],
  note: CHARGES_NOTE,
};


const CHARGES_INTRO =
  "Besides interest, a lender may charge a few fees. It helps to know them before you apply, so there are no surprises.";
const CHARGES_LIMIT: ChargesInfo = {
  intro: CHARGES_INTRO,
  rows: [
    {
      label: "Processing fee",
      value:
        "A percentage of the limit plus GST, often somewhere between about 0.5% and 1.5%. It is charged when the limit is sanctioned and again when it is renewed or enhanced.",
    },
    {
      label: "Annual review or renewal fee",
      value:
        "Working-capital limits are reviewed every year. Many lenders charge a renewal or review fee at that point.",
    },
    {
      label: "Inspection, valuation and legal charges",
      value:
        "Where the limit is backed by stock, receivables or property, the lender may charge for inspections, valuations or a legal check.",
    },
    {
      label: "Penal charges",
      value:
        "Going over the sanctioned limit, or not routing enough business through the account, can attract extra interest or charges. Each lender sets its own terms.",
    },
  ],
  note: CHARGES_NOTE,
};
const CHARGES_COMMERCIAL: ChargesInfo = {
  intro: CHARGES_INTRO,
  rows: [
    {
      label: "Processing fee",
      value:
        "A percentage of the loan amount plus GST, often somewhere between about 0.5% and 2%. For large or project-based loans it is usually agreed with the lender.",
    },
    {
      label: "Legal, valuation and technical charges",
      value:
        "Fees for the lender's legal check, the property or project valuation, and any technical inspection. They depend on the lender and the size of the deal.",
    },
    {
      label: "Stamp duty and registration",
      value: "These follow your state's rules and apply when the loan documents and mortgage are registered.",
    },
    {
      label: "Foreclosure and part-prepayment",
      value:
        "Loans taken for business purposes may carry a charge for early closure, often a small percentage of the amount prepaid. Check the terms before you prepay.",
    },
  ],
  note: CHARGES_NOTE,
};
const CHARGES_GUARANTEE: ChargesInfo = {
  intro: CHARGES_INTRO,
  rows: [
    {
      label: "Commission",
      value:
        "A percentage of the guarantee or letter of credit amount, charged for the period it is valid and often billed every quarter or year. The rate depends on the lender and your profile.",
    },
    {
      label: "Margin money",
      value:
        "Lenders usually ask you to keep a part of the amount as cash margin or a fixed deposit while the facility is in use.",
    },
    {
      label: "Processing and amendment fees",
      value:
        "A fee when the facility is sanctioned, and a smaller one if you change the amount, the period or the beneficiary.",
    },
    {
      label: "Invocation or devolvement",
      value:
        "If the guarantee is called on, or a letter of credit is paid by the lender, the amount is recovered from you with interest and charges.",
    },
  ],
  note: CHARGES_NOTE,
};
const CHARGES_CGTMSE: ChargesInfo = {
  intro: CHARGES_INTRO,
  rows: [
    {
      label: "Guarantee fee",
      value:
        "A fee for the credit guarantee cover, charged every year on the guaranteed amount. It usually falls between about 0.37% and 2% a year, depending on the loan size, the borrower category and the risk rating. Use our CGTMSE fee calculator for an estimate.",
    },
    {
      label: "Processing fee",
      value: "The lender may charge its normal processing fee plus GST on the loan.",
    },
    {
      label: "Foreclosure and part-prepayment",
      value:
        "Closing early may carry a charge depending on the lender. Ask before you prepay.",
    },
  ],
  note: CHARGES_NOTE,
};
const CHARGES_SECURITIES: ChargesInfo = {
  intro: CHARGES_INTRO,
  rows: [
    {
      label: "Processing fee",
      value:
        "A percentage of the loan or limit plus GST, often somewhere between about 0.5% and 1.5%. Some lenders cap it at a fixed amount.",
    },
    {
      label: "Pledge and lien charges",
      value:
        "A small fee for marking your shares, bonds or mutual funds as pledged, and for releasing them when you repay.",
    },
    {
      label: "Top-up or shortfall",
      value:
        "If the value of what you pledged falls, the lender may ask you to add more or repay part of the loan. This is not a fee, but it is worth knowing about.",
    },
  ],
  note: CHARGES_NOTE,
};
const CHARGES_EDUCATION: ChargesInfo = {
  intro: CHARGES_INTRO,
  rows: [
    {
      label: "Processing fee",
      value:
        "Many lenders charge little or no processing fee on education loans, especially for smaller amounts. For larger loans it is often a small percentage plus GST.",
    },
    {
      label: "Interest during the study period",
      value:
        "Interest usually starts when the money is paid out. You may be able to pay it during the course, or let it add up and begin EMIs after the moratorium.",
    },
    {
      label: "Legal, valuation and insurance",
      value:
        "Where the loan is backed by property, the lender may charge for a legal check and a valuation. Loan insurance is charged only where you take it.",
    },
    {
      label: "Foreclosure and part-prepayment",
      value:
        "Many lenders allow early repayment of education loans with little or no charge. Check your lender's terms.",
    },
  ],
  note: CHARGES_NOTE,
};

const NRI_BALANCE_TRANSFER: NriInfo = {
  heading: "Balance transfer for NRIs",
  intro:
    "If you are an NRI with a home loan in India, you can move it to another Bank or NBFC for a lower rate or better terms, just like a resident. The new lender checks your overseas income and your account again, so a few of the NRI documents are needed.",
  points: [
    {
      title: "Who can transfer",
      body: "NRIs, and often PIO and OCI cardholders, whose existing loan has a good repayment record.",
    },
    {
      title: "What the new lender checks",
      body: "Your overseas income, your job or business abroad, your credit history, and the property that is already mortgaged.",
    },
    {
      title: "Your existing loan",
      body: "You will need the sanction letter, the loan statement and the list of documents held by your current lender, plus a foreclosure letter from them.",
    },
    {
      title: "Costs to weigh",
      body: "The new lender's processing fee and any charge from your current lender. Floating-rate loans to individuals generally carry no foreclosure charge, but check your own loan terms. Our balance transfer calculator shows what you could save.",
    },
    {
      title: "Signing from abroad",
      body: "A registered Power of Attorney in favour of a trusted resident Indian can sign the new loan papers in India for you, attested as the lender requires.",
    },
    {
      title: "Repayment",
      body: "EMIs are usually paid from your NRE or NRO account in India, as with your current loan.",
    },
  ],
  faqs: [
    {
      q: "Can an NRI transfer a home loan to another lender?",
      a: "Yes. Several Banks and NBFCs take over NRI home loans. They look at your overseas income, your repayment record and the property, much as they would for a new loan.",
    },
    {
      q: "Do I need to be in India?",
      a: "Not always. Much of the process can be done online or by courier, and a Power of Attorney can cover the signing. Some lenders may ask for a visit or a video verification.",
    },
    {
      q: "Is it worth it?",
      a: "That depends on how much lower the new rate is, how long your loan still has to run, and the costs of moving. Try the balance transfer calculator, or ask us to compare lenders for you.",
    },
  ],
  note: "NRI lending is governed by RBI and FEMA rules and each lender's own policy, and the rules can change. We share general information here. Your expert will confirm what applies to you.",
};

const NRI_LRD: NriInfo = {
  heading: "Lease rental discounting for NRIs",
  intro:
    "NRIs who own a let-out commercial property in India can sometimes raise money against its rent. A few lenders offer this, and they check the lease, the tenant and your income carefully. We can tell you which lenders to approach.",
  points: [
    {
      title: "Who can apply",
      body: "NRIs, and often PIO and OCI cardholders, who own the let-out property and have a registered lease with a reliable tenant.",
    },
    {
      title: "What lenders check",
      body: "The lease agreement, the rent history in your bank statements, the tenant's standing and the property's title. Your overseas income may also be looked at.",
    },
    {
      title: "Rent and repayment",
      body: "The rent is usually collected in an account with the lender, and the EMIs are paid from it. Rent is received in your NRO account in India.",
    },
    {
      title: "Signing from abroad",
      body: "A registered Power of Attorney in favour of a trusted resident Indian can sign for you in India, attested as the lender requires.",
    },
  ],
  faqs: [
    {
      q: "Can an NRI take a lease rental discounting loan?",
      a: "With select lenders, yes, for commercial property that is already let out. They will want the lease, the rent record and clear title.",
    },
    {
      q: "Which account is the rent paid into?",
      a: "Rent from Indian property is received in your NRO account in India. The lender will set up how the rent is routed for repayment.",
    },
  ],
  note: "NRI lending is governed by RBI and FEMA rules and each lender's own policy, and the rules can change. We share general information here. Your expert will confirm what applies to you.",
};

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
      "NRIs with a stable overseas income can apply too, with a few extra documents. See the NRI section below",
      "Salaried with take-home income from about ₹25,000/month, or self-employed with 2–3 years of ITR",
      "Cash salary accepted as income proof too, not just bank-credited salary",
      "A CIBIL score near 700 or above may help you get a better rate; lower scores are reviewed case by case",
      "Salaried, self-employed professional or self-employed business owner",
      "If salaried, generally at least 1 year with your current employer",
      "Residential property: a ready or under-construction flat, a plot, or a house you plan to build",
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
        options: ["Builder Purchase", "Resale", "Self-Owned"],
      },
      // Only a builder purchase has a status; only one still being built has a possession date.
      {
        key: "propertyStatus",
        label: "Property Status",
        type: "select",
        options: ["Ready to Move", "Under Construction"],
        showWhen: { key: "propertyType", values: ["Builder Purchase"] },
      },
      {
        key: "possessionDate",
        label: "Expected Possession Date",
        type: "date",
        showWhen: { key: "propertyStatus", values: ["Under Construction"] },
      },
      {
        key: "loanAmount",
        label: "Loan Amount Required",
        type: "text",
        placeholder: "e.g. 50,00,000",
        format: "amount",
      },
    ],
    charges: CHARGES_PROPERTY,
    nri: NRI_HOME_LOAN,
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
      "Indian citizen with a property in India to offer as security; NRIs can apply with select lenders (see the NRI section below)",
      "Salaried, self-employed professional or self-employed business owner",
      "If salaried, generally at least 1 year with your current employer",
      "A CIBIL score of around 750 or above may help you get better terms; lower scores are reviewed case by case",
      "Residential, commercial or industrial property that can be pledged as security",
    ],
    documents: [KYC, PROPERTY_DOCS, PHOTOS],
    documentCategories: APPLICANT_DOC_CATEGORIES,
    charges: CHARGES_PROPERTY,
    nri: NRI_LAP,
    checklistIntake: [
      {
        key: "propertyType",
        label: "Property Type",
        type: "select",
        options: ["Builder Purchase", "Resale", "Self-Owned"],
      },
      // Only a builder purchase has a status; only one still being built has a possession date.
      {
        key: "propertyStatus",
        label: "Property Status",
        type: "select",
        options: ["Ready to Move", "Under Construction"],
        showWhen: { key: "propertyType", values: ["Builder Purchase"] },
      },
      {
        key: "possessionDate",
        label: "Expected Possession Date",
        type: "date",
        showWhen: { key: "propertyStatus", values: ["Under Construction"] },
      },
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
      "Resident Indian owners can apply; NRIs can apply with select lenders (see the NRI section below)",
      "Commercial property, such as offices, shops or warehouses, that is already let out",
      "A clean credit history; a CIBIL score of around 750 or above may help you get better terms",
    ],
    documents: [KYC, "Registered lease deed and rent receipts", PROPERTY_DOCS],
    charges: CHARGES_COMMERCIAL,
    nri: NRI_LRD,
    documentCategories: LRD_DOC_CATEGORIES,
  },
  {
    slug: "balance-transfer",
    icon: ArrowLeftRight,
    title: "Balance Transfer & Top-Up",
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
      "Resident Indian with an existing home loan; NRIs can transfer with select lenders (see the NRI section below)",
      "Salaried, self-employed professional or self-employed business owner",
      "If salaried, generally at least 1 year with your current employer",
      "A CIBIL score of around 700 or above may help you get the better rate; lower scores are reviewed case by case",
      "A residential property already mortgaged, with its papers in order",
    ],
    documents: [
      KYC,
      "Current loan statement, sanction letter and foreclosure letter",
      PROPERTY_DOCS,
    ],
    charges: CHARGES_PROPERTY,
    nri: NRI_BALANCE_TRANSFER,
    documentCategories: APPLICANT_DOC_CATEGORIES,
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
      "Self-employed professional or business owner with a steady income",
      "Residential, commercial or industrial property that can be pledged as security",
      "A good credit history; a CIBIL score of around 700 or above may help",
    ],
    documents: [KYC, PROPERTY_DOCS],
    charges: CHARGES_LIMIT,
    documentCategories: BUSINESS_DOC_CATEGORIES,
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
      "Proprietorship, partnership, LLP, company or self-employed professional",
      "A steady business income that shows in your bank statements",
      "A CIBIL score of around 700 or above for the owner may help you get better terms; lower scores are reviewed case by case",
    ],
    documents: [KYC, "Proof of business ownership"],
    charges: CHARGES_UNSECURED,
    documentCategories: BUSINESS_DOC_CATEGORIES,
  },
  {
    slug: "cgtmse",
    icon: ShieldCheck,
    title: "CGTMSE Funding",
    tagline: "Government-backed funding, no collateral.",
    group: "Cash Flow & Trade",
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
      "A business in India in manufacturing or services; some activities, such as retail trade, may not be covered",
      "Proprietorship, partnership, LLP or company",
    ],
    documents: [KYC, "Udyam registration and project report"],
    charges: CHARGES_CGTMSE,
    documentCategories: BUSINESS_DOC_CATEGORIES,
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
      "Business owner or self-employed professional with a steady business income",
      "Proprietorship, partnership, LLP or company",
    ],
    documents: [KYC],
    charges: CHARGES_UNSECURED,
    documentCategories: BUSINESS_DOC_CATEGORIES,
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
      "Self-employed business owner or professional running a current account",
      "A good credit record for the business and its owners; a CIBIL score of around 700 or above may help",
    ],
    documents: [KYC],
    charges: CHARGES_LIMIT,
    documentCategories: BUSINESS_DOC_CATEGORIES,
  },
  {
    slug: "project-funding",
    icon: HardHat,
    title: "Project Funding",
    tagline: "Finance that builds as you build.",
    group: "Property Finance",
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
      "A developer or company registered in India",
      "A good credit record for the developer, its promoters and group companies",
      "Residential, commercial or mixed-use projects",
    ],
    documents: [
      KYC,
      "Project report with cost and sales projections",
      "Approvals, plans and land title documents",
    ],
    charges: CHARGES_COMMERCIAL,
    documentCategories: BUSINESS_DOC_CATEGORIES,
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
      "Proprietorship, partnership, LLP or company",
      "A good credit record for the business and its promoters; a CIBIL score of around 700 or above may help",
    ],
    documents: [KYC, "Audited financials and stock / debtor statements"],
    charges: CHARGES_LIMIT,
    documentCategories: BUSINESS_DOC_CATEGORIES,
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
      "Proprietorship, partnership, LLP or company",
      "A good credit record for the business and its promoters",
    ],
    documents: [KYC, "Stock and debtor ageing statements"],
    charges: CHARGES_LIMIT,
    documentCategories: BUSINESS_DOC_CATEGORIES,
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
      "Self-employed business owner or professional with a steady income",
      "Proprietorship, partnership, LLP or company",
    ],
    documents: [KYC],
    charges: CHARGES_LIMIT,
    documentCategories: BUSINESS_DOC_CATEGORIES,
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
      "Proprietorship, partnership, LLP or company",
      "A good credit standing for the business and its promoters",
    ],
    documents: [KYC, "Tender / contract copy and BG format"],
    charges: CHARGES_GUARANTEE,
    documentCategories: BUSINESS_DOC_CATEGORIES,
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
      "Proprietorship, partnership, LLP or company",
      "A good credit standing for the business and its promoters",
    ],
    documents: [KYC, "Proforma invoice and supplier agreement"],
    charges: CHARGES_GUARANTEE,
    documentCategories: BUSINESS_DOC_CATEGORIES,
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
      "Proprietorship, partnership, LLP or company",
      "A good credit record for the business and its promoters",
    ],
    documents: [KYC, "Audited financials and existing sanction letters"],
    charges: CHARGES_LIMIT,
    documentCategories: BUSINESS_DOC_CATEGORIES,
  },

  {
    slug: "machine-loan",
    icon: Cog,
    title: "Machine Loan",
    tagline: "Take your business to the next level.",
    group: "Cash Flow & Trade",
    facts: [
      { label: "Funding", value: "Up to 100%*" },
      { label: "Loan amount", value: "₹10 Lakh to ₹3 Cr" },
      { label: "Tenure", value: "Up to 60 months" },
    ],
    about:
      "A machine loan helps you buy new machinery or equipment, or raise money against machinery you already own. It can help a business set up, expand or upgrade its production. We compare options from Banks and NBFCs that may suit your business and guide you through the paperwork.",
    features: [
      "Loan for buying machinery, or against different types of machinery",
      "Funding of up to 100%* of the machinery cost, including GST on machinery up to ₹35 Lakh, as per lender policy",
      "Fewer documents for loans up to ₹35 Lakh, as per lender policy",
      "Loan amount from ₹10 Lakh to ₹3 Crore, with repayment of up to 60 months",
      "For some profiles, financial statements may not be needed for loans up to ₹3 Crore",
    ],
    eligibility: [
      "An established business, usually 2 years or more",
      "Profitable accounts for the last 2 years",
      "A healthy average balance in the business bank account",
      "Machinery that is useful for the business and keeps its value",
      "Ownership of property or a factory may be considered",
      "A consumer CIBIL score of 700 or more",
      "Proprietorship, partnership, LLP or company",
    ],
    documents: [KYC, "Machinery quotation or invoice from the supplier"],
    charges: CHARGES_COMMERCIAL,
    documentCategories: BUSINESS_DOC_CATEGORIES,
  },
  {
    slug: "personal-loan",
    icon: Wallet,
    title: "Personal Loan",
    tagline: "Money for life's plans, minus the paperwork.",
    group: "Personal, Education, Vehicle & Other Loans",
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
      "Resident Indian",
      "Salaried, or a self-employed professional or business owner",
      "If salaried, generally at least 1 year with your current employer",
    ],
    documents: [KYC],
    charges: CHARGES_UNSECURED,
    documentCategories: RESIDENT_DOC_CATEGORIES,
  },
  {
    slug: "education-loan",
    icon: GraduationCap,
    title: "Education Loan",
    tagline: "Invest in the degree, not the worry.",
    group: "Personal, Education, Vehicle & Other Loans",
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
      "Indian student, with a resident Indian co-applicant who is usually a parent or guardian",
      "A co-applicant who is salaried or self-employed with a steady income",
      "A good credit record for the co-applicant helps",
    ],
    documents: [
      KYC,
      "Admission letter and fee structure",
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
    charges: CHARGES_EDUCATION,
    documentCategories: EDUCATION_DOC_CATEGORIES,
  },

  {
    slug: "new-car-loan",
    icon: Car,
    title: "New Car Loan",
    tagline: "From showroom to driveway, fully funded.",
    group: "Personal, Education, Vehicle & Other Loans",
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
      "Resident Indian, salaried or self-employed",
    ],
    documents: [KYC, "Dealer's vehicle quotation"],
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
    charges: CHARGES_VEHICLE,
    documentCategories: RESIDENT_DOC_CATEGORIES,
  },
  {
    slug: "used-car-loan",
    icon: CarFront,
    title: "Used Car Loan",
    tagline: "A great pre-owned car, sensibly financed.",
    group: "Personal, Education, Vehicle & Other Loans",
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
      "Resident Indian, salaried or self-employed",
      "At least 1 year in your current job or business",
      "A CIBIL score of around 700 or above may help you get a better rate; lower scores are reviewed case by case",
    ],
    documents: [KYC, "RC copy, insurance and valuation report"],
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
    charges: CHARGES_VEHICLE,
    documentCategories: RESIDENT_DOC_CATEGORIES,
  },
  {
    slug: "car-refinance",
    icon: Repeat,
    title: "Car Refinance",
    tagline: "Your car can fund your next plan.",
    group: "Personal, Education, Vehicle & Other Loans",
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
      "Resident Indian, salaried or self-employed",
      "A CIBIL score of around 700 or above may help you get better terms; lower scores are reviewed case by case",
    ],
    documents: [KYC, "RC, insurance and any current loan statement"],
    checklistIntake: [
      {
        key: "loanAmount",
        label: "Loan Amount Required",
        type: "text",
        placeholder: "e.g. 5,00,000",
        format: "amount",
      },
    ],
    charges: CHARGES_VEHICLE,
    documentCategories: RESIDENT_DOC_CATEGORIES,
  },
  {
    slug: "commercial-vehicle",
    icon: Truck,
    title: "Commercial Vehicle",
    tagline: "Get the right vehicle for your business.",
    group: "Personal, Education, Vehicle & Other Loans",
    facts: [
      { label: "Funding", value: "Up to 100%* LTV" },
      { label: "Repayment", value: "Up to 7 years" },
      { label: "Used vehicles", value: "Up to 80% finance" },
    ],
    about:
      "Financing for new and used commercial vehicles such as trucks, buses and light goods vehicles. It helps a business add or replace vehicles without putting a large amount of its own money upfront. We compare options from Banks and NBFCs that may suit your business.",
    features: [
      "Finance for new and used commercial vehicles",
      "Funding of up to 100%* of the vehicle value for eligible profiles",
      "Used commercial vehicles: up to 80% finance",
      "Repayment of up to 7 years",
      "No penalty for early repayment on eligible loans, as per lender terms",
      "Simpler documents",
    ],
    eligibility: [
      "A business or person who will use the vehicle for commercial work",
      "Income or business proof to show that you can repay the loan",
      "Final eligibility, amount and terms depend on the lender's policy and the vehicle",
      "Resident Indian: an individual transporter, proprietorship, firm or company",
      "At least 1 year of experience in transport or the business the vehicle is for",
      "A CIBIL score of around 700 or above may help you get better terms; lower scores are reviewed case by case",
    ],
    documents: [
      KYC,
      "Income or business proof (ITR, bank statements)",
      "Vehicle quotation, or registration papers for a used vehicle",
    ],
    charges: CHARGES_VEHICLE,
    documentCategories: BUSINESS_DOC_CATEGORIES,
  },
  {
    slug: "loan-against-securities",
    icon: TrendingUp,
    title: "Loan Against Securities",
    tagline: "Borrow on your portfolio, stay invested.",
    group: "Personal, Education, Vehicle & Other Loans",
    facts: [
      { label: "Pledge", value: "Shares, mutual funds and bonds" },
      { label: "LTV", value: "Up to 50%–80% of the pledge value" },
      { label: "Facility", value: "Overdraft, interest only on what you use" },
    ],
    about:
      "You can pledge shares, mutual funds, bonds or insurance policies to get an overdraft limit, instead of selling them. For mutual funds, the lender marks a lien on your units through the registrar (CAMS or KFintech). Your investments stay in place, and the limit is there when you need it. Lenders accept only certain securities and set their own limits.",
    features: [
      "Shares, mutual funds, bonds, insurance policies and debt instruments accepted",
      "Mutual fund units stay in your name and keep earning returns",
      "The limit moves with the value of the pledged portfolio",
      "No EMI — interest applies only to what's drawn",
      "Quick setup on lender-approved securities",
    ],
    eligibility: [
      "Approved securities or mutual fund units held in the applicant's own name",
      "A demat account for shares and bonds, or a mutual fund folio for units",
      "Securities or schemes that are on the lender's approved list",
      "Resident Indian, 21 years or older",
    ],
    documents: [KYC, "Demat holding statement, or mutual fund statement (CAS)", "Portfolio, folio or policy documents"],
    charges: CHARGES_SECURITIES,
  },
  {
    slug: "professional-loan",
    icon: Stethoscope,
    title: "Professional Loan",
    tagline: "Built for doctors, CAs and other qualified professionals.",
    group: "Business Growth",
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
      "Resident Indian professional in independent practice",
      "A steady practice income that shows in your bank statements",
    ],
    documents: [KYC, INCOME, "Professional registration / degree certificate"],
    charges: CHARGES_UNSECURED,
  },
  {
    slug: "private-funding",
    icon: KeyRound,
    title: "Private Funding",
    tagline: "Fast money when the clock is ticking.",
    group: "Business Growth",
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
    name: "Personal, Education, Vehicle & Other Loans",
    heading: "Personal, education, vehicle and other loans.",
    description:
      "For personal needs, studies, cars and commercial vehicles, or funds against the shares and mutual funds you already hold.",
  },
];

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
