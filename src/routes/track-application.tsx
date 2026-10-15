import { createFileRoute, Link } from "@tanstack/react-router";
import { useId, useState } from "react";
import { ArrowRight, Check, Handshake, LockKeyhole, MessageCircle, UserRound } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { CONTACT } from "@/data/site";
import { CRM_APP } from "@/lib/crm";
import { normalizePhone } from "@/lib/lead-dedupe";
import { submitLead } from "@/lib/leads";
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

type Who = "client" | "partner" | "enquiry";

const WHO: { id: Who; label: string; icon: typeof UserRound; blurb: string }[] = [
  { id: "client", label: "Client", icon: UserRound, blurb: "I have a GCS ID for my loan file" },
  { id: "partner", label: "Partner", icon: Handshake, blurb: "I refer clients to GCS" },
  {
    id: "enquiry",
    label: "Enquiry",
    icon: MessageCircle,
    blurb: "I enquired but have no GCS ID yet",
  },
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

function PartnerForm() {
  const uid = useId();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = normalizePhone(phone);
    if (!digits) return setError("Enter the 10-digit mobile number registered with us");
    setError("");
    leaveHandoff({ kind: "partner", phone: digits });
    window.location.assign(`${CRM_APP}/partner-login`);
  };

  return (
    <form onSubmit={onSubmit} noValidate>
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
        <Err text={error} />
      </div>
      <button type="submit" className={submitClass}>
        Go to partner sign in
        <Arrow />
      </button>
    </form>
  );
}

function EnquiryForm() {
  const uid = useId();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = normalizePhone(phone);
    const next: typeof errors = {};
    if (name.trim().length < 2) next.name = "Please enter your name";
    if (!digits) next.phone = "Enter your 10-digit mobile number";
    setErrors(next);
    if (next.name || next.phone || !digits) return;
    await submitLead({
      name: name.trim(),
      phone: digits,
      source: "track-status-request",
      detail: "Asked for a status update on their enquiry from the Track Application page.",
    });
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-gold-pale/70 text-gold-dark dark:bg-gold/15">
          <Check className="h-6 w-6" />
        </span>
        <h2 className="mt-4 text-lg font-extrabold text-navy dark:text-white">
          Thanks, we will call you.
        </h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          An expert will update you on your enquiry, typically within one business day (
          {CONTACT.hours}).
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="space-y-4">
        <div>
          <label htmlFor={`${uid}-name`} className={labelClass}>
            Full Name <span className="text-gold">*</span>
          </label>
          <input
            id={`${uid}-name`}
            className={fieldClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            maxLength={100}
          />
          <Err text={errors.name} />
        </div>
        <div>
          <label htmlFor={`${uid}-phone`} className={labelClass}>
            Mobile Number <span className="text-gold">*</span>
          </label>
          <input
            id={`${uid}-phone`}
            className={fieldClass}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="The number you enquired with"
            inputMode="tel"
            autoComplete="tel-national"
            maxLength={15}
          />
          <Err text={errors.phone} />
        </div>
      </div>
      <button type="submit" className={submitClass}>
        Ask for an update
        <Arrow />
      </button>
    </form>
  );
}

const SIDE: Record<
  Who,
  { eyebrow: string; title: string; text: string; points: string[]; note: string }
> = {
  client: {
    eyebrow: "For clients",
    title: "Track your loan file",
    text: "Enter your mobile number and GCS ID. We will take you to your tracking page, where you can see where your application stands.",
    points: [
      "The current status of your application",
      "Your file followed from login to sanction and disbursal",
      "Your GCS ID is the code your expert shared when your application was opened",
    ],
    note: "Your details go straight to our secure sign-in page. They are not shown in the web address.",
  },
  partner: {
    eyebrow: "For partners",
    title: "Partner sign in",
    text: "Enter your registered mobile number and we will take you to your partner portal. There you sign in with your password.",
    points: [
      "Every client you have referred, in one place",
      "Where each file stands, from referral to disbursal",
      "Your commission structure",
    ],
    note: "Your details go straight to our secure sign-in page. They are not shown in the web address.",
  },
  enquiry: {
    eyebrow: "For enquiries",
    title: "Sent an enquiry?",
    text: "Your GCS ID is created when your application is opened with a lender, and your expert shares it with you then. Until that happens, ask us for an update.",
    points: [
      "An expert calls you with an update on your enquiry",
      "Typically within one business day",
      "Once your application is opened, you get your GCS ID to track it here",
    ],
    note: "We use your number only to call you back about your enquiry.",
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
      <p className="relative mt-auto flex min-h-[6.5rem] items-start gap-2 border-t border-white/10 pt-5 text-[13px] leading-relaxed text-white/60">
        <LockKeyhole className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-light" />
        {side.note}
      </p>
    </div>
  );
}

function TrackApplicationPage() {
  const [who, setWho] = useState<Who>("client");

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
              className="mt-8 grid gap-3 sm:grid-cols-3"
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
                    onClick={() => setWho(w.id)}
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
                  {who === "client" && <ClientForm />}
                  {who === "partner" && <PartnerForm />}
                  {who === "enquiry" && <EnquiryForm />}
                </div>
                <p className="min-h-[6.5rem] border-t border-border pt-5 text-[13px] leading-relaxed text-muted-foreground">
                  {who === "client"
                    ? "Need help finding your GCS ID? "
                    : who === "partner"
                      ? "Forgot your password, or not a partner yet? "
                      : "Prefer to talk it through? "}
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
