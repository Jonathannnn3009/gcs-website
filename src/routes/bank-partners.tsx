import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { BankMarquee } from "@/components/bank-marquee";
import { BankLogoGrid } from "@/components/bank-logo-grid";
import { CONTACT } from "@/data/site";

export const Route = createFileRoute("/bank-partners")({
  head: () => ({
    meta: [
      { title: "Our Bank & NBFC Partners | Growth Capital Services" },
      {
        name: "description",
        content:
          "HDFC, ICICI, SBI, Axis, Kotak, Bajaj Finserv, Tata Capital and more — the lender network behind every Growth Capital Services sanction.",
      },
      { property: "og:title", content: "Our Bank & NBFC Partners" },
      {
        property: "og:description",
        content: "A wide network of banks and NBFCs competing for your loan file.",
      },
    ],
  }),
  component: PartnersPage,
});

function PartnersPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy via-navy-soft to-navy py-16 sm:py-20">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-gold/8 blur-[120px]"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="eyebrow">Our Network</p>
            <h1 className="mt-4 text-3xl font-extrabold text-white sm:text-5xl">
              Banks in Our <span className="gold-text">Network</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base text-white/70">
              We partner with major Banks and NBFCs to ensure you secure the best deals
              effortlessly. Enjoy a seamless loan process with zero hassle — guaranteed.
            </p>
            <div className="mt-6 flex items-center gap-6">
              <div>
                <span className="text-3xl font-extrabold text-gold">45+</span>
                <span className="ml-2 text-sm text-white/50">Banking Partners</span>
              </div>
              <div className="h-8 w-px bg-white/15"></div>
              <div>
                <span className="text-3xl font-extrabold text-gold">₹500 Cr+</span>
                <span className="ml-2 text-sm text-white/50">Disbursed</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Marquee */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Scrolling View"
            title="Our banking partners at a glance"
            description="Multiple lenders review your file, so you get a genuine comparison on rate, fees and turnaround."
            align="center"
          />
        </Reveal>
        <Reveal delay={80}>
          <div className="mt-10">
            <BankMarquee />
          </div>
        </Reveal>
      </Section>

      {/* Full Grid */}
      <Section className="pt-0">
        <Reveal>
          <SectionHeading
            eyebrow="Complete Network"
            title="All our banking & NBFC partners"
            align="center"
          />
        </Reveal>
        <Reveal delay={80}>
          <div className="mt-10">
            <BankLogoGrid />
          </div>
        </Reveal>
      </Section>

      {/* CTA */}
      <Section className="pt-0">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy via-navy-soft to-navy p-8 sm:p-10">
            <div className="absolute top-0 right-0 h-60 w-60 rounded-full bg-gold/10 blur-[80px]"></div>
            <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-2xl font-extrabold text-white">
                  Not sure which lender <span className="gold-text">fits you?</span>
                </h3>
                <p className="mt-2 text-sm text-white/70">
                  We shortlist the two or three that suit your profile and pricing.
                </p>
              </div>
              <div className="flex gap-3">
                <Link to="/contact" className="gold-btn">
                  Compare My Options <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
