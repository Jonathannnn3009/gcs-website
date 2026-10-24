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

// ───────────── Project Finance / Project Funding ─────────────
const PROJECT: Questionnaire = {
  slugs: ["project-funding"],
  title: "Tell Us About Your Project",
  intro: "Just a few quick steps to understand your project better. Share what you can: only two answers are required.",
  topic: "Project funding",
  amountKey: "fundingRequired",
  steps: [
    {
      title: "Tell us about the project",
      fields: [
        {
          key: "projectType",
          label: "Industry",
          kind: "choice",
          dropdown: true,
          required: true,
          options: [
            "Real Estate / Construction",
            "Residential Township / Housing",
            "Commercial Project / Mall / Office",
            "Infrastructure",
            "Manufacturing",
            "Engineering & Fabrication",
            "Steel / Metal / Mining",
            "Textile & Apparel",
            "Food Processing / Agro",
            "Cold Storage / Warehousing / Logistics",
            "Pharma / Chemicals",
            "Plastic / Rubber / Packaging",
            "Automobile & Auto Components",
            "Electrical / Electronics / IT Hardware",
            "Hotel / Hospitality / Tourism",
            "Hospital / Healthcare / Diagnostics",
            "Education / Institution",
            "Renewable Energy (Solar / Wind)",
            "Data Centre / IT Park",
            "Other",
          ],
        },
        {
          key: "projectTypeOther",
          label: "Please mention your industry",
          kind: "text",
          showWhen: { key: "projectType", values: ["Other"] },
        },
        {
          key: "stage",
          label: "Current stage of the project",
          kind: "choice",
          dropdown: true,
          options: [
            "Planning Stage",
            "Land Identified",
            "Land Purchased / Owned",
            "Approvals in Process",
            "Construction / Setup Started",
            "Partially Completed",
            "Existing Project – Expansion",
            "Other",
          ],
        },
        {
          key: "stageOther",
          label: "Please mention the stage",
          kind: "text",
          showWhen: { key: "stage", values: ["Other"] },
        },
        {
          key: "purpose",
          label: "Main purpose of the funding",
          kind: "choice",
          dropdown: true,
          options: [
            "Land / Property",
            "Construction",
            "Plant & Machinery",
            "Equipment",
            "Expansion",
            "Working Capital",
            "Multiple Purposes",
            "Other",
          ],
        },
        {
          key: "purposeOther",
          label: "Please mention the purpose",
          kind: "text",
          showWhen: { key: "purpose", values: ["Other"] },
        },
      ],
    },
    {
      title: "Project cost and funding",
      help: "For the total project cost, include the approximate cost of land, building, plant & machinery, setup and other project expenses, as applicable.",
      fields: [
        { key: "projectCost", label: "Total project cost", kind: "amount", placeholder: rupee },
        { key: "fundingRequired", label: "Funding required", kind: "amount", required: true, placeholder: rupee },
        {
          key: "ownContribution",
          label: "Your own contribution so far, and what more you can add (₹ or %)",
          kind: "text",
          placeholder: "e.g. ₹1 Cr or 25%",
        },
      ],
    },
    {
      title: "Security and project papers",
      fields: [
        {
          key: "security",
          label: "What security or collateral is available? (select all that apply)",
          kind: "multi",
          options: [
            "Project Property",
            "Residential Property",
            "Commercial Property",
            "Industrial Property",
            "Land",
            "Plant & Machinery",
            "Other Security",
          ],
        },
        { key: "securityValue", label: "Approximate value of the security", kind: "amount", placeholder: rupee },
        {
          key: "dpr",
          label: "Are the Detailed Project Report and the main approvals ready?",
          kind: "choice",
          dropdown: true,
          options: ["Yes", "In Process", "No"],
        },
      ],
    },
    {
      title: "Tell us about the promoter or existing business",
      fields: [
        { key: "businessName", label: "Business / company name", kind: "text" },
        {
          key: "constitution",
          label: "Constitution",
          kind: "choice",
          dropdown: true,
          options: ["Proprietorship", "Partnership", "LLP", "Pvt. Ltd.", "Ltd.", "Trust / Society", "Other"],
        },
        {
          key: "constitutionOther",
          label: "Please mention the constitution",
          kind: "text",
          showWhen: { key: "constitution", values: ["Other"] },
        },
        { key: "yearsInBusiness", label: "Years in business", kind: "text", placeholder: "e.g. 8 years" },
      ],
    },
    {
      title: "Business numbers",
      fields: [
        { key: "turnover", label: "Latest annual turnover", kind: "amount", placeholder: rupee },
        { key: "profit", label: "Profit / cash accruals", kind: "text", placeholder: "e.g. ₹40 Lakh" },
        { key: "existingLoans", label: "Existing loans / banking facilities, if any", kind: "text", long: true },
      ],
    },
    {
      title: "Experience and approvals",
      help: "For a new project, please mention the promoters' relevant business or industry experience.",
      fields: [
        { key: "experience", label: "Promoters' experience (for a new project)", kind: "text", long: true },
        {
          key: "approvals",
          label: "Status of major approvals, licences, permissions and registrations",
          kind: "text",
          long: true,
        },
      ],
    },
  ],
  finalTitle: "Submit for Initial Project Finance Assessment",
  finalText:
    "Based on these details, Growth Capital Services can understand your requirement and help explore suitable project-finance options from its network of Banks & NBFCs.",
  button: "Discuss Your Project Funding Requirement",
  disclaimer:
    "Project funding is subject to project viability, promoter profile and contribution, financial assessment, security or collateral, statutory approvals, credit assessment and the respective Bank or NBFC's lending policy.",
};

