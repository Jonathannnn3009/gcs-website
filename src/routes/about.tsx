import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Quote } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { BankMarquee } from "@/components/bank-marquee";
import { CONTACT } from "@/data/site";
import { PRODUCTS } from "@/data/products";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Growth Capital Services | Trusted Loan Advisors Since 2017" },
      {
        name: "description",
        content:
          "Growth Capital Services, established in 2017, is a leading partnership firm offering custom-fit loan solutions from various Banks and NBFCs across Mumbai, Thane, Navi Mumbai and Pune.",
      },
      { property: "og:title", content: "About Growth Capital Services" },
      {
        property: "og:description",
        content: "Your trusted loan facilitation partner. Since 2017.",
      },
    ],
  }),
  component: AboutPage,
});

const STATS = [
  { value: "2017", label: "Established" },
  { value: "45+", label: "Bank & NBFC Partners" },
  { value: "23+", label: "Loan Products" },
  { value: "100%", label: "Transparent Process" },
];

const WHY_CHOOSE = [
  {
    num: "01",
    title: "Wide Lender Network",
    body: "Partnerships across leading Banks and NBFCs, for real choice — not one option.",
  },
  {
    num: "02",
    title: "Senior-Level Expertise",
    body: "A team of experienced advisors guiding you at every step, end to end.",
  },
  {
    num: "03",
    title: "Fast Processing",
    body: "Streamlined documentation and structuring for quicker approvals.",
  },
  {
    num: "04",
    title: "Full Transparency",
    body: "Honest communication, with no hidden charges — ever.",
  },
  {
    num: "05",
    title: "Tailored Structuring",
    body: "Loan packages structured to your unique financial requirement.",
  },
];

const PROCESS = [
  { num: "1", title: "Consultation", body: "Understanding your financial needs." },
  { num: "2", title: "Product Matching", body: "Identifying the right fit across our partners." },
  { num: "3", title: "Documentation Support", body: "Simplifying the paperwork." },
  { num: "4", title: "Loan Processing", body: "Liaising with lenders for fast approvals." },
  { num: "5", title: "Post-Disbursal Support", body: "Continued assistance even after disbursal." },
];

