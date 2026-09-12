import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { EmiCalculator } from "@/components/emi-calculator";
import { EligibilityCalculator } from "@/components/eligibility-calculator";
import { StampDutyCalculator } from "@/components/stamp-duty-calculator";
import { PrepaymentCalculator } from "@/components/prepayment-calculator";
import { BalanceTransferCalculator } from "@/components/balance-transfer-calculator";
import { LoanComparisonCalculator } from "@/components/loan-comparison-calculator";
import { WorkingCapitalCalculator } from "@/components/working-capital-calculator";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "Loan Calculators & Tools | Growth Capital Services" },
      {
        name: "description",
        content:
          "Free EMI, eligibility, stamp duty, prepayment, balance transfer, loan comparison and working capital calculators. Estimate your numbers before you apply.",
      },
      { property: "og:title", content: "Loan Calculators & Tools" },
      {
        property: "og:description",
        content:
          "Know your numbers, then apply with confidence. Seven free calculators covering every loan on our desk.",
      },
    ],
  }),
  component: ToolsPage,
});

const CALCULATORS = [
  { id: "emi", label: "EMI" },
  { id: "eligibility", label: "Eligibility" },
  { id: "stamp-duty", label: "Stamp Duty" },
  { id: "prepayment", label: "Prepayment" },
  { id: "balance-transfer", label: "Balance Transfer" },
  { id: "loan-comparison", label: "Loan Comparison" },
  { id: "working-capital", label: "Working Capital" },
];

function ToolsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden hero-light border-b border-gold/15 py-16 sm:py-20">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-gold/8 blur-[120px]"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="eyebrow">Calculators</p>
            <h1 className="mt-4 text-3xl font-extrabold text-navy sm:text-5xl">
              Know Your Numbers. <span className="gold-text">Then Apply with Confidence.</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground">
              Seven free calculators to plan EMI, eligibility, registration costs, prepayment,
              balance transfer, lender comparison and business working capital. No signup required.
            </p>
          </Reveal>

          <Reveal delay={100} className="mt-8 flex flex-wrap gap-2.5">
            {CALCULATORS.map((c) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-navy transition-colors hover:border-gold/40"
              >
                {c.label}
              </a>
            ))}
          </Reveal>
        </div>
      </section>

      <Section id="emi">
        <Reveal>
          <EmiCalculator />
        </Reveal>
      </Section>

      <Section className="pt-0" id="eligibility">
        <Reveal>
          <EligibilityCalculator />
        </Reveal>
      </Section>

      <Section className="pt-0">
        <Reveal>
          <StampDutyCalculator />
        </Reveal>
      </Section>

      <Section className="pt-0">
        <Reveal>
          <PrepaymentCalculator />
        </Reveal>
      </Section>

      <Section className="pt-0">
        <Reveal>
          <BalanceTransferCalculator />
        </Reveal>
      </Section>

      <Section className="pt-0">
        <Reveal>
          <LoanComparisonCalculator />
        </Reveal>
      </Section>

      <Section className="pt-0">
        <Reveal>
          <WorkingCapitalCalculator />
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
