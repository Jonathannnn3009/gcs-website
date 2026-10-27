import { useId, useState, type ReactNode } from "react";
import { ArrowRight, Check } from "lucide-react";
import { CONTACT, SERVICES } from "@/data/site";
import { APPLICANT_CATEGORY_LABELS, PRODUCTS } from "@/data/products";
import { submitLead, submitLeadForFollowUp, type FollowUpPass } from "@/lib/leads";
import { followUpFor } from "@/data/follow-up-forms";
import { FollowUpFlow } from "@/components/follow-up-flow";
import { INDUSTRIES } from "@/data/industries";
import { amountProblem, isValidEmail, loanAmountBounds } from "@/lib/validation";
import { Toast } from "@/components/toast";
import { FORM_LOAN_TYPES } from "@/data/page-lists";
import { useApplicantOptions, useCities, useList } from "@/lib/page-lists";

// Paperwork genuinely differs by applicant type for these two — ask early.
// Dropdown choices that are the same loan as a product page under another name.
const SLUG_ALIASES: Record<string, string> = { "overdraft-facility": "overdraft-limit" };

// Loans whose short form asks "You Are". The overdrafts are taken by salaried people as well as business owners.
const PERSON_ONLY_CATEGORIES = ["Salaried", "Self-Employed"];
const CATEGORY_LOANS = new Set(["home-loan", "loan-against-property"]);
const OVERDRAFT_CATEGORY_LOANS = new Set(["unsecured-dod", "dlod", "overdraft-limit"]);
// Loans whose short form asks for the industry too.
const INDUSTRY_LOANS = new Set(["business-loan", "private-funding"]);
// Loans whose short form asks for the profession.
const PROFESSION_LOANS = new Set(["professional-loan"]);
// Loan pages whose short form is kept to five questions: no loan type (the page says it) and no email.
const COMPACT_LOANS = new Set(["professional-loan"]);
const PROFESSIONS = [
  "Doctor or dentist",
  "Chartered Accountant",
  "Company Secretary",
  "Architect",
  "Engineer",
  "Lawyer",
  "Other",
];

type Fields = {
  name: string;
  phone: string;
  email: string;
  loanType: string;
  loanTypeOther: string;
  applicantCategory: string;
  industry: string;
  profession: string;
  /** What was typed when "Other" was picked in the matching drop-down. */
  categoryOther: string;
  industryOther: string;
  professionOther: string;
  city: string;
  cityOther: string;
  loanAmount: string;
};

const empty: Fields = {
  name: "",
  phone: "",
  email: "",
  loanType: "",
  loanTypeOther: "",
  applicantCategory: "",
  industry: "",
  profession: "",
  categoryOther: "",
  industryOther: "",
  professionOther: "",
  city: "",
  cityOther: "",
  loanAmount: "",
};

const cardClass =
  "relative overflow-hidden rounded-2xl border border-border bg-white shadow-[var(--shadow-lift)] dark:bg-card";

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-all duration-300 placeholder:text-muted-foreground/70 focus:border-gold focus:ring-2 focus:ring-gold/20 dark:bg-card dark:text-white";

// Same base styling as fieldClass, minus the native browser arrow.
const selectClass = `${fieldClass} appearance-none cursor-pointer`;

// A real 10-digit Indian mobile number, with an optional country code or leading 0.
const PHONE_RE = /^(?:\+?91[-\s]?|0)?[6-9]\d{9}$/;

function AccentBar() {
  return <div className="h-1 bg-gradient-to-r from-navy via-navy-soft to-gold" />;
}

function Field({
  id,
  label,
  error,
  required = true,
  className = "",
  children,
}: {
  id: string;
  label: string;
  error?: string | undefined;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-[10px] font-bold tracking-[0.18em] text-navy uppercase dark:text-white"
      >
        {label} {required ? <span className="text-gold">*</span> : null}
      </label>
      {children}
      {error ? <span className="mt-1 block text-xs text-destructive">{error}</span> : null}
    </div>
  );
}

// Groups typed digits with Indian comma placement (e.g. 12,50,000) as the user types.
function formatIndianAmount(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  return digits ? Number(digits).toLocaleString("en-IN") : "";
}

