import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Timer,
  Compass,
  Sparkles,
  ArrowRight,
  Building2,
  Users,
  MapPin,
  CheckCircle2,
  Award,
  Heart,
  Lightbulb,
} from "lucide-react";
import { Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { MissionVision } from "@/components/mission-vision";
import { CONTACT } from "@/data/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Growth Capital Services | Trusted Loan Advisors Since 2017" },
      {
        name: "description",
        content:
          "Growth Capital Services, established in 2017, is a leading partnership firm offering custom-fit loan solutions from various Banks and NBFCs across Mumbai, Thane, Navi Mumbai and Pune.",
      },
      { property: "og:title", content: "About Growth Capital Services" },
      {
        property: "og:description",
        content: "Your most ethical financial partner since 2017. Leading with integrity.",
      },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  {
    icon: Heart,
    title: "Client First",
    body: "Every decision we make starts with what's best for your financial wellbeing, not ours.",
  },
  {
    icon: ShieldCheck,
    title: "Integrity",
    body: "Full transparency on rates, fees, and terms. No hidden charges, no surprises.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    body: "We continuously explore new loan schemes and fintech solutions to serve you better.",
  },
  {
    icon: Award,
    title: "Excellence",
    body: "Our dedicated team ensures speed, accuracy, and the highest quality of service.",
  },
];

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

function AboutPage() {
  return (
    <>
      {/* Hero banner */}
      <section className="relative overflow-hidden hero-light border-b border-gold/15 py-16 sm:py-24">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-gold/8 blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-gold/5 blur-[80px]"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="eyebrow">About Us</p>
            <h1 className="mt-4 text-3xl font-extrabold text-navy sm:text-5xl">
              Leading with <span className="gold-text">Integrity.</span>
            </h1>
            <p className="mt-2 text-xl font-semibold text-gold">
              Your Most Ethical Financial Partner!
            </p>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Our experienced professionals lead the way, ensuring the utmost ethical and
              transparent financial services. As Authorized Business Associates with top Banks
              and NBFCs, we're committed to your financial well-being.
            </p>
          </Reveal>
        </div>
      </section>

      {/* About content */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div>
              <p className="eyebrow">Our Story</p>
              <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                Established in <span className="gold-text-static">2017</span>
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                <strong className="text-foreground">Growth Capital Services</strong> is a leading
                partnership firm that excels in offering custom-fit loan solutions from various
                Banks and NBFCs. With a belief in creating personalized customer experiences, we
                offer a range of products including Home Loan, Loan Against Property, Business
                Loan, Personal Loan, Working Capital Loans — Term Loan, Cash Credit, Overdraft
                facility, Car Loan, Education Loan, etc.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                At Growth Capital Services we take pride in our dedicated team of professionals
                focused on delivering an effortless lending experience. We simplify the loan
                process by offering end-to-end support from choosing the right product to seamless
                documentation, legal and insurance guidance and timely disbursal.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Experience excellence with us as we navigate the lending lifecycle, providing
                unique solutions for your financial needs.
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "2017", label: "Year Established", icon: Building2 },
                { value: "45+", label: "Banking Partners", icon: Building2 },
                { value: "4", label: "Cities Served", icon: MapPin },
                { value: "₹0", label: "Advisory Fee", icon: Heart },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="group relative overflow-hidden rounded-2xl border border-gold/15 bg-white p-6 text-center transition-all duration-400 hover:-translate-y-1 hover:border-gold/30 hover:shadow-[var(--shadow-gold)]"
                >
                  <div className="absolute top-0 right-0 h-20 w-20 rounded-full bg-gold/5 blur-[30px] transition-all group-hover:bg-gold/10"></div>
                  <stat.icon className="relative mx-auto h-6 w-6 text-gold" />
                  <p className="relative mt-3 text-3xl font-extrabold text-foreground">{stat.value}</p>
                  <p className="relative mt-1 text-xs font-semibold text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Why Growth Capital */}
      <section className="bg-gradient-to-b from-background via-gold/[0.02] to-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Why Growth Capital Services"
              title="Experience financial freedom with us"
              description="Unlike banks, we prioritize your needs and secure better deals by leveraging our vast network. Trusted by our customers, we aim to become the largest firm in India."
            />
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 70}>
                <div className="surface-card group h-full p-6">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold/10 text-gold transition-all duration-400 group-hover:scale-110 group-hover:bg-gold group-hover:text-navy">
                    <p.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-extrabold">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <Section>
        <MissionVision
          mission="We are driven by a mission to foster lasting relationships with each client, aiming to deliver excellent service for years to come. Unlike many large national mortgage firms, we prioritize the security and privacy of your information, ensuring a trustworthy partnership."
          vision="Dreaming of a future without barriers, our vision is to transform financial experiences for everyone. We strive to play a crucial role in enhancing financial experience with innovation, trust and inspiration. We aim to lead and reshape the financial landscape in India."
        />
      </Section>

      {/* Values */}
      <Section className="pt-0">
        <Reveal>
          <SectionHeading
            eyebrow="Our Values"
            title="What drives us every day"
            align="center"
          />
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 70}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-gold/10 bg-white p-6 text-center transition-all duration-400 hover:-translate-y-1 hover:border-gold/25 hover:shadow-[var(--shadow-gold)]">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-navy to-navy-soft text-gold shadow-md">
                  <v.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-base font-extrabold">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Cities */}
      <Section className="pt-0">
        <Reveal>
          <div className="glass-card overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="panel-light p-8 sm:p-10">
                <MapPin className="h-7 w-7 text-gold" />
                <h3 className="mt-4 text-2xl font-extrabold">Where We Serve</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Trusted by our customers, we serve across major cities in Maharashtra
                  with digital documentation support state-wide. Our dedicated team continually
                  enhances the speed and accuracy of our services.
                </p>
              </div>
              <div className="flex items-center p-8 sm:p-10">
                <div className="grid w-full grid-cols-2 gap-4">
                  {CONTACT.cities.map((city) => (
                    <div
                      key={city}
                      className="flex items-center gap-3 rounded-xl border border-gold/15 bg-gold/[0.03] p-4"
                    >
                      <MapPin className="h-5 w-5 shrink-0 text-gold" />
                      <span className="text-sm font-bold">{city}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* CTA */}
      <Section className="pt-0">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-gold/25 panel-light p-8 sm:p-12 text-center">
            <div className="absolute top-0 right-1/4 h-60 w-60 rounded-full bg-gold/10 blur-[80px]"></div>
            <h3 className="relative text-2xl font-extrabold text-navy sm:text-3xl">
              Let's structure the right loan <span className="gold-text">for you</span>
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
                className="inline-flex items-center gap-2 rounded-md border border-navy/20 px-6 py-3.5 text-sm font-bold text-navy transition-all duration-300 hover:-translate-y-0.5 hover:border-[#25D366]/50"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
