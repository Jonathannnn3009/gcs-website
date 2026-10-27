// The optional second form shown after a visitor submits the short enquiry form on a loan page.
// It asks the deeper questions a lender's policy turns on, so the team can shortlist suitable lenders.
// The visitor can skip it. Whatever the short form already collected (name, phone, email, city,
// applicant type, loan amount) is never asked again.

import type { QuestionField, QuestionStep } from "@/data/product-questionnaires";

export type FollowUpForm = {
  /** Loan pages this applies to. */
  slugs: string[];
  /** Why the form is being asked: shown in italics above it. */
  reason: string;
  title: string;
  intro: string;
  /** The line that makes clear the form is the visitor's choice. */
  choice: string;
  skip: string;
  steps: QuestionStep[];
  submit: string;
  disclaimer: string;
};

const YES_NO = ["Yes", "No"];
const rupee = "e.g. 50,00,000";
const only = (...values: string[]) => values;

/** The work-and-income questions. `cat` is the answer that says whether the applicant is salaried, self-employed or an NRI. */
const workStep = (cat: string): QuestionStep => ({
  title: "Your work and income",
  help: "Lenders judge income by how steady it is and how it can be shown on paper.",
  fields: [
    {
      key: "employerType",
      label: "Where do you work?",
      kind: "choice",
      options: [
        "Government / PSU",
        "Listed or MNC company",
        "Private limited company",
        "Small firm / proprietorship",
        "Other",
      ],
      showWhen: { key: cat, values: ["Salaried"] },
    },
    {
      key: "yearsInJob",
      label: "Time with the current employer",
      kind: "choice",
      options: ["Less than 1 year", "1 to 3 years", "3 to 5 years", "More than 5 years"],
      showWhen: { key: cat, values: ["Salaried"] },
    },
    {
      key: "totalExperience",
      label: "Total work experience so far",
      kind: "choice",
      options: ["Less than 1 year", "1 to 3 years", "3 to 5 years", "More than 5 years"],
      showWhen: { key: "yearsInJob", values: ["Less than 1 year"] },
    },
    {
      key: "netSalary",
      label: "Monthly take-home salary",
      kind: "amount",
      placeholder: "e.g. 1,00,000",
      showWhen: { key: cat, values: ["Salaried"] },
    },
    {
      key: "salaryMode",
      label: "How is the salary paid?",
      kind: "choice",
      options: ["Credited to a bank account", "Partly cash", "Cash"],
      help: "Cash salary is accepted by some lenders, so say it as it is.",
      showWhen: {
        key: "employerType",
        values: ["Private limited company", "Small firm / proprietorship", "Other"],
      },
    },
    {
      key: "businessType",
      label: "Your business or profession",
      kind: "text",
      placeholder: "e.g. Trader, Doctor, CA, Contractor",
      showWhen: { key: cat, values: ["Self-Employed"] },
    },
    {
      key: "yearsInBusiness",
      label: "Years in the business or profession",
      kind: "choice",
      options: ["Less than 2 years", "2 to 3 years", "3 to 5 years", "More than 5 years"],
      showWhen: { key: cat, values: ["Self-Employed"] },
    },
    {
      key: "gstRegistered",
      label: "Is your business registered under GST?",
      kind: "choice",
      options: [
        "Yes, and returns are filed regularly",
        "Yes, but returns are irregular",
        "No, GST does not apply to me",
      ],
      showWhen: { key: cat, values: ["Self-Employed"] },
    },
    {
      key: "itrYears",
      label: "ITR filed for how many years?",
      kind: "choice",
      options: ["None", "1 year", "2 years", "3 years or more"],
      showWhen: { key: cat, values: ["Self-Employed"] },
    },
    {
      key: "bankStatements",
      label: "Do you have 12 months of business bank statements?",
      kind: "choice",
      options: YES_NO,
      help: "Without ITR, lenders go by your bank statements instead.",
      showWhen: { key: "itrYears", values: ["None"] },
    },
    {
      key: "annualTurnover",
      label: "Annual turnover (last financial year)",
      kind: "amount",
      placeholder: "e.g. 75,00,000",
      showWhen: { key: cat, values: ["Self-Employed"] },
    },
    {
      key: "annualProfit",
      label: "Net profit as shown in the ITR (last financial year)",
      kind: "amount",
      allowZero: true,
      placeholder: "e.g. 12,00,000",
      showWhen: { key: "itrYears", values: ["1 year", "2 years", "3 years or more"] },
    },
    {
      key: "country",
      label: "Country you live and work in",
      kind: "text",
      placeholder: "e.g. UAE, UK, USA, Singapore",
      showWhen: { key: cat, values: ["NRI"] },
    },
    {
      key: "yearsAbroad",
      label: "Years working abroad",
      kind: "choice",
      options: ["Less than 2 years", "2 to 5 years", "More than 5 years"],
      showWhen: { key: cat, values: ["NRI"] },
    },
    {
      key: "nriIncome",
      label: "Monthly income, in rupees",
      kind: "amount",
      placeholder: "Roughly what it comes to in rupees",
      showWhen: { key: cat, values: ["NRI"] },
    },
    {
      key: "nriAccount",
      label: "Do you have an NRE / NRO account in India?",
      kind: "choice",
      options: YES_NO,
      showWhen: { key: cat, values: ["NRI"] },
    },
    {
      key: "indiaSigner",
      label: "Is there someone in India who can sign for you on a Power of Attorney?",
      kind: "choice",
      options: ["Yes", "No", "Not sure"],
      showWhen: { key: cat, values: ["NRI"] },
    },
    {
      key: "otherIncome",
      label: "Other regular monthly income (rent, interest, etc.)",
      kind: "amount",
      allowZero: true,
      placeholder: "e.g. 15,000, or 0 if none",
    },
  ],
});

