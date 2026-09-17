import { useState, useMemo } from "react";
import { formatCurrency, formatINR } from "@/lib/finance";
import { SliderField } from "@/components/slider-field";

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
          <SliderField
            label="Loan Amount"
            value={loanAmount}
            onChange={setLoanAmount}
            min={100000}
            max={20000000}
            step={100000}
            format={formatCurrency}
            minLabel="₹1 L"
            maxLabel="₹2 Cr"
            ariaLabel="Loan amount"
          />

          <SliderField
            label="Guarantee Cover"
            value={coverPct}
            onChange={setCoverPct}
            min={50}
            max={85}
            step={1}
            suffix="%"
            minLabel="50%"
            maxLabel="85%"
            ariaLabel="Guarantee cover percentage"
          />

          <SliderField
            label="Annual Guarantee Fee Rate"
            value={feeRate}
            onChange={setFeeRate}
            min={0.37}
            max={2}
            step={0.01}
            suffix="%"
            minLabel="0.37%"
            maxLabel="2%"
            ariaLabel="Annual guarantee fee rate"
          />
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
