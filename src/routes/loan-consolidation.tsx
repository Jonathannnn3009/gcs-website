import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, MessageCircle, X } from "lucide-react";
import { Section } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { ConsolidationCalculator } from "@/components/consolidation-calculator";
import { ChecklistGate } from "@/components/checklist-gate";
import { CONTACT } from "@/data/site";

export const Route = createFileRoute("/loan-consolidation")({
  head: () => ({
    meta: [
      { title: "Loan Consolidation: Combine Multiple EMIs and Card Dues | Growth Capital Services" },
      {
        name: "description",
        content:
          "Many EMIs and card dues to track? Learn what loan consolidation is, when it may help and when it may not, try a calculator that shows the total cost, and get help comparing options from 75+ Banks and NBFCs.",
      },
      { property: "og:title", content: "Loan Consolidation | Growth Capital Services" },
      {
        property: "og:description",
        content: "Explore combining several loans and card dues into one repayment, with a calculator that shows the whole cost.",
      },
    ],
  }),
  component: LoanConsolidationPage,
});

const MAY_HELP = [
  "You pay several EMIs and card dues on different dates and find it hard to keep track.",
  "You pay only the minimum on credit cards and the balance keeps growing.",
  "You want to see your options in one place before deciding anything.",
];
const MAY_NOT_HELP = [
  "Your loans have only a few months left. A new loan may cost more than finishing them.",
  "Closing the old loans carries charges, or the new loan has a high processing fee.",
  "The new loan is much longer. A lower EMI can then mean more paid in total.",
  "Some payments are overdue or an account was settled. Please talk to us first, because that needs a different look.",
];
const STEPS = [
  { title: "Tell us what you owe", body: "Each loan or card: who it is with, how much is left, the EMI and the months left." },
  { title: "We look at the whole picture", body: "Your income, what you already pay each month, your repayment record and your credit history." },
  { title: "We compare options", body: "From our network of 75+ Banks and NBFCs, we look at the ones whose policy may fit your profile." },
  { title: "You see the full cost", body: "Monthly payment, total repayment, fees and any charges for closing the old loans, side by side." },
  { title: "You decide, we help with the paperwork", body: "If you go ahead, we guide you through documents and the lender's process." },
];
const FAQS = [
  { q: "Will consolidation lower my interest?", a: "Not always. It depends on the new rate, the period, the fees and the charges for closing your old loans. The calculator above shows the total cost, not just the monthly payment." },
  { q: "Can credit card dues be included?", a: "Some lenders may allow it. It depends on the lender's policy and your profile. Tell us what you owe and we will check." },
  { q: "How can it be arranged?", a: "Depending on your eligibility, it may be a new personal loan, a balance transfer, a top-up or another suitable facility." },
  { q: "Do I need a good credit score?", a: "Lenders look at your income, your repayments and your credit history. We cannot promise approval. The lender takes the final decision." },
];

function askRia(message: string) {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("gcs:open-chat", { detail: { message } }));
}

