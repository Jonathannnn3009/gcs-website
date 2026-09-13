import { createFileRoute } from "@tanstack/react-router";
import { useId, useState } from "react";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Check,
  Handshake,
  Landmark,
  Scale,
  ShieldCheck,
  UserCheck,
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
          "Refer loan clients to Growth Capital Services and earn on every disbursal. Built for CAs, property consultants, real estate brokers, insurance advisors and business consultants.",
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

const SEGMENTS = [
  { icon: Scale, title: "Chartered Accountants", body: "Your clients ask you about loans already — send us the ones that need one." },
  { icon: Building2, title: "Property Consultants", body: "Every property deal has a financing question somewhere in it." },
  { icon: Landmark, title: "Real Estate Brokers", body: "Help your buyer close faster with financing lined up in parallel." },
  { icon: ShieldCheck, title: "Insurance Advisors", body: "A natural extension of the financial conversations you're already having." },
  { icon: Briefcase, title: "Business Consultants", body: "Working capital and business loan needs come up constantly in your work." },
  { icon: UserCheck, title: "Lawyers & Company Secretaries", body: "Refer clients navigating property, business or personal finance decisions." },
];

const BENEFITS = [
  "A referral fee on every loan we disburse for your client",
  "You stay the trusted contact — we handle the lending process end to end",
  "Full visibility into your referral's status, start to finish",
  "No exclusivity required — refer as much or as little as suits you",
];

const STEPS = [
  { num: "01", title: "Tell Us About the Client", body: "Share their name, contact and loan requirement — a two-minute form." },
  { num: "02", title: "We Take It From There", body: "A senior advisor reaches out, assesses eligibility and manages the file." },
  { num: "03", title: "You Stay Updated", body: "We keep you posted as the file moves through sanction and disbursal." },
  { num: "04", title: "You Get Paid", body: "Your referral fee is settled once the loan is disbursed." },
];

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-all duration-300 placeholder:text-muted-foreground/70 focus:border-gold focus:ring-2 focus:ring-gold/20";

type Fields = { name: string; phone: string; profession: string; message: string };
const empty: Fields = { name: "", phone: "", profession: "", message: "" };
const PHONE_RE = /^(?:\+?91[-\s]?|0)?[6-9]\d{9}$/;

function PartnerForm() {
  const uid = useId();
  const [values, setValues] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Partial<Fields>>({});
  const [submitted, setSubmitted] = useState(false);

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Partial<Fields> = {};
    if (values.name.trim().length < 2) next.name = "Please enter your name";
    if (!PHONE_RE.test(values.phone.replace(/[\s-]/g, ""))) next.phone = "Enter a valid 10-digit mobile number";
    if (values.profession.trim().length < 2) next.profession = "Tell us your profession or firm";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    await submitLead({
      name: values.name.trim(),
      phone: values.phone.trim(),
      source: "partner-enquiry",
      detail: `${values.profession.trim()}${values.message.trim() ? " — " + values.message.trim() : ""}`,
    });
    setValues(empty);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-gold/20 bg-white p-8 text-center">
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
    <form onSubmit={onSubmit} noValidate className="rounded-2xl border border-border bg-white p-6 shadow-[var(--shadow-lift)] sm:p-7">
      <h3 className="text-xl font-extrabold text-navy">Become a Referral Partner</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Tell us a bit about yourself — we'll set up your partnership and walk you through how referrals work.
      </p>
      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor={`${uid}-name`} className="block text-[10px] font-bold tracking-[0.18em] text-navy uppercase">
            Full Name <span className="text-gold">*</span>
          </label>
          <input id={`${uid}-name`} className={fieldClass} value={values.name} onChange={set("name")} placeholder="Enter your name" maxLength={100} />
          {errors.name && <span className="mt-1 block text-xs text-destructive">{errors.name}</span>}
        </div>
        <div>
          <label htmlFor={`${uid}-phone`} className="block text-[10px] font-bold tracking-[0.18em] text-navy uppercase">
            Phone <span className="text-gold">*</span>
          </label>
          <input id={`${uid}-phone`} className={fieldClass} value={values.phone} onChange={set("phone")} placeholder="10-digit mobile" inputMode="tel" maxLength={15} />
          {errors.phone && <span className="mt-1 block text-xs text-destructive">{errors.phone}</span>}
        </div>
        <div>
          <label htmlFor={`${uid}-profession`} className="block text-[10px] font-bold tracking-[0.18em] text-navy uppercase">
            Profession / Firm <span className="text-gold">*</span>
          </label>
          <input id={`${uid}-profession`} className={fieldClass} value={values.profession} onChange={set("profession")} placeholder="e.g. Chartered Accountant, ABC & Co." maxLength={150} />
          {errors.profession && <span className="mt-1 block text-xs text-destructive">{errors.profession}</span>}
        </div>
        <div>
          <label htmlFor={`${uid}-message`} className="block text-[10px] font-bold tracking-[0.18em] text-navy uppercase">
            Anything Else (Optional)
          </label>
          <textarea id={`${uid}-message`} className={`${fieldClass} min-h-[80px] resize-none`} value={values.message} onChange={set("message")} placeholder="Tell us a bit about your practice or client base" maxLength={500} />
        </div>
      </div>
      <button type="submit" className="group mt-6 flex w-full items-center justify-center gap-3 rounded-lg bg-navy py-3.5 text-sm font-bold text-white shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-navy-soft">
        Register as a Partner
        <span className="grid h-7 w-7 place-items-center rounded-full bg-gold text-navy transition-transform duration-300 group-hover:translate-x-0.5">
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </button>
    </form>
  );
}

function PartnerPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden hero-light border-b border-gold/15 py-16 sm:py-20">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-gold/8 blur-[120px]"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="eyebrow">Partner With Us</p>
            <h1 className="mt-4 text-3xl font-extrabold text-navy sm:text-5xl">
              Your clients trust you. <span className="gold-text">Let's earn that together.</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              If you're a CA, property consultant, broker, advisor or consultant whose clients occasionally
              need a loan, refer them to us — we handle the lending, you stay the trusted contact, and you
              earn on every disbursal.
            </p>
          </Reveal>
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
              <div className="h-full rounded-2xl border border-border bg-white p-6">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold-pale/60 text-gold-dark">
                  <s.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-extrabold text-navy">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Benefits + Form */}
      <Section className="pt-0">
        <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-start">
          <Reveal>
            <p className="eyebrow">Why Partner With GCS</p>
            <h2 className="mt-2 text-2xl font-extrabold text-navy sm:text-3xl">What you get.</h2>
            <ul className="mt-6 space-y-4">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold-pale/60 text-gold-dark">
                    <Check className="h-4 w-4" />
                  </span>
                  <span className="pt-0.5 text-sm leading-relaxed text-foreground">{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <p className="eyebrow">How It Works</p>
              <div className="mt-4 space-y-5">
                {STEPS.map((s) => (
                  <div key={s.num} className="flex gap-4">
                    <span className="font-heading text-lg italic text-gold-dark">{s.num}</span>
                    <div>
                      <h4 className="text-sm font-extrabold text-navy">{s.title}</h4>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <PartnerForm />
          </Reveal>
        </div>
      </Section>

      {/* CTA */}
      <Section className="pt-0">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-gold/25 panel-light p-8 text-center sm:p-12">
            <div className="absolute top-0 right-1/4 h-60 w-60 rounded-full bg-gold/10 blur-[80px]"></div>
            <Handshake className="relative mx-auto h-10 w-10 text-gold-dark" />
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
