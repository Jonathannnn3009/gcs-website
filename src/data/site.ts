export const CONTACT = {
  phone: "+91 88280 01700",
  phoneHref: "tel:+918828001700",
  whatsapp: "918828001700",
  whatsappLink: "https://wa.me/918828001700",
  email: "growthcs17@gmail.com",
  address:
    "CCTV Towers, Andheri-Ghatkopar Rd, Bhatwadi, Kaju Pada, Barve Nagar, Ghatkopar West, Mumbai 400084",
  hours: "Monday to Saturday · 10:00 AM – 6:00 PM",
  cities: ["Mumbai", "Thane", "Navi Mumbai", "Pune"],
};

export type Service = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  highlights: string[];
};

export const SERVICES: Service[] = [
  {
    id: "home-loan",
    title: "Home Loan",
    tagline: "Buy, build or refinance",
    description:
      "Competitive rates from leading banks and NBFCs, with end-to-end support from sanction to disbursal.",
    highlights: [
      "Top-up & Balance Transfer for better terms",
      "Tax benefits under Section 80C & 24(b)",
      "Smart Saver / Max Gain overdraft facility",
      "Zero to nominal processing fees",
    ],
  },
  {
    id: "loan-against-property",
    title: "Loan Against Property",
    tagline: "Unlock the value you already own",
    description:
      "Raise large-ticket funding against residential, commercial or industrial property at mortgage rates.",
    highlights: [
      "High tenure of up to 20 years",
      "LTV from 60% up to 100% of property value",
      "Lease rental discounting options",
      "Income and banking programme cases accepted",
    ],
  },
  {
    id: "business-loan",
    title: "Business Loan & Working Capital",
    tagline: "Fuel day-to-day growth",
    description: "Secured and unsecured business funding structured around your cash-flow cycle.",
    highlights: [
      "Cash Credit & Overdraft facility",
      "Unsecured business loans up to ₹75 lakh",
      "Bank limit enhancement & takeover",
      "GST / banking / balance-sheet programmes",
    ],
  },
  {
    id: "personal-loan",
    title: "Personal Loan",
    tagline: "Funds when timing matters",
    description: "Collateral-free personal finance with quick approvals and minimal documentation.",
    highlights: [
      "Disbursal in as little as 48 hours",
      "Tenure up to 6 years",
      "Balance transfer at lower rates",
      "Salaried & self-employed profiles",
    ],
  },
  {
    id: "car-loan",
    title: "Car Loan",
    tagline: "New, used and refinance",
    description:
      "On-road funding for new and pre-owned vehicles, plus loans against your existing car.",
    highlights: [
      "Up to 100% on-road funding",
      "Used-car and refinance options",
      "Attractive rates for salaried profiles",
      "Fast dealer coordination",
    ],
  },
  {
    id: "education-loan",
    title: "Education Loan",
    tagline: "Study in India or abroad",
    description:
      "Secured and unsecured education funding covering tuition, living costs and travel.",
    highlights: [
      "Tax benefits under Section 80E",
      "Moratorium during the course period",
      "Collateral & non-collateral options",
      "Support with university documentation",
    ],
  },
  {
    id: "balance-transfer",
    title: "Balance Transfer",
    tagline: "Same loan, smaller bill",
    description: "Move your existing loan to a lower rate with a structured top-up where eligible.",
    highlights: [
      "Rate reduction on home, LAP and business loans",
      "Top-up at mortgage pricing",
      "Tenure or EMI reduction, your choice",
      "End-to-end coordination with existing lender",
    ],
  },
  {
    id: "working-capital",
    title: "Working Capital Loans",
    tagline: "Keep operations liquid",
    description:
      "Cash credit, overdraft and bill discounting facilities sized to your operating cycle.",
    highlights: [
      "Cash Credit & Overdraft facility",
      "Limit enhancement and takeover",
      "Stock and debtor statement handling",
      "Consortium and multiple-banking arrangements",
    ],
  },
  {
    id: "overdraft-facility",
    title: "Overdraft Facility",
    tagline: "Flexible credit line",
    description:
      "A sanctioned limit against property or banking that lets you draw and repay as needed.",
    highlights: [
      "Interest only on utilized amount",
      "Secured and unsecured options",
      "Annual renewal with limit review",
      "Ideal for seasonal cash needs",
    ],
  },
  {
    id: "cash-credit",
    title: "Cash Credit",
    tagline: "Revolving business funding",
    description:
      "A revolving limit secured against stock and receivables, drawn and repaid as often as your cycle demands.",
    highlights: [
      "Drawing power reviewed monthly",
      "Interest charged only on drawn balance",
      "Renewable annually with enhancement",
      "Works alongside term loans and trade facilities",
    ],
  },
];

export type BankPartner = {
  name: string;
  /** Path under /public; omitted when no usable logo exists (a monogram is shown). */
  logo?: string;
};

