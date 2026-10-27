// The detailed "Tell us about ..." questions asked on a few loan pages instead of the short
// consultation form. They follow the wording the team supplied. Each step is one screen; a question
// can be shown only when an earlier answer says so (showWhen), the same idea as the checklist form.

export type ShowWhen = { key: string; values: string[] };

type Base = { key: string; label: string; help?: string; required?: boolean; showWhen?: ShowWhen };

export type QuestionField =
  | (Base & { kind: "choice"; options: string[]; /** A dropdown instead of buttons, for a long list. */ dropdown?: boolean })
  | (Base & { kind: "multi"; options: string[] })
  | (Base & { kind: "text"; placeholder?: string; long?: boolean })
  | (Base & { kind: "amount"; placeholder?: string; /** 0 is a valid answer, e.g. "no EMIs". */ allowZero?: boolean })
  | (Base & { kind: "percent" });

export type QuestionStep = { title: string; help?: string; fields: QuestionField[] };

export type Questionnaire = {
  /** The loan pages this applies to. */
  slugs: string[];
  /** Heading of the card and the line under it. */
  title: string;
  intro: string;
  steps: QuestionStep[];
  /** The last screen: heading, the paragraph above the contact fields, and the button. */
  finalTitle: string;
  finalText: string;
  button: string;
  /** What the "Apply" button on the page says it is for, e.g. the name used in the lead notes. */
  topic: string;
  /** Which answer is the amount asked for (goes to the lead's amount). */
  amountKey: string;
  disclaimer: string;
};

const YES_NO = ["Yes", "No"];
const rupee = "e.g. 50,00,000";

// ───────────── Drop-Line Overdraft, and the same for Overdraft ─────────────
function overdraft(name: string, slugs: string[], topic: string, bt: string): Questionnaire {
  return {
    slugs,
    title: "Tell Us About Your Funding Requirement",
    intro: "Just a few steps to understand you better, so we can give you the right information faster.",
    topic,
    amountKey: "limit",
    steps: [
      {
        title: "What is your employment or business profile?",
        fields: [
          {
            key: "profile",
            label: "Profile",
            kind: "choice",
            required: true,
            options: [
              "Salaried",
              "Self-Employed Professional",
              "Proprietorship",
              "Partnership Firm",
              "LLP",
              "Private Limited Company",
              "Limited Company",
            ],
          },
        ],
      },
      {
        title: `How much ${name} limit do you require?`,
        fields: [
          { key: "limit", label: "Required amount", kind: "amount", required: true, placeholder: rupee },
          {
            key: "purpose",
            label: "Main purpose",
            kind: "choice",
            options: [
              "Business Expansion",
              "Working Capital",
              "Debt Consolidation / Balance Transfer",
              "Business Expenses",
              "Personal Financial Requirement",
              "Other",
            ],
          },
        ],
      },
      {
        title: "What is your income or business turnover?",
        fields: [
          {
            key: "salary",
            label: "Monthly net salary",
            kind: "amount",
            placeholder: "e.g. 1,00,000",
            showWhen: { key: "profile", values: ["Salaried"] },
          },
          {
            key: "turnover",
            label: "Annual turnover",
            kind: "amount",
            placeholder: rupee,
            showWhen: {
              key: "profile",
              values: [
                "Self-Employed Professional",
                "Proprietorship",
                "Partnership Firm",
                "LLP",
                "Private Limited Company",
                "Limited Company",
              ],
            },
          },
          {
            key: "profit",
            label: "Annual net profit",
            kind: "amount",
            placeholder: rupee,
            showWhen: {
              key: "profile",
              values: [
                "Self-Employed Professional",
                "Proprietorship",
                "Partnership Firm",
                "LLP",
                "Private Limited Company",
                "Limited Company",
              ],
            },
          },
        ],
      },
      {
        title: "How long have you been in your current job or business?",
        fields: [
          {
            key: "vintage",
            label: "Time in current job / business",
            kind: "choice",
            options: ["Less than 2 Years", "2–5 Years", "5–10 Years", "More than 10 Years"],
          },
        ],
      },
      {
        title: "Do you have any existing loans or credit facilities?",
        fields: [
          { key: "hasLoans", label: "Existing loans or facilities", kind: "choice", options: YES_NO },
          { key: "loanType", label: "Loan / facility type", kind: "text", showWhen: { key: "hasLoans", values: ["Yes"] } },
          {
            key: "loanOutstanding",
            label: "Outstanding amount",
            kind: "amount",
            allowZero: true,
            placeholder: rupee,
            showWhen: { key: "hasLoans", values: ["Yes"] },
          },
          {
            key: "loanEmi",
            label: "Monthly instalment / monthly obligation",
            kind: "amount",
            allowZero: true,
            placeholder: "e.g. 25,000",
            showWhen: { key: "hasLoans", values: ["Yes"] },
          },
          {
            key: "existingOdCc",
            label: "Existing overdraft / cash credit limit, if any",
            kind: "amount",
            allowZero: true,
            placeholder: rupee,
            showWhen: { key: "hasLoans", values: ["Yes"] },
          },
          { key: "loanBank", label: "Current bank or finance company", kind: "text", showWhen: { key: "hasLoans", values: ["Yes"] } },
        ],
      },
      {
        title: "What type of property or security is available?",
        fields: [
          {
            key: "propertyType",
            label: "Property type",
            kind: "choice",
            options: ["Residential Property", "Commercial Property", "Industrial Property", "Other Eligible Property"],
          },
          { key: "ownership", label: "Property ownership", kind: "choice", options: ["Self", "Joint", "Family-Owned"] },
          { key: "propertyValue", label: "Approximate market value", kind: "amount", placeholder: rupee },
          { key: "propertyLocation", label: "Property location", kind: "text" },
        ],
      },
      {
        title: "What is your current banking and credit profile?",
        fields: [
          { key: "primaryBank", label: "Primary bank name", kind: "text" },
          { key: "monthlyCredits", label: "Average monthly banking / credits", kind: "amount", placeholder: "e.g. 5,00,000" },
          { key: "emiReturn", label: "Any missed monthly instalment or cheque return in recent months?", kind: "choice", options: YES_NO },
          { key: "overdue", label: "Any current overdue?", kind: "choice", options: YES_NO },
          { key: "cibil", label: "Approximate CIBIL score, if known", kind: "text", placeholder: "e.g. 740" },
        ],
      },
      {
        title: `Is this a fresh requirement or a balance transfer?`,
        fields: [
          {
            key: "freshOrBt",
            label: "Requirement",
            kind: "choice",
            options: [`Fresh ${bt}`, "Balance Transfer of Existing Overdraft / Loan", "Balance Transfer + Additional Funding"],
          },
          {
            key: "btLender",
            label: "Existing lender",
            kind: "text",
            showWhen: { key: "freshOrBt", values: ["Balance Transfer of Existing Overdraft / Loan", "Balance Transfer + Additional Funding"] },
          },
          {
            key: "btOutstanding",
            label: "Current outstanding / limit",
            kind: "amount",
            placeholder: rupee,
            showWhen: { key: "freshOrBt", values: ["Balance Transfer of Existing Overdraft / Loan", "Balance Transfer + Additional Funding"] },
          },
          {
            key: "btRate",
            label: "Current rate of interest",
            kind: "percent",
            showWhen: { key: "freshOrBt", values: ["Balance Transfer of Existing Overdraft / Loan", "Balance Transfer + Additional Funding"] },
          },
          {
            key: "btExtra",
            label: "Additional funding required",
            kind: "amount",
            placeholder: rupee,
            showWhen: { key: "freshOrBt", values: ["Balance Transfer + Additional Funding"] },
          },
        ],
      },
    ],
    finalTitle: `Check Your ${bt} Eligibility`,
    finalText: `Based on these basic details, Growth Capital Services can understand your financial requirement and help explore suitable ${name} options from its network of Banks & NBFCs.`,
    button: "Check Your Eligibility",
    disclaimer:
      "Eligibility, overdraft limit, interest rate, tenure, property acceptability, repayment structure, charges and approval are subject to the applicant's financial and credit profile, property assessment and the respective Bank or NBFC's lending policy.",
  };
}

