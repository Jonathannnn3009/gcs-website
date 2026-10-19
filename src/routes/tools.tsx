import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  IndianRupee,
  ShieldCheck,
  FileText,
  TrendingDown,
  PiggyBank,
  ArrowLeftRight,
  GitCompare,
  Building2,
  Landmark,
  type LucideIcon,
} from "lucide-react";
import { Section } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { EmiCalculator } from "@/components/emi-calculator";
import { EligibilityCalculator } from "@/components/eligibility-calculator";
import { StampDutyCalculator } from "@/components/stamp-duty-calculator";
import { PrepaymentCalculator } from "@/components/prepayment-calculator";
import { MoneySaverCalculator } from "@/components/money-saver-calculator";
import { BalanceTransferCalculator } from "@/components/balance-transfer-calculator";
import { LoanComparisonCalculator } from "@/components/loan-comparison-calculator";
import { WorkingCapitalCalculator } from "@/components/working-capital-calculator";
import { CgtmseCalculator } from "@/components/cgtmse-calculator";
import { LapLtvCalculator } from "@/components/lap-ltv-calculator";
import { TOOLS_CARDS } from "@/data/page-lists";
import { useFixedList } from "@/lib/page-lists";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "Loan Calculators & Tools | Growth Capital Services" },
      {
        name: "description",
        content:
          "Ten free calculators — EMI, eligibility, stamp duty, prepayment, money saver, balance transfer, loan comparison, working capital, CGTMSE fee and LAP eligibility.",
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
  { id: "money-saver", icon: PiggyBank, label: "Money Saver Calculator", sub: "Interest saved on spare cash", render: () => <MoneySaverCalculator /> },
  { id: "balance-transfer", icon: ArrowLeftRight, label: "Balance Transfer Calculator", sub: "Is switching lenders worth it", render: () => <BalanceTransferCalculator /> },
  { id: "loan-comparison", icon: GitCompare, label: "Loan Comparison", sub: "Compare offers side by side", render: () => <LoanComparisonCalculator /> },
  { id: "working-capital", icon: Building2, label: "Working Capital Estimator", sub: "MSME limit — exclusive to GCS", render: () => <WorkingCapitalCalculator /> },
  { id: "cgtmse", icon: Landmark, label: "CGTMSE Guarantee Fee", sub: "Fee on a collateral-free business loan", render: () => <CgtmseCalculator /> },
  { id: "lap-ltv", icon: FileText, label: "Loan Against Property LTV", sub: "What your property can unlock", render: () => <LapLtvCalculator /> },
];

// The order the calculators are listed in, whatever order the CRM list is saved in.
const ORDER = ["emi", "eligibility", "balance-transfer", "loan-comparison", "prepayment", "money-saver", "lap-ltv", "working-capital", "cgtmse", "stamp-duty"];

const TOOL_IDS = TOOLS.map((t) => t.id);

function useHashTool(defaultId: string) {
  // Starts at defaultId so the first client render matches the server's; the mount effect then
  // picks up a #hash (links such as /tools#eligibility) without a hydration mismatch.
  const [activeId, setActiveId] = useState<string>(defaultId);

  useEffect(() => {
    const onHashChange = () => {
      const h = window.location.hash.replace("#", "");
      if (TOOL_IDS.includes(h)) setActiveId(h);
    };
    window.addEventListener("hashchange", onHashChange);
    if (window.location.hash) onHashChange();
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const select = (id: string) => {
    setActiveId(id);
    if (typeof window !== "undefined") window.history.replaceState(null, "", `#${id}`);
  };

  return [activeId, select] as const;
}

function ToolsPage() {
  const tools = useFixedList("tools.cards", TOOLS_CARDS, "id")
    .map((c) => {
      const base = TOOLS.find((t) => t.id === c.id);
      return base ? { ...base, label: c.label, sub: c.sub } : null;
    })
    .filter((t): t is Tool => t !== null)
    .sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id));
  const [activeId, select] = useHashTool("emi");
  const active = tools.find((t) => t.id === activeId) ?? tools[0];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden hero-light border-b border-gold/15 py-16 sm:py-20">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-gold/8 blur-[120px]"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="eyebrow">Calculators</p>
            <h1 className="mt-4 text-3xl font-extrabold text-navy sm:text-5xl dark:text-white">
              Know Your Numbers. <span className="gold-text">Then Apply with Confidence.</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground">
              Ten free calculators covering every loan on our desk — from EMI and eligibility to
              CGTMSE fees. Pick a calculator from the menu. No signup required.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Menu on the left, selected calculator on the right */}
      <Section>
        <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start">
          {/* Phone and tablet: horizontal scrolling menu */}
          <nav
            aria-label="Calculators"
            className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:hidden"
          >
            {tools.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => select(t.id)}
                aria-current={t.id === active?.id ? "true" : undefined}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors ${
                  t.id === active?.id
                    ? "border-navy bg-navy text-white"
                    : "border-border bg-white text-navy hover:border-gold/50 dark:bg-card dark:text-white"
                }`}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </button>
            ))}
          </nav>

          {/* Laptop and desktop: fixed, scrollable side menu */}
          <nav
            aria-label="Calculators"
            className="sticky top-24 hidden max-h-[calc(100vh-7rem)] overflow-y-auto rounded-3xl border border-[oklch(0.72_0.07_245)] bg-[oklch(0.83_0.06_245)] p-4 shadow-[var(--shadow-card)] lg:block dark:border-border dark:bg-card"
          >
            <p className="px-3 pt-1 pb-3 text-xs font-extrabold tracking-[0.2em] text-gold-dark uppercase">
              Calculators
            </p>
            <ul className="space-y-1">
              {tools.map((t) => {
                const on = t.id === active?.id;
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => select(t.id)}
                      aria-current={on ? "true" : undefined}
                      className={`flex w-full items-center gap-3 rounded-xl border-l-4 px-3 py-2.5 text-left transition-colors ${
                        on
                          ? "border-navy bg-[oklch(0.74_0.09_245)] shadow-sm dark:bg-background"
                          : "border-transparent hover:bg-white/60 dark:hover:bg-gold/5"
                      }`}
                    >
                      <span
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-soft text-gold-dark dark:bg-gold/15"
                      >
                        <t.icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm leading-snug font-bold text-navy dark:text-white">
                          {t.label}
                        </span>
                        <span className="block text-xs text-muted-foreground">{t.sub}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="min-w-0" id={active?.id}>
            <div key={active?.id}>{active?.render()}</div>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Results are indicative and may vary according to lender policy. Final rates, charges
              and eligibility are decided by the lender.
            </p>
          </div>
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
              body: "These calculators give estimates. Actual rates and eligibility depend on your profile, lender policies and property valuation. Talk to our experts for a precise assessment.",
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