function LoanConsolidationPage() {
  return (
    <>
      <section className="bg-bg-light py-10 sm:py-14 dark:bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal animate={false}>
            <div className="navy-panel relative overflow-hidden rounded-3xl p-8 sm:p-12">
              <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-gold/10 blur-[100px]" />
              <div className="relative">
                <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-white/50 uppercase">
                  <Link to="/" className="hover:text-white">
                    Home
                  </Link>
                  <span className="text-gold">/</span>
                  <Link to="/services/$slug" params={{ slug: "personal-loan" }} className="hover:text-white">
                    Personal Loan
                  </Link>
                  <span className="text-gold">/</span>
                  <span className="text-white">Loan Consolidation</span>
                </p>
                <p className="eyebrow mt-5">Loan Consolidation</p>
                <h1 className="mt-4 text-3xl leading-tight font-extrabold text-white sm:text-5xl" style={{ fontFamily: "var(--font-sans)", letterSpacing: "-0.01em" }}>
                  Many EMIs? <span className="gold-text">Explore one repayment.</span>
                </h1>
                <p className="mt-4 max-w-2xl text-base text-white/70">
                  Loan consolidation means using one new loan to pay off several existing loans or card dues, so you make one payment instead of many. It does not always save money, so look at the whole cost first. We help you do that.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="#consolidation" className="gold-btn py-3">
                    Try the calculator <ArrowRight className="h-4 w-4" />
                  </a>
                  <button type="button" onClick={() => askRia("I have several loans and card dues and want to know if loan consolidation could help me.")} className="outline-btn inline-flex items-center gap-2 !bg-transparent !text-white">
                    <MessageCircle className="h-4 w-4" /> Ask Ria
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Section className="pt-0">
        <Reveal animate={false}>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-white p-6 dark:bg-card">
              <h2 className="text-xl font-extrabold text-navy dark:text-white">When it may help</h2>
              <ul className="mt-4 space-y-3">
                {MAY_HELP.map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-white p-6 dark:bg-card">
              <h2 className="text-xl font-extrabold text-navy dark:text-white">When it may not help</h2>
              <ul className="mt-4 space-y-3">
                {MAY_NOT_HELP.map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </Section>

      <Section className="pt-0">
        <Reveal animate={false}>
          <ConsolidationCalculator />
        </Reveal>
      </Section>

      <Section className="pt-0">
        <Reveal animate={false}>
          <h2 className="text-2xl font-extrabold text-navy sm:text-3xl dark:text-white">
            How we <span className="gold-text">help you</span>
          </h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="rounded-2xl border border-border bg-white p-5 dark:bg-card">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-gold-pale/60 text-sm font-extrabold text-gold-dark dark:bg-gold/15">{i + 1}</span>
                <p className="mt-3 text-base font-bold text-navy dark:text-white">{s.title}</p>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </Section>

      <Section className="pt-0">
        <Reveal animate={false}>
          <h2 className="text-2xl font-extrabold text-navy sm:text-3xl dark:text-white">
            Common <span className="gold-text">questions</span>
          </h2>
          <div className="mt-6 space-y-3">
            {FAQS.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-border bg-white p-5 dark:bg-card">
                <summary className="cursor-pointer text-base font-bold text-navy dark:text-white">{f.q}</summary>
                <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </Section>

      <Section className="pt-0">
        <Reveal animate={false}>
          <div className="mx-auto max-w-2xl rounded-2xl bg-navy p-6 sm:p-8">
            <h3 className="text-lg font-extrabold text-white">Documents for a consolidation</h3>
            <p className="mt-2 mb-4 text-sm text-white/70">
              The papers for every loan and card you want to combine, with your KYC and income documents, sent as a PDF you can save or print.
            </p>
            <ChecklistGate pdfHref="/checklists/loan-consolidation-checklist.pdf" productTitle="Loan Consolidation" productSlug="personal-loan" />
          </div>
        </Reveal>
      </Section>

      <Section className="pt-0">
        <Reveal animate={false}>
          <div className="relative overflow-hidden rounded-2xl border border-gold/25 panel-light p-8 text-center sm:p-12">
            <div className="absolute top-0 right-1/4 h-60 w-60 rounded-full bg-gold/10 blur-[80px]" />
            <h3 className="relative text-2xl font-extrabold text-navy sm:text-3xl dark:text-white">
              Not sure if it suits you? <span className="gold-text">Talk to our loan expert.</span>
            </h3>
            <p className="relative mt-3 text-sm text-muted-foreground">
              Tell us what you owe and we will compare the options from our network of 75+ Banks and NBFCs. Or call {CONTACT.phone}, {CONTACT.hours}.
            </p>
            <div className="relative mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/contact" className="gold-btn py-3.5 text-base">
                Request a Call Back <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/services/$slug" params={{ slug: "balance-transfer" }} className="outline-btn dark:bg-card dark:text-white">
                Compare Loan Options
              </Link>
            </div>
          </div>
        </Reveal>
        <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-relaxed text-muted-foreground">
          Important note: loan consolidation does not automatically reduce interest or total repayment. Amount, interest rate, tenure, charges, eligibility, approval and disbursement depend on the policy of the respective Bank or NBFC, your profile, credit assessment and the applicable terms. Growth Capital Services is a loan consultant and does not lend money itself. The details on this page are for general information.
        </p>
      </Section>
    </>
  );
}
