import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Section } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { CONTACT } from "@/data/site";

export const Route = createFileRoute("/compare-facilities")({
  head: () => ({
    meta: [
      { title: "Loan Against Property, Drop-Line Overdraft, Overdraft or Working Capital Term Loan? | Growth Capital Services" },
      {
        name: "description",
        content:
          "A simple side-by-side of four ways to raise business funding: loan against property, drop-line overdraft, overdraft limit and working capital term loan. How each is repaid, what it needs, and which may suit you.",
      },
      { property: "og:title", content: "Which facility may suit you? LAP, drop-line overdraft, overdraft or working capital term loan" },
      {
        property: "og:description",
        content: "Four business funding options explained in simple words, side by side.",
      },
    ],
  }),
  component: CompareFacilitiesPage,
});

type Facility = {
  slug: "loan-against-property" | "dlod" | "overdraft-limit" | "working-capital-term-loan";
  name: string;
  what: string;
  repay: string;
  interest: string;
  security: string;
  goodWhen: string;
  keepInMind: string;
};

// Every line here comes from how the site already describes these products. Nothing about rates, amounts or approval is promised.
const FACILITIES: Facility[] = [
  {
    slug: "loan-against-property",
    name: "Loan Against Property",
    what: "Money raised against the value of your property.",
    repay: "EMIs on a term loan. Some lenders also offer it as an overdraft, or a mix of both.",
    interest: "On the loan, if it is a term loan. On the amount you use, if it is set up as an overdraft.",
    security: "Your property. Residential and commercial property are common; some lenders take specialised property too.",
    goodWhen: "You want a set repayment plan, for business or another general need.",
    keepInMind: "Amount, rate and tenure depend on your income, the property and the lender's policy.",
  },
  {
    slug: "dlod",
    name: "Drop-Line Overdraft (Secured)",
    what: "A credit line against your property. The limit comes down on a schedule.",
    repay: "Interest on what you use. If there is a term loan part, an EMI on that part.",
    interest: "Only on the amount you actually use.",
    security: "Your property.",
    goodWhen: "Your cash needs go up and down, and you want to draw and repay as you go.",
    keepInMind: "The limit reduces month by month or year by year, so plan for it.",
  },
  {
    slug: "overdraft-limit",
    name: "Overdraft Limit",
    what: "A ready limit on your current account.",
    repay: "No EMI. You pay interest on the running balance.",
    interest: "Only on what you use.",
    security: "Can be secured (property, fixed deposits, securities) or unsecured.",
    goodWhen: "You need to cover the gap between paying suppliers and getting paid.",
    keepInMind: "It needs an active current account with regular credits, and is reviewed and renewed each year.",
  },
  {
    slug: "working-capital-term-loan",
    name: "Working Capital Term Loan",
    what: "A term loan, with fixed EMIs, for the money your business runs on.",
    repay: "A fixed EMI on a set schedule.",
    interest: "Part of each fixed EMI.",
    security: "Can be offered without collateral to businesses with clean, audited financials.",
    goodWhen: "You want to fill a working capital gap, or turn a stretched cash credit or overdraft into a loan your cash flow can handle.",
    keepInMind: "Audited or CA-certified statements are needed. Lenders look at bank turnover and filings.",
  },
];

const ROWS: { label: string; key: keyof Omit<Facility, "slug" | "name"> }[] = [
  { label: "What it is", key: "what" },
  { label: "How you repay", key: "repay" },
  { label: "Interest is charged on", key: "interest" },
  { label: "Security", key: "security" },
  { label: "May suit you when", key: "goodWhen" },
  { label: "Keep in mind", key: "keepInMind" },
];

const CHOOSE: { need: string; answer: string }[] = [
  { need: "I want a fixed EMI and a clear end date.", answer: "A loan against property (as a term loan) or a working capital term loan." },
  { need: "I want to draw and repay as my cash needs change.", answer: "A drop-line overdraft against property, or an overdraft limit on your current account." },
  { need: "I have a property I can offer.", answer: "A loan against property or a drop-line overdraft." },
  { need: "I would rather not offer security.", answer: "An overdraft limit can be unsecured, and a working capital term loan can be offered without collateral to businesses with clean, audited financials." },
];

