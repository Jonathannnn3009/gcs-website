import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  Clock,
  GraduationCap,
  Heart,
  Home,
  Calculator,
  FileText,
  Landmark,
  MessageCircle,
  Rocket,
  Smartphone,
  Store,
  UserRound,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { EarningsEstimator } from "@/components/earnings-estimator";
import { ZoneAssistant, ZoneFaq, ZoneForm, ZoneHero, ZoneTabs } from "@/components/partner-zones";
import { CONTACT } from "@/data/site";
import { ASSISTANT_NAME } from "@/lib/chat/config";

export const Route = createFileRoute("/partner/freelancer")({
  head: () => ({
    meta: [
      { title: "Freelance Associate | Growth Capital Services" },
      {
        name: "description",
        content:
          "Earn on your own time by introducing people who need a loan. No investment, no licence, no targets. We run the lending; you refer and get paid on disbursal.",
      },
      { property: "og:title", content: "Freelance Associate | Growth Capital Services" },
      {
        property: "og:description",
        content:
          "A flexible, zero-investment way to earn by connecting people with the right loan.",
      },
    ],
  }),
  component: FreelancerPage,
});

const WHO: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Home,
    title: "Homemakers",
    body: "Earn from home, around your own schedule, using people you already know.",
  },
  {
    icon: GraduationCap,
    title: "Students & fresh graduates",
    body: "A first source of income and a real look at how finance works.",
  },
  {
    icon: Landmark,
    title: "Retired bankers & professionals",
    body: "Put your reputation and years of contacts to work again, without the 9-to-5.",
  },
  {
    icon: Smartphone,
    title: "Salaried, with time to spare",
    body: "Keep your job and add a second income from evenings and weekends.",
  },
  {
    icon: Store,
    title: "Shop & small-business owners",
    body: "Customers and neighbours ask about loans all the time. Now you can help them.",
  },
  {
    icon: Heart,
    title: "Community connectors",
    body: "Society members, tutors, tailors, agents of all kinds: anyone people trust and talk to.",
  },
];

const YOU_WE: { you: string[]; we: string[] } = {
  you: [
    "Mention us when someone needs a loan",
    "Share their name, number and what they need",
    "Stay their friendly contact",
  ],
  we: [
    "Call them and check eligibility",
    "Match them to the right bank or NBFC from 75+",
    "Collect documents and follow up with the lender",
    "Keep you updated until disbursal",
  ],
};

const STEPS: { title: string; body: string }[] = [
  {
    title: "Sign up",
    body: "Fill in the short form. It takes about two minutes and costs nothing.",
  },
  {
    title: "Quick orientation",
    body: "A team member walks you through the loans we offer and exactly what to share.",
  },
  { title: "Refer", body: "Send us a name, number and requirement whenever someone needs a loan." },
  { title: "Get paid", body: "Your payout is settled once the loan is disbursed." },
];

const PERKS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Wallet,
    title: "Nothing to invest",
    body: "No joining fee, no deposit, no stock. Referring is free.",
  },
  {
    icon: Clock,
    title: "Your hours, no targets",
    body: "Refer one person a month or ten. There is no minimum and no lock-in.",
  },
  {
    icon: Check,
    title: "No licence needed",
    body: "Our experts handle the lending side, so you only make the introduction.",
  },
  {
    icon: UserRound,
    title: "A person to call",
    body: "A dedicated contact answers your questions and updates you on each case.",
  },
  {
    icon: Landmark,
    title: "75+ lenders behind you",
    body: "The people you refer get more chances of approval than at a single bank.",
  },
  {
    icon: Rocket,
    title: "Room to grow",
    body: "Referring regularly? You can step up to our Agent partnership with a fuller set-up.",
  },
];

const ASSISTANT_POINTS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Calculator,
    title: "Quick numbers for anyone you help",
    body: "Work out a person's likely EMI or loan amount on the spot, so you can answer them with confidence.",
  },
  {
    icon: FileText,
    title: "What to ask for",
    body: "See which documents and details a person needs before you pass their requirement to us.",
  },
  {
    icon: UserRound,
    title: "No finance background needed",
    body: "Ask in plain words. It explains loan terms simply, so you never have to pretend to know.",
  },
  {
    icon: MessageCircle,
    title: "Hand over to our team",
    body: "When the person is ready, the assistant passes their details to an expert and we take it from there.",
  },
];

const FAQS = [
  {
    q: "Do I need a licence, experience or any qualification?",
    a: "No. You only introduce people who need a loan. Our experts do the eligibility checks, bank matching, paperwork and follow-up.",
  },
  {
    q: "Is there any fee to join?",
    a: "No. Joining and referring are free.",
  },
  {
    q: "Can I do this alongside a job or studies?",
    a: "Yes. There are no targets, no fixed hours and no minimum, so you refer whenever it suits you.",
  },
  {
    q: "How and when do I get paid?",
    a: "Your payout is settled once the loan is disbursed. The estimator above shows an indicative range by loan type; the exact figure depends on the lender and loan amount, and we share it with you in writing when you join.",
  },
  {
    q: "What happens if the person I refer does not get a loan?",
    a: "Nothing is lost on your side. Payouts are for disbursed loans, and our team will explain to the applicant what could improve their chances.",
  },
  {
    q: "How is this different from the Agent partnership?",
    a: "The Agent route suits professionals who already advise clients (CAs, brokers, consultants) and want a deeper working relationship. The Freelance route is lighter: an easy, individual way to start earning with no business set-up.",
  },
];

