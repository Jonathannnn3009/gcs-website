import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  HandCoins,
  Phone,
  ShieldCheck,
  Timer,
  TrendingUp,
  Users,
  Globe,
  Target,
  Eye,
  CheckCircle2,
  Landmark,
  BadgeCheck,
  Zap,
} from "lucide-react";
import heroImage from "@/assets/hero-skyline.jpg";
import { Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { ServiceTabs } from "@/components/service-tabs";
import { BankMarquee } from "@/components/bank-marquee";
import { LeadForm } from "@/components/lead-form";
import { EmiCalculator } from "@/components/emi-calculator";
import { CONTACT, PAIN_POINTS } from "@/data/site";

export const Route = createFileRoute("/")(  {
  head: () => ({
    meta: [
      {
        title:
          "Growth Capital Services | Loan Experts in Mumbai, Thane & Pune",
      },
      {
        name: "description",
        content:
          "Tailored home, property, business and personal loan solutions from leading Banks and NBFCs. Trusted loan advisors since 2017 across Mumbai, Thane, Navi Mumbai and Pune.",
      },
      {
        property: "og:title",
        content:
          "Growth Capital Services | Where Capital Meets Opportunity",
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

const STATS = [
  { value: "2017", label: "Serving borrowers since", icon: Landmark },
  { value: "₹500Cr+", label: "Disbursed to date", icon: TrendingUp },
  { value: "45+", label: "Bank & NBFC partners", icon: Building2 },
  { value: "4", label: "Cities covered", icon: Globe },
];

const STEPS = [
  {
    icon: Phone,
    title: "Free Consultation",
    body: "Tell us your requirement. We assess eligibility, obligations and the outcome you want.",
  },
  {
    icon: Building2,
    title: "Lender Matching",
    body: "We compare live policies across our network and shortlist the best-fit lenders.",
  },
  {
    icon: ShieldCheck,
    title: "Documentation",
    body: "Digital document collection, legal and technical coordination handled for you.",
  },
  {
    icon: Timer,
    title: "Sanction & Disbursal",
    body: "Daily tracking until the money reaches your account, with terms confirmed in writing.",
  },
];

const WHO_WE_HELP = [
  {
    icon: Users,
    title: "Salaried & Self-Employed",
    body: "Home, personal, and education loans structured around your earnings — clean documentation, fast disbursal.",
  },
  {
    icon: Building2,
    title: "Entrepreneurs & SMEs",
    body: "Business loans, working capital, CGTMSE and unsecured term funding sized to your business cycle.",
  },
  {
    icon: TrendingUp,
    title: "Lower-EMI Seekers",
    body: "Balance-transfer your existing home, LAP or business loan to a sharper rate — with a structured top-up.",
  },
  {
    icon: Landmark,
    title: "Property Owners",
    body: "Unlock liquidity from residential, commercial or industrial real estate via LAP, LRD, or drop-line overdraft.",
  },
];

const WHY_US = [
  {
    icon: ShieldCheck,
    title: "Trust & Transparency",
    body: "Every quote lists rate, processing fee, legal charges and foreclosure terms in writing.",
  },
  {
    icon: Zap,
    title: "Quick, Paperless Process",
    body: "Digital documentation and daily file tracking through login, sanction and disbursal.",
  },
  {
    icon: Target,
    title: "End-to-End Guidance",
    body: "From choosing the right product to legal, insurance and post-disbursal support.",
  },
  {
    icon: BadgeCheck,
    title: "Better Deals Than Direct",
    body: "Our volume across banks earns pricing and fee waivers individuals rarely get alone.",
  },
];

function HomePage() {
  return (
    <>
      {/* ─── HERO ─────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden">
        <img
          src={heroImage}
          alt="Mumbai skyline at dusk"
          width={1440}
          height={1088}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Navy overlay with gold tint */}
        <div className="absolute inset-0 bg-[linear-gradient(160deg,oklch(0.08_0.04_264/0.96)_0%,oklch(0.13_0.05_260/0.94)_40%,oklch(0.10_0.04_264/0.88)_100%)]" />
        {/* Subtle gold accent glow */}
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-gold/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-gold/3 blur-[80px]" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:px-8">
          <div className="text-white">
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-1.5 text-xs font-bold tracking-[0.18em] text-gold uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse"></span>
                Established 2017 · Mumbai · Thane · Navi Mumbai · Pune
              </p>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="mt-6 text-4xl leading-[1.06] font-extrabold sm:text-5xl lg:text-[3.5rem]">
                Your Dreams,{" "}
                <span className="gold-text">Our Funding Expertise.</span>
              </h1>
            </Reveal>

            {/* Gold divider */}
            <Reveal delay={150}>
              <div className="mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-gold to-gold-light"></div>
            </Reveal>

            <Reveal delay={200}>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
                Leading with Integrity. Your Most Ethical Financial Partner.
                As Authorized Business Associates with top Banks and NBFCs,
                we're committed to your financial well-being.
              </p>
            </Reveal>

            <Reveal delay={250}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/services"
                  className="gold-btn py-3.5 text-base"
                >
                  Explore Loan Products
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={CONTACT.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#25D366]/50 hover:bg-[#25D366]/10"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="text-[#25D366]"><path d="M12.04 2A10 10 0 0 0 2 12.04a9.94 9.94 0 0 0 1.34 4.99L2 22l5.13-1.34A9.95 9.95 0 0 0 12.04 22 10 10 0 0 0 22 12.04 10 10 0 0 0 12.04 2zm5.82 14.12c-.24.67-1.42 1.24-1.96 1.32-.5.07-1.14.1-1.84-.12a16.84 16.84 0 0 1-1.67-.62c-2.93-1.27-4.84-4.23-4.99-4.43-.15-.2-1.2-1.6-1.2-3.06 0-1.45.76-2.17 1.03-2.46.27-.3.59-.37.79-.37.2 0 .4 0 .57.01.18.01.43-.07.67.51.24.59.83 2.02.9 2.17.07.15.12.33.02.53-.1.2-.15.33-.3.5-.15.18-.31.4-.44.53-.15.15-.3.31-.13.61.17.3.77 1.27 1.65 2.06 1.13.99 2.09 1.3 2.39 1.44.3.15.47.13.64-.07.17-.21.74-.87.94-1.17.2-.3.4-.25.67-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.35.07.12.07.72-.17 1.4z"/></svg>
                  Talk to an Advisor
                </a>
              </div>
            </Reveal>

            {/* Stats */}
            <Reveal delay={300}>
              <dl className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-4">
                {STATS.map((s) => (
                  <div key={s.label} className="glass-dark rounded-xl p-4">
                    <s.icon className="h-5 w-5 text-gold" />
                    <dt className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">{s.value}</dt>
                    <dd className="mt-1 text-[11px] leading-snug text-white/60">{s.label}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          {/* Lead form */}
          <Reveal delay={200} className="lg:pt-4">
            <LeadForm />
          </Reveal>
        </div>
      </section>

      {/* ─── TRUST STRIP ──────────────────────────────── */}
      <section className="relative border-b border-gold/10 bg-gradient-to-r from-navy via-navy-soft to-navy py-5">
        <div className="container mx-auto">
          <ul className="flex flex-wrap items-center justify-center gap-6 px-4 sm:gap-10">
            {[
              { icon: Landmark, label: "45+ Banking Partners" },
              { icon: Timer, label: "Faster Sanctions" },
              { icon: TrendingUp, label: "High Ticket Expertise" },
              { icon: Target, label: "Tailored Structuring" },
              { icon: Globe, label: "PAN India Service" },
            ].map((item) => (
              <li key={item.label} className="flex items-center gap-2.5 text-white/80">
                <item.icon className="h-5 w-5 text-gold" />
                <span className="text-sm font-semibold">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── WHO WE HELP ──────────────────────────────── */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Who We Help"
            title="Borrowers we know — profiles we know how to place."
            description="Personal goals, business ambitions, a first home, or unlocking value from what you already own — we structure the right loan for the moment you're in."
          />
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WHO_WE_HELP.map((item, i) => (
            <Reveal key={item.title} delay={i * 80}>
              <div className="surface-card group h-full p-6">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold/10 text-gold transition-all duration-400 group-hover:scale-110 group-hover:bg-gold group-hover:text-navy group-hover:shadow-[0_0_20px_oklch(0.75_0.14_75/0.3)]">
                  <item.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-extrabold">{item.title}</h3>
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
            title="Loan solutions, structured around you"
            description="Select a product to see how we structure it and what it can save you."
          />
        </Reveal>
        <Reveal delay={80}>
          <ServiceTabs />
        </Reveal>
      </Section>

      {/* ─── WHY US ───────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-gold/[0.02] to-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Why Growth Capital"
              title="Experience financial freedom with us"
              description="Unlike banks, we prioritize your needs and secure better deals by leveraging our vast network with Banks and NBFCs."
            />
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_US.map((item, i) => (
              <Reveal key={item.title} delay={i * 70}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-gold/10 bg-white p-6 transition-all duration-400 hover:-translate-y-1 hover:border-gold/25 hover:shadow-[var(--shadow-gold)]">
                  <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-gold/5 blur-[40px] transition-all duration-400 group-hover:bg-gold/10"></div>
                  <span className="relative grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-navy to-navy-soft text-gold shadow-md">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <h3 className="relative mt-4 text-base font-extrabold">{item.title}</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BANK PARTNERS ────────────────────────────── */}
      <Section className="pt-0">
        <Reveal>
          <SectionHeading
            eyebrow="Our Network"
            title="Banks in our network"
            description="We partner with major Banks and NBFCs to ensure you secure the best deals effortlessly. Enjoy a seamless loan process with zero hassle — guaranteed."
            align="center"
          />
        </Reveal>
        <Reveal delay={80}>
          <div className="mt-10">
            <BankMarquee />
          </div>
        </Reveal>
        <div className="mt-8 text-center">
          <Link
            to="/bank-partners"
            className="inline-flex items-center gap-2 text-sm font-bold text-gold transition-all duration-300 hover:gap-3"
          >
            See all 45+ partners <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
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
            title="Four steps from enquiry to disbursal"
          />
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 80}>
              <div className="surface-card group h-full p-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold/10 text-gold transition-all duration-400 group-hover:scale-110 group-hover:bg-gold group-hover:text-navy">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-extrabold tracking-[0.16em] text-gold uppercase">
                    Step {i + 1}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-extrabold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ─── MISSION & VISION ─────────────────────────── */}
      <Section className="pt-0">
        <div className="grid gap-5 lg:grid-cols-2">
          <Reveal>
            <div className="relative h-full overflow-hidden rounded-2xl bg-gradient-to-br from-navy via-navy-soft to-navy p-8 text-white">
              <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-gold/10 blur-[60px]"></div>
              <Target className="relative h-8 w-8 text-gold" />
              <h3 className="relative mt-4 text-2xl font-extrabold">Our Mission</h3>
              <p className="relative mt-3 text-sm leading-relaxed text-white/80">
                We are driven by a mission to foster lasting relationships with each client,
                aiming to deliver excellent service for years to come. Unlike many large
                national mortgage firms, we prioritize the security and privacy of your
                information, ensuring a trustworthy partnership.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="relative h-full overflow-hidden rounded-2xl border border-gold/15 bg-white p-8">
              <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-gold/5 blur-[50px]"></div>
              <Eye className="relative h-8 w-8 text-gold" />
              <h3 className="relative mt-4 text-2xl font-extrabold">Our Vision</h3>
              <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground">
                Dreaming of a future without barriers, our vision is to transform
                financial experiences for everyone. We strive to play a crucial role in
                enhancing financial experience with innovation, trust and inspiration.
                We aim to lead and reshape the financial landscape in India.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ─── ABOUT PREVIEW ────────────────────────────── */}
      <Section className="pt-0">
        <Reveal>
          <div className="glass-card overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="bg-gradient-to-br from-navy to-navy-soft p-8 text-white sm:p-10">
                <p className="eyebrow">About Us</p>
                <h3 className="mt-3 text-2xl font-extrabold sm:text-3xl">
                  Established in <span className="text-gold">2017</span>
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-white/80">
                  <strong className="text-white">Growth Capital Services</strong> is a leading
                  partnership firm that excels in offering custom-fit loan solutions from various
                  Banks and NBFCs. We offer a range of products including Home Loan, Loan Against
                  Property, Business Loan, Personal Loan, Working Capital Loans, Cash Credit,
                  Overdraft facility, Car Loan, Education Loan and more.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-white/80">
                  We simplify the loan process by offering end-to-end support from choosing the
                  right product to seamless documentation, legal and insurance guidance and timely
                  disbursal.
                </p>
                <Link
                  to="/about"
                  className="gold-btn mt-6"
                >
                  Learn More About Us
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="flex flex-col justify-center p-8 sm:p-10">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: "2017", label: "Year Established" },
                    { value: "45+", label: "Banking Partners" },
                    { value: "₹500Cr+", label: "Disbursed" },
                    { value: "₹0", label: "Advisory Fee" },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-xl border border-gold/15 bg-gold/[0.03] p-4 text-center">
                      <p className="text-2xl font-extrabold text-foreground">{stat.value}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 space-y-3">
                  {[
                    "Zero advisory fee for customers",
                    "Personalized lender matching",
                    "End-to-end documentation support",
                    "Serving Mumbai, Thane, Navi Mumbai & Pune",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-gold" />
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* ─── PAIN POINTS / HURDLES ────────────────────── */}
      <Section className="pt-0">
        <Reveal>
          <SectionHeading
            eyebrow="Common Concerns"
            title="The hurdles we remove for you"
            description="We began by studying what actually frustrates borrowers. Each of these is handled before you sign."
          />
        </Reveal>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {PAIN_POINTS.map((p, i) => (
            <Reveal key={p.question} delay={i * 60}>
              <div className="surface-card h-full p-6">
                <h3 className="text-base font-extrabold">{p.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.answer}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ─── CTA BANNER ───────────────────────────────── */}
      <Section className="pt-0">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy via-navy-soft to-navy p-8 sm:p-12">
            {/* Gold glow */}
            <div className="absolute top-0 right-0 h-60 w-60 rounded-full bg-gold/10 blur-[80px]"></div>
            <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-gold/5 blur-[60px]"></div>

            <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-2xl font-extrabold text-white sm:text-3xl">
                  Ready to move your loan <span className="gold-text">forward?</span>
                </h3>
                <p className="mt-2 max-w-xl text-sm text-white/70">
                  Call {CONTACT.phone} · {CONTACT.hours}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/contact"
                  className="gold-btn py-3.5 text-base"
                >
                  Apply Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={CONTACT.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-white/20 px-6 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-[#25D366]/50"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="#25D366"><path d="M12.04 2A10 10 0 0 0 2 12.04a9.94 9.94 0 0 0 1.34 4.99L2 22l5.13-1.34A9.95 9.95 0 0 0 12.04 22 10 10 0 0 0 22 12.04 10 10 0 0 0 12.04 2zm5.82 14.12c-.24.67-1.42 1.24-1.96 1.32-.5.07-1.14.1-1.84-.12a16.84 16.84 0 0 1-1.67-.62c-2.93-1.27-4.84-4.23-4.99-4.43-.15-.2-1.2-1.6-1.2-3.06 0-1.45.76-2.17 1.03-2.46.27-.3.59-.37.79-.37.2 0 .4 0 .57.01.18.01.43-.07.67.51.24.59.83 2.02.9 2.17.07.15.12.33.02.53-.1.2-.15.33-.3.5-.15.18-.31.4-.44.53-.15.15-.3.31-.13.61.17.3.77 1.27 1.65 2.06 1.13.99 2.09 1.3 2.39 1.44.3.15.47.13.64-.07.17-.21.74-.87.94-1.17.2-.3.4-.25.67-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.35.07.12.07.72-.17 1.4z"/></svg>
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
