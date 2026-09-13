import { useId, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { submitLead } from "@/lib/leads";

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-all duration-300 placeholder:text-muted-foreground/70 focus:border-gold focus:ring-2 focus:ring-gold/20";

type Fields = { name: string; phone: string; message: string };
const empty: Fields = { name: "", phone: "", message: "" };
const PHONE_RE = /^(?:\+?91[-\s]?|0)?[6-9]\d{9}$/;

type Props = {
  heading?: string;
  description?: string;
  serviceTitle?: string;
};

export function ServiceEnquiryForm({
  heading = "Need Help With This?",
  description = "Tell us your requirement and our team will guide you on the process, documents and next steps.",
  serviceTitle,
}: Props) {
  const uid = useId();
  const [values, setValues] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Partial<Fields>>({});
  const [submitted, setSubmitted] = useState(false);

  const set =
    (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((v) => ({ ...v, [key]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Partial<Fields> = {};
    if (values.name.trim().length < 2) next.name = "Please enter your name";
    if (!PHONE_RE.test(values.phone.replace(/[\s-]/g, "")))
      next.phone = "Enter a valid 10-digit mobile number";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    await submitLead({
      name: values.name.trim(),
      phone: values.phone.trim(),
      source: "ca-legal-enquiry",
      detail: `${serviceTitle ? serviceTitle + " — " : ""}${values.message.trim()}`,
    });
    setValues(empty);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-gold/20 bg-white p-8 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-gold-pale/70 text-gold-dark">
          <Check className="h-6 w-6" />
        </span>
        <h3 className="mt-4 text-lg font-extrabold text-navy">Thanks — we'll be in touch.</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Our team will reach out to understand your requirement and the next steps.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-2xl border border-border bg-white p-6 shadow-[var(--shadow-lift)] sm:p-7"
    >
      <h3 className="text-xl font-extrabold text-navy">{heading}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <div className="mt-5 space-y-4">
        <div>
          <label
            htmlFor={`${uid}-name`}
            className="block text-[10px] font-bold tracking-[0.18em] text-navy uppercase"
          >
            Full Name <span className="text-gold">*</span>
          </label>
          <input
            id={`${uid}-name`}
            className={fieldClass}
            value={values.name}
            onChange={set("name")}
            placeholder="Enter your name"
            maxLength={100}
          />
          {errors.name && <span className="mt-1 block text-xs text-destructive">{errors.name}</span>}
        </div>
        <div>
          <label
            htmlFor={`${uid}-phone`}
            className="block text-[10px] font-bold tracking-[0.18em] text-navy uppercase"
          >
            Phone <span className="text-gold">*</span>
          </label>
          <input
            id={`${uid}-phone`}
            className={fieldClass}
            value={values.phone}
            onChange={set("phone")}
            placeholder="10-digit mobile"
            inputMode="tel"
            maxLength={15}
          />
          {errors.phone && <span className="mt-1 block text-xs text-destructive">{errors.phone}</span>}
        </div>
        <div>
          <label
            htmlFor={`${uid}-message`}
            className="block text-[10px] font-bold tracking-[0.18em] text-navy uppercase"
          >
            Tell Us What You Need (Optional)
          </label>
          <textarea
            id={`${uid}-message`}
            className={`${fieldClass} min-h-[80px] resize-none`}
            value={values.message}
            onChange={set("message")}
            placeholder="Briefly describe your requirement"
            maxLength={500}
          />
        </div>
      </div>
      <button
        type="submit"
        className="group mt-6 flex w-full items-center justify-center gap-3 rounded-lg bg-navy py-3.5 text-sm font-bold text-white shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-navy-soft"
      >
        Send Enquiry
        <span className="grid h-7 w-7 place-items-center rounded-full bg-gold text-navy transition-transform duration-300 group-hover:translate-x-0.5">
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </button>
    </form>
  );
}
