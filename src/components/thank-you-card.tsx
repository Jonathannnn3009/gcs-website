import { Check, MessageCircle, Phone } from "lucide-react";
import { CONTACT } from "@/data/site";

const NEXT_STEPS = [
  { title: "We review", body: "A GCS loan expert reads your details." },
  { title: "We call you", body: "We contact you to understand your need and suggest next steps." },
  { title: "We compare", body: "We look at suitable Banks and NBFCs for your profile." },
];

/**
 * The confirmation shown after any website form is sent. One look everywhere: an animated tick,
 * what happens next, and ways to reach us in the meantime.
 */
export function ThankYouCard({
  id,
  heading = "Thank you. We have your details.",
  message,
  tall = false,
  showSteps = true,
}: {
  id?: string;
  heading?: string;
  message?: string;
  /** Fill the height of a taller neighbouring card. */
  tall?: boolean;
  showSteps?: boolean;
}) {
  return (
    <div
      id={id}
      role="status"
      className={`scroll-mt-28 overflow-hidden rounded-2xl border border-gold/30 bg-white text-center shadow-[var(--shadow-card)] dark:bg-card ${
        tall ? "flex h-full min-h-[420px] flex-col justify-center" : ""
      }`}
    >
      <div className="h-1 bg-gradient-to-r from-navy via-navy-soft to-gold" />
      <div className="p-7 sm:p-8">
        <span className="thank-ring relative mx-auto grid h-14 w-14 place-items-center rounded-full bg-gold-pale/70 text-gold-dark dark:bg-gold/15">
          <Check className="thank-tick h-7 w-7" strokeWidth={3} />
        </span>
        <h3 className="mt-5 text-xl font-extrabold text-navy dark:text-white" style={{ letterSpacing: "0" }}>
          {heading}
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {message ??
            "A GCS loan expert will go through your details and contact you. This is an enquiry, not a loan approval. A lender decides after its own checks."}
        </p>

        {showSteps ? (
          <ol className="mt-6 grid gap-3 text-left sm:grid-cols-3">
            {NEXT_STEPS.map((s, i) => (
              <li key={s.title} className="rounded-xl border border-border bg-gold-pale/20 p-3 dark:bg-gold/5">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-navy text-[11px] font-bold text-white">
                  {i + 1}
                </span>
                <p className="mt-2 text-[13px] font-bold text-navy dark:text-white">{s.title}</p>
                <p className="mt-0.5 text-[12px] leading-snug text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
        ) : null}

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href={CONTACT.whatsappLink} target="_blank" rel="noreferrer" className="gold-btn px-5 py-2.5 text-sm">
            <MessageCircle className="h-4 w-4" /> Message us on WhatsApp
          </a>
          <a
            href={CONTACT.phoneHref}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-bold text-navy transition-colors hover:border-gold hover:text-gold-dark dark:text-white"
          >
            <Phone className="h-4 w-4" /> {CONTACT.phone}
          </a>
        </div>
        <p className="mt-4 text-[11px] text-muted-foreground">{CONTACT.hours}</p>
      </div>
    </div>
  );
}
