import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ArrowRight, Calculator } from "lucide-react";
import { Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { LoanGoals } from "@/components/loan-goals";
import { LenderComparison } from "@/components/lender-comparison";
import { ServiceCarousel, imageForGroup } from "@/components/service-carousel";
import { PRODUCTS, PRODUCT_GROUPS } from "@/data/products";
import { CONTACT } from "@/data/site";
import { CALCULATORS } from "@/components/page-calculators";
import { PRODUCT_CALCULATORS } from "@/data/page-calculators";
import { useProductGroups } from "@/lib/page-lists";

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

function ServicesPage() {
  const PRODUCT_GROUPS = useProductGroups();
  const groupsWithCounts = PRODUCT_GROUPS.map((g) => ({
    ...g,
    count: PRODUCTS.filter((p) => p.group === g.name).length,
  }));

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-bg-light py-14 sm:py-20 dark:bg-background">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-gold/8 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center">
            <p className="flex items-center justify-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              <Link to="/" className="hover:text-navy dark:text-white">
                Home
              </Link>
              <span className="text-gold">/</span>
              <span className="text-navy dark:text-white">Services</span>
            </p>
            <p className="eyebrow mt-5">Every Product, One Desk</p>
            <h1 className="mt-3 text-3xl font-extrabold text-navy sm:text-5xl dark:text-white">
              {PRODUCTS.length} loan products,
              <br />
              <span className="gold-text-static italic">matched to your needs.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
              One expert works across our full catalogue of {PRODUCTS.length} products and our 75+
              lender network to find what actually fits your profile.
            </p>
          </Reveal>

          {/* Picture row: one card per category */}
          <Reveal delay={100} className="mt-6">
            <ServiceCarousel
              items={groupsWithCounts.map((g) => ({
                name: g.name,
                count: g.count,
                image: imageForGroup(g.name),
              }))}
            />
          </Reveal>
        </div>
      </section>

      {/* How the kinds of lender differ */}
      <Section className="pb-0">
        <LenderComparison />
      </Section>

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

      {/* All products by group — each group gets its own panel so 25 products don't blur together */}
      {PRODUCT_GROUPS.map((group, gi) => (
        <Section
          key={group.name}
          id={group.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
          className="pt-0 scroll-mt-24"
        >
          <div
            className={`rounded-3xl border p-6 sm:p-10 ${
              gi % 2 === 0
                ? "border-gold/20 bg-gold-pale/10"
                : "border-border bg-white dark:bg-card"
            }`}
          >
            <Reveal>
              <SectionHeading
                eyebrow={group.name}
                title={group.heading}
                description={group.description}
              />
            </Reveal>
            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              {PRODUCTS.filter((p) => p.group === group.name).map((product, i) => {
                const calcId = PRODUCT_CALCULATORS[product.slug]?.[0];
                return (
                  <Reveal key={product.slug} delay={i * 60}>
                    <article
                      id={product.slug}
                      className="group relative h-full scroll-mt-28 overflow-hidden rounded-2xl border border-border bg-white p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-[var(--shadow-lift)] dark:bg-card"
                    >
                      {/* Brand bar that sweeps in on hover */}
                      <span
                        aria-hidden
                        className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-navy via-navy-soft to-gold transition-transform duration-500 group-hover:scale-x-100"
                      />

                      <div className="flex items-start gap-4">
                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gold-pale/70 text-gold-dark ring-1 ring-gold/25 transition-colors duration-300 group-hover:animate-[gcs-wiggle_700ms_ease-in-out] group-hover:bg-gold group-hover:text-navy dark:bg-gold/15">
                          <product.icon className="h-6 w-6" />
                        </span>
                        <div>
                          <h3 className="text-xl font-extrabold text-navy dark:text-white">
                            {product.title}
                          </h3>
                          <p className="mt-1 text-sm font-semibold text-gold-dark">
                            {product.tagline}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2.5">
                        {product.facts.map((fact) => (
                          <div
                            key={fact.label}
                            className="rounded-lg border border-border bg-bg-light px-3 py-1.5 dark:bg-background"
                          >
                            <span className="block text-[10px] font-bold tracking-wide text-muted-foreground uppercase">
                              {fact.label}
                            </span>
                            <span className="block text-sm font-bold text-navy dark:text-white">
                              {fact.value}
                            </span>
                          </div>
                        ))}
                      </div>

                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                        {product.about}
                      </p>

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
                          className="group/link inline-flex items-center gap-2 text-sm font-bold text-navy transition-colors hover:text-gold-dark dark:text-white"
                        >
                          View full details
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
                        </Link>
                        {calcId && (
                          <Link
                            to="/tools"
                            hash={calcId}
                            className="group/calc inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-navy dark:text-white"
                          >
                            <Calculator className="h-3.5 w-3.5 transition-transform duration-300 group-hover/calc:-rotate-12 group-hover/calc:scale-125" />
                            {CALCULATORS[calcId].label} calculator
                          </Link>
                        )}
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </Section>
      ))}

      {/* CTA */}
      <Section className="pt-0">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-gold/25 panel-light p-8 text-center sm:p-12">
            <div className="absolute top-0 right-1/4 h-60 w-60 rounded-full bg-gold/10 blur-[80px]"></div>
            <h3 className="relative font-heading text-2xl font-bold text-navy sm:text-3xl dark:text-white">
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
                className="outline-btn dark:bg-card dark:text-white"
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
