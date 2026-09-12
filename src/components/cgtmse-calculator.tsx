import { useState, useMemo } from "react";
import { formatCurrency, formatINR } from "@/lib/finance";

export function CgtmseCalculator() {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [coverPct, setCoverPct] = useState(75);
  const [feeRate, setFeeRate] = useState(1);

  const result = useMemo(() => {
    const guaranteedAmount = (loanAmount * coverPct) / 100;
    const annualFee = (guaranteedAmount * feeRate) / 100;
    return { guaranteedAmount, annualFee };
  }, [loanAmount, coverPct, feeRate]);

  return (
    <div className="glass-card p-6 sm:p-8" id="cgtmse">
      <div className="mb-6">
        <p className="eyebrow">CGTMSE Guarantee Fee</p>
        <h3 className="mt-2 text-2xl font-extrabold sm:text-3xl">
          Estimate your <span className="gold-text-static">annual guarantee fee</span>
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          For collateral-free business loans covered under CGTMSE — the Credit Guarantee Fund
          Trust for Micro and Small Enterprises.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-7">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Loan Amount</label>
              <span className="rounded-lg bg-secondary px-3 py-1 text-sm font-bold text-gold-dark">
                {formatCurrency(loanAmount)}
              </span>
            </div>
            <input
              type="range"
              min={100000}
              max={20000000}
              step={100000}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full"
              aria-label="Loan amount"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>₹1 L</span>
              <span>₹2 Cr</span>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Guarantee Cover</label>
              <span className="rounded-lg bg-secondary px-3 py-1 text-sm font-bold text-gold-dark">
                {coverPct}%
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={85}
              step={1}
              value={coverPct}
              onChange={(e) => setCoverPct(Number(e.target.value))}
              className="w-full"
              aria-label="Guarantee cover percentage"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>50%</span>
              <span>85%</span>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Annual Guarantee Fee Rate</label>
              <span className="rounded-lg bg-secondary px-3 py-1 text-sm font-bold text-gold-dark">
                {feeRate.toFixed(2)}%
              </span>
            </div>
            <input
              type="range"
              min={0.37}
              max={2}
              step={0.01}
              value={feeRate}
              onChange={(e) => setFeeRate(Number(e.target.value))}
              className="w-full"
              aria-label="Annual guarantee fee rate"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>0.37%</span>
              <span>2%</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="relative w-full overflow-hidden rounded-2xl border border-gold/20 panel-light p-8 text-center">
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-gold/10 blur-[50px]"></div>
            <p className="relative text-xs font-bold tracking-[0.2em] text-gold-dark uppercase">
              Annual Guarantee Fee
            </p>
            <p className="relative mt-3 text-4xl font-extrabold text-navy sm:text-5xl">
              {formatINR(result.annualFee)}
            </p>
            <div className="relative mt-5 h-px w-full bg-gold/20"></div>
            <div className="relative mt-5">
              <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Guaranteed Amount</p>
              <p className="mt-1 text-lg font-extrabold text-gold">{formatCurrency(result.guaranteedAmount)}</p>
            </div>
            <p className="relative mt-5 text-[11px] text-muted-foreground">
              Actual fee slab depends on loan size, borrower category and risk rating. Confirm the
              exact rate with your advisor before applying.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
