import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, FileText } from "lucide-react";
import type { FollowUpForm } from "@/data/follow-up-forms";
import type { QuestionField } from "@/data/product-questionnaires";
import { QuestionFieldInput } from "@/components/question-field";
import { addLeadDetails, submitLead, type FollowUpPass } from "@/lib/leads";
import { amountTooLow, MIN_AMOUNT } from "@/lib/validation";

type Basics = {
  name: string;
  phone: string;
  email: string;
  city: string;
  /** Salaried, Self-Employed or NRI, from the first form. Decides which income questions appear. */
  category: string;
  productSlug: string;
  productTitle: string;
  source: string;
  amount: string;
};

type Stage = "questions" | "cibil" | "done";

const card =
  "relative overflow-hidden rounded-2xl border border-border bg-white shadow-[var(--shadow-lift)] dark:bg-card";
const inr = (n: number) => new Intl.NumberFormat("en-IN").format(n);
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
  const [answers, setAnswers] = useState<Record<string, string>>({
    applicantCategory: basics.category,
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
  const set = (key: string, value: string) => setAnswers((a) => ({ ...a, [key]: value }));

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
  const screens = [...form.steps.keys()].filter((i) => stepFields(i).length > 0);
  const position = Math.max(0, screens.indexOf(step));
  const first = screens[0] ?? 0;
  const isLast = position === screens.length - 1;

  const validate = () => {
    const missing: Record<string, string> = {};
    for (const f of stepFields(step)) {
      const typed = (answers[f.key] ?? "").trim();
      if (f.required && !typed) missing[f.key] = "Please answer this";
      else if (
        f.kind === "amount" &&
        typed &&
        amountTooLow(digits(typed), { min: MIN_AMOUNT, allowZero: f.allowZero })
      ) {
        missing[f.key] = f.allowZero
          ? `Enter 0 if none, or at least ₹${inr(MIN_AMOUNT)}`
          : `Please enter at least ₹${inr(MIN_AMOUNT)}`;
      }
    }
    setErrors(missing);
    return Object.keys(missing).length === 0;
  };

  const send = async () => {
    setSending(true);
    const lines = all
      .filter((f) => showing(f) && (answers[f.key] ?? "").trim() !== "")
      .map(
        (f) =>
          `${f.label}: ${f.kind === "amount" ? "₹" : ""}${answers[f.key]}${f.kind === "percent" ? "%" : ""}`,
      );
    const detail = ["Detailed assessment (optional second form)", ...lines].join("\n");
    const income = digits(answers["netSalary"]);
    const extras = {
      detail,
      ...(basics.category === "Salaried"
        ? { employmentType: "SALARIED" as const }
        : basics.category === "Self-Employed"
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
                {form.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{form.intro}</p>
              <p className="mt-2 text-sm font-semibold text-navy dark:text-white">{form.choice}</p>
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
            {stepFields(step).map((f) => (
              <QuestionFieldInput
                key={f.key}
                // Single-answer questions are dropdowns; the pick-several ones stay as buttons
                f={f.kind === "choice" ? { ...f, dropdown: true } : f}
                value={answers[f.key] ?? ""}
                set={set}
                error={errors[f.key]}
              />
            ))}
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
              <Link to="/cibil" className="gold-btn justify-center py-2.5 text-sm">
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
