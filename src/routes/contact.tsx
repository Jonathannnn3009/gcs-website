import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ChevronDown, Clock, Mail, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import { Section } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { LeadForm } from "@/components/lead-form";
import { CONTACT } from "@/data/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Free Loan Consultation | Growth Capital Services" },
      {
        name: "description",
        content:
          "Call +91 88280 01700 or send a loan enquiry. Growth Capital Services, Ghatkopar West, Mumbai. Monday to Saturday, 10 AM to 6 PM.",
      },
      { property: "og:title", content: "Contact Growth Capital Services" },
      {
        property: "og:description",
        content: "Free expert consultation on home, business, property and personal loans.",
      },
    ],
  }),
  component: ContactPage,
});

const BENEFITS = [
  "Callback from a senior advisor within one business day",
  "Indicative offer & lender shortlist within 48 hours",
  "Zero upfront fees — we're paid only on disbursal",
  "Full confidentiality on profile, file and amount",
];

const REACH_METHODS = [
  { icon: Phone, label: "Phone", value: CONTACT.phone, sub: CONTACT.hours, href: CONTACT.phoneHref },
  { icon: MessageCircle, label: "WhatsApp", value: "Message us on WhatsApp", sub: "Usually within 15 minutes", href: CONTACT.whatsappLink },
  { icon: Mail, label: "Email", value: CONTACT.email, sub: "For documents & structured queries", href: `mailto:${CONTACT.email}` },
];

const CONTACT_FAQS = [
  { q: "How long until I hear back?", a: "A senior advisor typically calls back within one business day, with an indicative offer following shortly after." },
  { q: "Are there any upfront charges?", a: "No advisory fee for customers — we're paid by the lender only on successful disbursal." },
  { q: "Can you help if my application was rejected elsewhere?", a: "Often, yes. We review why it was declined and place the file with a lender better suited to the profile." },
  { q: "Do you offer in-person consultations?", a: "Yes, by appointment at our Ghatkopar West office, Monday to Saturday." },
];

function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white">
      {CONTACT_FAQS.map((f, i) => (
        <div key={f.q}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
          >
            <span className="text-sm font-bold text-navy">{f.q}</span>
            <ChevronDown className={`h-4 w-4 shrink-0 text-gold transition-transform duration-300 ${open === i ? "rotate-180" : ""}`} />
          </button>
          {open === i && (
            <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function ContactPage() {
  return (
    <>
      {/* Split hero: navy intro + form */}
      <section className="bg-bg-light py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 lg:grid-cols-2">
            <Reveal>
              <div className="navy-panel relative flex h-full flex-col overflow-hidden rounded-3xl p-8 sm:p-10">
                <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-gold/10 blur-[100px]" />
                <p className="relative text-xs font-bold tracking-[0.2em] text-gold uppercase">Get In Touch</p>
                <h1 className="relative mt-3 font-heading text-3xl font-bold text-white sm:text-4xl">
                  Let's structure <span className="italic text-gold-light">your file.</span>
                </h1>
                <p className="relative mt-4 text-sm leading-relaxed text-white/65">
                  Tell us what you're trying to do — refinance, expand, unlock value from a property, or
                  push a file another bank has rejected. We'll come back with an indicative number and a
                  pre-approval check.
                </p>

                <ul className="relative mt-6 space-y-2.5">
                  {BENEFITS.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-white/75">
                      <span className="mt-0.5 text-gold-light">✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="relative mt-7 flex flex-wrap items-center gap-5">
                  <a href={CONTACT.phoneHref} className="gold-btn py-3">
                    <Phone className="h-4 w-4" /> {CONTACT.phone}
                  </a>
                  <a
                    href={CONTACT.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-white/70 transition-colors hover:text-white"
                  >
                    or message us on WhatsApp <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>

                <div className="relative mt-auto pt-8">
                  <p className="font-heading text-base italic leading-relaxed text-white/80">
                    "We don't hand your file to a call centre. A senior advisor reads it, structures it,
                    and stays with it until disbursal."
                  </p>
                  <p className="mt-2 text-[11px] font-bold tracking-[0.18em] text-gold-light uppercase">
                    — The Growth Capital Services Team
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <LeadForm />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Reach us directly */}
      <Section>
        <Reveal>
          <p className="eyebrow text-center">Reach Us Directly</p>
          <h2 className="mt-2 text-center text-2xl font-extrabold text-navy sm:text-3xl">
            Three ways to start a conversation.
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {REACH_METHODS.map((m, i) => (
            <Reveal key={m.label} delay={i * 80}>
              <a
                href={m.href}
                target={m.label === "Phone" ? undefined : "_blank"}
                rel={m.label === "Phone" ? undefined : "noopener noreferrer"}
                className="group flex h-full flex-col rounded-2xl border border-border bg-white p-6 transition-all hover:-translate-y-1 hover:border-gold/40 hover:shadow-[var(--shadow-gold)]"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold-pale/60 text-gold-dark">
                  <m.icon className="h-5 w-5" />
                </span>
                <p className="mt-4 text-[10px] font-bold tracking-[0.18em] text-gold-dark uppercase">{m.label}</p>
                <p className="mt-1 text-sm font-bold text-navy">{m.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{m.sub}</p>
              </a>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Visit our office */}
      <Section className="pt-0">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Visit Our Office</p>
            <h2 className="mt-2 text-2xl font-extrabold text-navy sm:text-3xl">
              Our Office in <span className="gold-text-static italic">Ghatkopar West.</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Our advisory team is based at CCTV Towers on the Andheri-Ghatkopar Road, accessible to
              clients across the western suburbs. Visit by appointment for a structured file review.
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg navy-panel text-gold-light">
                  <MapPin className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[10px] font-bold tracking-[0.18em] text-gold-dark uppercase">Address</p>
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
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://maps.google.com/?q=CCTV+Towers+Andheri+Ghatkopar+Road+Ghatkopar+West+Mumbai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-navy px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-navy-soft"
              >
                <Navigation className="h-4 w-4" /> Get directions
              </a>
              <a
                href={CONTACT.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-navy/20 px-5 py-3 text-sm font-bold text-navy transition-colors hover:border-gold/40"
              >
                Book an appointment
              </a>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="overflow-hidden rounded-2xl border border-border">
              <iframe
                title="Growth Capital Services Office Location"
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

      {/* FAQ */}
      <Section className="pt-0">
        <Reveal>
          <p className="eyebrow text-center">Before You Write</p>
          <h2 className="mt-2 text-center text-2xl font-extrabold text-navy sm:text-3xl">Quick answers.</h2>
        </Reveal>
        <Reveal delay={100} className="mx-auto mt-8 max-w-2xl">
          <FaqAccordion />
        </Reveal>
      </Section>
    </>
  );
}
