// Which calculators belong on which page. Ids match the calculators on /tools.
export type CalcId =
  | "emi"
  | "eligibility"
  | "stamp-duty"
  | "prepayment"
  | "balance-transfer"
  | "loan-comparison"
  | "working-capital"
  | "cgtmse"
  | "lap-ltv"
  | "credit-score";

/** Loan product slug -> calculators that help someone weigh that loan, most relevant first. */
export const PRODUCT_CALCULATORS: Record<string, CalcId[]> = {
  "home-loan": ["emi", "eligibility", "stamp-duty", "prepayment"],
  "loan-against-property": ["lap-ltv", "emi", "eligibility"],
  "lease-rental-discounting": ["lap-ltv", "emi"],
  "balance-transfer": ["balance-transfer", "prepayment", "emi"],
  dlod: ["lap-ltv", "emi"],
  "business-loan": ["emi", "eligibility", "loan-comparison"],
  cgtmse: ["cgtmse", "emi"],
  "unsecured-term-loan": ["emi", "eligibility", "loan-comparison"],
  "unsecured-dod": ["emi"],
  "project-funding": ["emi", "loan-comparison"],
  "working-capital": ["working-capital", "emi"],
  "cash-credit": ["working-capital"],
  "overdraft-limit": ["working-capital"],
  "bank-guarantee": ["working-capital"],
  "letter-of-credit": ["working-capital"],
  "working-capital-term-loan": ["working-capital", "emi"],
  "personal-loan": ["emi", "eligibility", "prepayment"],
  "loan-against-securities": ["emi"],
  "loan-against-mutual-funds": ["emi"],
  "professional-loan": ["emi", "eligibility"],
  "education-loan": ["emi", "prepayment"],
  "new-car-loan": ["emi", "eligibility", "loan-comparison"],
  "used-car-loan": ["emi", "eligibility", "loan-comparison"],
  "car-refinance": ["balance-transfer", "emi", "prepayment"],
  "machine-loan": ["emi", "loan-comparison"],
  "commercial-vehicle": ["emi", "loan-comparison"],
};
