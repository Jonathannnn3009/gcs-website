import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  FileCheck2,
  FileText,
  Landmark,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";
import { Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { ChecklistGate } from "@/components/checklist-gate";
import { PRODUCTS, getProduct } from "@/data/products";
import { CONTACT, waLink } from "@/data/site";

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
      <p className="mt-3 text-muted-foreground">
        It may have moved — browse the full list instead.
      </p>
      <Link to="/services" className="gold-btn mt-6 inline-flex py-3">
        View all services <ArrowRight className="h-4 w-4" />
      </Link>
    </Section>
  );
}

const PROCESS = [
  {
    num: "01",
    icon: FileText,
    title: "Tell Us What You Need",
    body: "A quick conversation about your goal and situation — no forms yet.",
  },
  {
    num: "02",
    icon: Landmark,
    title: "Lender Shortlist",
    body: "Your profile checked against our network to find who's actually likely to say yes.",
  },
  {
    num: "03",
    icon: FileCheck2,
    title: "Paperwork, Handled",
    body: "We prep the file the way this lender's underwriting desk expects to see it.",
  },
  {
    num: "04",
    icon: Check,
    title: "Funds, Then Follow-Up",
    body: "Money lands in your account — and we stay reachable well after that.",
  },
];

const CHECKLIST_PDF: Record<string, string> = {
  "home-loan": "/checklists/home-loan-checklist.pdf",
  "loan-against-property": "/checklists/loan-against-property-checklist.pdf",
  "business-loan": "/checklists/business-loan-checklist.pdf",
  "personal-loan": "/checklists/personal-loan-checklist.pdf",
};

