import { CalcExpertButton } from "@/components/calc-expert-button";
import { useMemo, useState } from "react";
import { formatCurrency, formatINR, moneySaver, type MoneySaverMonth } from "@/lib/finance";
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

type ScheduleRow = Omit<MoneySaverMonth, "month"> & { n: number };

/**
 * A "money saver" loan works like an overdraft on a home loan: the money you keep in the loan account
 * reduces the balance interest is charged on, while the repayment schedule (and tenure) stays as it was.
 */
export function MoneySaverCalculator() {
  const [principal, setPrincipal] = useState(5000000);
  const [rate, setRate] = useState(9);
  const [months, setMonths] = useState(240);
  const [parked, setParked] = useState(500000);

  // Money parked beyond the loan itself earns no benefit, so the figure is kept within the loan amount.
  const parkedUsed = Math.min(parked, principal);

  const result = useMemo(
    () => moneySaver(principal, rate, months, parkedUsed),
    [principal, rate, months, parkedUsed],
  );

  // The schedule, month by month as a lender's sheet shows it, or added up year by year.
  const [view, setView] = useState<"month" | "year">("month");
  const per = view === "month" ? "Monthly" : "Yearly";
  const rows = useMemo<ScheduleRow[]>(() => {
    if (view === "month") return result.monthly.map((m) => ({ ...m, n: m.month }));
    const years: ScheduleRow[] = [];
    for (const m of result.monthly) {
      const y = Math.ceil(m.month / 12);
      const row = years[y - 1];
      if (!row) years[y - 1] = { ...m, n: y };
      else {
        row.outflow += m.outflow;
        row.principal += m.principal;
        row.interest += m.interest;
        row.netInterest += m.netInterest;
        row.benefit += m.benefit;
      }
    }
    return years;
  }, [result, view]);
  const total = useMemo(
    () =>
      result.monthly.reduce(
        (t, m) => ({
          outflow: t.outflow + m.outflow,
          principal: t.principal + m.principal,
          interest: t.interest + m.interest,
          netInterest: t.netInterest + m.netInterest,
          benefit: t.benefit + m.benefit,
        }),
        { outflow: 0, principal: 0, interest: 0, netInterest: 0, benefit: 0 },
      ),
    [result],
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
            label="Sanction limit"
            value={principal}
            onChange={setPrincipal}
            min={100000}
            max={100000000}
            step={100000}
            format={formatCurrency}
            minLabel="₹1 L"
            maxLabel="₹10 Cr"
            ariaLabel="Sanction limit"
            presets={LOAN_PRESETS}
          />

          <SliderField
            label="ROI (%)"
            value={rate}
            onChange={setRate}
            min={5}
            max={24}
            step={0.05}
            suffix="%"
            minLabel="5%"
            maxLabel="24%"
            ariaLabel="ROI (%)"
          />

          <SliderField
            label="Tenure in months"
            value={months}
            onChange={setMonths}
            min={12}
            max={360}
            step={1}
            suffix="Months"
            minLabel="12"
            maxLabel="360"
            ariaLabel="Tenure in months"
          />

          <SliderField
            label="Avg Daily balance maintained in A/c"
            value={parkedUsed}
            onChange={setParked}
            min={0}
            max={principal}
            step={50000}
            format={formatCurrency}
            minLabel="₹0"
            maxLabel={formatCurrency(principal)}
            ariaLabel="Avg Daily balance maintained in A/c"
            presets={PARKED_PRESETS.filter((p) => p.value <= principal)}
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="relative flex w-full flex-1 flex-col justify-center overflow-hidden rounded-2xl border border-gold/20 panel-light p-8 text-center">
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-gold/10 blur-[50px]"></div>
            <p className="relative text-xs font-bold tracking-[0.2em] text-gold-dark uppercase">
              Interest benefit during entire tenure (Considering excess amount)
            </p>
            <p className="relative mt-3 text-4xl font-extrabold text-navy sm:text-5xl dark:text-white">
              {formatINR(result.totalSaving)}
            </p>
            <div className="relative mt-5 h-px w-full bg-gold/20"></div>
            <div className="relative mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                  Monthly Outflow (Without considering excess amount)
                </p>
                <p className="mt-1 text-lg font-extrabold text-gold">{formatINR(result.emi)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                  Avg. Monthly Outflow (Considering excess amount)
                </p>
                <p className="mt-1 text-lg font-extrabold text-gold">
                  {formatINR(Math.round(result.avgOutflow))}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                  Average Monthly Interest benefit
                </p>
                <p className="mt-1 text-lg font-extrabold text-gold">
                  {formatINR(Math.round(result.avgMonthlySaving))}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                  Effective reduced ROI
                </p>
                <p className="mt-1 text-lg font-extrabold text-gold">
                  {rate.toFixed(2)}% <span className="text-muted-foreground">→</span>{" "}
                  {result.effectiveRatePct.toFixed(2)}%
                </p>
              </div>
            </div>
            <p className="relative mt-5 text-[11px] text-muted-foreground">
              Note: Daily interest will be calculated on the principal outstanding minus the excess
              amount. However, if the excess amount is greater than the principal outstanding then
              excess amount will be capped upto the outstanding principal and accordingly the
              interest will be calculated. At any given point of time interest benefit will not be
              available on the excess amount deposited over and above the outstanding principal.
            </p>
          </div>
          <CalcExpertButton />
        </div>
      </div>

      <details className="group mt-8 rounded-2xl border border-border bg-white/60 dark:bg-card/60">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-sm font-bold text-navy dark:text-white">
          See the full repayment schedule
          <span className="text-xs font-semibold text-gold-dark transition-transform duration-300 group-open:rotate-180">
            ▼
          </span>
        </summary>
        <div className="px-5 pb-5">
          <div className="mb-3 inline-flex rounded-lg border border-border p-0.5 text-xs font-bold">
            {(["month", "year"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={`rounded-md px-3 py-1.5 transition-colors ${
                  view === v
                    ? "bg-navy text-white"
                    : "text-muted-foreground hover:text-navy dark:hover:text-white"
                }`}
              >
                By {v}
              </button>
            ))}
          </div>
          <div className="max-h-[32rem] overflow-auto rounded-xl border border-border/60">
            <table className="w-full min-w-[1000px] text-right text-[13px]">
              <thead className="sticky top-0 z-10 bg-white dark:bg-card">
                <tr className="border-b border-border align-bottom text-[10px] leading-snug font-bold tracking-wider text-muted-foreground uppercase">
                  <th className="px-3 py-3 text-left">{view === "month" ? "Sr No." : "Year"}</th>
                  <th className="px-3 py-3">Sanction limit</th>
                  <th className="px-3 py-3">{per} Outflow (Net of Interest Benefit)</th>
                  <th className="px-3 py-3">{per} Principal recovery</th>
                  <th className="px-3 py-3">
                    {per} Interest recovery (If &quot;No&quot; balance maintained in Money Saver
                    A/c)
                  </th>
                  <th className="px-3 py-3">{per} Interest recovery (Net of Interest Benefit)</th>
                  <th className="px-3 py-3">
                    Approx. Interest benefit for the {view} on average daily balance maintained
                  </th>
                  <th className="px-3 py-3">
                    Average daily balance maintained in the A/c during previous {view}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.n} className="border-b border-border/60">
                    <td className="px-3 py-2 text-left font-semibold text-navy dark:text-white">
                      {row.n}
                    </td>
                    <td className="px-3 py-2">{formatINR(row.opening)}</td>
                    <td className="px-3 py-2">{formatINR(row.outflow)}</td>
                    <td className="px-3 py-2">{formatINR(row.principal)}</td>
                    <td className="px-3 py-2">{formatINR(row.interest)}</td>
                    <td className="px-3 py-2">{formatINR(row.netInterest)}</td>
                    <td className="px-3 py-2 font-semibold text-gold-dark">
                      {formatINR(row.benefit)}
                    </td>
                    <td className="px-3 py-2">{formatINR(row.parked)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="sticky bottom-0 bg-white font-extrabold text-navy dark:bg-card dark:text-white">
                <tr className="border-t-2 border-gold/30">
                  <td className="px-3 py-3 text-left">Total</td>
                  <td className="px-3 py-3" />
                  <td className="px-3 py-3">{formatINR(total.outflow)}</td>
                  <td className="px-3 py-3">{formatINR(total.principal)}</td>
                  <td className="px-3 py-3">{formatINR(total.interest)}</td>
                  <td className="px-3 py-3">{formatINR(total.netInterest)}</td>
                  <td className="px-3 py-3 text-gold-dark">{formatINR(total.benefit)}</td>
                  <td className="px-3 py-3" />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </details>
    </div>
  );
}