function FreelancerPage() {
  return (
    <>
      <ZoneTabs current="/partner/freelancer" />

      <div id="join" className="scroll-mt-24" />
      <ZoneHero
        eyebrow="Freelance Associate"
        title={
          <>
            Earn on your own time,{" "}
            <span className="text-gold-light italic">by helping people borrow well.</span>
          </>
        }
        intro="Know someone who needs a loan? Introduce them to us. We handle everything from eligibility to disbursal, and you get paid when the loan is disbursed. No investment, no licence and no targets."
        stats={[
          { value: "₹0", label: "To Get Started" },
          { value: "No", label: "Targets or Lock-in" },
          { value: "75+", label: "Bank & NBFC Partners" },
          { value: "2017", label: "Arranging Loans Since" },
        ]}
        points={[
          "Work from anywhere, at any hour, alongside whatever else you do",
          "A short orientation call so you know exactly what to share",
          "Updates on every case you refer, until it disburses",
        ]}
        quote="You make the introduction. We do the lending, the paperwork and the follow-up."
        form={
          <ZoneForm
            source="partner-freelancer"
            heading="Become a Freelance Associate"
            intro="Share a few details and we will call you for a short orientation. It takes about two minutes."
            orgLabel="What you do today"
            orgPlaceholder="e.g. Homemaker, B.Com student, retired banker"
            messagePlaceholder="How many people do you think you could help in a month? (optional)"
            cta="Join as a Freelancer"
            thanks="A member of our team will call you for a short orientation and to set you up as a Freelance Associate."
          />
        }
      />

      {/* Who it suits */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Who It's For"
            title="If people trust you, you can do this."
            description="No business, no office, no background in finance. Just people who sometimes need a loan."
          />
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WHO.map((w, i) => (
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

      {/* Your part / our part */}
      <Section className="pt-0">
        <Reveal>
          <SectionHeading
            eyebrow="Who Does What"
            title="A small part for you. The heavy lifting is ours."
            align="center"
          />
        </Reveal>
        <div className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl border border-gold/25 bg-gold-pale/20 p-6 sm:p-7">
              <p className="text-xs font-bold tracking-[0.2em] text-gold-dark uppercase">
                Your part
              </p>
              <ul className="mt-4 space-y-3">
                {YOU_WE.you.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm text-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={90}>
            <div className="navy-panel h-full rounded-2xl p-6 sm:p-7">
              <p className="text-xs font-bold tracking-[0.2em] text-gold uppercase">Our part</p>
              <ul className="mt-4 space-y-3">
                {YOU_WE.we.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm text-white/85">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-light" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Estimator */}
      <Section className="pt-0">
        <Reveal>
          <SectionHeading
            eyebrow="What You Could Earn"
            title="Work out your own numbers."
            description="Pick a loan type, a typical amount and how many people you might help in a month."
            align="center"
          />
        </Reveal>
        <Reveal delay={80} className="mx-auto mt-10 max-w-5xl">
          <EarningsEstimator />
        </Reveal>
      </Section>

      {/* Steps */}
      <Section className="pt-0">
        <Reveal>
          <SectionHeading
            eyebrow="Getting Started"
            title="Up and running in four steps."
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

      {/* Perks */}
      <Section className="pt-0">
        <Reveal>
          <SectionHeading eyebrow="Why Join" title="What you get as an associate." />
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PERKS.map((p, i) => (
            <Reveal key={p.title} delay={i * 60}>
              <div className="group h-full rounded-2xl border border-border bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-[var(--shadow-lift)] dark:bg-card">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold-pale/60 text-gold-dark transition-colors duration-300 group-hover:bg-gold group-hover:text-navy group-hover:animate-[gcs-wiggle_600ms_ease-in-out] dark:bg-gold/15">
                  <p.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-extrabold text-navy dark:text-white">
                  {p.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <ZoneAssistant
        eyebrow={`${ASSISTANT_NAME}: your pocket guide`}
        title="Not sure how to answer? Ask our AI assistant."
        intro="You do not need to be a finance expert to help someone with a loan. Use the assistant to get quick answers, then pass the person on to us."
        points={ASSISTANT_POINTS}
        prompts={[
          {
            label: "How much loan can I get?",
            message: "I'd like to check how much home loan I may be eligible for.",
          },
          { label: "Calculate EMI", message: "Help me calculate my EMI." },
          { label: "Documents needed", message: "What documents do I need for a home loan?" },
        ]}
      />

      {/* FAQ */}
      <Section className="pt-0">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <p className="eyebrow">Before You Join</p>
            <h2 className="mt-2 text-2xl font-extrabold text-navy sm:text-3xl dark:text-white">
              Quick answers.
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
            <Rocket className="float-animation relative mx-auto h-10 w-10 text-gold-dark" />
            <h3 className="relative mt-4 font-heading text-2xl font-bold text-navy sm:text-3xl dark:text-white">
              Have questions? <span className="gold-text">Talk to a person.</span>
            </h3>
            <p className="relative mt-3 text-sm text-muted-foreground">
              {CONTACT.phone} · {CONTACT.hours}
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
