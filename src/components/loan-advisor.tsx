import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, MessageCircle, Pencil, ShieldCheck } from "lucide-react";
import { CONTACT } from "@/data/site";
import { CONSENT_TEXT, CONSENT_VERSION, FLOWS, type Flow, type Step } from "@/data/advisor-flows";
import { normalizePhone } from "@/lib/lead-dedupe";
import { submitLead } from "@/lib/leads";

type Answers = Record<string, string>;
type Phase = "pick" | "ask" | "review" | "done";

const inr = new Intl.NumberFormat("en-IN");
const rupees = (digits: string) => (digits ? `₹${inr.format(Number(digits))}` : "");

const inputCls =
  "w-full rounded-lg border border-border bg-white px-3.5 py-3 text-base text-ink outline-none transition-all duration-300 placeholder:text-muted-foreground/70 focus:border-gold focus:ring-2 focus:ring-gold/20";
const labelCls = "block text-[10px] font-bold tracking-[0.18em] uppercase";

/** What a stored answer looks like to a person reading it. */
function show(step: Step, value: string): string {
  if (!value) return "Skipped";
  return step.kind === "amount" ? rupees(value) : value;
}

/**
 * The GCS Loan Advisor: a guided, one-question-at-a-time intake. The visitor picks what they need,
 * answers a handful of short questions, checks them, agrees to be contacted and sends. The
 * enquiry reaches the CRM as an ordinary lead with every answer written into its notes, so a GCS
 * expert can pick it up without asking the same things again. Nothing here approves or prices a
 * loan.
 */
