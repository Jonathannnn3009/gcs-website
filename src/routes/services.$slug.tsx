import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, FileCheck2, FileText, Landmark, Mail, MessageCircle, Phone } from "lucide-react";
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
  { num: "01", icon: FileText, title: "Consultation", body: "Tell us your goal — a senior advisor reads your profile end to end." },
  { num: "02", icon: Landmark, title: "Bank Matchmaking", body: "We match you to the lender most likely to approve your case." },
  { num: "03", icon: FileCheck2, title: "Documentation", body: "We structure the paperwork the way underwriters actually underwrite." },
  { num: "04", icon: Check, title: "Sanction & Support", body: "Funds reach your account, with support continuing after disbursal." },
];

function productCode(title: string): string {
  const skip = new Set(["against", "and", "for", "of", "the", "on"]);
  return title
    .split(/\s+/)
    .filter((w) => !skip.has(w.toLowerCase()))
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 4);
}

function ProductDetailPage() {
  const { slug } = Route.useParams();
  const product = getProduct(slug);
  if (!product) return <NotFoundBlock />;
  const related = PRODUCTS.filter((p) => p.group === product.group && p.slug !== product.slug).slice(0, 3);
  const fallbackRelated = related.length > 0 ? related : PRODUCTS.filter((p) => p.slug !== product.slug).slice(0, 3);
  const code = productCode(product.title);

  return (
    <>
      {/* Hero */}
      <section className="bg-bg-light py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="grid gap-0 overflow-hidden rounded-3xl lg:grid-cols-[1.4fr_1fr]">
              {/* Navy card */}
              <div className="navy-panel relative overflow-hidden p-8 sm:p-12">
                <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-gold/10 blur-[100px]" />
                <p className="relative flex items-center gap-1.5 text-xs font-semibold tracking-wide text-white/50 uppercase">
                  <Link to="/" className="hover:text-white">Home</Link>
                  <span className="text-gold">/</span>
                  <Link to="/services" className="hover:text-white">Services</Link>
                  <span className="text-gold">/</span>
                  <span className="text-white">{product.title}</span>
                </p>

                <div className="relative mt-6 flex items-center gap-3">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-gold/30 text-gold-light">
                    <product.icon className="h-7 w-7" />
                  </span>
                  <span className="rounded-full border border-gold/30 px-3 py-1 text-xs font-bold tracking-wide text-gold-light">
                    {code}
                  </span>
                </div>

                <h1 className="relative mt-5 font-heading text-4xl font-bold text-white sm:text-5xl">{product.title}</h1>
                <p className="relative mt-2 font-heading text-lg italic text-gold-light">{product.tagline}</p>

                <div className="relative mt-8 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/10 pt-6">
                  {product.facts.map((fact) => (
                    <div key={fact.label}>
                      <span className="block text-[10px] font-bold tracking-wide text-white/40 uppercase">{fact.label}</span>
                      <span className="block text-sm font-bold text-gold-light">{fact.value}</span>
                    </div>
                  ))}
                </div>

                <div className="relative mt-8 flex flex-wrap items-center gap-5">
                  <Link to="/contact" className="gold-btn py-3.5 text-base">
                    Apply for {code} <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href={CONTACT.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-white/70 transition-colors hover:text-white"
                  >
                    or message on WhatsApp <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              {/* Decorative side panel */}
              <div className="relative hidden items-center justify-center overflow-hidden bg-gold-pale/40 lg:flex">
                <div className="absolute h-72 w-72 rounded-full border border-gold/20" />
                <div className="absolute h-52 w-52 rounded-full border border-gold/25" />
                <div className="relative flex flex-col items-center gap-4 text-center">
                  <span className="font-heading text-sm italic text-gold-dark">01</span>
                  <span className="grid h-20 w-20 place-items-center rounded-2xl navy-panel text-gold-light shadow-lg">
                    <product.icon className="h-9 w-9" />
                  </span>
                  <div>
                    <p className="font-heading text-lg font-bold text-navy">{product.title}</p>
                    <p className="text-xs font-bold tracking-wide text-gold-dark">{code}</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* About + Key Features + Eligibility/Documents + Promise, beside a sticky Apply card */}
      <Section>
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          {/* LEFT: content stack */}
          <div className="space-y-12">
            <Reveal>
              <p className="eyebrow">About This Product</p>
              <h2 className="mt-3 text-2xl font-extrabold text-navy sm:text-3xl">
                Why clients choose Growth Capital Services for {product.title}.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">{product.about}</p>
            </Reveal>

            <div>
              <Reveal>
                <p className="eyebrow">What We Offer</p>
                <h3 className="mt-2 text-2xl font-extrabold text-navy">Key features</h3>
              </Reveal>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {product.features.map((item, i) => (
                  <Reveal key={item} delay={i * 60}>
                    <div className="flex items-start gap-3 rounded-xl border border-border bg-white p-5">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold-pale/60 text-gold-dark">
                        <Check className="h-4 w-4" />
                      </span>
                      <span className="pt-1 text-sm leading-relaxed text-foreground">{item}</span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Reveal>
                <div className="h-full rounded-2xl border border-border bg-white p-7">
                  <p className="text-[10px] font-bold tracking-[0.2em] text-gold-dark uppercase">Who Can Apply</p>
                  <h3 className="mt-2 text-lg font-extrabold text-navy">Basic eligibility</h3>
                  <ul className="mt-4 space-y-2.5">
                    {product.eligibility.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
              <Reveal delay={80}>
                <div className="navy-panel h-full rounded-2xl p-7">
                  <p className="text-[10px] font-bold tracking-[0.2em] text-gold uppercase">Keep Ready</p>
                  <h3 className="mt-2 text-lg font-extrabold text-white">Documents required</h3>
                  <ul className="mt-4 space-y-2.5">
                    {product.documents.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-white/70">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-light" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>

            <Reveal>
              <div className="panel-light rounded-2xl border border-gold/15 p-8 text-center">
                <p className="eyebrow">A Working Promise</p>
                <p className="mx-auto mt-4 max-w-2xl font-heading text-xl italic text-navy">
                  "Structured to be approved — not just submitted."
                </p>
              </div>
            </Reveal>
          </div>

          {/* RIGHT: sticky apply card */}
          <Reveal delay={100} className="lg:sticky lg:top-28">
            <div className="rounded-2xl border border-gold/15 panel-light p-7">
              <p className="text-xs font-bold tracking-[0.2em] text-gold-dark uppercase">Begin Your Application</p>
              <h3 className="mt-3 font-heading text-2xl font-bold text-navy">
                Apply for <span className="italic text-gold-dark">{product.title}.</span>
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                A senior advisor will call back within one business day with an indicative offer.
              </p>

              <div className="mt-6 space-y-3">
                <a href={CONTACT.phoneHref} className="group flex items-center gap-3 rounded-xl border border-border bg-white p-3.5 transition-colors hover:border-gold/40">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gold-pale/60 text-gold-dark">
                    <Phone className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Call Us</span>
                    <span className="block truncate text-sm font-bold text-navy">{CONTACT.phone}</span>
                  </span>
                  <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-gold transition-transform group-hover:translate-x-1" />
                </a>
                <a href={CONTACT.whatsappLink} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 rounded-xl border border-border bg-white p-3.5 transition-colors hover:border-gold/40">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gold-pale/60 text-gold-dark">
                    <MessageCircle className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">WhatsApp</span>
                    <span className="block truncate text-sm font-bold text-navy">Message us now</span>
                  </span>
                  <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-gold transition-transform group-hover:translate-x-1" />
                </a>
                <a href={`mailto:${CONTACT.email}`} className="group flex items-center gap-3 rounded-xl border border-border bg-white p-3.5 transition-colors hover:border-gold/40">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gold-pale/60 text-gold-dark">
                    <Mail className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Email</span>
                    <span className="block truncate text-sm font-bold text-navy">{CONTACT.email}</span>
                  </span>
                  <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-gold transition-transform group-hover:translate-x-1" />
                </a>
              </div>

              <Link to="/contact" className="mt-4 flex items-center justify-center rounded-xl bg-navy py-3.5 text-sm font-bold text-white transition-colors hover:bg-navy-soft">
                Full application form <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                <span>✓ Confidential</span>
                <span>✓ No upfront fees</span>
                <span>✓ 24-hr callback</span>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Process */}
      <Section className="pt-0">
        <Reveal>
          <SectionHeading eyebrow="Our Process" title="From first conversation to disbursal." align="center" />
        </Reveal>
        <div className="relative mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((step, i) => (
            <div key={step.num} className="relative">
              <Reveal delay={i * 80}>
                <div className="h-full rounded-2xl border border-border bg-white p-6">
                  <div className="flex items-start justify-between">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold-pale/60 text-gold-dark">
                      <step.icon className="h-5 w-5" />
                    </span>
                    <span className="font-heading text-lg italic text-gold-dark">{step.num}</span>
                  </div>
                  <h4 className="mt-4 text-base font-extrabold text-navy">{step.title}</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                </div>
              </Reveal>
              {i < PROCESS.length - 1 && (
                <span className="absolute -right-5 top-11 z-10 hidden h-8 w-8 place-items-center rounded-full border border-gold/25 bg-white text-gold lg:grid">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              )}
            </div>
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
                <span className="font-heading text-lg italic text-gold-dark">{String(i + 2).padStart(2, "0")}</span>
                <span className="mt-3 grid h-10 w-10 place-items-center rounded-lg bg-gold-pale/60 text-gold-dark">
                  <p.icon className="h-5 w-5" />
                </span>
                <h4 className="mt-4 text-base font-extrabold text-navy">{p.title}</h4>
                <p className="mt-1.5 text-sm text-muted-foreground">{p.tagline}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-gold-dark">
                  Explore {productCode(p.title)} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
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
