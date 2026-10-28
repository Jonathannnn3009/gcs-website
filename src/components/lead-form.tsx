import { useId, useState, type ReactNode } from "react";
import { ArrowRight, Check } from "lucide-react";
import { CONTACT, SERVICES } from "@/data/site";
import { APPLICANT_CATEGORY_LABELS, PRODUCTS, SERVICE_FEE_SLUGS } from "@/data/products";
import { submitLead, submitLeadForFollowUp, type FollowUpPass } from "@/lib/leads";
import { followUpFor } from "@/data/follow-up-forms";
import { FollowUpFlow } from "@/components/follow-up-flow";
import { amountProblem, isValidEmail, loanAmountBounds } from "@/lib/validation";
import { Toast } from "@/components/toast";
import { FORM_LOAN_TYPES } from "@/data/page-lists";
import { useApplicantOptions, useCities, useList } from "@/lib/page-lists";

// Paperwork genuinely differs by applicant type for these two — ask early.
// Dropdown choices that are the same loan as a product page under another name.
const SLUG_ALIASES: Record<string, string> = { "overdraft-facility": "overdraft-limit" };

// Loans whose short form asks "You Are". The overdrafts are taken by salaried people as well as business owners.
const PERSON_ONLY_CATEGORIES = ["Salaried", "Self-Employed"];
const CATEGORY_LOANS = new Set(["home-loan"]);
// Who is applying, for the loans that ask it on the short form. The type of loan, property and industry are asked in the second form.
const LAP_SLUG = "loan-against-property";
type PropertyLoan = { applicants: string[] };
const PROPERTY_LOANS: Record<string, PropertyLoan> = {
  [LAP_SLUG]: {
    applicants: ["Salaried", "Self-Employed", "Partnership", "Pvt Ltd Co", "LLP", "Proprietorship"],
  },
  "micro-lap": {
    applicants: ["Salaried", "Self-Employed", "Proprietor", "Partner / Director"],
  },
  dlod: {
    applicants: [
      "Self-employed professional",
      "Proprietorship",
      "Partnership / LLP",
      "Pvt Ltd Co",
      "Salaried",
    ],
  },
  "project-funding": {
    applicants: [
      "Builder / Developer",
      "Partnership",
      "LLP",
      "Pvt Ltd Co",
      "Public Ltd Co",
      "Trust / Society",
    ],
  },
  "business-loan": {
    applicants: [
      "Proprietorship",
      "Partnership",
      "LLP",
      "Pvt Ltd Co",
      "Public Ltd Co",
      "Self-employed professional",
    ],
  },
  "micro-business-loan": {
    applicants: [
      "Self-employed individual",
      "Sole proprietorship",
      "Partnership firm",
      "LLP",
      "Private limited company",
    ],
  },
  "unsecured-dod": {
    applicants: [
      "Salaried",
      "Self-employed professional",
      "Proprietorship",
      "Partnership / LLP",
      "Pvt Ltd Co",
      "Public Ltd Co",
    ],
  },
  "professional-loan": {
    applicants: [],
  },
  "private-funding": {
    applicants: ["Proprietorship", "Partnership", "LLP", "Pvt Ltd Co", "Public Ltd Co"],
  },
  cgtmse: {
    applicants: ["Proprietorship", "Partnership", "LLP", "Pvt Ltd Co", "Public Ltd Co"],
  },
  "machine-loan": {
    applicants: ["Proprietorship", "Partnership", "LLP", "Pvt Ltd Co", "Public Ltd Co"],
  },
  "working-capital-term-loan": {
    applicants: [
      "Proprietorship",
      "Partnership",
      "LLP",
      "Pvt Ltd Co",
      "Public Ltd Co",
      "Self-employed professional",
    ],
  },
  "cash-credit": {
    applicants: ["Proprietorship", "Partnership", "LLP", "Pvt Ltd Co", "Public Ltd Co"],
  },
  "overdraft-limit": {
    applicants: ["Salaried", "Self-Employed", "Proprietorship", "Partnership / LLP", "Pvt Ltd Co"],
  },
  "bank-guarantee": {
    applicants: ["Proprietorship", "Partnership", "LLP", "Pvt Ltd Co", "Public Ltd Co"],
  },
  "letter-of-credit": {
    applicants: ["Proprietorship", "Partnership", "LLP", "Pvt Ltd Co", "Public Ltd Co"],
  },
  "bill-discounting": {
    applicants: ["Proprietorship", "Partnership", "LLP", "Pvt Ltd Co", "Public Ltd Co"],
  },
  "personal-loan": {
    applicants: ["Salaried", "Self-employed professional", "Self-employed business owner"],
  },
  "education-loan": {
    applicants: ["Student", "Co-applicant: Salaried", "Co-applicant: Self-Employed"],
  },
  "new-car-loan": {
    applicants: ["Salaried", "Self-Employed", "Proprietorship", "Partnership", "Pvt Ltd Co"],
  },
  "used-car-loan": {
    applicants: ["Salaried", "Self-Employed", "Proprietorship", "Partnership", "Pvt Ltd Co"],
  },
  "car-refinance": {
    applicants: ["Salaried", "Self-Employed", "Proprietorship", "Partnership", "Pvt Ltd Co"],
  },
  "loan-against-securities": {
    applicants: [
      "Salaried",
      "Self-Employed",
      "Retired or an investor",
      "Promoter of a listed company",
    ],
  },
  "commercial-vehicle": {
    applicants: ["Individual transporter", "Proprietorship", "Partnership", "Company"],
  },
  "lease-rental-discounting": {
    applicants: ["Individual owner", "Company / Firm", "Partnership", "LLP"],
  },
};
// The second form only tells salaried, self-employed and NRI apart: a firm or company counts as self-employed there.
// The lease rental form asks who owns the property instead, so it takes no applicant type.
const forSecondForm = (category: string, slug: string) =>
  [
    "lease-rental-discounting",
    "project-funding",
    "business-loan",
    "micro-business-loan",
    "private-funding",
    "cgtmse",
    "machine-loan",
    "working-capital-term-loan",
    "cash-credit",
    "bank-guarantee",
    "letter-of-credit",
    "bill-discounting",
    "education-loan",
    "commercial-vehicle",
  ].includes(slug)
    ? ""
    : [
          "Partnership",
          "Pvt Ltd Co",
          "LLP",
          "Proprietorship",
          "Proprietor",
          "Partner / Director",
          "Self-employed professional",
          "Partnership / LLP",
          "Public Ltd Co",
          "Self-employed business owner",
          "Promoter of a listed company",
        ].includes(category)
      ? "Self-Employed"
      : category;
