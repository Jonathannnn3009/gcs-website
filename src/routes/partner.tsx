import { createFileRoute } from "@tanstack/react-router";
import { useId, useState } from "react";
import {
  Award,
  ArrowRight,
  Briefcase,
  Building2,
  Calendar,
  Check,
  ChevronDown,
  Compass,
  FileText,
  Handshake,
  Landmark,
  PhoneCall,
  Scale,
  ShieldCheck,
  UserCheck,
  Wallet,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Section, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { CONTACT } from "@/data/site";
import { submitLead } from "@/lib/leads";

export const Route = createFileRoute("/partner")({
  head: () => ({
    meta: [
      { title: "Partner With Us | Growth Capital Services" },
      {
        name: "description",
        content:
          "Refer loan clients to Growth Capital Services and earn on every disbursal. No investment, no license required — built for CAs, property consultants, brokers, insurance advisors and business consultants.",
      },
      { property: "og:title", content: "Partner With Growth Capital Services" },
      {
        property: "og:description",
        content: "A referral channel for professionals whose clients occasionally need a loan.",
      },
    ],
  }),
  component: PartnerPage,
});

const PARTNER_STATS = [
  { value: "2017", label: "Growth Capital Since" },
  { value: "75+", label: "Bank & NBFC Partners" },
  { value: "₹0", label: "Investment Required" },
  { value: "No Cap", label: "On Referral Earnings" },
];

const SEGMENTS = [
  {
    icon: Scale,
    title: "Chartered Accountants",
    body: "Your clients ask you about loans already — send us the ones that need one.",
  },
  {
    icon: Building2,
    title: "Property Consultants",
    body: "Every property deal has a financing question somewhere in it.",
  },
  {
    icon: Landmark,
    title: "Real Estate Brokers",
    body: "Help your buyer close faster with financing lined up in parallel.",
  },
  {
    icon: ShieldCheck,
    title: "Insurance Advisors",
    body: "A natural extension of the financial conversations you're already having.",
  },
  {
    icon: Briefcase,
    title: "Business Consultants",
    body: "Working capital and business loan needs come up constantly in your work.",
  },
  {
    icon: UserCheck,
    title: "Lawyers & Company Secretaries",
    body: "Refer clients navigating property, business or personal finance decisions.",
  },
];

const STEPS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: FileText,
    title: "Tell Us About the Client",
    body: "Share their name, contact and loan requirement — a two-minute form.",
  },
  {
    icon: PhoneCall,
    title: "We Take It From There",
    body: "A senior advisor reaches out, assesses eligibility and manages the file.",
  },
  {
    icon: Calendar,
    title: "You Stay Updated",
    body: "We keep you posted as the file moves through sanction and disbursal.",
  },
  {
    icon: Wallet,
    title: "You Get Paid",
    body: "Your referral fee is settled once the loan is disbursed.",
  },
];

const BENEFITS = [
  {
    icon: Wallet,
    title: "Zero Investment",
    body: "No franchise fee, no office, no upfront cost — just refer and earn.",
  },
  {
    icon: Zap,
    title: "Uncapped Earnings",
    body: "No ceiling on how much you can earn — more referrals, more income.",
  },
  {
    icon: Check,
    title: "Fast, Transparent Payouts",
    body: "Your referral fee is settled as soon as the loan disburses — no chasing.",
  },
  {
    icon: UserCheck,
    title: "A Dedicated Relationship Manager",
    body: "One point of contact who keeps you updated at every stage.",
  },
  {
    icon: Landmark,
    title: "75+ Bank & NBFC Network",
    body: "Your client gets more shots at approval than going to a single bank.",
  },
  {
    icon: Award,
    title: "You Stay the Trusted Expert",
    body: "We work behind the scenes — your client relationship stays yours.",
  },
];

const MORE_REASONS = [
  {
    q: "No License or Certification Needed",
    a: "Unlike a registered loan agent, you don't need any certification to refer clients to us — just an introduction and a phone number. Our licensed advisors handle the lending process end to end.",
  },
  {
    q: "No Exclusivity Required",
    a: "Refer as much or as little as suits you — there's no minimum commitment, no lock-in and no target to hit.",
  },
  {
    q: "Full Visibility, Start to Finish",
    a: "You'll know exactly where your referral's file stands — from the first call through to sanction and disbursal.",
  },
  {
    q: "Grow Your Professional Network",
    a: "Every successful referral builds a track record with senior advisors across our network of 75+ banks and NBFCs.",
  },
];

