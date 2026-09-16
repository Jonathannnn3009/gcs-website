import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { BankMarquee } from "@/components/bank-marquee";
import { CONTACT } from "@/data/site";
import { PRODUCTS, PRODUCT_GROUPS } from "@/data/products";

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
  { value: "75+", label: "Bank & NBFC Partners" },
  { value: "25+", label: "Loan Products" },
  { value: "100%", label: "Transparent Process" },
];

const WHY_CHOOSE = [
  {
    num: "01",
    title: "Real Choice, Not One Bank",
    body: "75+ banks and NBFCs in our network, so your file gets more than one shot at approval.",
  },
  {
    num: "02",
    title: "Senior Advisors, Not a Call Centre",
    body: "The same experienced advisor stays with your file from the first call to disbursal.",
  },
  {
    num: "03",
    title: "Built For Speed",
    body: "Documentation and structuring done right the first time, so approvals don't stall.",
  },
  {
    num: "04",
    title: "Nothing Hidden",
    body: "Rate, fees and terms — all in writing, before you sign anything.",
  },
  {
    num: "05",
    title: "Structured Around You",
    body: "Your loan packaged around your actual profile, not squeezed into a lender's template.",
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
              The desk that gets your file to "yes."
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Growth Capital Services has spent since {2017} doing one job well: reading a
              borrower's actual file — the irregular income, the awkward timing, the bank that
              already said no — and finding the lender in our network who'll say yes to it.
            </p>
          </Reveal>

          <Reveal delay={100} className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-border pt-8">
            {STATS.map((s) => (
              <div key={s.label} className="border-l-2 border-gold/40 pl-4">
                <p className="font-heading text-3xl font-bold text-navy sm:text-4xl">{s.value}</p>
                <p className="mt-1 text-xs font-semibold tracking-wide text-gold-dark uppercase">
                  {s.label}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-16">
            <Reveal>
              <div className="overflow-hidden rounded-3xl">
                <img
                  src="/brand/about-illustration.png"
                  alt="Growth Capital Services — turning aspirations into approvals"
                  className="w-full object-cover"
                />
              </div>
              <p className="mt-6 font-heading text-2xl leading-snug italic text-navy sm:text-3xl">
                "We read the file behind the file."
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                The question we ask before any other: what will get this approved?
              </p>
            </Reveal>

            <Reveal delay={100} className="lg:pt-4">
              <p className="eyebrow">How It Started</p>
              <h2 className="mt-3 text-3xl font-extrabold text-navy sm:text-4xl">
                Too many good files were getting rejected for the wrong reasons.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                <strong className="text-foreground">Growth Capital Services</strong> opened in
                2017 as a Direct Selling Agent, built around a simple idea: a borrower's paperwork
                shouldn't decide their financial future — the right advisor, matching them to the
                right lender, should. That's still the job today.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                A first home, a business that's outgrown its funding, or equity sitting locked
                inside a property already owned — we've structured all three, often for clients
                another advisor had already turned away.
              </p>
              <Link
                to="/services"
                className="mt-7 inline-flex items-center gap-2 rounded-md border border-navy/20 px-6 py-3 text-sm font-bold text-navy transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/50"
              >
                See our loan products <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="navy-panel relative overflow-hidden rounded-3xl p-8 sm:p-14">
              <div className="absolute top-0 right-1/4 h-72 w-72 rounded-full bg-gold/10 blur-[100px]" />
              <div className="relative grid gap-10 lg:grid-cols-2 lg:divide-x lg:divide-white/10">
                <div className="lg:pr-10">
                  <p className="text-xs font-bold tracking-[0.2em] text-gold uppercase">
                    Our Mission
                  </p>
                  <h3 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
                    Match the file to the lender who actually wants it.
                  </h3>
                  <p className="mt-4 text-[15px] leading-relaxed text-white/70">
                    Every profile fits somewhere — irregular income, a thin credit file, an
                    unconventional business. Our job is finding which of our partner lenders is
                    the right fit, instead of forcing your file into a template it was never going
                    to clear.
                  </p>
                </div>
                <div className="lg:pl-10">
                  <p className="text-xs font-bold tracking-[0.2em] text-gold uppercase">
                    Our Vision
                  </p>
                  <h3 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
                    The advisor people call before they call a bank.
                  </h3>
                  <p className="mt-4 text-[15px] leading-relaxed text-white/70">
                    To be the first call a borrower makes across our markets — because they
                    already trust we'll route them honestly, and to the lender that actually fits.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gradient-to-b from-background via-gold/[0.03] to-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="eyebrow">Why Choose Growth Capital Services</p>
            <h2 className="mt-3 text-3xl font-extrabold text-navy sm:text-4xl">
              What clients mention <span className="gold-text-static italic">when they refer us.</span>
            </h2>
          </Reveal>
          <div className="mt-12 border-t border-border">
            {WHY_CHOOSE.map((w, i) => (
              <Reveal key={w.num} delay={i * 70}>
                <div className="flex flex-col gap-2 border-b border-border py-6 sm:flex-row sm:items-baseline sm:gap-10 sm:py-7">
                  <span className="font-heading shrink-0 text-2xl italic text-gold-dark sm:w-16">
                    № {w.num}
                  </span>
                  <div>
                    <h3 className="text-lg font-extrabold text-navy">{w.title}</h3>
                    <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                      {w.body}
                    </p>
                  </div>
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
                  25 products, <span className="gold-text-static italic">one advisor who knows all of them.</span>
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

          <div className="mt-12 space-y-10">
            {PRODUCT_GROUPS.map((group, gi) => (
              <Reveal key={group.name} delay={gi * 60}>
                <div className="flex items-center gap-3">
                  <p className="shrink-0 text-xs font-bold tracking-[0.14em] text-gold-dark uppercase">
                    {group.name}
                  </p>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {PRODUCTS.filter((p) => p.group === group.name).map((p) => (
                    <Link
                      key={p.slug}
                      to="/services/$slug"
                      params={{ slug: p.slug }}
                      className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/30 hover:shadow-[var(--shadow-card)]"
                    >
                      <span className="text-[14px] font-bold text-foreground">{p.title}</span>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-gold/60 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold" />
                    </Link>
                  ))}
                </div>
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
          <div className="relative mt-14">
            <span
              aria-hidden
              className="absolute top-5 right-[10%] left-[10%] hidden h-0.5 bg-gold/20 lg:block"
            />
            <ol className="relative grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
              {PROCESS.map((step, i) => (
                <Reveal key={step.num} delay={i * 80}>
                  <li className="text-center">
                    <span className="relative z-10 mx-auto grid h-10 w-10 place-items-center rounded-full border-2 border-gold bg-white text-sm font-bold text-gold-dark">
                      {step.num}
                    </span>
                    <h3 className="mt-4 text-base font-extrabold text-navy">{step.title}</h3>
                    <p className="mx-auto mt-1.5 max-w-[14rem] text-sm leading-relaxed text-muted-foreground">
                      {step.body}
                    </p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="navy-panel relative overflow-hidden rounded-3xl p-8 text-center sm:p-14">
              <div className="absolute top-0 right-1/4 h-60 w-60 rounded-full bg-gold/10 blur-[80px]" />
              <div className="relative">
                <p className="text-xs font-bold tracking-[0.2em] text-gold uppercase">A Promise</p>
                <p className="mx-auto mt-5 max-w-xl font-heading text-2xl italic text-white sm:text-3xl">
                  "Let Growth Capital Services help turn your financial goals into reality."
                </p>
                <p className="mt-4 text-sm text-white/60">
                  No cost, no obligation — just a straight answer on what you qualify for.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
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
