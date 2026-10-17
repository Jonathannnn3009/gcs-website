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
