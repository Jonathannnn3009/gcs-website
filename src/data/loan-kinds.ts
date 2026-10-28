// The kinds of loan each loan page offers (asked first in the second form), and what each kind already answers there.

export const LOAN_KINDS: Record<string, string[]> = {
  "loan-against-property": [
    "Loan Against Property (LAP)",
    "LAP Balance Transfer",
    "LAP Balance Transfer + Top-Up",
    "LAP Top-Up Loan",
    "Commercial Purchase Loan",
    "LAP Overdraft",
    "Lease Rental Discounting",
  ],
  "micro-lap": [
    "Micro LAP",
    "Micro LAP Top-Up",
    "Micro LAP Balance Transfer",
    "Micro LAP Top-Up + Balance Transfer",
  ],
  dlod: [
    "Drop-Line Overdraft (DOD)",
    "Drop-Line Overdraft Balance Transfer",
    "Drop-Line Overdraft Top-Up",
  ],
  "project-funding": [
    "Land Purchase Loan",
    "Construction Finance",
    "Project Term Loan",
    "Inventory Funding",
    "Lease Rental Discounting",
    "Structured / Mezzanine Funding",
  ],
  "business-loan": [
    "Unsecured Business Loan",
    "Secured Business Loan",
    "Business Term Loan",
    "Working Capital Loan",
    "Business Loan Balance Transfer",
    "Business Loan Top-Up",
  ],
  "micro-business-loan": [
    "Micro Business Loan",
    "Micro Business Loan Balance Transfer",
    "Micro Business Loan Top-Up",
    "Micro Business Loan Top-Up + Balance Transfer",
  ],
  "unsecured-dod": [
    "Unsecured Drop-Line Overdraft",
    "Unsecured Overdraft",
    "Unsecured Overdraft Balance Transfer",
    "Unsecured Overdraft Top-Up",
    "Unsecured Overdraft Balance Transfer + Top-Up",
  ],
  "professional-loan": [
    "Professional Loan",
    "Doctor Loan",
    "CA / CS Loan",
    "Architect and Engineer Loan",
    "Practice Setup Loan",
    "Equipment Purchase Loan",
    "Professional Overdraft",
  ],
  "private-funding": [
    "Private Business Funding",
    "Short-Term Working Capital Funding",
    "Business Opportunity Funding",
    "Obligation Funding",
    "Top-Up for Repeat Customers",
  ],
  cgtmse: [
    "CGTMSE Term Loan",
    "CGTMSE Working Capital",
    "CGTMSE Composite Loan",
    "CGTMSE for Services",
    "CGTMSE for Trading",
    "Non-Fund Based Facilities",
  ],
  "machine-loan": [
    "New Machinery Loan",
    "Used Machinery Loan",
    "Medical Equipment Loan",
    "Genset Loan",
    "Equipment Leasing",
    "Loan Against Machinery",
  ],
  "working-capital-term-loan": [
    "Working Capital Term Loan",
    "Cash Credit / Overdraft Regularisation",
    "Debt Consolidation Loan",
    "Seasonal Working Capital",
    "Working Capital Top-Up",
  ],
  "cash-credit": [
    "Cash Credit against Stock and Debtors",
    "Cash Credit against Receivables",
    "Secured Cash Credit",
    "Cash Credit Limit Enhancement",
    "Cash Credit Takeover",
  ],
  "overdraft-limit": [
    "Overdraft against Property",
    "Overdraft against Fixed Deposits",
    "Overdraft against Securities",
    "Unsecured Overdraft",
    "Drop-Line Overdraft",
    "Overdraft Balance Transfer",
  ],
  "bank-guarantee": [
    "Performance Guarantee",
    "Financial Guarantee",
    "Bid Bond / Tender Guarantee (EMD)",
    "Advance Payment Guarantee",
    "Retention Money Guarantee",
    "Shipping Guarantee",
    "Customs and Excise Guarantee",
    "Warranty Guarantee",
  ],
  "letter-of-credit": [
    "Inland Letter of Credit",
    "Import Letter of Credit",
    "Sight Letter of Credit",
    "Usance Letter of Credit",
    "Standby Letter of Credit",
    "Revolving Letter of Credit",
    "Back-to-Back Letter of Credit",
    "Red Clause / Green Clause Credit",
  ],
  "bill-discounting": [
    "Sales Bill Discounting",
    "Supplier Bill Discounting",
    "LC Bill Discounting",
    "Invoice Discounting",
    "Factoring",
    "Vendor / Dealer Finance",
    "TReDS Invoice Financing",
  ],
  "personal-loan": [
    "Personal Loan",
    "Wedding Loan",
    "Travel Loan",
    "Medical Loan",
    "Home Renovation Loan",
    "Debt Consolidation Loan",
    "Personal Loan Balance Transfer",
  ],
  "education-loan": [
    "Education Loan",
    "Secured Education Loan",
    "Unsecured Education Loan",
    "Diploma and Skill Course Loan",
    "Undergraduate, Postgraduate and Doctorate Loan",
  ],
  "new-car-loan": [
    "New Car Loan",
    "Electric Vehicle Loan",
    "Luxury Car Loan",
    "Car Loan for Business Use",
  ],
  "used-car-loan": [
    "Used Car Loan from a Dealer",
    "Used Car Loan from a Private Owner",
    "Used Car Loan Balance Transfer",
    "Used Car Loan Top-Up",
    "Used Car Loan Top-Up + Balance Transfer",
  ],
  "car-refinance": [
    "Loan Against Car",
    "Car Loan Balance Transfer",
    "Car Loan Top-Up",
    "Car Loan Balance Transfer + Top-Up",
  ],
  "loan-against-securities": [
    "Loan Against Shares",
    "Loan Against Mutual Funds",
    "Loan Against ETFs",
    "Loan Against Bonds and Government Securities",
  ],
  "commercial-vehicle": [
    "New Commercial Vehicle Loan",
    "Used Commercial Vehicle Loan",
    "Commercial Vehicle Balance Transfer",
    "Commercial Vehicle Top-Up",
  ],
  "lease-rental-discounting": [
    "Lease Rental Discounting (LRD)",
    "LRD Balance Transfer",
    "LRD Top-Up",
  ],
};

