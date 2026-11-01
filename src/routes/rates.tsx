import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Calculator } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { ExpertNote } from "@/components/expert-note";
import { PageCalculators } from "@/components/page-calculators";
import { CONTACT } from "@/data/site";
import { useBankRates } from "@/lib/site-content";
import { useRatesText } from "@/lib/site-content";

export const Route = createFileRoute("/rates")({
  head: () => ({
    meta: [
      { title: "Current Loan Interest Rates | Growth Capital Services" },
      {
        name: "description",
        content:
          "Indicative interest rates and processing fees for home loans, loan against property, business loans, personal loans and more across banks and NBFCs.",
      },
      { property: "og:title", content: "Current Loan Interest Rates | Growth Capital Services" },
      {
        property: "og:description",
        content: "Indicative starting rates by loan type and lender, kept up to date by our team.",
      },
    ],
  }),
  component: RatesPage,
});

function formatDate(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

function RatesPage() {
  const t = useRatesText();
  const rates = useBankRates();
  const products = useMemo(
    () => Array.from(new Set(rates.rows.map((r) => r.product))),
    [rates.rows],
  );
  const [product, setProduct] = useState("All");
  const rows = product === "All" ? rates.rows : rates.rows.filter((r) => r.product === product);
  const hasFee = rows.some((r) => r.fee);
  const hasNote = rows.some((r) => r.note);

  return (
    <>
      <section className="relative overflow-hidden bg-bg-light py-14 sm:py-20 dark:bg-background">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-gold/8 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              <Link to="/" className="hover:text-navy dark:text-white">
                Home
              </Link>
              <span className="text-gold">/</span>
              <span className="text-navy dark:text-white">Interest Rates</span>
            </p>
            <p className="eyebrow mt-5">{t("hero.eyebrow")}</p>
            <h1 className="mt-3 text-3xl font-extrabold text-navy sm:text-5xl dark:text-white">
              {t("hero.title")} <span className="gold-text-static italic">{t("hero.gold")}</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground">
              {t("hero.body1")}
              {rates.asOf ? ` Last checked ${formatDate(rates.asOf)}.` : ""} {t("hero.body2")}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {products.length > 1 && (
          <div className="mb-5 flex flex-wrap gap-2">
            {["All", ...products].map((p) => (
              <button
                key={p}
                onClick={() => setProduct(p)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
                  product === p
                    ? "bg-navy text-white"
                    : "border border-border bg-white text-muted-foreground hover:text-navy dark:bg-card"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-[var(--shadow-card)] dark:bg-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="bg-bg-light/70 text-[11px] font-bold tracking-wide text-navy uppercase dark:bg-secondary dark:text-white">
                <tr>
                  <th className="px-5 py-4">Loan</th>
                  <th className="px-5 py-4">Lender</th>
                  <th className="px-5 py-4">Rate p.a.</th>
                  {hasFee && <th className="px-5 py-4">Processing fee</th>}
                  {hasNote && <th className="px-5 py-4">Note</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((r, i) => (
                  <tr key={`${r.product}-${r.bank}-${i}`} className="hover:bg-bg-light/50">
                    <td className="px-5 py-3.5 font-bold text-navy dark:text-white">{r.product}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{r.bank}</td>
                    <td className="px-5 py-3.5 font-bold text-gold-dark">
                      {r.rateTo ? `${r.rateFrom} – ${r.rateTo}` : `From ${r.rateFrom}`}
                    </td>
                    {hasFee && (
                      <td className="px-5 py-3.5 text-muted-foreground">{r.fee ?? "—"}</td>
                    )}
                    {hasNote && (
                      <td className="px-5 py-3.5 text-muted-foreground">{r.note ?? ""}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground italic">{rates.disclaimer}</p>

        <ExpertNote className="mt-8">
          {t("note")}
        </ExpertNote>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/contact" className="gold-btn px-6 py-3 text-sm">
            {t("button.rate")} <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/tools"
            className="inline-flex items-center gap-2 rounded-lg border border-gold/40 px-6 py-3 text-sm font-bold text-gold-dark hover:bg-gold-pale/40"
          >
            <Calculator className="h-4 w-4" /> {t("button.emi")}
          </Link>
          <a
            href={CONTACT.phoneHref}
            className="inline-flex items-center gap-2 px-2 py-3 text-sm font-semibold text-muted-foreground hover:text-navy"
          >
            {t("button.call").replace("{phone}", CONTACT.phone)}
          </a>
        </div>
      </section>

      <PageCalculators
        ids={["emi", "loan-comparison", "eligibility"]}
        eyebrow={t("calc.eyebrow")}
        title={t("calc.title")}
        description={t("calc.body")}
        className="pt-4"
      />
    </>
  );
}