/** What the applicant already owes and how they have repaid it: asked the same way on every loan. */
const creditStep = (loan: string): QuestionStep => ({
  title: "Your existing loans and credit",
  help: "Lenders subtract what you already repay from what you can afford, so this matters.",
  fields: [
    {
      key: "hasLoans",
      label: "Do you have any running loans or credit cards?",
      kind: "choice",
      options: YES_NO,
    },
    {
      key: "existingEmi",
      label: "Total EMIs you pay every month",
      kind: "amount",
      allowZero: true,
      placeholder: "e.g. 25,000",
      help: "Include car, personal and education loans, and credit-card minimums.",
      showWhen: { key: "hasLoans", values: ["Yes"] },
    },
    {
      key: "latePayments",
      label: "Any late or missed EMI or card payments in the last 12 months?",
      kind: "choice",
      options: ["No", "Yes, once or twice", "Yes, more often", "Not sure"],
      showWhen: { key: "hasLoans", values: ["Yes"] },
    },
    {
      key: "cibilKnown",
      label: "Roughly what is your CIBIL score?",
      kind: "choice",
      options: ["750 or above", "700 to 749", "650 to 699", "Below 650", "I don't know"],
    },
    {
      key: "pastRejection",
      label: `Has a ${loan} application of yours been declined before?`,
      kind: "choice",
      options: YES_NO,
    },
    {
      key: "pastRejectionNote",
      label: "Which lender, and when?",
      kind: "text",
      placeholder: "If you remember",
      showWhen: { key: "pastRejection", values: ["Yes"] },
    },
  ],
});

