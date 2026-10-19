import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useId, useState } from "react";
import { ArrowRight, Check, Handshake, UserRound } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { CONTACT } from "@/data/site";
import { CRM_APP } from "@/lib/crm";
import { normalizePhone } from "@/lib/lead-dedupe";
import { confirmIdCode, IdRecoveryError, requestIdCode, type IdKind } from "@/lib/gcs-id-recovery";
import { leaveHandoff } from "@/lib/track-handoff";

export const Route = createFileRoute("/track-application")({
  head: () => ({
    meta: [
      { title: "Track Your Application | Growth Capital Services" },
      {
        name: "description",
        content:
          "Follow your loan file with Growth Capital Services. Clients enter their GCS ID, and partners sign in to their portal, to see the status of each application.",
      },
      { property: "og:title", content: "Track Your Application | Growth Capital Services" },
      {
        property: "og:description",
        content: "See where your loan application stands, from login to disbursal.",
      },
    ],
  }),
  component: TrackApplicationPage,
});

type Who = IdKind;

const WHO: { id: Who; label: string; icon: typeof UserRound; blurb: string }[] = [
  { id: "client", label: "Client", icon: UserRound, blurb: "I have a GCS ID for my loan file" },
  { id: "partner", label: "Partner", icon: Handshake, blurb: "I refer clients to GCS" },
];

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-border bg-white px-4 py-3 text-[15px] text-ink outline-none transition-all duration-300 placeholder:text-muted-foreground/70 focus:border-gold focus:ring-2 focus:ring-gold/20 dark:bg-card dark:text-white";
const labelClass =
  "block text-[10px] font-bold tracking-[0.18em] text-navy uppercase dark:text-white";
const submitClass =
  "group mt-6 flex w-full items-center justify-center gap-3 rounded-lg bg-navy py-3.5 text-sm font-bold text-white shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-navy-soft active:scale-[0.98]";

const Arrow = () => (
  <span className="pulse-gold grid h-7 w-7 place-items-center rounded-full bg-gold text-navy transition-transform duration-300 group-hover:translate-x-0.5">
    <ArrowRight className="h-3.5 w-3.5" />
  </span>
);

const Err = ({ text }: { text?: string | undefined }) =>
  text ? <span className="mt-1 block text-xs text-destructive">{text}</span> : null;

/** A client's GCS ID is the access code on their application: letters and numbers, no spaces. */
const GCS_ID = /^[A-Z0-9]{4,20}$/;

function ClientForm() {
  const uid = useId();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<{ phone?: string; code?: string }>({});

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = normalizePhone(phone);
    const id = code.trim().toUpperCase().replace(/[\s-]/g, "");
    const next: typeof errors = {};
    if (!digits) next.phone = "Enter your 10-digit mobile number";
    if (!GCS_ID.test(id)) next.code = "Enter your GCS ID, using letters and numbers only";
    setErrors(next);
    if (next.phone || next.code || !digits) return;
    leaveHandoff({ kind: "client", phone: digits, code: id });
    window.location.assign(`${CRM_APP}/track-login`);
  };

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="space-y-4">
        <div>
          <label htmlFor={`${uid}-phone`} className={labelClass}>
            Mobile Number <span className="text-gold">*</span>
          </label>
          <input
            id={`${uid}-phone`}
            className={fieldClass}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="10-digit mobile number"
            inputMode="tel"
            autoComplete="tel-national"
            maxLength={15}
          />
          <Err text={errors.phone} />
        </div>
        <div>
          <label htmlFor={`${uid}-code`} className={labelClass}>
            GCS ID <span className="text-gold">*</span>
          </label>
          <input
            id={`${uid}-code`}
            className={`${fieldClass} tracking-widest uppercase`}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. QW78KB4H"
            autoComplete="off"
            maxLength={24}
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            The code your expert shared when your application was opened.
          </p>
          <Err text={errors.code} />
        </div>
      </div>
      <button type="submit" className={submitClass}>
        Track my application
        <Arrow />
      </button>
    </form>
  );
}

