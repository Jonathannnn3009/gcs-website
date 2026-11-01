import { createFileRoute, Link } from "@tanstack/react-router";
import { Section } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { LoanAdvisor } from "@/components/loan-advisor";
import { useAdvisorText } from "@/lib/site-content";

export const Route = createFileRoute("/ai-loan-advisor")({
  head: () => ({
    meta: [
      { title: "Loan Expert | Growth Capital Services" },
      {
        name: "description",
        content:
          "Tell us what you need and answer a few short questions. A Growth Capital Services loan expert will look at the options that may suit your profile and contact you.",
      },
      { property: "og:title", content: "GCS Loan Expert" },
      {
        property: "og:description",
        content: "A few simple questions, then a GCS loan expert takes it from there.",
      },
    ],
  }),
  component: AdvisorPage,
});

function AdvisorPage() {
  const t = useAdvisorText();
  return (
    <>
      <section className="relative overflow-hidden bg-bg-light py-12 sm:py-16 dark:bg-background">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-gold/8 blur-[120px]" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal animate={false}>
            <p className="flex items-center justify-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              <Link to="/" className="hover:text-navy dark:text-white">
                Home
              </Link>
              <span className="text-gold">/</span>
              <span className="text-navy dark:text-white">Loan Expert</span>
            </p>
            <p className="eyebrow mt-5">{t("hero.eyebrow")}</p>
            <h1 className="mt-3 text-3xl font-extrabold text-navy sm:text-5xl dark:text-white">
              {t("hero.title")}{" "}
              <span className="gold-text-static">{t("hero.gold")}</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
              {t("hero.body")}
            </p>
          </Reveal>
        </div>
      </section>

      <Section className="pt-0">
        <div className="mx-auto max-w-3xl">
          <LoanAdvisor />
        </div>
      </Section>
    </>
  );
}
