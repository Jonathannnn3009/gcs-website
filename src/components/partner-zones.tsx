import { Link } from "@tanstack/react-router";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  Handshake,
  MessageCircle,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Section, SectionHeading } from "@/components/section";
import { ASSISTANT_NAME } from "@/lib/chat/config";
import { isValidEmail } from "@/lib/validation";
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
    <nav aria-label="Partner pages" className="border-b border-gold/15 bg-white dark:bg-card">
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
    </nav>
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
        <div className="grid gap-5 lg:grid-cols-2 lg:items-stretch">
          <Reveal className="h-full">
            <div className="navy-panel relative flex h-full flex-col overflow-hidden rounded-3xl p-8 sm:p-10">
              <div className="float-animation absolute top-0 right-0 h-72 w-72 rounded-full bg-gold/10 blur-[100px]" />
              <p className="relative text-xs font-bold tracking-[0.2em] text-gold uppercase">
                {eyebrow}
              </p>
              <h1 className="relative mt-3 font-heading text-3xl font-bold text-white sm:text-4xl">
                {title}
              </h1>
              <p className="relative mt-4 text-sm leading-relaxed text-white/65">{intro}</p>

              <div className="relative mt-8 grid grid-cols-2 gap-5 sm:grid-cols-4">
                {stats.map((s, i) => (
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

              <div className="relative mt-8 mb-8 space-y-3 border-t border-white/10 pt-6">
                {points.map((p) => (
                  <div key={p} className="flex items-start gap-2.5 text-sm text-white/75">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-light" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>

              <div className="relative mt-auto border-t border-white/10 pt-6">
                <p className="font-heading text-base leading-relaxed text-white/80 italic">
                  "{quote}"
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={100} className="h-full">
            <div id="register" className="h-full scroll-mt-24">
              {form}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-all duration-300 placeholder:text-muted-foreground/70 focus:border-gold focus:ring-2 focus:ring-gold/20 dark:bg-card dark:text-white";
const labelClass =
  "block text-[10px] font-bold tracking-[0.18em] text-navy uppercase dark:text-white";
const PHONE_RE = /^(?:\+?91[-\s]?|0)?[6-9]\d{9}$/;

/** How many people a partner expects to refer in a month: an estimate, not a target. */
export const REFERRAL_VOLUMES = ["1–2", "3–5", "6–10", "More than 10", "Not sure yet"] as const;

/**
 * The "how many could you refer" dropdown shared by the partner forms. It is built by hand instead of
 * using the browser's own select, so the closed field and the open list match the form's other fields.
 */
export function ReferralVolumeField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", away);
    return () => document.removeEventListener("mousedown", away);
  }, [open]);

  const pick = (v: string) => {
    onChange(v);
    setOpen(false);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") return setOpen(false);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        setActive(
          Math.max(0, REFERRAL_VOLUMES.indexOf(value as (typeof REFERRAL_VOLUMES)[number])),
        );
        return setOpen(true);
      }
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((i) => (i + step + REFERRAL_VOLUMES.length) % REFERRAL_VOLUMES.length);
    }
    if ((e.key === "Enter" || e.key === " ") && open) {
      e.preventDefault();
      const chosen = REFERRAL_VOLUMES[active];
      if (chosen) pick(chosen);
    }
  };

  return (
    <div ref={root} className="relative">
      <span id={`${id}-label`} className={labelClass}>
        {label}
      </span>
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${id}-label ${id}`}
        onClick={() => {
          setActive(
            Math.max(0, REFERRAL_VOLUMES.indexOf(value as (typeof REFERRAL_VOLUMES)[number])),
          );
          setOpen((o) => !o);
        }}
        onKeyDown={onKey}
        className={`${fieldClass} flex items-center justify-between text-left ${open ? "border-gold ring-2 ring-gold/20" : ""}`}
      >
        <span className={value ? "" : "text-muted-foreground/70"}>
          {value || "Select, an estimate is fine"}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-gold transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <ul
          role="listbox"
          aria-labelledby={`${id}-label`}
          className="absolute right-0 left-0 z-30 mt-2 overflow-hidden rounded-xl border border-gold/15 bg-white p-1.5 shadow-[0_20px_60px_-12px_oklch(0.13_0.04_265/0.25)] dark:bg-card"
          style={{ animation: "gcs-scale-in 160ms ease both" }}
        >
          {REFERRAL_VOLUMES.map((v, i) => (
            <li
              key={v}
              role="option"
              aria-selected={v === value}
              onMouseEnter={() => setActive(i)}
              onClick={() => pick(v)}
              className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                i === active ? "bg-gold/10 text-navy dark:text-white" : "text-foreground"
              } ${v === value ? "font-bold" : "font-medium"}`}
            >
              {v}
              {v === value && <Check className="h-4 w-4 text-gold-dark" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

type Values = {
  name: string;
  phone: string;
  email: string;
  org: string;
  city: string;
  volume: string;
  message: string;
};
const empty: Values = {
  name: "",
  phone: "",
  email: "",
  org: "",
  city: "",
  volume: "",
  message: "",
};

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
  volumeLabel = "How many clients could you refer in a month?",
}: {
  source: string;
  heading: string;
  intro: string;
  orgLabel: string;
  orgPlaceholder: string;
  messagePlaceholder: string;
  cta: string;
  thanks: string;
  /** The wording of the "how many in a month" question, e.g. buyers for a builder. */
  volumeLabel?: string;
}) {
  const uid = useId();
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<Partial<Values>>({});
  const [submitted, setSubmitted] = useState(false);

  const set =
    (key: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((v) => ({ ...v, [key]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Partial<Values> = {};
    if (values.name.trim().length < 2) next.name = "Please enter your name";
    if (!PHONE_RE.test(values.phone.replace(/[\s-]/g, "")))
      next.phone = "Enter a valid 10-digit mobile number";
    if (values.email.trim() && !isValidEmail(values.email.trim()))
      next.email = "Enter a valid email address";
    if (values.org.trim().length < 2) next.org = `Tell us your ${orgLabel.toLowerCase()}`;
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const detail = [
      `${orgLabel}: ${values.org.trim()}`,
      values.city.trim() ? `City: ${values.city.trim()}` : "",
      values.email.trim() ? `Email: ${values.email.trim()}` : "",
      values.volume ? `Could refer per month: ${values.volume}` : "",
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
        <h3 className="mt-4 text-lg font-extrabold text-navy dark:text-white">
          Thanks — we'll be in touch.
        </h3>
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
      className="h-full rounded-2xl border border-border bg-white p-6 shadow-[var(--shadow-lift)] sm:p-7 dark:bg-card"
    >
      <h3 className="text-xl font-extrabold text-navy dark:text-white">{heading}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{intro}</p>
      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor={`${uid}-name`} className={labelClass}>
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
          {err("name")}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${uid}-phone`} className={labelClass}>
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
            {err("phone")}
          </div>
          <div>
            <label htmlFor={`${uid}-email`} className={labelClass}>
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
            {err("email")}
          </div>
        </div>
        <div className="grid grid-cols-[1.4fr_1fr] gap-4">
          <div>
            <label htmlFor={`${uid}-org`} className={labelClass}>
              {orgLabel} <span className="text-gold">*</span>
            </label>
            <input
              id={`${uid}-org`}
              className={fieldClass}
              value={values.org}
              onChange={set("org")}
              placeholder={orgPlaceholder}
              maxLength={150}
            />
            {err("org")}
          </div>
          <div>
            <label htmlFor={`${uid}-city`} className={labelClass}>
              City
            </label>
            <input
              id={`${uid}-city`}
              className={fieldClass}
              value={values.city}
              onChange={set("city")}
              placeholder="e.g. Mumbai"
              maxLength={80}
            />
          </div>
        </div>
        <ReferralVolumeField
          id={`${uid}-volume`}
          label={volumeLabel}
          value={values.volume}
          onChange={(volume) => setValues((v) => ({ ...v, volume }))}
        />
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
          {/* always in the page, only hidden while closed, so the answer is there for search and the chat assistant */}
          <p
            hidden={open !== i}
            className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground"
          >
            {item.a}
          </p>
        </div>
      ))}
    </div>
  );
}

type Feature = { icon: LucideIcon; title: string; body: string };

/** A headed grid of icon cards: "What we do", "Why choose us" and the like. */
export function ZoneFeatureGrid({
  eyebrow,
  title,
  description,
  items,
  first = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  items: Feature[];
  /** The first block after the hero has top padding; later ones sit close to the one above. */
  first?: boolean;
}) {
  return (
    <Section className={first ? "" : "pt-0"}>
      <Reveal>
        <SectionHeading eyebrow={eyebrow} title={title} {...(description ? { description } : {})} />
      </Reveal>
      <div
        className={`mt-8 grid gap-5 sm:grid-cols-2 ${items.length % 3 === 0 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}
      >
        {items.map((f, i) => (
          <Reveal key={f.title} delay={i * 60}>
            <div className="group h-full rounded-2xl border border-border bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-[var(--shadow-lift)] dark:bg-card">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold-pale/60 text-gold-dark transition-colors duration-300 group-hover:bg-gold group-hover:text-navy group-hover:animate-[gcs-wiggle_600ms_ease-in-out] dark:bg-gold/15">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-extrabold text-navy dark:text-white">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/** Opens the site's chat assistant, optionally with a first question. */
const askAssistant = (message: string) =>
  window.dispatchEvent(new CustomEvent("gcs:open-chat", { detail: { message } }));

/** The assistant's pitch to a partner: what it does for them and their clients, with a way to try it. */
export function ZoneAssistant({
  eyebrow,
  title,
  intro,
  points,
  prompts,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  points: Feature[];
  /** Questions a visitor can fire at the assistant with one tap. */
  prompts: { label: string; message: string }[];
}) {
  return (
    <Section className="pt-0">
      <Reveal>
        <div className="navy-panel relative overflow-hidden rounded-3xl p-8 sm:p-10">
          <div className="float-animation absolute -top-16 -right-10 h-72 w-72 rounded-full bg-gold/10 blur-[100px]" />
          <div className="relative grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-gold uppercase">{eyebrow}</p>
              <h2 className="mt-3 font-heading text-2xl font-bold text-white sm:text-3xl">
                {title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/70">{intro}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {prompts.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => askAssistant(p.message)}
                    className="rounded-full border border-gold/40 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-gold hover:bg-gold/15 active:scale-95"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => askAssistant("")}
                className="gold-btn mt-6 py-3 text-sm"
              >
                <MessageCircle className="h-4 w-4" /> Chat with {ASSISTANT_NAME}
              </button>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {points.map((p) => (
                <li
                  key={p.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors duration-300 hover:border-gold/40"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-gold/15 text-gold-light">
                    <p.icon className="h-4 w-4" />
                  </span>
                  <p className="mt-3 text-sm font-bold text-white">{p.title}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-white/65">{p.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

/** The closing "three steps to begin" strip with a button back up to the sign-up form. */
export function ZoneGetStarted({
  title,
  description,
  steps,
  cta,
}: {
  title: string;
  description: string;
  steps: { title: string; body: string }[];
  cta: string;
}) {
  return (
    <Section className="pt-0">
      <Reveal>
        <SectionHeading
          eyebrow="Getting Started"
          title={title}
          description={description}
          align="center"
        />
      </Reveal>
      <div className="mx-auto mt-10 grid max-w-5xl gap-5 md:grid-cols-3">
        {steps.map((st, i) => (
          <Reveal key={st.title} delay={i * 80}>
            <div className="h-full rounded-2xl border border-gold/20 bg-gold-pale/20 p-6 text-center">
              <span className="mx-auto grid h-10 w-10 place-items-center rounded-full border-2 border-gold bg-white text-sm font-extrabold text-gold-dark dark:bg-card">
                {i + 1}
              </span>
              <h3 className="mt-4 text-base font-extrabold text-navy dark:text-white">
                {st.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{st.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={200} className="mt-8 text-center">
        <a href="#register" className="gold-btn py-3.5 text-base">
          {cta} <ArrowRight className="h-4 w-4" />
        </a>
      </Reveal>
    </Section>
  );
}
