let WHATSAPP_NUMBER = "918828001700";

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
  /** Social media pages; empty until staff add them in the CRM. */
  social: { facebook: "", instagram: "", linkedin: "", youtube: "", x: "" } as Record<string, string>,
};

/** Contact details staff change in the CRM (Settings -> Website content). Applied once, at load. */
export type SiteInfoContact = {
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  hours?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  x?: string;
};

export function applyContactInfo(info: SiteInfoContact) {
  const digits = (info.phone ?? "").replace(/\D/g, "");
  if (info.phone?.trim() && digits.length >= 10) {
    CONTACT.phone = info.phone.trim();
    CONTACT.phoneHref = `tel:+${digits.length === 10 ? "91" + digits : digits}`;
  }
  const wa = (info.whatsapp ?? "").replace(/\D/g, "");
  if (wa.length >= 10) {
    WHATSAPP_NUMBER = wa.length === 10 ? `91${wa}` : wa;
    CONTACT.whatsapp = WHATSAPP_NUMBER;
    CONTACT.whatsappLink = waLink();
  }
  for (const k of ["facebook", "instagram", "linkedin", "youtube", "x"] as const) {
    const v = info[k]?.trim();
    if (v && /^https?:\/\//i.test(v)) CONTACT.social[k] = v;
  }
  if (info.email?.trim()) CONTACT.email = info.email.trim();
  if (info.hours?.trim()) CONTACT.hours = info.hours.trim();
  if (info.address?.trim()) {
    CONTACT.address = info.address.trim();
    CONTACT.mapsLink =
      "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CONTACT.address);
  }
}

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
    title: "Balance Transfer & Top-Up",
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
    id: "working-capital-term-loan",
    title: "Working Capital Term Loan",
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
// Order is deliberate: the strip splits into two rows at the halfway point, and look-alike
// logos (Axis, ICICI, HDFC, Aditya Birla, Bajaj) are kept far apart or on different rows.
export const BANK_PARTNERS: BankPartner[] = [
  { name: "HDFC Bank", logo: "/banks/network/hdfc-bank.png" },
  { name: "Tata Capital", logo: "/banks/network/tata-capital.png" },
  { name: "Axis Bank", logo: "/banks/network/axis-bank.png" },
  { name: "Auxilo", logo: "/banks/network/auxilo.png" },
  { name: "Bandhan Bank", logo: "/banks/network/bandhan-bank.png" },
  { name: "ICICI Bank", logo: "/banks/network/icici-bank.png" },
  { name: "SMFG Grihashakti", logo: "/banks/network/smfg-grihashakti.png" },
  { name: "Avanse Financial Services", logo: "/banks/network/avanse-financial-services.png" },
  { name: "Aditya Birla Capital", logo: "/banks/network/aditya-birla-capital.png" },
  { name: "Federal Bank", logo: "/banks/network/federal-bank.png" },
  { name: "Bajaj Finserv", logo: "/banks/network/bajaj-finserv.png" },
  { name: "Bajaj Housing Finance", logo: "/banks/network/bajaj-housing-finance.png" },
  { name: "IDBI Bank", logo: "/banks/network/idbi-bank.png" },
  { name: "Cholamandalam", logo: "/banks/network/cholamandalam.png" },
  { name: "Kotak Mahindra Bank", logo: "/banks/network/kotak-mahindra-bank.png" },
  { name: "City Union Bank", logo: "/banks/network/city-union-bank.png" },
  { name: "Poonawalla Fincorp", logo: "/banks/network/poonawalla-fincorp.png" },
  { name: "Union Bank of India", logo: "/banks/network/union-bank-of-india.png" },
  { name: "Piramal Finance", logo: "/banks/network/piramal-finance.png" },
  { name: "CLIX Capital", logo: "/banks/network/clix-capital.png" },
  { name: "SBI Home Loans", logo: "/banks/network/sbi-home-loans.png" },
  { name: "Bank of Baroda", logo: "/banks/network/bank-of-baroda.png" },
  { name: "IIFL Finance", logo: "/banks/network/iifl-finance.png" },
  { name: "HDB Financial Services", logo: "/banks/network/hdb-financial-services.png" },
  { name: "Truhome Finance", logo: "/banks/network/truhome-finance.png" },
  { name: "Godrej Capital", logo: "/banks/network/godrej-capital.png" },
  { name: "DCB Bank", logo: "/banks/network/dcb-bank.png" },
  { name: "Jana Small Finance Bank", logo: "/banks/network/jana-small-finance-bank.png" },
  { name: "Yes Bank", logo: "/banks/network/yes-bank.png" },
  { name: "HSBC", logo: "/banks/network/hsbc.png" },
  { name: "Axis Finance", logo: "/banks/network/axis-finance.png" },
  { name: "Jio Credit", logo: "/banks/network/jio-credit.png" },
  { name: "Sammaan Capital", logo: "/banks/network/sammaan-capital.png" },
  { name: "Standard Chartered", logo: "/banks/network/standard-chartered.png" },
  { name: "Aditya Birla Finance", logo: "/banks/network/aditya-birla-finance.png" },
  { name: "Kuhoo", logo: "/banks/network/kuhoo.png" },
  { name: "LIC Housing Finance", logo: "/banks/network/lic-housing-finance.png" },
  { name: "Bajaj Finance", logo: "/banks/network/bajaj-finance.svg" },
  { name: "Deutsche Bank", logo: "/banks/network/deutsche-bank.svg" },
  { name: "Saraswat Bank", logo: "/banks/network/saraswat-bank.png" },
  { name: "ICICI Home Finance", logo: "/banks/network/icici-home-finance.png" },
  { name: "IndusInd Bank", logo: "/banks/network/indusind-bank.png" },
  { name: "Edelweiss", logo: "/banks/network/edelweiss.png" },
  { name: "Utkarsh Small Finance Bank", logo: "/banks/network/utkarsh-small-finance-bank.png" },
  { name: "PNB Housing Finance", logo: "/banks/network/pnb-housing-finance.png" },
  { name: "Bank of India", logo: "/banks/network/bank-of-india.png" },
  { name: "L&T Finance", logo: "/banks/network/l-t-finance.svg" },
  { name: "Aadhar Housing Finance", logo: "/banks/network/aadhar-housing-finance.png" },
  { name: "IDFC First Bank", logo: "/banks/network/idfc-first-bank.png" },
  { name: "AU Small Finance Bank", logo: "/banks/network/au-small-finance-bank.png" },
  { name: "Mahindra Finance", logo: "/banks/network/mahindra-finance.png" },
  { name: "HeroFinCorp", logo: "/banks/network/herofincorp.png" },
  { name: "Central Bank of India", logo: "/banks/network/central-bank-of-india.png" },
  { name: "UGRO Capital", logo: "/banks/network/ugro-capital.png" },
  { name: "IndoStar Capital", logo: "/banks/network/indostar-capital.png" },
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
