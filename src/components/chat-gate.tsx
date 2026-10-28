import { useEffect, useState, type ReactNode } from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  AlertCircle,
  ArrowRight,
  Check,
  Loader2,
  Lock,
  Mail,
  MessageCircle,
  Pencil,
  Phone,
  User,
} from "lucide-react";
import { CONTACT } from "@/data/site";
import { normalizePhone } from "@/lib/lead-dedupe";
import { isValidEmail } from "@/lib/validation";
import { ASSISTANT_NAME } from "@/lib/chat/config";
import { ChatAuthError, confirmCode, requestCode, type ChatPass } from "@/lib/chat/auth";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { submitLead } from "@/lib/leads";

// The step before the chat: the visitor gives a name, a mobile number and an email address, we send them a
// code by email, and they type it in. Only then does the chat open. The website sends and checks the code.

const inputClass =
  "h-11 w-full rounded-xl border border-border bg-white pr-3 pl-10 text-[14px] text-ink outline-none transition-all placeholder:text-muted-foreground/60 focus:border-gold focus:ring-2 focus:ring-gold/25";

const labelClass = "mb-1 block text-[10px] font-bold tracking-[0.16em] text-navy uppercase";

/** A label, with an icon sitting inside the left edge of the box. */
function IconField({ label, icon, children }: { label: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div>
      <span className={labelClass}>{label}</span>
      <div className="relative">
        <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-gold-dark">
          {icon}
        </span>
        {children}
      </div>
    </div>
  );
}

/** Steps 1 and 2 as a small progress line. */
function Steps({ step }: { step: "details" | "code" }) {
  const item = (n: number, text: string, state: "done" | "now" | "next") => (
    <span
      className={`flex items-center gap-1.5 text-[11px] font-bold ${
        state === "next" ? "text-muted-foreground" : "text-navy"
      }`}
    >
      <span
        className={`grid h-5 w-5 place-items-center rounded-full text-[10px] ${
          state === "done"
            ? "bg-gold text-navy"
            : state === "now"
              ? "bg-navy text-white"
              : "bg-border text-muted-foreground"
        }`}
      >
        {state === "done" ? <Check className="h-3 w-3" strokeWidth={3} /> : n}
      </span>
      {text}
    </span>
  );
  return (
    <div className="flex items-center justify-center gap-3">
      {item(1, "Your details", step === "details" ? "now" : "done")}
      <span className="h-px w-8 bg-border" />
      {item(2, "Verify", step === "code" ? "now" : "next")}
    </div>
  );
}

