import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useId, useState } from "react";
import QRCode from "qrcode";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileSearch,
  Gauge,
  Lock,
  MessageCircle,
  Smartphone,
} from "lucide-react";
import { Section } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { submitLead } from "@/lib/leads";
import { CONTACT } from "@/data/site";
import {
  BUREAUS,
  LAST_PULLED_OPTIONS,
  REPORT_PRICE,
  UPI_IS_PLACEHOLDER,
  upiLink,
  type Bureau,
  type BureauId,
  type LastPulled,
} from "@/data/cibil";
import { useBureaus, useLastPulled } from "@/lib/page-lists";

export const Route = createFileRoute("/cibil")({
  head: () => ({
    meta: [
      { title: "Get Your CIBIL & Credit Report | Growth Capital Services" },
      {
        name: "description",
        content:
          "Request your TransUnion CIBIL, Experian, Equifax or CRIF High Mark credit report through Growth Capital Services. Pick your bureau, pay by UPI QR, share your details, and we pull it for you.",
      },
      { property: "og:title", content: "Get Your CIBIL & Credit Report" },
      {
        property: "og:description",
        content: "Choose your credit bureau, pay by UPI QR and we'll fetch your report for you.",
      },
    ],
  }),
  component: CibilPage,
});

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-all duration-300 placeholder:text-muted-foreground/70 focus:border-gold focus:ring-2 focus:ring-gold/20 dark:bg-card dark:text-white";
const labelClass =
  "block text-[10px] font-bold tracking-[0.18em] text-navy uppercase dark:text-white";

const PHONE_RE = /^(?:\+?91[-\s]?|0)?[6-9]\d{9}$/;
const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const PIN_RE = /^[1-9]\d{5}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UTR_RE = /^\d{12}$/;

const STEP_LABELS = ["Your details", "Bureau", "Last report", "Payment"];

type Step = 1 | 2 | 3 | 4;

type Details = {
  fullName: string;
  pan: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  pincode: string;
  consent: string;
};
const emptyDetails: Details = {
  fullName: "",
  pan: "",
  dob: "",
  gender: "",
  phone: "",
  email: "",
  address: "",
  pincode: "",
  consent: "",
};

function UpiQr({ amount, note }: { amount: number; note: string }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    QRCode.toString(upiLink(amount, note), {
      type: "svg",
      margin: 1,
      color: { dark: "#0B1849", light: "#FFFFFF" },
    })
      .then((svg) => {
        if (!cancelled) setSrc(`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`);
      })
      .catch(() => {
        if (!cancelled) setSrc(null);
      });
    return () => {
      cancelled = true;
    };
  }, [amount, note]);

  return (
    <div className="mx-auto grid h-56 w-56 place-items-center rounded-2xl border border-border bg-white p-3 shadow-[var(--shadow-lift)]">
      {src ? (
        <img src={src} alt={`UPI QR code to pay ₹${amount}`} className="h-full w-full" />
      ) : (
        <span className="text-xs text-neutral-400">Generating QR…</span>
      )}
    </div>
  );
}

