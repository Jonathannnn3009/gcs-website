import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { CONSENT_TEXT, CONSENT_VERSION } from "@/data/advisor-flows";
import type { QuestionField, Questionnaire } from "@/data/product-questionnaires";
import { normalizePhone } from "@/lib/lead-dedupe";
import { amountTooLow, isValidEmail, MIN_AMOUNT, MIN_LOAN_AMOUNT } from "@/lib/validation";
import { submitLead } from "@/lib/leads";

type Answers = Record<string, string>;

const field =
  "mt-1.5 w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-all duration-300 placeholder:text-muted-foreground/70 focus:border-gold focus:ring-2 focus:ring-gold/20 dark:bg-background dark:text-white";
const labelCls = "block text-[11px] font-bold tracking-[0.14em] text-navy uppercase dark:text-white";

// 5000000 -> 50,00,000 as they type
const inr = (n: number) => new Intl.NumberFormat("en-IN").format(n);
const indian = (raw: string) => {
  const digits = raw.replace(/\D/g, "");
  return digits ? Number(digits).toLocaleString("en-IN") : "";
};

/**
 * The detailed questions for a loan page, asked one screen at a time and ending with the visitor's
 * name and number. It takes the place of the short consultation form on that loan's page. Questions
 * that do not apply (for example, top-up details when only a balance transfer is wanted) stay
 * hidden. Everything is sent to the CRM as one lead, with every answer written into its notes.
 */
