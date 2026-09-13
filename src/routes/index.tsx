import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Building2,
  Globe,
  Landmark,
  Phone,
  ShieldCheck,
  Sparkles,
  Target,
  Timer,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { MissionVision } from "@/components/mission-vision";
import { LoanGoals } from "@/components/loan-goals";
import { ConcernCards } from "@/components/concern-cards";
import { BankMarquee } from "@/components/bank-marquee";
import { LeadForm } from "@/components/lead-form";
import { ConsultationBackdrop } from "@/components/consultation-backdrop";
import { EmiCalculator } from "@/components/emi-calculator";
import { CONTACT } from "@/data/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Growth Capital Services | Loan Experts in Mumbai, Thane & Pune" },
      {
        name: "description",
        content:
          "Tailored home, property, business and personal loan solutions from leading Banks and NBFCs. Trusted loan advisors since 2017 across Mumbai, Thane, Navi Mumbai and Pune.",
      },
      {
        property: "og:title",
        content: "Growth Capital Services | Where Capital Meets Opportunity",
      },
      {
        property: "og:description",
        content:
          "Your dreams, our funding expertise. Zero-hassle loan solutions from major Banks and NBFCs.",
      },
    ],
  }),
  component: HomePage,
});

const WA_PATH =
  "M12.04 2A10 10 0 0 0 2 12.04a9.94 9.94 0 0 0 1.34 4.99L2 22l5.13-1.34A9.95 9.95 0 0 0 12.04 22 10 10 0 0 0 22 12.04 10 10 0 0 0 12.04 2zm5.82 14.12c-.24.67-1.42 1.24-1.96 1.32-.5.07-1.14.1-1.84-.12a16.84 16.84 0 0 1-1.67-.62c-2.93-1.27-4.84-4.23-4.99-4.43-.15-.2-1.2-1.6-1.2-3.06 0-1.45.76-2.17 1.03-2.46.27-.3.59-.37.79-.37.2 0 .4 0 .57.01.18.01.43-.07.67.51.24.59.83 2.02.9 2.17.07.15.12.33.02.53-.1.2-.15.33-.3.5-.15.18-.31.4-.44.53-.15.15-.3.31-.13.61.17.3.77 1.27 1.65 2.06 1.13.99 2.09 1.3 2.39 1.44.3.15.47.13.64-.07.17-.21.74-.87.94-1.17.2-.3.4-.25.67-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.35.07.12.07.72-.17 1.4z";

const HERO_POINTS = [
  { icon: BadgeCheck, title: "Home, Business &", sub: "Personal Loans" },
  { icon: Timer, title: "Fast Approvals", sub: "& Disbursal" },
  { icon: Landmark, title: "Leading Bank &", sub: "NBFC Partners" },
];

const TRUST = [
  { icon: Landmark, label: "45+ Banking Partners" },
  { icon: Timer, label: "Faster Sanctions" },
  { icon: TrendingUp, label: "High-Ticket Expertise" },
  { icon: Sparkles, label: "Custom-built Loans" },
  { icon: BadgeCheck, label: "Zero Advisory Fee" },
  { icon: Globe, label: "PAN India Service" },
];

const WHO_WE_HELP = [
  {
    icon: Users,
    title: "Salaried & Self-Employed",
    body: "Home, personal and education loans shaped around your income.",
  },
  {
    icon: Briefcase,
    title: "Entrepreneurs & SMEs",
    body: "Business, working-capital and collateral-free funding that fits your cycle.",
  },
  {
    icon: TrendingDown,
    title: "Lower-EMI Seekers",
    body: "Move an existing loan to a better rate — top-up included.",
  },
  {
    icon: Landmark,
    title: "Property Owners",
    body: "Turn residential or commercial property into ready capital.",
  },
];

const WHY_US = [
  {
    icon: ShieldCheck,
    title: "Trust & Transparency",
    body: "Rate, fees and foreclosure terms — all in writing, upfront.",
  },
  {
    icon: Zap,
    title: "Quick, Paperless Process",
    body: "Digital documents and daily updates, from login to disbursal.",
  },
  {
    icon: Target,
    title: "End-to-End Guidance",
    body: "One advisor from picking the product to after the money lands.",
  },
  {
    icon: BadgeCheck,
    title: "Better Deals Than Direct",
    body: "Our volume with lenders gets you pricing you'd rarely get alone.",
  },
];

const STEPS = [
  {
    icon: Phone,
    title: "Free Consultation",
    body: "Tell us what you need. We map your eligibility and goals — free.",
  },
  {
    icon: Building2,
    title: "Lender Matching",
    body: "We compare live offers and shortlist the lenders that fit you best.",
  },
  {
    icon: ShieldCheck,
    title: "Documentation",
    body: "Paperwork collected digitally; legal and technical checks handled.",
  },
  {
    icon: Timer,
    title: "Sanction & Disbursal",
    body: "We chase the file daily until the money lands in your account.",
  },
];

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d={WA_PATH} />
    </svg>
  );
}

