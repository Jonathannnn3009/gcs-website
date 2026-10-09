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
import { PARTNER_FAQS } from "@/data/faqs";
import { useFaqs } from "@/lib/site-content";
import { submitLead } from "@/lib/leads";
import { useCommissionStructure } from "@/lib/commission";
import {
  PARTNER_BENEFITS,
  PARTNER_HIGHLIGHTS,
  PARTNER_REASONS,
  PARTNER_SEGMENTS,
  PARTNER_STATS,
  PARTNER_STEPS,
} from "@/data/page-lists";
import { useList } from "@/lib/page-lists";

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





// Fallback copy of the CRM's rate card (backend/prisma/seed.ts RATE_CARDS). The page shows the
// live card from /crm/api/public/commission-structure and uses this if the CRM is unreachable.
const COMMISSION_STRUCTURE = [
  { product: "Home Loan", range: "0.2% – 0.5%", avgAmount: "₹30L – ₹1Cr", earning: "₹6,000 – ₹50,000" },
  {
    product: "Loan Against Property",
    range: "0.5% – 1.0%",
    avgAmount: "₹20L – ₹75L",
    earning: "₹10,000 – ₹75,000",
  },
  {
    product: "Business Loan",
    range: "1.0% – 2.0%",
    avgAmount: "₹10L – ₹50L",
    earning: "₹10,000 – ₹1,00,000",
  },
  { product: "Personal Loan", range: "1.0% – 2.5%", avgAmount: "₹2L – ₹25L", earning: "₹2,000 – ₹62,500" },
  {
    product: "Working Capital Loan",
    range: "0.5% – 1.5%",
    avgAmount: "₹10L – ₹1Cr",
    earning: "₹5,000 – ₹1,50,000",
  },
  {
    product: "Loan Against Securities",
    range: "0.3% – 0.8%",
    avgAmount: "₹10L – ₹5Cr",
    earning: "₹3,000 – ₹4,00,000",
  },
  {
    product: "Project Funding",
    range: "0.5% – 1.0%",
    avgAmount: "₹50L – ₹10Cr",
    earning: "₹25,000 – ₹10,00,000",
  },
];




