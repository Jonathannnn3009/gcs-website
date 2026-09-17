import { useState, useMemo } from "react";
import { emi, formatCurrency, formatINR } from "@/lib/finance";
import { SliderField } from "@/components/slider-field";

export function BalanceTransferCalculator() {
  const [principal, setPrincipal] = useState(4000000);
  const [remainingYears, setRemainingYears] = useState(15);
  const [currentRate, setCurrentRate] = useState(10.5);
  const [newRate, setNewRate] = useState(8.5);
  const [processingFee, setProcessingFee] = useState(20000);

  const result = useMemo(() => {
    const n = remainingYears * 12;
    const oldEmi = emi(principal, currentRate, remainingYears);
    const newEmi = emi(principal, newRate, remainingYears);
    const monthlySavings = oldEmi - newEmi;
    const oldTotalInterest = oldEmi * n - principal;
    const newTotalInterest = newEmi * n - principal;
    const grossInterestSaved = oldTotalInterest - newTotalInterest;
    const netSavings = grossInterestSaved - processingFee;
    const breakevenMonths = monthlySavings > 0 ? processingFee / monthlySavings : Infinity;
    return { oldEmi, newEmi, monthlySavings, grossInterestSaved, netSavings, breakevenMonths };
  }, [principal, remainingYears, currentRate, newRate, processingFee]);

  return (
    <div className="glass-card p-6 sm:p-8" id="balance-transfer">
      <div className="mb-6">
        <p className="eyebrow">Balance Transfer Calculator</p>
        <h3 className="mt-2 text-2xl font-extrabold sm:text-3xl">
          Is a <span className="gold-text-static">transfer worth it?</span>
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Compare your current loan against a lower-rate offer and see the real net savings after fees.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-7">
          <SliderField
            label="Outstanding Principal"
            value={principal}
            onChange={setPrincipal}
            min={100000}
            max={100000000}
            step={100000}
            format={formatCurrency}
            ariaLabel="Outstanding principal"
          />

          <SliderField
            label="Remaining Tenure"
            value={remainingYears}
            onChange={setRemainingYears}
            min={1}
            max={30}
            step={1}
            suffix={remainingYears === 1 ? "Year" : "Years"}
            ariaLabel="Remaining tenure"
          />

          <div className="grid gap-6 sm:grid-cols-2">
            <SliderField
              label="Current Rate"
              value={currentRate}
              onChange={setCurrentRate}
              min={5}
              max={24}
              step={0.1}
              suffix="%"
              ariaLabel="Current interest rate"
            />
            <SliderField
              label="New Offer Rate"
              value={newRate}
              onChange={setNewRate}
              min={5}
              max={24}
              step={0.1}
              suffix="%"
              ariaLabel="New interest rate"
            />
          </div>

          <SliderField
            label="Processing Fee (New Lender)"
            value={processingFee}
            onChange={setProcessingFee}
            min={0}
            max={200000}
            step={5000}
            format={formatINR}
            ariaLabel="Processing fee"
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-gold/20 bg-gradient-to-b from-gold/5 to-transparent p-4 text-center">
              <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Current EMI</p>
              <p className="mt-1 text-lg font-extrabold text-foreground sm:text-xl">{formatINR(result.oldEmi)}</p>
            </div>
            <div className="rounded-xl border border-gold/20 bg-gradient-to-b from-gold/5 to-transparent p-4 text-center">
              <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">New EMI</p>
              <p className="mt-1 text-lg font-extrabold text-foreground sm:text-xl">{formatINR(result.newEmi)}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="relative w-full overflow-hidden rounded-2xl border border-gold/20 panel-light p-8 text-center">
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-gold/10 blur-[50px]"></div>
            <p className="relative text-xs font-bold tracking-[0.2em] text-gold-dark uppercase">
              Net Savings
            </p>
            <p className="relative mt-3 text-4xl font-extrabold text-navy sm:text-5xl">
              {formatCurrency(Math.max(result.netSavings, 0))}
            </p>
            <div className="relative mt-5 h-px w-full bg-gold/20"></div>
            <div className="relative mt-5 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Monthly Savings</p>
                <p className="mt-1 text-lg font-extrabold text-gold">{formatINR(Math.max(result.monthlySavings, 0))}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Fee Breakeven</p>
                <p className="mt-1 text-lg font-extrabold text-gold">
                  {isFinite(result.breakevenMonths) ? `${Math.ceil(result.breakevenMonths)} mo` : "—"}
                </p>
              </div>
            </div>
            <p className="relative mt-5 text-[11px] text-muted-foreground">
              Excludes any foreclosure charges from your current lender — ask us to check before you switch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
