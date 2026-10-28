import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, FileText } from "lucide-react";
import type { FollowUpForm } from "@/data/follow-up-forms";
import type { QuestionField } from "@/data/product-questionnaires";
import { fieldCls, QuestionFieldInput } from "@/components/question-field";
import { addLeadDetails, submitLead, type FollowUpPass } from "@/lib/leads";
import { amountProblem, fieldAmountBounds, ratePercentProblem } from "@/lib/validation";

type Basics = {
  name: string;
  phone: string;
  email: string;
  city: string;
  /** Salaried, Self-Employed or NRI, from the first form. Decides which income questions appear. */
  category: string;
  /** The industry picked on the short form, where it asks for one. */
  industry?: string;
  productSlug: string;
  productTitle: string;
  source: string;
  amount: string;
};

type Stage = "questions" | "cibil" | "done";

const card =
  "relative overflow-hidden rounded-2xl border border-border bg-white shadow-[var(--shadow-lift)] dark:bg-card";
const digits = (v: string | undefined) => Number((v ?? "").replace(/\D/g, ""));

/**
 * What follows the short enquiry form. The detailed questions open straight away, with a skip link
 * (the visitor's choice), then, whether they answered or skipped, a reminder about the CIBIL report. The details join the same
 * lead, and nothing the short form already asked is asked again.
 */
