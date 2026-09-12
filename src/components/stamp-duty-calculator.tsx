import { useState, useMemo } from "react";
import { formatCurrency, STAMP_DUTY_RATES } from "@/lib/finance";

const STATES = Object.keys(STAMP_DUTY_RATES);

export function StampDutyCalculator() {
  const [propertyValue, setPropertyValue] = useState(6000000);
  const [state, setState] = useState("Maharashtra");

  const result = useMemo(() => {
    const rates = STAMP_DUTY_RATES[state];
    const stampDuty = (propertyValue * rates.stampDuty) / 100;
    const registration = (propertyValue * rates.registration) / 100;
    return { stampDuty, registration, total: stampDuty + registration, rates };
  }, [propertyValue, state]);

  return (
    <div className="glass-card p-6 sm:p-8" id="stamp-duty">
      <div className="mb-6">
        <p className="eyebrow">Stamp Duty Calculator</p>
        <h3 className="mt-2 text-2xl font-extrabold sm:text-3xl">
          Know your <span className="gold-text-static">registration costs</span>
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Estimate stamp duty and registration charges on a property purchase, state-wise.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-7">
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">State / UT</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm font-semibold text-navy focus:border-gold/50 focus:outline-none"
              aria-label="State"
            >
              {STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Property Value</label>
              <span className="rounded-lg bg-secondary px-3 py-1 text-sm font-bold text-gold-dark">
                {formatCurrency(propertyValue)}
              </span>
            </div>
            <input
              type="range"
              min={500000}
              max={100000000}
              step={100000}
              value={propertyValue}
              onChange={(e) => setPropertyValue(Number(e.target.value))}
              className="w-full"
              aria-label="Property value"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>₹5 L</span>
              <span>₹10 Cr</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-gold/20 bg-gradient-to-b from-gold/5 to-transparent p-4 text-center">
              <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Stamp Duty Rate</p>
              <p className="mt-1 text-lg font-extrabold text-foreground sm:text-xl">{result.rates.stampDuty}%</p>
            </div>
            <div className="rounded-xl border border-gold/20 bg-gradient-to-b from-gold/5 to-transparent p-4 text-center">
              <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Registration Rate</p>
              <p className="mt-1 text-lg font-extrabold text-foreground sm:text-xl">{result.rates.registration}%</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="relative w-full overflow-hidden rounded-2xl border border-gold/20 panel-light p-8 text-center">
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-gold/10 blur-[50px]"></div>
            <p className="relative text-xs font-bold tracking-[0.2em] text-gold-dark uppercase">
              Total Payable
            </p>
            <p className="relative mt-3 text-4xl font-extrabold text-navy sm:text-5xl">
              {formatCurrency(result.total)}
            </p>
            <div className="relative mt-5 h-px w-full bg-gold/20"></div>
            <div className="relative mt-5 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Stamp Duty</p>
                <p className="mt-1 text-lg font-extrabold text-gold">{formatCurrency(result.stampDuty)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Registration</p>
                <p className="mt-1 text-lg font-extrabold text-gold">{formatCurrency(result.registration)}</p>
              </div>
            </div>
            <p className="relative mt-5 text-[11px] text-muted-foreground">
              Indicative rates — actual duty varies by locality, gender concessions and property type. Confirm with your sub-registrar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
