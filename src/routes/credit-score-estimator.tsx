import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Compass, FileText } from "lucide-react";
import { Section } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { CreditScoreEstimator } from "@/components/credit-score-estimator";
import { useEstimatorText } from "@/lib/site-content";

export const Route = createFileRoute("/credit-score-estimator")({
  head: () => ({
    meta: [
      { title: "Credit Score Estimator | Growth Capital Services" },
      {
        name: "description",
        content:
          "Answer a few simple questions to see an indicative credit score range. A quick estimate, not a credit bureau report.",
      },
      { property: "og:title", content: "Credit Score Estimator" },
      {
        property: "og:description",
        content: "A quick, free estimate of your credit score range. Nothing you enter is saved or sent.",
      },
    ],
  }),
  component: CreditScoreEstimatorPage,
});

function CreditScoreEstimatorPage() {
  const t = useEstimatorText();
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
                  <Link to="/cibil" className="hover:text-white">
                    CIBIL
                  </Link>
                  <span className="text-gold">/</span>
                  <span className="text-white">Credit Score Estimator</span>
                </p>
                <p className="eyebrow mt-5">{t("hero.eyebrow")}</p>
                <h1
                  className="mt-4 text-3xl leading-tight font-extrabold text-white sm:text-5xl"
                  style={{ fontFamily: "var(--font-sans)", letterSpacing: "-0.01em" }}
                >
                  {t("hero.title")} <span className="gold-text">{t("hero.gold")}</span>
                </h1>
                <p className="mt-4 max-w-2xl text-base text-white/70">
                  {t("hero.body")}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Section className="pt-0">
        <CreditScoreEstimator />
      </Section>

      <Section className="pt-0">
        <div className="grid gap-5 sm:grid-cols-2">
          <Link
            to="/cibil"
            className="group flex items-start gap-4 rounded-2xl border border-border bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-[var(--shadow-lift)] dark:bg-card"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-gold-pale/60 text-gold-dark dark:bg-gold/15">
              <FileText className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-base font-extrabold text-navy dark:text-white">{t("next.reportTitle")}</span>
              <span className="mt-1 block text-sm text-muted-foreground">
                {t("next.reportBody")}
              </span>
              <span className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-gold-dark">
                {t("next.reportLink")} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </span>
          </Link>
          <Link
            to="/cibil-advisory"
            className="group flex items-start gap-4 rounded-2xl border border-border bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-[var(--shadow-lift)] dark:bg-card"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-gold-pale/60 text-gold-dark dark:bg-gold/15">
              <Compass className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-base font-extrabold text-navy dark:text-white">{t("next.helpTitle")}</span>
              <span className="mt-1 block text-sm text-muted-foreground">
                {t("next.helpBody")}
              </span>
              <span className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-gold-dark">
                {t("next.helpLink")} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </span>
          </Link>
        </div>
        <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-relaxed text-muted-foreground">
          {t("next.note")}
        </p>
      </Section>
    </>
  );
}