const HOME_LOAN: FollowUpForm = {
  slugs: ["home-loan"],
  reason:
    "We ask these extra questions so our experts can read your profile the way a lender does and shortlist the Banks & NBFCs that may suit you.",
  title: "A Few More Details Can Help Us Find a Better Fit",
  intro:
    "If you're comfortable, share a few more details in this short form. It's completely your choice.",
  choice: "More accurate details help us make a more relevant assessment for you.",
  skip: "Skip for now",
  submit: "Submit my details",
  disclaimer:
    "You may skip this step if you prefer. Final eligibility, interest rate, terms and approval are subject to the respective Bank/NBFC's assessment and policy.",
  steps: [
    {
      title: "About the home you want to buy or build",
      help: "Lenders value the property as much as the borrower, so this shapes which of them are a fit.",
      fields: [
        {
          key: "purpose",
          label: "What is the loan for?",
          kind: "choice",
          required: true,
          options: [
            "Buying a ready flat / house",
            "Buying an under-construction property",
            "Resale purchase",
            "Buying a plot and constructing",
            "Self-construction",
            "Renovation / extension",
            "Other",
          ],
        },
        {
          key: "propertyKind",
          label: "Type of property",
          kind: "choice",
          options: ["Flat / apartment", "Independent house / villa", "Row house", "Other"],
          showWhen: {
            key: "purpose",
            values: only(
              "Buying a ready flat / house",
              "Buying an under-construction property",
              "Resale purchase",
              "Other",
            ),
          },
        },
        {
          key: "propertyStatus",
          label: "Where are you with the property?",
          kind: "choice",
          options: ["Already finalised", "Shortlisted a few", "Still searching"],
          showWhen: {
            key: "purpose",
            values: only(
              "Buying a ready flat / house",
              "Buying an under-construction property",
              "Resale purchase",
              "Buying a plot and constructing",
            ),
          },
        },
        {
          key: "bookingPaid",
          label: "Have you already paid a booking amount?",
          kind: "choice",
          options: YES_NO,
          showWhen: { key: "propertyStatus", values: ["Already finalised"] },
        },
        {
          key: "plotOwned",
          label: "Do you already own the plot?",
          kind: "choice",
          options: [
            "Yes, it is in my name",
            "Yes, jointly or in the family",
            "No, I am yet to buy it",
          ],
          showWhen: {
            key: "purpose",
            values: only("Self-construction", "Buying a plot and constructing"),
          },
        },
        {
          key: "propertyArea",
          label: "Location of the property",
          kind: "text",
          placeholder: "Area / locality and city",
          help: "Lenders differ by city and by locality.",
        },
        {
          key: "builderName",
          label: "Builder / project name",
          kind: "text",
          placeholder: "If you have one in mind",
          showWhen: { key: "purpose", values: ["Buying an under-construction property"] },
        },
        {
          key: "agreementValue",
          label: "Property price / agreement value",
          kind: "amount",
          placeholder: rupee,
          help: "A rough figure is fine if it is not final yet.",
          showWhen: {
            key: "purpose",
            values: only(
              "Buying a ready flat / house",
              "Buying an under-construction property",
              "Resale purchase",
              "Buying a plot and constructing",
              "Other",
            ),
          },
        },
        {
          key: "workCost",
          label: "Estimated cost of the construction / renovation",
          kind: "amount",
          placeholder: rupee,
          help: "A rough figure is fine.",
          showWhen: { key: "purpose", values: only("Self-construction", "Renovation / extension") },
        },
        {
          key: "ownContribution",
          label: "Your own contribution available (savings or down payment)",
          kind: "amount",
          allowZero: true,
          placeholder: rupee,
          help: "Lenders fund only a part of the cost, so the rest has to come from you.",
        },
      ],
    },
    {
      title: "How you would like to repay",
      fields: [
        {
          key: "tenure",
          label: "Preferred repayment period",
          kind: "choice",
          options: [
            "Up to 10 years",
            "10 to 15 years",
            "15 to 20 years",
            "20 to 25 years",
            "25 to 30 years",
            "Not sure",
          ],
        },
        {
          key: "timeline",
          label: "When do you need the loan?",
          kind: "choice",
          options: ["Immediately", "Within a month", "In 1 to 3 months", "Just exploring"],
        },
        {
          key: "coApplicant",
          label: "Will someone apply with you (spouse, parent, sibling)?",
          kind: "choice",
          options: YES_NO,
          help: "A co-applicant's income can raise the loan you are eligible for.",
        },
        {
          key: "coApplicantRelation",
          label: "Who would apply with you?",
          kind: "choice",
          options: ["Spouse", "Parent", "Sibling", "Child", "Other"],
          showWhen: { key: "coApplicant", values: ["Yes"] },
        },
        {
          key: "coApplicantIncome",
          label: "Co-applicant's monthly income",
          kind: "amount",
          allowZero: true,
          placeholder: "e.g. 60,000",
          showWhen: { key: "coApplicant", values: ["Yes"] },
        },
      ],
    },
    workStep("applicantCategory"),
    creditStep("home loan"),
  ],
};

