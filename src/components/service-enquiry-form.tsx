import { useId, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { submitLead } from "@/lib/leads";
import { amountProblem } from "@/lib/validation";
import { ThankYouCard } from "@/components/thank-you-card";

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-all duration-300 placeholder:text-muted-foreground/70 focus:border-gold focus:ring-2 focus:ring-gold/20 dark:bg-card dark:text-white";

const selectClass = `${fieldClass} appearance-none cursor-pointer`;

type IncomeType = "" | "Salaried" | "Self-Employed" | "Other";
type SalaryUnit = "Monthly" | "Annual (LPA)";

type Fields = {
  name: string;
  phone: string;
  message: string;
  incomeType: IncomeType;
  incomeOther: string;
  salaryUnit: SalaryUnit;
  salaryAmount: string;
};
const empty: Fields = {
  name: "",
  phone: "",
  message: "",
  incomeType: "",
  incomeOther: "",
  salaryUnit: "Monthly",
  salaryAmount: "",
};
const PHONE_RE = /^(?:\+?91[-\s]?|0)?[6-9]\d{9}$/;

// Groups typed digits with Indian comma placement (e.g. 12,50,000) as the user types.
function formatIndianAmount(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  return digits ? Number(digits).toLocaleString("en-IN") : "";
}

type Props = {
  heading?: string;
  description?: string;
  serviceTitle?: string;
  /** CA Services filings vary by income type — ask upfront there; skip for legal work. */
  showIncomeType?: boolean;
  /** A larger card that stretches to the height of whatever sits beside it. */
  roomy?: boolean;
};

export function ServiceEnquiryForm({
  heading = "Need Help With This?",
  description = "Tell us your requirement and our team will guide you on the process, documents and next steps.",
  serviceTitle,
  showIncomeType = false,
  roomy = false,
}: Props) {
  const uid = useId();
  const [values, setValues] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Partial<Fields>>({});
  const [submitted, setSubmitted] = useState(false);

  const set =
    (key: keyof Fields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setValues((v) => ({ ...v, [key]: e.target.value }));

  const setSalaryAmount = (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, salaryAmount: formatIndianAmount(e.target.value) }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Partial<Fields> = {};
    if (values.name.trim().length < 2) next.name = "Please enter your name";
    if (!PHONE_RE.test(values.phone.replace(/[\s-]/g, "")))
      next.phone = "Enter a valid 10-digit mobile number";
    if (values.incomeType === "Other" && !values.incomeOther.trim())
      next.incomeOther = "Please tell us what you are";
    if (values.incomeType && values.salaryAmount) {
      const n = Number(values.salaryAmount.replace(/\D/g, ""));
      // Monthly pay in rupees, or a yearly package in lakhs.
      const bounds =
        values.salaryUnit === "Monthly" ? { min: 5_000, max: 10_000_000 } : { min: 1, max: 500 };
      const msg = amountProblem(n, bounds);
      if (msg) {
        next.salaryAmount =
          values.salaryUnit === "Monthly"
            ? msg
            : n < 1
              ? "Please enter at least 1 lakh a year"
              : "That looks too high. Please check the figure (the most we can take is 500 lakh a year)";
      }
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const incomeDetail = values.incomeType
      ? ` — ${values.incomeType === "Other" ? `Other (${values.incomeOther.trim()})` : values.incomeType}${values.salaryAmount ? `, ₹${values.salaryAmount} (${values.salaryUnit})` : ""}`
      : "";
    await submitLead({
      name: values.name.trim(),
      phone: values.phone.trim(),
      source: "ca-legal-enquiry",
      detail: `${serviceTitle ? serviceTitle + " — " : ""}${values.message.trim()}${incomeDetail}`,
    });
    setValues(empty);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <ThankYouCard message="Our team will reach out to understand your requirement and the next steps." />
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={`rounded-2xl border border-border bg-white shadow-[var(--shadow-lift)] dark:bg-card ${roomy ? "flex h-full flex-col p-7 sm:p-10" : "p-6 sm:p-7"}`}
    >
      <h3 className={`font-extrabold text-navy dark:text-white ${roomy ? "text-2xl" : "text-xl"}`}>
        {heading}
      </h3>
      <p className={`mt-2 text-muted-foreground ${roomy ? "text-base" : "text-sm"}`}>
        {description}
      </p>
      <div className={`${roomy ? "mt-7 flex flex-1 flex-col space-y-6" : "mt-5 space-y-4"}`}>
        <div>
          <label
            htmlFor={`${uid}-name`}
            className="block text-[10px] font-bold tracking-[0.18em] text-navy uppercase dark:text-white"
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
          {errors.name && (
            <span className="mt-1 block text-xs text-destructive">{errors.name}</span>
          )}
        </div>
        <div>
          <label
            htmlFor={`${uid}-phone`}
            className="block text-[10px] font-bold tracking-[0.18em] text-navy uppercase dark:text-white"
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
          {errors.phone && (
            <span className="mt-1 block text-xs text-destructive">{errors.phone}</span>
          )}
        </div>
        {showIncomeType ? (
          <>
            <div>
              <label
                htmlFor={`${uid}-income-type`}
                className="block text-[10px] font-bold tracking-[0.18em] text-navy uppercase dark:text-white"
              >
                You Are (Optional)
              </label>
              <select
                id={`${uid}-income-type`}
                className={selectClass}
                value={values.incomeType}
                onChange={set("incomeType")}
              >
                <option value="">Select one</option>
                <option value="Salaried">Salaried</option>
                <option value="Self-Employed">Self-Employed</option>
                <option value="Other">Other</option>
              </select>
              {values.incomeType === "Other" ? (
                <input
                  className={`${fieldClass} mt-2`}
                  value={values.incomeOther}
                  onChange={set("incomeOther")}
                  maxLength={100}
                  placeholder="Please tell us what you are"
                />
              ) : null}
              {errors.incomeOther && (
                <span className="mt-1 block text-xs text-destructive">{errors.incomeOther}</span>
              )}
            </div>
            {values.incomeType ? (
              <div>
                <label
                  htmlFor={`${uid}-salary`}
                  className="block text-[10px] font-bold tracking-[0.18em] text-navy uppercase dark:text-white"
                >
                  {values.incomeType === "Salaried" ? "Salary" : "Income"} (Optional)
                </label>
                <div className="mt-1.5 flex gap-2">
                  <div className="relative min-w-0 flex-1">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-sm text-muted-foreground">
                      ₹
                    </span>
                    <input
                      id={`${uid}-salary`}
                      className={`${fieldClass} mt-0 w-full pl-7`}
                      value={values.salaryAmount}
                      onChange={setSalaryAmount}
                      inputMode="numeric"
                      placeholder={values.salaryUnit === "Monthly" ? "e.g. 40,000" : "e.g. 8"}
                    />
                    {errors.salaryAmount && (
                      <span className="mt-1 block text-xs text-destructive">
                        {errors.salaryAmount}
                      </span>
                    )}
                  </div>
                  <select
                    className={`${selectClass} mt-0 !w-32 shrink-0 px-2 text-sm`}
                    value={values.salaryUnit}
                    onChange={set("salaryUnit")}
                    aria-label="Salary period"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Annual (LPA)">Annual (LPA)</option>
                  </select>
                </div>
              </div>
            ) : null}
          </>
        ) : null}
        <div className={roomy ? "flex flex-1 flex-col" : ""}>
          <label
            htmlFor={`${uid}-message`}
            className="block text-[10px] font-bold tracking-[0.18em] text-navy uppercase dark:text-white"
          >
            Tell Us What You Need (Optional)
          </label>
          <textarea
            id={`${uid}-message`}
            className={`${fieldClass} resize-none ${roomy ? "min-h-[140px] flex-1" : "min-h-[80px]"}`}
            value={values.message}
            onChange={set("message")}
            placeholder="Briefly describe your requirement"
            maxLength={500}
          />
        </div>
      </div>
      <button
        type="submit"
        className={`group flex w-full items-center justify-center gap-3 rounded-lg bg-navy font-bold text-white ${roomy ? "mt-8 py-4 text-base" : "mt-6 py-3.5 text-sm"} shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-navy-soft`}
      >
        Send Enquiry
        <span className="grid h-7 w-7 place-items-center rounded-full bg-gold text-navy transition-transform duration-300 group-hover:translate-x-0.5">
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </button>
    </form>
  );
}