// What the short form's answers already say in the second form.
const SECOND_FORM_OWNER: Record<string, string> = {
  "Individual owner": "An individual (or jointly with family)",
  "Company / Firm": "A company",
  Partnership: "A partnership firm or LLP",
  LLP: "A partnership firm or LLP",
};
// The drop-line overdraft form asks how the business is set up; the project form asks how the promoter is set up.
const SECOND_FORM_SETUP: Record<string, string> = {
  "Self-employed professional": "Professional (doctor, CA, architect, etc.)",
  Proprietorship: "Proprietorship",
  "Partnership / LLP": "Partnership or LLP",
  "Pvt Ltd Co": "Private limited company",
  "Public Ltd Co": "Limited company",
};
const SECOND_FORM_PROMOTER: Record<string, string> = {
  Partnership: "Partnership or LLP",
  LLP: "Partnership or LLP",
  "Pvt Ltd Co": "Private limited company",
  "Public Ltd Co": "Limited company",
  "Trust / Society": "Trust or society",
};
// The business loan forms ask how the business is set up, in the same words as "You Are".
const SECOND_FORM_BUSINESS: Record<string, string> = {
  "Pvt Ltd Co": "Private limited company",
  "Public Ltd Co": "Limited company",
};
const BUSINESS_SLUGS = ["business-loan", "micro-business-loan", "private-funding", "cgtmse"];
const SETUP_SLUGS = ["dlod", "unsecured-dod", "overdraft-limit", "overdraft-facility"];
// What the short form's answers already say in the second form. (The type of loan is asked in the second form.)
const knownFromShortForm = (slug: string, applicant: string): Record<string, string> => {
  if (slug === "education-loan")
    return {
      ...(applicant === "Co-applicant: Salaried" ? { coWork: "Salaried" } : {}),
      ...(applicant === "Co-applicant: Self-Employed" ? { coWork: "Runs a business" } : {}),
    };
  if (slug === "commercial-vehicle")
    return {
      ...(applicant === "Individual transporter"
        ? { constitution: "An individual transporter" }
        : {}),
      ...(["Proprietorship", "Partnership", "Company"].includes(applicant)
        ? { constitution: applicant }
        : {}),
    };
  if (slug === "loan-against-securities")
    return applicant === "Promoter of a listed company"
      ? { holding: "A promoter's shares in a company" }
      : {};
  if (BUSINESS_SLUGS.includes(slug))
    return { constitution: SECOND_FORM_BUSINESS[applicant] ?? applicant };
  if (slug === "project-funding")
    return SECOND_FORM_PROMOTER[applicant] ? { constitution: SECOND_FORM_PROMOTER[applicant] } : {};
  return {
    ...(SETUP_SLUGS.includes(slug) && SECOND_FORM_SETUP[applicant]
      ? { constitution: SECOND_FORM_SETUP[applicant] }
      : {}),
    ...(slug === "lease-rental-discounting" && SECOND_FORM_OWNER[applicant]
      ? { ownerType: SECOND_FORM_OWNER[applicant] }
      : {}),
  };
};
const OVERDRAFT_CATEGORY_LOANS = new Set(["unsecured-dod", "dlod", "overdraft-limit"]);
// Loan pages whose short form is kept to five questions: no loan type (the page says it) and no email.
const COMPACT_LOANS = new Set(["professional-loan"]);