const COMMON = {
  title: "A Few More Details Can Help Us Find a Better Fit",
  intro:
    "If you're comfortable, share a few more details in this short form. It's completely your choice.",
  choice: "More accurate details help us make a more relevant assessment for you.",
  skip: "Skip for now",
  submit: "Submit my details",
  disclaimer:
    "You may skip this step if you prefer. Final eligibility, interest rate, terms and approval are subject to the respective Bank/NBFC's assessment and policy.",
};

const TENURE_5_20 = [
  "Up to 5 years",
  "5 to 10 years",
  "10 to 15 years",
  "15 to 20 years",
  "Not sure",
];
const TIMELINE = ["Immediately", "Within a month", "In 1 to 3 months", "Just exploring"];

/** The question that asks whether someone applies along with the applicant, and who and how much they earn. */
const coApplicantFields = (): QuestionField[] => [
  {
    key: "coApplicant",
    label: "Will someone apply with you (spouse, parent, sibling, partner)?",
    kind: "choice",
    options: YES_NO,
    help: "A co-applicant's income can raise the loan you are eligible for.",
  },
  {
    key: "coApplicantRelation",
    label: "Who would apply with you?",
    kind: "choice",
    options: ["Spouse", "Parent", "Sibling", "Child", "Business partner", "Other"],
    showWhen: { key: "coApplicant", values: ["Yes"] },
  },
  {
    key: "coApplicantIncome",
    label: "Co-applicant's monthly income",
    kind: "amount",
    allowZero: true,
    placeholder: "e.g. 60,000",
    showWhen: { key: "coApplicant", values: ["Yes"] },
  },
];

/** The property a loan against property is raised on. Each answer decides which question follows. */
const securityStep = (typeKey: string, lead: QuestionField[] = []): QuestionStep => ({
  title: "About the property you would offer as security",
  help: "The loan is sized on the property, so lenders look at it as closely as they look at you.",
  fields: [
    ...lead,
    // The reasons that fit a business owner are not the ones that fit a salaried person, so each sees their own list.
    {
      key: "purposeBusiness",
      label: "What do you need the money for?",
      kind: "choice",
      required: true,
      options: [
        "Business expansion or working capital",
        "Buying machinery or stock",
        "Repaying other loans",
        "Buying another property",
        "Personal or family need",
        "Other",
      ],
      showWhen: { key: typeKey, values: ["Self-Employed"] },
    },
    {
      key: "purpose",
      label: "What do you need the money for?",
      kind: "choice",
      required: true,
      options: [
        "Repaying other loans",
        "Medical need",
        "Education or marriage",
        "Buying another property",
        "Starting or supporting a business",
        "Other",
      ],
      showWhen: {
        key: typeKey,
        values: typeKey === "applicantType" ? ["Salaried"] : ["Salaried", "NRI"],
      },
    },
    {
      key: "propertyKind",
      label: "Type of property",
      kind: "choice",
      options: [
        "Residential (flat / house)",
        "Commercial (shop / office)",
        "Industrial (factory / warehouse)",
        "Plot / land",
      ],
    },
    {
      key: "propertyUse",
      label: "How is the property used today?",
      kind: "choice",
      options: ["Self-occupied or self-used", "Rented out", "Vacant"],
      showWhen: {
        key: "propertyKind",
        values: only(
          "Residential (flat / house)",
          "Commercial (shop / office)",
          "Industrial (factory / warehouse)",
        ),
      },
    },
    {
      key: "monthlyRent",
      label: "Rent you receive every month",
      kind: "amount",
      placeholder: "e.g. 40,000",
      showWhen: { key: "propertyUse", values: ["Rented out"] },
    },
    {
      key: "propertyArea",
      label: "Location of the property",
      kind: "text",
      placeholder: "Area / locality and city",
      help: "Lenders differ by city and by locality.",
    },
    {
      key: "propertyValue",
      label: "Approximate market value of the property",
      kind: "amount",
      placeholder: rupee,
      help: "A rough figure is fine.",
    },
    {
      key: "ownership",
      label: "Whose name is the property in?",
      kind: "choice",
      options: [
        "My own name",
        "Jointly with spouse or family",
        "A parent or family member",
        "My company or firm",
      ],
    },
    {
      key: "ownerJoins",
      label: "Will the owner(s) sign the application along with you?",
      kind: "choice",
      options: ["Yes", "No", "Not sure"],
      help: "Lenders usually need every owner of the property to be part of the loan.",
      showWhen: {
        key: "ownership",
        values: only(
          "Jointly with spouse or family",
          "A parent or family member",
          "My company or firm",
        ),
      },
    },
    {
      key: "existingMortgage",
      label: "Is there already a loan on this property?",
      kind: "choice",
      options: YES_NO,
    },
    {
      key: "mortgageOutstanding",
      label: "Amount still to be repaid on it",
      kind: "amount",
      allowZero: true,
      placeholder: rupee,
      showWhen: { key: "existingMortgage", values: ["Yes"] },
    },
    {
      key: "mortgageWish",
      label: "What would you like to do with that loan?",
      kind: "choice",
      options: [
        "Move it to a cheaper lender and take a top-up",
        "Keep it and raise a second loan",
        "Not sure",
      ],
      showWhen: { key: "existingMortgage", values: ["Yes"] },
    },
    {
      key: "titleClear",
      label: "Is the title clear, with all the original documents with you?",
      kind: "choice",
      options: ["Yes", "Some documents are missing", "Not sure"],
    },
  ],
});

