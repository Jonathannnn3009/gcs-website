import { useState } from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { CONTACT, SERVICES } from "@/data/site";

type Fields = { name: string; phone: string; email: string; loanType: string; city: string };

const empty: Fields = { name: "", phone: "", email: "", loanType: "", city: "" };

export function LeadForm() {
  const [values, setValues] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Partial<Fields>>({});
  const [submitted, setSubmitted] = useState(false);

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const validate = () => {
    const next: Partial<Fields> = {};
    if (values.name.trim().length < 2) next.name = "Please enter your full name";
    if (!/^[0-9+\s-]{10,15}$/.test(values.phone.trim())) next.phone = "Enter a valid phone number";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) next.email = "Enter a valid email";
    if (!values.loanType) next.loanType = "Select a loan type";
    if (!values.city) next.city = "Select your city";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rise-in glass-card p-8 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gradient-to-b from-gold/20 to-gold/5">
          <CheckCircle2 className="h-8 w-8 text-gold" />
        </div>
        <h3 className="mt-4 text-xl font-extrabold">Thank you, {values.name.split(" ")[0]}!</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Your enquiry has been noted. An advisor will call you on {values.phone} during working
          hours. For anything urgent, call {CONTACT.phone}.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => {
              setValues(empty);
              setSubmitted(false);
            }}
            className="rounded-md border border-gold/30 px-5 py-2.5 text-sm font-bold transition-all duration-300 hover:border-gold hover:text-gold"
          >
            Submit another enquiry
          </button>
          <a
            href={CONTACT.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-[#25D366] px-5 py-2.5 text-sm font-bold text-white transition-transform duration-300 hover:-translate-y-0.5"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
              <path d="M12.04 2A10 10 0 0 0 2 12.04a9.94 9.94 0 0 0 1.34 4.99L2 22l5.13-1.34A9.95 9.95 0 0 0 12.04 22 10 10 0 0 0 22 12.04 10 10 0 0 0 12.04 2zm5.82 14.12c-.24.67-1.42 1.24-1.96 1.32-.5.07-1.14.1-1.84-.12a16.84 16.84 0 0 1-1.67-.62c-2.93-1.27-4.84-4.23-4.99-4.43-.15-.2-1.2-1.6-1.2-3.06 0-1.45.76-2.17 1.03-2.46.27-.3.59-.37.79-.37.2 0 .4 0 .57.01.18.01.43-.07.67.51.24.59.83 2.02.9 2.17.07.15.12.33.02.53-.1.2-.15.33-.3.5-.15.18-.31.4-.44.53-.15.15-.3.31-.13.61.17.3.77 1.27 1.65 2.06 1.13.99 2.09 1.3 2.39 1.44.3.15.47.13.64-.07.17-.21.74-.87.94-1.17.2-.3.4-.25.67-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.35.07.12.07.72-.17 1.4z" />
            </svg>
            Chat on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  const fieldClass =
    "mt-1.5 w-full rounded-lg border border-border bg-white px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-gold focus:ring-2 focus:ring-gold/20 focus:shadow-[0_0_12px_oklch(0.75_0.14_75/0.1)]";

  return (
    <form onSubmit={onSubmit} noValidate className="glass-card p-6 sm:p-8">
      <div className="mb-6">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse"></span>
          <span className="text-xs font-bold text-gold">Apply in 30 seconds</span>
        </div>
        <h3 className="text-xl font-extrabold">Request a Free Consultation</h3>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Share a few details and an advisor will get back with matched lender options.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold">
          Full Name <span className="text-gold">*</span>
          <input
            className={fieldClass}
            value={values.name}
            onChange={set("name")}
            maxLength={100}
            placeholder="Enter your name"
          />
          {errors.name ? <span className="mt-1 block text-xs text-destructive">{errors.name}</span> : null}
        </label>

        <label className="block text-sm font-semibold">
          Phone <span className="text-gold">*</span>
          <input
            className={fieldClass}
            value={values.phone}
            onChange={set("phone")}
            maxLength={15}
            inputMode="tel"
            placeholder="10-digit mobile"
          />
          {errors.phone ? <span className="mt-1 block text-xs text-destructive">{errors.phone}</span> : null}
        </label>

        <label className="block text-sm font-semibold">
          Email <span className="text-gold">*</span>
          <input
            className={fieldClass}
            value={values.email}
            onChange={set("email")}
            maxLength={255}
            inputMode="email"
            placeholder="you@example.com"
          />
          {errors.email ? <span className="mt-1 block text-xs text-destructive">{errors.email}</span> : null}
        </label>

        <label className="block text-sm font-semibold">
          Loan Type <span className="text-gold">*</span>
          <select className={fieldClass} value={values.loanType} onChange={set("loanType")}>
            <option value="">Select a loan type</option>
            {SERVICES.map((s) => (
              <option key={s.id} value={s.title}>
                {s.title}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>
          {errors.loanType ? (
            <span className="mt-1 block text-xs text-destructive">{errors.loanType}</span>
          ) : null}
        </label>

        <label className="block text-sm font-semibold sm:col-span-2">
          City <span className="text-gold">*</span>
          <select className={fieldClass} value={values.city} onChange={set("city")}>
            <option value="">Select your city</option>
            {CONTACT.cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>
          {errors.city ? <span className="mt-1 block text-xs text-destructive">{errors.city}</span> : null}
        </label>
      </div>

      <button
        type="submit"
        className="gold-btn mt-6 w-full justify-center py-3.5 text-base"
      >
        <span>Apply Now</span>
        <ArrowRight className="h-4 w-4" />
      </button>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <svg className="h-3.5 w-3.5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
          100% Confidential
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="h-3.5 w-3.5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
          Callback within 24 hrs
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="h-3.5 w-3.5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
          Zero Advisory Fee
        </span>
      </div>
    </form>
  );
}