/** A partner's GCS ID is their partner code, e.g. GCS-BSA-001: letters and numbers, hyphens allowed. */
const PARTNER_ID = /^[A-Z0-9-]{4,24}$/;

function PartnerForm() {
  const uid = useId();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<{ phone?: string; code?: string }>({});

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = normalizePhone(phone);
    const id = code.trim().toUpperCase().replace(/\s+/g, "-");
    const next: typeof errors = {};
    if (!digits) next.phone = "Enter the 10-digit mobile number registered with us";
    if (!PARTNER_ID.test(id)) next.code = "Enter your Partner ID, for example GCS-BSA-001";
    setErrors(next);
    if (next.phone || next.code || !digits) return;
    leaveHandoff({ kind: "partner", phone: digits, code: id });
    window.location.assign(`${CRM_APP}/partner-login`);
  };

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="space-y-4">
        <div>
          <label htmlFor={`${uid}-phone`} className={labelClass}>
            Registered Mobile Number <span className="text-gold">*</span>
          </label>
          <input
            id={`${uid}-phone`}
            className={fieldClass}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="10-digit mobile number"
            inputMode="tel"
            autoComplete="tel-national"
            maxLength={15}
          />
          <Err text={errors.phone} />
        </div>
        <div>
          <label htmlFor={`${uid}-code`} className={labelClass}>
            Partner ID <span className="text-gold">*</span>
          </label>
          <input
            id={`${uid}-code`}
            className={`${fieldClass} tracking-widest uppercase`}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. GCS-BSA-001"
            autoComplete="off"
            maxLength={24}
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            The Partner ID GCS gave you when you joined.
          </p>
          <Err text={errors.code} />
        </div>
      </div>
      <button type="submit" className={submitClass}>
        Go to partner sign in
        <Arrow />
      </button>
    </form>
  );
}

const RESEND_SECONDS = 30;

/**
 * "Do not have a GCS ID?": confirm the mobile number with a code, and the ID is texted to that number.
 * The ID is never shown here, and the page says the same whether or not one is on file for the number.
 */
