import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { EmiCalculator } from "@/components/emi-calculator";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "Loan Calculators & Tools | Growth Capital Services" },
      {
        name: "description",
        content:
          "Free EMI calculator and loan eligibility calculator. Estimate your monthly EMI, total interest and maximum loan amount based on your income.",
      },
      { property: "og:title", content: "Loan Calculators & Tools" },
      {
        property: "og:description",
        content: "Plan first. Apply with clarity. Free EMI and eligibility calculators.",
      },
    ],
  }),
  component: ToolsPage,
});

function formatCurrency(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

function EligibilityCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useState(100000);
  const [existingEmi, setExistingEmi] = useState(0);
  const [rate, setRate] = useState(9);
  const [tenure, setTenure] = useState(20);

  const result = useMemo(() => {
    const maxEmi = (monthlyIncome - existingEmi) * 0.5; // 50% FOIR
    if (maxEmi <= 0) return { maxLoan: 0, maxEmi: 0 };
    const r = rate / 12 / 100;
    const n = tenure * 12;
    if (r === 0) return { maxLoan: maxEmi * n, maxEmi };
    const maxLoan = (maxEmi * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n));
    return { maxLoan, maxEmi };
  }, [monthlyIncome, existingEmi, rate, tenure]);

  return (
    <div className="glass-card p-6 sm:p-8" id="eligibility">
      <div className="mb-6">
        <p className="eyebrow">Eligibility Calculator</p>
        <h3 className="mt-2 text-2xl font-extrabold sm:text-3xl">
          How much can you <span className="gold-text-static">borrow?</span>
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Find out your maximum loan amount based on your monthly income and existing obligations.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-7">
          {/* Monthly Income */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Monthly Income (Net)</label>
              <span className="rounded-lg bg-secondary px-3 py-1 text-sm font-bold text-gold-dark">
                {formatCurrency(monthlyIncome)}
              </span>
            </div>
            <input
              type="range"
              min={20000}
              max={5000000}
              step={10000}
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(Number(e.target.value))}
              className="w-full"
              aria-label="Monthly income"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>₹20K</span>
              <span>₹50L</span>
            </div>
          </div>

          {/* Existing EMIs */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Existing EMIs</label>
              <span className="rounded-lg bg-secondary px-3 py-1 text-sm font-bold text-gold-dark">
                {formatCurrency(existingEmi)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={Math.max(monthlyIncome * 0.6, 10000)}
              step={1000}
              value={existingEmi}
              onChange={(e) => setExistingEmi(Number(e.target.value))}
              className="w-full"
              aria-label="Existing EMIs"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>₹0</span>
              <span>{formatCurrency(Math.max(monthlyIncome * 0.6, 10000))}</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Expected Interest Rate</label>
              <span className="rounded-lg bg-secondary px-3 py-1 text-sm font-bold text-gold-dark">
                {rate.toFixed(1)}%
              </span>
            </div>
            <input
              type="range"
              min={6}
              max={20}
              step={0.25}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full"
              aria-label="Interest rate"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>6%</span>
              <span>20%</span>
            </div>
          </div>

          {/* Tenure */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-foreground">Preferred Tenure</label>
              <span className="rounded-lg bg-secondary px-3 py-1 text-sm font-bold text-gold-dark">
                {tenure} Years
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="w-full"
              aria-label="Tenure"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>1 Year</span>
              <span>30 Years</span>
            </div>
          </div>
        </div>

        {/* Result */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-full overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-b from-navy to-navy-soft p-8 text-center text-white">
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-gold/10 blur-[50px]"></div>
            <p className="relative text-xs font-bold tracking-[0.2em] text-gold uppercase">
              Maximum Loan Amount
            </p>
            <p
              className="relative mt-3 text-4xl font-extrabold text-white sm:text-5xl"
              style={{ animation: "gcs-count-up 500ms ease both" }}
              key={result.maxLoan}
            >
              {formatCurrency(result.maxLoan)}
            </p>
            <div className="relative mt-5 h-px w-full bg-white/10"></div>
            <div className="relative mt-5 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold tracking-wider text-white/50 uppercase">Max EMI</p>
                <p className="mt-1 text-lg font-extrabold text-gold">
                  {formatCurrency(result.maxEmi)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-wider text-white/50 uppercase">FOIR Used</p>
                <p className="mt-1 text-lg font-extrabold text-gold">50%</p>
              </div>
            </div>
            <p className="relative mt-5 text-[11px] text-white/40">
              Based on 50% Fixed Obligation to Income Ratio. Actual eligibility may vary.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToolsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy via-navy-soft to-navy py-16 sm:py-20">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-gold/8 blur-[120px]"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="eyebrow">Calculators</p>
            <h1 className="mt-4 text-3xl font-extrabold text-white sm:text-5xl">
              Plan First. <span className="gold-text">Apply with Clarity.</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base text-white/70">
              Use our free calculators to estimate EMI, eligibility, and plan your loan
              before you apply. No signup required.
            </p>
          </Reveal>
        </div>
      </section>

      {/* EMI Calculator */}
      <Section id="emi">
        <Reveal>
          <EmiCalculator />
        </Reveal>
      </Section>

      {/* Eligibility Calculator */}
      <Section className="pt-0" id="eligibility">
        <Reveal>
          <EligibilityCalculator />
        </Reveal>
      </Section>

      {/* Info cards */}
      <Section className="pt-0">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "How EMI is Calculated",
              body: "EMI = P × r × (1+r)^n / ((1+r)^n - 1), where P = principal, r = monthly rate, n = total months. A higher tenure reduces EMI but increases total interest.",
            },
            {
              title: "What is FOIR?",
              body: "Fixed Obligation to Income Ratio (FOIR) is the percentage of your income going toward EMIs. Most banks use a 50-60% FOIR cap to determine your maximum loan eligibility.",
            },
            {
              title: "Need Expert Advice?",
              body: "These calculators give estimates. Actual rates and eligibility depend on your profile, lender policies and property valuation. Talk to our advisors for a precise assessment.",
            },
          ].map((card, i) => (
            <Reveal key={card.title} delay={i * 60}>
              <div className="surface-card h-full p-6">
                <h3 className="text-base font-extrabold">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
