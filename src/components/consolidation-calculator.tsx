import { useMemo, useState } from "react";
import { Plus, Trash2, AlertTriangle } from "lucide-react";
import { CalcExpertButton } from "@/components/calc-expert-button";
import { consolidate, type Debt, type DebtKind } from "@/lib/consolidation";
import { formatCurrency, formatINR } from "@/lib/finance";

const KINDS: DebtKind[] = ["Personal loan", "Credit card", "Home loan", "Business loan", "Machine loan", "Loan against property", "Other loan"];
const MAX_ROWS = 8;
const FIELD = "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground dark:bg-card";

type Row = { kind: DebtKind; outstanding: string; monthly: string; monthsLeft: string; other?: string };
const blank = (kind: DebtKind = "Personal loan"): Row => ({ kind, outstanding: "", monthly: "", monthsLeft: "" });
const num = (s: string) => {
  const n = Number(s.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

export function ConsolidationCalculator() {
  // Example figures only, so the page shows a working result; the customer replaces them.
  const [rows, setRows] = useState<Row[]>([
    { kind: "Personal loan", outstanding: "500000", monthly: "16000", monthsLeft: "36" },
    { kind: "Personal loan", outstanding: "300000", monthly: "10000", monthsLeft: "36" },
    { kind: "Credit card", outstanding: "200000", monthly: "8000", monthsLeft: "30" },
  ]);
  const [rate, setRate] = useState("14");
  const [years, setYears] = useState("5");
  const [feePct, setFeePct] = useState("2");
  const [closing, setClosing] = useState("0");

  const debts: Debt[] = rows.map((r) => ({ kind: r.kind, outstanding: num(r.outstanding), monthly: num(r.monthly), ...(num(r.monthsLeft) > 0 ? { monthsLeft: num(r.monthsLeft) } : {}) }));
  const result = useMemo(
    () => consolidate(debts, { ratePct: num(rate), years: Math.max(num(years), 0.5), feePct: num(feePct), closingCharges: num(closing) }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rows, rate, years, feePct, closing],
  );
  const set = (i: number, patch: Partial<Row>) => setRows((rs) => rs.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  const empty = result.outstanding <= 0;

  return (
    <div className="glass-card p-6 sm:p-8" id="consolidation">
      <div className="mb-6">
        <p className="eyebrow">Loan Consolidation Calculator</p>
        <h3 className="mt-2 text-2xl font-extrabold sm:text-3xl">
          One EMI instead of many: <span className="gold-text-static">what does it really cost?</span>
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Add what you owe today. Then try an example new loan. The figures start as examples. Change every one of them to your own.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-sm font-bold text-navy dark:text-white">What you owe today</p>
            <div className="mt-3 space-y-3">
              {rows.map((r, i) => (
                <div key={i} className="rounded-xl border border-border p-3">
                  <div className="flex items-center gap-2">
                    <select aria-label={`Type of dues ${i + 1}`} className={FIELD} value={r.kind} onChange={(e) => set(i, { kind: e.target.value as DebtKind })}>
                      {KINDS.map((k) => (
                        <option key={k}>{k}</option>
                      ))}
                    </select>
                    {rows.length > 1 && (
                      <button type="button" aria-label={`Remove row ${i + 1}`} onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))} className="rounded p-2 text-muted-foreground hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  {r.kind === "Other loan" && (
                    <input aria-label={`Name of the other loan ${i + 1}`} placeholder="Which loan is it? e.g. gold loan, vehicle loan" className={`${FIELD} mt-2`} value={r.other ?? ""} onChange={(e) => set(i, { other: e.target.value })} />
                  )}
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    <label className="flex flex-col justify-between gap-1 text-[11px] font-semibold text-muted-foreground">
                      Still to pay (₹)
                      <input inputMode="numeric" className={FIELD} value={r.outstanding} onChange={(e) => set(i, { outstanding: e.target.value })} />
                    </label>
                    <label className="flex flex-col justify-between gap-1 text-[11px] font-semibold text-muted-foreground">
                      {r.kind === "Credit card" ? "Usual monthly payment (₹)" : "EMI each month (₹)"}
                      <input inputMode="numeric" className={FIELD} value={r.monthly} onChange={(e) => set(i, { monthly: e.target.value })} />
                    </label>
                    <label className="flex flex-col justify-between gap-1 text-[11px] font-semibold text-muted-foreground">
                      Months left
                      <input inputMode="numeric" className={FIELD} value={r.monthsLeft} onChange={(e) => set(i, { monthsLeft: e.target.value })} />
                    </label>
                  </div>
                </div>
              ))}
            </div>
            {rows.length < MAX_ROWS && (
              <button type="button" onClick={() => setRows((rs) => [...rs, blank()])} className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-gold-dark">
                <Plus className="h-4 w-4" /> Add another loan or card
              </button>
            )}
          </div>

          <div>
            <p className="text-sm font-bold text-navy dark:text-white">The new loan you are thinking of (your own assumptions)</p>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <label className="flex flex-col justify-between gap-1 text-[11px] font-semibold text-muted-foreground">
                Interest rate (% a year)
                <input inputMode="decimal" className={FIELD} value={rate} onChange={(e) => setRate(e.target.value)} />
              </label>
              <label className="flex flex-col justify-between gap-1 text-[11px] font-semibold text-muted-foreground">
                Years to repay
                <input inputMode="decimal" className={FIELD} value={years} onChange={(e) => setYears(e.target.value)} />
              </label>
              <label className="flex flex-col justify-between gap-1 text-[11px] font-semibold text-muted-foreground">
                Processing fee (%)
                <input inputMode="decimal" className={FIELD} value={feePct} onChange={(e) => setFeePct(e.target.value)} />
              </label>
              <label className="flex flex-col justify-between gap-1 text-[11px] font-semibold text-muted-foreground">
                Charges to close old loans (₹)
                <input inputMode="numeric" className={FIELD} value={closing} onChange={(e) => setClosing(e.target.value)} />
              </label>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              These are not a lender's offer. The rate, fee and charges depend on the lender and on your profile.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="relative overflow-hidden rounded-2xl border border-gold/20 panel-light p-6 sm:p-8">
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-gold/10 blur-[50px]" />
            {empty ? (
              <p className="relative text-sm text-muted-foreground">Enter what you owe to see the comparison.</p>
            ) : (
              <>
                <div className="relative grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">You pay each month now</p>
                    <p className="mt-1 text-xl font-extrabold text-foreground">{formatINR(result.currentMonthly)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">One new EMI would be</p>
                    <p className="mt-1 text-xl font-extrabold text-gold">{formatINR(result.newEmi)}</p>
                  </div>
                </div>
                <p className="relative mt-4 text-center text-sm text-muted-foreground">
                  Total to be refinanced: <strong className="text-foreground">{formatCurrency(result.outstanding)}</strong>. The monthly payment would{" "}
                  {result.monthlyDifference >= 0 ? "fall" : "rise"} by{" "}
                  <strong className="text-foreground">{formatINR(Math.abs(result.monthlyDifference))}</strong>.
                </p>
                <div className="relative mt-5 h-px w-full bg-gold/20" />
                {result.currentTotal !== null && result.overallDifference !== null ? (
                  <div className="relative mt-5 grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Total you would still pay now</p>
                      <p className="mt-1 text-lg font-extrabold text-foreground">{formatCurrency(result.currentTotal)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Total under the new loan (with fee)</p>
                      <p className="mt-1 text-lg font-extrabold text-foreground">{formatCurrency(result.newTotal)}</p>
                    </div>
                    <p className="col-span-2 text-sm font-semibold text-navy dark:text-white">
                      {result.overallDifference >= 0
                        ? `On these assumptions you would pay about ${formatCurrency(result.overallDifference)} less in total.`
                        : `On these assumptions you would pay about ${formatCurrency(Math.abs(result.overallDifference))} more in total.`}
                    </p>
                  </div>
                ) : (
                  <p className="relative mt-5 text-center text-sm text-muted-foreground">
                    Fill in the months left on every loan or card to see what you would pay in total, not just each month.
                  </p>
                )}
                {(result.longer || (result.overallDifference !== null && result.overallDifference < 0)) && (
                  <p className="relative mt-4 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-left text-xs text-amber-900">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    A lower monthly payment often just means a longer loan. A longer loan can cost more in total, even at a lower rate.
                  </p>
                )}
              </>
            )}
          </div>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            This is a simple comparison to help you think, not a lender's offer, not an approval and not a promise of savings. Whether you qualify, and on what terms, depends on the lender's policy, your profile and credit assessment.
          </p>
          <CalcExpertButton />
        </div>
      </div>
    </div>
  );
}
