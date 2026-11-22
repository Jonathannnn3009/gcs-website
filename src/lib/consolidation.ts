import { emi } from "@/lib/finance";

export type DebtKind = "Personal loan" | "Credit card" | "Home loan" | "Business loan" | "Machine loan" | "Loan against property" | "Other loan";

/** One thing the customer owes today. `monthsLeft` is optional but needed for the whole-loan comparison. */
export type Debt = { kind: DebtKind; outstanding: number; monthly: number; monthsLeft?: number };

/** What the customer is thinking of: their own assumptions, never a lender's offer. */
export type Proposal = { ratePct: number; years: number; feePct: number; closingCharges: number };

export type ConsolidationResult = {
  outstanding: number;
  currentMonthly: number;
  newEmi: number;
  /** Positive: the monthly outgo falls. Negative: it rises. */
  monthlyDifference: number;
  fee: number;
  /** What is left to pay on the existing debts at today's payments, or null when months left are missing for any of them. */
  currentTotal: number | null;
  /** All new EMIs, plus the fee and the charges for closing the old loans. */
  newTotal: number;
  /** Positive: less paid overall. Negative: more paid overall. Null when the current total is unknown. */
  overallDifference: number | null;
  /** The new loan runs longer than the longest existing one: a lower EMI may then cost more in total. */
  longer: boolean | null;
  newMonths: number;
};

/**
 * Puts today's payments next to one loan that replaces them. It never says the customer will save: it shows both the
 * monthly change and the whole-loan cost, because a lower EMI often just means a longer loan.
 */
export function consolidate(debts: Debt[], p: Proposal): ConsolidationResult {
  const valid = debts.filter((d) => d.outstanding > 0);
  const outstanding = valid.reduce((s, d) => s + d.outstanding, 0);
  const currentMonthly = valid.reduce((s, d) => s + Math.max(0, d.monthly), 0);
  const newMonths = Math.max(1, Math.round(p.years * 12));
  const newEmi = outstanding > 0 ? emi(outstanding, p.ratePct, p.years) : 0;
  const fee = (outstanding * Math.max(0, p.feePct)) / 100;
  const newTotal = newEmi * newMonths + fee + Math.max(0, p.closingCharges);
  const known = valid.length > 0 && valid.every((d) => (d.monthsLeft ?? 0) > 0 && d.monthly > 0);
  const currentTotal = known ? valid.reduce((s, d) => s + d.monthly * (d.monthsLeft as number), 0) : null;
  const longest = known ? Math.max(...valid.map((d) => d.monthsLeft as number)) : null;
  return {
    outstanding,
    currentMonthly,
    newEmi,
    monthlyDifference: currentMonthly - newEmi,
    fee,
    currentTotal,
    newTotal,
    overallDifference: currentTotal === null ? null : currentTotal - newTotal,
    longer: longest === null ? null : newMonths > longest,
    newMonths,
  };
}