// ───────────── Drop-Line Overdraft, and the same for Overdraft ─────────────
function overdraft(name: string, slugs: string[], topic: string, bt: string): Questionnaire {
  return {
    slugs,
    title: "Tell Us About Your Funding Requirement",
    intro: `Just a few quick steps to understand your ${name.toLowerCase()} requirement better, and we will take it from there.`,
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

// ───────────── Balance Transfer & Top-Up ─────────────
const BALANCE_TRANSFER: Questionnaire = {
  slugs: ["balance-transfer"],
  title: "Tell Us About Your Existing Loan & Additional Funding Requirement",
  intro: "Just a few quick steps to understand your existing loan better, and we will take it from there.",
  topic: "Balance transfer and top-up",
  amountKey: "topUp",
  steps: [
    {
      title: "What type of existing facility do you have?",
      fields: [
        {
          key: "facility",
          label: "Existing facility",
          kind: "choice",
          required: true,
          options: ["Home Loan", "Loan Against Property", "Dropline Overdraft"],
        },
        {
          key: "requirement",
          label: "Requirement",
          kind: "choice",
          required: true,
          options: ["Balance Transfer Only", "Balance Transfer + Top-Up"],
        },
      ],
    },
    {
      title: "What are your existing loan details?",
      fields: [
        { key: "bank", label: "Existing bank or finance company", kind: "text" },
        { key: "original", label: "Original loan / sanctioned amount", kind: "amount", placeholder: rupee },
        { key: "outstanding", label: "Current outstanding", kind: "amount", placeholder: rupee },
        { key: "rate", label: "Current interest rate", kind: "percent" },
        { key: "emi", label: "Current monthly instalment / monthly obligation", kind: "amount", placeholder: "e.g. 45,000" },
        { key: "tenure", label: "Remaining tenure", kind: "text", placeholder: "e.g. 12 years" },
      ],
    },
    {
      title: "How much additional top-up funding do you need?",
      fields: [
        {
          key: "topUp",
          label: "Top-up amount required",
          kind: "amount",
          placeholder: rupee,
          showWhen: { key: "requirement", values: ["Balance Transfer + Top-Up"] },
        },
        {
          key: "topUpPurpose",
          label: "Purpose of additional funding",
          kind: "choice",
          options: [
            "Business Expansion",
            "Working Capital",
            "Property Purchase / Construction",
            "Home Renovation",
            "Debt Consolidation",
            "Education",
            "Medical / Personal Requirement",
            "Other",
          ],
          showWhen: { key: "requirement", values: ["Balance Transfer + Top-Up"] },
        },
      ],
    },
    {
      title: "How long have you been paying the existing loan?",
      fields: [
        { key: "vintage", label: "Loan vintage", kind: "text", placeholder: "e.g. 3 years 6 months" },
        {
          key: "track",
          label: "Repayment track",
          kind: "choice",
          options: ["Regular Monthly Instalment Payments", "Some Delays / Bounces", "Current Overdue"],
        },
        {
          key: "trackReason",
          label: "Please tell us briefly the reason for the delay or overdue",
          kind: "text",
          long: true,
          showWhen: { key: "track", values: ["Some Delays / Bounces", "Current Overdue"] },
        },
      ],
    },
    {
      title: "What is your employment or business profile?",
      fields: [
        {
          key: "profile",
          label: "Applicant type",
          kind: "choice",
          options: [
            "Salaried",
            "Self-Employed Professional",
            "Proprietor",
            "Partnership",
            "LLP",
            "Private Limited Company",
            "Other",
          ],
        },
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
            values: ["Self-Employed Professional", "Proprietor", "Partnership", "LLP", "Private Limited Company", "Other"],
          },
        },
        {
          key: "income",
          label: "Annual net profit / income",
          kind: "amount",
          placeholder: rupee,
          showWhen: {
            key: "profile",
            values: ["Self-Employed Professional", "Proprietor", "Partnership", "LLP", "Private Limited Company", "Other"],
          },
        },
      ],
    },
    {
      title: "What are the property details?",
      fields: [
        {
          key: "propertyType",
          label: "Property type",
          kind: "choice",
          options: ["Residential", "Commercial", "Industrial", "Other Eligible Property"],
        },
        { key: "propertyLocation", label: "Property location", kind: "text" },
        { key: "propertyValue", label: "Approximate current market value", kind: "amount", placeholder: rupee },
        { key: "ownership", label: "Ownership", kind: "choice", options: ["Self", "Joint", "Other"] },
      ],
    },
    {
      title: "Do you have any other existing loans or credit facilities?",
      help: "This helps us understand your overall existing repayment obligations.",
      fields: [
        { key: "hasLoans", label: "Other loans or facilities", kind: "choice", options: YES_NO },
        { key: "otherType", label: "Loan / facility type", kind: "text", showWhen: { key: "hasLoans", values: ["Yes"] } },
        {
          key: "otherOutstanding",
          label: "Outstanding amount",
          kind: "amount",
            allowZero: true,
          placeholder: rupee,
          showWhen: { key: "hasLoans", values: ["Yes"] },
        },
        {
          key: "otherEmi",
          label: "Monthly instalment / monthly obligation",
          kind: "amount",
            allowZero: true,
          placeholder: "e.g. 20,000",
          showWhen: { key: "hasLoans", values: ["Yes"] },
        },
        { key: "otherBank", label: "Bank or finance company", kind: "text", showWhen: { key: "hasLoans", values: ["Yes"] } },
      ],
    },
    {
      title: "What is your credit profile?",
      fields: [
        {
          key: "cibil",
          label: "Approximate CIBIL score",
          kind: "choice",
          options: ["750+", "700–749", "650–699", "Below 650", "Don't Know"],
        },
        {
          key: "issue",
          label: "Any current overdue, settlement, write-off or major repayment issue?",
          kind: "choice",
          options: YES_NO,
        },
        {
          key: "issueDetails",
          label: "Please give brief details",
          kind: "text",
          long: true,
          showWhen: { key: "issue", values: ["Yes"] },
        },
      ],
    },
  ],
  finalTitle: "Check Your Balance Transfer & Top-Up Options",
  finalText:
    "Share these basic details and Growth Capital Services can review your existing facility and help explore suitable Balance Transfer + Top-Up options from its network of Banks & NBFCs.",
  button: "Check My Eligibility",
  disclaimer:
    "Loan eligibility, balance transfer, top-up amount, interest rate, tenure, charges and approval are subject to the applicant's financial and credit profile, existing repayment history, property assessment and the respective Bank or NBFC's lending policy.",
};

