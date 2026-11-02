import { useList } from "@/lib/page-lists";
import { BUILDER_WHAT_WE_DO, BUILDER_POINTS, BUILDER_STEPS, BUILDER_WHY, BUILDER_MODELS, BUILDER_ASSISTANT } from "@/data/page-lists";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  Check,
  ClipboardCheck,
  Handshake,
  Landmark,
  LayoutDashboard,
  Calculator,
  MessageCircle,
  Network,
  Clock,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { BankMarquee } from "@/components/bank-marquee";
import { ZoneAssistant, ZoneFaq, ZoneForm, ZoneHero, ZoneTabs } from "@/components/partner-zones";
import { CONTACT } from "@/data/site";
import { useFaqs, useBuilderText } from "@/lib/site-content";
import { BUILDER_FAQS } from "@/data/faqs";
import { ASSISTANT_NAME } from "@/lib/chat/config";

export const Route = createFileRoute("/partner/builder")({
  head: () => ({
    meta: [
      { title: "Builder Partner | Growth Capital Services" },
      {
        name: "description",
        content:
          "Home-loan support for builders and developers: lender coordination, project approvals and buyer loans handled through one desk, from booking to disbursal.",
      },
      { property: "og:title", content: "Builder Partner | Growth Capital Services" },
      {
        property: "og:description",
        content: "Turn bookings into disbursals with one finance desk and 75+ banks and NBFCs.",
      },
    ],
  }),
  component: BuilderPage,
});







function BuilderPage() {
  const FAQS = useFaqs("builder", BUILDER_FAQS);
  const ASSISTANT_POINTS = useList("builder.assistant", BUILDER_ASSISTANT);
  const MODELS = useList("builder.models", BUILDER_MODELS);
  const WHY = useList("builder.why", BUILDER_WHY);
  const STEPS = useList("builder.steps", BUILDER_STEPS);
  const FOR_BUILDERS = useList("builder.points", BUILDER_POINTS).map((r) => r.text);
  const WHAT_WE_DO = useList("builder.whatwedo", BUILDER_WHAT_WE_DO);
  const t = useBuilderText();
  return (
    <>
      <ZoneTabs current="/partner/builder" />

      <ZoneHero
        eyebrow={t("hero.eyebrow")}
        title={
          <>
            {t("hero.title")} <span className="text-gold-light italic">{t("hero.gold")}</span>
          </>
        }
        intro={t("hero.intro")}
        stats={[
          { value: "75+", label: "Bank & NBFC Partners" },
          { value: "2017", label: "Arranging Loans Since" },
          { value: "1", label: "Point of Contact" },
          { value: "₹0", label: "Advisory Fee to Buyers" },
        ]}
        points={[
          "Lender coordination without juggling banks and agents",
          "Every buyer's loan tracked from login to disbursal",
          "Flexible set-up: direct, channel-partner led or hybrid",
        ]}
        quote={t("hero.quote")}
        form={
          <ZoneForm
            source="partner-builder"
            volumeLabel="How many buyers could you refer in a month?"
            heading={t("form.heading")}
            intro={t("form.intro")}
            orgLabel="Company / Project"
            orgPlaceholder="e.g. Sai Developers, Sai Heights"
            messagePlaceholder="Stage of the project, number of units, city…"
            cta={t("form.button")}
            thanks={t("form.thanks")}
          />
        }
      />

      {/* What we do */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow={t("what.eyebrow")}
            title={t("what.title")}
            description={t("what.body")}
          />
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {WHAT_WE_DO.map((w, i) => (
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

      {/* For builders */}
      <Section className="pt-0">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <Reveal>
            <SectionHeading
              eyebrow={t("scale.eyebrow")}
              title={t("scale.title")}
              description={t("scale.body")}
            />
            <ul className="mt-6 space-y-3">
              {FOR_BUILDERS.map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm text-foreground">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold-pale/80 text-gold-dark dark:bg-gold/15">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={80}>
            <img
              src="/brand/partner-presenting-growth.png"
              alt="An expert presenting growth to a builder"
              className="w-full rounded-3xl object-cover"
            />
          </Reveal>
        </div>
      </Section>

      {/* Lenders */}
      <Section className="pt-0">
        <Reveal>
          <SectionHeading
            eyebrow={t("lenders.eyebrow")}
            title={t("lenders.title")}
            align="center"
          />
        </Reveal>
        <Reveal delay={80}>
          <div className="mt-10">
            <BankMarquee />
          </div>
        </Reveal>
      </Section>

      {/* How it works */}
      <Section className="pt-0">
        <Reveal>
          <SectionHeading
            eyebrow={t("how.eyebrow")}
            title={t("how.title")}
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
                  <span className="relative z-10 mx-auto grid h-10 w-10 place-items-center rounded-full border-2 border-gold bg-white text-sm font-extrabold text-gold-dark dark:bg-card">
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

      {/* Why us */}
      <Section className="pt-0">
        <Reveal>
          <SectionHeading
            eyebrow={t("why.eyebrow")}
            title={t("why.title")}
            description={t("why.body")}
          />
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WHY.map((w, i) => (
            <Reveal key={w.title} delay={i * 60}>
              <div className="h-full rounded-2xl border border-border bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[var(--shadow-card)] dark:bg-card">
                <h3 className="text-base font-extrabold text-navy dark:text-white">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.body}</p>
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
            label: "Check eligibility",
            message: "I'd like to check how much home loan I may be eligible for.",
          },
          {
            label: "How do I know a project is bank-approved?",
            message: "How do I check whether a housing project is bank-approved?",
          },
          { label: "Documents needed", message: "What documents do I need for a home loan?" },
        ]}
      />

      {/* Working models */}
      <Section className="pt-0">
        <Reveal>
          <SectionHeading
            eyebrow={t("models.eyebrow")}
            title={t("models.title")}
            align="center"
          />
        </Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {MODELS.map((m, i) => (
            <Reveal key={m.title} delay={i * 70}>
              <div className="group h-full rounded-2xl border border-gold/20 bg-gold-pale/20 p-6 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-[var(--shadow-lift)]">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white text-gold-dark ring-1 ring-gold/25 transition-colors duration-300 group-hover:bg-gold group-hover:text-navy group-hover:animate-[gcs-wiggle_600ms_ease-in-out] dark:bg-card">
                  <m.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-base font-extrabold text-navy dark:text-white">
                  {m.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{m.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

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
            <Building2 className="float-animation relative mx-auto h-10 w-10 text-gold-dark" />
            <h3 className="relative mt-4 font-heading text-2xl font-bold text-navy sm:text-3xl dark:text-white">
              {t("cta.title")} <span className="gold-text">{t("cta.gold")}</span>
            </h3>
            <p className="relative mt-3 text-sm text-muted-foreground">
              Call {CONTACT.phone} · {CONTACT.hours}
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