export function ProductQuestionnaire({
  config,
  productSlug,
  productTitle,
}: {
  config: Questionnaire;
  productSlug: string;
  productTitle: string;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const all = useMemo(() => config.steps.flatMap((s) => s.fields), [config]);
  const lastStep = config.steps.length; // the contact screen
  const set = (key: string, value: string) => setAnswers((a) => ({ ...a, [key]: value }));

  // a question shows when it has no rule, or the question it depends on is showing and has a listed answer
  const showing = (f: QuestionField, depth = 0): boolean => {
    if (!f.showWhen) return true;
    if (depth > 5) return false;
    const parent = all.find((x) => x.key === f.showWhen!.key);
    if (!parent || !showing(parent, depth + 1)) return false;
    return f.showWhen.values.includes(answers[parent.key] ?? "");
  };

  const stepFields = (i: number) => (config.steps[i]?.fields ?? []).filter((f) => showing(f));

  // screens with nothing to ask right now (for example top-up details on a transfer-only enquiry) are skipped
  const screens = [...config.steps.keys()].filter((i) => stepFields(i).length > 0).concat(lastStep);
  const position = Math.max(0, screens.indexOf(step));

  const next = () => {
    const missing: Record<string, string> = {};
    for (const f of stepFields(step)) {
      const typed = (answers[f.key] ?? "").trim();
      if (f.required && !typed) missing[f.key] = "Please answer this";
      else if (f.kind === "amount" && typed) {
        const floor = f.key === config.amountKey ? MIN_LOAN_AMOUNT : MIN_AMOUNT;
        if (amountTooLow(Number(typed.replace(/\D/g, "")), { min: floor, allowZero: f.allowZero }))
          missing[f.key] = f.allowZero
            ? `Enter 0 if none, or at least ₹${inr(floor)}`
            : `Please enter at least ₹${inr(floor)}`;
      }
    }
    setErrors(missing);
    if (Object.keys(missing).length === 0) setStep(screens[position + 1] ?? lastStep);
  };

  const send = async () => {
    const problems: Record<string, string> = {};
    const cleanPhone = normalizePhone(phone);
    if (name.trim().length < 2) problems["name"] = "Please enter your name";
    if (!cleanPhone) problems["phone"] = "Please enter a valid 10-digit mobile number";
    if (email.trim() && !isValidEmail(email)) problems["email"] = "Please enter a valid email address, like name@example.com";
    if (!agreed) problems["agreed"] = "Please tick the box so we can contact you";
    setErrors(problems);
    if (Object.keys(problems).length > 0) return;

    setSending(true);
    const lines = all
      .filter((f) => showing(f) && (answers[f.key] ?? "").trim() !== "")
      .map((f) => `${f.label}: ${f.kind === "amount" ? "₹" : ""}${answers[f.key]}${f.kind === "percent" ? "%" : ""}`);
    const detail = [
      `${productTitle}: ${config.topic}`,
      ...lines,
      `Agreed to be contacted: yes (wording ${CONSENT_VERSION}, ${new Date().toISOString()})`,
    ].join("\n");
    const amount = Number((answers[config.amountKey] ?? "").replace(/\D/g, ""));
    await submitLead({
      name: name.trim(),
      phone: cleanPhone!,
      email: email.trim(),
      productSlug,
      ...(amount > 0 ? { amount } : {}),
      source: `questionnaire-${productSlug}`,
      detail,
    });
    setSending(false);
    setDone(true);
  };

  const chip = (selected: boolean) =>
    `rounded-full border px-3.5 py-2 text-[13px] font-semibold transition-all duration-200 ${
      selected
        ? "border-navy bg-navy text-white dark:border-gold dark:bg-gold dark:text-navy"
        : "border-border bg-white text-navy hover:border-gold hover:bg-gold-pale/30 dark:bg-card dark:text-white"
    }`;

  const render = (f: QuestionField) => {
    const value = answers[f.key] ?? "";
    return (
      <div key={f.key}>
        <p className={labelCls}>
          {f.label}
          {f.required ? <span className="text-gold-dark"> *</span> : null}
        </p>
        {f.help ? <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{f.help}</p> : null}
        {f.kind === "choice" && f.dropdown && (
          <select
            value={value}
            onChange={(e) => set(f.key, e.target.value)}
            className={`${field} cursor-pointer`}
            aria-label={f.label}
          >
            <option value="">Select</option>
            {f.options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        )}
        {f.kind === "choice" && !f.dropdown && (
          <div className="mt-2 flex flex-wrap gap-2">
            {f.options.map((o) => (
              <button
                key={o}
                type="button"
                aria-pressed={value === o}
                onClick={() => set(f.key, value === o && !f.required ? "" : o)}
                className={chip(value === o)}
              >
                {o}
              </button>
            ))}
          </div>
        )}
        {f.kind === "multi" && (
          <div className="mt-2 flex flex-wrap gap-2">
            {f.options.map((o) => {
              const picked = value ? value.split(", ") : [];
              const on = picked.includes(o);
              return (
                <button
                  key={o}
                  type="button"
                  aria-pressed={on}
                  onClick={() => set(f.key, (on ? picked.filter((p) => p !== o) : [...picked, o]).join(", "))}
                  className={chip(on)}
                >
                  {o}
                </button>
              );
            })}
          </div>
        )}
        {f.kind === "text" &&
          (f.long ? (
            <textarea
              rows={2}
              value={value}
              maxLength={300}
              onChange={(e) => set(f.key, e.target.value)}
              placeholder={f.placeholder}
              className={field}
              aria-label={f.label}
            />
          ) : (
            <input
              value={value}
              maxLength={120}
              onChange={(e) => set(f.key, e.target.value)}
              placeholder={f.placeholder}
              className={field}
              aria-label={f.label}
            />
          ))}
        {f.kind === "amount" && (
          <div className="relative">
            <span className="pointer-events-none absolute top-[0.85rem] left-3.5 text-sm text-muted-foreground">₹</span>
            <input
              inputMode="numeric"
              value={value}
              onChange={(e) => set(f.key, indian(e.target.value))}
              placeholder={f.placeholder}
              className={`${field} pl-8`}
              aria-label={f.label}
            />
          </div>
        )}
        {f.kind === "percent" && (
          <div className="relative">
            <input
              inputMode="decimal"
              value={value}
              onChange={(e) => set(f.key, e.target.value.replace(/[^\d.]/g, "").slice(0, 5))}
              placeholder="e.g. 9.25"
              className={`${field} pr-9`}
              aria-label={f.label}
            />
            <span className="pointer-events-none absolute top-[0.85rem] right-3.5 text-sm text-muted-foreground">%</span>
          </div>
        )}
        {errors[f.key] ? <p className="mt-1 text-xs text-destructive">{errors[f.key]}</p> : null}
      </div>
    );
  };

  if (done) {
    return (
      <div id="apply" className="scroll-mt-28 rounded-2xl border border-gold/30 bg-white p-7 text-center shadow-[var(--shadow-card)] dark:bg-card">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-gold-pale/70 text-gold-dark dark:bg-gold/15">
          <Check className="h-6 w-6" />
        </span>
        <h3 className="mt-4 text-lg font-bold text-navy dark:text-white" style={{ letterSpacing: "0" }}>
          Thank you. We have your details.
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          A GCS loan expert will go through your answers and contact you. This is an enquiry, not a loan approval. A
          lender decides after its own checks.
        </p>
      </div>
    );
  }

  const onContact = step === lastStep;
  const current = config.steps[step];

  return (
    <div id="apply" className="scroll-mt-28 rounded-2xl border border-border bg-white p-6 shadow-[var(--shadow-card)] sm:p-7 dark:bg-card">
      <p className="mb-2 text-xs text-muted-foreground italic">
        Just a few steps to understand you better, so we can give you the right information faster.
      </p>
      <p className="text-[11px] font-bold tracking-[0.2em] text-gold-dark uppercase">{productTitle}</p>
      <h3 className="mt-1.5 text-xl font-extrabold text-navy dark:text-white" style={{ letterSpacing: "0" }}>
        {config.title}
      </h3>
      {step === 0 && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{config.intro}</p>}

      <div className="mt-4 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
          <div className="h-full rounded-full bg-gold transition-all duration-500" style={{ width: `${((position + 1) / screens.length) * 100}%` }} />
        </div>
        <span className="text-xs font-semibold text-muted-foreground">
          {position + 1} of {screens.length}
        </span>
      </div>

      {!onContact && current ? (
        <div className="mt-5 space-y-5">
          <h4 className="text-[15px] font-bold text-navy dark:text-white" style={{ letterSpacing: "0" }}>
            {current.title}
          </h4>
          {current.help ? <p className="-mt-3 text-xs leading-relaxed text-muted-foreground">{current.help}</p> : null}
          {stepFields(step).map(render)}
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          <h4 className="text-[15px] font-bold text-navy dark:text-white" style={{ letterSpacing: "0" }}>
            {config.finalTitle}
          </h4>
          <p className="-mt-2 text-xs leading-relaxed text-muted-foreground">{config.finalText}</p>
          <div>
            <label htmlFor="q-name" className={labelCls}>
              Your name <span className="text-gold-dark">*</span>
            </label>
            <input id="q-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" maxLength={120} className={field} />
            {errors["name"] ? <p className="mt-1 text-xs text-destructive">{errors["name"]}</p> : null}
          </div>
          <div>
            <label htmlFor="q-phone" className={labelCls}>
              Mobile number <span className="text-gold-dark">*</span>
            </label>
            <input id="q-phone" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" autoComplete="tel" placeholder="10-digit mobile" maxLength={16} className={field} />
            {errors["phone"] ? <p className="mt-1 text-xs text-destructive">{errors["phone"]}</p> : null}
          </div>
          <div>
            <label htmlFor="q-email" className={labelCls}>
              Email (optional)
            </label>
            <input id="q-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" maxLength={160} className={field} />
            {errors["email"] ? <p className="mt-1 text-xs text-destructive">{errors["email"]}</p> : null}
          </div>
          <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-muted-foreground">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#e4b028]" />
            <span>{CONSENT_TEXT}</span>
          </label>
          {errors["agreed"] ? <p className="text-xs text-destructive">{errors["agreed"]}</p> : null}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between gap-3">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => {
              setErrors({});
              setStep(screens[position - 1] ?? 0);
            }}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-navy hover:text-gold-dark dark:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        ) : (
          <span />
        )}
        {onContact ? (
          <button type="button" onClick={send} disabled={sending} className="gold-btn py-3 text-sm disabled:opacity-60">
            {sending ? "Sending…" : config.button} <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button type="button" onClick={next} className="gold-btn py-3 text-sm">
            Next <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      <p className="mt-5 border-t border-dashed border-border pt-4 text-[11px] leading-relaxed text-muted-foreground">
        {config.disclaimer}
      </p>
    </div>
  );
}
