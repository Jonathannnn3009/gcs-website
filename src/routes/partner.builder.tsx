import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  Check,
  ClipboardCheck,
  Handshake,
  Landmark,
  LayoutDashboard,
  Calculator,
  MessageCircle,
  Network,
  Clock,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { BankMarquee } from "@/components/bank-marquee";
import { ZoneAssistant, ZoneFaq, ZoneForm, ZoneHero, ZoneTabs } from "@/components/partner-zones";
import { CONTACT } from "@/data/site";
import { ASSISTANT_NAME } from "@/lib/chat/config";

export const Route = createFileRoute("/partner/builder")({
  head: () => ({
    meta: [
      { title: "Builder Partner | Growth Capital Services" },
      {
        name: "description",
        content:
          "Home-loan support for builders and developers: lender coordination, project approvals and buyer loans handled through one desk, from booking to disbursal.",
      },
      { property: "og:title", content: "Builder Partner | Growth Capital Services" },
      {
        property: "og:description",
        content: "Turn bookings into disbursals with one finance desk and 75+ banks and NBFCs.",
      },
    ],
  }),
  component: BuilderPage,
});

const WHAT_WE_DO: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: ClipboardCheck,
    title: "Project approvals with lenders",
    body: "We take your project through lender approval so buyers can be financed without delay.",
  },
  {
    icon: Landmark,
    title: "One desk, many lenders",
    body: "Each buyer is matched to the bank or NBFC that suits their profile, instead of a single option.",
  },
  {
    icon: LayoutDashboard,
    title: "Tracked file by file",
    body: "Every buyer's loan is tracked in our in-house CRM, with status your sales team can ask for any time.",
  },
  {
    icon: Users,
    title: "Help on the ground",
    body: "Document collection and follow-ups handled by our team, so your sales staff can keep selling.",
  },
];

const FOR_BUILDERS = [
  "One point of contact for every lender, with no juggling of banks and agents",
  "A clear status on each buyer's loan, from login to sanction to disbursal",
  "A finance executive at your sales office when a launch needs one",
  "Lender approvals for your project managed across banks in one place",
];

const STEPS: { title: string; body: string }[] = [
  {
    title: "Share your project",
    body: "Tell us about the project, its stage, the units on offer and how you sell.",
  },
  {
    title: "We line up the lenders",
    body: "We approach suitable banks and NBFCs for project approval and buyer financing.",
  },
  {
    title: "Buyers get their loans",
    body: "Your buyers are guided from eligibility to sanction by one named advisor.",
  },
  {
    title: "Disbursals follow your milestones",
    body: "We track each file so releases line up with your construction and collection schedule.",
  },
];

const WHY: { title: string; body: string }[] = [
  {
    title: "Support from project approval to disbursal",
    body: "The paperwork around lender approval and the buyers' loans sits with one team, so nothing falls between desks.",
  },
  {
    title: "An independent view across lenders",
    body: "We are not tied to a single bank, so each buyer is steered to the lender most likely to say yes on good terms.",
  },
  {
    title: "Your sales team stays on sales",
    body: "Eligibility questions, document lists and bank follow-ups come to us, not to your booking desk.",
  },
  {
    title: "Works with how you already sell",
    body: "We coordinate with your sales team, your CRM contacts and your channel partners rather than asking you to change anything.",
  },
  {
    title: "Zero advisory fee to your buyers",
    body: "Buyers are not charged for our advice, which helps conversions and keeps goodwill high.",
  },
];

const MODELS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Handshake,
    title: "Direct",
    body: "We deal with your buyers directly once they book, and keep your team informed.",
  },
  {
    icon: Network,
    title: "Channel-partner led",
    body: "Your channel partners bring the buyer; we run the loan and keep everyone updated.",
  },
  {
    icon: Building2,
    title: "Hybrid",
    body: "A mix of both, set up project by project to fit how each launch is sold.",
  },
];

const ASSISTANT_POINTS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Clock,
    title: "Answers at any hour",
    body: "Buyers get replies on loans, documents and rates when they are browsing, not only in office hours.",
  },
  {
    icon: Calculator,
    title: "Instant eligibility and EMI",
    body: "A buyer can see a likely loan amount and monthly EMI in a minute, before they visit your site office.",
  },
  {
    icon: MessageCircle,
    title: "A straight line to an advisor",
    body: "When a buyer wants a call, the request reaches our team with a short summary of the chat.",
  },
  {
    icon: LayoutDashboard,
    title: "Tracked in our CRM",
    body: "Each enquiry becomes a file in our CRM, so the follow-up is never lost between your sales desk and ours.",
  },
];

