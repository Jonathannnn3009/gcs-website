import { useState, useMemo } from "react";
import { formatCurrency, formatINR, monthsToYearsMonths, tenureFromEmi } from "@/lib/finance";
import { SliderField } from "@/components/slider-field";

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
            label="Current EMI"
            value={emiAmount}
            onChange={setEmiAmount}
            min={2000}
            max={1000000}
            step={1000}
            format={formatINR}
            ariaLabel="Current EMI"
          />

          <SliderField
            label="Interest Rate (p.a.)"
            value={rate}
            onChange={setRate}
            min={5}
            max={24}
            step={0.1}
            suffix="%"
            ariaLabel="Interest rate"
          />

          <SliderField
            label="Lump Sum Prepayment"
            value={prepayment}
            onChange={setPrepayment}
            min={0}
            max={Math.max(principal - 100000, 100000)}
            step={50000}
            format={formatCurrency}
            ariaLabel="Prepayment amount"
          />
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="relative w-full overflow-hidden rounded-2xl border border-gold/20 panel-light p-8 text-center">
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-gold/10 blur-[50px]"></div>
            <p className="relative text-xs font-bold tracking-[0.2em] text-gold-dark uppercase">
              Interest Saved
            </p>
            <p className="relative mt-3 text-4xl font-extrabold text-navy sm:text-5xl dark:text-white">
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
