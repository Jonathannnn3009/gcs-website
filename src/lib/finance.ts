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
export const STAMP_DUTY_RATES: Record<string, { stampDuty: number; registration: number }> = {
  Delhi: { stampDuty: 6, registration: 1 },
  Maharashtra: { stampDuty: 5, registration: 1 },
  Karnataka: { stampDuty: 5, registration: 1 },
  "Tamil Nadu": { stampDuty: 7, registration: 1 },
  "Uttar Pradesh": { stampDuty: 7, registration: 1 },
  Haryana: { stampDuty: 6, registration: 1 },
  Gujarat: { stampDuty: 4.9, registration: 1 },
  Telangana: { stampDuty: 5.5, registration: 0.5 },
  "West Bengal": { stampDuty: 6, registration: 1 },
  Rajasthan: { stampDuty: 6, registration: 1 },
};