export const BANK_PARTNERS: BankPartner[] = [
  { name: "HDFC Bank", logo: "/banks/hdfc-bank.png" },
  { name: "ICICI Bank", logo: "/banks/icici-bank.png" },
  { name: "SBI", logo: "/banks/sbi.png" },
  { name: "Axis Bank", logo: "/banks/axis-bank.png" },
  { name: "Bank of India", logo: "/banks/bank-of-india.png" },
  { name: "Kotak Mahindra", logo: "/banks/kotak-mahindra.png" },
  { name: "Yes Bank", logo: "/banks/yes-bank.png" },
  { name: "Bajaj Finserv", logo: "/banks/bajaj-finserv.png" },
  { name: "Tata Capital", logo: "/banks/tata-capital.png" },
  { name: "Standard Chartered", logo: "/banks/standard-chartered.png" },
  { name: "HSBC", logo: "/banks/hsbc.png" },
  { name: "IDBI Bank", logo: "/banks/idbi-bank.png" },
  { name: "IDFC First Bank", logo: "/banks/idfc-first-bank.png" },
  { name: "L&T Finance", logo: "/banks/lt-finance.png" },
  { name: "PNB Housing", logo: "/banks/pnb-housing.png" },
  { name: "Federal Bank" },
  { name: "Union Bank", logo: "/banks/union-bank.png" },
  { name: "Aditya Birla Capital", logo: "/banks/aditya-birla-capital.png" },
  { name: "Bandhan Bank", logo: "/banks/bandhan-bank.png" },
  { name: "Bank of Baroda", logo: "/banks/bank-of-baroda.png" },
  { name: "AU Small Finance", logo: "/banks/au-small-finance.png" },
  { name: "Axis Finance", logo: "/banks/axis-finance.png" },
  { name: "Bajaj Housing", logo: "/banks/bajaj-housing.png" },
  { name: "Cholamandalam", logo: "/banks/cholamandalam.png" },
  { name: "Deutsche Bank", logo: "/banks/deutsche-bank.png" },
  { name: "DCB Bank", logo: "/banks/dcb-bank.png" },
  { name: "Edelweiss", logo: "/banks/edelweiss.png" },
  { name: "Fullerton India", logo: "/banks/fullerton-india.png" },
  { name: "Godrej Capital", logo: "/banks/godrej-capital.png" },
  { name: "HDB Financial", logo: "/banks/hdb-financial.png" },
  { name: "HDFC Sales", logo: "/banks/hdfc-sales.png" },
  { name: "Hero FinCorp", logo: "/banks/hero-fincorp.png" },
  { name: "ICICI Home Finance", logo: "/banks/icici-home-finance.png" },
  { name: "IIFL Finance", logo: "/banks/iifl-finance.png" },
  { name: "Indiabulls Housing", logo: "/banks/indiabulls-housing.svg" },
  { name: "IndusInd Bank", logo: "/banks/indusind-bank.png" },
  { name: "LIC HFL", logo: "/banks/lic-hfl.png" },
  { name: "Mahindra Finance", logo: "/banks/mahindra-finance.png" },
  { name: "Piramal Finance", logo: "/banks/piramal-finance.png" },
  { name: "Poonawalla Fincorp", logo: "/banks/poonawalla-fincorp.png" },
  { name: "Profectus Capital", logo: "/banks/profectus-capital.png" },
  { name: "SBI Home Loans", logo: "/banks/sbi-home-loans.png" },
  { name: "Shriram Finance", logo: "/banks/shriram-finance.png" },
  { name: "Central Bank of India", logo: "/banks/central-bank-of-india.png" },
  { name: "Aadhar Housing", logo: "/banks/aadhar-housing.png" },
];

export const BANK_NAMES = BANK_PARTNERS.map((b) => b.name);

export const PAIN_POINTS = [
  {
    question: "How do I select the right bank or lender?",
    answer:
      "We compare live policies, rates and turnaround times across our network and shortlist the two or three lenders that actually fit your profile.",
  },
  {
    question: "Can I transfer my home loan for better terms?",
    answer:
      "Yes. We run a savings comparison on your outstanding loan and manage the full balance transfer, including a top-up where eligible.",
  },
  {
    question: "How much loan do I actually qualify for?",
    answer:
      "We structure eligibility using income, obligations, co-applicants and lender-specific programmes to maximise your sanction amount.",
  },
  {
    question: "How does my credit score affect approval and rates?",
    answer:
      "We review your bureau report upfront, flag issues that can be corrected, and place your file with lenders suited to your score band.",
  },
  {
    question: "How do I avoid hidden charges?",
    answer:
      "Every quote we share lists processing fees, legal and technical charges, insurance and foreclosure terms in writing before you sign.",
  },
  {
    question: "How is prompt disbursal ensured?",
    answer:
      "A dedicated relationship manager tracks your file daily through login, sanction, legal, technical and disbursal stages.",
  },
];
