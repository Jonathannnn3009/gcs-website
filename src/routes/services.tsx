import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ArrowRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { ServiceTabs } from "@/components/service-tabs";
import { PRODUCTS, PRODUCT_GROUPS } from "@/data/products";
import { CONTACT } from "@/data/site";

export const Route = createFileRoute("/services")({
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
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy via-navy-soft to-navy py-16 sm:py-20">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-gold/8 blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-gold/5 blur-[80px]"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="eyebrow">Loan Products</p>
            <h1 className="mt-4 text-3xl font-extrabold text-white sm:text-5xl">
              Twenty-plus instruments, <span className="gold-text">one private desk.</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base text-white/70">
              Curated lending — placed across India's leading banks & NBFCs. Select a product to see
              how we structure it, what it can save you and which lenders fit your profile.
            </p>
            <div className="mt-6 flex items-center gap-6">
              <div>
                <span className="text-3xl font-extrabold text-gold">₹500 Cr+</span>
                <span className="ml-2 text-sm text-white/50">Disbursed to date</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Quick Tabs */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Quick View"
            title="Explore by product"
            description="Select a product to see highlights and key features at a glance."
          />
        </Reveal>
        <Reveal delay={80}>
          <ServiceTabs />
        </Reveal>
      </Section>

      {/* All Products by Group */}
      {PRODUCT_GROUPS.map((group, gi) => (
        <Section key={group.name} className={gi === 0 ? "pt-0" : ""}>
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
                <div
                  id={product.slug}
                  className="group relative h-full scroll-mt-28 overflow-hidden rounded-2xl border border-border bg-white p-7 transition-all duration-400 hover:-translate-y-1 hover:border-gold/25 hover:shadow-[var(--shadow-gold)]"
                >
                  {/* Gold accent corner */}
                  <div className="absolute top-0 right-0 h-20 w-20 rounded-full bg-gold/5 blur-[30px] transition-all group-hover:bg-gold/10"></div>

                  <div className="flex items-start justify-between">
                    <div>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/20 bg-gold/5 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-gold uppercase">
                        {product.code}
                      </span>
                      <h3 className="mt-2 text-xl font-extrabold">{product.title}</h3>
                      <p className="mt-1 text-sm text-gold font-semibold">{product.tagline}</p>
                    </div>
                  </div>

                  {/* Facts */}
                  <div className="mt-4 flex flex-wrap gap-3">
                    {product.facts.map((fact) => (
                      <div
                        key={fact.label}
                        className="rounded-lg border border-gold/10 bg-gold/[0.03] px-3 py-1.5"
                      >
                        <span className="block text-[10px] font-bold text-muted-foreground uppercase">
                          {fact.label}
                        </span>
                        <span className="block text-sm font-bold text-foreground">{fact.value}</span>
                      </div>
                    ))}
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{product.about}</p>

                  {/* Features */}
                  <ul className="mt-4 space-y-2">
                    {product.features.slice(0, 4).map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/contact"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-gold transition-all duration-300 hover:gap-3"
                  >
                    Enquire about {product.title} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      ))}

      {/* CTA */}
      <Section className="pt-0">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy via-navy-soft to-navy p-8 sm:p-12 text-center">
            <div className="absolute top-0 right-1/4 h-60 w-60 rounded-full bg-gold/10 blur-[80px]"></div>
            <h3 className="relative text-2xl font-extrabold text-white sm:text-3xl">
              Not sure which product fits? <span className="gold-text">Let's talk.</span>
            </h3>
            <p className="relative mt-3 text-sm text-white/70">
              Call {CONTACT.phone} · {CONTACT.hours}
            </p>
            <div className="relative mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/contact" className="gold-btn py-3.5 text-base">
                Get Free Consultation <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={CONTACT.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-white/20 px-6 py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5"
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