const fieldClass =
  "mt-1.5 w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-all duration-300 placeholder:text-muted-foreground/70 focus:border-gold focus:ring-2 focus:ring-gold/20 dark:bg-card dark:text-white";

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
      email: values.email.trim(),
      source: "partner-enquiry",
      detail: detailParts.join(" — "),
    });
    setValues(empty);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-2xl border border-gold/20 bg-white p-8 text-center dark:bg-card">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-gold-pale/70 text-gold-dark dark:bg-gold/15">
          <Check className="h-6 w-6" />
        </span>
        <h3 className="mt-4 text-lg font-extrabold text-navy dark:text-white">Thanks — we'll be in touch.</h3>
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
      className="rounded-2xl border border-border bg-white p-6 shadow-[var(--shadow-lift)] sm:p-7 dark:bg-card"
    >
      <h3 className="text-xl font-extrabold text-navy dark:text-white">Become a Referral Partner</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Tell us a bit about yourself — we'll set up your partnership and walk you through how
        referrals work.
      </p>
      <div className="mt-5 space-y-4">
        <div>
          <label
            htmlFor={`${uid}-name`}
            className="block text-[10px] font-bold tracking-[0.18em] text-navy uppercase dark:text-white"
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
              className="block text-[10px] font-bold tracking-[0.18em] text-navy uppercase dark:text-white"
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
              className="block text-[10px] font-bold tracking-[0.18em] text-navy uppercase dark:text-white"
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
            className="block text-[10px] font-bold tracking-[0.18em] text-navy uppercase dark:text-white"
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
            className="block text-[10px] font-bold tracking-[0.18em] text-navy uppercase dark:text-white"
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
  const STEPS = useList("partner.steps", PARTNER_STEPS);
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
                      ? "border-gold/60 bg-white text-gold-dark dark:bg-card"
                      : "border-border bg-white text-muted-foreground group-hover:border-gold/40 dark:bg-card"
                }`}
              >
                {i + 1}
              </span>
              <span
                className={`hidden text-[11px] font-bold sm:block ${isActive ? "text-navy dark:text-white" : "text-muted-foreground"}`}
              >
                {s.title}
              </span>
            </button>
          );
        })}
      </div>

      <div
        key={active}
        className="rise-in mt-8 flex flex-col items-center gap-5 rounded-2xl border border-gold/15 bg-white p-8 text-center shadow-[var(--shadow-card)] sm:flex-row sm:text-left dark:bg-card"
      >
        <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-navy to-navy-soft text-gold shadow-md">
          <step.icon className="h-7 w-7" />
        </span>
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] text-gold-dark uppercase">
            Step {active + 1} of {STEPS.length}
          </p>
          <h3 className="mt-1 font-heading text-xl font-bold text-navy dark:text-white">{step.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
        </div>
        <button
          type="button"
          onClick={() => setActive((v) => (v + 1) % STEPS.length)}
          className="mt-2 inline-flex shrink-0 items-center gap-1.5 rounded-full border border-navy/15 px-4 py-2 text-xs font-bold text-navy transition-colors hover:border-gold/50 sm:mt-0 sm:ml-auto dark:text-white"
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
    <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white dark:bg-card">
      {items.map((item, i) => (
        <div key={item.q}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
          >
            <span className="text-sm font-bold text-navy dark:text-white">{item.q}</span>
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
  const MORE_REASONS = useList("partner.reasons", PARTNER_REASONS);
  const BENEFITS = useList("partner.benefits", PARTNER_BENEFITS);
  const SEGMENTS = useList("partner.segments", PARTNER_SEGMENTS);
  const HERO_HIGHLIGHTS = useList("partner.highlights", PARTNER_HIGHLIGHTS);
  const PARTNER_STATS_LIST = useList("partner.stats", PARTNER_STATS);
  const partnerFaqs = useFaqs("partner", PARTNER_FAQS);
  const commissionRows = useCommissionStructure(COMMISSION_STRUCTURE);
  return (
    <>
      {/* Hero: navy panel with stats + the registration form */}
      <section className="bg-bg-light py-10 sm:py-14 dark:bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
            <Reveal>
              <div className="navy-panel relative flex flex-col overflow-hidden rounded-3xl p-8 sm:p-10">
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
                  {PARTNER_STATS_LIST.map((s, i) => (
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

                <div className="relative mt-8 space-y-3 border-t border-white/10 pt-6">
                  {HERO_HIGHLIGHTS.map((h) => (
                    <div key={h.text} className="flex items-start gap-2.5 text-sm text-white/75">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-light" />
                      <span>{h.text}</span>
                    </div>
                  ))}
                </div>

                <div className="relative mt-8 border-t border-white/10 pt-6">
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
              <div className="group h-full rounded-2xl border border-border bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-[var(--shadow-lift)] dark:bg-card">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold-pale/60 text-gold-dark transition-colors duration-300 group-hover:bg-gold group-hover:text-navy group-hover:animate-[gcs-wiggle_600ms_ease-in-out] dark:bg-gold/15">
                  <s.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-extrabold text-navy dark:text-white">{s.title}</h3>
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
              <div className="group h-full rounded-2xl border border-border bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-[var(--shadow-lift)] dark:bg-card">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold-pale/60 text-gold-dark transition-colors duration-300 group-hover:bg-gold group-hover:text-navy group-hover:animate-[gcs-wiggle_600ms_ease-in-out] dark:bg-gold/15">
                  <b.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-extrabold text-navy dark:text-white">{b.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Commission structure — the concrete numbers behind "uncapped earnings" */}
      <Section className="pt-0">
        <Reveal>
          <SectionHeading
            eyebrow="What You Earn"
            title="Referral commission by loan type."
            description="Indicative earning per successful referral — actual payout depends on the lender, loan amount and your partner tier."
          />
        </Reveal>
        <Reveal delay={80}>
          <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-white shadow-[var(--shadow-card)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-bg-light/70 text-[11px] font-bold tracking-wide text-navy uppercase">
                  <tr>
                    <th className="px-6 py-4">Loan Product</th>
                    <th className="px-6 py-4">Commission Range</th>
                    <th className="px-6 py-4">Avg. Loan Amount</th>
                    <th className="px-6 py-4">Potential Earning / Deal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {commissionRows.map((row) => (
                    <tr key={row.product} className="transition-colors hover:bg-bg-light/50">
                      <td className="px-6 py-4 font-bold text-navy">{row.product}</td>
                      <td className="px-6 py-4 text-muted-foreground">{row.range}</td>
                      <td className="px-6 py-4 text-muted-foreground">{row.avgAmount}</td>
                      <td className="px-6 py-4 font-bold text-gold-dark">{row.earning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground italic">
            Commission rates may vary based on lender, loan amount and partner tier.
          </p>
        </Reveal>
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
            <h2 className="mt-2 text-2xl font-extrabold text-navy sm:text-3xl dark:text-white">
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
            <h2 className="mt-2 text-2xl font-extrabold text-navy sm:text-3xl dark:text-white">Quick answers.</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              The questions that come up most before someone sends their first referral.
            </p>
            <div className="mt-6">
              <Accordion items={partnerFaqs} />
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
            <h3 className="relative mt-4 font-heading text-2xl font-bold text-navy sm:text-3xl dark:text-white">
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
                className="inline-flex items-center gap-2 rounded-md border border-navy/20 bg-white px-6 py-3.5 text-sm font-bold text-navy transition-all hover:-translate-y-0.5 dark:text-white dark:bg-card"
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