// ───────────── The same layout everywhere ─────────────
// Long lists are dropdowns, picking "Other" opens a "please mention" box, and the questions come three
// to a screen (questions that only appear after an earlier answer ride along with their screen).
function polish(q: Questionnaire, titles: string[]): Questionnaire {
  const flat: QuestionField[] = [];
  for (const step of q.steps) {
    for (const f of step.fields) {
      const field: QuestionField =
        f.kind === "choice" && f.options.length > 2 ? { ...f, dropdown: true } : f;
      flat.push(field);
      if (field.kind === "choice" && field.options.includes("Other") && !field.showWhen) {
        flat.push({
          key: `${field.key}Other`,
          label: "Please mention",
          kind: "text",
          showWhen: { key: field.key, values: ["Other"] },
        });
      }
    }
  }
  const screens: QuestionField[][] = [];
  let base = 0;
  for (const f of flat) {
    if (!f.showWhen) {
      if (base >= 3 || screens.length === 0) {
        screens.push([]);
        base = 0;
      }
      base += 1;
    } else if (screens.length === 0) {
      screens.push([]);
    }
    screens[screens.length - 1]!.push(f);
  }
  const steps: QuestionStep[] = screens.map((fields, i) => ({
    title: titles[i] ?? "A few more details",
    fields,
  }));
  return { ...q, steps };
}

const OVERDRAFT_TITLES = [
  "Your profile, limit and income",
  "Experience, existing loans and property",
  "Property details",
  "Banking and repayment",
  "Credit profile and type of requirement",
];

export const QUESTIONNAIRES: Questionnaire[] = [
  polish(overdraft("Overdraft", ["overdraft-limit"], "Overdraft", "Overdraft"), OVERDRAFT_TITLES),
];

export const questionnaireFor = (slug: string): Questionnaire | undefined =>
  QUESTIONNAIRES.find((q) => q.slugs.includes(slug));