const FAQS = [
  {
    q: "How can Growth Capital Services help a builder?",
    a: "We simplify buyer financing: lender coordination, project approvals, loan processing for each buyer and follow-up with the banks, all through one desk.",
  },
  {
    q: "Which loans can you arrange for my buyers?",
    a: "Home loans for ready and under-construction flats, plot and construction loans, and loan against property where a buyer is raising funds against another asset. Offers come from 75+ banks and NBFCs.",
  },
  {
    q: "Do you support project approvals with banks?",
    a: "Yes. We help you prepare and take the project through lender approval so that buyers can be financed against it. Which banks approve a project depends on the project's papers and each lender's own policy.",
  },
  {
    q: "Can you work alongside our sales team and channel partners?",
    a: "Yes. We coordinate with your sales team and channel partners, and share status on each buyer's file so nobody has to chase.",
  },
  {
    q: "Is there a cost to the builder or the buyer?",
    a: "There is no advisory fee for buyers. Talk to us about how we work with builders and we will share the arrangement in writing before anything begins.",
  },
];

function BuilderPage() {
  return (
    <>
      <ZoneTabs current="/partner/builder" />

      <ZoneHero
        eyebrow="Builder Partner"
        title={
          <>
            Turn your bookings <span className="text-gold-light italic">into disbursals.</span>
          </>
        }
        intro="Give your buyers a smoother route from booking to possession. One finance desk handles lenders, approvals and buyer loans, so your team can stay focused on selling."
        stats={[
          { value: "75+", label: "Bank & NBFC Partners" },
          { value: "2017", label: "Arranging Loans Since" },
          { value: "1", label: "Point of Contact" },
          { value: "₹0", label: "Advisory Fee to Buyers" },
        ]}
        points={[
          "Lender coordination without juggling banks and agents",
          "Every buyer's loan tracked from login to disbursal",
          "Flexible set-up: direct, channel-partner led or hybrid",
        ]}
        quote="You build the homes. We help your buyers finance them."
        form={
          <ZoneForm
            source="partner-builder"
            heading="Talk to our project finance desk"
            intro="Tell us about your project and we will call you to plan how buyer financing can work for it."
            orgLabel="Company / Project"
            orgPlaceholder="e.g. Sai Developers, Sai Heights"
            messagePlaceholder="Stage of the project, number of units, city…"
            cta="Request a Call"
            thanks="Our project finance team will reach out to discuss your project and how we can support your buyers."
          />
        }
      />

      {/* What we do */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="What We Do"
            title="One operating desk between builders, buyers and lenders."
            description="We bridge developers, home buyers and banks, so your buyers' home-loan journey has one place to start and one team to ask."
          />
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {WHAT_WE_DO.map((w, i) => (
            <Reveal key={w.title} delay={i * 60}>
              <div className="group h-full rounded-2xl border border-border bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-[var(--shadow-lift)] dark:bg-card">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold-pale/60 text-gold-dark transition-colors duration-300 group-hover:bg-gold group-hover:text-navy group-hover:animate-[gcs-wiggle_600ms_ease-in-out] dark:bg-gold/15">
                  <w.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-extrabold text-navy dark:text-white">
                  {w.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{w.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* For builders */}
      <Section className="pt-0">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <Reveal>
            <SectionHeading
              eyebrow="Growth Capital for Builders"
              title="Built to help you scale, with full visibility."
              description="Our model keeps financing out of your way, so you can concentrate on building good projects."
            />
            <ul className="mt-6 space-y-3">
              {FOR_BUILDERS.map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm text-foreground">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold-pale/80 text-gold-dark dark:bg-gold/15">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={80}>
            <img
              src="/brand/partner-presenting-growth.png"
              alt="An advisor presenting growth to a builder"
              className="w-full rounded-3xl object-cover"
            />
          </Reveal>
        </div>
      </Section>

      {/* Lenders */}
      <Section className="pt-0">
        <Reveal>
          <SectionHeading
            eyebrow="Our Lending Partners"
            title="Your buyers get more than one bank to choose from."
            align="center"
          />
        </Reveal>
        <Reveal delay={80}>
          <div className="mt-10">
            <BankMarquee />
          </div>
        </Reveal>
      </Section>

      {/* How it works */}
      <Section className="pt-0">
        <Reveal>
          <SectionHeading
            eyebrow="How It Works"
            title="From launch to disbursal, in four steps."
            align="center"
          />
        </Reveal>
        <div className="relative mt-12">
          <span
            aria-hidden
            className="absolute top-5 right-[10%] left-[10%] hidden h-0.5 bg-gold/20 lg:block"
          />
          <ol className="relative grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 80}>
                <li className="text-center">
                  <span className="relative z-10 mx-auto grid h-10 w-10 place-items-center rounded-full border-2 border-gold bg-white text-sm font-extrabold text-gold-dark dark:bg-card">
                    {i + 1}
                  </span>
                  <h4 className="mt-4 text-base font-extrabold text-navy dark:text-white">
                    {s.title}
                  </h4>
                  <p className="mx-auto mt-1.5 max-w-[16rem] text-sm leading-relaxed text-muted-foreground">
                    {s.body}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      {/* Why us */}
      <Section className="pt-0">
        <Reveal>
          <SectionHeading
            eyebrow="Why Choose Us"
            title="More than another channel of agents."
            description="Technology tracking, hands-on support and a wide lender panel, working as one team for your project."
          />
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WHY.map((w, i) => (
            <Reveal key={w.title} delay={i * 60}>
              <div className="h-full rounded-2xl border border-border bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[var(--shadow-card)] dark:bg-card">
                <h3 className="text-base font-extrabold text-navy dark:text-white">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <ZoneAssistant
        eyebrow={`${ASSISTANT_NAME}: the GCS advantage`}
        title="Buyer questions answered without loading your sales team."
        intro="Our AI assistant takes the first round of a buyer's loan questions, then hands over to an advisor when they are ready to move."
        points={ASSISTANT_POINTS}
        prompts={[
          {
            label: "Check eligibility",
            message: "I'd like to check how much home loan I may be eligible for.",
          },
          {
            label: "How do I know a project is bank-approved?",
            message: "How do I check whether a housing project is bank-approved?",
          },
          { label: "Documents needed", message: "What documents do I need for a home loan?" },
        ]}
      />

      {/* Working models */}
      <Section className="pt-0">
        <Reveal>
          <SectionHeading
            eyebrow="Ways to Work Together"
            title="Pick the set-up that fits your sales."
            align="center"
          />
        </Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {MODELS.map((m, i) => (
            <Reveal key={m.title} delay={i * 70}>
              <div className="group h-full rounded-2xl border border-gold/20 bg-gold-pale/20 p-6 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-[var(--shadow-lift)]">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white text-gold-dark ring-1 ring-gold/25 transition-colors duration-300 group-hover:bg-gold group-hover:text-navy group-hover:animate-[gcs-wiggle_600ms_ease-in-out] dark:bg-card">
                  <m.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-base font-extrabold text-navy dark:text-white">
                  {m.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{m.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section className="pt-0">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <p className="eyebrow">Before You Reach Out</p>
            <h2 className="mt-2 text-2xl font-extrabold text-navy sm:text-3xl dark:text-white">
              Quick answers for builders.
            </h2>
          </Reveal>
          <Reveal delay={80} className="mt-6">
            <ZoneFaq items={FAQS} />
          </Reveal>
        </div>
      </Section>

      {/* CTA */}
      <Section className="pt-0">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-gold/25 panel-light p-8 text-center sm:p-12">
            <div className="absolute top-0 right-1/4 h-60 w-60 rounded-full bg-gold/10 blur-[80px]" />
            <Building2 className="float-animation relative mx-auto h-10 w-10 text-gold-dark" />
            <h3 className="relative mt-4 font-heading text-2xl font-bold text-navy sm:text-3xl dark:text-white">
              Let's enable financing <span className="gold-text">for your project.</span>
            </h3>
            <p className="relative mt-3 text-sm text-muted-foreground">
              Call {CONTACT.phone} · {CONTACT.hours}
            </p>
            <div className="relative mt-6 flex flex-wrap justify-center gap-3">
              <a href={CONTACT.phoneHref} className="gold-btn py-3.5 text-base">
                Call Us <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={CONTACT.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="outline-btn dark:bg-card dark:text-white"
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