export function FollowUpFlow({
  form,
  pass,
  basics,
  firstDetail,
}: {
  form: FollowUpForm;
  pass: FollowUpPass | null;
  basics: Basics;
  firstDetail: string;
}) {
  const [stage, setStage] = useState<Stage>("questions");
  const [step, setStep] = useState(0);
  // What the short form already told us is carried in, so it is not asked again.
  const [answers, setAnswers] = useState<Record<string, string>>({
    applicantCategory: basics.category,
    ...(basics.category ? { applicantType: basics.category } : {}),
    ...(basics.industry ? { nature: basics.industry } : {}),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [shared, setShared] = useState(false);
  const [cibilLater, setCibilLater] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  // Each step starts at the top. The page wraps this card in the one scroll area (the consultation form's).
  useEffect(() => {
    scroller.current?.closest<HTMLElement>(".gcs-scroll")?.scrollTo({ top: 0 });
  }, [step]);

  const all = useMemo(() => form.steps.flatMap((s) => s.fields), [form]);
  // Questions appear one after another: the next shows once the one before is answered (or skipped).
  // A choice counts as answered the moment it is picked; a typed answer waits for "Next question".
  const [done, setDone] = useState<Set<string>>(new Set());
  const markDone = (key: string) => setDone((d) => new Set(d).add(key));
  // A drop-down of kinds (a profession, a purpose, a type of property) always ends in "Other", with a box to say what.
  // Drop-downs of yes or no, of amounts of time, of how often, and short either-or choices are not kinds, so they do not.
  const hasOwnOther = (f: QuestionField) =>
    all.some(
      (x) => x.kind === "text" && x.showWhen?.key === f.key && x.showWhen.values.includes("Other"),
    );
  const isScale = (f: QuestionField) =>
    f.kind === "choice" &&
    f.options.some(
      (o) =>
        /\d/.test(o) ||
        /^(Yes|No)\b/i.test(o) ||
        /^(Within|Later|Immediately|Just exploring)/i.test(o) ||
        /^(Every|Always|Mostly|Never|A few|Nothing|None)\b/i.test(o),
    );
  const takesOther = (f: QuestionField) =>
    f.kind === "choice" &&
    !f.noOther &&
    !hasOwnOther(f) &&
    (f.options.includes("Other") || (!isScale(f) && f.options.length >= 4));
  const shown = (f: QuestionField): QuestionField =>
    f.kind === "choice"
      ? {
          ...f,
          dropdown: true,
          // "Other" always comes last.
          options: takesOther(f) ? [...f.options.filter((o) => o !== "Other"), "Other"] : f.options,
        }
      : f;
  const saidOther = (f: QuestionField) =>
    takesOther(f) && answers[f.key] === "Other" ? (answers[`${f.key}__other`] ?? "").trim() : "";

  const set = (key: string, value: string) => {
    setAnswers((a) => ({ ...a, [key]: value }));
    setErrors((e) => {
      const { [key]: _gone, ...rest } = e;
      return rest;
    });
    const f = all.find((x) => x.key === key);
    if (f && f.kind === "choice" && value) markDone(key);
  };

  // A question shows when it has no rule, or the answer it depends on is one of the listed values.
  // The applicant type comes from the short form, so it is read as an answer without being a field.
  const showing = (f: QuestionField, depth = 0): boolean => {
    if (!f.showWhen) return true;
    if (depth > 5) return false;
    const parent = all.find((x) => x.key === f.showWhen!.key);
    if (parent && !showing(parent, depth + 1)) return false;
    return f.showWhen.values.includes(answers[f.showWhen.key] ?? "");
  };
  const stepFields = (i: number) => (form.steps[i]?.fields ?? []).filter((f) => showing(f));
  // The questions of a step that are on screen: every answered one, and the first one still open.
  const revealed = (i: number) => {
    const out: QuestionField[] = [];
    for (const f of stepFields(i)) {
      out.push(f);
      const answered = f.kind === "choice" && !!answers[f.key];
      if (!(done.has(f.key) || answered)) break;
    }
    return out;
  };
  const screens = [...form.steps.keys()].filter((i) => stepFields(i).length > 0);
  const position = Math.max(0, screens.indexOf(step));
  const first = screens[0] ?? 0;
  const isLast = position === screens.length - 1;

  // Why a typed answer cannot be accepted (a figure that is not realistic, say), or null when it is fine.
  const problem = (f: QuestionField): string | null => {
    const typed = (answers[f.key] ?? "").trim();
    if (f.required && !typed) return "Please answer this";
    if (!typed) return null;
    if (f.kind === "amount")
      return amountProblem(digits(typed), fieldAmountBounds(f.key), { allowZero: f.allowZero });
    if (f.kind === "percent") return ratePercentProblem(Number(typed));
    if (takesOther(f) && typed === "Other" && !saidOther(f)) return "Please tell us what it is";
    return null;
  };

  const validate = () => {
    const missing: Record<string, string> = {};
    for (const f of revealed(step)) {
      const msg = problem(f);
      if (msg) missing[f.key] = msg;
    }
    setErrors(missing);
    return Object.keys(missing).length === 0;
  };

  // A typed answer moves on to the next question only once it is realistic.
  const confirm = (f: QuestionField) => {
    const msg = problem(f);
    setErrors((e) => {
      const { [f.key]: _gone, ...rest } = e;
      return msg ? { ...rest, [f.key]: msg } : rest;
    });
    if (!msg) markDone(f.key);
  };

  const send = async () => {
    setSending(true);
    const lines = all
      .filter((f) => showing(f) && (answers[f.key] ?? "").trim() !== "")
      .map(
        (f) =>
          `${f.label}: ${f.kind === "amount" ? "₹" : ""}${saidOther(f) ? `Other (${saidOther(f)})` : answers[f.key]}${f.kind === "percent" ? "%" : ""}`,
      );
    const detail = ["Detailed assessment (optional second form)", ...lines].join("\n");
    const applicant = answers["applicantType"] || answers["applicantCategory"] || basics.category;
    const income = digits(answers["netSalary"]);
    const extras = {
      detail,
      ...(applicant === "Salaried"
        ? { employmentType: "SALARIED" as const }
        : applicant === "Self-Employed"
          ? { employmentType: "SELF_EMPLOYED" as const }
          : {}),
      ...(income > 0 ? { monthlyIncome: income } : {}),
    };
    const ok = pass ? await addLeadDetails(pass, extras) : false;
    if (!ok) {
      // No pass (the first form was queued) or it expired: send everything again as one fuller enquiry.
      await submitLead({
        name: basics.name,
        phone: basics.phone,
        email: basics.email,
        city: basics.city,
        productSlug: basics.productSlug,
        amount: basics.amount,
        source: basics.source,
        detail: `${firstDetail}\n${detail}`,
      });
    }
    setSending(false);
    setShared(true);
    setStage("cibil");
  };

  const tick = (
    <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-gold-pale/70 text-gold-dark dark:bg-gold/15">
      <Check className="h-5 w-5" />
    </span>
  );

  if (stage === "questions") {
    const current = form.steps[step];
    return (
      <div className={card}>
        <div className="h-1 bg-gradient-to-r from-navy via-navy-soft to-gold" />
        <div ref={scroller} className="p-6 sm:p-7">
          <p className="flex items-center gap-2 text-sm font-semibold text-navy dark:text-white">
            <Check className="h-4 w-4 text-gold-dark" /> Thank you, {basics.name.split(" ")[0]}. We
            have your enquiry.
          </p>
          <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground italic">
            {form.reason}
          </p>
          {position === 0 ? (
            <>
              <h3 className="mt-4 font-heading text-[1.3rem] leading-tight font-bold text-navy dark:text-white">
                Tell Us About You. <span className="hero-stat-text">We’ll Find the Right Fit.</span>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Complete this quick form to help us understand your needs. Based on your details, we’ll explore
                suitable Banks &amp; NBFCs and compare available loan terms for your profile.
              </p>
              <p className="mt-2 text-sm font-semibold text-navy dark:text-white">{form.choice}</p>
              <div className="mt-4 flex flex-col gap-3 rounded-xl border border-gold/30 bg-gold-pale/30 p-4 dark:bg-gold/10">
                <p className="flex items-start gap-2 text-[13px] leading-relaxed text-navy dark:text-white">
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" />
                  <span>
                    <strong>Your CIBIL report</strong> helps our experts understand your credit
                    profile and make a more accurate assessment. Get it now, or share it later.
                  </span>
                </p>
                <Link
                  to="/cibil"
                  target="_blank"
                  className="gold-btn cibil-btn justify-center py-2.5 text-sm"
                >
                  Get my CIBIL report <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </>
          ) : null}
          <p className="mt-4 text-[11px] font-bold tracking-[0.2em] text-gold-dark uppercase">
            {basics.productTitle}: detailed assessment
          </p>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-gold transition-all duration-500"
                style={{ width: `${((position + 1) / screens.length) * 100}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-muted-foreground">
              {position + 1} of {screens.length}
            </span>
          </div>

          <div className="mt-5 space-y-5">
            <h4
              className="text-[15px] font-bold text-navy dark:text-white"
              style={{ letterSpacing: "0" }}
            >
              {current?.title}
            </h4>
            {current?.help ? (
              <p className="-mt-3 text-xs leading-relaxed text-muted-foreground">{current.help}</p>
            ) : null}
            {revealed(step).map((f) => {
              const typed = (answers[f.key] ?? "").trim() !== "";
              const open = !done.has(f.key) && !(f.kind === "choice" && typed);
              return (
                <div
                  key={f.key}
                  className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && open && e.target instanceof HTMLInputElement) {
                      e.preventDefault();
                      if (typed) confirm(f);
                    }
                  }}
                >
                  <QuestionFieldInput
                    // Single-answer questions are dropdowns; the pick-several ones stay as buttons
                    f={shown(f)}
                    value={answers[f.key] ?? ""}
                    set={set}
                    error={errors[f.key]}
                  />
                  {takesOther(f) && answers[f.key] === "Other" ? (
                    <input
                      value={answers[`${f.key}__other`] ?? ""}
                      maxLength={120}
                      onChange={(e) => set(`${f.key}__other`, e.target.value)}
                      placeholder="Please tell us"
                      className={fieldCls}
                      aria-label={`${f.label}: please tell us`}
                    />
                  ) : null}
                  {f.kind === "amount" &&
                  f.softMin &&
                  typed &&
                  !errors[f.key] &&
                  digits(answers[f.key]) < f.softMin.amount ? (
                    <p className="mt-2 rounded-lg border border-gold/30 bg-gold-pale/30 px-3 py-2 text-xs leading-relaxed text-navy dark:bg-gold/10 dark:text-white">
                      {f.softMin.note}
                    </p>
                  ) : null}
                  {open && (typed || !f.required) ? (
                    <div className="mt-2 flex items-center gap-4">
                      {typed && f.kind !== "choice" ? (
                        <button
                          type="button"
                          onClick={() => confirm(f)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-navy hover:text-gold-dark dark:text-white"
                        >
                          Next question <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      ) : null}
                      {!f.required ? (
                        <button
                          type="button"
                          onClick={() => markDone(f.key)}
                          className="text-xs font-semibold text-muted-foreground underline-offset-4 hover:text-navy hover:underline"
                        >
                          Skip this question
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            {position > 0 ? (
              <button
                type="button"
                onClick={() => {
                  setErrors({});
                  setStep(screens[position - 1] ?? first);
                }}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-navy hover:text-gold-dark dark:text-white"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            ) : (
              <span />
            )}
            {isLast ? (
              <button
                type="button"
                disabled={sending}
                onClick={() => validate() && void send()}
                className="gold-btn py-3 text-sm disabled:opacity-60"
              >
                {sending ? "Sending…" : form.submit} <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => validate() && setStep(screens[position + 1] ?? step)}
                className="gold-btn py-3 text-sm"
              >
                Next <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setStage("cibil")}
            className="mt-4 w-full text-center text-xs font-bold text-muted-foreground underline-offset-4 hover:text-navy hover:underline"
          >
            {form.skip}
          </button>
          <p className="mt-4 border-t border-dashed border-border pt-4 text-[11px] leading-relaxed text-muted-foreground">
            {form.disclaimer}
          </p>
        </div>
      </div>
    );
  }

  if (stage === "cibil") {
    return (
      <div className={card}>
        <div className="h-1 bg-gradient-to-r from-navy via-navy-soft to-gold" />
        <div className="p-6 text-center sm:p-7">
          {tick}
          <p className="mt-3 text-sm font-semibold text-navy dark:text-white">
            {shared
              ? "Thank you. Your details are with our experts."
              : "Your enquiry is with our experts."}
          </p>
          <div className="mt-5 rounded-xl border border-gold/30 bg-gold-pale/30 p-4 text-left dark:bg-gold/10">
            <p className="flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] text-gold-dark uppercase">
              <FileText className="h-3.5 w-3.5" /> One more thing: your CIBIL report
            </p>
            <p className="mt-2 text-sm leading-relaxed text-navy dark:text-white">
              Your CIBIL report helps our experts understand your credit profile and make a more
              accurate preliminary loan assessment. Keep it handy, or get it now. If it is not
              readily available, you can share it later.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Link to="/cibil" className="gold-btn cibil-btn justify-center py-2.5 text-sm">
                Get my CIBIL report <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={() => {
                  setCibilLater(true);
                  setStage("done");
                }}
                className="rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-bold text-navy hover:border-gold dark:bg-card dark:text-white"
              >
                I will share it later
              </button>
            </div>
          </div>
          <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
            A GCS expert will contact you within one business day. This is an enquiry, not a loan
            approval.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={card}>
      <div className="h-1 bg-gradient-to-r from-navy via-navy-soft to-gold" />
      <div className="p-6 text-center sm:p-7">
        {tick}
        <h3
          className="mt-3 text-lg font-bold text-navy dark:text-white"
          style={{ letterSpacing: "0" }}
        >
          All set. We will be in touch.
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          A GCS expert will go through what you shared and call you within one business day.
          {cibilLater ? " You can send your CIBIL report to them later, whenever it is ready." : ""}
        </p>
        <Link
          to="/cibil"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-navy underline-offset-4 hover:underline dark:text-white"
        >
          Request your CIBIL report <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
