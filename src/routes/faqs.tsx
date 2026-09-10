import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { FAQS, CONTACT } from "@/data/site";

export const Route = createFileRoute("/faqs")({
  head: () => ({
    meta: [
      { title: "Loan FAQs | Growth Capital Services Mumbai" },
      {
        name: "description",
        content:
          "Answers on documents, sanction timelines, balance transfer, CIBIL scores and foreclosure charges from Growth Capital Services.",
      },
      { property: "og:title", content: "Loan FAQs | Growth Capital Services" },
      {
        property: "og:description",
        content: "Common questions about home, business and personal loans answered clearly.",
      },
    ],
  }),
  component: FaqsPage,
});

function FaqsPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy via-navy-soft to-navy py-16 sm:py-20">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-gold/8 blur-[120px]"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="eyebrow">FAQs</p>
            <h1 className="mt-4 text-3xl font-extrabold text-white sm:text-5xl">
              Questions We Answer <span className="gold-text">Every Day</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base text-white/70">
              Straight answers on documentation, timelines, pricing and eligibility.
            </p>
          </Reveal>
        </div>
      </section>

      <Section>
        <div className="grid gap-3 lg:grid-cols-2">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={i * 40}>
                <div
                  className={`overflow-hidden rounded-2xl border bg-white transition-all duration-400 ${
                    isOpen
                      ? "border-gold/25 shadow-[var(--shadow-gold)]"
                      : "border-border hover:border-gold/15"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="text-sm font-bold sm:text-base">{item.q}</span>
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg transition-all duration-400 ${
                        isOpen
                          ? "bg-gold text-navy rotate-180"
                          : "bg-secondary text-gold"
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 pb-5">
                        <div className="h-px w-full bg-gold/10 mb-4"></div>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* CTA */}
      <Section className="pt-0">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy via-navy-soft to-navy p-8 sm:p-12">
            <div className="absolute top-0 right-1/4 h-60 w-60 rounded-full bg-gold/10 blur-[80px]"></div>
            <div className="relative">
              <h3 className="text-2xl font-extrabold text-white sm:text-3xl">
                Still have a <span className="gold-text">question?</span>
              </h3>
              <p className="mt-2 max-w-xl text-sm text-white/70">
                Talk to an advisor directly on {CONTACT.phone}, {CONTACT.hours}.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/contact" className="gold-btn py-3.5 text-base">
                  Ask an Advisor <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={CONTACT.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-white/20 px-6 py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="#25D366"><path d="M12.04 2A10 10 0 0 0 2 12.04a9.94 9.94 0 0 0 1.34 4.99L2 22l5.13-1.34A9.95 9.95 0 0 0 12.04 22 10 10 0 0 0 22 12.04 10 10 0 0 0 12.04 2zm5.82 14.12c-.24.67-1.42 1.24-1.96 1.32-.5.07-1.14.1-1.84-.12a16.84 16.84 0 0 1-1.67-.62c-2.93-1.27-4.84-4.23-4.99-4.43-.15-.2-1.2-1.6-1.2-3.06 0-1.45.76-2.17 1.03-2.46.27-.3.59-.37.79-.37.2 0 .4 0 .57.01.18.01.43-.07.67.51.24.59.83 2.02.9 2.17.07.15.12.33.02.53-.1.2-.15.33-.3.5-.15.18-.31.4-.44.53-.15.15-.3.31-.13.61.17.3.77 1.27 1.65 2.06 1.13.99 2.09 1.3 2.39 1.44.3.15.47.13.64-.07.17-.21.74-.87.94-1.17.2-.3.4-.25.67-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.35.07.12.07.72-.17 1.4z"/></svg>
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