// ───────────── Private Funding ─────────────
const PRIVATE_FUNDING: Questionnaire = {
  slugs: ["private-funding"],
  title: "Tell Us About Your Business",
  intro: "Just a few quick steps to understand your business better. Private Funding is for self-employed businesses.",
  topic: "Private funding",
  amountKey: "fundingRequired",
  steps: [
    {
      title: "Your business profile",
      fields: [
        {
          key: "profile",
          label: "Business profile",
          kind: "choice",
          required: true,
          options: ["Proprietorship", "Partnership", "LLP", "Private Limited", "Limited Company", "Other"],
        },
        { key: "industry", label: "Industry / Nature of Business", kind: "text", required: true },
        { key: "city", label: "City", kind: "text", required: true, placeholder: "e.g. Mumbai" },
      ],
    },
    {
      title: "Your latest annual business turnover",
      fields: [{ key: "turnover", label: "Annual Turnover", kind: "amount", required: true, placeholder: "e.g. 25,00,00,000" }],
    },
    {
      title: "How much funding do you require?",
      fields: [
        {
          key: "fundingRequired",
          label: "Funding Required",
          kind: "amount",
          required: true,
          placeholder: "e.g. 5,00,00,000",
          help: "Private Funding is usually ₹1 Cr to ₹50 Cr.",
        },
        {
          key: "purpose",
          label: "Purpose",
          kind: "choice",
          options: [
            "Working Capital",
            "Business Expansion",
            "Short-Term Cash Flow",
            "Purchase of Stock",
            "Business Opportunity",
            "Existing Business Obligation",
            "Other",
          ],
        },
      ],
    },
  ],
  finalTitle: "Check Your Private Funding Options",
  finalText:
    "Share these basic details and Growth Capital Services can review your business profile and help explore suitable private funding options.",
  button: "Check My Options",
  disclaimer:
    "Funding amount, tenure, interest rate, turnaround and approval are subject to the business profile, turnover, documents and the respective lender's policy. Private Funding is only for self-employed businesses.",
};


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
const BT_TITLES = [
  "Your existing facility",
  "Existing loan details",
  "Monthly instalment, tenure and top-up",
  "Repayment track and your profile",
  "Property details",
  "Other loans and credit profile",
];
const PRIVATE_TITLES = ["Your business", "Turnover and funding"];

export const QUESTIONNAIRES: Questionnaire[] = [
  PROJECT,
  polish(overdraft("Dropline Overdraft", ["dlod"], "Dropline overdraft", "Dropline Overdraft"), OVERDRAFT_TITLES),
  polish(overdraft("Overdraft", ["overdraft-limit"], "Overdraft", "Overdraft"), OVERDRAFT_TITLES),
  polish(BALANCE_TRANSFER, BT_TITLES),
  polish(PRIVATE_FUNDING, PRIVATE_TITLES),
];

export const questionnaireFor = (slug: string): Questionnaire | undefined =>
  QUESTIONNAIRES.find((q) => q.slugs.includes(slug));
