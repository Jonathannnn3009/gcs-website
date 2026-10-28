// The questions the GCS AI Loan Expert asks, one short list per kind of loan. They follow the
// GCS intake question tree (one question at a time, only what a first look needs). It is a fixed,
// guided flow, not a free-text bot: nothing here decides anything about a loan, it only organises
// the enquiry so a GCS expert can pick it up without asking the same things again.
import { loanMinimum, MIN_LOAN_AMOUNT, MIN_MONTHLY_INCOME } from "@/lib/validation";

export type StepKind = "choice" | "text" | "amount" | "number" | "city";

/** The cities offered in the dropdown; anything else is typed in under "Others". */
export const CITY_OPTIONS = ["Mumbai", "Navi Mumbai", "Thane", "Pune"];

/** "navi MUMBAI" becomes "Navi Mumbai". The length never changes, so it is safe while typing. */
export const titleCase = (value: string): string =>
  value.toLowerCase().replace(/(^|[\s\-'.])(\p{L})/gu, (_m, lead: string, letter: string) => lead + letter.toUpperCase());

export type Step = {
  /** Field key, e.g. "employment_type". */
  key: string;
  question: string;
  /** Short label for the summary screen. */
  label: string;
  kind: StepKind;
  options?: string[];
  /** Shown under the question to explain why it is asked or what to enter. */
  hint?: string;
  /** May be skipped ("Not sure" / "Prefer not to say"). */
  optional?: boolean;
  /** Placeholder for text / number boxes. */
  placeholder?: string;
  /** Only asked when an earlier answer matches, e.g. a follow-up to "Something else". */
  showIf?: { key: string; equals: string };
  /** A typed answer must be at least this long (after trimming). */
  minLength?: number;
  /** For an amount: the smallest figure accepted (MIN_AMOUNT when not set). */
  min?: number;
  /** For an amount: 0 is a valid answer, e.g. "no EMIs". */
  allowZero?: boolean;
};

/** The steps that apply, given the answers so far. */
export const visibleSteps = (steps: Step[], answers: Record<string, string>): Step[] =>
  steps.filter((s) => !s.showIf || answers[s.showIf.key] === s.showIf.equals);

export type Flow = {
  id: string;
  label: string;
  /** The website product slug the lead is tagged with in the CRM. */
  productSlug?: string;
  steps: Step[];
};

const YES_NO = ["Yes", "No"];
const YES_NO_SURE = ["Yes", "No", "Not sure"];
const EMPLOYMENT = ["Salaried", "Self-employed / business owner"];
const AGE_BANDS = ["Under 25", "25–35", "36–45", "46–55", "Above 55"];
const CREDIT_BANDS = ["750 and above", "700–749", "650–699", "Below 650", "I don't know"];
const CONSTITUTIONS = [
  "Proprietorship",
  "Partnership",
  "LLP",
  "Private / public company",
  "Other",
];
const VINTAGE = ["Less than 1 year", "1–3 years", "3–5 years", "More than 5 years"];

const city: Step = {
  key: "city",
  label: "City",
  question: "Which city are you in?",
  kind: "city",
  placeholder: "Type your city",
  minLength: 2,
};
// The smallest amount follows the kind of loan, the same as on the loan pages.
const amount = (question = "How much loan do you need?", min = MIN_LOAN_AMOUNT): Step => ({
  key: "requested_amount",
  label: "Amount needed",
  question,
  kind: "amount",
  min,
  hint: "An approximate figure in rupees is fine.",
});
const emi: Step = {
  key: "existing_emi_monthly",
  label: "Existing monthly EMIs",
  question: "Do you pay any EMIs every month? Enter the approximate total, or 0 if none.",
  kind: "amount",
  allowZero: true,
};
const creditBand: Step = {
  key: "credit_band",
  label: "Credit score range",
  question: "Do you know your approximate credit-score range?",
  hint: "Optional. Please do not type any PAN, Aadhaar or account numbers here.",
  kind: "choice",
  options: CREDIT_BANDS,
  optional: true,
};

export const FLOWS: Flow[] = [
  {
    id: "home",
    label: "Home loan",
    productSlug: "home-loan",
    steps: [
      {
        key: "home_loan_purpose",
        label: "Purpose",
        question: "What is the home loan for?",
        kind: "choice",
        options: ["Buying a property", "Construction", "Improvement / extension", "Top-up", "Balance transfer"],
      },
      city,
      { key: "employment_type", label: "Employment", question: "Are you salaried or self-employed?", kind: "choice", options: EMPLOYMENT },
      { key: "age_band", label: "Age band", question: "Which age band are you in?", kind: "choice", options: AGE_BANDS },
      {
        key: "income_monthly",
        label: "Monthly income",
        question: "What is your approximate monthly net income?",
        hint: "Salary in hand, or average monthly profit if you run a business.",
        kind: "amount",
        min: MIN_MONTHLY_INCOME,
      },
      emi,
      amount(undefined, loanMinimum("home-loan")),
      {
        key: "property_value",
        label: "Property value",
        question: "What is the approximate value of the property?",
        kind: "amount",
        optional: true,
      },
      {
        key: "property_type",
        label: "Property type",
        question: "What type of property is it?",
        kind: "choice",
        options: ["Ready flat / house", "Under construction", "Plot + construction", "Not decided yet"],
      },
      creditBand,
    ],
  },
  {
    id: "lap",
    label: "Loan against property",
    productSlug: "loan-against-property",
    steps: [
      {
        key: "collateral_type",
        label: "Property type",
        question: "What type of property would be offered as security?",
        kind: "choice",
        options: ["Residential", "Commercial", "Industrial", "Plot / land", "Other"],
      },
      city,
      { key: "property_value", label: "Property value", question: "What is the estimated current value of the property?", kind: "amount" },
      {
        key: "owner_relationship",
        label: "Owned by",
        question: "Who owns the property?",
        kind: "choice",
        options: ["Me", "My family", "My business", "Other"],
      },
      {
        key: "funding_purpose",
        label: "Purpose",
        question: "What will the money be used for?",
        kind: "choice",
        options: ["Business", "Education", "Medical", "Home / personal", "Other"],
      },
      amount("What amount do you need?", loanMinimum("loan-against-property")),
      { key: "employment_type", label: "Income type", question: "Are you salaried or self-employed?", kind: "choice", options: EMPLOYMENT },
      {
        key: "income_monthly",
        label: "Monthly income",
        question: "What is your approximate monthly net income or profit?",
        kind: "amount",
        min: MIN_MONTHLY_INCOME,
      },
      emi,
      {
        key: "existing_mortgage",
        label: "Already mortgaged?",
        question: "Is the property already mortgaged, or is there any dispute on it?",
        kind: "choice",
        options: ["Mortgaged", "Disputed", "Both", "Neither", "Not sure"],
      },
      {
        key: "property_docs_available",
        label: "Property papers",
        question: "Do you have the basic title / property papers?",
        kind: "choice",
        options: YES_NO_SURE,
      },
    ],
  },
  {
    id: "business",
    label: "Business loan",
    productSlug: "business-loan",
    steps: [
      { key: "business_constitution", label: "Business type", question: "What is your business constitution?", kind: "choice", options: CONSTITUTIONS },
      {
        key: "industry",
        label: "Business",
        question: "What does the business do?",
        kind: "text",
        placeholder: "e.g. garment manufacturing",
      },
      { ...city, key: "business_city", label: "Business city", question: "Which city is the business in?" },
      { key: "business_vintage", label: "Years in business", question: "How long has the business been operating?", kind: "choice", options: VINTAGE },
      {
        key: "annual_turnover",
        label: "Annual turnover",
        question: "What was the approximate annual turnover in the last completed financial year?",
        kind: "amount",
      },
      {
        key: "annual_net_profit",
        label: "Annual net profit",
        question: "What was the approximate annual net profit?",
        kind: "amount",
        optional: true,
      },
      {
        key: "gst_status",
        label: "GST",
        question: "Is the business GST-registered?",
        kind: "choice",
        options: ["Yes, for over 1 year", "Yes, under 1 year", "No"],
      },
      {
        key: "existing_debt_service",
        label: "Current repayments",
        question: "What is your total monthly repayment on existing business loans? Enter 0 if none.",
        kind: "amount",
        allowZero: true,
      },
      amount("How much funding do you need?", loanMinimum("business-loan")),
      {
        key: "funding_purpose",
        label: "Purpose",
        question: "What is the funding for?",
        kind: "choice",
        options: ["Expansion", "Stock / inventory", "Machinery", "Working capital", "Other"],
      },
      { key: "collateral_available", label: "Security available", question: "Can you offer property or other security?", kind: "choice", options: YES_NO_SURE },
    ],
  },
  {
    id: "working-capital",
    label: "Working capital / CC / OD",
    productSlug: "working-capital-term-loan",
    steps: [
      {
        key: "wc_use_case",
        label: "Need",
        question: "What do you need the working capital for?",
        kind: "choice",
        options: ["Seasonal demand", "Receivables", "Stock", "Supplier payments", "General liquidity"],
      },
      {
        key: "annual_turnover",
        label: "Annual turnover",
        question: "What is your approximate annual turnover?",
        kind: "amount",
      },
      {
        key: "monthly_bank_credits",
        label: "Monthly bank credits",
        question: "Roughly how much comes into the business bank account each month?",
        kind: "amount",
        optional: true,
      },
      {
        key: "receivable_days",
        label: "Customer payment cycle",
        question: "How long do customers usually take to pay you?",
        kind: "choice",
        options: ["Under 30 days", "30–60 days", "60–90 days", "Over 90 days"],
      },
      {
        key: "existing_wc_limits",
        label: "Existing CC / OD",
        question: "Do you already have a CC / OD or other working-capital limit?",
        kind: "choice",
        options: YES_NO,
      },
      amount("What limit do you need?", loanMinimum("working-capital-term-loan")),
      { key: "business_constitution", label: "Business type", question: "What is your business constitution?", kind: "choice", options: CONSTITUTIONS },
      { key: "business_vintage", label: "Years in business", question: "How long has the business been operating?", kind: "choice", options: VINTAGE },
      { key: "docs_availability", label: "Financials ready", question: "Are audited financials, GST returns and bank statements available?", kind: "choice", options: YES_NO_SURE },
      { key: "collateral_available", label: "Security available", question: "Is property or other security available if the lender needs it?", kind: "choice", options: YES_NO_SURE },
    ],
  },
  {
    id: "personal",
    label: "Personal loan",
    productSlug: "personal-loan",
    steps: [
      { key: "employment_type", label: "Employment", question: "Are you salaried or self-employed?", kind: "choice", options: EMPLOYMENT },
      { key: "monthly_net_income", label: "Monthly income", question: "What is your approximate monthly net income?", kind: "amount", min: MIN_MONTHLY_INCOME },
      {
        key: "employment_vintage",
        label: "Time in current job / business",
        question: "How long have you been with your current employer or in your business?",
        kind: "choice",
        options: ["Under 1 year", "1–3 years", "3–5 years", "More than 5 years"],
      },
      emi,
      amount("How much do you need?", loanMinimum("personal-loan")),
      {
        key: "funding_purpose",
        label: "Purpose",
        question: "What is the general purpose?",
        kind: "choice",
        options: ["Medical", "Wedding", "Travel", "Home needs", "Debt consolidation", "Other"],
      },
      city,
      { key: "age_band", label: "Age band", question: "Which age band are you in?", kind: "choice", options: AGE_BANDS },
      creditBand,
    ],
  },
  {
    id: "education",
    label: "Education loan",
    productSlug: "education-loan",
    steps: [
      { key: "study_country", label: "Study location", question: "Is the course in India or overseas?", kind: "choice", options: ["India", "Overseas"] },
      { key: "course", label: "Course and institution", question: "Which course and institution are you aiming for?", kind: "text", placeholder: "e.g. MBA, XYZ University" },
      {
        key: "intake_date",
        label: "Start date",
        question: "When does the course start?",
        kind: "choice",
        options: ["Within 3 months", "3–6 months", "6–12 months", "Not decided"],
      },
      {
        key: "admission_status",
        label: "Admission",
        question: "Do you have an admission / offer letter?",
        kind: "choice",
        options: ["Yes", "Applied, waiting", "Not yet"],
      },
      { key: "course_cost", label: "Total cost", question: "What is the total estimated cost of the course?", kind: "amount", min: loanMinimum("education-loan") },
      amount("How much funding do you need?", loanMinimum("education-loan")),
      {
        key: "coapplicant_income_type",
        label: "Co-applicant",
        question: "Who will be the co-applicant, and what do they do?",
        kind: "choice",
        options: ["Parent – salaried", "Parent – self-employed / business", "Other relative", "No co-applicant yet"],
      },
      { key: "collateral_available", label: "Security available", question: "Is property or other security available if needed?", kind: "choice", options: YES_NO_SURE },
      city,
    ],
  },
  {
    id: "vehicle",
    label: "Car / vehicle loan",
    productSlug: "new-car-loan",
    steps: [
      { key: "vehicle_condition", label: "Car", question: "Is the car new or used?", kind: "choice", options: ["New", "Used"] },
      { key: "vehicle_model", label: "Model", question: "Which model and year?", kind: "text", placeholder: "e.g. Hyundai Creta 2024" },
      { key: "vehicle_price", label: "On-road price", question: "What is the approximate on-road price?", kind: "amount" },
      { key: "down_payment", label: "Down payment", question: "How much down payment are you planning?", kind: "amount" },
      { key: "employment_type", label: "Employment", question: "Are you salaried or self-employed?", kind: "choice", options: EMPLOYMENT },
      { key: "income_monthly", label: "Monthly income", question: "What is your approximate monthly net income?", kind: "amount", min: MIN_MONTHLY_INCOME },
      emi,
      amount("What loan amount are you considering?", loanMinimum("used-car-loan")),
      {
        key: "desired_tenure",
        label: "Tenure",
        question: "Which repayment period suits you?",
        kind: "choice",
        options: ["Up to 3 years", "4–5 years", "6–7 years", "Not sure"],
      },
      { ...city, key: "registration_city", label: "Registration city", question: "In which city will the car be registered?" },
    ],
  },
  {
    id: "machinery",
    label: "Machinery finance",
    productSlug: "machine-loan",
    steps: [
      { key: "asset_type", label: "Machinery", question: "What machinery or equipment do you need?", kind: "text", placeholder: "e.g. CNC machine" },
      { key: "asset_condition", label: "Condition", question: "Is it new or used?", kind: "choice", options: ["New", "Used"] },
      { key: "asset_value", label: "Quotation value", question: "What is the supplier quotation value?", kind: "amount", min: loanMinimum("machine-loan") },
      { key: "own_contribution", label: "Your contribution", question: "How much margin can the business contribute?", kind: "amount" },
      { key: "business_constitution", label: "Business type", question: "What is your business constitution?", kind: "choice", options: CONSTITUTIONS },
      { key: "business_vintage", label: "Years in business", question: "How long has the business been operating?", kind: "choice", options: VINTAGE },
      { key: "annual_turnover", label: "Annual turnover", question: "What is the approximate annual turnover?", kind: "amount" },
      {
        key: "asset_purpose",
        label: "Reason",
        question: "Is this for expansion, replacement or a new setup?",
        kind: "choice",
        options: ["Expansion", "Replacement", "New setup"],
      },
      { key: "documents_available", label: "Financials ready", question: "Are financials and bank statements available?", kind: "choice", options: YES_NO_SURE },
      city,
    ],
  },
  {
    id: "trade",
    label: "LC / BG / trade finance",
    productSlug: "bank-guarantee",
    steps: [
      {
        key: "trade_facility_type",
        label: "Facility",
        question: "Which facility do you need?",
        kind: "choice",
        options: ["Letter of credit", "Bid / tender guarantee", "Performance guarantee", "Financial guarantee", "Not sure"],
      },
      { key: "requested_amount", label: "Amount", question: "What is the amount of the instrument?", kind: "amount", min: loanMinimum("bank-guarantee") },
      {
        key: "validity",
        label: "Validity",
        question: "For how long is it needed?",
        kind: "choice",
        options: ["Up to 3 months", "3–6 months", "6–12 months", "Over 12 months"],
      },
      {
        key: "underlying_contract_type",
        label: "Underlying deal",
        question: "What is it for?",
        kind: "choice",
        options: ["Tender", "Purchase order", "Contract", "Import / export", "Other"],
      },
      { key: "business_constitution", label: "Business type", question: "What is your business constitution?", kind: "choice", options: CONSTITUTIONS },
      { key: "annual_turnover", label: "Annual turnover", question: "What is the approximate annual turnover?", kind: "amount" },
      { key: "current_limits", label: "Existing limits", question: "Do you have existing bank limits?", kind: "choice", options: YES_NO },
      city,
    ],
  },
  {
    id: "balance-transfer",
    label: "Balance transfer",
    productSlug: "balance-transfer",
    steps: [
      {
        key: "existing_product",
        label: "Loan to move",
        question: "Which loan do you want to transfer?",
        kind: "choice",
        options: ["Home loan", "Loan against property", "Personal loan", "Business loan", "Other"],
      },
      { key: "current_outstanding", label: "Outstanding amount", question: "What is the current outstanding amount?", kind: "amount" },
      {
        key: "current_rate",
        label: "Current interest rate (%)",
        question: "What interest rate are you paying now?",
        kind: "number",
        placeholder: "e.g. 9.25",
        optional: true,
      },
      { key: "current_emi", label: "Current EMI", question: "What is your current EMI?", kind: "amount" },
      {
        key: "remaining_tenure",
        label: "Remaining tenure",
        question: "How much of the loan period is left?",
        kind: "choice",
        options: ["Under 5 years", "5–10 years", "10–20 years", "Over 20 years", "Not sure"],
      },
      {
        key: "transfer_goal",
        label: "Goal",
        question: "What would you like to achieve?",
        kind: "choice",
        options: ["Lower the total interest", "Lower the monthly EMI", "Get a top-up as well"],
      },
      city,
    ],
  },
  {
    id: "unsure",
    label: "Not sure yet",
    steps: [
      {
        key: "funding_purpose",
        label: "What you need",
        question: "Tell us briefly what you need the money for.",
        kind: "choice",
        options: ["Buy or build a home", "Business funding", "Personal need", "Education", "Vehicle", "Something else"],
      },
      amount("Roughly how much do you need?"),
      {
        key: "funding_purpose_other",
        label: "Where you need it",
        question: "Let us know what you need the money for.",
        kind: "text",
        hint: "A few words are enough, so the right expert can call you.",
        placeholder: "e.g. wedding, medical expense, renovation",
        showIf: { key: "funding_purpose", equals: "Something else" },
        minLength: 3,
      },
      { key: "employment_type", label: "Employment", question: "Are you salaried or self-employed?", kind: "choice", options: EMPLOYMENT },
      city,
    ],
  },
];

/** Version of the wording shown next to the consent box. Stored with every enquiry. */
export const CONSENT_VERSION = "advisor-2026-10-v1";

export const CONSENT_TEXT =
  "I agree that Growth Capital Services may use the details I have entered, and contact me on the number given, to look into my loan enquiry and share it with relevant lenders for this purpose. I understand this is an enquiry, not a loan approval, and that any lender decides after its own checks.";
