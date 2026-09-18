import { useState, useMemo } from "react";
import { emi, formatCurrency, formatINR } from "@/lib/finance";
import { SliderField } from "@/components/slider-field";

type Offer = { label: string; rate: number; fee: number };

const DEFAULT_OFFERS: Offer[] = [
  { label: "Lender A", rate: 9, fee: 15000 },
  { label: "Lender B", rate: 9.5, fee: 5000 },
  { label: "Lender C", rate: 8.75, fee: 25000 },
];

export function LoanComparisonCalculator() {
  const [principal, setPrincipal] = useState(4000000);
  const [tenure, setTenure] = useState(20);
  const [offers, setOffers] = useState<Offer[]>(DEFAULT_OFFERS);

  const rows = useMemo(() => {
    const computed = offers.map((o) => {
      const monthlyEmi = emi(principal, o.rate, tenure);
      const totalInterest = monthlyEmi * tenure * 12 - principal;
      const totalCost = totalInterest + o.fee;
      return { ...o, monthlyEmi, totalInterest, totalCost };
    });
    const cheapestCost = Math.min(...computed.map((c) => c.totalCost));
    return computed.map((c) => ({ ...c, isCheapest: c.totalCost === cheapestCost }));
  }, [offers, principal, tenure]);

  const updateOffer = (i: number, field: keyof Offer, value: string | number) => {
    setOffers((prev) => prev.map((o, idx) => (idx === i ? { ...o, [field]: value } : o)));
  };

  return (
    <div className="glass-card p-6 sm:p-8" id="loan-comparison">
      <div className="mb-6">
        <p className="eyebrow">Loan Comparison</p>
        <h3 className="mt-2 text-2xl font-extrabold sm:text-3xl">
          Compare offers, <span className="gold-text-static">side by side</span>
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter the rate and processing fee from up to three lenders to see the true cheapest option.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <SliderField
          label="Loan Amount"
          value={principal}
          onChange={setPrincipal}
          min={100000}
          max={100000000}
          step={100000}
          format={formatCurrency}
          ariaLabel="Loan amount"
        />
        <SliderField
          label="Tenure"
          value={tenure}
          onChange={setTenure}
          min={1}
          max={30}
          step={1}
          suffix={tenure === 1 ? "Year" : "Years"}
          ariaLabel="Tenure"
        />
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[560px] border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="w-32"></th>
              {rows.map((r, i) => (
                <th key={i} className="px-2 pb-3 text-left">
                  <input
                    value={r.label}
                    onChange={(e) => updateOffer(i, "label", e.target.value)}
                    className="w-full rounded-lg border border-border bg-white px-2 py-1.5 text-sm font-bold text-navy focus:border-gold/50 focus:outline-none dark:text-white dark:bg-card"
                    aria-label={`Lender ${i + 1} name`}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 text-xs font-bold tracking-wide text-muted-foreground uppercase">Rate (p.a.)</td>
              {rows.map((r, i) => (
                <td key={i} className="px-2 py-2">
                  <input
                    type="number"
                    step={0.05}
                    value={r.rate}
                    onChange={(e) => updateOffer(i, "rate", Number(e.target.value))}
                    className="w-full rounded-lg border border-border bg-white px-2 py-1.5 text-sm font-semibold text-navy focus:border-gold/50 focus:outline-none dark:text-white dark:bg-card"
                    aria-label={`Rate for ${r.label}`}
                  />
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2 text-xs font-bold tracking-wide text-muted-foreground uppercase">Processing Fee</td>
              {rows.map((r, i) => (
                <td key={i} className="px-2 py-2">
                  <input
                    type="number"
                    step={1000}
                    value={r.fee}
                    onChange={(e) => updateOffer(i, "fee", Number(e.target.value))}
                    className="w-full rounded-lg border border-border bg-white px-2 py-1.5 text-sm font-semibold text-navy focus:border-gold/50 focus:outline-none dark:text-white dark:bg-card"
                    aria-label={`Fee for ${r.label}`}
                  />
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 text-xs font-bold tracking-wide text-muted-foreground uppercase">Monthly EMI</td>
              {rows.map((r, i) => (
                <td key={i} className="px-2 py-3 text-sm font-bold text-navy dark:text-white">{formatINR(r.monthlyEmi)}</td>
              ))}
            </tr>
            <tr>
              <td className="py-3 text-xs font-bold tracking-wide text-muted-foreground uppercase">Total Interest</td>
              {rows.map((r, i) => (
                <td key={i} className="px-2 py-3 text-sm font-bold text-navy dark:text-white">{formatCurrency(r.totalInterest)}</td>
              ))}
            </tr>
            <tr>
              <td className="py-3 text-xs font-bold tracking-wide text-muted-foreground uppercase">Total Cost</td>
              {rows.map((r, i) => (
                <td key={i} className="px-2 py-3">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-extrabold ${
                      r.isCheapest ? "bg-gold-pale/70 text-gold-dark ring-1 ring-gold/30" : "text-navy dark:text-white"
                    }`}
                  >
                    {formatCurrency(r.totalCost)}
                    {r.isCheapest && <span className="text-[10px] font-bold uppercase">Best</span>}
                  </span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-[11px] text-muted-foreground">
        Total cost = total interest + processing fee, over the full tenure. Excludes any prepayment or foreclosure charges.
      </p>
    </div>
  );
}
