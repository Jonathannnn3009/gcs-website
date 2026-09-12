import { useState, useMemo } from "react";
import { formatCurrency } from "@/lib/finance";

export function WorkingCapitalCalculator() {
  const [turnover, setTurnover] = useState(20000000);

  const result = useMemo(() => {
    const workingCapitalGap = turnover * 0.25;
    const marginMoney = turnover * 0.05;
    const bankFinance = turnover * 0.2;
    return { workingCapitalGap, marginMoney, bankFinance };
  }, [turnover]);

  return (
    <div className="glass-card p-6 sm:p-8" id="working-capital">
      <div className="mb-6">
        <p className="eyebrow">Exclusive to GCS</p>
        <h3 className="mt-2 text-2xl font-extrabold sm:text-3xl">
          Working Capital <span className="gold-text-static">Limit Estimator</span>
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Based on the RBI Nayak Committee turnover method used by most banks for MSME Cash Credit,
          Overdraft, CGTMSE and Working Capital Term Loan limits.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-7">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Projected Annual Turnover</label>
              <span className="rounded-lg bg-secondary px-3 py-1 text-sm font-bold text-gold-dark">
                {formatCurrency(turnover)}
              </span>
            </div>
            <input
              type="range"
              min={1000000}
              max={500000000}
              step={500000}
              value={turnover}
              onChange={(e) => setTurnover(Number(e.target.value))}
              className="w-full"
              aria-label="Projected annual turnover"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>₹10 L</span>
              <span>₹50 Cr</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-gold/20 bg-gradient-to-b from-gold/5 to-transparent p-4 text-center">
              <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Working Capital Gap</p>
              <p className="mt-1 text-lg font-extrabold text-foreground sm:text-xl">
                {formatCurrency(result.workingCapitalGap)}
              </p>
              <p className="mt-1 text-[10px] text-muted-foreground">25% of turnover</p>
            </div>
            <div className="rounded-xl border border-gold/20 bg-gradient-to-b from-gold/5 to-transparent p-4 text-center">
              <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Your Margin Money</p>
              <p className="mt-1 text-lg font-extrabold text-foreground sm:text-xl">
                {formatCurrency(result.marginMoney)}
              </p>
              <p className="mt-1 text-[10px] text-muted-foreground">5% of turnover</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="relative w-full overflow-hidden rounded-2xl border border-gold/20 panel-light p-8 text-center">
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-gold/10 blur-[50px]"></div>
            <p className="relative text-xs font-bold tracking-[0.2em] text-gold-dark uppercase">
              Indicative Bank Finance
            </p>
            <p className="relative mt-3 text-4xl font-extrabold text-navy sm:text-5xl">
              {formatCurrency(result.bankFinance)}
            </p>
            <div className="relative mt-5 h-px w-full bg-gold/20"></div>
            <p className="relative mt-5 text-[11px] text-muted-foreground">
              20% of projected turnover — the portion typically financeable via Cash Credit, Overdraft or a
              Working Capital Term Loan. Actual sanction depends on financials, banking history and lender policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