const PARTNER_FAQS = [
  {
    q: "Who can become a referral partner?",
    a: "Anyone with a network — Chartered Accountants, property consultants, brokers, insurance advisors, business consultants, or simply someone whose contacts occasionally need a loan.",
  },
  {
    q: "Is there a joining fee?",
    a: "No. There's no cost to register or refer — you only earn, you never pay.",
  },
  {
    q: "How and when do I get paid?",
    a: "Your referral fee is calculated once the loan is disbursed and settled directly to your account — no invoicing required from you.",
  },
  {
    q: "Do I need a license or certification to refer clients?",
    a: "No. As a referral partner, you introduce us to the client — our licensed advisors handle eligibility, documentation and lender matching.",
  },
  {
    q: "Is there a limit on how many clients I can refer?",
    a: "None. There's no cap on referrals or earnings — refer as many clients as you like.",
  },
];

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-all duration-300 placeholder:text-muted-foreground/70 focus:border-gold focus:ring-2 focus:ring-gold/20";

type Fields = { name: string; phone: string; email: string; profession: string; message: string };
const empty: Fields = { name: "", phone: "", email: "", profession: "", message: "" };
const PHONE_RE = /^(?:\+?91[-\s]?|0)?[6-9]\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function PartnerForm() {
  const uid = useId();
  const [values, setValues] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Partial<Fields>>({});
  const [submitted, setSubmitted] = useState(false);

  const set =
    (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((v) => ({ ...v, [key]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Partial<Fields> = {};
    if (values.name.trim().length < 2) next.name = "Please enter your name";
    if (!PHONE_RE.test(values.phone.replace(/[\s-]/g, "")))
      next.phone = "Enter a valid 10-digit mobile number";
    if (values.email.trim() && !EMAIL_RE.test(values.email.trim()))
      next.email = "Enter a valid email address";
    if (values.profession.trim().length < 2) next.profession = "Tell us your profession or firm";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const detailParts = [
      values.profession.trim(),
      values.email.trim() ? `Email: ${values.email.trim()}` : "",
      values.message.trim(),
    ].filter(Boolean);

    await submitLead({
      name: values.name.trim(),
      phone: values.phone.trim(),
      source: "partner-enquiry",
      detail: detailParts.join(" — "),
    });
    setValues(empty);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-2xl border border-gold/20 bg-white p-8 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-gold-pale/70 text-gold-dark">
          <Check className="h-6 w-6" />
        </span>
        <h3 className="mt-4 text-lg font-extrabold text-navy">Thanks — we'll be in touch.</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          A member of our team will reach out to set up your referral partnership.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-2xl border border-border bg-white p-6 shadow-[var(--shadow-lift)] sm:p-7"
    >
      <h3 className="text-xl font-extrabold text-navy">Become a Referral Partner</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Tell us a bit about yourself — we'll set up your partnership and walk you through how
        referrals work.
      </p>
      <div className="mt-5 space-y-4">
        <div>
          <label
            htmlFor={`${uid}-name`}
            className="block text-[10px] font-bold tracking-[0.18em] text-navy uppercase"
          >
            Full Name <span className="text-gold">*</span>
          </label>
          <input
            id={`${uid}-name`}
            className={fieldClass}
            value={values.name}
            onChange={set("name")}
            placeholder="Enter your name"
            maxLength={100}
          />
          {errors.name && (
            <span className="mt-1 block text-xs text-destructive">{errors.name}</span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor={`${uid}-phone`}
              className="block text-[10px] font-bold tracking-[0.18em] text-navy uppercase"
            >
              Phone <span className="text-gold">*</span>
            </label>
            <input
              id={`${uid}-phone`}
              className={fieldClass}
              value={values.phone}
              onChange={set("phone")}
              placeholder="10-digit mobile"
              inputMode="tel"
              maxLength={15}
            />
            {errors.phone && (
              <span className="mt-1 block text-xs text-destructive">{errors.phone}</span>
            )}
          </div>
          <div>
            <label
              htmlFor={`${uid}-email`}
              className="block text-[10px] font-bold tracking-[0.18em] text-navy uppercase"
            >
              Email
            </label>
            <input
              id={`${uid}-email`}
              className={fieldClass}
              value={values.email}
              onChange={set("email")}
              placeholder="Optional"
              inputMode="email"
              maxLength={150}
            />
            {errors.email && (
              <span className="mt-1 block text-xs text-destructive">{errors.email}</span>
            )}
          </div>
        </div>
        <div>
          <label
            htmlFor={`${uid}-profession`}
            className="block text-[10px] font-bold tracking-[0.18em] text-navy uppercase"
          >
            Profession / Firm <span className="text-gold">*</span>
          </label>
          <input
            id={`${uid}-profession`}
            className={fieldClass}
            value={values.profession}
            onChange={set("profession")}
            placeholder="e.g. Chartered Accountant, ABC & Co."
            maxLength={150}
          />
          {errors.profession && (
            <span className="mt-1 block text-xs text-destructive">{errors.profession}</span>
          )}
        </div>
        <div>
          <label
            htmlFor={`${uid}-message`}
            className="block text-[10px] font-bold tracking-[0.18em] text-navy uppercase"
          >
            Anything Else (Optional)
          </label>
          <textarea
            id={`${uid}-message`}
            className={`${fieldClass} min-h-[80px] resize-none`}
            value={values.message}
            onChange={set("message")}
            placeholder="Tell us a bit about your practice or client base"
            maxLength={500}
          />
        </div>
      </div>
      <button
        type="submit"
        className="group mt-6 flex w-full items-center justify-center gap-3 rounded-lg bg-navy py-3.5 text-sm font-bold text-white shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-navy-soft"
      >
        Register as a Partner
        <span className="pulse-gold grid h-7 w-7 place-items-center rounded-full bg-gold text-navy transition-transform duration-300 group-hover:translate-x-0.5">
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </button>
    </form>
  );
}

/** Click-through process stepper, same interaction pattern as the home page's "How It Works". */
function PartnerStepper() {
  const [active, setActive] = useState(0);
  const step = STEPS[active] ?? STEPS[0]!;

  return (
    <div>
      <div className="relative flex items-center justify-between">
        <span
          aria-hidden
          className="absolute top-6 right-6 left-6 h-0.5 -translate-y-1/2 bg-border sm:top-7"
        />
        {STEPS.map((s, i) => {
          const isActive = i === active;
          const isDone = i < active;
          return (
            <button
              key={s.title}
              type="button"
              onClick={() => setActive(i)}
              className="group relative z-10 flex flex-col items-center gap-2"
            >
              <span
                className={`grid h-12 w-12 place-items-center rounded-full border-2 text-sm font-bold transition-all duration-400 sm:h-14 sm:w-14 ${
                  isActive
                    ? "-translate-y-1 border-gold bg-gold text-navy shadow-[var(--shadow-gold)]"
                    : isDone
                      ? "border-gold/60 bg-white text-gold-dark"
                      : "border-border bg-white text-muted-foreground group-hover:border-gold/40"
                }`}
              >
                {i + 1}
              </span>
              <span
                className={`hidden text-[11px] font-bold sm:block ${isActive ? "text-navy" : "text-muted-foreground"}`}
              >
                {s.title}
              </span>
            </button>
          );
        })}
      </div>

      <div
        key={active}
        className="rise-in mt-8 flex flex-col items-center gap-5 rounded-2xl border border-gold/15 bg-white p-8 text-center shadow-[var(--shadow-card)] sm:flex-row sm:text-left"
      >
        <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-navy to-navy-soft text-gold shadow-md">
          <step.icon className="h-7 w-7" />
        </span>
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] text-gold-dark uppercase">
            Step {active + 1} of {STEPS.length}
          </p>
          <h3 className="mt-1 font-heading text-xl font-bold text-navy">{step.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
        </div>
        <button
          type="button"
          onClick={() => setActive((v) => (v + 1) % STEPS.length)}
          className="mt-2 inline-flex shrink-0 items-center gap-1.5 rounded-full border border-navy/15 px-4 py-2 text-xs font-bold text-navy transition-colors hover:border-gold/50 sm:mt-0 sm:ml-auto"
        >
          Next step <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

/** Shared expand/collapse list — same interaction as the Contact page's FAQ accordion. */
function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white">
      {items.map((item, i) => (
        <div key={item.q}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
          >
            <span className="text-sm font-bold text-navy">{item.q}</span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-gold transition-transform duration-300 ${open === i ? "rotate-180" : ""}`}
            />
          </button>
          {open === i && (
            <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function PartnerPage() {
  return (
    <>
      {/* Hero: navy panel with stats + the registration form */}
      <section className="bg-bg-light py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 lg:grid-cols-2">
            <Reveal>
              <div className="navy-panel relative flex h-full flex-col overflow-hidden rounded-3xl p-8 sm:p-10">
                <div className="float-animation absolute top-0 right-0 h-72 w-72 rounded-full bg-gold/10 blur-[100px]" />
                <p className="relative text-xs font-bold tracking-[0.2em] text-gold uppercase">
                  Partner With Us
                </p>
                <h1 className="relative mt-3 font-heading text-3xl font-bold text-white sm:text-4xl">
                  Turn your network into{" "}
                  <span className="italic text-gold-light">a second income.</span>
                </h1>
                <p className="relative mt-4 text-sm leading-relaxed text-white/65">
                  If you're a CA, broker, advisor or consultant whose clients occasionally need a
                  loan, refer them to us. We handle the lending end to end — you stay the trusted
                  contact, and earn on every case we disburse.
                </p>

                <div className="relative mt-8 grid grid-cols-2 gap-5 sm:grid-cols-4">
                  {PARTNER_STATS.map((s, i) => (
                    <div
                      key={s.label}
                      style={{ animationDelay: `${i * 100}ms` }}
                      className="rise-in border-l-2 border-gold/40 pl-3 transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      <p className="font-heading text-xl font-bold text-white sm:text-2xl">
                        {s.value}
                      </p>
                      <p className="mt-0.5 text-[10px] leading-tight font-semibold tracking-wide text-white/60 uppercase">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="relative mt-auto pt-8">
                  <p className="font-heading text-base italic leading-relaxed text-white/80">
                    "You bring the introduction. We bring 75+ lenders, a senior advisor, and the
                    paperwork."
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <PartnerForm />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Who this is for */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Built For"
            title="If your clients ask you finance questions, this is for you."
            description="A second income stream that doesn't cost you anything but a referral."
          />
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SEGMENTS.map((s, i) => (
            <Reveal key={s.title} delay={i * 60}>
              <div className="group h-full rounded-2xl border border-border bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-[var(--shadow-lift)]">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold-pale/60 text-gold-dark transition-colors duration-300 group-hover:bg-gold group-hover:text-navy group-hover:animate-[gcs-wiggle_600ms_ease-in-out]">
                  <s.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-extrabold text-navy">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* How it works — interactive stepper */}
      <Section className="pt-0">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <Reveal>
            <SectionHeading
              eyebrow="How It Works"
              title="From introduction to payout — four steps."
              description="You make the introduction. Everything after that is on us."
            />
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Most referral programs leave you chasing updates or managing paperwork you never
              signed up for. Ours doesn't. Once you share a lead, a dedicated advisor takes
              ownership of the file end to end — checking eligibility, matching it against our
              network of 75+ banks and NBFCs, and pushing it through to disbursal — while you get
              scheduled updates at every stage instead of radio silence until the payout.
            </p>
          </Reveal>
          <Reveal delay={80}>
            <img
              src="/brand/partner-presenting-growth.png"
              alt="An advisor walking a client through their loan options"
              className="w-full rounded-3xl object-cover"
            />
          </Reveal>
        </div>
        <Reveal delay={120} className="mt-10">
          <PartnerStepper />
        </Reveal>
      </Section>

      {/* Why partner with GCS — benefit grid */}
      <Section className="pt-0">
        <Reveal>
          <SectionHeading
            eyebrow="Why Partner With GCS"
            title="What you get."
            description="No fine print — just the reasons professionals already refer to us."
          />
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b, i) => (
            <Reveal key={b.title} delay={i * 60}>
              <div className="group h-full rounded-2xl border border-border bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-[var(--shadow-lift)]">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold-pale/60 text-gold-dark transition-colors duration-300 group-hover:bg-gold group-hover:text-navy group-hover:animate-[gcs-wiggle_600ms_ease-in-out]">
                  <b.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-extrabold text-navy">{b.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Reasons to partner — accordion beside an image */}
      <Section className="pt-0">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <img
              src="/brand/partner-helping-climb.png"
              alt="A helping hand at every stage of the referral"
              className="w-full rounded-3xl object-cover"
            />
          </Reveal>
          <Reveal delay={80}>
            <p className="eyebrow">Worth Knowing</p>
            <h2 className="mt-2 text-2xl font-extrabold text-navy sm:text-3xl">
              Reasons to partner with us.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Beyond the referral fee, most professionals who stick with this partnership for years
              mention the same handful of reasons. Expand each one below.
            </p>
            <div className="mt-6">
              <Accordion items={MORE_REASONS} />
            </div>
          </Reveal>
        </div>
      </Section>

      {/* FAQ, alongside an image */}
      <Section className="pt-0">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <Reveal>
            <p className="eyebrow">Before You Register</p>
            <h2 className="mt-2 text-2xl font-extrabold text-navy sm:text-3xl">Quick answers.</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              The questions that come up most before someone sends their first referral.
            </p>
            <div className="mt-6">
              <Accordion items={PARTNER_FAQS} />
            </div>
          </Reveal>
          <Reveal delay={80}>
            <img
              src="/brand/partner-handshake-puzzle.png"
              alt="Two professionals shaking hands on a partnership"
              className="w-full rounded-3xl object-cover"
            />
          </Reveal>
        </div>
      </Section>

      {/* CTA */}
      <Section className="pt-0">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-gold/25 panel-light p-8 text-center sm:p-12">
            <div className="absolute top-0 right-1/4 h-60 w-60 rounded-full bg-gold/10 blur-[80px]" />
            <Handshake className="float-animation relative mx-auto h-10 w-10 text-gold-dark" />
            <h3 className="relative mt-4 font-heading text-2xl font-bold text-navy sm:text-3xl">
              Prefer to talk it through first? <span className="gold-text">Call us.</span>
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
