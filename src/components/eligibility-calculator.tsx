import { CalcExpertButton } from "@/components/calc-expert-button";
import { useState, useMemo } from "react";
import { formatCurrency, principalFromEmi } from "@/lib/finance";
import { SliderField } from "@/components/slider-field";
import { useCalcState } from "@/lib/page-lists";

export function EligibilityCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useState(100000);
  const [existingEmi, setExistingEmi] = useState(0);
  const [rate, setRate] = useCalcState("eligRate", 9);
  const [foirPct, setFoirPct] = useCalcState("foir", 50);
  const [tenure, setTenure] = useState(20);

  const result = useMemo(() => {
    // Income x FOIR gives the most the applicant can pay in EMIs in total; existing EMIs come off that.
    const totalEmi = monthlyIncome * (foirPct / 100);
    const maxEmi = totalEmi - existingEmi;
    if (maxEmi <= 0) return { maxLoan: 0, maxEmi: 0, totalEmi };
    return { maxLoan: principalFromEmi(maxEmi, rate, tenure), maxEmi, totalEmi };
  }, [monthlyIncome, existingEmi, rate, tenure, foirPct]);

  return (
    <div className="glass-card p-6 sm:p-8">
      <div className="mb-6">
        <p className="eyebrow">Eligibility Calculator</p>
        <h3 className="mt-2 text-2xl font-extrabold sm:text-3xl">
          How much can you <span className="gold-text-static">borrow?</span>
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Find out your maximum loan amount based on your monthly income and existing obligations.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
        <div className="flex flex-col gap-7 lg:justify-evenly">
          <SliderField
            label="Monthly Income (Net)"
            value={monthlyIncome}
            onChange={setMonthlyIncome}
            min={20000}
            max={5000000}
            step={10000}
            format={formatCurrency}
            minLabel="₹20K"
            maxLabel="₹50L"
            ariaLabel="Monthly income"
          />

          <SliderField
            label="FOIR (share of income that can go to EMIs)"
            value={foirPct}
            onChange={setFoirPct}
            min={10}
            max={90}
            step={5}
            hardMax={100}
            suffix="%"
            minLabel="10%"
            maxLabel="90%"
            ariaLabel="FOIR percentage"
          />

          <SliderField
            label="Existing EMIs"
            value={existingEmi}
            onChange={setExistingEmi}
            min={0}
            max={Math.max(monthlyIncome * 0.6, 10000)}
            step={1000}
            format={formatCurrency}
            minLabel="₹0"
            maxLabel={formatCurrency(Math.max(monthlyIncome * 0.6, 10000))}
            ariaLabel="Existing EMIs"
          />

          <SliderField
            label="Expected Interest Rate"
            value={rate}
            onChange={setRate}
            min={6}
            max={20}
            step={0.25}
            suffix="%"
            minLabel="6%"
            maxLabel="20%"
            ariaLabel="Interest rate"
          />

          <SliderField
            label="Preferred Tenure"
            value={tenure}
            onChange={setTenure}
            min={1}
            max={30}
            step={1}
            suffix={tenure === 1 ? "Year" : "Years"}
            minLabel="1 Year"
            maxLabel="30 Years"
            ariaLabel="Tenure"
          />
        </div>

        {/* Result */}
        <div className="flex flex-col gap-4">
          <div className="relative flex w-full flex-1 flex-col justify-center overflow-hidden rounded-2xl border border-gold/20 panel-light p-8 text-center">
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-gold/10 blur-[50px]"></div>
            <p className="relative text-xs font-bold tracking-[0.2em] text-gold-dark uppercase">
              Maximum Loan Amount
            </p>
            <p
              className="relative mt-3 text-4xl font-extrabold text-navy sm:text-5xl dark:text-white"
              style={{ animation: "gcs-count-up 500ms ease both" }}
              key={result.maxLoan}
            >
              {formatCurrency(result.maxLoan)}
            </p>
            <div className="relative mt-5 h-px w-full bg-gold/20"></div>
            <div className="relative mt-5 grid grid-cols-3 gap-3">
              <div>
                <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                  Total EMI limit
                </p>
                <p className="mt-1 text-base font-extrabold text-gold">
                  {formatCurrency(result.totalEmi)}
                </p>
                <p className="text-[10px] text-muted-foreground">{foirPct}% of income</p>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                  Less existing EMIs
                </p>
                <p className="mt-1 text-base font-extrabold text-gold">
                  {formatCurrency(existingEmi)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                  EMI for new loan
                </p>
                <p className="mt-1 text-base font-extrabold text-gold">
                  {formatCurrency(result.maxEmi)}
                </p>
              </div>
            </div>
            <p className="relative mt-5 text-[11px] text-muted-foreground">
              FOIR (Fixed Obligation to Income Ratio) of {foirPct}% sets the most you can pay in EMIs in total. Your existing EMIs are subtracted from that to find what is left for the new loan. Each lender sets its own limit, so actual eligibility may vary.
            </p>
          </div>
          <CalcExpertButton />
        </div>
      </div>
    </div>
  );
}