function GcsIdRecovery({ kind, onBack }: { kind: IdKind; onBack: () => void }) {
  const uid = useId();
  const idName = kind === "client" ? "GCS ID" : "Partner ID";
  const [step, setStep] = useState<"phone" | "code" | "done" | "none">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [wait, setWait] = useState(0);

  useEffect(() => {
    if (wait <= 0) return;
    const t = window.setTimeout(() => setWait((w) => w - 1), 1000);
    return () => window.clearTimeout(t);
  }, [wait]);

  const digits = normalizePhone(phone);
  const shown = digits ? `+91 ${digits.slice(0, 5)} ${digits.slice(5)}` : phone;

  const sendCode = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!digits) return setError("Enter your 10-digit mobile number");
    setBusy(true);
    setError("");
    try {
      const res = await requestIdCode(kind, digits);
      setWait(res.resendAfterSeconds || RESEND_SECONDS);
      setCode("");
      setStep("code");
    } catch (err) {
      setError(
        err instanceof IdRecoveryError ? err.message : "Something went wrong. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(code.trim())) return setError("Enter the 6-digit code");
    setBusy(true);
    setError("");
    try {
      const res = await confirmIdCode(kind, digits ?? phone, code);
      setStep(res.sent ? "done" : "none");
    } catch (err) {
      setError(
        err instanceof IdRecoveryError ? err.message : "Something went wrong. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  const back = (
    <button
      type="button"
      onClick={onBack}
      className="mt-5 text-[13px] font-semibold text-gold-dark hover:underline"
    >
      {kind === "client" ? "Back to track my application" : "Back to partner sign in"}
    </button>
  );

  if (step === "done" || step === "none") {
    return (
      <div>
        <span className="grid h-12 w-12 place-items-center rounded-full bg-gold-pale/70 text-gold-dark dark:bg-gold/15">
          <Check className="h-6 w-6" />
        </span>
        <h2 className="mt-4 text-lg font-extrabold text-navy dark:text-white">
          {step === "done"
            ? `Your ${idName} is on its way`
            : `We have no ${idName} for this number`}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {step === "done"
            ? `We have sent it by SMS to ${shown}. When it arrives, come back and enter it with your mobile number.`
            : `Your number ${shown} is confirmed, but no ${idName} is held against it yet. Call ${CONTACT.phone} and an expert will help.`}
        </p>
        {back}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-extrabold text-navy dark:text-white">Get your {idName}</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        {kind === "client"
          ? "Enter the mobile number on your loan file. We will text a code to confirm it is you, then text you your GCS ID."
          : "Enter the mobile number you joined GCS with. We will text a code to confirm it is you, then text you your Partner ID."}
      </p>

      {step === "phone" ? (
        <form onSubmit={sendCode} noValidate className="mt-5">
          <label htmlFor={`${uid}-phone`} className={labelClass}>
            Mobile Number <span className="text-gold">*</span>
          </label>
          <input
            id={`${uid}-phone`}
            className={fieldClass}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="10-digit mobile number"
            inputMode="tel"
            autoComplete="tel-national"
            maxLength={15}
          />
          <Err text={error} />
          <button type="submit" disabled={busy} className={submitClass}>
            {busy ? "Sending…" : "Send code"}
            <Arrow />
          </button>
        </form>
      ) : (
        <form onSubmit={verify} noValidate className="mt-5">
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            If a {idName} is held for {shown}, we have texted it a 6-digit code.{" "}
            <button
              type="button"
              onClick={() => {
                setStep("phone");
                setError("");
              }}
              className="font-bold text-gold-dark hover:underline"
            >
              Wrong number?
            </button>
          </p>
          <label htmlFor={`${uid}-code`} className={`${labelClass} mt-4`}>
            6-digit code <span className="text-gold">*</span>
          </label>
          <input
            id={`${uid}-code`}
            className={`${fieldClass} tracking-[0.4em]`}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            placeholder="······"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
          />
          <Err text={error} />
          <button type="submit" disabled={busy} className={submitClass}>
            {busy ? "Checking…" : `Send me my ${idName}`}
            <Arrow />
          </button>
          <p className="mt-3 text-[13px] text-muted-foreground">
            No code yet?{" "}
            {wait > 0 ? (
              <span>You can ask again in {wait}s.</span>
            ) : (
              <button
                type="button"
                onClick={() => void sendCode()}
                disabled={busy}
                className="font-bold text-gold-dark hover:underline"
              >
                Send it again
              </button>
            )}
          </p>
        </form>
      )}
      {back}
    </div>
  );
}

const SIDE: Record<Who, { eyebrow: string; title: string; text: string; points: string[] }> = {
  client: {
    eyebrow: "For clients",
    title: "Track your loan file",
    text: "Enter your mobile number and GCS ID. We will take you to your tracking page, where you can see where your application stands.",
    points: [
      "The current status of your application",
      "Your file followed from login to sanction and disbursal",
      "Your GCS ID is the code your expert shared when your application was opened",
      "No GCS ID yet? Confirm your mobile number and we text it to you",
    ],
  },
  partner: {
    eyebrow: "For partners",
    title: "Partner sign in",
    text: "Enter your registered mobile number and your Partner ID, and we will take you to your partner portal. There you sign in with your password.",
    points: [
      "Every client you have referred, in one place",
      "Where each file stands, from referral to disbursal",
      "Your commission structure",
      "Lost your Partner ID? Confirm your mobile number and we text it to you",
    ],
  },
};

function SidePanel({ who }: { who: Who }) {
  const side = SIDE[who];
  return (
    <div className="navy-panel relative flex flex-col overflow-hidden p-8 sm:p-11 lg:min-h-[30rem]">
      <div className="float-animation pointer-events-none absolute top-0 right-0 h-60 w-60 rounded-full bg-gold/10 blur-[90px]" />
      <p className="relative text-xs font-bold tracking-[0.2em] text-gold uppercase">
        {side.eyebrow}
      </p>
      <h2 className="relative mt-3 font-heading text-2xl font-bold text-white sm:text-3xl">
        {side.title}
      </h2>
      <p className="relative mt-4 text-[15px] leading-relaxed text-white/70">{side.text}</p>
      <ul className="relative mt-7 mb-8 space-y-4">
        {side.points.map((t) => (
          <li
            key={t}
            className="flex items-start gap-2.5 text-[15px] leading-relaxed text-white/80"
          >
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-light" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TrackApplicationPage() {
  const [who, setWho] = useState<Who>("client");
  const [recover, setRecover] = useState(false);

  return (
    <>
      <section className="bg-bg-light py-10 sm:py-14 dark:bg-background">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center">
              <p className="eyebrow">Track Application</p>
              <h1 className="mt-3 font-heading text-3xl font-bold text-navy sm:text-4xl dark:text-white">
                Where does your loan file stand?
              </h1>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Follow your application from login to sanction and disbursal. Choose who you are,
                enter your GCS ID, and we will take you to your tracking page.
              </p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div
              className="mt-8 grid gap-3 sm:grid-cols-2"
              role="tablist"
              aria-label="Who is tracking"
            >
              {WHO.map((w) => {
                const on = w.id === who;
                return (
                  <button
                    key={w.id}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => {
                      setWho(w.id);
                      setRecover(false);
                    }}
                    className={`flex items-center gap-4 rounded-2xl border p-5 text-left transition-all duration-300 hover:-translate-y-0.5 ${
                      on
                        ? "border-navy bg-navy text-white shadow-[var(--shadow-card)]"
                        : "border-border bg-white text-navy hover:border-gold/60 dark:bg-card dark:text-white"
                    }`}
                  >
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                        on ? "bg-gold text-navy" : "bg-gold-pale/60 text-gold-dark dark:bg-gold/15"
                      }`}
                    >
                      <w.icon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-sm font-extrabold">{w.label}</span>
                      <span
                        className={`block text-xs ${on ? "text-white/70" : "text-muted-foreground"}`}
                      >
                        {w.blurb}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div className="mt-6 grid overflow-hidden rounded-2xl border border-border bg-white shadow-[var(--shadow-lift)] lg:grid-cols-[0.95fr_1.05fr] dark:bg-card">
              <SidePanel who={who} />
              <div className="flex flex-col justify-between gap-10 p-8 sm:p-11">
                <div className="my-auto">
                  {recover ? (
                    <GcsIdRecovery key={who} kind={who} onBack={() => setRecover(false)} />
                  ) : (
                    <>
                      {who === "client" ? <ClientForm /> : <PartnerForm />}
                      <button
                        type="button"
                        onClick={() => setRecover(true)}
                        className="mt-4 text-[13px] font-semibold text-gold-dark hover:underline"
                      >
                        {who === "client" ? "Do not have a GCS ID?" : "Do not have a Partner ID?"}
                      </button>
                    </>
                  )}
                </div>
                <p className="min-h-[6.5rem] border-t border-border pt-5 text-[13px] leading-relaxed text-muted-foreground">
                  {who === "client"
                    ? "Need help finding your GCS ID? "
                    : "Forgot your password, or not a partner yet? "}
                  Call {CONTACT.phone} ({CONTACT.hours}) or message us on{" "}
                  <a
                    href={CONTACT.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-gold-dark hover:underline"
                  >
                    WhatsApp
                  </a>
                  .
                  {who === "partner" && (
                    <>
                      {" "}
                      <Link to="/partner" className="font-bold text-gold-dark hover:underline">
                        Become a partner
                      </Link>
                      .
                    </>
                  )}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
