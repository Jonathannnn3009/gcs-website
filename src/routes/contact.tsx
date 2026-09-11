import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone, ArrowRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/section";
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

const DETAILS = [
  { icon: Phone, label: "Phone", value: CONTACT.phone, href: CONTACT.phoneHref },
  { icon: Mail, label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
  { icon: MapPin, label: "Office", value: CONTACT.address },
  { icon: Clock, label: "Working Hours", value: CONTACT.hours },
];

function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden hero-light border-b border-gold/15 py-16 sm:py-20">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-gold/8 blur-[120px]"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="eyebrow">Contact Us</p>
            <h1 className="mt-4 text-3xl font-extrabold text-navy sm:text-5xl">
              Let's structure the right loan <span className="gold-text">for you</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground">
              Share your requirement and an advisor will respond with matched lender options,
              indicative rates and a clear document checklist.
            </p>
          </Reveal>
        </div>
      </section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          {/* Contact details */}
          <div className="space-y-4">
            {DETAILS.map((d, i) => (
              <Reveal key={d.label} delay={i * 70}>
                <div className="group relative overflow-hidden rounded-2xl border border-border bg-white p-5 transition-all duration-400 hover:-translate-y-1 hover:border-gold/25 hover:shadow-[var(--shadow-gold)]">
                  <div className="absolute top-0 right-0 h-16 w-16 rounded-full bg-gold/5 blur-[20px] transition-all group-hover:bg-gold/10"></div>
                  <div className="relative flex items-start gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-navy to-navy-soft text-gold shadow-md transition-all duration-400 group-hover:scale-110">
                      <d.icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold tracking-[0.18em] text-gold-dark uppercase">
                        {d.label}
                      </p>
                      {d.href ? (
                        <a
                          href={d.href}
                          className="mt-1 block text-sm font-semibold transition-colors hover:text-gold"
                        >
                          {d.value}
                        </a>
                      ) : (
                        <p className="mt-1 text-sm font-semibold">{d.value}</p>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}

            {/* WhatsApp CTA */}
            <Reveal delay={300}>
              <a
                href={CONTACT.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-[#25D366]/20 bg-[#25D366]/5 p-5 transition-all duration-400 hover:-translate-y-1 hover:border-[#25D366]/40 hover:shadow-[0_0_20px_rgba(37,211,102,0.15)]"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#25D366] text-white shadow-md transition-transform duration-400 group-hover:scale-110">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12.04 2A10 10 0 0 0 2 12.04a9.94 9.94 0 0 0 1.34 4.99L2 22l5.13-1.34A9.95 9.95 0 0 0 12.04 22 10 10 0 0 0 22 12.04 10 10 0 0 0 12.04 2zm5.82 14.12c-.24.67-1.42 1.24-1.96 1.32-.5.07-1.14.1-1.84-.12a16.84 16.84 0 0 1-1.67-.62c-2.93-1.27-4.84-4.23-4.99-4.43-.15-.2-1.2-1.6-1.2-3.06 0-1.45.76-2.17 1.03-2.46.27-.3.59-.37.79-.37.2 0 .4 0 .57.01.18.01.43-.07.67.51.24.59.83 2.02.9 2.17.07.15.12.33.02.53-.1.2-.15.33-.3.5-.15.18-.31.4-.44.53-.15.15-.3.31-.13.61.17.3.77 1.27 1.65 2.06 1.13.99 2.09 1.3 2.39 1.44.3.15.47.13.64-.07.17-.21.74-.87.94-1.17.2-.3.4-.25.67-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.35.07.12.07.72-.17 1.4z"/></svg>
                </span>
                <div>
                  <p className="text-[10px] font-bold tracking-[0.18em] text-[#25D366] uppercase">
                    WhatsApp
                  </p>
                  <p className="mt-1 text-sm font-semibold">Chat with us instantly</p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 text-[#25D366] transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </Reveal>

            {/* Map */}
            <Reveal delay={350}>
              <div className="overflow-hidden rounded-2xl border border-border">
                <iframe
                  title="Growth Capital Services Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.753!2d72.9127!3d19.0867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sGhatkopar%20West%2C%20Mumbai!5e0!3m2!1sen!2sin!4v1631000000000!5m2!1sen!2sin"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale transition-all duration-400 hover:grayscale-0"
                />
              </div>
            </Reveal>
          </div>

          {/* Lead form */}
          <Reveal delay={120}>
            <LeadForm />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