const OVERDRAFT_CHOICE: QuestionField = {
  key: "structure",
  label: "Which kind of loan would suit you?",
  kind: "choice",
  options: [
    "A term loan with fixed EMIs",
    "An overdraft limit I can draw and repay",
    "Not sure, advise me",
  ],
  help: "An overdraft charges interest only on what you use.",
};

const repayStep = (tenure: string[], overdraft: boolean): QuestionStep => ({
  title: "How you would like to repay",
  fields: [
    {
      key: "tenure",
      label: "Preferred repayment period",
      kind: "choice",
      options: tenure,
    },
    ...(overdraft ? [OVERDRAFT_CHOICE] : []),
    {
      key: "timeline",
      label: "When do you need the loan?",
      kind: "choice",
      options: TIMELINE,
    },
    ...coApplicantFields(),
  ],
});

const LOAN_AGAINST_PROPERTY: FollowUpForm = {
  ...COMMON,
  slugs: ["loan-against-property"],
  reason:
    "We ask these extra questions so our experts can read your profile and your property the way a lender does and shortlist the Banks & NBFCs that may suit you.",
  steps: [
    securityStep("applicantCategory"),
    repayStep(TENURE_5_20, true),
    workStep("applicantCategory"),
    creditStep("loan against property"),
  ],
};

/** Micro LAP does not ask about the applicant's type on the short form, so it is asked here first. */
const MICRO_LAP: FollowUpForm = {
  ...COMMON,
  slugs: ["micro-lap"],
  reason:
    "We ask these extra questions so our experts can match your property and your income, with or without ITR, to the Banks & NBFCs that may suit you.",
  steps: [
    securityStep("applicantType", [
      {
        key: "applicantType",
        label: "Are you salaried or self-employed?",
        kind: "choice",
        required: true,
        options: ["Salaried", "Self-Employed"],
      },
    ]),
    repayStep(
      ["Up to 3 years", "3 to 5 years", "5 to 7 years", "7 to 10 years", "Not sure"],
      false,
    ),
    (() => {
      const step = workStep("applicantType");
      return { ...step, fields: step.fields.filter((f) => !f.showWhen?.values.includes("NRI")) };
    })(),
    creditStep("loan against property"),
  ],
};

