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

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const lakhs = (n: number) =>
  n >= 10000000
    ? `₹${(n / 10000000).toFixed(2)} Cr`
    : `₹${(n / 100000).toFixed(n % 100000 ? 1 : 0)} L`;

const AMOUNT_PRESETS = [
  { label: "₹10 L", value: 1000000 },
  { label: "₹25 L", value: 2500000 },
  { label: "₹50 L", value: 5000000 },
  { label: "₹1 Cr", value: 10000000 },
];

/** Interactive "what could I earn" estimate, driven by the published partner rate card. Used on the Agent and Freelancer pages. */
export function EarningsEstimator({ joinHref = "#join" }: { joinHref?: string }) {
  const rows = useCommissionStructure(COMMISSION_STRUCTURE);
  const options = useMemo(
    () =>
      rows
        .map((r) => ({ product: r.product, range: parseRange(r.range) }))
        .filter((o): o is { product: string; range: Range } => o.range !== null),
    [rows],
  );
  const [product, setProduct] = useState("Home Loan");
  const [amount, setAmount] = useState(5000000);
  const [cases, setCases] = useState(2);

  const current = options.find((o) => o.product === product) ?? options[0];
  if (!current) return null;
  const perCaseLow = (amount * current.range.min) / 100;
  const perCaseHigh = (amount * current.range.max) / 100;

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
                    onClick={() => setProduct(o.product)}
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
            value={amount}
            onChange={setAmount}
            min={100000}
            max={100000000}
            step={100000}
            format={lakhs}
            minLabel="₹1 L"
            maxLabel="₹10 Cr"
            ariaLabel="Typical loan amount"
            presets={AMOUNT_PRESETS}
          />
          <SliderField
            label="Loans you refer in a month"
            value={cases}
            onChange={setCases}
            min={1}
            max={10}
            step={1}
            suffix={cases === 1 ? "loan" : "loans"}
            minLabel="1"
            maxLabel="10"
            ariaLabel="Loans referred per month"
          />
        </div>

        <div className="flex flex-col rounded-2xl border border-gold/25 bg-gold-pale/25 p-5 sm:p-6">
          <p className="text-sm text-muted-foreground">You could earn about</p>
          <p className="mt-1 flex flex-wrap items-baseline gap-x-2 font-heading text-2xl font-extrabold text-navy sm:text-3xl dark:text-white">
            <span className="whitespace-nowrap">{inr(perCaseLow * cases)}</span>
            <span className="text-xl text-gold-dark">–</span>
            <span className="whitespace-nowrap">{inr(perCaseHigh * cases)}</span>
          </p>
          <p className="text-sm text-muted-foreground">a month</p>
          <dl className="mt-5 space-y-2 border-t border-gold/25 pt-4 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Commission range</dt>
              <dd className="font-bold text-navy dark:text-white">
                {current.range.min}% – {current.range.max}%
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Per loan</dt>
              <dd className="font-bold text-navy dark:text-white">
                {inr(perCaseLow)} – {inr(perCaseHigh)}
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground italic">
            An indicative estimate for loans that are disbursed, not a promise. The actual payout
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
