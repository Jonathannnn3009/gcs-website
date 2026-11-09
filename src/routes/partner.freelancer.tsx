import { useList } from "@/lib/page-lists";
import { FREELANCER_WHO, FREELANCER_STEPS, FREELANCER_PERKS, FREELANCER_ASSISTANT,
  FREELANCER_YOU,
  FREELANCER_WE,
} from "@/data/page-lists";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  Clock,
  GraduationCap,
  Heart,
  Home,
  Calculator,
  FileText,
  Landmark,
  MessageCircle,
  Rocket,
  Smartphone,
  Store,
  UserRound,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { EarningsEstimator } from "@/components/earnings-estimator";
import { ZoneAssistant, ZoneFaq, ZoneForm, ZoneHero, ZoneTabs } from "@/components/partner-zones";
import { CONTACT } from "@/data/site";
import { useFaqs, useFreelancerText } from "@/lib/site-content";
import { FREELANCER_FAQS } from "@/data/faqs";
import { ASSISTANT_NAME } from "@/lib/chat/config";

export const Route = createFileRoute("/partner/freelancer")({
  head: () => ({
    meta: [
      { title: "Freelance Associate | Growth Capital Services" },
      {
        name: "description",
        content:
          "Earn on your own time by introducing people who need a loan. No investment, no licence, no targets. We run the lending; you refer and get paid on disbursal.",
      },
      { property: "og:title", content: "Freelance Associate | Growth Capital Services" },
      {
        property: "og:description",
        content:
          "A flexible, zero-investment way to earn by connecting people with the right loan.",
      },
    ],
  }),
  component: FreelancerPage,
});





