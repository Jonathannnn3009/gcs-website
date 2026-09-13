import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Building2, ChevronDown, Clock, MapPin, Phone } from "lucide-react";
import { Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { PRODUCT_GROUPS, PRODUCTS } from "@/data/products";
import { CONTACT } from "@/data/site";
import type { LocationContent } from "@/data/locations";

function FaqAccordion({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white">
      {faqs.map((f, i) => (
        <div key={f.q}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
          >
            <span className="text-sm font-bold text-navy">{f.q}</span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-gold transition-transform duration-300 ${open === i ? "rotate-180" : ""}`}
            />
          </button>
          {open === i && (
            <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export function LocationPage({ location }: { location: LocationContent }) {
  const otherCities = CONTACT.cities.filter((c) => c !== location.city);
  const citySlug = (c: string) => c.toLowerCase().replace(/\s+/g, "-");

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden hero-light border-b border-gold/15 py-14 sm:py-20">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-gold/8 blur-[120px]"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              <Link to="/" className="hover:text-navy">Home</Link>
              <span className="text-gold">/</span>
              <span className="text-navy">{location.city}</span>
            </p>
            <p className="eyebrow mt-5">Loan Advisory in {location.city}</p>
            <h1 className="mt-3 text-3xl font-extrabold text-navy sm:text-5xl">
              Trusted Loan Advisors in <span className="gold-text">{location.city}.</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              {location.intro}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/contact" className="gold-btn py-3.5 text-base">
                Check Eligibility <ArrowRight className="h-4 w-4" />
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
          </Reveal>
        </div>
      </section>

      {/* How we serve this city */}
      <Section>
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="eyebrow">
              {location.hasOffice ? "Our Office" : "How We Serve You Here"}
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-navy sm:text-3xl">
              {location.hasOffice
                ? "Visit us, or handle everything remotely."
                : `${location.city}, without a branch counter.`}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{location.serviceNote}</p>

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg navy-panel text-gold-light">
                  <MapPin className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[10px] font-bold tracking-[0.18em] text-gold-dark uppercase">
                    {location.hasOffice ? "Address" : "Registered Office"}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-navy">{CONTACT.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg navy-panel text-gold-light">
                  <Clock className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[10px] font-bold tracking-[0.18em] text-gold-dark uppercase">Hours</p>
                  <p className="mt-0.5 text-sm font-semibold text-navy">{CONTACT.hours}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg navy-panel text-gold-light">
                  <Phone className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[10px] font-bold tracking-[0.18em] text-gold-dark uppercase">Call or WhatsApp</p>
                  <a href={CONTACT.phoneHref} className="mt-0.5 block text-sm font-semibold text-navy hover:text-gold-dark">
                    {CONTACT.phone}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="overflow-hidden rounded-2xl border border-border">
              <iframe
                title={`Growth Capital Services — serving ${location.city}`}
                src="https://www.google.com/maps?q=CCTV+Towers+Andheri+Ghatkopar+Road+Ghatkopar+West+Mumbai&output=embed"
                width="100%"
                height="360"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Loans we arrange */}
      <Section className="pt-0">
        <Reveal>
          <SectionHeading
            eyebrow={`Loans We Arrange in ${location.city}`}
            title="The same 45+ lender network, wherever you're based."
            description={`Every product below is available to ${location.city} clients through the same process — profile review, lender matching, documentation and disbursal.`}
          />
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCT_GROUPS.map((group, i) => {
            const first = PRODUCTS.find((p) => p.group === group.name);
            if (!first) return null;
            return (
              <Reveal key={group.name} delay={i * 60}>
                <Link
                  to="/services/$slug"
                  params={{ slug: first.slug }}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-white p-6 transition-all hover:-translate-y-1 hover:border-gold/40 hover:shadow-[var(--shadow-lift)]"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-gold-pale/60 text-gold-dark">
                    <Building2 className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-extrabold text-navy">{group.name}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{group.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-gold-dark">
                    Explore products
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* FAQ */}
      <Section className="pt-0">
        <Reveal>
          <p className="eyebrow text-center">{location.city} FAQs</p>
          <h2 className="mt-2 text-center text-2xl font-extrabold text-navy sm:text-3xl">
            Common questions from {location.city} clients.
          </h2>
        </Reveal>
        <Reveal delay={100} className="mx-auto mt-8 max-w-2xl">
          <FaqAccordion faqs={location.faqs} />
        </Reveal>
      </Section>

      {/* Also serving */}
      <Section className="pt-0">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-gold/25 panel-light p-8 text-center sm:p-12">
            <div className="absolute top-0 right-1/4 h-60 w-60 rounded-full bg-gold/10 blur-[80px]"></div>
            <h3 className="relative font-heading text-2xl font-bold text-navy sm:text-3xl">
              Ready to talk? <span className="gold-text">Let's start.</span>
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
            <p className="relative mt-6 text-xs text-muted-foreground">
              Also serving{" "}
              {otherCities.map((c, i) => (
                <span key={c}>
                  <Link to={`/${citySlug(c)}`} className="font-bold text-gold-dark hover:underline">
                    {c}
                  </Link>
                  {i < otherCities.length - 1 ? " · " : ""}
                </span>
              ))}
            </p>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
