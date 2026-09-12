import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Mail, MessageCircle, Phone } from "lucide-react";
import { Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { PRODUCTS, getProduct } from "@/data/products";
import { CONTACT } from "@/data/site";

export const Route = createFileRoute("/services/$slug")({
  head: ({ params }) => {
    const product = getProduct(params.slug);
    return {
      meta: product
        ? [
            { title: `${product.title} | Growth Capital Services` },
            { name: "description", content: product.about },
            { property: "og:title", content: `${product.title} | Growth Capital Services` },
            { property: "og:description", content: product.tagline },
          ]
        : [{ title: "Product Not Found | Growth Capital Services" }],
    };
  },
  component: ProductDetailPage,
});

function NotFoundBlock() {
  return (
    <Section className="text-center">
      <p className="eyebrow">Not Found</p>
      <h1 className="mt-3 text-3xl font-extrabold text-navy">That product doesn't exist.</h1>
      <p className="mt-3 text-muted-foreground">It may have moved — browse the full list instead.</p>
      <Link to="/services" className="gold-btn mt-6 inline-flex py-3">
        View all services <ArrowRight className="h-4 w-4" />
      </Link>
    </Section>
  );
}

const PROCESS = [
  { num: "01", title: "Consultation", body: "Tell us your goal — a senior advisor reads your profile end to end." },
  { num: "02", title: "Bank Matchmaking", body: "We match you to the lender most likely to approve your case." },
  { num: "03", title: "Documentation", body: "We structure the paperwork the way underwriters actually underwrite." },
  { num: "04", title: "Sanction & Support", body: "Funds reach your account, with support continuing after disbursal." },
];

function ProductDetailPage() {
  const { slug } = Route.useParams();
  const product = getProduct(slug);
  if (!product) return <NotFoundBlock />;
  const related = PRODUCTS.filter((p) => p.group === product.group && p.slug !== product.slug).slice(0, 3);
  const fallbackRelated = related.length > 0 ? related : PRODUCTS.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden hero-light border-b border-gold/15 py-14 sm:py-20">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-gold/8 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              <Link to="/" className="hover:text-navy">Home</Link>
              <span className="text-gold">/</span>
              <Link to="/services" className="hover:text-navy">Services</Link>
              <span className="text-gold">/</span>
              <span className="text-navy">{product.title}</span>
            </p>

            <div className="mt-5 flex items-start gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gold-pale/70 text-gold-dark ring-1 ring-gold/25">
                <product.icon className="h-7 w-7" />
              </span>
              <div>
                <h1 className="text-3xl font-extrabold text-navy sm:text-5xl">{product.title}</h1>
                <p className="mt-1.5 text-base font-semibold text-gold-dark">{product.tagline}</p>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              {product.facts.map((fact) => (
                <div key={fact.label} className="rounded-xl border border-gold/15 bg-white px-4 py-2.5">
                  <span className="block text-[10px] font-bold tracking-wide text-muted-foreground uppercase">{fact.label}</span>
                  <span className="block text-sm font-bold text-navy">{fact.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/contact" className="gold-btn py-3.5 text-base">
                Apply for {product.title} <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={CONTACT.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-navy/20 bg-white px-6 py-3.5 text-sm font-bold text-navy transition-all hover:-translate-y-0.5"
              >
                <MessageCircle className="h-4 w-4" /> Message on WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* About */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="About This Product"
            title={`Why clients choose Growth Capital Services for ${product.title}.`}
            description={product.about}
          />
        </Reveal>
      </Section>

      {/* Features / Eligibility / Documents */}
      <Section className="pt-0">
        <div className="grid gap-5 lg:grid-cols-3">
          {[
            { eyebrow: "What We Offer", title: "Key features", items: product.features },
            { eyebrow: "Who Can Apply", title: "Basic eligibility", items: product.eligibility },
            { eyebrow: "Keep Ready", title: "Documents required", items: product.documents },
          ].map((block, i) => (
            <Reveal key={block.title} delay={i * 80}>
              <div className="h-full rounded-2xl border border-border bg-white p-7">
                <p className="text-[10px] font-bold tracking-[0.2em] text-gold-dark uppercase">{block.eyebrow}</p>
                <h3 className="mt-2 text-lg font-extrabold text-navy">{block.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {block.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Working promise */}
      <Section className="pt-0">
        <Reveal>
          <div className="panel-light rounded-2xl border border-gold/15 p-8 text-center sm:p-10">
            <p className="eyebrow">A Working Promise</p>
            <p className="mx-auto mt-4 max-w-2xl font-heading text-xl italic text-navy sm:text-2xl">
              "Structured to be approved — not just submitted."
            </p>
          </div>
        </Reveal>
      </Section>

      {/* Begin your application */}
      <Section className="pt-0">
        <Reveal>
          <div className="grid overflow-hidden rounded-2xl border border-gold/15 lg:grid-cols-2">
            <div className="navy-panel p-8 sm:p-10">
              <p className="text-xs font-bold tracking-[0.2em] text-gold uppercase">Begin Your Application</p>
              <h3 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
                Apply for {product.title}.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65">
                A senior advisor will call back within one business day with an indicative offer.
              </p>
              <div className="mt-6 flex flex-wrap gap-4 text-xs text-white/50">
                <span>✓ Confidential</span>
                <span>✓ No upfront fees</span>
                <span>✓ 24-hr callback</span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 p-8 sm:grid-cols-3 sm:p-10">
              <a href={CONTACT.phoneHref} className="flex flex-col items-center gap-2 rounded-xl border border-border p-5 text-center transition-colors hover:border-gold/40">
                <Phone className="h-5 w-5 text-gold" />
                <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Call Us</span>
                <span className="text-sm font-bold text-navy">{CONTACT.phone}</span>
              </a>
              <a href={CONTACT.whatsappLink} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 rounded-xl border border-border p-5 text-center transition-colors hover:border-gold/40">
                <MessageCircle className="h-5 w-5 text-gold" />
                <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">WhatsApp</span>
                <span className="text-sm font-bold text-navy">Message us now</span>
              </a>
              <a href={`mailto:${CONTACT.email}`} className="flex flex-col items-center gap-2 rounded-xl border border-border p-5 text-center transition-colors hover:border-gold/40">
                <Mail className="h-5 w-5 text-gold" />
                <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Email</span>
                <span className="truncate text-sm font-bold text-navy">{CONTACT.email}</span>
              </a>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* Process */}
      <Section className="pt-0">
        <Reveal>
          <SectionHeading eyebrow="Our Process" title="From first conversation to disbursal." align="center" />
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((step, i) => (
            <Reveal key={step.num} delay={i * 80}>
              <div className="h-full rounded-2xl border border-border bg-white p-6">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-navy text-sm font-bold text-white">
                  {step.num}
                </span>
                <h4 className="mt-4 text-base font-extrabold text-navy">{step.title}</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Related products */}
      <Section className="pt-0">
        <Reveal>
          <SectionHeading eyebrow="You Might Also Need" title="Related products" />
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {fallbackRelated.map((p, i) => (
            <Reveal key={p.slug} delay={i * 80}>
              <Link
                to="/services/$slug"
                params={{ slug: p.slug }}
                className="group flex h-full flex-col rounded-2xl border border-border bg-white p-6 transition-all hover:-translate-y-1 hover:border-gold/40 hover:shadow-[var(--shadow-lift)]"
              >
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-gold-pale/60 text-gold-dark">
                  <p.icon className="h-5 w-5" />
                </span>
                <h4 className="mt-4 text-base font-extrabold text-navy">{p.title}</h4>
                <p className="mt-1.5 text-sm text-muted-foreground">{p.tagline}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-gold-dark">
                  Explore {p.title} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200} className="mt-6 text-center">
          <Link to="/services" className="inline-flex items-center gap-2 text-sm font-bold text-navy hover:text-gold-dark">
            View all services <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </Section>

      {/* Final CTA */}
      <Section className="pt-0">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-gold/25 panel-light p-8 text-center sm:p-12">
            <div className="absolute top-0 right-1/4 h-60 w-60 rounded-full bg-gold/10 blur-[80px]" />
            <h3 className="relative text-2xl font-extrabold text-navy sm:text-3xl">
              Ready to apply for {product.title}? <span className="gold-text">Let's talk.</span>
            </h3>
            <p className="relative mt-3 text-sm text-muted-foreground">
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