function FreelancerPage() {
  const YOU_WE = {
    you: useList("freelancer.youdo", FREELANCER_YOU).map((r) => r.text),
    we: useList("freelancer.wedo", FREELANCER_WE).map((r) => r.text),
  };
  const FAQS = useFaqs("freelancer", FREELANCER_FAQS);
  const ASSISTANT_POINTS = useList("freelancer.assistant", FREELANCER_ASSISTANT);
  const PERKS = useList("freelancer.perks", FREELANCER_PERKS);
  const STEPS = useList("freelancer.steps", FREELANCER_STEPS);
  const WHO = useList("freelancer.who", FREELANCER_WHO);
  const t = useFreelancerText();
  return (
    <>
      <ZoneTabs current="/partner/freelancer" />

      <div id="join" className="scroll-mt-24" />
      <ZoneHero
        eyebrow={t("hero.eyebrow")}
        title={
          <>
            {t("hero.title")}{" "}
            <span className="text-gold-light italic">{t("hero.gold")}</span>
          </>
        }
        intro={t("hero.intro")}
        stats={[
          { value: "₹0", label: "To Get Started" },
          { value: "No", label: "Targets or Lock-in" },
          { value: "75+", label: "Bank & NBFC Partners" },
          { value: "2017", label: "Arranging Loans Since" },
        ]}
        points={[
          "Work from anywhere, at any hour, alongside whatever else you do",
          "A short orientation call so you know exactly what to share",
          "Updates on every case you refer, until it disburses",
        ]}
        quote={t("hero.quote")}
        form={
          <ZoneForm
            source="partner-freelancer"
            heading={t("form.heading")}
            intro={t("form.intro")}
            orgLabel="What you do today"
            orgPlaceholder="e.g. Homemaker, B.Com student, retired banker"
            messagePlaceholder="How many people do you think you could help in a month? (optional)"
            cta={t("form.button")}
            thanks={t("form.thanks")}
          />
        }
      />

      {/* Who it suits */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow={t("who.eyebrow")}
            title={t("who.title")}
            description={t("who.body")}
          />
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WHO.map((w, i) => (
            <Reveal key={w.title} delay={i * 60}>
              <div className="group h-full rounded-2xl border border-border bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-[var(--shadow-lift)] dark:bg-card">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold-pale/60 text-gold-dark transition-colors duration-300 group-hover:bg-gold group-hover:text-navy group-hover:animate-[gcs-wiggle_600ms_ease-in-out] dark:bg-gold/15">
                  <w.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-extrabold text-navy dark:text-white">
                  {w.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{w.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Your part / our part */}
      <Section className="pt-0">
        <Reveal>
          <SectionHeading
            eyebrow={t("split.eyebrow")}
            title={t("split.title")}
            align="center"
          />
        </Reveal>
        <div className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl border border-gold/25 bg-gold-pale/20 p-6 sm:p-7">
              <p className="text-xs font-bold tracking-[0.2em] text-gold-dark uppercase">
                {t("split.you")}
              </p>
              <ul className="mt-4 space-y-3">
                {YOU_WE.you.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm text-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={90}>
            <div className="navy-panel h-full rounded-2xl p-6 sm:p-7">
              <p className="text-xs font-bold tracking-[0.2em] text-gold uppercase">{t("split.we")}</p>
              <ul className="mt-4 space-y-3">
                {YOU_WE.we.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm text-white/85">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-light" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Estimator */}
      <Section className="pt-0">
        <Reveal>
          <SectionHeading
            eyebrow={t("estimate.eyebrow")}
            title={t("estimate.title")}
            description={t("estimate.body")}
            align="center"
          />
        </Reveal>
        <Reveal delay={80} className="mx-auto mt-10 max-w-5xl">
          <EarningsEstimator />
        </Reveal>
      </Section>

      {/* Steps */}
      <Section className="pt-0">
        <Reveal>
          <SectionHeading
            eyebrow={t("steps.eyebrow")}
            title={t("steps.title")}
            align="center"
          />
        </Reveal>
        <div className="relative mt-12">
          <span
            aria-hidden
            className="absolute top-5 right-[10%] left-[10%] hidden h-0.5 bg-gold/20 lg:block"
          />
          <ol className="relative grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 80}>
                <li className="text-center">
                  <span className="relative z-10 mx-auto grid h-10 w-10 place-items-center rounded-full border-2 border-gold bg-navy text-sm font-extrabold text-gold shadow-sm">
                    {i + 1}
                  </span>
                  <h4 className="mt-4 text-base font-extrabold text-navy dark:text-white">
                    {s.title}
                  </h4>
                  <p className="mx-auto mt-1.5 max-w-[16rem] text-sm leading-relaxed text-muted-foreground">
                    {s.body}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      {/* Perks */}
      <Section className="pt-0">
        <Reveal>
          <SectionHeading eyebrow={t("perks.eyebrow")} title={t("perks.title")} />
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PERKS.map((p, i) => (
            <Reveal key={p.title} delay={i * 60}>
              <div className="group h-full rounded-2xl border border-t-[3px] border-gold/25 border-t-gold bg-gradient-to-b from-white to-gold-pale/70 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-[var(--shadow-lift)]">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy text-gold shadow-sm transition-colors duration-300 group-hover:bg-gold group-hover:text-navy group-hover:animate-[gcs-wiggle_600ms_ease-in-out]">
                  <p.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-extrabold text-navy dark:text-white">
                  {p.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <ZoneAssistant
        eyebrow={t("assistant.eyebrow").replace("{name}", ASSISTANT_NAME)}
        title={t("assistant.title")}
        intro={t("assistant.body")}
        points={ASSISTANT_POINTS}
        prompts={[
          {
            label: "How much loan can I get?",
            message: "I'd like to check how much home loan I may be eligible for.",
          },
          { label: "Calculate EMI", message: "Help me calculate my EMI." },
          { label: "Documents needed", message: "What documents do I need for a home loan?" },
        ]}
      />

      {/* FAQ */}
      <Section className="pt-0">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <p className="eyebrow">{t("faq.eyebrow")}</p>
            <h2 className="mt-2 text-2xl font-extrabold text-navy sm:text-3xl dark:text-white">
              {t("faq.title")}
            </h2>
          </Reveal>
          <Reveal delay={80} className="mt-6">
            <ZoneFaq items={FAQS} />
          </Reveal>
        </div>
      </Section>

      {/* CTA */}
      <Section className="pt-0">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-gold/25 panel-light p-8 text-center sm:p-12">
            <div className="absolute top-0 right-1/4 h-60 w-60 rounded-full bg-gold/10 blur-[80px]" />
            <Rocket className="float-animation relative mx-auto h-10 w-10 text-gold-dark" />
            <h3 className="relative mt-4 font-heading text-2xl font-bold text-navy sm:text-3xl dark:text-white">
              {t("cta.title")} <span className="gold-text">{t("cta.gold")}</span>
            </h3>
            <p className="relative mt-3 text-sm text-muted-foreground">
              {CONTACT.phone} · {CONTACT.hours}
            </p>
            <div className="relative mt-6 flex flex-wrap justify-center gap-3">
              <a href={CONTACT.phoneHref} className="gold-btn py-3.5 text-base">
                {t("cta.call")} <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={CONTACT.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="outline-btn dark:bg-card dark:text-white"
              >
                {t("cta.whatsapp")}
              </a>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