function StepIndicator({ step }: { step: Step }) {
  return (
    <ol className="flex items-center gap-2 sm:gap-3" aria-label="Progress">
      {STEP_LABELS.map((label, i) => {
        const n = (i + 1) as Step;
        const done = step > n;
        const active = step === n;
        return (
          <li key={label} className="flex min-w-0 flex-1 items-center gap-2">
            <span
              className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors ${
                done
                  ? "bg-gold text-navy"
                  : active
                    ? "bg-navy text-gold-light"
                    : "bg-white text-muted-foreground ring-1 ring-navy/15"
              }`}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : n}
            </span>
            <span
              className={`hidden truncate text-xs font-semibold sm:block ${
                active ? "text-navy dark:text-white" : "text-muted-foreground"
              }`}
            >
              {label}
            </span>
            {n < STEP_LABELS.length && <span className="h-0.5 flex-1 rounded-full bg-navy/20" />}
          </li>
        );
      })}
    </ol>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="h-3.5 w-3.5" /> Back
    </button>
  );
}

function CibilFlow() {
  const BUREAU_LIST = useBureaus();
  const LAST_PULLED_LIST = useLastPulled();
  const uid = useId();
  const [step, setStep] = useState<Step>(1);
  const [bureauId, setBureauId] = useState<BureauId | null>(null);
  const [lastPulled, setLastPulled] = useState<LastPulled | null>(null);
  const [utr, setUtr] = useState("");
  const [utrError, setUtrError] = useState("");
  const [details, setDetails] = useState<Details>(emptyDetails);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const bureau: Bureau | undefined = BUREAU_LIST.find((b) => b.id === bureauId) as Bureau | undefined;
  const lastPulledLabel = LAST_PULLED_LIST.find((o) => o.id === lastPulled)?.label ?? "";

  const setField =
    (key: keyof Details) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const raw = e.target.value;
      const value = key === "pan" ? raw.toUpperCase() : raw;
      setDetails((d) => ({ ...d, [key]: value }));
    };

  const reset = () => {
    setStep(1);
    setBureauId(null);
    setLastPulled(null);
    setUtr("");
    setUtrError("");
    setDetails(emptyDetails);
    setErrors({});
    setDone(false);
  };

  const detailLines = () => [
    `Name: ${details.fullName.trim()}`,
    `PAN: ${details.pan.trim()}`,
    `DOB: ${details.dob}`,
    `Gender: ${details.gender}`,
    `Email: ${details.email.trim()}`,
    `Address: ${details.address.trim()}, ${details.pincode.trim()}`,
  ];

  // Step 1 -> 2: capture the lead as soon as the details are in, before any payment.
  const onSubmitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (details.fullName.trim().length < 2) next["fullName"] = "Enter your full name as on PAN";
    if (!PAN_RE.test(details.pan.trim())) next["pan"] = "Enter a valid PAN, e.g. ABCDE1234F";
    if (!details.dob) next["dob"] = "Select your date of birth";
    if (!details.gender) next["gender"] = "Select your gender";
    if (!PHONE_RE.test(details.phone.replace(/[\s-]/g, "")))
      next["phone"] = "Enter a valid 10-digit mobile number";
    if (!EMAIL_RE.test(details.email.trim())) next["email"] = "Enter a valid email address";
    if (details.address.trim().length < 8) next["address"] = "Enter your full residential address";
    if (!PIN_RE.test(details.pincode.trim())) next["pincode"] = "Enter a valid 6-digit pincode";
    if (details.consent !== "yes") next["consent"] = "Please confirm to continue";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    await submitLead({
      name: details.fullName.trim(),
      phone: details.phone.trim(),
      email: details.email.trim(),
      source: "cibil-report-request",
      detail: ["Stage: details captured, payment pending", ...detailLines()].join(" | "),
    });
    setSubmitting(false);
    setStep(2);
  };

  // Step 4: payment done -> capture the lead again, now with bureau, amount and UTR.
  const confirmPayment = async () => {
    if (!bureau) return;
    if (!UTR_RE.test(utr.trim())) {
      setUtrError("Enter the 12-digit UPI transaction / UTR number from your payment app");
      return;
    }
    setUtrError("");
    setSubmitting(true);
    await submitLead({
      name: details.fullName.trim(),
      phone: details.phone.trim(),
      email: details.email.trim(),
      source: "cibil-report-request",
      detail: [
        "Stage: payment submitted",
        `Bureau: ${bureau.name}`,
        `Last report taken: ${lastPulledLabel}`,
        `Paid: ₹${REPORT_PRICE}`,
        `UTR: ${utr.trim()}`,
        ...detailLines(),
      ].join(" | "),
    });
    setSubmitting(false);
    setDone(true);
  };

  if (done && bureau) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-[#BCCBEE] bg-[#E1EAFB] p-8 text-center sm:p-10 dark:bg-card">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-gold-pale/70 text-gold-dark dark:bg-gold/15">
          <Check className="h-7 w-7" />
        </span>
        <h3 className="mt-5 text-xl font-extrabold text-navy dark:text-white">
          Request received — we'll take it from here.
        </h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          We'll verify your payment and pull your {bureau.name} report, then share it with you on
          the mobile number and email you gave us. If anything is unclear we'll call you first.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a
            href={CONTACT.whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-navy-light"
          >
            <MessageCircle className="h-4 w-4" /> Message us on WhatsApp
          </a>
          <button
            type="button"
            onClick={reset}
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-bold text-navy transition-colors hover:bg-gold/5 dark:text-white"
          >
            Request another report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#BCCBEE] bg-[#E1EAFB] p-5 shadow-[var(--shadow-lift)] sm:p-8 dark:bg-card">
      <StepIndicator step={step} />

      {/* Step 1 — details */}
      {step === 1 && (
        <form onSubmit={onSubmitDetails} noValidate className="mt-8">
          <h3 className="text-xl font-extrabold text-navy dark:text-white">First, your details</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            We need these to pull your report. Enter them exactly as they appear on your PAN card
            and records, or the bureau may not find your file.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor={`${uid}-name`} className={labelClass}>
                Full name (as on PAN) <span className="text-gold">*</span>
              </label>
              <input
                id={`${uid}-name`}
                className={fieldClass}
                value={details.fullName}
                onChange={setField("fullName")}
                maxLength={100}
              />
              {errors["fullName"] && (
                <span className="mt-1 block text-xs text-destructive">{errors["fullName"]}</span>
              )}
            </div>
            <div>
              <label htmlFor={`${uid}-pan`} className={labelClass}>
                PAN <span className="text-gold">*</span>
              </label>
              <input
                id={`${uid}-pan`}
                className={fieldClass}
                value={details.pan}
                onChange={setField("pan")}
                placeholder="ABCDE1234F"
                maxLength={10}
                autoCapitalize="characters"
              />
              {errors["pan"] && (
                <span className="mt-1 block text-xs text-destructive">{errors["pan"]}</span>
              )}
            </div>
            <div>
              <label htmlFor={`${uid}-dob`} className={labelClass}>
                Date of birth <span className="text-gold">*</span>
              </label>
              <input
                id={`${uid}-dob`}
                type="date"
                className={fieldClass}
                value={details.dob}
                onChange={setField("dob")}
                max={new Date().toISOString().slice(0, 10)}
              />
              {errors["dob"] && (
                <span className="mt-1 block text-xs text-destructive">{errors["dob"]}</span>
              )}
            </div>
            <div>
              <label htmlFor={`${uid}-gender`} className={labelClass}>
                Gender <span className="text-gold">*</span>
              </label>
              <select
                id={`${uid}-gender`}
                className={`${fieldClass} cursor-pointer appearance-none`}
                value={details.gender}
                onChange={setField("gender")}
              >
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
              {errors["gender"] && (
                <span className="mt-1 block text-xs text-destructive">{errors["gender"]}</span>
              )}
            </div>
            <div>
              <label htmlFor={`${uid}-phone`} className={labelClass}>
                Mobile <span className="text-gold">*</span>
              </label>
              <input
                id={`${uid}-phone`}
                className={fieldClass}
                value={details.phone}
                onChange={setField("phone")}
                placeholder="10-digit mobile"
                inputMode="tel"
                maxLength={15}
              />
              {errors["phone"] && (
                <span className="mt-1 block text-xs text-destructive">{errors["phone"]}</span>
              )}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor={`${uid}-email`} className={labelClass}>
                Email <span className="text-gold">*</span>
              </label>
              <input
                id={`${uid}-email`}
                type="email"
                className={fieldClass}
                value={details.email}
                onChange={setField("email")}
                maxLength={120}
              />
              {errors["email"] && (
                <span className="mt-1 block text-xs text-destructive">{errors["email"]}</span>
              )}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor={`${uid}-address`} className={labelClass}>
                Residential address <span className="text-gold">*</span>
              </label>
              <textarea
                id={`${uid}-address`}
                rows={2}
                className={fieldClass}
                value={details.address}
                onChange={setField("address")}
                maxLength={250}
              />
              {errors["address"] && (
                <span className="mt-1 block text-xs text-destructive">{errors["address"]}</span>
              )}
            </div>
            <div>
              <label htmlFor={`${uid}-pin`} className={labelClass}>
                Pincode <span className="text-gold">*</span>
              </label>
              <input
                id={`${uid}-pin`}
                className={fieldClass}
                value={details.pincode}
                onChange={setField("pincode")}
                inputMode="numeric"
                maxLength={6}
              />
              {errors["pincode"] && (
                <span className="mt-1 block text-xs text-destructive">{errors["pincode"]}</span>
              )}
            </div>
          </div>

          <label className="mt-5 flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-muted-foreground">
            <input
              type="checkbox"
              checked={details.consent === "yes"}
              onChange={(e) =>
                setDetails((d) => ({ ...d, consent: e.target.checked ? "yes" : "" }))
              }
              className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--gold)]"
            />
            <span>
              I authorise Growth Capital Services to retrieve my credit report on my behalf and
              confirm the details above are correct.
            </span>
          </label>
          {errors["consent"] && (
            <span className="mt-1 block text-xs text-destructive">{errors["consent"]}</span>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-navy px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-navy-light disabled:opacity-60"
          >
            {submitting ? "Saving…" : "Continue"} <ArrowRight className="h-4 w-4" />
          </button>
          <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Lock className="h-3 w-3" /> Your details are used only to fetch your report.
          </p>
        </form>
      )}

      {/* Step 2 — bureau */}
      {step === 2 && (
        <div className="mt-8">
          <BackButton onClick={() => setStep(1)} />
          <h3 className="mt-3 text-xl font-extrabold text-navy dark:text-white">
            Which credit bureau's report do you need?
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Pick the credit bureau whose report you want.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {BUREAU_LIST.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => {
                  setBureauId(b.id);
                  setLastPulled(null);
                  setStep(3);
                }}
                className="group flex items-start gap-3 rounded-xl border border-border bg-bg-light p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-[var(--shadow-lift)] dark:bg-background"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gold-pale/60 text-gold-dark transition-colors group-hover:bg-gold group-hover:text-navy dark:bg-gold/15">
                  <Gauge className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-extrabold text-navy dark:text-white">
                    {b.name}
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                    {b.blurb}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3 — when they last took a report (for our records) */}
      {step === 3 && bureau && (
        <div className="mt-8">
          <BackButton onClick={() => setStep(2)} />
          <h3 className="mt-3 text-xl font-extrabold text-navy dark:text-white">
            When did you last take your {bureau.name} report?
          </h3>
          <div className="mt-5 space-y-3">
            {LAST_PULLED_LIST.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setLastPulled(o.id);
                  setStep(4);
                }}
                className="group flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-white p-4 text-left transition-all duration-300 hover:border-gold/40 hover:shadow-[var(--shadow-lift)] dark:bg-background"
              >
                <span>
                  <span className="block text-sm font-extrabold text-navy dark:text-white">
                    {o.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{o.hint}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-gold transition-transform group-hover:translate-x-0.5" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4 — payment */}
      {step === 4 && bureau && (
        <div className="mt-8">
          <BackButton onClick={() => setStep(3)} />
          <h3 className="mt-3 text-xl font-extrabold text-navy dark:text-white">
            Pay ₹{REPORT_PRICE} by UPI
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {`We fetch your ${bureau.name} report for you for a flat ₹${REPORT_PRICE}.`}
          </p>

          <div className="mt-6 grid items-center gap-6 sm:grid-cols-[auto_1fr]">
            <UpiQr amount={REPORT_PRICE} note={`${bureau.name} report`} />
            <div className="space-y-4">
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li>1. Scan the QR with any UPI app (GPay, PhonePe, Paytm, BHIM…).</li>
                <li>
                  2. Pay exactly <strong className="text-foreground">₹{REPORT_PRICE}</strong>.
                </li>
                <li>3. Enter the 12-digit UTR / transaction ID below.</li>
              </ol>
              <a
                href={upiLink(REPORT_PRICE, `${bureau.name} report`)}
                className="inline-flex items-center gap-2 rounded-lg border border-gold/40 px-4 py-2 text-xs font-bold text-navy transition-colors hover:bg-gold/10 sm:hidden dark:text-white"
              >
                <Smartphone className="h-4 w-4" /> On your phone? Open your UPI app
              </a>
              {UPI_IS_PLACEHOLDER && import.meta.env.DEV && (
                <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  Dev warning: the UPI ID in <code>src/data/cibil.ts</code> is still a placeholder —
                  this QR won't pay GCS yet.
                </p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor={`${uid}-utr`} className={labelClass}>
              UPI transaction / UTR number <span className="text-gold">*</span>
            </label>
            <input
              id={`${uid}-utr`}
              className={fieldClass}
              value={utr}
              onChange={(e) => setUtr(e.target.value.replace(/\D/g, "").slice(0, 12))}
              placeholder="12-digit number from your payment app"
              inputMode="numeric"
            />
            {utrError && <span className="mt-1 block text-xs text-destructive">{utrError}</span>}
          </div>
          <button
            type="button"
            onClick={confirmPayment}
            disabled={submitting}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-navy px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-navy-light disabled:opacity-60"
          >
            {submitting ? "Sending…" : "I've paid — submit request"}{" "}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

const howItWorks = () => [
  {
    title: "Share your details",
    text: "PAN, date of birth and address — exactly as on your records.",
  },
  { title: "Choose your bureau", text: "TransUnion CIBIL, Experian, Equifax or CRIF High Mark." },
  {
    title: "Tell us when you last took your report",
    text: "A quick question so we have the full picture.",
  },
  {
    title: `Pay ₹${REPORT_PRICE} by UPI QR`,
    text: "One flat price for any bureau. We then pull your report and send it to you.",
  },
];

function CibilPage() {
  const HOW_IT_WORKS = howItWorks();
  return (
    <>
      <section className="relative overflow-hidden hero-light border-b border-gold/15 py-16 sm:py-20">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-gold/8 blur-[120px]"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal animate={false}>
            <p className="eyebrow">CIBIL &amp; Credit Reports</p>
            <h1 className="mt-4 text-3xl font-extrabold text-navy sm:text-5xl dark:text-white">
              Get Your Credit Report, <span className="gold-text">Without the Hassle.</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground">
              Pick your credit bureau, pay by UPI QR and share a few details — our team pulls your
              TransUnion CIBIL, Experian, Equifax or CRIF High Mark report and sends it to you.
            </p>
            <Link
              to="/tools"
              hash="credit-score"
              className="mt-5 inline-flex items-center gap-2 rounded-lg border border-gold/40 bg-white/70 px-4 py-2.5 text-sm font-bold text-navy transition-colors hover:bg-gold/10 dark:bg-card dark:text-white"
            >
              <Gauge className="h-4 w-4 text-gold" />
              Not sure where you stand? Try our Credit Score Estimator
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <CibilFlow />

          <aside className="space-y-5">
            <div className="rounded-2xl border border-border bg-white p-6 dark:bg-card">
              <p className="eyebrow">How it works</p>
              <ol className="mt-4 space-y-4">
                {HOW_IT_WORKS.map((s, i) => (
                  <li key={s.title} className="flex gap-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-navy text-xs font-bold text-gold-light">
                      {i + 1}
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-navy dark:text-white">
                        {s.title}
                      </span>
                      <span className="block text-xs leading-relaxed text-muted-foreground">
                        {s.text}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-2xl border border-[#BCCBEE] bg-[#E1EAFB] p-6 dark:bg-card">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-white text-gold-dark dark:bg-card">
                <FileSearch className="h-5 w-5" />
              </span>
              <h3 className="mt-3 text-sm font-extrabold text-navy dark:text-white">
                Good to know
              </h3>
              <ul className="mt-2 space-y-2 text-xs leading-relaxed text-muted-foreground">
                <li>Checking your own report is a soft enquiry — it doesn't lower your score.</li>
                <li>
                  Growth Capital Services is independent of TransUnion CIBIL, Experian, Equifax and
                  CRIF High Mark; their names only tell us which report you want.
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-[#BCCBEE] bg-[#E1EAFB] p-6">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-white text-gold-dark">
                <Gauge className="h-5 w-5" />
              </span>
              <h3 className="mt-3 text-sm font-extrabold text-navy dark:text-white">
                Credit Score Estimator
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Not sure where you stand? Get an indicative score range in a minute, before you
                request your report.
              </p>
              <Link
                to="/tools"
                hash="credit-score"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-navy-light"
              >
                Try the estimator <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