function askRia(message: string) {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("gcs:open-chat", { detail: { message } }));
}

function CompareFacilitiesPage() {
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
                  <Link to="/services" className="hover:text-white">
                    Our Services
                  </Link>
                  <span className="text-gold">/</span>
                  <span className="text-white">Compare facilities</span>
                </p>
                <p className="eyebrow mt-5">Compare loan options</p>
                <h1
                  className="mt-4 text-3xl leading-tight font-extrabold text-white sm:text-5xl"
                  style={{ fontFamily: "var(--font-sans)", letterSpacing: "-0.01em" }}
                >
                  Which facility <span className="gold-text">may suit you?</span>
                </h1>
                <p className="mt-4 max-w-2xl text-base text-white/70">
                  A loan against property, a drop-line overdraft, an overdraft limit and a working capital term loan can all give your business money. They work in different ways. Here is the difference, in simple words.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Section className="pt-0">
        <Reveal animate={false}>
          <div className="overflow-x-auto rounded-2xl border border-border bg-white dark:bg-card">
            <table className="w-full min-w-[56rem] border-collapse text-left text-sm">
              <caption className="sr-only">Four business funding options compared</caption>
              <thead>
                <tr className="bg-bg-light dark:bg-background">
                  <th scope="col" className="w-40 p-4 text-xs font-bold tracking-wide text-muted-foreground uppercase" />
                  {FACILITIES.map((f) => (
                    <th key={f.slug} scope="col" className="p-4 align-bottom">
                      <Link to="/services/$slug" params={{ slug: f.slug }} className="text-base font-extrabold text-navy hover:text-gold-dark dark:text-white">
                        {f.name}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.key} className="border-t border-border align-top">
                    <th scope="row" className="p-4 text-xs font-bold tracking-wide text-gold-dark uppercase">
                      {row.label}
                    </th>
                    {FACILITIES.map((f) => (
                      <td key={f.slug} className="p-4 leading-relaxed text-muted-foreground">
                        {f[row.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </Section>

      <Section className="pt-0">
        <Reveal animate={false}>
          <h2 className="text-2xl font-extrabold text-navy sm:text-3xl dark:text-white">
            Not sure where to start? <span className="gold-text">Think about it like this</span>
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {CHOOSE.map((c) => (
              <div key={c.need} className="rounded-2xl border border-border bg-white p-5 dark:bg-card">
                <p className="text-base font-bold text-navy dark:text-white">{c.need}</p>
                <p className="mt-2 text-sm text-muted-foreground">{c.answer}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      <Section className="pt-0">
        <Reveal animate={false}>
          <div className="relative overflow-hidden rounded-2xl border border-gold/25 panel-light p-8 text-center sm:p-12">
            <div className="absolute top-0 right-1/4 h-60 w-60 rounded-full bg-gold/10 blur-[80px]" />
            <h3 className="relative text-2xl font-extrabold text-navy sm:text-3xl dark:text-white">
              Still not sure? <span className="gold-text">We will help you choose.</span>
            </h3>
            <p className="relative mt-3 text-sm text-muted-foreground">
              Tell us what you need and our team will compare the options from our network of 75+ Banks and NBFCs. Or call {CONTACT.phone}, {CONTACT.hours}.
            </p>
            <div className="relative mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/contact" className="gold-btn py-3.5 text-base">
                Talk to Our Loan Expert <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={() => askRia("Help me choose between a loan against property, a drop-line overdraft, an overdraft limit and a working capital term loan.")}
                className="outline-btn inline-flex items-center gap-2 dark:bg-card dark:text-white"
              >
                <MessageCircle className="h-4 w-4" /> Ask Ria
              </button>
            </div>
          </div>
        </Reveal>
        <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-relaxed text-muted-foreground">
          Important note: amount, interest rate, tenure, charges, eligibility, approval and disbursement depend on the policy of the respective Bank or NBFC, your profile, credit assessment and the applicable terms. Growth Capital Services is a loan consultant and does not lend money itself. The details on this page are for general information.
        </p>
      </Section>
    </>
  );
}
