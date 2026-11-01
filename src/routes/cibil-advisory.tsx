import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Building2,
  Check,
  ClipboardCheck,
  FileSearch,
  Gauge,
  GraduationCap,
  Handshake,
  LineChart,
  ListChecks,
  MessageCircle,
  SearchCheck,
  ShieldCheck,
  Star,
  TrendingUp,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import { Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { LeadForm } from "@/components/lead-form";
import { BusinessVisual, GrowthStairs, IndividualVisual, ScorePhone } from "@/components/cibil-visuals";
import { CONTACT } from "@/data/site";
import { useAdvisoryText } from "@/lib/site-content";

export const Route = createFileRoute("/cibil-advisory")({
  head: () => ({
    meta: [
      { title: "CIBIL Advisory Services | Growth Capital Services" },
      {
        name: "description",
        content:
          "Understand your credit report and score with our experts. For individuals and business owners (MSMEs): read your report, spot errors, plan your next steps and get ready to apply for a loan.",
      },
      { property: "og:title", content: "CIBIL Advisory Services" },
      {
        property: "og:description",
        content: "Understand your credit report, plan your next steps and get ready for a loan.",
      },
    ],
  }),
  component: CibilAdvisoryPage,
});

type Item = { icon: LucideIcon; title: string; text: string };

const WHY_CREDIT = [
  "May improve your chances of loan approval",
  "May help you get a lower interest rate",
  "May open the way to higher credit limits",
  "Gives you access to more financial products",
  "Builds a stronger financial profile",
];

const FOR_INDIVIDUALS: Item[] = [
  {
    icon: Gauge,
    title: "Credit Score Guidance & Monitoring",
    text: "A step-by-step plan to work on your score, with regular check-ins on how it is moving.",
  },
  {
    icon: FileSearch,
    title: "Credit Report Review & Error Spotting",
    text: "We go through your report, spot mistakes and guide you on getting them corrected with the bureau.",
  },
  {
    icon: Handshake,
    title: "Loan Assistance & Financial Advisory",
    text: "Help choosing the right loan or card for your profile, with options compared from 75+ Banks and NBFCs.",
  },
  {
    icon: GraduationCap,
    title: "Credit Education & Guidance",
    text: "Plain-language advice on dues, closed accounts and credit use, so you stay credit healthy.",
  },
];
const INDIVIDUAL_BENEFITS = [
  "See your credit score clearly",
  "Know why a loan was turned down",
  "Get expert guidance on fixing issues",
  "Be ready to apply, sooner",
];

const FOR_BUSINESSES: Item[] = [
  {
    icon: Building2,
    title: "Commercial Credit Report (CMR) Review",
    text: "We explain your Commercial Credit Report and your CIBIL MSME Rank (CMR) in simple words.",
  },
  {
    icon: Briefcase,
    title: "Business Credit Advisory",
    text: "Guidance on building your business credit, and what lenders look at before they lend.",
  },
  {
    icon: LineChart,
    title: "Credit Rating Guidance",
    text: "A focused plan to work on your CMR (1 is the lowest risk, 10 the highest).",
  },
  {
    icon: ClipboardCheck,
    title: "Loan Assistance for Business / MSME",
    text: "Get funding-ready and approach the right lenders for your business needs.",
  },
];
const BUSINESS_BENEFITS = [
  "Get ready for MSME loans",
  "Understand your business rating",
  "Be better placed for lender terms",
  "Plan your business growth",
];

const AUDIENCE: Item[] = [
  { icon: UserCheck, title: "Salaried people", text: "Planning a home, car or personal loan and want to know where they stand." },
  { icon: Briefcase, title: "Business owners", text: "Self-employed and professionals who need credit for their work." },
  { icon: Building2, title: "MSMEs", text: "Small and medium businesses who want to understand their business credit report." },
  { icon: ShieldCheck, title: "Anyone turned down", text: "People whose loan was declined and who want to know why, and what to do next." },
];

const STEPS: Item[] = [
  { icon: FileSearch, title: "Fetch your credit report", text: "We help you get your official report from the credit bureau, with your consent." },
  { icon: SearchCheck, title: "Analyse and spot issues", text: "Our team reads your report and marks errors or negative items." },
  { icon: ListChecks, title: "Prepare an action plan", text: "You get a clear plan, with the most important steps first." },
  { icon: Handshake, title: "Resolve and follow up", text: "We guide you on raising disputes with the bureau or lender, and on following them up." },
  { icon: TrendingUp, title: "Track your progress", text: "Keep an eye on your report as you work towards your target score." },
];

function ServiceCards({ items }: { items: Item[] }) {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2">
      {items.map((h) => (
        <div key={h.title} className="h-full rounded-2xl border border-border bg-white p-5 text-center dark:bg-card">
          <span className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-gold-pale/60 text-gold-dark dark:bg-gold/15">
            <h.icon className="h-5 w-5" />
          </span>
          <h3 className="mt-3 text-sm font-extrabold text-navy dark:text-white" style={{ letterSpacing: "0" }}>
            {h.title}
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{h.text}</p>
        </div>
      ))}
    </div>
  );
}

