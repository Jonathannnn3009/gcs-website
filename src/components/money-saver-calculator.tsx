import { CalcExpertButton } from "@/components/calc-expert-button";
import { useMemo, useState } from "react";
import { formatCurrency, formatINR, moneySaver } from "@/lib/finance";
import { SliderField } from "@/components/slider-field";

const LOAN_PRESETS = [
  { label: "₹30 L", value: 3000000 },
  { label: "₹50 L", value: 5000000 },
  { label: "₹75 L", value: 7500000 },
  { label: "₹1 Cr", value: 10000000 },
  { label: "₹2 Cr", value: 20000000 },
];

const PARKED_PRESETS = [
  { label: "₹1 L", value: 100000 },
  { label: "₹5 L", value: 500000 },
  { label: "₹10 L", value: 1000000 },
  { label: "₹25 L", value: 2500000 },
];

/**
 * A "money saver" loan works like an overdraft on a home loan: the money you keep in the loan account
 * reduces the balance interest is charged on, while the repayment schedule (and tenure) stays as it was.
 */
export function MoneySaverCalculator() {
  const [principal, setPrincipal] = useState(5000000);
  const [rate, setRate] = useState(9);
  const [years, setYears] = useState(20);
  const [parked, setParked] = useState(500000);

  // Money parked beyond the loan itself earns no benefit, so the figure is kept within the loan amount.
  const parkedUsed = Math.min(parked, principal);

  const result = useMemo(
    () => moneySaver(principal, rate, years * 12, parkedUsed),
    [principal, rate, years, parkedUsed],
  );

  return (
    <div className="glass-card p-6 sm:p-8" id="money-saver">
      <div className="mb-6">
        <p className="eyebrow">Money Saver Calculator</p>
        <h3 className="mt-2 text-2xl font-extrabold sm:text-3xl">
          Let your spare cash <span className="gold-text-static">cut your interest</span>
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          With a money saver (overdraft-style) home loan, the savings you keep in the loan account
          reduce the balance your interest is charged on. See what that could save you.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
        <div className="flex flex-col gap-7 lg:justify-evenly">
          <SliderField
            label="Loan Amount (Sanction Limit)"
            value={principal}
            onChange={setPrincipal}
            min={100000}
            max={100000000}
            step={100000}
            format={formatCurrency}
            minLabel="₹1 L"
            maxLabel="₹10 Cr"
            ariaLabel="Loan amount"
            presets={LOAN_PRESETS}
          />

          <SliderField
            label="Interest Rate (p.a.)"
            value={rate}
            onChange={setRate}
            min={5}
            max={24}
            step={0.05}
            suffix="%"
            minLabel="5%"
            maxLabel="24%"
            ariaLabel="Interest rate"
          />

          <SliderField
            label="Loan Tenure"
            value={years}
            onChange={setYears}
            min={1}
            max={30}
            step={1}
            suffix={years === 1 ? "Year" : "Years"}
            minLabel="1 Yr"
            maxLabel="30 Yrs"
            ariaLabel="Loan tenure in years"
          />

          <SliderField
            label="Average Balance Kept in the Account"
            value={parkedUsed}
            onChange={setParked}
            min={0}
            max={principal}
            step={50000}
            format={formatCurrency}
            minLabel="₹0"
            maxLabel={formatCurrency(principal)}
            ariaLabel="Average balance kept in the loan account"
            presets={PARKED_PRESETS.filter((p) => p.value <= principal)}
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="relative flex w-full flex-1 flex-col justify-center overflow-hidden rounded-2xl border border-gold/20 panel-light p-8 text-center">
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-gold/10 blur-[50px]"></div>
            <p className="relative text-xs font-bold tracking-[0.2em] text-gold-dark uppercase">
              Interest Saved Over the Loan
            </p>
            <p className="relative mt-3 text-4xl font-extrabold text-navy sm:text-5xl dark:text-white">
              {formatCurrency(result.totalSaving)}
            </p>
            <div className="relative mt-5 h-px w-full bg-gold/20"></div>
            <div className="relative mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                  Monthly Payment Without Parking
                </p>
                <p className="mt-1 text-lg font-extrabold text-gold">{formatINR(result.emi)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                  Average Monthly Payment With Parking
                </p>
                <p className="mt-1 text-lg font-extrabold text-gold">
                  {formatINR(Math.round(result.avgOutflow))}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                  Average Monthly Saving
                </p>
                <p className="mt-1 text-lg font-extrabold text-gold">
                  {formatINR(Math.round(result.avgMonthlySaving))}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                  Effective Interest Rate
                </p>
                <p className="mt-1 text-lg font-extrabold text-gold">
                  {rate.toFixed(2)}% <span className="text-muted-foreground">→</span>{" "}
                  {result.effectiveRatePct.toFixed(2)}%
                </p>
              </div>
            </div>
            <p className="relative mt-5 text-[11px] text-muted-foreground">
              Interest is charged on your balance minus the money you keep in the account, and only
              up to what you still owe. Your tenure stays the same, so the saving shows up as a
              lower monthly outflow. Actual terms and charges depend on the lender.
            </p>
          </div>
          <CalcExpertButton />
        </div>
      </div>

      <details className="group mt-8 rounded-2xl border border-border bg-white/60 dark:bg-card/60">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-sm font-bold text-navy dark:text-white">
          See the year-by-year picture
          <span className="text-xs font-semibold text-gold-dark transition-transform duration-300 group-open:rotate-180">
            ▼
          </span>
        </summary>
        <div className="overflow-x-auto px-5 pb-5">
          <table className="w-full min-w-[520px] text-right text-sm">
            <thead>
              <tr className="border-b border-border text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                <th className="py-2 pr-3 text-left">Year</th>
                <th className="px-3 py-2">Balance at start</th>
                <th className="px-3 py-2">Interest charged</th>
                <th className="px-3 py-2">Interest saved</th>
                <th className="py-2 pl-3">You pay in the year</th>
              </tr>
            </thead>
            <tbody>
              {result.yearly.map((row) => (
                <tr key={row.year} className="border-b border-border/60 last:border-0">
                  <td className="py-2 pr-3 text-left font-semibold text-navy dark:text-white">
                    {row.year}
                  </td>
                  <td className="px-3 py-2">{formatCurrency(row.opening)}</td>
                  <td className="px-3 py-2">{formatCurrency(row.interest)}</td>
                  <td className="px-3 py-2 font-semibold text-gold-dark">
                    {formatCurrency(row.benefit)}
                  </td>
                  <td className="py-2 pl-3">{formatCurrency(row.outflow)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
