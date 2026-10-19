import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { SliderField } from "@/components/slider-field";
import { COMMISSION_STRUCTURE } from "@/data/commission-fallback";
import { useCommissionStructure } from "@/lib/commission";

type Range = { min: number; max: number };

/** "0.2% – 0.5%" -> {0.2, 0.5}; null if the row has no usable range. */
function parseRange(range: string): Range | null {
  const m = range.match(/([\d.]+)\s*%\s*[–-]\s*([\d.]+)\s*%/);
  if (!m) return null;
  const min = Number(m[1]);
  const max = Number(m[2]);
  return Number.isFinite(min) && Number.isFinite(max) ? { min, max } : null;
}

/** "₹30L – ₹1Cr" -> {3000000, 10000000}; null if the row has no usable amounts. */
function parseAmountRange(label: string): Range | null {
  const one = (t: string): number | null => {
    const m = t.match(/([\d.]+)\s*(L|Cr)/i);
    if (!m) return null;
    return Number(m[1]) * (m[2]!.toLowerCase() === "cr" ? 10000000 : 100000);
  };
  const parts = label.split(/[–-]/);
  if (parts.length < 2) return null;
  const min = one(parts[0]!);
  const max = one(parts[1]!);
  return min !== null && max !== null && max >= min ? { min, max } : null;
}

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const lakhs = (n: number) =>
  n >= 10000000
    ? `₹${(n / 10000000).toFixed(2)} Cr`
    : `₹${(n / 100000).toFixed(n % 100000 ? 1 : 0)} L`;

const DEFAULT_AMOUNTS: Range = { min: 100000, max: 100000000 };

/** Interactive "what could I earn" estimate, driven by the published partner rate card. Used on the Agent and Freelancer pages. */
export function EarningsEstimator({ joinHref = "#join" }: { joinHref?: string }) {
  const rows = useCommissionStructure(COMMISSION_STRUCTURE);
  const options = useMemo(
    () =>
      rows
        .map((r) => ({
          product: r.product,
          range: parseRange(r.range),
          amounts: parseAmountRange(r.avgAmount) ?? DEFAULT_AMOUNTS,
        }))
        .filter((o): o is { product: string; range: Range; amounts: Range } => o.range !== null),
    [rows],
  );
  const [product, setProduct] = useState("Home Loan");
  const [amount, setAmount] = useState(5000000);
  const [cases, setCases] = useState(2);
  const [rate, setRate] = useState<number | null>(null);

  const current = options.find((o) => o.product === product) ?? options[0];
  if (!current) return null;
  // The amount slider follows the loan type: each type has its own usual range.
  const { min: amtMin, max: amtMax } = current.amounts;
  const amountUsed = Math.min(Math.max(amount, amtMin), amtMax);
  const amtStep = amtMax > 10000000 ? 500000 : 100000;
  const presets = [amtMin, Math.round((amtMin + amtMax) / 2 / amtStep) * amtStep, amtMax]
    .filter((v, i, a) => a.indexOf(v) === i)
    .map((v) => ({ label: lakhs(v).replace(".00", ""), value: v }));
  // The commission slider follows the loan type too, within that type's own range.
  const { min: rateMin, max: rateMax } = current.range;
  const rateStep = rateMax <= 0.2 ? 0.01 : 0.05;
  const rateUsed = Math.min(Math.max(rate ?? rateMax, rateMin), rateMax);
  const perCase = (amountUsed * rateUsed) / 100;
  const perCaseLow = (amountUsed * rateMin) / 100;
  const perCaseHigh = (amountUsed * rateMax) / 100;

  return (
    <>
      <div className="grid gap-6 rounded-3xl border border-border bg-white p-6 shadow-[var(--shadow-card)] sm:p-8 lg:grid-cols-[1fr_minmax(0,22rem)] dark:bg-card">
        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold text-foreground">Type of loan</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {options.map((o) => {
                const on = o.product === current.product;
                return (
                  <button
                    key={o.product}
                    type="button"
                    aria-pressed={on}
                    onClick={() => {
                      setProduct(o.product);
                      setRate(null);
                    }}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all duration-300 hover:-translate-y-0.5 active:scale-95 ${
                      on
                        ? "border-navy bg-navy text-white"
                        : "border-border bg-white text-navy hover:border-gold/60 dark:bg-card dark:text-white"
                    }`}
                  >
                    {o.product}
                  </button>
                );
              })}
            </div>
          </div>
          <SliderField
            label="Typical loan amount"
            value={amountUsed}
            onChange={setAmount}
            min={amtMin}
            max={amtMax}
            step={amtStep}
            format={lakhs}
            minLabel={lakhs(amtMin).replace(".00", "")}
            maxLabel={lakhs(amtMax).replace(".00", "")}
            ariaLabel="Typical loan amount"
            presets={presets}
          />
          <SliderField
            label="Commission"
            value={rateUsed}
            onChange={setRate}
            min={rateMin}
            max={rateMax}
            step={rateStep}
            suffix="%"
            minLabel={`${rateMin}%`}
            maxLabel={`${rateMax}%`}
            ariaLabel="Commission percentage"
          />
          <SliderField
            label="Number of files in a month"
            value={cases}
            onChange={setCases}
            min={1}
            max={10}
            step={1}
            suffix={cases === 1 ? "file" : "files"}
            minLabel="1"
            maxLabel="10"
            ariaLabel="Number of files in a month"
          />
        </div>

        <div className="flex flex-col rounded-2xl border border-gold/25 bg-gold-pale/25 p-5 sm:p-6">
          <p className="text-sm text-muted-foreground">
            You could earn about <span className="font-bold text-red-600">*</span>
          </p>
          <p className="mt-1 font-heading text-3xl font-extrabold whitespace-nowrap text-navy sm:text-4xl dark:text-white">
            {inr(perCase * cases)}
          </p>
          <p className="text-sm text-muted-foreground">a month</p>
          <dl className="mt-5 space-y-2 border-t border-gold/25 pt-4 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Commission selected</dt>
              <dd className="font-bold text-navy dark:text-white">{Number(rateUsed.toFixed(2))}%</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Per file</dt>
              <dd className="font-bold text-navy dark:text-white">{inr(perCase)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Number of files</dt>
              <dd className="font-bold text-navy dark:text-white">{cases}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Range for this loan</dt>
              <dd className="font-bold text-navy dark:text-white">
                {rateMin}% – {rateMax}%
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Per file, low to high</dt>
              <dd className="font-bold text-navy dark:text-white">
                {inr(perCaseLow)} – {inr(perCaseHigh)}
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground italic">
            <span className="font-bold text-red-600 not-italic">* </span>Commission rates may vary based on
            lender, loan amount and partner tier. An indicative estimate for loans that are disbursed, not a promise. The actual payout
            depends on the lender, the loan type, the loan amount, your partner tier and the final
            sanctioned terms.
          </p>
          <a href={joinHref} className="gold-btn group mt-5 w-full justify-center py-3.5">
            Start earning
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
      <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
        All rights reserved. Commission rates, payout terms and eligibility are as decided by Growth
        Capital Services and may change from time to time.
      </p>
    </>
  );
}
