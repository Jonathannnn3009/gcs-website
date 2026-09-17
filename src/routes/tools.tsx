import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  IndianRupee,
  ShieldCheck,
  FileText,
  TrendingDown,
  ArrowLeftRight,
  GitCompare,
  Building2,
  Landmark,
  Gauge,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { Section } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { EmiCalculator } from "@/components/emi-calculator";
import { EligibilityCalculator } from "@/components/eligibility-calculator";
import { StampDutyCalculator } from "@/components/stamp-duty-calculator";
import { PrepaymentCalculator } from "@/components/prepayment-calculator";
import { BalanceTransferCalculator } from "@/components/balance-transfer-calculator";
import { LoanComparisonCalculator } from "@/components/loan-comparison-calculator";
import { WorkingCapitalCalculator } from "@/components/working-capital-calculator";
import { CgtmseCalculator } from "@/components/cgtmse-calculator";
import { LapLtvCalculator } from "@/components/lap-ltv-calculator";
import { CreditScoreEstimator } from "@/components/credit-score-estimator";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "Loan Calculators & Tools | Growth Capital Services" },
      {
        name: "description",
        content:
          "Ten free calculators — EMI, eligibility, stamp duty, prepayment, balance transfer, loan comparison, working capital, CGTMSE fee, LAP eligibility and a credit score estimator.",
      },
      { property: "og:title", content: "Loan Calculators & Tools" },
      {
        property: "og:description",
        content: "Know your numbers, then apply with confidence. Ten free calculators covering every loan on our desk.",
      },
    ],
  }),
  component: ToolsPage,
});

type Tool = {
  id: string;
  icon: LucideIcon;
  label: string;
  sub: string;
  render: () => React.ReactNode;
};

const TOOLS: Tool[] = [
  { id: "emi", icon: IndianRupee, label: "EMI Calculator", sub: "Estimate your monthly EMI", render: () => <EmiCalculator /> },
  { id: "eligibility", icon: ShieldCheck, label: "Eligibility Calculator", sub: "Find your maximum loan amount", render: () => <EligibilityCalculator /> },
  { id: "stamp-duty", icon: FileText, label: "Stamp Duty Calculator", sub: "State-wise registration costs", render: () => <StampDutyCalculator /> },
  { id: "prepayment", icon: TrendingDown, label: "Prepayment Calculator", sub: "Tenure & interest you'll save", render: () => <PrepaymentCalculator /> },
  { id: "balance-transfer", icon: ArrowLeftRight, label: "Balance Transfer Calculator", sub: "Is switching lenders worth it", render: () => <BalanceTransferCalculator /> },
  { id: "loan-comparison", icon: GitCompare, label: "Loan Comparison", sub: "Compare offers side by side", render: () => <LoanComparisonCalculator /> },
  { id: "working-capital", icon: Building2, label: "Working Capital Estimator", sub: "MSME limit — exclusive to GCS", render: () => <WorkingCapitalCalculator /> },
  { id: "cgtmse", icon: Landmark, label: "CGTMSE Guarantee Fee", sub: "Fee on a collateral-free business loan", render: () => <CgtmseCalculator /> },
  { id: "lap-ltv", icon: FileText, label: "Loan Against Property LTV", sub: "What your property can unlock", render: () => <LapLtvCalculator /> },
  { id: "credit-score", icon: Gauge, label: "Credit Score Estimator", sub: "Indicative range, not a bureau pull", render: () => <CreditScoreEstimator /> },
];

const TOOL_IDS = TOOLS.map((t) => t.id);

function useHashAccordion(defaultId: string) {
  // Always starts at defaultId so the client's first render matches the
  // server's (window.location.hash doesn't exist during SSR) — the mount
  // effect below corrects it to the real hash right after, without a
  // hydration mismatch.
  const [openId, setOpenId] = useState<string | null>(defaultId);

  useEffect(() => {
    const openAndScroll = (id: string) => {
      setOpenId(id);
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    };
    const onHashChange = () => {
      const h = window.location.hash.replace("#", "");
      if (TOOL_IDS.includes(h)) openAndScroll(h);
    };
    window.addEventListener("hashchange", onHashChange);
    if (window.location.hash) onHashChange();
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
    if (typeof window !== "undefined") window.history.replaceState(null, "", `#${id}`);
  };

  return [openId, toggle] as const;
}

function ToolsPage() {
  const [openId, toggle] = useHashAccordion("emi");

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
              Ten free calculators covering every loan on our desk — from EMI and eligibility to
              CGTMSE fees and a credit score estimator. Tap one to open it. No signup required.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Accordion */}
      <Section>
        <div className="space-y-3">
          {TOOLS.map((t, i) => {
            const isOpen = openId === t.id;
            return (
              <Reveal key={t.id} delay={Math.min(i * 40, 240)}>
                <div
                  id={t.id}
                  className={`scroll-mt-24 overflow-hidden rounded-2xl border transition-colors duration-300 ${
                    isOpen ? "border-gold/30" : "border-border"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggle(t.id)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center gap-4 bg-white px-5 py-4 text-left transition-colors hover:bg-gold/5 sm:px-6 sm:py-5"
                  >
                    <span
                      className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-colors ${
                        isOpen ? "bg-navy text-gold-light" : "bg-gold-pale/60 text-gold-dark"
                      }`}
                    >
                      <t.icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-base font-bold text-navy">{t.label}</span>
                      <span className="block text-xs text-muted-foreground">{t.sub}</span>
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-gold transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="border-t border-border bg-bg-light p-3 sm:p-5">{t.render()}</div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
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
