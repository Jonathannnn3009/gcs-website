import { useState, useMemo } from "react";
import { formatCurrency, principalFromEmi } from "@/lib/finance";

export function EligibilityCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useState(100000);
  const [existingEmi, setExistingEmi] = useState(0);
  const [rate, setRate] = useState(9);
  const [tenure, setTenure] = useState(20);

  const result = useMemo(() => {
    const maxEmi = (monthlyIncome - existingEmi) * 0.5; // 50% FOIR
    if (maxEmi <= 0) return { maxLoan: 0, maxEmi: 0 };
    return { maxLoan: principalFromEmi(maxEmi, rate, tenure), maxEmi };
  }, [monthlyIncome, existingEmi, rate, tenure]);

  return (
    <div className="glass-card p-6 sm:p-8">
      <div className="mb-6">
        <p className="eyebrow">Eligibility Calculator</p>
        <h3 className="mt-2 text-2xl font-extrabold sm:text-3xl">
          How much can you <span className="gold-text-static">borrow?</span>
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Find out your maximum loan amount based on your monthly income and existing obligations.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-7">
          {/* Monthly Income */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Monthly Income (Net)</label>
              <span className="rounded-lg bg-secondary px-3 py-1 text-sm font-bold text-gold-dark">
                {formatCurrency(monthlyIncome)}
              </span>
            </div>
            <input
              type="range"
              min={20000}
              max={5000000}
              step={10000}
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(Number(e.target.value))}
              className="w-full"
              aria-label="Monthly income"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>₹20K</span>
              <span>₹50L</span>
            </div>
          </div>

          {/* Existing EMIs */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Existing EMIs</label>
              <span className="rounded-lg bg-secondary px-3 py-1 text-sm font-bold text-gold-dark">
                {formatCurrency(existingEmi)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={Math.max(monthlyIncome * 0.6, 10000)}
              step={1000}
              value={existingEmi}
              onChange={(e) => setExistingEmi(Number(e.target.value))}
              className="w-full"
              aria-label="Existing EMIs"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>₹0</span>
              <span>{formatCurrency(Math.max(monthlyIncome * 0.6, 10000))}</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Expected Interest Rate</label>
              <span className="rounded-lg bg-secondary px-3 py-1 text-sm font-bold text-gold-dark">
                {rate.toFixed(1)}%
              </span>
            </div>
            <input
              type="range"
              min={6}
              max={20}
              step={0.25}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full"
              aria-label="Interest rate"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>6%</span>
              <span>20%</span>
            </div>
          </div>

          {/* Tenure */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Preferred Tenure</label>
              <span className="rounded-lg bg-secondary px-3 py-1 text-sm font-bold text-gold-dark">
                {tenure} Years
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="w-full"
              aria-label="Tenure"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>1 Year</span>
              <span>30 Years</span>
            </div>
          </div>
        </div>

        {/* Result */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-full overflow-hidden rounded-2xl border border-gold/20 panel-light p-8 text-center">
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-gold/10 blur-[50px]"></div>
            <p className="relative text-xs font-bold tracking-[0.2em] text-gold-dark uppercase">
              Maximum Loan Amount
            </p>
            <p
              className="relative mt-3 text-4xl font-extrabold text-navy sm:text-5xl"
              style={{ animation: "gcs-count-up 500ms ease both" }}
              key={result.maxLoan}
            >
              {formatCurrency(result.maxLoan)}
            </p>
            <div className="relative mt-5 h-px w-full bg-gold/20"></div>
            <div className="relative mt-5 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Max EMI</p>
                <p className="mt-1 text-lg font-extrabold text-gold">
                  {formatCurrency(result.maxEmi)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">FOIR Used</p>
                <p className="mt-1 text-lg font-extrabold text-gold">50%</p>
              </div>
            </div>
            <p className="relative mt-5 text-[11px] text-muted-foreground">
              Based on 50% Fixed Obligation to Income Ratio. Actual eligibility may vary.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