function HomePage() {
  return (
    <>
      {/* ─── HERO ─────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden border-b border-gold/15 bg-background">
        {/* Auto-toggling illustration wash — spans the full hero at low opacity so it
            can be large and clearly present without ever competing with the text or
            the form for space; legibility comes from contrast, not from carving out
            empty room for it. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden opacity-[0.24] lg:block [mask-image:radial-gradient(ellipse_80%_85%_at_58%_45%,black_35%,transparent_88%)]"
        >
          <ConsultationBackdrop />
        </div>

        <div className="relative mx-auto grid max-w-[90rem] items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-16 lg:px-8 lg:py-20">
          <div className="relative">
            <Reveal>
              <img
                src="/brand/gcs-lockup.png"
                alt="Growth Capital Services"
                width={870}
                height={545}
                className="h-20 w-auto sm:h-24"
              />
            </Reveal>

            <Reveal delay={60}>
              <p className="mt-8 text-xs font-bold tracking-[0.3em] text-gold-dark uppercase">
                Trusted Loan Advisors — Since 2017
              </p>
            </Reveal>

            {/* Headline rises in word by word */}
            <h1 className="mt-5 text-[2.5rem] leading-[1.08] font-bold text-navy sm:text-5xl lg:text-[3.5rem]">
              {["Your", "Dreams,"].map((w, i) => (
                <span
                  key={w}
                  className="word-rise mr-[0.25em]"
                  style={{ animationDelay: `${150 + i * 90}ms` }}
                >
                  {w}
                </span>
              ))}
              <br />
              {["Our", "Funding", "Expertise."].map((w, i) => (
                <span
                  key={w}
                  className="word-rise gold-text-static mr-[0.25em] last:mr-0"
                  style={{ animationDelay: `${330 + i * 90}ms` }}
                >
                  {w}
                </span>
              ))}
            </h1>

            <Reveal delay={150}>
              <div className="mt-7 h-[3px] w-16 rounded-full bg-gold"></div>
            </Reveal>

            <Reveal delay={200}>
              <p className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Leading with integrity — your most ethical financial partner. As Authorized Business
                Associates with top Banks and NBFCs, we&apos;re committed to your financial
                well-being.
              </p>
            </Reveal>

            <Reveal delay={250}>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  to="/services"
                  className="group inline-flex items-center gap-2 rounded-md bg-navy px-7 py-3.5 text-sm font-bold text-white shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-navy-soft"
                >
                  Explore Loan Products
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <a
                  href={CONTACT.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-md bg-gold px-7 py-3.5 text-sm font-bold text-navy transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-light"
                >
                  Talk to an Advisor
                  <span className="transition-transform duration-300 group-hover:rotate-12">
                    <WhatsAppIcon />
                  </span>
                </a>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <ul className="mt-12 grid max-w-xl gap-5 border-t border-border pt-8 sm:grid-cols-3">
                {HERO_POINTS.map((p) => (
                  <li key={p.title} className="group flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold-pale/60 text-gold-dark transition-colors duration-300 group-hover:animate-[gcs-wiggle_700ms_ease-in-out] group-hover:bg-gold group-hover:text-navy">
                      <p.icon className="h-5 w-5" />
                    </span>
                    <span className="text-sm leading-snug">
                      <span className="block font-bold text-navy">{p.title}</span>
                      <span className="text-muted-foreground">{p.sub}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Consultation form */}
          <Reveal delay={200} className="mx-auto w-full max-w-[420px] lg:mr-0">
            <LeadForm />
          </Reveal>
        </div>
      </section>

      {/* ─── TRUST TICKER ─────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-gold/15 bg-white py-4 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <ul className="marquee-track flex w-max items-center hover:[animation-play-state:paused]">
          {[...TRUST, ...TRUST, ...TRUST, ...TRUST].map((item, i) => (
            <li
              key={`${item.label}-${i}`}
              aria-hidden={i >= TRUST.length}
              className="flex items-center gap-2.5 px-7 whitespace-nowrap text-ink/80"
            >
              <item.icon className="h-5 w-5 text-gold" />
              <span className="text-sm font-semibold">{item.label}</span>
              <span className="ml-12 h-1.5 w-1.5 rounded-full bg-gold/50" />
            </li>
          ))}
        </ul>
      </section>

      {/* ─── WHO WE HELP ──────────────────────────────── */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Who We Serve"
            title="Real people. Real plans. The right loan."
            description="A first home, a growing business or a lighter EMI — tell us the plan and we'll shape the loan around it."
          />
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WHO_WE_HELP.map((item, i) => (
            <Reveal key={item.title} delay={i * 80}>
              <div className="surface-card group h-full p-6">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold-pale/70 text-gold-dark ring-1 ring-gold/20 transition-colors duration-300 group-hover:animate-[gcs-wiggle_700ms_ease-in-out] group-hover:bg-gold group-hover:text-navy">
                  <item.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-extrabold text-navy">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ─── SERVICES ─────────────────────────────────── */}
      <Section className="pt-0">
        <Reveal>
          <SectionHeading
            eyebrow="Our Services"
            title="So, what are you planning?"
            description="Pick a goal — we'll point you to the loan that gets you there."
          />
        </Reveal>
        <LoanGoals />
      </Section>

      {/* ─── WHY US ───────────────────────────────────── */}
      <Section className="pt-0">
        <Reveal>
          <SectionHeading
            eyebrow="Why Growth Capital"
            title="Experience financial freedom with us"
            description="Unlike banks, we put your needs first — and use our network of Banks and NBFCs to win you a better deal."
          />
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_US.map((item, i) => (
            <Reveal key={item.title} delay={i * 70}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-white p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-[var(--shadow-lift)]">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-navy to-navy-soft text-gold shadow-md transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                  <item.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-extrabold text-navy">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                {/* Gold underline that sweeps across on hover */}
                <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-gold to-gold-light transition-transform duration-500 group-hover:scale-x-100" />
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ─── BANK PARTNERS ────────────────────────────── */}
      <Section className="pt-0">
        <Reveal>
          <SectionHeading
            eyebrow="Our Network"
            title="Banks in our network"
            description="We compare offers across major Banks and NBFCs so you can choose with confidence, without the legwork."
            align="center"
          />
        </Reveal>
        <Reveal delay={80}>
          <div className="mt-10">
            <BankMarquee />
          </div>
        </Reveal>
      </Section>

      {/* ─── EMI CALCULATOR ───────────────────────────── */}
      <Section className="pt-0">
        <Reveal>
          <EmiCalculator />
        </Reveal>
      </Section>

      {/* ─── HOW IT WORKS ─────────────────────────────── */}
      <Section className="pt-0">
        <Reveal>
          <SectionHeading
            eyebrow="How It Works"
            title="From hello to disbursal in four steps"
            align="center"
          />
        </Reveal>
        <Reveal delay={80}>
          <ol className="relative mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {/* Connector line that draws itself in once the steps are in view */}
            <span
              aria-hidden
              className="absolute top-7 right-[12.5%] left-[12.5%] hidden h-0.5 overflow-hidden rounded-full bg-gold/20 lg:block"
            >
              <span className="block h-full origin-left scale-x-0 bg-gradient-to-r from-gold to-gold-light transition-transform delay-300 duration-[1600ms] ease-out group-data-[shown=true]/reveal:scale-x-100" />
            </span>
            {STEPS.map((s, i) => (
              <li key={s.title} className="group relative text-center">
                <span className="relative mx-auto grid h-14 w-14 place-items-center rounded-full border-2 border-gold bg-white text-gold-dark shadow-[var(--shadow-card)] transition-all duration-500 group-hover:-translate-y-1 group-hover:bg-gold group-hover:text-navy">
                  <s.icon className="h-6 w-6" />
                  <span className="absolute -top-1.5 -right-1.5 grid h-6 w-6 place-items-center rounded-full bg-navy text-[11px] font-bold text-white">
                    {i + 1}
                  </span>
                </span>
                <h3 className="mt-5 text-base font-extrabold text-navy">{s.title}</h3>
                <p className="mx-auto mt-2 max-w-[16rem] text-sm leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </Reveal>
      </Section>

      {/* ─── MISSION & VISION ─────────────────────────── */}
      <Section className="pt-0">
        <MissionVision
          mission="We are driven by a mission to foster lasting relationships with each client, aiming to deliver excellent service for years to come. Unlike many large national mortgage firms, we prioritize the security and privacy of your information, ensuring a trustworthy partnership."
          vision="Dreaming of a future without barriers, our vision is to transform financial experiences for everyone. We strive to play a crucial role in enhancing financial experience with innovation, trust and inspiration. We aim to lead and reshape the financial landscape in India."
        />
      </Section>

      {/* ─── COMMON CONCERNS ──────────────────────────── */}
      <Section className="pt-0">
        <Reveal>
          <SectionHeading
            eyebrow="Common Concerns"
            title="The worries we take off your plate"
            description="Real questions we hear before someone signs — and how we handle each one."
          />
        </Reveal>
        <ConcernCards />
      </Section>

      {/* ─── CTA BANNER ───────────────────────────────── */}
      <Section className="pt-0">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-gold/25 panel-light p-8 sm:p-12">
            <div className="absolute top-0 right-0 h-60 w-60 rounded-full bg-gold/10 blur-[80px]"></div>
            <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-heading text-2xl font-bold text-navy sm:text-3xl">
                  Ready to move your loan <span className="gold-text">forward?</span>
                </h3>
                <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                  Call {CONTACT.phone} · {CONTACT.hours}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/contact" className="gold-btn group py-3.5 text-base">
                  Apply Now
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <a
                  href={CONTACT.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-navy/20 bg-white px-6 py-3.5 text-sm font-bold text-navy transition-all duration-300 hover:-translate-y-0.5 hover:border-[#25D366]/50"
                >
                  <span className="text-[#25D366]">
                    <WhatsAppIcon />
                  </span>
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
