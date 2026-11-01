import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Compass,
  ShieldCheck,
  Sparkles,
  Timer,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { MissionVision } from "@/components/mission-vision";
import { PAIN_POINTS, CONTACT } from "@/data/site";
import { WHYUS_ADVANTAGES, WHYUS_PILLARS } from "@/data/page-lists";
import { useList } from "@/lib/page-lists";
import { useWhyUsText } from "@/lib/site-content";

export const Route = createFileRoute("/why-us")({
  head: () => ({
    meta: [
      { title: "Why Choose Growth Capital Services | Loan Experts Since 2017" },
      {
        name: "description",
        content:
          "Trust, transparency, a paperless process and end-to-end support — how Growth Capital Services solves the real hurdles of borrowing.",
      },
      { property: "og:title", content: "Why Choose Growth Capital Services" },
      {
        property: "og:description",
        content: "Our mission, vision and the customer hurdles we remove on every loan file.",
      },
    ],
  }),
  component: WhyUsPage,
});



function WhyUsPage() {
  const CONCERNS = useList("home.concerns", PAIN_POINTS);
  const ADVANTAGES = useList("whyus.advantages", WHYUS_ADVANTAGES);
  const PILLARS = useList("whyus.pillars", WHYUS_PILLARS);
  const t = useWhyUsText();
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden hero-light border-b border-gold/15 py-16 sm:py-20">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-gold/8 blur-[120px]"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="eyebrow">{t("hero.eyebrow")}</p>
            <h1 className="mt-4 text-3xl font-extrabold text-navy sm:text-5xl dark:text-white">
              {t("hero.title")} <span className="gold-text">{t("hero.gold")}</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground">
              {t("hero.body")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Pillars */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow={t("strengths.eyebrow")}
            title={t("strengths.title")}
            description={t("strengths.body")}
          />
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={i * 70}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-gold/10 bg-white p-6 transition-all duration-400 hover:-translate-y-1 hover:border-gold/25 hover:shadow-[var(--shadow-gold)] dark:bg-card">
                <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-gold/5 blur-[30px] transition-all group-hover:bg-gold/10"></div>
                <span className="relative grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-navy to-navy-soft text-gold shadow-md transition-all duration-400 group-hover:scale-110">
                  <p.icon className="h-5 w-5" />
                </span>
                <h3 className="relative mt-4 text-base font-extrabold">{p.title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Advantages section */}
      <Section className="pt-0">
        <Reveal>
          <div className="glass-card overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="panel-light p-8 sm:p-10">
                <p className="eyebrow">{t("difference.eyebrow")}</p>
                <h3 className="mt-3 text-2xl font-extrabold">
                  {t("difference.title")} <span className="text-gold">{t("difference.gold")}</span>
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {t("difference.body")}
                </p>
              </div>
              <div className="flex items-center p-8 sm:p-10">
                <div className="space-y-3">
                  {ADVANTAGES.map((adv) => (
                    <div key={adv.text} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-gold" />
                      <span className="text-sm font-medium">{adv.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* Pain Points / Hurdles */}
      <Section className="pt-0">
        <Reveal>
          <SectionHeading
            eyebrow={t("concerns.eyebrow")}
            title={t("concerns.title")}
            description={t("concerns.body")}
          />
        </Reveal>
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {CONCERNS.map((p, i) => (
            <Reveal key={p.question} delay={i * 60}>
              <div className="surface-card h-full p-6">
                <h3 className="text-base font-extrabold">{p.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.answer}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Mission & Vision */}
      <Section className="pt-0">
        <MissionVision
          mission={t("mission.body")}
          vision={t("vision.body")}
          missionTitle={t("mission.title")}
          visionTitle={t("vision.title")}
        />
      </Section>

      {/* CTA */}
      <Section className="pt-0">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-gold/25 panel-light p-8 sm:p-12 text-center">
            <div className="absolute top-0 right-1/4 h-60 w-60 rounded-full bg-gold/10 blur-[80px]"></div>
            <h3 className="relative text-2xl font-extrabold text-navy sm:text-3xl dark:text-white">
              {t("cta.title")} <span className="gold-text">{t("cta.gold")}</span>
            </h3>
            <p className="relative mt-3 text-sm text-muted-foreground">
              {t("cta.call").replace("{phone}", CONTACT.phone).replace("{hours}", CONTACT.hours)}
            </p>
            <Link to="/contact" className="gold-btn relative mt-6 py-3.5 text-base">
              {t("cta.button")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