type Fields = {
  name: string;
  phone: string;
  email: string;
  loanType: string;
  loanTypeOther: string;
  applicantCategory: string;
  /** For the loans that ask it: the kind of property, vehicle or project. */
  /** For an education loan: where the student will study, and who the co-applicant is. */
  categoryOther: string;
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
  categoryOther: "",
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
  // Only a loan's own page asks these. On the home and other general pages the short form stays short.
  const categoryOptionsFor = (title: string): string[] | null => {
    if (!product) return null;
    const slug = slugFor(title);
    if (slug && PROPERTY_LOANS[slug]?.applicants.length)
      return [...PROPERTY_LOANS[slug].applicants, "Other"];
    if (slug && CATEGORY_LOANS.has(slug)) return [...applicants, "Other"];
    if (slug && OVERDRAFT_CATEGORY_LOANS.has(slug)) return [...PERSON_ONLY_CATEGORIES, "Other"];
    return null;
  };
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
        // The home page's form is the short one only: after it, just the CIBIL reminder.
        skipQuestions={source === "home-enquiry"}
        basics={{
          name: b.name.trim(),
          phone: b.phone.trim(),
          email: b.email.trim(),
          city: b.city,
          category: forSecondForm(b.applicantCategory, b.slug),
          known: knownFromShortForm(b.slug, b.applicantCategory),
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
            Request a <span className="hero-stat-text">Free Consultation</span>
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Share a few details and an expert will call you back with matched lender options.
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
            {product && SERVICE_FEE_SLUGS.has(product.slug)
              ? "Kept confidential and called back within a day. The consultation is free, and any service fee is shared in writing before you go ahead."
              : "Kept confidential. Called back within a day. Free to you."}
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
