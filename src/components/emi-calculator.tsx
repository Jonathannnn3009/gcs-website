import { useState, useMemo } from "react";
import { SliderField } from "@/components/slider-field";

function formatCurrency(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

function formatINR(n: number): string {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

export function EmiCalculator() {
  const [principal, setPrincipal] = useState(5000000);
  const [rate, setRate] = useState(9.5);
  const [tenure, setTenure] = useState(20);

  const result = useMemo(() => {
    const r = rate / 12 / 100;
    const n = tenure * 12;
    if (r === 0) {
      const emi = principal / n;
      return { emi, totalInterest: 0, totalAmount: principal };
    }
    const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalAmount = emi * n;
    const totalInterest = totalAmount - principal;
    return { emi, totalInterest, totalAmount };
  }, [principal, rate, tenure]);

  const principalPercent = (principal / result.totalAmount) * 100;
  const interestPercent = (result.totalInterest / result.totalAmount) * 100;

  // SVG donut chart
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const principalArc = (principalPercent / 100) * circumference;
  const interestArc = (interestPercent / 100) * circumference;

  return (
    <div className="glass-card p-6 sm:p-8" id="emi-calculator">
      <div className="mb-6">
        <p className="eyebrow">EMI Calculator</p>
        <h3 className="mt-2 text-2xl font-extrabold sm:text-3xl">
          Plan your loan <span className="gold-text-static">payments</span>
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Adjust the sliders to estimate your monthly EMI, total interest and total repayment.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_auto]">
        {/* Sliders */}
        <div className="space-y-7">
          <SliderField
            label="Loan Amount"
            value={principal}
            onChange={setPrincipal}
            min={100000}
            max={100000000}
            step={100000}
            format={formatCurrency}
            minLabel="₹1 L"
            maxLabel="₹10 Cr"
            ariaLabel="Loan amount"
          />

          <SliderField
            label="Interest Rate (p.a.)"
            value={rate}
            onChange={setRate}
            min={5}
            max={24}
            step={0.1}
            suffix="%"
            minLabel="5%"
            maxLabel="24%"
            ariaLabel="Interest rate"
          />

          <SliderField
            label="Loan Tenure"
            value={tenure}
            onChange={setTenure}
            min={1}
            max={30}
            step={1}
            suffix={tenure === 1 ? "Year" : "Years"}
            minLabel="1 Yr"
            maxLabel="30 Yrs"
            ariaLabel="Loan tenure in years"
          />

          {/* Result Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-gold/20 bg-gradient-to-b from-gold/5 to-transparent p-4 text-center">
              <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Monthly EMI</p>
              <p className="mt-1 text-lg font-extrabold text-foreground sm:text-xl">{formatINR(result.emi)}</p>
            </div>
            <div className="rounded-xl border border-gold/20 bg-gradient-to-b from-gold/5 to-transparent p-4 text-center">
              <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Total Interest</p>
              <p className="mt-1 text-lg font-extrabold text-foreground sm:text-xl">{formatCurrency(result.totalInterest)}</p>
            </div>
            <div className="rounded-xl border border-gold/20 bg-gradient-to-b from-gold/5 to-transparent p-4 text-center">
              <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Total Payment</p>
              <p className="mt-1 text-lg font-extrabold text-foreground sm:text-xl">{formatCurrency(result.totalAmount)}</p>
            </div>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <svg width="200" height="200" viewBox="0 0 200 200" className="drop-shadow-lg">
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="oklch(0.91 0.012 255)"
                strokeWidth="20"
              />
              {/* Interest arc */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="oklch(0.15 0.04 264)"
                strokeWidth="20"
                strokeDasharray={`${interestArc} ${circumference - interestArc}`}
                strokeDashoffset={0}
                transform="rotate(-90 100 100)"
                className="transition-all duration-700 ease-out"
                strokeLinecap="round"
              />
              {/* Principal arc */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="url(#goldGradient)"
                strokeWidth="20"
                strokeDasharray={`${principalArc} ${circumference - principalArc}`}
                strokeDashoffset={-interestArc}
                transform="rotate(-90 100 100)"
                className="transition-all duration-700 ease-out"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="oklch(0.70 0.14 68)" />
                  <stop offset="100%" stopColor="oklch(0.82 0.12 80)" />
                </linearGradient>
              </defs>
            </svg>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-muted-foreground uppercase">EMI</span>
              <span className="text-lg font-extrabold text-foreground">{formatINR(result.emi)}</span>
              <span className="text-[10px] text-muted-foreground">per month</span>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 flex gap-6">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ background: "var(--gradient-gold)" }}></span>
              <span className="text-xs font-semibold">Principal ({principalPercent.toFixed(0)}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-navy"></span>
              <span className="text-xs font-semibold">Interest ({interestPercent.toFixed(0)}%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
