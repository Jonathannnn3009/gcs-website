import { useState, useMemo } from "react";
import { emi, formatCurrency, formatINR } from "@/lib/finance";

export function LapLtvCalculator() {
  const [propertyValue, setPropertyValue] = useState(10000000);
  const [ltv, setLtv] = useState(60);
  const [rate, setRate] = useState(10);
  const [tenure, setTenure] = useState(15);

  const result = useMemo(() => {
    const eligibleLoan = (propertyValue * ltv) / 100;
    const monthlyEmi = emi(eligibleLoan, rate, tenure);
    return { eligibleLoan, monthlyEmi };
  }, [propertyValue, ltv, rate, tenure]);

  return (
    <div className="glass-card p-6 sm:p-8" id="lap-ltv">
      <div className="mb-6">
        <p className="eyebrow">Loan Against Property</p>
        <h3 className="mt-2 text-2xl font-extrabold sm:text-3xl">
          How much can your <span className="gold-text-static">property unlock?</span>
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Estimate the loan amount and EMI available against your property's market value.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-7">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Property Market Value</label>
              <span className="rounded-lg bg-secondary px-3 py-1 text-sm font-bold text-gold-dark">
                {formatCurrency(propertyValue)}
              </span>
            </div>
            <input
              type="range"
              min={1000000}
              max={200000000}
              step={500000}
              value={propertyValue}
              onChange={(e) => setPropertyValue(Number(e.target.value))}
              className="w-full"
              aria-label="Property market value"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>₹10 L</span>
              <span>₹20 Cr</span>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Loan-to-Value (LTV)</label>
              <span className="rounded-lg bg-secondary px-3 py-1 text-sm font-bold text-gold-dark">
                {ltv}%
              </span>
            </div>
            <input
              type="range"
              min={40}
              max={75}
              step={1}
              value={ltv}
              onChange={(e) => setLtv(Number(e.target.value))}
              className="w-full"
              aria-label="Loan to value percentage"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>40%</span>
              <span>75%</span>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground">Interest Rate</label>
                <span className="rounded-lg bg-secondary px-3 py-1 text-sm font-bold text-gold-dark">
                  {rate.toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min={8}
                max={18}
                step={0.1}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full"
                aria-label="Interest rate"
              />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground">Tenure</label>
                <span className="rounded-lg bg-secondary px-3 py-1 text-sm font-bold text-gold-dark">
                  {tenure} Years
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={20}
                step={1}
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-full"
                aria-label="Tenure"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="relative w-full overflow-hidden rounded-2xl border border-gold/20 panel-light p-8 text-center">
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-gold/10 blur-[50px]"></div>
            <p className="relative text-xs font-bold tracking-[0.2em] text-gold-dark uppercase">
              Eligible Loan Amount
            </p>
            <p className="relative mt-3 text-4xl font-extrabold text-navy sm:text-5xl">
              {formatCurrency(result.eligibleLoan)}
            </p>
            <div className="relative mt-5 h-px w-full bg-gold/20"></div>
            <div className="relative mt-5">
              <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Estimated EMI</p>
              <p className="mt-1 text-lg font-extrabold text-gold">{formatINR(result.monthlyEmi)}</p>
            </div>
            <p className="relative mt-5 text-[11px] text-muted-foreground">
              Actual LTV depends on property type, location, age and lender policy. Commercial
              property typically gets a lower LTV than residential.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
