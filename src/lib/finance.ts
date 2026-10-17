// Shared amortization math for the calculators — standard reducing-balance
// formulas used across Indian lending. Nothing here is a stub.

export function emi(principal: number, annualRatePct: number, years: number): number {
  const r = annualRatePct / 12 / 100;
  const n = years * 12;
  if (r === 0) return principal / n;
  const factor = Math.pow(1 + r, n);
  return (principal * r * factor) / (factor - 1);
}

export function principalFromEmi(monthlyEmi: number, annualRatePct: number, years: number): number {
  const r = annualRatePct / 12 / 100;
  const n = years * 12;
  if (r === 0) return monthlyEmi * n;
  const factor = Math.pow(1 + r, n);
  return (monthlyEmi * (factor - 1)) / (r * factor);
}

// Months needed to clear `principal` at a fixed `monthlyEmi` and rate.
export function tenureFromEmi(principal: number, monthlyEmi: number, annualRatePct: number): number {
  const r = annualRatePct / 12 / 100;
  if (r === 0) return principal / monthlyEmi;
  const ratio = (principal * r) / monthlyEmi;
  if (ratio >= 1) return Infinity; // EMI too small to ever cover interest
  return -Math.log(1 - ratio) / Math.log(1 + r);
}

// Outstanding balance after `monthsElapsed` payments of `monthlyEmi` on `principal` at `annualRatePct`.
export function remainingBalance(
  principal: number,
  annualRatePct: number,
  monthlyEmi: number,
  monthsElapsed: number,
): number {
  const r = annualRatePct / 12 / 100;
  if (r === 0) return Math.max(principal - monthlyEmi * monthsElapsed, 0);
  const factor = Math.pow(1 + r, monthsElapsed);
  const balance = principal * factor - (monthlyEmi * (factor - 1)) / r;
  return Math.max(balance, 0);
}

/** What a "money saver" (overdraft-style) loan works out to, month by month. */
export type MoneySaverResult = {
  /** The ordinary EMI on the full amount: what you would pay without parking any money. */
  emi: number;
  /** The average monthly payment once the interest benefit is taken off (emi minus avgMonthlySaving). */
  avgOutflow: number;
  /** The interest benefit spread evenly over the tenure. */
  avgMonthlySaving: number;
  /** The whole interest benefit: the sum of every month's benefit. Zero when nothing is parked. */
  totalSaving: number;
  /** The yearly rate the loan effectively costs after the benefit, in percent. */
  effectiveRatePct: number;
  /** Interest over the tenure with no money parked, and after the benefit. */
  interestWithout: number;
  interestNet: number;
  /** The same story year by year. */
  yearly: { year: number; opening: number; interest: number; benefit: number; outflow: number }[];
};

/**
 * A money saver loan keeps a normal repayment schedule (so the tenure stays the same) but charges
 * interest only on the balance minus the money you keep in the loan account. Each month the
 * interest on the parked money, never more than the outstanding balance, is taken off what you pay.
 * Works month by month with whole-rupee rounding, the way a lender's statement does.
 */
export function moneySaver(principal: number, annualRatePct: number, months: number, parked: number): MoneySaverResult {
  const empty: MoneySaverResult = { emi: 0, avgOutflow: 0, avgMonthlySaving: 0, totalSaving: 0, effectiveRatePct: annualRatePct, interestWithout: 0, interestNet: 0, yearly: [] };
  if (!(principal > 0) || !(months > 0) || !(annualRatePct >= 0)) return empty;
  const r = annualRatePct / 1200;
  const plain = r === 0 ? principal / months : (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  const emiAmount = Math.ceil(plain - 1e-9);
  const parkedAmount = Math.max(parked, 0);

  let balance = principal;
  let totalSaving = 0;
  let interestWithout = 0;
  let interestNet = 0;
  const yearly: MoneySaverResult["yearly"] = [];
  for (let m = 1; m <= months && balance > 0; m++) {
    const interest = Math.round((balance * annualRatePct) / 1200);
    const principalPart = balance <= emiAmount ? balance : emiAmount - interest;
    const benefit = Math.round((Math.min(parkedAmount, balance) * annualRatePct) / 1200);
    const netInterest = interest - benefit;
    const outflow = principalPart + netInterest;
    const yr = Math.ceil(m / 12);
    let row = yearly[yr - 1];
    if (!row) {
      row = { year: yr, opening: balance, interest: 0, benefit: 0, outflow: 0 };
      yearly[yr - 1] = row;
    }
    row.interest += interest;
    row.benefit += benefit;
    row.outflow += outflow;
    totalSaving += benefit;
    interestWithout += interest;
    interestNet += netInterest;
    balance -= principalPart;
  }

  const avgMonthlySaving = totalSaving / months;
  const avgOutflow = emiAmount - avgMonthlySaving;

  // The yearly rate at which payments of avgOutflow repay the loan over the same tenure.
  let effectiveRatePct = annualRatePct;
  if (avgOutflow * months > principal && avgOutflow > 0) {
    let lo = 0;
    let hi = r * 1.5 + 1e-6;
    for (let i = 0; i < 80; i++) {
      const mid = (lo + hi) / 2;
      const pv = mid === 0 ? avgOutflow * months : (avgOutflow * (1 - Math.pow(1 + mid, -months))) / mid;
      if (pv > principal) lo = mid;
      else hi = mid;
    }
    effectiveRatePct = ((lo + hi) / 2) * 1200;
  } else if (avgOutflow * months <= principal) {
    effectiveRatePct = 0;
  }

  return { emi: emiAmount, avgOutflow, avgMonthlySaving, totalSaving, effectiveRatePct, interestWithout, interestNet, yearly };
}

export function formatCurrency(n: number): string {
  if (!isFinite(n) || isNaN(n)) return "—";
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

export function formatINR(n: number): string {
  if (!isFinite(n) || isNaN(n)) return "—";
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

export function monthsToYearsMonths(months: number): string {
  if (!isFinite(months)) return "—";
  const y = Math.floor(months / 12);
  const m = Math.round(months % 12);
  if (y === 0) return `${m} mo`;
  if (m === 0) return `${y} yr`;
  return `${y} yr ${m} mo`;
}

// Indicative rates — always confirm with the state's sub-registrar.
// `stampDutyFemale` is only set where a female-buyer concession is
// reasonably well documented. Delhi, Maharashtra and Haryana genuinely
// charge less when the property is registered solely in a woman's name;
// left unset for Rajasthan and UP, where cited figures conflict (Rajasthan)
// or the concession is capped by property value rather than a flat
// percentage-point cut (UP) — not modelled here rather than guessed.
export const STAMP_DUTY_RATES: Record<
  string,
  { stampDuty: number; stampDutyFemale?: number; registration: number }
> = {
  Delhi: { stampDuty: 6, stampDutyFemale: 4, registration: 1 },
  Maharashtra: { stampDuty: 5, stampDutyFemale: 4, registration: 1 },
  Karnataka: { stampDuty: 5, registration: 1 },
  "Tamil Nadu": { stampDuty: 7, registration: 1 },
  "Uttar Pradesh": { stampDuty: 7, registration: 1 },
  Haryana: { stampDuty: 6, stampDutyFemale: 4, registration: 1 },
  Gujarat: { stampDuty: 4.9, registration: 1 },
  Telangana: { stampDuty: 5.5, registration: 0.5 },
  "West Bengal": { stampDuty: 6, registration: 1 },
  Rajasthan: { stampDuty: 6, registration: 1 },
};