const OVERDRAFTS = ["unsecured-dod", "dlod", "overdraft-limit"];

/** Answers a chosen kind of loan already gives to the second form's questions. */
export function seedsForKind(slug: string, kind: string): Record<string, string> {
  const is = (...kinds: string[]) => kinds.includes(kind);
  const out: Record<string, string> = {};
  const add = (o: Record<string, string>) => Object.assign(out, o);

  if (slug === "business-loan" && is("Working Capital Loan")) add({ purpose: "Working capital" });
  if (slug === "private-funding") {
    if (is("Short-Term Working Capital Funding")) add({ purpose: "Short-term cash flow" });
    if (is("Business Opportunity Funding")) add({ purpose: "A business opportunity" });
    if (is("Obligation Funding")) add({ purpose: "An existing business obligation" });
  }
  if (slug === "cgtmse") {
    if (is("CGTMSE Term Loan")) add({ structure: "A term loan" });
    if (is("CGTMSE Working Capital")) add({ structure: "A working capital limit" });
    if (is("CGTMSE Composite Loan")) add({ structure: "Both" });
    if (is("CGTMSE for Services")) add({ activity: "Services" });
    if (is("CGTMSE for Trading")) add({ activity: "Trading" });
  }
  if (slug === "machine-loan") {
    if (is("New Machinery Loan")) add({ equipment: "Machinery for production", condition: "New" });
    if (is("Used Machinery Loan"))
      add({ equipment: "Machinery for production", condition: "Used" });
    if (is("Medical Equipment Loan")) add({ equipment: "Medical equipment" });
    if (is("Genset Loan")) add({ equipment: "A genset" });
    if (is("Equipment Leasing")) add({ equipment: "Equipment on lease" });
  }
  if (slug === "project-funding") {
    if (is("Land Purchase Loan")) add({ stage: "Still to buy the land" });
    if (is("Construction Finance")) add({ stage: "Under construction" });
    if (is("Inventory Funding", "Lease Rental Discounting"))
      add({ stage: "Built, with units left to sell or let" });
  }
  if (OVERDRAFTS.includes(slug)) {
    if (/Balance Transfer \+ Top-Up/.test(kind))
      add({ requirement: "Move it and add more funding" });
    else if (/Balance Transfer/.test(kind))
      add({ requirement: "Move my present overdraft or loan" });
  }
  if (slug === "overdraft-limit") {
    if (is("Overdraft against Property")) add({ securityKind: "Against a property" });
    else if (/Fixed Deposits|Securities/.test(kind))
      add({ securityKind: "Against fixed deposits or securities" });
    else if (is("Unsecured Overdraft")) add({ securityKind: "Without security" });
  }
  if (slug === "working-capital-term-loan") {
    if (is("Cash Credit / Overdraft Regularisation"))
      add({ gapCause: "To regularise a stretched cash credit or overdraft" });
    if (is("Debt Consolidation Loan")) add({ gapCause: "To consolidate several short-term dues" });
    if (is("Seasonal Working Capital")) add({ gapCause: "A seasonal build-up of stock" });
  }
  if (slug === "bank-guarantee") {
    if (is("Performance Guarantee")) add({ bgType: "Performance guarantee" });
    if (is("Financial Guarantee")) add({ bgType: "Financial guarantee" });
    if (is("Bid Bond / Tender Guarantee (EMD)")) add({ bgType: "Bid bond or EMD" });
    if (is("Advance Payment Guarantee")) add({ bgType: "Advance-payment guarantee" });
  }
  if (slug === "letter-of-credit") {
    if (is("Inland Letter of Credit")) add({ lcType: "Inland (within India)" });
    if (is("Import Letter of Credit")) add({ lcType: "Import" });
    if (is("Sight Letter of Credit")) add({ usance: "At sight, when the documents arrive" });
  }
  if (slug === "professional-loan") {
    if (is("Practice Setup Loan")) add({ purpose: "Setting up or moving a practice" });
    if (is("Equipment Purchase Loan")) add({ purpose: "Buying equipment" });
  }
  if (slug === "personal-loan") {
    if (is("Wedding Loan")) add({ purpose: "Wedding" });
    if (is("Travel Loan")) add({ purpose: "Travel" });
    if (is("Medical Loan")) add({ purpose: "Medical need" });
    if (is("Home Renovation Loan")) add({ purpose: "Home renovation" });
    if (is("Debt Consolidation Loan")) add({ purpose: "Repaying other loans" });
  }
  if (slug === "education-loan" && is("Diploma and Skill Course Loan"))
    add({ level: "Diploma or certificate" });
  if (slug === "new-car-loan" && is("Car Loan for Business Use")) add({ usage: "Business use" });
  if (slug === "used-car-loan") {
    if (/Dealer/.test(kind)) add({ seller: "A dealer" });
    if (/Private Owner/.test(kind)) add({ seller: "A private owner" });
  }
  if (slug === "car-refinance") {
    if (is("Loan Against Car")) add({ carLoan: "No" });
    if (/Balance Transfer|Top-Up/.test(kind)) add({ carLoan: "Yes" });
    if (/Balance Transfer/.test(kind)) add({ carLoanTakeover: "Yes" });
  }
  if (slug === "commercial-vehicle") {
    if (kind.startsWith("New")) add({ condition: "New" });
    if (kind.startsWith("Used")) add({ condition: "Used" });
  }
  if (slug === "loan-against-securities") {
    if (is("Loan Against Shares")) add({ holding: "Shares" });
    if (is("Loan Against Mutual Funds")) add({ holding: "Mutual funds" });
    if (is("Loan Against ETFs")) add({ holding: "ETFs" });
    if (is("Loan Against Bonds and Government Securities")) add({ holding: "Bonds" });
  }
  // A balance transfer or top-up means a loan is already running on the property.
  const ownProperty = [
    "loan-against-property",
    "micro-lap",
    "lease-rental-discounting",
    "dlod",
    "unsecured-dod",
    "overdraft-limit",
  ];
  if (ownProperty.includes(slug) && /Balance Transfer|Top-Up/.test(kind))
    add({ existingMortgage: "Yes" });
  return out;
}

