import { useState, useMemo } from "react";
import { formatCurrency, formatINR, monthsToYearsMonths, tenureFromEmi } from "@/lib/finance";

export function PrepaymentCalculator() {
  const [principal, setPrincipal] = useState(4000000);
  const [rate, setRate] = useState(9);
  const [emiAmount, setEmiAmount] = useState(38000);
  const [prepayment, setPrepayment] = useState(500000);

  const result = useMemo(() => {
    const originalMonths = tenureFromEmi(principal, emiAmount, rate);
    const newPrincipal = Math.max(principal - prepayment, 0);
    const newMonths = newPrincipal === 0 ? 0 : tenureFromEmi(newPrincipal, emiAmount, rate);
    const monthsSaved = isFinite(originalMonths) ? originalMonths - newMonths : 0;
    const oldTotalInterest = isFinite(originalMonths) ? emiAmount * originalMonths - principal : 0;
    const newTotalInterest = newPrincipal === 0 ? 0 : emiAmount * newMonths - newPrincipal;
    return { originalMonths, newMonths, monthsSaved, interestSaved: oldTotalInterest - newTotalInterest };
  }, [principal, rate, emiAmount, prepayment]);

  return (
    <div className="glass-card p-6 sm:p-8" id="prepayment">
      <div className="mb-6">
        <p className="eyebrow">Prepayment Calculator</p>
        <h3 className="mt-2 text-2xl font-extrabold sm:text-3xl">
          See how much a <span className="gold-text-static">lump sum saves</span>
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Estimate the tenure and interest you'll save by making a part-prepayment, keeping your EMI unchanged.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-7">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Outstanding Principal</label>
              <span className="rounded-lg bg-secondary px-3 py-1 text-sm font-bold text-gold-dark">
                {formatCurrency(principal)}
              </span>
            </div>
            <input
              type="range"
              min={100000}
              max={100000000}
              step={100000}
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="w-full"
              aria-label="Outstanding principal"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Current EMI</label>
              <span className="rounded-lg bg-secondary px-3 py-1 text-sm font-bold text-gold-dark">
                {formatINR(emiAmount)}
              </span>
            </div>
            <input
              type="range"
              min={2000}
              max={1000000}
              step={1000}
              value={emiAmount}
              onChange={(e) => setEmiAmount(Number(e.target.value))}
              className="w-full"
              aria-label="Current EMI"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Interest Rate (p.a.)</label>
              <span className="rounded-lg bg-secondary px-3 py-1 text-sm font-bold text-gold-dark">
                {rate.toFixed(1)}%
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={24}
              step={0.1}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full"
              aria-label="Interest rate"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Lump Sum Prepayment</label>
              <span className="rounded-lg bg-secondary px-3 py-1 text-sm font-bold text-gold-dark">
                {formatCurrency(prepayment)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={Math.max(principal - 100000, 100000)}
              step={50000}
              value={prepayment}
              onChange={(e) => setPrepayment(Number(e.target.value))}
              className="w-full"
              aria-label="Prepayment amount"
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="relative w-full overflow-hidden rounded-2xl border border-gold/20 panel-light p-8 text-center">
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-gold/10 blur-[50px]"></div>
            <p className="relative text-xs font-bold tracking-[0.2em] text-gold-dark uppercase">
              Interest Saved
            </p>
            <p className="relative mt-3 text-4xl font-extrabold text-navy sm:text-5xl">
              {formatCurrency(Math.max(result.interestSaved, 0))}
            </p>
            <div className="relative mt-5 h-px w-full bg-gold/20"></div>
            <div className="relative mt-5 grid grid-cols-1 gap-4">
              <div>
                <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Tenure Reduced By</p>
                <p className="mt-1 text-lg font-extrabold text-gold">
                  {monthsToYearsMonths(Math.max(result.monthsSaved, 0))}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">New Payoff Time</p>
                <p className="mt-1 text-lg font-extrabold text-gold">
                  {monthsToYearsMonths(result.newMonths)}
                </p>
              </div>
            </div>
            <p className="relative mt-5 text-[11px] text-muted-foreground">
              Assumes EMI stays the same after prepayment. Check with your lender for any prepayment charges.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