export function LoanAdvisor() {
  const [flow, setFlow] = useState<Flow | null>(null);
  const [phase, setPhase] = useState<Phase>("pick");
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [draft, setDraft] = useState("");
  const [fixing, setFixing] = useState(false); // editing one answer from the review screen

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const steps = flow?.steps ?? [];
  const step = steps[idx];

  const answered = useMemo(
    () => steps.slice(0, phase === "ask" ? idx : steps.length).filter((s) => s.key in answers),
    [steps, idx, phase, answers],
  );

  const choose = (f: Flow) => {
    setFlow(f);
    setAnswers({});
    setIdx(0);
    setDraft("");
    setFixing(false);
    setPhase("ask");
  };

  const goTo = (i: number, fromReview = false) => {
    setIdx(i);
    setDraft(answers[steps[i]?.key ?? ""] ?? "");
    setFixing(fromReview);
    setError("");
    setPhase("ask");
  };

  const record = (value: string) => {
    if (!step) return;
    const next = { ...answers, [step.key]: value };
    setAnswers(next);
    setError("");
    if (fixing || idx + 1 >= steps.length) {
      setFixing(false);
      setPhase("review");
      return;
    }
    setIdx(idx + 1);
    setDraft(next[steps[idx + 1]!.key] ?? "");
  };

  const submitTyped = () => {
    if (!step) return;
    const v = draft.trim();
    if (!v && !step.optional) {
      setError("Please answer this, or choose Talk to a person below.");
      return;
    }
    if (step.kind === "number" && v && !Number.isFinite(Number(v))) {
      setError("Please enter a number.");
      return;
    }
    record(v);
  };

  const back = () => {
    setError("");
    if (phase === "review") return goTo(steps.length - 1);
    if (fixing) {
      setFixing(false);
      setPhase("review");
      return;
    }
    if (idx === 0) {
      setPhase("pick");
      return;
    }
    goTo(idx - 1);
  };

  const send = async () => {
    if (!flow) return;
    const cleanPhone = normalizePhone(phone);
    if (name.trim().length < 2) return setError("Please enter your name.");
    if (!cleanPhone) return setError("Please enter a valid 10-digit mobile number.");
    if (!agreed) return setError("Please tick the box to let us contact you about this enquiry.");
    setError("");
    setSending(true);

    const lines = steps
      .filter((s) => s.key in answers)
      .map((s) => `${s.label}: ${show(s, answers[s.key] ?? "")}`);
    const detail = [
      `GCS Loan Advisor — ${flow.label}`,
      ...lines,
      `Agreed to be contacted: yes (wording ${CONSENT_VERSION}, ${new Date().toISOString()})`,
    ].join("\n");

    const slug =
      flow.id === "vehicle" && answers["vehicle_condition"] === "Used" ? "used-car-loan" : flow.productSlug;
    const cityValue = answers["city"] || answers["business_city"] || answers["registration_city"] || "";
    const amountValue = answers["requested_amount"] || answers["asset_value"] || "";

    await submitLead({
      name: name.trim(),
      phone: cleanPhone,
      email: email.trim(),
      city: cityValue,
      ...(slug ? { productSlug: slug } : {}),
      ...(amountValue ? { amount: Number(amountValue) } : {}),
      source: "ai-advisor",
      detail,
    });
    setSending(false);
    setPhase("done");
  };

  const restart = () => {
    setFlow(null);
    setAnswers({});
    setIdx(0);
    setDraft("");
    setName("");
    setPhone("");
    setEmail("");
    setAgreed(false);
    setError("");
    setPhase("pick");
  };

  return (
    <div className="navy-panel relative overflow-hidden rounded-3xl p-6 shadow-[var(--shadow-lift)] sm:p-10">
      <div className="pointer-events-none absolute top-0 right-0 h-72 w-72 rounded-full bg-gold/10 blur-[100px]" />
      <div className="relative">
        {/* the one thing to remember before typing anything */}
        <p className="flex items-start gap-2 text-xs leading-relaxed text-white/60">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          Share only what is asked. Never type OTPs, passwords, PINs, PAN or Aadhaar numbers here — if
          documents are needed, our team will send a safe way to share them.
        </p>

        {phase === "pick" && (
          <div className="mt-8">
            <h2 className="tracking-normal text-2xl font-bold text-white sm:text-3xl" style={{ fontFamily: "var(--font-sans)" }}>
              Welcome to GCS. What are you looking for?
            </h2>
            <p className="mt-2 text-sm text-white/70">Pick one — a few short questions follow.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {FLOWS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => choose(f)}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-left text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/50 hover:bg-white/10"
                >
                  {f.label}
                  <ArrowRight className="h-4 w-4 shrink-0 text-gold transition-transform group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === "ask" && flow && step && (
          <div className="mt-8">
            <div className="flex items-center justify-between gap-3">
              <button type="button" onClick={back} className="inline-flex items-center gap-1.5 text-xs font-bold text-white/70 transition-colors hover:text-white">
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </button>
              <p className="text-xs font-semibold text-white/60">
                {flow.label} · question {idx + 1} of {steps.length}
              </p>
            </div>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gold transition-all duration-500" style={{ width: `${((idx + 1) / steps.length) * 100}%` }} />
            </div>

            {answered.length > 0 && !fixing && (
              <ul className="mt-6 space-y-1.5 text-sm">
                {answered.slice(-3).map((s) => (
                  <li key={s.key} className="flex flex-wrap items-baseline gap-x-2 text-white/55">
                    <span>{s.label}:</span>
                    <span className="font-semibold text-gold-light">{show(s, answers[s.key] ?? "")}</span>
                  </li>
                ))}
              </ul>
            )}

            <h2 className="mt-6 tracking-normal text-xl font-bold text-white sm:text-2xl" style={{ fontFamily: "var(--font-sans)" }}>
              {step.question}
            </h2>
            {step.hint && <p className="mt-2 text-sm text-white/65">{step.hint}</p>}

            {step.kind === "choice" ? (
              <div className="mt-5 flex flex-wrap gap-2.5">
                {step.options?.map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => record(o)}
                    className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:bg-gold/15 ${
                      answers[step.key] === o ? "border-gold bg-gold/20 text-white" : "border-white/20 bg-white/5 text-white/90"
                    }`}
                  >
                    {o}
                  </button>
                ))}
                {step.optional && (
                  <button type="button" onClick={() => record("")} className="rounded-full px-3 py-2.5 text-sm font-semibold text-white/60 underline-offset-4 hover:text-white hover:underline">
                    Skip
                  </button>
                )}
              </div>
            ) : (
              <form
                className="mt-5 max-w-md"
                onSubmit={(e) => {
                  e.preventDefault();
                  submitTyped();
                }}
              >
                <input
                  autoFocus
                  inputMode={step.kind === "text" ? "text" : "decimal"}
                  value={step.kind === "amount" ? draft.replace(/\D/g, "") : draft}
                  onChange={(e) => setDraft(step.kind === "amount" ? e.target.value.replace(/\D/g, "") : e.target.value)}
                  placeholder={step.placeholder ?? (step.kind === "amount" ? "Amount in rupees" : "")}
                  maxLength={120}
                  aria-label={step.question}
                  className={inputCls}
                />
                {step.kind === "amount" && draft && <p className="mt-2 text-sm font-semibold text-gold-light">{rupees(draft.replace(/\D/g, ""))}</p>}
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <button type="submit" className="gold-btn px-6 py-3">
                    Next <ArrowRight className="h-4 w-4" />
                  </button>
                  {step.optional && (
                    <button type="button" onClick={() => record("")} className="text-sm font-semibold text-white/60 underline-offset-4 hover:text-white hover:underline">
                      Skip
                    </button>
                  )}
                </div>
              </form>
            )}
            {error && <p className="mt-3 text-sm text-[#ffb4b4]">{error}</p>}

            <p className="mt-8 text-xs text-white/55">
              Prefer to speak to someone?{" "}
              <a href={CONTACT.whatsappLink} target="_blank" rel="noreferrer" className="font-bold text-gold-light underline-offset-4 hover:underline">
                Talk to a person on WhatsApp
              </a>
            </p>
          </div>
        )}

        {phase === "review" && flow && (
          <div className="mt-8">
            <button type="button" onClick={back} className="inline-flex items-center gap-1.5 text-xs font-bold text-white/70 transition-colors hover:text-white">
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>
            <h2 className="mt-4 tracking-normal text-xl font-bold text-white sm:text-2xl" style={{ fontFamily: "var(--font-sans)" }}>
              Check your answers
            </h2>
            <p className="mt-2 text-sm text-white/65">{flow.label}. Tap the pencil to change anything.</p>

            <ul className="mt-5 divide-y divide-white/10 rounded-2xl border border-white/15 bg-white/5">
              {steps.map((s, i) => (
                <li key={s.key} className="flex items-center gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold tracking-wide text-white/50 uppercase">{s.label}</p>
                    <p className="text-sm font-semibold text-white">{show(s, answers[s.key] ?? "")}</p>
                  </div>
                  <button type="button" onClick={() => goTo(i, true)} aria-label={`Change ${s.label}`} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-gold-light transition-colors hover:bg-white/10">
                    <Pencil className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>

            <h3 className="mt-8 tracking-normal text-base font-bold text-white">How can we reach you?</h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="adv-name" className={`${labelCls} text-white`}>Your name <span className="text-gold">*</span></label>
                <input id="adv-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" maxLength={120} className={`${inputCls} mt-1.5`} />
              </div>
              <div>
                <label htmlFor="adv-phone" className={`${labelCls} text-white`}>Mobile number <span className="text-gold">*</span></label>
                <input id="adv-phone" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" autoComplete="tel" placeholder="10-digit mobile" maxLength={16} className={`${inputCls} mt-1.5`} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="adv-email" className={`${labelCls} text-white`}>Email (optional)</label>
                <input id="adv-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" maxLength={160} className={`${inputCls} mt-1.5`} />
              </div>
            </div>

            <label className="mt-5 flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-white/75">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#e4b028]" />
              <span>{CONSENT_TEXT}</span>
            </label>
            {error && <p className="mt-3 text-sm text-[#ffb4b4]">{error}</p>}
            <button type="button" onClick={send} disabled={sending} className="gold-btn mt-6 px-6 py-3 disabled:opacity-60">
              {sending ? "Sending…" : "Send to a GCS expert"} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {phase === "done" && (
          <div className="mt-8 flex flex-col items-center py-6 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-gold/15 text-gold-light ring-1 ring-gold/30">
              <Check className="h-7 w-7" />
            </span>
            <h2 className="mt-5 tracking-normal text-xl font-bold text-white sm:text-2xl" style={{ fontFamily: "var(--font-sans)" }}>
              Thank you — we have your details.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">
              A GCS loan expert will check the options that may suit your profile and contact you. This is an enquiry, not a loan approval — a lender decides after its own assessment.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a href={CONTACT.whatsappLink} target="_blank" rel="noreferrer" className="gold-btn px-5 py-2.5">
                <MessageCircle className="h-4 w-4" /> Message us on WhatsApp
              </a>
              <button type="button" onClick={restart} className="rounded-lg border border-white/20 px-5 py-2.5 text-sm font-bold text-white/85 transition-colors hover:bg-white/10">
                Start another enquiry
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