export function ChatGate({
  note,
  onSignedIn,
}: {
  /** Why the visitor is back here, e.g. their sign-in ran out. */
  note?: string;
  onSignedIn: (pass: ChatPass) => void;
}) {
  const [step, setStep] = useState<"details" | "code">("details");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  /** Where the code actually went, as the server reported it. */
  const [sentTo, setSentTo] = useState<{ sms: boolean; email: boolean }>({ sms: false, email: true });
  /** The signed note the server gave with the code; it goes back with what the visitor types. */
  const [challenge, setChallenge] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  /** The server could not be reached at all: offer a call or WhatsApp instead of "try again". */
  const [offline, setOffline] = useState(false);
  const [busy, setBusy] = useState(false);
  /** Seconds until another code may be asked for. */
  const [wait, setWait] = useState(0);

  useEffect(() => {
    if (wait <= 0) return;
    const timer = window.setTimeout(() => setWait((w) => w - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [wait]);

  const digits = normalizePhone(phone);
  const shown = digits ? `+91 ${digits.slice(0, 2)}••••${digits.slice(-2)}` : "";

  const fail = (e: unknown, fallback: string) => {
    setError(e instanceof ChatAuthError ? e.message : fallback);
    setOffline(e instanceof ChatAuthError && [0, 404, 502, 504].includes(e.status));
  };

  const sendCode = async () => {
    if (busy) return;
    setOffline(false);
    if (name.trim().length < 2) return setError("Please enter your name.");
    if (!digits) return setError("Enter a valid 10-digit mobile number.");
    if (!isValidEmail(email.trim())) return setError("Enter a valid email address, like name@example.com.");
    setError("");
    setBusy(true);
    try {
      const res = await requestCode({ name, phone, email });
      setWait(res.resendAfterSeconds);
      setSentTo({ sms: res.viaSms === true, email: res.viaEmail !== false });
      setChallenge(res.challenge);
      setCode("");
      setStep("code");
    } catch (e) {
      fail(e, "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const check = async (value: string) => {
    if (busy || value.length !== 6) return;
    setError("");
    setOffline(false);
    setBusy(true);
    try {
      const pass = await confirmCode({ phone, code: value, challenge });
      // the person is a lead now: the team is told, and the CRM gets them once it is reachable
      void submitLead({
        name: pass.name,
        phone,
        email: email.trim(),
        source: "website-chat",
        detail: "Confirmed their email with a code to use the website chat.",
      });
      onSignedIn(pass);
    } catch (e) {
      fail(e, "Something went wrong. Please try again.");
      setCode("");
    } finally {
      setBusy(false);
    }
  };

  const problem = error ? (
    <div role="alert" className="mt-3.5 rounded-xl border border-destructive/25 bg-destructive/5 px-3 py-2.5">
      <p className="flex items-start gap-2 text-[12.5px] leading-snug text-destructive">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <span>{error}</span>
      </p>
      {offline && (
        <div className="mt-2.5 flex flex-wrap gap-2">
          <a
            href={CONTACT.phoneHref}
            className="inline-flex items-center gap-1.5 rounded-full border border-navy/20 bg-white px-3 py-1.5 text-xs font-bold text-navy hover:border-gold"
          >
            <Phone className="h-3.5 w-3.5 text-gold-dark" /> Call us
          </a>
          <a
            href={CONTACT.whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-navy px-3 py-1.5 text-xs font-bold text-white"
          >
            <MessageCircle className="h-3.5 w-3.5" /> WhatsApp us
          </a>
        </div>
      )}
    </div>
  ) : null;

  return (
    <div className="flex-1 overflow-y-auto overscroll-contain bg-bg-light px-4 py-5">
      <div className="text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white shadow-sm ring-2 ring-gold/60">
          <img src="/brand/gcs-mark.png" alt="" className="h-8 w-auto" />
        </span>
        <h3 className="mt-3 font-heading text-[1.35rem] leading-tight font-bold text-navy">
          Hi, I&rsquo;m {ASSISTANT_NAME}
        </h3>
        <p className="mx-auto mt-1 max-w-[290px] text-[13px] leading-snug text-muted-foreground">
          {step === "details"
            ? "GCS's AI assistant. Confirm your email so I know who I'm talking to, and I'll answer your loan questions."
            : "Nearly there. Type the 6-digit code we emailed you."}
        </p>
      </div>

      <div className="mt-4">
        <Steps step={step} />
      </div>

      {note && step === "details" && (
        <p className="mt-4 rounded-xl border border-gold/30 bg-gold-pale/30 px-3 py-2 text-xs text-navy">
          {note}
        </p>
      )}

      {step === "details" ? (
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            void sendCode();
          }}
          className="mt-4 rounded-2xl border border-gold/30 bg-white p-4 shadow-sm"
        >
          <div className="space-y-3">
            <IconField label="Your name" icon={<User className="h-4 w-4" />}>
              <input
                aria-label="Your name"
                className={inputClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                autoComplete="name"
                maxLength={100}
              />
            </IconField>
            <IconField label="Mobile number" icon={<Phone className="h-4 w-4" />}>
              <input
                aria-label="Mobile number"
                className={`${inputClass} pl-[5.3rem]`}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit number"
                inputMode="tel"
                autoComplete="tel-national"
                maxLength={15}
              />
              <span className="pointer-events-none absolute top-1/2 left-10 -translate-y-1/2 border-l border-border pl-2 text-[13px] font-semibold text-navy">
                +91
              </span>
            </IconField>
            <IconField label="Email address" icon={<Mail className="h-4 w-4" />}>
              <input
                aria-label="Email address"
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                inputMode="email"
                autoComplete="email"
                maxLength={160}
              />
            </IconField>
          </div>
          {problem}
          <button
            type="submit"
            disabled={busy}
            className="gold-btn mt-4 h-11 w-full justify-center text-[14px] disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {busy ? "Sending your code…" : "Email me the code"}
            {!busy && <ArrowRight className="h-4 w-4" />}
          </button>
          <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-snug text-muted-foreground">
            <Lock className="mt-0.5 h-3 w-3 shrink-0 text-gold-dark" />
            <span>
              We email you a 6-digit code. By continuing you agree that Growth Capital Services may contact you on
              this number and email about your enquiry.
            </span>
          </p>
        </form>
      ) : (
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            void check(code);
          }}
          className="mt-4 rounded-2xl border border-gold/30 bg-white p-4 shadow-sm"
        >
          <div className="flex flex-wrap justify-center gap-2 text-[12px] font-semibold text-navy">
            {sentTo.sms && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-pale/50 px-3 py-1">
                <Phone className="h-3.5 w-3.5 text-gold-dark" /> {shown}
              </span>
            )}
            {sentTo.email && (
              <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-gold-pale/50 px-3 py-1">
                <Mail className="h-3.5 w-3.5 shrink-0 text-gold-dark" />
                <span className="truncate">{email.trim()}</span>
              </span>
            )}
          </div>
          <p className="mt-2 text-center text-[11.5px] text-muted-foreground">It works for 10 minutes.</p>

          <div className="mt-4 flex justify-center">
            <InputOTP
              maxLength={6}
              value={code}
              onChange={setCode}
              onComplete={(v) => void check(v)}
              pattern={REGEXP_ONLY_DIGITS}
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
              disabled={busy}
              aria-label="6-digit code"
              containerClassName="gap-2"
            >
              <InputOTPGroup className="gap-2">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                    className="h-12 w-10 rounded-xl border border-border bg-white font-heading text-lg font-bold text-navy shadow-none first:rounded-xl first:border last:rounded-xl data-[active=true]:border-gold"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
          {problem}
          <button
            type="submit"
            disabled={busy || code.length !== 6}
            className="gold-btn mt-4 h-11 w-full justify-center text-[14px] disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            {busy ? "Checking…" : "Verify and start chatting"}
          </button>
          <div className="mt-3.5 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => {
                setStep("details");
                setError("");
                setOffline(false);
              }}
              className="inline-flex items-center gap-1 font-semibold text-navy hover:text-gold-dark"
            >
              <Pencil className="h-3 w-3" /> Change details
            </button>
            <button
              type="button"
              disabled={wait > 0 || busy}
              onClick={() => void sendCode()}
              className="font-semibold text-navy hover:text-gold-dark disabled:text-muted-foreground disabled:hover:text-muted-foreground"
            >
              {wait > 0 ? `Send again in ${wait}s` : "Send the code again"}
            </button>
          </div>
        </form>
      )}

      <p className="mt-4 px-1 text-center text-[11px] leading-snug text-muted-foreground">
        No code? Check your email and spam folder, or{" "}
        <a href={CONTACT.phoneHref} className="font-semibold text-navy underline">
          call us
        </a>
        .
      </p>
    </div>
  );
}
