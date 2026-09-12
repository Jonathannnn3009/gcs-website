import { useState, useMemo } from "react";
import { emi, formatCurrency, remainingBalance } from "@/lib/finance";

export function RentVsBuyCalculator() {
  const [homePrice, setHomePrice] = useState(8000000);
  const [monthlyRent, setMonthlyRent] = useState(30000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [rate, setRate] = useState(9);
  const [tenure, setTenure] = useState(20);
  const [horizon, setHorizon] = useState(10);

  const result = useMemo(() => {
    const downPayment = (homePrice * downPaymentPct) / 100;
    const loanAmount = homePrice - downPayment;
    const monthlyEmi = emi(loanAmount, rate, tenure);
    const horizonMonths = horizon * 12;
    const emiMonths = Math.min(horizonMonths, tenure * 12);
    const totalEmiPaid = monthlyEmi * emiMonths;
    const balanceAfter = remainingBalance(loanAmount, rate, monthlyEmi, emiMonths);
    const equityBuilt = loanAmount - balanceAfter;
    const netBuyingCost = downPayment + totalEmiPaid - equityBuilt;
    const netRentingCost = monthlyRent * 12 * horizon;
    return { monthlyEmi, netBuyingCost, netRentingCost, equityBuilt, downPayment };
  }, [homePrice, monthlyRent, downPaymentPct, rate, tenure, horizon]);

  const buyingIsCheaper = result.netBuyingCost < result.netRentingCost;

  return (
    <div className="glass-card p-6 sm:p-8" id="rent-vs-buy">
      <div className="mb-6">
        <p className="eyebrow">Rent vs. Buy</p>
        <h3 className="mt-2 text-2xl font-extrabold sm:text-3xl">
          Should you <span className="gold-text-static">rent or buy?</span>
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Compares total rent paid against your net cost of buying — EMIs plus down payment, minus
          the equity you build — over your chosen time horizon.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-7">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground">Home Price</label>
                <span className="rounded-lg bg-secondary px-3 py-1 text-sm font-bold text-gold-dark">
                  {formatCurrency(homePrice)}
                </span>
              </div>
              <input
                type="range"
                min={1000000}
                max={50000000}
                step={500000}
                value={homePrice}
                onChange={(e) => setHomePrice(Number(e.target.value))}
                className="w-full"
                aria-label="Home price"
              />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground">Monthly Rent (equivalent)</label>
                <span className="rounded-lg bg-secondary px-3 py-1 text-sm font-bold text-gold-dark">
                  {formatCurrency(monthlyRent)}
                </span>
              </div>
              <input
                type="range"
                min={5000}
                max={500000}
                step={1000}
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(Number(e.target.value))}
                className="w-full"
                aria-label="Monthly rent"
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Down Payment</label>
              <span className="rounded-lg bg-secondary px-3 py-1 text-sm font-bold text-gold-dark">
                {downPaymentPct}%
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={50}
              step={5}
              value={downPaymentPct}
              onChange={(e) => setDownPaymentPct(Number(e.target.value))}
              className="w-full"
              aria-label="Down payment percentage"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground">Rate</label>
                <span className="rounded-lg bg-secondary px-3 py-1 text-sm font-bold text-gold-dark">
                  {rate.toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min={6}
                max={15}
                step={0.1}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full"
                aria-label="Interest rate"
              />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground">Tenure</label>
                <span className="rounded-lg bg-secondary px-3 py-1 text-sm font-bold text-gold-dark">
                  {tenure} Yr
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={30}
                step={1}
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-full"
                aria-label="Loan tenure"
              />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground">Horizon</label>
                <span className="rounded-lg bg-secondary px-3 py-1 text-sm font-bold text-gold-dark">
                  {horizon} Yr
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                step={1}
                value={horizon}
                onChange={(e) => setHorizon(Number(e.target.value))}
                className="w-full"
                aria-label="Comparison horizon"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="relative w-full overflow-hidden rounded-2xl border border-gold/20 panel-light p-8 text-center">
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-gold/10 blur-[50px]"></div>
            <p className="relative text-xs font-bold tracking-[0.2em] text-gold-dark uppercase">
              {buyingIsCheaper ? "Buying Wins By" : "Renting Wins By"}
            </p>
            <p className="relative mt-3 text-4xl font-extrabold text-navy sm:text-5xl">
              {formatCurrency(Math.abs(result.netBuyingCost - result.netRentingCost))}
            </p>
            <div className="relative mt-5 h-px w-full bg-gold/20"></div>
            <div className="relative mt-5 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Net Cost — Buy</p>
                <p className="mt-1 text-lg font-extrabold text-gold">{formatCurrency(result.netBuyingCost)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Total Cost — Rent</p>
                <p className="mt-1 text-lg font-extrabold text-gold">{formatCurrency(result.netRentingCost)}</p>
              </div>
            </div>
            <p className="relative mt-5 text-[11px] text-muted-foreground">
              Excludes property appreciation, taxes, maintenance and rent escalation — talk to an
              advisor for the full picture.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