function AboutPage() {
  return (
    <>
      {/* Banner */}
      <section className="hero-light border-b border-gold/15 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Home <span className="text-gold">/</span> About
            </p>
            <p className="eyebrow mt-4">About Growth Capital Services</p>
            <h1 className="mt-3 max-w-3xl text-3xl font-extrabold text-navy sm:text-5xl">
              Your trusted loan facilitation partner.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Since {2017}, Growth Capital Services has become a leading Direct Selling Agent
              specialising in loan facilitation — simplifying the borrowing process and connecting
              clients with financing solutions actually structured around them.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <Reveal>
              <p className="eyebrow">Our Story</p>
              <h2 className="mt-3 text-3xl font-extrabold text-navy sm:text-4xl">
                Built to close the gap between borrower and bank.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                Since our establishment in 2017, <strong className="text-foreground">Growth
                Capital Services</strong> has become a trusted Direct Selling Agent specialising
                in loan facilitation. Our mission is to simplify the borrowing process by
                connecting clients with customised financial solutions — ensuring transparency,
                efficiency and customer satisfaction at every step.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                We're committed to empowering individuals and businesses to achieve their
                financial aspirations. Whether it's a dream home, a growing enterprise, or
                unlocking liquidity from a property already owned, we structure files that win
                approvals — even when other intermediaries pass.
              </p>
              <Link
                to="/services"
                className="mt-7 inline-flex items-center gap-2 rounded-md border border-navy/20 px-6 py-3 text-sm font-bold text-navy transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/50"
              >
                Explore our services <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>

            <Reveal delay={100} className="relative">
              <div className="overflow-hidden rounded-3xl border border-gold/15">
                <img
                  src="/brand/about-illustration.png"
                  alt="Growth Capital Services — turning aspirations into approvals"
                  className="w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 left-6 right-6 rounded-2xl border border-gold/15 bg-white p-5 shadow-[var(--shadow-lift)] sm:left-10 sm:right-10">
                <p className="font-heading text-lg italic text-navy">
                  "Structured to be approved — not just submitted."
                </p>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  A working philosophy behind every file we take on.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="pb-16 pt-10 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-gold/15 bg-white p-6 text-center transition-all duration-400 hover:-translate-y-1 hover:border-gold/30 hover:shadow-[var(--shadow-gold)]"
                >
                  <p className="font-heading text-3xl font-bold text-navy sm:text-4xl">{s.value}</p>
                  <p className="mt-1.5 text-xs font-semibold tracking-wide text-gold-dark uppercase">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 lg:grid-cols-2">
            <Reveal>
              <article className="navy-panel relative h-full overflow-hidden rounded-3xl p-8 sm:p-10">
                <p className="text-xs font-bold tracking-[0.2em] text-gold uppercase">Our Mission</p>
                <h3 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
                  Bridge the gap between ambition and approval.
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed text-white/70">
                  To connect every client with the financing solution that actually fits their
                  profile — not the bank's default template — so ambition doesn't stall at the
                  application stage.
                </p>
              </article>
            </Reveal>
            <Reveal delay={100}>
              <article className="relative h-full overflow-hidden rounded-3xl border border-border bg-white p-8 sm:p-10">
                <Quote className="absolute right-8 top-8 h-14 w-14 text-gold-pale" fill="currentColor" strokeWidth={0} />
                <p className="relative text-xs font-bold tracking-[0.2em] text-gold-dark uppercase">Our Vision</p>
                <h3 className="relative mt-3 max-w-sm text-2xl font-extrabold text-navy sm:text-3xl">
                  The most trusted name in financial facilitation.
                </h3>
                <p className="relative mt-4 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
                  To become the most trusted financial facilitation partner across our markets —
                  known for integrity, structuring expertise, and always putting the client first.
                </p>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gradient-to-b from-background via-gold/[0.03] to-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="eyebrow">Why Choose Growth Capital Services</p>
            <h2 className="mt-3 text-3xl font-extrabold text-navy sm:text-4xl">
              Five reasons clients <span className="gold-text-static italic">come back to us.</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {WHY_CHOOSE.map((w, i) => (
              <Reveal key={w.num} delay={i * 70}>
                <div className="h-full rounded-2xl border border-border bg-white p-6 transition-all duration-400 hover:-translate-y-1 hover:border-gold/30 hover:shadow-[var(--shadow-card)]">
                  <p className="font-heading text-lg italic text-gold-dark">№ {w.num}</p>
                  <h3 className="mt-3 text-base font-extrabold text-navy">{w.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Our Services</p>
                <h2 className="mt-3 text-3xl font-extrabold text-navy sm:text-4xl">
                  Tailored across <span className="gold-text-static italic">twenty-three loan categories.</span>
                </h2>
              </div>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-md border border-navy/20 px-5 py-2.5 text-sm font-bold text-navy transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/50"
              >
                View all services <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUCTS.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 8) * 40}>
                <Link
                  to="/services"
                  hash={p.slug}
                  className="group flex h-full items-start justify-between gap-3 rounded-xl border border-border bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-[var(--shadow-card)]"
                >
                  <span>
                    <span className="block text-[15px] font-bold text-foreground">{p.title}</span>
                    <span className="mt-1 block text-[13px] leading-snug text-muted-foreground">{p.tagline}</span>
                  </span>
                  <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-gold/60 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold" />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Our Partners */}
      <section className="bg-gradient-to-b from-background via-gold/[0.03] to-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="eyebrow">Our Partners</p>
            <h2 className="mt-3 text-3xl font-extrabold text-navy sm:text-4xl">
              India's leading <span className="gold-text-static italic">banks & NBFCs.</span>
            </h2>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground">
              We're proud to work with India's leading financial institutions, including:
            </p>
          </Reveal>
          <Reveal delay={100} className="mt-10">
            <BankMarquee />
          </Reveal>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">How We Work</p>
              <h2 className="mt-3 text-3xl font-extrabold text-navy sm:text-4xl">
                A guided process — <span className="gold-text-static italic">from first call to disbursal.</span>
              </h2>
            </div>
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {PROCESS.map((step, i) => (
              <Reveal key={step.num} delay={i * 80}>
                <div className="relative h-full rounded-2xl border border-border bg-white p-6">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-navy text-sm font-bold text-white">
                    {step.num}
                  </span>
                  <h3 className="mt-4 text-base font-extrabold text-navy">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                  {i < PROCESS.length - 1 && (
                    <ArrowRight className="absolute -right-3 top-9 hidden h-4 w-4 text-gold/50 lg:block" />
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* A Promise */}
      <section className="bg-gradient-to-b from-background via-gold/[0.03] to-background py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal>
            <p className="eyebrow">A Promise</p>
            <p className="mx-auto mt-5 max-w-xl font-heading text-2xl italic text-navy sm:text-3xl">
              "Let Growth Capital Services help turn your financial goals into reality."
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a href={CONTACT.whatsappLink} target="_blank" rel="noopener noreferrer" className="gold-btn py-3">
                Talk to an advisor <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-md border border-navy/20 px-6 py-3 text-sm font-bold text-navy transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/50"
              >
                Browse services
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="navy-panel relative overflow-hidden rounded-3xl p-8 sm:p-10">
              <div className="absolute top-0 right-1/4 h-60 w-60 rounded-full bg-gold/10 blur-[80px]" />
              <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
                <div>
                  <h3 className="text-2xl font-extrabold text-white sm:text-3xl">
                    Ready to find the right funding solution?
                  </h3>
                  <p className="mt-2 text-sm text-white/60">
                    Free consultation. Check your eligibility in 2 minutes.
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-3">
                  <Link to="/contact" className="gold-btn py-3.5 text-base">
                    Apply Now <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href={CONTACT.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border border-white/25 px-6 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-white/50"
                  >
                    Talk on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
