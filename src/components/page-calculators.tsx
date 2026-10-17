import { useState, type ReactNode } from "react";
import {
  ArrowLeftRight,
  Building2,
  FileText,
  Gauge,
  GitCompare,
  IndianRupee,
  Landmark,
  PiggyBank,
  ShieldCheck,
  TrendingDown,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Section, SectionHeading } from "@/components/section";
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
import { CreditScoreEstimator } from "@/components/credit-score-estimator";
import type { CalcId } from "@/data/page-calculators";

export const CALCULATORS: Record<CalcId, { label: string; icon: LucideIcon; render: () => ReactNode }> = {
  emi: { label: "EMI", icon: IndianRupee, render: () => <EmiCalculator /> },
  eligibility: { label: "Eligibility", icon: ShieldCheck, render: () => <EligibilityCalculator /> },
  "stamp-duty": { label: "Stamp duty", icon: FileText, render: () => <StampDutyCalculator /> },
  prepayment: { label: "Prepayment", icon: TrendingDown, render: () => <PrepaymentCalculator /> },
  "money-saver": { label: "Money saver", icon: PiggyBank, render: () => <MoneySaverCalculator /> },
  "balance-transfer": { label: "Balance transfer", icon: ArrowLeftRight, render: () => <BalanceTransferCalculator /> },
  "loan-comparison": { label: "Compare loans", icon: GitCompare, render: () => <LoanComparisonCalculator /> },
  "working-capital": { label: "Working capital", icon: Building2, render: () => <WorkingCapitalCalculator /> },
  cgtmse: { label: "CGTMSE fee", icon: Landmark, render: () => <CgtmseCalculator /> },
  "lap-ltv": { label: "Property LTV", icon: FileText, render: () => <LapLtvCalculator /> },
  "credit-score": { label: "Credit score", icon: Gauge, render: () => <CreditScoreEstimator /> },
};

/** The calculators that fit one page, as a section: tabs when there are several, none when there is one. */
export function PageCalculators({
  ids,
  eyebrow = "Calculators",
  title,
  description,
  className = "pt-0",
}: {
  ids: CalcId[];
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  const [active, setActive] = useState<CalcId>(ids[0] as CalcId);
  if (ids.length === 0) return null;
  const current = ids.includes(active) ? active : (ids[0] as CalcId);

  return (
    <Section className={className}>
      <Reveal animate={false}>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          {...(description ? { description } : {})}
          align="center"
        />
      </Reveal>

      {ids.length > 1 && (
        <div role="tablist" aria-label="Calculators" className="mt-8 flex flex-wrap justify-center gap-2">
          {ids.map((id) => {
            const c = CALCULATORS[id];
            const on = id === current;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setActive(id)}
                className={`group/tab inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 active:scale-95 ${
                  on
                    ? "border-navy bg-navy text-white shadow-[var(--shadow-card)]"
                    : "border-border bg-white text-navy hover:border-gold/60 dark:bg-card dark:text-white"
                }`}
              >
                <c.icon className="h-4 w-4 transition-transform duration-300 group-hover/tab:scale-125 group-hover/tab:-rotate-6" />
                {c.label}
              </button>
            );
          })}
        </div>
      )}

      <div key={current} className="mx-auto mt-8 max-w-5xl animate-[gcs-slide-up_500ms_ease-out_both]">
        {CALCULATORS[current].render()}
      </div>
    </Section>
  );
}
