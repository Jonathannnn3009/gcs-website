import { Link } from "@tanstack/react-router";
import { useId, useState, type ReactNode } from "react";
import { ArrowRight, Building2, Check, ChevronDown, Handshake, UserRound } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { submitLead } from "@/lib/leads";

// Pieces shared by the three partner pages (Agent, Builder, Freelancer).

export const PARTNER_ZONES = [
  { to: "/partner", label: "Agent", icon: Handshake },
  { to: "/partner/builder", label: "Builder", icon: Building2 },
  { to: "/partner/freelancer", label: "Freelancer", icon: UserRound },
] as const;

/** Small switcher at the top of each partner page so a visitor can hop between the three. */
export function ZoneTabs({ current }: { current: (typeof PARTNER_ZONES)[number]["to"] }) {
  return (
    <div className="border-b border-gold/15 bg-white dark:bg-card">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2 px-4 py-3 sm:px-6 lg:px-8">
        <span className="mr-1 hidden text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase sm:inline">
          Partner as a
        </span>
        {PARTNER_ZONES.map((z) => {
          const on = z.to === current;
          return (
            <Link
              key={z.to}
              to={z.to}
              aria-current={on ? "page" : undefined}
              className={`group/zone inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 active:scale-95 ${
                on
                  ? "border-navy bg-navy text-white shadow-[var(--shadow-card)]"
                  : "border-border bg-white text-navy hover:border-gold/60 dark:bg-card dark:text-white"
              }`}
            >
              <z.icon className="h-4 w-4 transition-transform duration-300 group-hover/zone:scale-125 group-hover/zone:-rotate-6" />
              {z.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/** Navy panel (headline, stats, tick points) beside a form — the opening block of every zone page. */
export function ZoneHero({
  eyebrow,
  title,
  intro,
  stats,
  points,
  quote,
  form,
}: {
  eyebrow: string;
  title: ReactNode;
  intro: string;
  stats: { value: string; label: string }[];
  points: string[];
  quote: string;
  form: ReactNode;
}) {
  return (
    <section className="bg-bg-light py-10 sm:py-14 dark:bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
          <Reveal>
            <div className="navy-panel relative flex flex-col overflow-hidden rounded-3xl p-8 sm:p-10">
              <div className="float-animation absolute top-0 right-0 h-72 w-72 rounded-full bg-gold/10 blur-[100px]" />
              <p className="relative text-xs font-bold tracking-[0.2em] text-gold uppercase">{eyebrow}</p>
              <h1 className="relative mt-3 font-heading text-3xl font-bold text-white sm:text-4xl">{title}</h1>
              <p className="relative mt-4 text-sm leading-relaxed text-white/65">{intro}</p>

              <div className="relative mt-8 grid grid-cols-2 gap-5 sm:grid-cols-4">
                {stats.map((s, i) => (
                  <div
                    key={s.label}
                    style={{ animationDelay: `${i * 100}ms` }}
                    className="rise-in border-l-2 border-gold/40 pl-3 transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    <p className="font-heading text-xl font-bold text-white sm:text-2xl">{s.value}</p>
                    <p className="mt-0.5 text-[10px] leading-tight font-semibold tracking-wide text-white/60 uppercase">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="relative mt-8 space-y-3 border-t border-white/10 pt-6">
                {points.map((p) => (
                  <div key={p} className="flex items-start gap-2.5 text-sm text-white/75">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-light" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>

              <div className="relative mt-8 border-t border-white/10 pt-6">
                <p className="font-heading text-base leading-relaxed text-white/80 italic">"{quote}"</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={100}>{form}</Reveal>
        </div>
      </div>
    </section>
  );
}

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-all duration-300 placeholder:text-muted-foreground/70 focus:border-gold focus:ring-2 focus:ring-gold/20 dark:bg-card dark:text-white";
const labelClass = "block text-[10px] font-bold tracking-[0.18em] text-navy uppercase dark:text-white";
const PHONE_RE = /^(?:\+?91[-\s]?|0)?[6-9]\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Values = { name: string; phone: string; email: string; org: string; city: string; message: string };
const empty: Values = { name: "", phone: "", email: "", org: "", city: "", message: "" };

/** Registration / enquiry form for a partner zone. The lead reaches the CRM under `source`. */
export function ZoneForm({
  source,
  heading,
  intro,
  orgLabel,
  orgPlaceholder,
  messagePlaceholder,
  cta,
  thanks,
}: {
  source: string;
  heading: string;
  intro: string;
  orgLabel: string;
  orgPlaceholder: string;
  messagePlaceholder: string;
  cta: string;
  thanks: string;
}) {
  const uid = useId();
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<Partial<Values>>({});
  const [submitted, setSubmitted] = useState(false);

  const set = (key: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Partial<Values> = {};
    if (values.name.trim().length < 2) next.name = "Please enter your name";
    if (!PHONE_RE.test(values.phone.replace(/[\s-]/g, ""))) next.phone = "Enter a valid 10-digit mobile number";
    if (values.email.trim() && !EMAIL_RE.test(values.email.trim())) next.email = "Enter a valid email address";
    if (values.org.trim().length < 2) next.org = `Tell us your ${orgLabel.toLowerCase()}`;
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const detail = [
      `${orgLabel}: ${values.org.trim()}`,
      values.city.trim() ? `City: ${values.city.trim()}` : "",
      values.email.trim() ? `Email: ${values.email.trim()}` : "",
      values.message.trim(),
    ]
      .filter(Boolean)
      .join(" — ");

    await submitLead({
      name: values.name.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      ...(values.city.trim() ? { city: values.city.trim() } : {}),
      source,
      detail,
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
        <p className="mt-2 text-sm text-muted-foreground">{thanks}</p>
      </div>
    );
  }

  const err = (k: keyof Values) =>
    errors[k] ? <span className="mt-1 block text-xs text-destructive">{errors[k]}</span> : null;

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-2xl border border-border bg-white p-6 shadow-[var(--shadow-lift)] sm:p-7 dark:bg-card"
    >
      <h3 className="text-xl font-extrabold text-navy dark:text-white">{heading}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{intro}</p>
      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor={`${uid}-name`} className={labelClass}>
            Full Name <span className="text-gold">*</span>
          </label>
          <input id={`${uid}-name`} className={fieldClass} value={values.name} onChange={set("name")} placeholder="Enter your name" maxLength={100} />
          {err("name")}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${uid}-phone`} className={labelClass}>
              Phone <span className="text-gold">*</span>
            </label>
            <input id={`${uid}-phone`} className={fieldClass} value={values.phone} onChange={set("phone")} placeholder="10-digit mobile" inputMode="tel" maxLength={15} />
            {err("phone")}
          </div>
          <div>
            <label htmlFor={`${uid}-email`} className={labelClass}>
              Email
            </label>
            <input id={`${uid}-email`} className={fieldClass} value={values.email} onChange={set("email")} placeholder="Optional" inputMode="email" maxLength={150} />
            {err("email")}
          </div>
        </div>
        <div className="grid grid-cols-[1.4fr_1fr] gap-4">
          <div>
            <label htmlFor={`${uid}-org`} className={labelClass}>
              {orgLabel} <span className="text-gold">*</span>
            </label>
            <input id={`${uid}-org`} className={fieldClass} value={values.org} onChange={set("org")} placeholder={orgPlaceholder} maxLength={150} />
            {err("org")}
          </div>
          <div>
            <label htmlFor={`${uid}-city`} className={labelClass}>
              City
            </label>
            <input id={`${uid}-city`} className={fieldClass} value={values.city} onChange={set("city")} placeholder="e.g. Mumbai" maxLength={80} />
          </div>
        </div>
        <div>
          <label htmlFor={`${uid}-message`} className={labelClass}>
            Anything Else (Optional)
          </label>
          <textarea
            id={`${uid}-message`}
            className={`${fieldClass} min-h-[80px] resize-none`}
            value={values.message}
            onChange={set("message")}
            placeholder={messagePlaceholder}
            maxLength={500}
          />
        </div>
      </div>
      <button
        type="submit"
        className="group mt-6 flex w-full items-center justify-center gap-3 rounded-lg bg-navy py-3.5 text-sm font-bold text-white shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-navy-soft active:scale-[0.98]"
      >
        {cta}
        <span className="pulse-gold grid h-7 w-7 place-items-center rounded-full bg-gold text-navy transition-transform duration-300 group-hover:translate-x-0.5">
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </button>
    </form>
  );
}

export function ZoneFaq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white dark:bg-card">
      {items.map((item, i) => (
        <div key={item.q}>
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
          >
            <span className="text-sm font-bold text-navy dark:text-white">{item.q}</span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-gold transition-transform duration-300 ${open === i ? "rotate-180" : ""}`}
            />
          </button>
          {open === i && <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">{item.a}</p>}
        </div>
      ))}
    </div>
  );
}