const INDUSTRIES = [
  "Manufacturing",
  "Trading or distribution",
  "Retail",
  "Services",
  "IT and software",
  "Healthcare",
  "Education",
  "Real estate and construction",
  "Transport and logistics",
  "Hospitality and food",
  "Agriculture",
  "Export or import",
];

const MACHINE_INDUSTRIES = [
  "Engineering & Manufacturing",
  "Automobile",
  "Textile",
  "Food Processing",
  "Pharma / Healthcare",
  "Plastic",
  "Printing & Packaging",
  "Metal Fabrication",
  "Chemicals",
  "Electrical / Electronics",
  "Construction Materials",
  "Agro Processing",
  "Jewellery",
  "Medical / Diagnostic",
  "Wood, Furniture & Plywood",
  "Rubber Products",
  "Cold Storage & Refrigeration",
];

const PROFESSIONS = [
  "Doctor or dentist",
  "Chartered Accountant",
  "Company Secretary",
  "Architect",
  "Engineer",
  "Lawyer",
];

/** Questions asked in the second form right after the type of loan, for loans whose short form no longer asks them. */
export const LOAN_EXTRAS: Record<string, { key: string; label: string; options: string[] }[]> = {
  "business-loan": [{ key: "nature", label: "Industry", options: INDUSTRIES }],
  "private-funding": [{ key: "nature", label: "Industry", options: INDUSTRIES }],
  "machine-loan": [{ key: "nature", label: "Type of industry", options: MACHINE_INDUSTRIES }],
  "professional-loan": [{ key: "profession", label: "Profession", options: PROFESSIONS }],
};
