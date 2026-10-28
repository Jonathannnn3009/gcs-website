import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Loader2, Pencil } from "lucide-react";
import { CONTACT } from "@/data/site";
import { normalizePhone } from "@/lib/lead-dedupe";
import { isValidEmail } from "@/lib/validation";
import { ASSISTANT_NAME } from "@/lib/chat/config";
import { ChatAuthError, confirmCode, requestCode, type ChatPass } from "@/lib/chat/auth";

// The step before the chat: the visitor gives a name, a mobile number and an email address, we send them a
// code by SMS and email, and they type it in. Only then does the chat open. The CRM sends and checks the code.

const fieldClass =
  "w-full rounded-lg border border-border bg-white px-3 py-2.5 text-[13.5px] text-ink outline-none transition-all placeholder:text-muted-foreground/70 focus:border-gold focus:ring-2 focus:ring-gold/20";

const bubble =
  "rounded-2xl rounded-tl-md border border-border bg-white px-3.5 py-2.5 text-[13.5px] leading-relaxed text-foreground shadow-sm";

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
  const [sentTo, setSentTo] = useState<{ sms: boolean; email: boolean }>({ sms: true, email: true });
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  /** Seconds until another code may be asked for. */
  const [wait, setWait] = useState(0);
  const codeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (wait <= 0) return;
    const timer = window.setTimeout(() => setWait((w) => w - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [wait]);

  useEffect(() => {
    if (step === "code") codeRef.current?.focus();
  }, [step]);

  const digits = normalizePhone(phone);
  const shown = digits ? `+91 ${digits.slice(0, 2)}••••${digits.slice(-2)}` : "";

  const sendCode = async () => {
    if (busy) return;
    if (name.trim().length < 2) return setError("Please enter your name.");
    if (!digits) return setError("Enter a valid 10-digit mobile number.");
    if (!isValidEmail(email.trim())) return setError("Enter a valid email address, like name@example.com.");
    setError("");
    setBusy(true);
    try {
      const res = await requestCode({ name, phone, email });
      setSentTo({ sms: res.viaSms !== false, email: res.viaEmail !== false });
      setWait(res.resendAfterSeconds);
      setCode("");
      setStep("code");
    } catch (e) {
      setError(e instanceof ChatAuthError ? e.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const check = async (value: string) => {
    if (busy || value.length !== 6) return;
    setError("");
    setBusy(true);
    try {
      onSignedIn(await confirmCode({ phone, code: value }));
    } catch (e) {
      setError(e instanceof ChatAuthError ? e.message : "Something went wrong. Please try again.");
      setCode("");
      codeRef.current?.focus();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex-1 space-y-3 overflow-y-auto overscroll-contain bg-bg-light px-4 py-4">
      <div className={`max-w-[92%] ${bubble}`}>
        <p>
          Hi, I'm <strong className="font-bold text-navy">{ASSISTANT_NAME}</strong>, GCS's AI
          assistant.
        </p>
        <p className="mt-2">
          {step === "details"
            ? "Before we start, please confirm your mobile number and email. I'll send you a 6-digit code on both."
            : `I've sent a 6-digit code to ${[sentTo.sms ? shown : "", sentTo.email ? email.trim() : ""].filter(Boolean).join(" and ")}. It works for 10 minutes.`}
        </p>
      </div>

      {note && step === "details" && (
        <p className="rounded-xl border border-gold/30 bg-gold-pale/30 px-3 py-2 text-xs text-navy">
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
          className="rounded-2xl border border-gold/30 bg-white p-4 shadow-sm"
        >
          <div className="space-y-2.5">
            <input
              aria-label="Your name"
              className={fieldClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
              maxLength={100}
            />
            <div className="flex items-stretch gap-2">
              <span className="grid place-items-center rounded-lg border border-border bg-bg-light px-3 text-[13.5px] font-semibold text-navy">
                +91
              </span>
              <input
                aria-label="Mobile number"
                className={fieldClass}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile number"
                inputMode="tel"
                autoComplete="tel-national"
                maxLength={15}
              />
            </div>
            <input
              aria-label="Email address"
              className={fieldClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              inputMode="email"
              autoComplete="email"
              maxLength={160}
            />
          </div>
          {error && (
            <p role="alert" className="mt-2 text-xs text-destructive">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="gold-btn mt-3.5 w-full justify-center py-2.5 text-[13px] disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {busy ? "Sending…" : "Send code"}
            {!busy && <ArrowRight className="h-3.5 w-3.5" />}
          </button>
          <p className="mt-2.5 text-[11px] leading-snug text-muted-foreground">
            By continuing you agree that Growth Capital Services may contact you on this number and
            email about your enquiry. Message and data rates may apply.
          </p>
        </form>
      ) : (
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            void check(code);
          }}
          className="rounded-2xl border border-gold/30 bg-white p-4 shadow-sm"
        >
          <input
            ref={codeRef}
            aria-label="6-digit code"
            className={`${fieldClass} text-center font-heading text-xl font-bold tracking-[0.5em]`}
            value={code}
            onChange={(e) => {
              const next = e.target.value.replace(/\D/g, "").slice(0, 6);
              setCode(next);
              if (next.length === 6) void check(next);
            }}
            placeholder="······"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
          />
          {error && (
            <p role="alert" className="mt-2 text-xs text-destructive">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={busy || code.length !== 6}
            className="gold-btn mt-3.5 w-full justify-center py-2.5 text-[13px] disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            {busy ? "Checking…" : "Verify and start chatting"}
          </button>
          <div className="mt-3 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => {
                setStep("details");
                setError("");
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

      <p className="px-1 text-center text-[11px] leading-snug text-muted-foreground">
        No code? Check the number and your email (and spam folder), or{" "}
        <a href={CONTACT.phoneHref} className="font-semibold text-navy underline">
          call us
        </a>
        .
      </p>
    </div>
  );
}
