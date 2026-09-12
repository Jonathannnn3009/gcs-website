import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Compass,
  ShieldCheck,
  Sparkles,
  Timer,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { MissionVision } from "@/components/mission-vision";
import { PAIN_POINTS, CONTACT } from "@/data/site";

export const Route = createFileRoute("/why-us")({
  head: () => ({
    meta: [
      { title: "Why Choose Growth Capital Services | Loan Advisors Since 2017" },
      {
        name: "description",
        content:
          "Trust, transparency, a paperless process and end-to-end support — how Growth Capital Services solves the real hurdles of borrowing.",
      },
      { property: "og:title", content: "Why Choose Growth Capital Services" },
      {
        property: "og:description",
        content: "Our mission, vision and the customer hurdles we remove on every loan file.",
      },
    ],
  }),
  component: WhyUsPage,
});

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Trust & Transparency",
    body: "Every quote lists rate, processing fee, legal and technical charges and foreclosure terms in writing.",
  },
  {
    icon: Timer,
    title: "Quick, Paperless Process",
    body: "Digital documentation and daily file tracking through login, sanction and disbursal.",
  },
  {
    icon: Compass,
    title: "End-to-End Guidance",
    body: "From choosing the right product to legal, insurance and post-disbursal support.",
  },
  {
    icon: Sparkles,
    title: "Better Deals Than Direct",
    body: "Our volume across banks and NBFCs earns pricing and fee waivers an individual rarely gets alone.",
  },
];

const ADVANTAGES = [
  "We compare live policies across 45+ lenders",
  "Zero advisory fee — we're paid by the lender",
  "Daily file tracking from login to disbursal",
  "Complex profiles handled that banks return",
  "Written savings comparison before you commit",
  "Single point of contact for the full lifecycle",
];

function WhyUsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden hero-light border-b border-gold/15 py-16 sm:py-20">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-gold/8 blur-[120px]"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="eyebrow">Why Choose Us</p>
            <h1 className="mt-4 text-3xl font-extrabold text-navy sm:text-5xl">
              Experience Financial Freedom <span className="gold-text">With Us</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground">
              Unlike banks, we prioritize your needs and secure better deals by leveraging our
              vast network with Banks and NBFCs. Trusted by our customers, we aim to become the
              largest firm in India, serving Mumbai, Thane, Navi Mumbai and Pune.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Pillars */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Our Strengths"
            title="Built on trust, transparency and speed"
            description="Growth Capital Services began by spotting the gaps borrowers face. Unlike banks, we work for you — leveraging a wide lender network to secure better terms."
          />
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={i * 70}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-gold/10 bg-white p-6 transition-all duration-400 hover:-translate-y-1 hover:border-gold/25 hover:shadow-[var(--shadow-gold)]">
                <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-gold/5 blur-[30px] transition-all group-hover:bg-gold/10"></div>
                <span className="relative grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-navy to-navy-soft text-gold shadow-md transition-all duration-400 group-hover:scale-110">
                  <p.icon className="h-5 w-5" />
                </span>
                <h3 className="relative mt-4 text-base font-extrabold">{p.title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Advantages section */}
      <Section className="pt-0">
        <Reveal>
          <div className="glass-card overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="panel-light p-8 sm:p-10">
                <p className="eyebrow">The Difference</p>
                <h3 className="mt-3 text-2xl font-extrabold">
                  Why Growth Capital <span className="text-gold">over going direct?</span>
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Our dedicated team continually enhances the speed and accuracy of our services,
                  exploring innovative and attractive new loan schemes to better serve you.
                </p>
              </div>
              <div className="flex items-center p-8 sm:p-10">
                <div className="space-y-3">
                  {ADVANTAGES.map((adv) => (
                    <div key={adv} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-gold" />
                      <span className="text-sm font-medium">{adv}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* Pain Points / Hurdles */}
      <Section className="pt-0">
        <Reveal>
          <SectionHeading
            eyebrow="Common Concerns"
            title="The questions we answer before you sign"
            description="These are the concerns we heard again and again. Each one is handled upfront on every file."
          />
        </Reveal>
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {PAIN_POINTS.map((p, i) => (
            <Reveal key={p.question} delay={i * 60}>
              <div className="surface-card h-full p-6">
                <h3 className="text-base font-extrabold">{p.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.answer}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Mission & Vision */}
      <Section className="pt-0">
        <MissionVision
          mission="To foster lasting relationships with each client and deliver excellent service for years to come. Unlike many large national mortgage firms, we prioritise the security and privacy of your information, ensuring a trustworthy partnership."
          vision="A future where everyone's dreams can come true without obstacles. We aim to introduce innovative ideas, foster trust, and reshape the landscape of financial solutions in India."
        />
      </Section>

      {/* CTA */}
      <Section className="pt-0">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-gold/25 panel-light p-8 sm:p-12 text-center">
            <div className="absolute top-0 right-1/4 h-60 w-60 rounded-full bg-gold/10 blur-[80px]"></div>
            <h3 className="relative text-2xl font-extrabold text-navy sm:text-3xl">
              Ready to experience the <span className="gold-text">difference?</span>
            </h3>
            <p className="relative mt-3 text-sm text-muted-foreground">
              Call {CONTACT.phone} · {CONTACT.hours}
            </p>
            <Link to="/contact" className="gold-btn relative mt-6 py-3.5 text-base">
              Talk to an Advisor <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