function productCode(title: string): string {
  const skip = new Set(["against", "and", "for", "of", "the", "on"]);
  return title
    .split(/\s+/)
    .filter((w) => !skip.has(w.toLowerCase()))
    .map((w) => w.match(/[A-Za-z]/)?.[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 4);
}

function ProductDetailPage() {
  const { slug } = Route.useParams();
  const product = getProduct(slug);
  if (!product) return <NotFoundBlock />;
  const related = PRODUCTS.filter((p) => p.group === product.group && p.slug !== product.slug);
  const fallbackRelated =
    related.length > 0 ? related : PRODUCTS.filter((p) => p.slug !== product.slug).slice(0, 3);
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
                  <Link to="/" className="hover:text-white">
                    Home
                  </Link>
                  <span className="text-gold">/</span>
                  <Link to="/services" className="hover:text-white">
                    Services
                  </Link>
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

                <h1 className="relative mt-5 font-heading text-4xl font-bold text-white sm:text-5xl">
                  {product.title}
                </h1>
                <p className="relative mt-2 font-heading text-lg italic text-gold-light">
                  {product.tagline}
                </p>

                <div className="relative mt-8 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/10 pt-6">
                  {product.facts.map((fact) => (
                    <div key={fact.label}>
                      <span className="block text-[10px] font-bold tracking-wide text-white/40 uppercase">
                        {fact.label}
                      </span>
                      <span className="block text-sm font-bold text-gold-light">{fact.value}</span>
                    </div>
                  ))}
                </div>

                <div className="relative mt-8 flex flex-wrap items-center gap-5">
                  <Link to="/contact" className="gold-btn py-3.5 text-base">
                    Apply for {code} <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href={waLink(`Hi, I'd like to know more about ${product.title}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-white/70 transition-colors hover:text-white"
                  >
                    or message on WhatsApp <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              {/* At-a-glance eligibility snapshot */}
              <div className="hidden flex-col justify-center gap-5 bg-gold-pale/40 p-8 lg:flex">
                <p className="text-[10px] font-bold tracking-[0.2em] text-gold-dark uppercase">
                  At A Glance
                </p>
                <ul className="space-y-4">
                  {product.eligibility.slice(0, 3).map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" />
                      <span className="text-sm leading-snug text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* The file — one continuous dossier panel instead of several stacked cards */}
      <Section>
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          {/* LEFT: the dossier */}
          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-gold/15 bg-white">
              <div className="p-7 sm:p-9">
                <p className="eyebrow">The Short Version</p>
                <h2 className="mt-3 text-2xl font-extrabold text-navy sm:text-3xl">
                  What {product.title} actually does for you.
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  {product.about}
                </p>
              </div>

              <div className="border-t border-dashed border-border" />

              <div className="p-7 sm:p-9">
                <p className="eyebrow">What's Included</p>
                <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  {product.features.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-dashed border-border" />

              <div className="grid sm:grid-cols-2 sm:divide-x sm:divide-border">
                <div className="p-7 sm:p-9">
                  <p className="eyebrow">Do You Qualify</p>
                  <ul className="mt-5 space-y-2.5">
                    {product.eligibility.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="navy-panel p-7 sm:p-9">
                  <p className="text-[10px] font-bold tracking-[0.2em] text-gold uppercase">
                    Paperwork You'll Need
                  </p>
                  <ul className="mt-5 space-y-2.5">
                    {product.documents.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm leading-relaxed text-white/70"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-light" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  {CHECKLIST_PDF[product.slug] && (
                    <ChecklistGate
                      pdfHref={CHECKLIST_PDF[product.slug]}
                      productTitle={product.title}
                    />
                  )}
                </div>
              </div>
            </div>
          </Reveal>

          {/* RIGHT: sticky apply card */}
          <Reveal delay={100} className="lg:sticky lg:top-28">
            <div className="rounded-2xl border border-gold/15 panel-light p-7">
              <p className="text-xs font-bold tracking-[0.2em] text-gold-dark uppercase">
                Start Your File
              </p>
              <h3 className="mt-3 font-heading text-2xl font-bold text-navy">
                Apply for <span className="italic text-gold-dark">{product.title}.</span>
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                A senior advisor will call back within one business day with an indicative offer.
              </p>

              <div className="mt-6 space-y-3">
                <a
                  href={CONTACT.phoneHref}
                  className="group flex items-center gap-3 rounded-xl border border-border bg-white p-3.5 transition-colors hover:border-gold/40"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gold-pale/60 text-gold-dark">
                    <Phone className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                      Call Us
                    </span>
                    <span className="block truncate text-sm font-bold text-navy">
                      {CONTACT.phone}
                    </span>
                  </span>
                  <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-gold transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href={waLink(`Hi, I'd like to know more about ${product.title}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-xl border border-border bg-white p-3.5 transition-colors hover:border-gold/40"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gold-pale/60 text-gold-dark">
                    <MessageCircle className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                      WhatsApp
                    </span>
                    <span className="block truncate text-sm font-bold text-navy">
                      Message us now
                    </span>
                  </span>
                  <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-gold transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="group flex items-center gap-3 rounded-xl border border-border bg-white p-3.5 transition-colors hover:border-gold/40"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gold-pale/60 text-gold-dark">
                    <Mail className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                      Email
                    </span>
                    <span className="block truncate text-sm font-bold text-navy">
                      {CONTACT.email}
                    </span>
                  </span>
                  <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-gold transition-transform group-hover:translate-x-1" />
                </a>
              </div>

              <Link
                to="/contact"
                className="mt-4 flex items-center justify-center rounded-xl bg-navy py-3.5 text-sm font-bold text-white transition-colors hover:bg-navy-soft"
              >
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
          <SectionHeading
            eyebrow="Our Process"
            title="From first conversation to disbursal."
            align="center"
          />
        </Reveal>
        <div className="relative mt-14">
          <span
            aria-hidden
            className="absolute top-5 right-[10%] left-[10%] hidden h-0.5 bg-gold/20 lg:block"
          />
          <ol className="relative grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((step, i) => (
              <Reveal key={step.num} delay={i * 80}>
                <li className="text-center">
                  <span className="relative z-10 mx-auto grid h-10 w-10 place-items-center rounded-full border-2 border-gold bg-white text-gold-dark">
                    <step.icon className="h-4 w-4" />
                  </span>
                  <h4 className="mt-4 text-base font-extrabold text-navy">{step.title}</h4>
                  <p className="mx-auto mt-1.5 max-w-[15rem] text-sm leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      {/* Related products */}
      <Section className="pt-0">
        <Reveal>
          <SectionHeading
            eyebrow="Worth Comparing"
            title={`The rest of ${product.group}`}
            description={`So you can weigh ${product.title} against everything else we arrange in this category before deciding.`}
          />
        </Reveal>
        <div className="mt-8 border-t border-border">
          {fallbackRelated.map((p, i) => (
            <Reveal key={p.slug} delay={i * 60}>
              <Link
                to="/services/$slug"
                params={{ slug: p.slug }}
                className="group flex items-center gap-4 border-b border-border py-5"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-gold-pale/60 text-gold-dark transition-colors duration-300 group-hover:bg-gold group-hover:text-navy">
                  <p.icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-extrabold text-navy">{p.title}</span>
                  <span className="block text-sm text-muted-foreground">{p.tagline}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-gold transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200} className="mt-6 text-center">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm font-bold text-navy hover:text-gold-dark"
          >
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
              Still deciding on {product.title}? <span className="gold-text">Ask us directly.</span>
            </h3>
            <p className="relative mt-3 text-sm text-muted-foreground">
              Call {CONTACT.phone} · {CONTACT.hours}
            </p>
            <div className="relative mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/contact" className="gold-btn py-3.5 text-base">
                Get Free Consultation <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={waLink(`Hi, I'd like to know more about ${product.title}.`)}
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