const LEASE_RENTAL: FollowUpForm = {
  ...COMMON,
  slugs: ["lease-rental-discounting"],
  reason:
    "We ask these extra questions so our experts can judge the lease and the tenant the way a lender does and shortlist the Banks & NBFCs that may suit you.",
  steps: [
    {
      title: "About the let-out property and the lease",
      help: "Here the rent pays the loan, so lenders look first at the lease and the tenant.",
      fields: [
        {
          key: "propertyKind",
          label: "Type of property",
          kind: "choice",
          required: true,
          options: [
            "Office",
            "Shop / retail space",
            "Warehouse",
            "Mall or multi-tenant building",
            "Other",
          ],
        },
        {
          key: "propertyArea",
          label: "Location of the property",
          kind: "text",
          placeholder: "Area / locality and city",
        },
        {
          key: "leaseRegistered",
          label: "Is the lease registered?",
          kind: "choice",
          options: ["Yes", "Registration is under way", "No"],
        },
        {
          key: "leaseRemaining",
          label: "How long does the lease still have to run?",
          kind: "choice",
          options: ["Less than 3 years", "3 to 5 years", "5 to 10 years", "More than 10 years"],
        },
        {
          key: "tenantType",
          label: "Who is the tenant?",
          kind: "choice",
          options: [
            "A listed or multinational company",
            "A private limited company",
            "A partnership or proprietorship",
            "Government / PSU",
            "More than one tenant",
          ],
        },
        {
          key: "monthlyRent",
          label: "Total rent received every month",
          kind: "amount",
          placeholder: "e.g. 5,00,000",
        },
        {
          key: "rentMode",
          label: "How is the rent paid to you?",
          kind: "choice",
          options: ["By bank transfer", "By cheque", "In cash"],
        },
        {
          key: "rentRecord",
          label: "Has the rent come in on time?",
          kind: "choice",
          options: ["Always", "Mostly, with a few delays", "There have been long gaps"],
        },
        {
          key: "existingMortgage",
          label: "Is there already a loan on this property?",
          kind: "choice",
          options: YES_NO,
        },
        {
          key: "mortgageOutstanding",
          label: "Amount still to be repaid on it",
          kind: "amount",
          allowZero: true,
          placeholder: rupee,
          showWhen: { key: "existingMortgage", values: ["Yes"] },
        },
        {
          key: "mortgageWish",
          label: "Do you want to refinance it through this loan?",
          kind: "choice",
          options: YES_NO,
          showWhen: { key: "existingMortgage", values: ["Yes"] },
        },
      ],
    },
    {
      title: "How you would like to repay",
      fields: [
        {
          key: "tenure",
          label: "Preferred repayment period",
          kind: "choice",
          options: TENURE_5_20,
        },
        { key: "timeline", label: "When do you need the loan?", kind: "choice", options: TIMELINE },
        {
          key: "purpose",
          label: "What will you use the money for?",
          kind: "choice",
          options: [
            "Business needs",
            "Buying another property",
            "Repaying other loans",
            "Personal need",
            "Other",
          ],
        },
      ],
    },
    {
      title: "About you, the owner",
      fields: [
        {
          key: "ownerType",
          label: "Who owns the property?",
          kind: "choice",
          options: [
            "An individual (or jointly with family)",
            "A company",
            "A partnership firm or LLP",
          ],
        },
        {
          key: "ownerIncome",
          label: "Your other regular monthly income, apart from this rent",
          kind: "amount",
          allowZero: true,
          placeholder: "e.g. 1,00,000, or 0 if none",
          showWhen: { key: "ownerType", values: ["An individual (or jointly with family)"] },
        },
        {
          key: "itrYears",
          label: "ITR filed for how many years?",
          kind: "choice",
          options: ["None", "1 year", "2 years", "3 years or more"],
          showWhen: { key: "ownerType", values: ["An individual (or jointly with family)"] },
        },
        {
          key: "firmYears",
          label: "Years the company or firm has been running",
          kind: "choice",
          options: ["Less than 2 years", "2 to 5 years", "More than 5 years"],
          showWhen: { key: "ownerType", values: ["A company", "A partnership firm or LLP"] },
        },
        {
          key: "firmTurnover",
          label: "Annual turnover (last financial year)",
          kind: "amount",
          placeholder: "e.g. 5,00,00,000",
          showWhen: { key: "ownerType", values: ["A company", "A partnership firm or LLP"] },
        },
      ],
    },
    creditStep("lease rental discounting"),
  ],
};

export const FOLLOW_UP_FORMS: FollowUpForm[] = [
  HOME_LOAN,
  LOAN_AGAINST_PROPERTY,
  MICRO_LAP,
  LEASE_RENTAL,
];

export const followUpFor = (slug: string | undefined): FollowUpForm | undefined =>
  slug ? FOLLOW_UP_FORMS.find((f) => f.slugs.includes(slug)) : undefined;
