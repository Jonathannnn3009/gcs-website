// Checks shared by the forms that take an email or a rupee amount.

/** The smallest rupee figure worth taking for any typed amount (an income, a value, an EMI). */
export const MIN_AMOUNT = 1000;
/** The smallest loan, limit or funding amount a person can ask for. */
export const MIN_LOAN_AMOUNT = 50000;
/** The smallest monthly income that makes sense to enter. */
export const MIN_MONTHLY_INCOME = 5000;

/** Plausible email syntax: a name, one @, and a domain with a dot and a 2+ letter ending. No spaces, no stray dots. */
export function isValidEmail(raw: string): boolean {
  const email = (raw ?? "").trim();
  if (email.length < 6 || email.length > 160) return false;
  if (!/^[A-Za-z0-9._%+'-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/.test(email))
    return false;
  const [local = "", domain = ""] = email.split("@");
  if (local.startsWith(".") || local.endsWith(".") || local.includes("..")) return false;
  return !domain.split(".").some((part) => part.startsWith("-") || part.endsWith("-"));
}

/** True when a typed rupee amount is below the floor. Zero is accepted where the question allows "none". */
export function amountTooLow(
  value: number,
  opts: { min?: number | undefined; allowZero?: boolean | undefined } = {},
): boolean {
  if (opts.allowZero && value === 0) return false;
  return value < (opts.min ?? MIN_AMOUNT);
}

// ───────────── Realistic amounts ─────────────
// Every rupee figure a visitor types is checked against a floor and a ceiling that make sense for what it
// is: a salary is not ₹10, and a monthly EMI is not ₹50 crore. The numbers live in the tables below, so
// they can be tuned in one place.

/** The most any single figure can be: ₹1,000 crore. Anything above is almost surely a slip of the keyboard. */
export const MAX_AMOUNT = 10_000_000_000;

const LAKH = 100_000;
const CRORE = 10_000_000;

/** The smallest loan, limit or funding worth asking for, by loan page (the minimum ticket size where the page states one). */
export const LOAN_MINIMUMS: Record<string, number> = {
  "home-loan": 20 * LAKH,
  "loan-against-property": 20 * LAKH,
  "micro-lap": 3 * LAKH,
  "lease-rental-discounting": 25 * LAKH,
  dlod: 10 * LAKH,
  "project-funding": 50 * LAKH,
  "balance-transfer": 5 * LAKH,
  "business-loan": 2 * LAKH,
  "micro-business-loan": 1 * LAKH,
  "unsecured-dod": 5 * LAKH,
  "professional-loan": 1 * LAKH,
  "private-funding": 1 * CRORE,
  cgtmse: 2 * LAKH,
  "machine-loan": 1 * LAKH,
  "working-capital-term-loan": 2 * LAKH,
  "cash-credit": 5 * LAKH,
  "overdraft-limit": 2 * LAKH,
  "bank-guarantee": 1 * LAKH,
  "letter-of-credit": 5 * LAKH,
  "bill-discounting": 5 * LAKH,
  "personal-loan": 2 * LAKH,
  "education-loan": 8 * LAKH,
  "new-car-loan": 1 * LAKH,
  "used-car-loan": 50_000,
  "car-refinance": 50_000,
  "car-loan": 50_000,
  "commercial-vehicle": 2 * LAKH,
  "loan-against-securities": 1 * LAKH,
};

/** The smallest loan amount for a loan page. */
export const loanMinimum = (slug: string): number => LOAN_MINIMUMS[slug] ?? MIN_LOAN_AMOUNT;

export type AmountBounds = { min: number; max: number };

/** The range a loan amount has to fall in on the given loan page. */
export function loanAmountBounds(slug?: string): AmountBounds {
  return { min: (slug && LOAN_MINIMUMS[slug]) || MIN_LOAN_AMOUNT, max: MAX_AMOUNT };
}

// The range for each kind of figure in the detailed forms, matched by the question's key. The first match wins.
const FIELD_RULES: [RegExp, AmountBounds][] = [
  // What someone earns each month
  [/^otherIncome$/, { min: 1_000, max: 1 * CRORE }],
  [
    /^(netSalary|coApplicantIncome|coIncome|ownerIncome|monthlyIncome|nriIncome)$/,
    { min: MIN_MONTHLY_INCOME, max: 1 * CRORE },
  ],
  // What is repaid each month
  [/^emiComfort$/, { min: 2_000, max: 25 * LAKH }],
  [/^monthlyObligation$/, { min: 10_000, max: 50 * CRORE }],
  [/(Emi|^emi)$/, { min: 500, max: 2 * CRORE }],
  [/^monthlyRent$/, { min: 1_000, max: 5 * CRORE }],
  // How an account runs
  [/^monthlyCredits$/, { min: 10_000, max: 500 * CRORE }],
  [/^avgBalance$/, { min: 1_000, max: 100 * CRORE }],
  [/^invoiceVolume$/, { min: 50_000, max: 500 * CRORE }],
  // What a business turns over and earns in a year
  [/^(annualTurnover|receipts|turnover|firmTurnover)$/, { min: 1 * LAKH, max: MAX_AMOUNT }],
  [/^(annualProfit|profit)$/, { min: 10_000, max: 1_000 * CRORE }],
  [/^(avgStock|avgDebtors)$/, { min: 10_000, max: 1_000 * CRORE }],
  // What things are worth
  [/^(propertyValue|agreementValue)$/, { min: 3 * LAKH, max: MAX_AMOUNT }],
  [/^projectCost$/, { min: 10 * LAKH, max: MAX_AMOUNT }],
  [/^securityValue$/, { min: 50_000, max: MAX_AMOUNT }],
  [/^(depositValue|holdingValue)$/, { min: 25_000, max: MAX_AMOUNT }],
  [/^(workCost|collateralValue)$/, { min: 25_000, max: MAX_AMOUNT }],
  [/^onRoad$/, { min: 2 * LAKH, max: 20 * CRORE }],
  [/^(price|carValue)$/, { min: 25_000, max: 50 * CRORE }],
  [/^cost$/, { min: 10_000, max: MAX_AMOUNT }],
  [/^totalCost$/, { min: 50_000, max: 10 * CRORE }],
  [/^scholarshipAmount$/, { min: 1_000, max: 10 * CRORE }],
  // What the person puts in
  [/^(ownContribution|ownFunds|downPayment)$/, { min: 5_000, max: MAX_AMOUNT }],
  // What is still owed or asked for
  [
    /(Outstanding|outstanding|Limit|presentLimit|stretchedAmount|duesAmount|repayAmount|topUp|btExtra|DebtAmount|LimitAmount)$/,
    { min: 10_000, max: MAX_AMOUNT },
  ],
];

/** The range for a typed amount in a detailed form, by the question's key. */
export function fieldAmountBounds(key: string): AmountBounds {
  const hit = FIELD_RULES.find(([re]) => re.test(key));
  return hit ? hit[1] : { min: MIN_AMOUNT, max: MAX_AMOUNT };
}

/** A rupee figure written the Indian way: ₹25,000, ₹5 Lakh, ₹12 Cr. */
export function rupeesText(n: number): string {
  const trim = (v: number) => String(Number(v.toFixed(2)));
  if (n >= CRORE) return `₹${trim(n / CRORE)} Cr`;
  if (n >= LAKH) return `₹${trim(n / LAKH)} Lakh`;
  return `₹${new Intl.NumberFormat("en-IN").format(n)}`;
}

/** Why a typed amount is not acceptable, or null when it is. Zero passes only where "none" is a valid answer. */
export function amountProblem(
  value: number,
  bounds: AmountBounds,
  opts: { allowZero?: boolean | undefined } = {},
): string | null {
  if (!Number.isFinite(value)) return "Please enter a number";
  if (opts.allowZero && value === 0) return null;
  if (value < bounds.min)
    return opts.allowZero
      ? `Enter 0 if none, or at least ${rupeesText(bounds.min)}`
      : `That looks too low. Please enter at least ${rupeesText(bounds.min)}`;
  if (value > bounds.max)
    return `That looks too high. Please check the figure (the most we can take is ${rupeesText(bounds.max)})`;
  return null;
}

/** An interest rate typed as a percentage: between 1% and 40% a year. */
export function ratePercentProblem(value: number): string | null {
  if (!Number.isFinite(value)) return "Please enter a rate";
  if (value < 1 || value > 40) return "Please enter a yearly rate between 1% and 40%";
  return null;
}
