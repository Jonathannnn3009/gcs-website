import { useId, useState, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { CONTACT, SERVICES } from "@/data/site";
import { Toast } from "@/components/toast";

type Fields = { name: string; phone: string; email: string; loanType: string; city: string };

const empty: Fields = { name: "", phone: "", email: "", loanType: "", city: "" };

const cardClass =
  "relative overflow-hidden rounded-2xl border border-border bg-white shadow-[var(--shadow-lift)]";

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-all duration-300 placeholder:text-muted-foreground/70 focus:border-gold focus:ring-2 focus:ring-gold/20";

// Same base styling as fieldClass, minus the native browser arrow.
const selectClass = `${fieldClass} appearance-none cursor-pointer`;

// A real 10-digit Indian mobile number, with an optional country code or leading 0.
const PHONE_RE = /^(?:\+?91[-\s]?|0)?[6-9]\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

function AccentBar() {
  return <div className="h-1 bg-gradient-to-r from-navy via-navy-soft to-gold" />;
}

function Field({
  id,
  label,
  error,
  className = "",
  children,
}: {
  id: string;
  label: string;
  error?: string | undefined;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-[10px] font-bold tracking-[0.18em] text-navy uppercase">
        {label} <span className="text-gold">*</span>
      </label>
      {children}
      {error ? <span className="mt-1 block text-xs text-destructive">{error}</span> : null}
    </div>
  );
}

export function LeadForm() {
  const uid = useId();
  const [values, setValues] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Partial<Fields>>({});
  const [showToast, setShowToast] = useState(false);

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const validate = () => {
    const next: Partial<Fields> = {};
    if (values.name.trim().length < 2) next.name = "Please enter your full name";
    if (!PHONE_RE.test(values.phone.replace(/[\s-]/g, "")))
      next.phone = "Please match the requested format — a 10-digit mobile number";
    if (!EMAIL_RE.test(values.email.trim()))
      next.email = "Please match the requested format — name@example.com";
    if (!values.loanType) next.loanType = "Select a loan type";
    if (!values.city) next.city = "Select your city";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setValues(empty);
    setErrors({});
    setShowToast(true);
  };

  return (
    <>
      <form onSubmit={onSubmit} noValidate className={cardClass}>
        <AccentBar />
        <div className="p-6 sm:p-7">
          <span className="inline-flex items-center gap-2 rounded-full bg-gold-pale/60 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-gold-dark uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-gold"></span>
            Takes less than a minute
          </span>
          <h3 className="mt-4 font-heading text-[1.6rem] leading-tight font-bold text-navy">
            Request a Free Consultation
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Share a few details and an advisor will call you back with matched lender options.
          </p>

          <div className="my-5 border-t border-dashed border-border" />

          <div className="grid gap-4 sm:grid-cols-2">
            <Field id={`${uid}-name`} label="Full Name" error={errors.name} className="sm:col-span-2">
              <input
                id={`${uid}-name`}
                className={fieldClass}
                value={values.name}
                onChange={set("name")}
                maxLength={100}
                placeholder="Enter your name"
              />
            </Field>

            <Field id={`${uid}-phone`} label="Phone" error={errors.phone}>
              <input
                id={`${uid}-phone`}
                className={fieldClass}
                value={values.phone}
                onChange={set("phone")}
                maxLength={15}
                inputMode="tel"
                placeholder="Your mobile number"
              />
            </Field>

            <Field id={`${uid}-email`} label="Email" error={errors.email}>
              <input
                id={`${uid}-email`}
                className={fieldClass}
                value={values.email}
                onChange={set("email")}
                maxLength={255}
                inputMode="email"
                placeholder="you@example.com"
              />
            </Field>

            <Field id={`${uid}-loan`} label="Loan Type" error={errors.loanType}>
              <select
                id={`${uid}-loan`}
                className={selectClass}
                value={values.loanType}
                onChange={set("loanType")}
              >
                <option value="">Select loan type</option>
                {SERVICES.map((s) => (
                  <option key={s.id} value={s.title}>
                    {s.title}
                  </option>
                ))}
                <option value="Other">Other</option>
              </select>
            </Field>

            <Field id={`${uid}-city`} label="City" error={errors.city}>
              <select
                id={`${uid}-city`}
                className={selectClass}
                value={values.city}
                onChange={set("city")}
              >
                <option value="">Select city</option>
                {CONTACT.cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                <option value="Other">Other</option>
              </select>
            </Field>
          </div>

          <button
            type="submit"
            className="group mt-6 flex w-full items-center justify-center gap-3 rounded-lg bg-navy py-3.5 text-sm font-bold text-white shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-navy-soft"
          >
            Apply Now
            <span className="grid h-7 w-7 place-items-center rounded-full bg-gold text-navy transition-transform duration-300 group-hover:translate-x-0.5">
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </button>

          <p className="mt-4 text-center text-[11px] leading-relaxed text-muted-foreground italic">
            Kept confidential, called back within a day — and it never costs you a rupee.
          </p>
        </div>
      </form>

      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message="Query received — we'll reach out to you soon."
      />
    </>
  );
}