export function LeadForm({
  defaultLoanType = "",
  source = "website-enquiry",
  product,
}: {
  defaultLoanType?: string;
  source?: string;
  /** The loan page this form sits on, so its loan is offered even when the drop-down list leaves it out. */
  product?: { slug: string; title: string };
} = {}) {
  const listed = useList("form.loanTypes", FORM_LOAN_TYPES);
  // The list may name this loan differently (or leave it out), so find it by its page and add it if absent.
  const own = product
    ? listed.find((s) => s.slug === product.slug || SLUG_ALIASES[s.slug] === product.slug)
    : undefined;
  const loanTypes =
    product && !own ? [...listed, { title: product.title, slug: product.slug }] : listed;
  const ownTitle = own?.title ?? product?.title;
  const cities = useCities();
  const applicants = useApplicantOptions();
  // The page a chosen loan type belongs to, and the "You Are" and industry questions that go with it.
  const slugFor = (title: string) => {
    // On a loan's own page the page decides the loan, whatever the drop-down list says.
    if (product) return SLUG_ALIASES[product.slug] ?? product.slug;
    const hit = loanTypes.find((s) => s.title === title);
    return hit ? (SLUG_ALIASES[hit.slug] ?? hit.slug) : undefined;
  };
  const categoryOptionsFor = (title: string): string[] | null => {
    const slug = slugFor(title);
    if (slug && CATEGORY_LOANS.has(slug)) return [...applicants, "Other"];
    if (slug && OVERDRAFT_CATEGORY_LOANS.has(slug)) return [...PERSON_ONLY_CATEGORIES, "Other"];
    return null;
  };
  const asksIndustry = (title: string) => INDUSTRY_LOANS.has(slugFor(title) ?? "");
  const asksProfession = (title: string) => PROFESSION_LOANS.has(slugFor(title) ?? "");
  const compact = !!product && COMPACT_LOANS.has(product.slug);
  const uid = useId();
  // Only pre-select a loan type the dropdown actually offers.
  const initial: Fields = {
    ...empty,
    loanType: product
      ? product.title
      : loanTypes.some((s) => s.title === (ownTitle ?? defaultLoanType))
        ? (ownTitle ?? defaultLoanType)
        : "",
  };
  const [values, setValues] = useState<Fields>(initial);
  const [errors, setErrors] = useState<Partial<Fields>>({});
  const [showToast, setShowToast] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // After a loan with a detailed second form is submitted, that form replaces this one.
  const [followUp, setFollowUp] = useState<{
    pass: FollowUpPass | null;
    basics: Fields & { slug: string; title: string };
    detail: string;
  } | null>(null);

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const setLoanType = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setValues((v) => ({
      ...v,
      loanType: e.target.value,
      loanTypeOther: "",
      applicantCategory: categoryOptionsFor(e.target.value)?.includes(v.applicantCategory)
        ? v.applicantCategory
        : "",
      industry: asksIndustry(e.target.value) ? v.industry : "",
      profession: asksProfession(e.target.value) ? v.profession : "",
    }));

  const setCity = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setValues((v) => ({ ...v, city: e.target.value, cityOther: "" }));

  const setLoanAmount = (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, loanAmount: formatIndianAmount(e.target.value) }));

  const validate = () => {
    const next: Partial<Fields> = {};
    if (values.name.trim().length < 2) next.name = "Please enter your full name";
    if (!PHONE_RE.test(values.phone.replace(/[\s-]/g, "")))
      next.phone = "Please match the requested format — a 10-digit mobile number";
    if (!compact && !isValidEmail(values.email.trim()))
      next.email = "Please match the requested format — name@example.com";
    if (!values.loanType) next.loanType = "Select a loan type";
    else if (values.loanType === "Other" && !values.loanTypeOther.trim())
      next.loanType = "Please enter your loan type";
    if (categoryOptionsFor(values.loanType) && !values.applicantCategory)
      next.applicantCategory = "Select one";
    if (values.applicantCategory === "Other" && !values.categoryOther.trim())
      next.applicantCategory = "Please tell us";
    if (asksIndustry(values.loanType)) {
      if (!values.industry) next.industry = "Select your industry";
      else if (values.industry === "Other" && !values.industryOther.trim())
        next.industry = "Please tell us your industry";
    }
    if (asksProfession(values.loanType)) {
      if (!values.profession) next.profession = "Select your profession";
      else if (values.profession === "Other" && !values.professionOther.trim())
        next.profession = "Please tell us your profession";
    }
    if (values.loanAmount) {
      // The loan page decides the smallest amount that makes sense (a home loan is not ₹10,000).
      const slug = slugFor(values.loanType);
      const msg = amountProblem(
        Number(values.loanAmount.replace(/\D/g, "")),
        loanAmountBounds(slug),
      );
      if (msg) next.loanAmount = msg;
    }
    if (!values.city) next.city = "Select your city";
    else if (values.city === "Other" && !values.cityOther.trim())
      next.city = "Please enter your city";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Hand the enquiry to the CRM. Loan types that match a product page carry its slug,
    // so the CRM files the lead under the right loan product.
    const service = product
      ? { title: product.title, slug: product.slug }
      : loanTypes.find((s) => s.title === values.loanType);
    const pageSlug = service ? (SLUG_ALIASES[service.slug] ?? service.slug) : undefined;
    const productSlug =
      pageSlug && PRODUCTS.some((p) => p.slug === pageSlug) ? pageSlug : undefined;
    const loanType = values.loanType === "Other" ? values.loanTypeOther.trim() : values.loanType;
    const city = values.city === "Other" ? values.cityOther.trim() : values.city;
    const detail = [
      `Loan type: ${loanType}`,
      values.applicantCategory
        ? `Applicant: ${values.applicantCategory === "Other" ? `Other (${values.categoryOther.trim()})` : values.applicantCategory}`
        : "",
      values.industry
        ? `Industry: ${values.industry === "Other" ? `Other (${values.industryOther.trim()})` : values.industry}`
        : "",
      values.profession
        ? `Profession: ${values.profession === "Other" ? `Other (${values.professionOther.trim()})` : values.profession}`
        : "",
    ]
      .filter(Boolean)
      .join(", ");

    setSubmitting(true);
    const lead = {
      name: values.name.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      city,
      ...(productSlug ? { productSlug } : {}),
      amount: values.loanAmount,
      source,
      detail,
    };
    // A loan type with no page of its own (the general "Car Loan", say) can still have a detailed form.
    const formSlug = productSlug ?? service?.slug;
    const second = followUpFor(formSlug);
    if (second) {
      const pass = await submitLeadForFollowUp(lead);
      setSubmitting(false);
      setFollowUp({
        pass,
        basics: { ...values, city, slug: formSlug!, title: values.loanType },
        detail,
      });
      return;
    }
    await submitLead(lead);
    setSubmitting(false);

    setValues(initial);
    setErrors({});
    setShowToast(true);
  };

  const secondForm = followUp ? followUpFor(followUp.basics.slug) : undefined;
  if (followUp && secondForm) {
    const b = followUp.basics;
    return (
      <FollowUpFlow
        form={secondForm}
        pass={followUp.pass}
        firstDetail={followUp.detail}
        basics={{
          name: b.name.trim(),
          phone: b.phone.trim(),
          email: b.email.trim(),
          city: b.city,
          category: b.applicantCategory,
          industry: b.industry,
          productSlug: b.slug,
          productTitle: b.title,
          source,
          amount: b.loanAmount,
        }}
      />
    );
  }

  return (
    <>
      <form onSubmit={onSubmit} noValidate className={cardClass}>
        <AccentBar />
        <div className="p-6 sm:p-7">
          <span className="inline-flex items-center gap-2 rounded-full bg-gold-pale/60 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-gold-dark uppercase dark:bg-gold/15">
            <span className="h-1.5 w-1.5 rounded-full bg-gold"></span>
            Takes less than a minute
          </span>
          <h3 className="mt-4 font-heading text-[1.6rem] leading-tight font-bold text-navy dark:text-white">
            Tell Us About You. <span className="hero-stat-text">We’ll Find the Right Fit.</span>
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Complete this quick form to help us understand your needs. Based on your details, we’ll
            explore suitable Banks &amp; NBFCs and compare available loan terms for your profile.
          </p>

          <div className="my-5 border-t border-dashed border-border" />

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id={`${uid}-name`}
              label="Full Name"
              error={errors.name}
              className="sm:col-span-2"
            >
              <input
                id={`${uid}-name`}
                className={fieldClass}
                value={values.name}
                onChange={set("name")}
                maxLength={100}
                placeholder="Enter your name"
              />
            </Field>

            <Field
              id={`${uid}-phone`}
              label="Phone"
              error={errors.phone}
              className={compact ? "sm:col-span-2" : ""}
            >
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

            {!compact ? (
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
            ) : null}

            {product && !compact ? (
              // On a loan's own page the loan is already known, so it is shown, not asked.
              <Field id={`${uid}-loan`} label="Loan Type" error={errors.loanType}>
                <div
                  id={`${uid}-loan`}
                  className={`${fieldClass} flex items-center justify-between gap-2 bg-secondary/50 font-semibold dark:bg-card`}
                >
                  <span>{product.title}</span>
                  <Check className="h-4 w-4 shrink-0 text-gold-dark" aria-hidden />
                </div>
              </Field>
            ) : !compact ? (
              <Field id={`${uid}-loan`} label="Loan Type" error={errors.loanType}>
                <select
                  id={`${uid}-loan`}
                  className={selectClass}
                  value={values.loanType}
                  onChange={setLoanType}
                >
                  <option value="">Select loan type</option>
                  {loanTypes.map((s) => (
                    <option key={s.slug || s.title} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
                {values.loanType === "Other" ? (
                  <input
                    className={`${fieldClass} mt-2`}
                    value={values.loanTypeOther}
                    onChange={set("loanTypeOther")}
                    maxLength={100}
                    placeholder="Enter your loan type"
                    autoFocus
                  />
                ) : null}
              </Field>
            ) : null}

            {categoryOptionsFor(values.loanType) ? (
              <Field
                id={`${uid}-applicant-category`}
                label="You Are"
                error={errors.applicantCategory}
                className="sm:col-span-2"
              >
                <select
                  id={`${uid}-applicant-category`}
                  className={selectClass}
                  value={values.applicantCategory}
                  onChange={set("applicantCategory")}
                >
                  <option value="">Select one</option>
                  {(categoryOptionsFor(values.loanType) ?? []).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {values.applicantCategory === "Other" ? (
                  <input
                    className={`${fieldClass} mt-2`}
                    value={values.categoryOther}
                    onChange={set("categoryOther")}
                    maxLength={100}
                    placeholder="Please tell us what you are"
                    autoFocus
                  />
                ) : null}
              </Field>
            ) : null}

            {asksIndustry(values.loanType) ? (
              <Field
                id={`${uid}-industry`}
                label="Industry"
                error={errors.industry}
                className="sm:col-span-2"
              >
                <select
                  id={`${uid}-industry`}
                  className={selectClass}
                  value={values.industry}
                  onChange={set("industry")}
                >
                  <option value="">Select your industry</option>
                  {INDUSTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {values.industry === "Other" ? (
                  <input
                    className={`${fieldClass} mt-2`}
                    value={values.industryOther}
                    onChange={set("industryOther")}
                    maxLength={100}
                    placeholder="Enter your industry"
                    autoFocus
                  />
                ) : null}
              </Field>
            ) : null}

            {asksProfession(values.loanType) ? (
              <Field
                id={`${uid}-profession`}
                label="Profession"
                error={errors.profession}
                className="sm:col-span-2"
              >
                <select
                  id={`${uid}-profession`}
                  className={selectClass}
                  value={values.profession}
                  onChange={set("profession")}
                >
                  <option value="">What is your profession?</option>
                  {PROFESSIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {values.profession === "Other" ? (
                  <input
                    className={`${fieldClass} mt-2`}
                    value={values.professionOther}
                    onChange={set("professionOther")}
                    maxLength={100}
                    placeholder="Enter your profession"
                    autoFocus
                  />
                ) : null}
              </Field>
            ) : null}

            <Field id={`${uid}-city`} label="City" error={errors.city}>
              <select
                id={`${uid}-city`}
                className={selectClass}
                value={values.city}
                onChange={setCity}
              >
                <option value="">Select city</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                <option value="Other">Other</option>
              </select>
              {values.city === "Other" ? (
                <input
                  className={`${fieldClass} mt-2`}
                  value={values.cityOther}
                  onChange={set("cityOther")}
                  maxLength={100}
                  placeholder="Enter your city"
                  autoFocus
                />
              ) : null}
            </Field>

            <Field
              id={`${uid}-amount`}
              label="Loan Amount"
              error={errors.loanAmount}
              required={false}
              className="sm:col-span-2"
            >
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-sm text-muted-foreground">
                  ₹
                </span>
                <input
                  id={`${uid}-amount`}
                  className={`${fieldClass} pl-7`}
                  value={values.loanAmount}
                  onChange={setLoanAmount}
                  inputMode="numeric"
                  placeholder="e.g. 5,00,000"
                />
              </div>
            </Field>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="group mt-6 flex w-full items-center justify-center gap-3 disabled:opacity-70 rounded-lg bg-navy py-3.5 text-sm font-bold text-white shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-navy-soft"
          >
            Submit
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