function BenefitStrip({ items, icon: Icon }: { items: string[]; icon: LucideIcon }) {
  return (
    <ul className="navy-panel mt-8 grid gap-4 rounded-2xl p-5 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((b) => (
        <li key={b} className="flex items-center gap-3 text-sm font-semibold text-white">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/25 text-gold-light">
            <Icon className="h-4 w-4" />
          </span>
          {b}
        </li>
      ))}
    </ul>
  );
}

function CibilAdvisoryPage() {
  const t = useAdvisoryText();
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
                  <span className="text-white">CIBIL Advisory Services</span>
                </p>
                <p className="eyebrow mt-5">{t("hero.eyebrow")}</p>
                <h1
                  className="mt-4 max-w-3xl text-3xl leading-tight font-extrabold text-white sm:text-5xl"
                  style={{ fontFamily: "var(--font-sans)", letterSpacing: "-0.01em" }}
                >
                  {t("hero.title")} <span className="gold-text">{t("hero.gold")}</span>
                </h1>
                <p className="mt-4 max-w-2xl text-base text-white/70">
                  {t("hero.body")}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <a href="#talk" className="gold-btn py-3 text-sm">
                    {t("hero.primary")} <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href={CONTACT.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-3 text-sm font-bold text-white/85 transition-colors hover:border-gold/40 hover:text-white"
                  >
                    <MessageCircle className="h-4 w-4 text-gold" /> {t("hero.secondary")}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Why credit matters */}
      <Section className="pt-0">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <p className="eyebrow">{t("basics.eyebrow")}</p>
            <h2 className="mt-3 text-3xl font-extrabold text-navy sm:text-4xl dark:text-white">
              {t("basics.title")} <span className="gold-text-static italic">{t("basics.gold")}</span>
            </h2>
            <p className="mt-2 text-lg font-bold text-gold-dark">{t("basics.lead")}</p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              {t("basics.body")}
            </p>
            <ul className="mt-6 space-y-3">
              {WHY_CREDIT.map((w) => (
                <li key={w} className="flex items-center gap-3 text-[15px] font-semibold text-navy dark:text-white">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-navy text-gold-light">
                    <Check className="h-3.5 w-3.5" strokeWidth={3.5} />
                  </span>
                  {w}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={100}>
            <ScorePhone />
            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              {t("basics.note")}
            </p>
          </Reveal>
        </div>
      </Section>

      {/* Services for individuals */}
      <div className="bg-gradient-to-b from-bg-light via-[#e9f0fb] to-bg-light dark:bg-none">
        <Section className="pt-12">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <Reveal>
              <p className="eyebrow">{t("individuals.eyebrow")}</p>
              <h2 className="mt-3 text-3xl font-extrabold text-navy sm:text-4xl dark:text-white">{t("individuals.title")}</h2>
              <p className="mt-2 text-base text-muted-foreground">
                {t("individuals.body")}
              </p>
              <ServiceCards items={FOR_INDIVIDUALS} />
            </Reveal>
            <Reveal delay={100}>
              <IndividualVisual />
              <p className="mt-3 text-center text-[11px] text-muted-foreground">{t("visual.note")}</p>
            </Reveal>
          </div>
          <Reveal delay={60}>
            <BenefitStrip items={INDIVIDUAL_BENEFITS} icon={BadgeCheck} />
          </Reveal>
        </Section>
      </div>

      {/* Services for businesses */}
      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal className="order-2 lg:order-1" delay={100}>
            <BusinessVisual />
            <p className="mt-3 text-center text-[11px] text-muted-foreground">{t("visual.note")}</p>
          </Reveal>
          <Reveal className="order-1 lg:order-2">
            <p className="eyebrow">{t("business.eyebrow")}</p>
            <h2 className="mt-3 text-3xl font-extrabold text-navy sm:text-4xl dark:text-white">
              {t("business.title")} <span className="text-gold-dark">{t("business.gold")}</span>
            </h2>
            <p className="mt-2 text-base text-muted-foreground">
              {t("business.body")}
            </p>
            <ServiceCards items={FOR_BUSINESSES} />
          </Reveal>
        </div>
        <Reveal delay={60}>
          <BenefitStrip items={BUSINESS_BENEFITS} icon={Star} />
        </Reveal>
      </Section>

      <Section className="pt-0">
        <Reveal>
          <SectionHeading eyebrow={t("audience.eyebrow")} title={t("audience.title")} align="center" />
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {AUDIENCE.map((a, i) => (
            <Reveal key={a.title} delay={i * 40}>
              <div className="h-full rounded-2xl border border-gold/15 bg-gold-pale/15 p-6">
                <a.icon className="h-6 w-6 text-gold-dark" />
                <h3 className="mt-3 text-base font-bold text-navy dark:text-white" style={{ letterSpacing: "0" }}>
                  {a.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="pt-0">
        <Reveal>
          <SectionHeading
            eyebrow={t("how.eyebrow")}
            title={t("how.title")}
            description={t("how.body")}
            align="center"
          />
        </Reveal>
        <ol className="mx-auto mt-12 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 60}>
              <li className="relative h-full rounded-2xl border border-border bg-white p-5 pt-7 text-center dark:bg-card">
                <span className="absolute -top-4 left-1/2 grid h-8 w-8 -translate-x-1/2 place-items-center rounded-full bg-navy text-xs font-bold text-gold-light ring-4 ring-bg-light dark:ring-background">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <s.icon className="mx-auto h-6 w-6 text-gold-dark" />
                <h3 className="mt-3 text-sm font-extrabold text-navy dark:text-white" style={{ letterSpacing: "0" }}>
                  {s.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{s.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
        <Reveal delay={120}>
          <div className="mx-auto mt-10 flex max-w-4xl flex-col items-center justify-between gap-6 sm:flex-row">
            <GrowthStairs />
            <p className="max-w-xs text-center font-heading text-2xl font-bold text-navy sm:text-right dark:text-white">
              {t("how.closing")} <span className="gold-text-static">{t("how.closingGold")}</span>
            </p>
          </div>
        </Reveal>
      </Section>

      <Section className="pt-0" id="talk">
        <div className="grid gap-8 rounded-2xl border border-blue-soft-border bg-blue-soft p-8 sm:p-12 lg:grid-cols-[1fr_480px] lg:items-stretch dark:border-gold/15 dark:bg-card">
          <Reveal>
            <p className="eyebrow">{t("talk.eyebrow")}</p>
            <h2 className="mt-2 text-2xl font-extrabold text-navy sm:text-3xl dark:text-white">
              {t("talk.title")} <span className="gold-text">{t("talk.gold")}</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {t("talk.body")}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/cibil" className="outline-btn dark:bg-card dark:text-white">
                {t("talk.report")}
              </Link>
              <Link to="/credit-score-estimator" className="outline-btn dark:bg-card dark:text-white">
                {t("talk.estimator")}
              </Link>
            </div>
            <p className="mt-6 border-t border-dashed border-border pt-4 text-xs leading-relaxed text-muted-foreground">
              <span className="font-bold text-navy dark:text-white">{t("talk.noteLabel")} </span>
              {t("talk.note")}
            </p>
          </Reveal>
          <Reveal delay={100} className="h-full">
            <LeadForm defaultLoanType="Other" source="cibil-advisory" />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
