const WHATSAPP_NUMBER = "918828001700";

/** Builds a wa.me link pre-filled with a ready-to-send message, so visitors don't land on a blank chat. */
export function waLink(message?: string): string {
  const defaultMessage =
    "Hi Growth Capital Services, I'd like to know more about your loan options.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message ?? defaultMessage)}`;
}

export const CONTACT = {
  phone: "+91 88280 01700",
  phoneHref: "tel:+918828001700",
  whatsapp: WHATSAPP_NUMBER,
  whatsappLink: waLink(),
  email: "growthcs17@gmail.com",
  address:
    "CCTV Towers, Andheri-Ghatkopar Rd, Bhatwadi, Kaju Pada, Barve Nagar, Ghatkopar West, Mumbai 400084",
  // Opens Google Maps (or the Maps app on a phone) searching for the office address.
  mapsLink:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(
      "CCTV Towers, Andheri-Ghatkopar Rd, Bhatwadi, Kaju Pada, Barve Nagar, Ghatkopar West, Mumbai 400084",
    ),
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
  /** Very wide logos (long wordmarks) are shown shorter so they do not dominate the strip. */
  small?: boolean;
};

// The lenders shown in the homepage marquee. Mirrors the list on vivacapital.in
// (logos copied from there into /banks/viva), plus IDFC First Bank, Bajaj
// Finserv, IndusInd Bank, State Bank of India and Bank of Baroda.
// Other lenders we work with are not shown here.
export const BANK_PARTNERS: BankPartner[] = [
  { name: "HDFC Bank", logo: "/banks/viva/hdfc.svg" },
  { name: "ICICI Bank", logo: "/banks/viva/icici.svg" },
  { name: "Axis Bank", logo: "/banks/viva/axis.svg" },
  { name: "Kotak Mahindra Bank", logo: "/banks/viva/kotak.svg" },
  { name: "Yes Bank", logo: "/banks/viva/yes.svg" },
  { name: "IDFC First Bank", logo: "/banks/idfc-first-bank.svg" },
  { name: "IndusInd Bank", logo: "/banks/indusind-bank-new.svg", small: true },
  { name: "Standard Chartered", logo: "/banks/viva/standard-chartered.svg" },
  { name: "Tata Capital", logo: "/banks/viva/tata-capital.jpg" },
  { name: "Aditya Birla Capital", logo: "/banks/viva/aditya-birla.svg" },
  { name: "Godrej Capital", logo: "/banks/viva/godrej.png" },
  { name: "State Bank of India", logo: "/banks/sbi.svg" },
  { name: "Bajaj Finserv", logo: "/banks/bajaj-finserv.svg" },
  { name: "Bank of Baroda", logo: "/banks/bank-of-baroda.svg" },
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
