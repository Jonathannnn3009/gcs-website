// Which calculators belong on which page. Ids match the calculators on /tools.
export type CalcId =
  | "emi"
  | "eligibility"
  | "stamp-duty"
  | "prepayment"
  | "money-saver"
  | "balance-transfer"
  | "loan-comparison"
  | "working-capital"
  | "cgtmse"
  | "lap-ltv"
  | "credit-score";

/**
 * Loan product slug -> calculators that help someone weigh that loan. Every loan carries the EMI and
 * Eligibility calculators; the ones that only suit certain loans (property LTV, stamp duty, CGTMSE fee,
 * working capital, balance transfer...) come first on those pages.
 */
export const PRODUCT_CALCULATORS: Record<string, CalcId[]> = {
  "home-loan": ["emi", "eligibility", "stamp-duty", "prepayment", "money-saver"],
  "loan-against-property": ["lap-ltv", "emi", "eligibility"],
  "lease-rental-discounting": ["lap-ltv", "emi", "eligibility"],
  "balance-transfer": ["balance-transfer", "prepayment", "emi", "eligibility"],
  dlod: ["lap-ltv", "emi", "eligibility"],
  "business-loan": ["emi", "eligibility", "loan-comparison"],
  "micro-business-loan": ["emi", "eligibility", "loan-comparison"],
  "micro-lap": ["lap-ltv", "emi", "eligibility"],
  cgtmse: ["cgtmse", "emi", "eligibility"],
  "unsecured-dod": ["emi", "eligibility"],
  "project-funding": ["emi", "loan-comparison", "eligibility"],
  "cash-credit": ["working-capital", "emi", "eligibility"],
  "overdraft-limit": ["working-capital", "emi", "eligibility"],
  "bank-guarantee": ["working-capital", "emi", "eligibility"],
  "letter-of-credit": ["working-capital", "emi", "eligibility"],
  "bill-discounting": ["working-capital", "emi", "eligibility"],
  "working-capital-term-loan": ["working-capital", "emi", "loan-comparison", "eligibility"],
  "personal-loan": ["emi", "eligibility", "prepayment"],
  "loan-against-securities": ["emi", "eligibility"],
  "professional-loan": ["emi", "eligibility"],
  "education-loan": ["emi", "prepayment", "eligibility"],
  "education-infrastructure-loan": ["emi", "loan-comparison", "prepayment", "eligibility"],
  "new-car-loan": ["emi", "eligibility", "loan-comparison"],
  "used-car-loan": ["emi", "eligibility", "loan-comparison"],
  "car-refinance": ["balance-transfer", "emi", "prepayment", "eligibility"],
  "machine-loan": ["emi", "loan-comparison", "eligibility"],
  "commercial-vehicle": ["emi", "loan-comparison", "eligibility"],
  "private-funding": ["emi", "eligibility"],
};
