import { CalcExpertButton } from "@/components/calc-expert-button";
import { useMemo, useState } from "react";
import { ChevronDown, Table2 } from "lucide-react";
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
              Total interest saved
            </p>
            <p className="relative mt-1 text-[11px] text-muted-foreground">
              Over the full tenure, with your balance kept in the account
            </p>
            <p className="relative mt-3 text-4xl font-extrabold text-navy sm:text-5xl dark:text-white">
              {formatINR(result.totalSaving)}
            </p>
            <div className="relative mt-5 h-px w-full bg-gold/20"></div>
            <div className="relative mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="hero-stat relative overflow-hidden rounded-2xl border border-gold/40 bg-white/60 px-4 py-4 sm:col-span-2 dark:bg-card/60">
                <p className="text-[11px] font-bold tracking-wider text-gold-dark uppercase">
                  Effective reduced ROI
                </p>
                <p className="mt-1 text-3xl font-extrabold sm:text-4xl">
                  <span className="text-muted-foreground">{rate.toFixed(2)}%</span>{" "}
                  <span className="text-muted-foreground">→</span>{" "}
                  <span className="hero-stat-text">{result.effectiveRatePct.toFixed(2)}%</span>
                </p>
              </div>
              {[
                { label: "Monthly Payment Without Parking", note: "", value: formatINR(result.emi) },
                {
                  label: "Average Monthly Payment With Parking",
                  note: "",
                  value: formatINR(Math.round(result.avgOutflow)),
                },
              ].map((t) => (
                <div key={t.label} className="rounded-xl border border-border bg-white/60 px-4 py-3 dark:bg-card/60">
                  <p className="text-[11px] font-bold tracking-wider text-navy uppercase dark:text-white">
                    {t.label}
                  </p>
                  {t.note ? <p className="text-[11px] text-muted-foreground">{t.note}</p> : null}
                  <p className="mt-1 text-lg font-extrabold text-gold">{t.value}</p>
                </div>
              ))}
              <div className="rounded-xl border border-border bg-white/60 px-4 py-3 sm:col-span-2 dark:bg-card/60">
                <p className="text-[11px] font-bold tracking-wider text-navy uppercase dark:text-white">
                  Average Monthly Interest benefit
                </p>
                <p className="mt-1 text-lg font-extrabold text-gold">
                  {formatINR(Math.round(result.avgMonthlySaving))}
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

      <details className="group mt-8">
        <summary className="navy-panel flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-5 py-3.5 text-sm font-bold text-white shadow-[var(--shadow-card)] transition-transform duration-200 hover:-translate-y-0.5 [&::-webkit-details-marker]:hidden">
          <span className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gold text-navy">
              <Table2 className="h-4 w-4" />
            </span>
            See the full repayment schedule
          </span>
          <ChevronDown className="h-5 w-5 text-gold-light transition-transform duration-300 group-open:rotate-180" />
        </summary>
        <div className="pt-4">
          <div className="mb-3 inline-flex rounded-xl border border-gold/40 bg-gold-pale/40 p-1 text-xs font-bold">
            {(["month", "year"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={`rounded-md px-3 py-1.5 transition-colors ${
                  view === v
                    ? "bg-navy text-white shadow-sm"
                    : "text-navy/70 hover:text-navy dark:hover:text-white"
                }`}
              >
                By {v}
              </button>
            ))}
          </div>
          <div className="max-h-[32rem] overflow-auto rounded-xl border border-[#aebbd6]">
            <table className="w-full min-w-[880px] border-collapse text-right text-[13px] [&_td]:border [&_td]:border-[#c4cfe4] [&_th]:border [&_th]:border-[#aebbd6]">
              <thead className="sticky top-0 z-10 bg-[#e8eef9] dark:bg-card">
                <tr className="border-b border-border align-bottom text-[10px] leading-snug font-bold tracking-wider text-muted-foreground uppercase">
                  <th className="px-3 py-3 text-left">{view === "month" ? "Month" : "Year"}</th>
                  <th className="px-3 py-3" title="Sanction limit: the loan outstanding at the start">
                    Balance at start
                  </th>
                  <th className="px-3 py-3" title={`${per} Outflow (Net of Interest Benefit)`}>
                    You pay in the {view}
                  </th>
                  <th className="px-3 py-3" title={`${per} Principal recovery`}>
                    Principal paid
                  </th>
                  <th
                    className="px-3 py-3"
                    title={`${per} Interest recovery (If "No" balance maintained in Money Saver A/c)`}
                  >
                    Interest charged
                  </th>
                  <th className="px-3 py-3" title={`${per} Interest recovery (Net of Interest Benefit)`}>
                    Interest payable
                  </th>
                  <th
                    className="px-3 py-3 text-gold-dark"
                    title={`Approx. Interest benefit for the ${view} on average daily balance maintained`}
                  >
                    Interest saved
                  </th>
                  <th
                    className="px-3 py-3"
                    title={`Average daily balance maintained in the A/c during previous ${view}`}
                  >
                    Avg. balance kept
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
              <tfoot className="sticky bottom-0 bg-[#e8eef9] font-extrabold text-navy dark:bg-card dark:text-white">
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
          <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
            Payment is what you pay after the interest benefit. Interest, no balance is the interest if nothing
            is kept in the account. Interest saved is the approximate benefit on the average daily balance you
            keep. Hover over a heading for its full meaning.
          </p>
        </div>
      </details>
    </div>
  );
}
