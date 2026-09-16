import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ArrowRight, Calculator } from "lucide-react";
import { Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { LoanGoals } from "@/components/loan-goals";
import { PRODUCTS, PRODUCT_GROUPS } from "@/data/products";
import { CONTACT } from "@/data/site";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Loan Products & Services | Growth Capital Services" },
      {
        name: "description",
        content:
          "Home Loan, Loan Against Property, Business & Working Capital, Personal, Car and Education Loans arranged across leading Banks and NBFCs.",
      },
      { property: "og:title", content: "Loan Products & Services" },
      {
        property: "og:description",
        content: "Tailored loan solutions with balance transfer, top-up and overdraft facilities.",
      },
    ],
  }),
  component: ServicesPage,
});

const SERVICE_STATS = [
  { value: `${PRODUCTS.length}+`, label: "Loan Products" },
  { value: "75+", label: "Bank & NBFC Partners" },
  { value: "100%", label: "Transparent Process" },
  { value: "2017", label: "Arranging Loans Since" },
];

function ServicesPage() {
  const groupsWithCounts = PRODUCT_GROUPS.map((g) => ({
    ...g,
    count: PRODUCTS.filter((p) => p.group === g.name).length,
  }));

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-bg-light py-14 sm:py-20">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-gold/8 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center">
            <p className="flex items-center justify-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              <Link to="/" className="hover:text-navy">Home</Link>
              <span className="text-gold">/</span>
              <span className="text-navy">Services</span>
            </p>
            <p className="eyebrow mt-5">Every Product, One Desk</p>
            <h1 className="mt-3 text-3xl font-extrabold text-navy sm:text-5xl">
              {PRODUCTS.length} loan products,<br />
              <span className="gold-text-static italic">matched to your file, not a script.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
              One advisor works across our full catalogue of {PRODUCTS.length} products and our
              75+ lender network to find what actually fits your profile.
            </p>
          </Reveal>

          {/* Category pills */}
          <Reveal delay={100} className="mt-8 flex flex-wrap justify-center gap-2.5">
            {groupsWithCounts.map((g) => (
              <a
                key={g.name}
                href={`#${g.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-navy transition-colors hover:border-gold/40"
              >
                {g.name}
                <span className="grid h-5 w-5 place-items-center rounded-full bg-gold-pale/70 text-[11px] font-bold text-gold-dark">
                  {g.count}
                </span>
              </a>
            ))}
          </Reveal>

          {/* Stats */}
          <Reveal
            delay={180}
            className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-x-10 gap-y-4 border-t border-border pt-8"
          >
            {SERVICE_STATS.map((s) => (
              <div key={s.label} className="border-l-2 border-gold/40 pl-4 text-left">
                <p className="font-heading text-2xl font-bold text-navy sm:text-3xl">{s.value}</p>
                <p className="mt-1 text-xs font-bold tracking-wide text-gold-dark uppercase">{s.label}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Start with a goal */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Start With Your Goal"
            title="What are you planning?"
            description="Pick a goal to jump straight to the right loan."
          />
        </Reveal>
        <LoanGoals />
      </Section>

      {/* All products by group */}
      {PRODUCT_GROUPS.map((group) => (
        <Section
          key={group.name}
          id={group.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
          className="pt-0 scroll-mt-24"
        >
          <Reveal>
            <SectionHeading
              eyebrow={group.name}
              title={group.heading}
              description={group.description}
            />
          </Reveal>
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {PRODUCTS.filter((p) => p.group === group.name).map((product, i) => (
              <Reveal key={product.slug} delay={i * 60}>
                <article
                  id={product.slug}
                  className="group relative h-full scroll-mt-28 overflow-hidden rounded-2xl border border-border bg-white p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-[var(--shadow-lift)]"
                >
                  {/* Brand bar that sweeps in on hover */}
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-navy via-navy-soft to-gold transition-transform duration-500 group-hover:scale-x-100"
                  />

                  <div className="flex items-start gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gold-pale/70 text-gold-dark ring-1 ring-gold/25 transition-colors duration-300 group-hover:animate-[gcs-wiggle_700ms_ease-in-out] group-hover:bg-gold group-hover:text-navy">
                      <product.icon className="h-6 w-6" />
                    </span>
                    <div>
                      <h3 className="text-xl font-extrabold text-navy">{product.title}</h3>
                      <p className="mt-1 text-sm font-semibold text-gold-dark">{product.tagline}</p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2.5">
                    {product.facts.map((fact) => (
                      <div
                        key={fact.label}
                        className="rounded-lg border border-border bg-bg-light px-3 py-1.5"
                      >
                        <span className="block text-[10px] font-bold tracking-wide text-muted-foreground uppercase">
                          {fact.label}
                        </span>
                        <span className="block text-sm font-bold text-navy">{fact.value}</span>
                      </div>
                    ))}
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{product.about}</p>

                  <ul className="mt-4 space-y-2">
                    {product.features.slice(0, 4).map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
                    <Link
                      to="/services/$slug"
                      params={{ slug: product.slug }}
                      className="group/link inline-flex items-center gap-2 text-sm font-bold text-navy transition-colors hover:text-gold-dark"
                    >
                      View full details
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
                    </Link>
                    <Link
                      to="/tools"
                      hash="eligibility"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-navy"
                    >
                      <Calculator className="h-3.5 w-3.5" />
                      Check eligibility
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Section>
      ))}

      {/* CTA */}
      <Section className="pt-0">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-gold/25 panel-light p-8 text-center sm:p-12">
            <div className="absolute top-0 right-1/4 h-60 w-60 rounded-full bg-gold/10 blur-[80px]"></div>
            <h3 className="relative font-heading text-2xl font-bold text-navy sm:text-3xl">
              Not sure which one fits? <span className="gold-text">Let&apos;s talk.</span>
            </h3>
            <p className="relative mt-3 text-sm text-muted-foreground">
              Call {CONTACT.phone} · {CONTACT.hours}
            </p>
            <div className="relative mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/contact" className="gold-btn group py-3.5 text-base">
                Get Free Consultation
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <a
                href={CONTACT.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-navy/20 bg-white px-6 py-3.5 text-sm font-bold text-navy transition-all hover:-translate-y-0.5"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
