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
const creditStep = (loan: string, apart = false): QuestionStep => ({
  title: "Your existing loans and credit",
  help: "Lenders subtract what you already repay from what you can afford, so this matters.",
  fields: [
    {
      key: "hasLoans",
      label: apart
        ? "Do you have any other running loans or credit cards, apart from this one?"
        : "Do you have any running loans or credit cards?",
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
      label: `Has ${/^[aeiou]/i.test(loan) ? "an" : "a"} ${loan} application of yours been declined before?`,
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

const MORTGAGE_WISH: QuestionField = {
  key: "mortgageWish",
  label: "What would you like to do with that loan?",
  kind: "choice",
  options: [
    "Move it to a cheaper lender and take a top-up",
    "Keep it and raise a second loan",
    "Not sure",
  ],
  showWhen: { key: "existingMortgage", values: ["Yes"] },
};

/** The property a loan against property is raised on. Each answer decides which question follows. */
const securityStep = (
  typeKey: string,
  lead: QuestionField[] = [],
  askMortgageWish = true,
): QuestionStep => ({
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
    ...(askMortgageWish ? [MORTGAGE_WISH] : []),
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

/** Moving a running loan to a lender that charges less, with or without more money on top. */
const BALANCE_TRANSFER: FollowUpForm = {
  ...COMMON,
  slugs: ["balance-transfer"],
  reason:
    "We ask these extra questions so our experts can see what your present loan costs you and which Banks & NBFCs may take it over on better terms.",
  steps: [
    {
      title: "About the loan you have today",
      help: "A lender taking over a loan looks first at how it has been repaid and how much is left.",
      fields: [
        {
          key: "facility",
          label: "Which loan do you want to move?",
          kind: "choice",
          required: true,
          options: ["Home Loan", "Loan Against Property", "Drop-Line Overdraft", "Other"],
        },
        {
          key: "requirement",
          label: "What do you want?",
          kind: "choice",
          options: ["Only move the loan to a cheaper lender", "Move it and also take a top-up"],
        },
        {
          key: "bank",
          label: "Which bank or finance company has it now?",
          kind: "text",
          placeholder: "Name of the lender",
        },
        {
          key: "outstanding",
          label: "Amount still to be repaid",
          kind: "amount",
          placeholder: rupee,
        },
        { key: "rate", label: "Interest rate you pay now", kind: "percent" },
        {
          key: "emi",
          label: "Your EMI for this loan",
          kind: "amount",
          placeholder: "e.g. 45,000",
        },
        {
          key: "remaining",
          label: "How long is left on the loan?",
          kind: "choice",
          options: [
            "Less than 5 years",
            "5 to 10 years",
            "10 to 15 years",
            "15 to 20 years",
            "More than 20 years",
          ],
        },
        {
          key: "vintage",
          label: "How long have you been repaying it?",
          kind: "choice",
          options: [
            "Less than 1 year",
            "1 to 2 years",
            "2 to 3 years",
            "3 to 5 years",
            "More than 5 years",
          ],
          help: "Most lenders want at least a year of EMIs paid before they take a loan over.",
        },
        {
          key: "track",
          label: "How regular has the repayment been?",
          kind: "choice",
          options: ["Every EMI on time", "A few delays or bounces", "Something is overdue now"],
        },
        {
          key: "timeline",
          label: "When would you like to move the loan?",
          kind: "choice",
          options: TIMELINE,
        },
        {
          key: "trackReason",
          label: "Briefly, what caused the delay or overdue?",
          kind: "text",
          long: true,
          showWhen: {
            key: "track",
            values: ["A few delays or bounces", "Something is overdue now"],
          },
        },
      ],
    },
    {
      title: "The top-up you would like",
      fields: [
        {
          key: "topUp",
          label: "Top-up amount you need",
          kind: "amount",
          placeholder: rupee,
          showWhen: { key: "requirement", values: ["Move it and also take a top-up"] },
        },
        {
          key: "topUpPurpose",
          label: "What is the top-up for?",
          kind: "choice",
          options: [
            "Business expansion or working capital",
            "Buying or building a property",
            "Home renovation",
            "Repaying other loans",
            "Education",
            "Medical or personal need",
            "Other",
          ],
          showWhen: { key: "requirement", values: ["Move it and also take a top-up"] },
        },
      ],
    },
    {
      title: "The property behind the loan",
      fields: [
        {
          key: "propertyKind",
          label: "Type of property",
          kind: "choice",
          options: ["Residential", "Commercial", "Industrial", "Other"],
          showWhen: {
            key: "facility",
            values: ["Loan Against Property", "Drop-Line Overdraft", "Other"],
          },
        },
        {
          key: "propertyArea",
          label: "Location of the property",
          kind: "text",
          placeholder: "Area / locality and city",
        },
        {
          key: "propertyValue",
          label: "Approximate market value today",
          kind: "amount",
          placeholder: rupee,
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
      ],
    },
    (() => {
      const step = workStep("applicantType");
      return {
        ...step,
        fields: [
          {
            key: "applicantType",
            label: "Are you salaried or self-employed?",
            kind: "choice" as const,
            required: true,
            options: ["Salaried", "Self-Employed"],
          },
          ...step.fields.filter((f) => !f.showWhen?.values.includes("NRI")),
        ],
      };
    })(),
    creditStep("balance transfer", true),
  ],
};

/** The limit being asked for: new, or moved from another lender, and how it will be used. */
const limitStep = (): QuestionStep => ({
  title: "The limit you would like",
  fields: [
    {
      key: "requirement",
      label: "Is this a new limit or a move from another lender?",
      kind: "choice",
      options: [
        "A fresh limit",
        "Move my present overdraft or loan",
        "Move it and add more funding",
      ],
    },
    {
      key: "btLender",
      label: "Which lender has it now?",
      kind: "text",
      placeholder: "Name of the bank or finance company",
      showWhen: {
        key: "requirement",
        values: ["Move my present overdraft or loan", "Move it and add more funding"],
      },
    },
    {
      key: "btOutstanding",
      label: "Present outstanding or limit",
      kind: "amount",
      placeholder: rupee,
      showWhen: {
        key: "requirement",
        values: ["Move my present overdraft or loan", "Move it and add more funding"],
      },
    },
    {
      key: "btRate",
      label: "Interest rate you pay now",
      kind: "percent",
      showWhen: {
        key: "requirement",
        values: ["Move my present overdraft or loan", "Move it and add more funding"],
      },
    },
    {
      key: "btExtra",
      label: "Extra funding you need",
      kind: "amount",
      placeholder: rupee,
      showWhen: { key: "requirement", values: ["Move it and add more funding"] },
    },
    {
      key: "usage",
      label: "How will you use the limit?",
      kind: "choice",
      options: [
        "Draw and repay often, as cash needs go up and down",
        "Draw most of it once and repay steadily",
        "Not sure",
      ],
      help: "You pay interest only on what you draw.",
    },
    { key: "tenure", label: "Preferred period", kind: "choice", options: TENURE_5_20 },
    { key: "timeline", label: "When do you need it?", kind: "choice", options: TIMELINE },
  ],
});

/** A limit against property that comes down on a schedule: for a business or professional with steady banking. */
const DROP_LINE_OVERDRAFT: FollowUpForm = {
  ...COMMON,
  slugs: ["dlod"],
  reason:
    "We ask these extra questions so our experts can read your property and your banking the way a lender does and shortlist the Banks & NBFCs that may suit you.",
  steps: [
    securityStep(
      "applicantType",
      [
        {
          key: "applicantType",
          label: "Are you salaried or self-employed?",
          kind: "choice",
          required: true,
          options: ["Salaried", "Self-Employed"],
        },
        {
          key: "constitution",
          label: "How is your business or practice set up?",
          kind: "choice",
          options: [
            "Professional (doctor, CA, architect, etc.)",
            "Proprietorship",
            "Partnership or LLP",
            "Private limited company",
            "Limited company",
          ],
          showWhen: { key: "applicantType", values: ["Self-Employed"] },
        },
      ],
      false,
    ),
    limitStep(),
    {
      title: "Your banking",
      help: "For an overdraft, lenders go by how your main account has run over the last year.",
      fields: [
        {
          key: "primaryBank",
          label: "Your main bank",
          kind: "text",
          placeholder: "Name of the bank",
        },
        {
          key: "monthlyCredits",
          label: "Average amount that comes into the account every month",
          kind: "amount",
          placeholder: "e.g. 5,00,000",
        },
        {
          key: "chequeReturns",
          label: "Any cheque returns or missed instalments in the last 6 months?",
          kind: "choice",
          options: ["No", "Yes, once or twice", "Yes, more often"],
        },
      ],
    },
    (() => {
      const step = workStep("applicantType");
      return { ...step, fields: step.fields.filter((f) => !f.showWhen?.values.includes("NRI")) };
    })(),
    creditStep("drop-line overdraft"),
  ],
};

/** Funding for a developer's or promoter's project. */
const PROJECT_FUNDING: FollowUpForm = {
  ...COMMON,
  slugs: ["project-funding"],
  reason:
    "We ask these extra questions so our experts can judge the project and its promoters the way a lender does and shortlist the Banks & NBFCs that may fund it.",
  steps: [
    {
      title: "About the project",
      help: "Project lenders look at the project's viability first, then at the people behind it.",
      fields: [
        {
          key: "projectType",
          label: "What kind of project is it?",
          kind: "choice",
          required: true,
          options: [
            "Residential project or township",
            "Commercial project, mall or office",
            "Infrastructure",
            "Industrial or manufacturing unit",
            "Other",
          ],
        },
        {
          key: "projectArea",
          label: "Where is the project?",
          kind: "text",
          placeholder: "Area / locality and city",
        },
        {
          key: "stage",
          label: "Where is the project today?",
          kind: "choice",
          options: [
            "Still to buy the land",
            "Land bought, approvals pending",
            "Approvals in place, yet to start",
            "Under construction",
            "Built, with units left to sell or let",
          ],
        },
        {
          key: "approvals",
          label: "How far are the main approvals and licences?",
          kind: "choice",
          options: ["All in place", "Some are pending", "Yet to apply"],
          showWhen: {
            key: "stage",
            values: [
              "Land bought, approvals pending",
              "Approvals in place, yet to start",
              "Under construction",
            ],
          },
        },
        {
          key: "approvalsPending",
          label: "Which ones are still pending?",
          kind: "text",
          placeholder: "e.g. RERA, environmental clearance, commencement certificate",
          showWhen: { key: "approvals", values: ["Some are pending", "Yet to apply"] },
        },
        {
          key: "rera",
          label: "Is the project registered under RERA?",
          kind: "choice",
          options: ["Yes", "Applied", "No", "Not applicable"],
          showWhen: {
            key: "projectType",
            values: ["Residential project or township", "Commercial project, mall or office"],
          },
        },
        {
          key: "progress",
          label: "How much of the construction is done?",
          kind: "choice",
          options: ["Less than 25%", "25% to 50%", "50% to 75%", "More than 75%"],
          showWhen: { key: "stage", values: ["Under construction"] },
        },
        {
          key: "sold",
          label: "How much of the project is already sold or let?",
          kind: "choice",
          options: ["Nothing yet", "Up to 25%", "25% to 50%", "50% to 75%", "More than 75%"],
          showWhen: {
            key: "stage",
            values: ["Under construction", "Built, with units left to sell or let"],
          },
        },
        {
          key: "dpr",
          label: "Is the Detailed Project Report ready?",
          kind: "choice",
          options: ["Yes", "In process", "No"],
          showWhen: {
            key: "stage",
            values: [
              "Still to buy the land",
              "Land bought, approvals pending",
              "Approvals in place, yet to start",
            ],
          },
        },
      ],
    },
    {
      title: "Cost, contribution and security",
      fields: [
        {
          key: "projectCost",
          label: "Total project cost",
          kind: "amount",
          placeholder: rupee,
          help: "Land, building, machinery, set-up and other costs.",
        },
        {
          key: "landOwned",
          label: "Is the land in the project's or promoter's name?",
          kind: "choice",
          options: ["Yes, fully owned", "Under a joint development agreement"],
          showWhen: {
            key: "stage",
            values: [
              "Land bought, approvals pending",
              "Approvals in place, yet to start",
              "Under construction",
              "Built, with units left to sell or let",
            ],
          },
        },
        {
          key: "ownContribution",
          label: "Your own contribution so far",
          kind: "amount",
          allowZero: true,
          placeholder: rupee,
          help: "Lenders fund only a part of the cost, so the rest has to come from the promoters.",
        },
        {
          key: "security",
          label: "What security can you offer? (pick all that apply)",
          kind: "multi",
          options: [
            "The project itself",
            "Other residential property",
            "Commercial property",
            "Industrial property",
            "Land",
            "Plant & machinery",
            "Nothing else",
          ],
        },
        {
          key: "securityValue",
          label: "Approximate value of the security",
          kind: "amount",
          placeholder: rupee,
        },
        {
          key: "projectDebt",
          label: "Is there already a loan on the project or the land?",
          kind: "choice",
          options: YES_NO,
        },
        {
          key: "projectDebtAmount",
          label: "Amount still to be repaid on it",
          kind: "amount",
          allowZero: true,
          placeholder: rupee,
          showWhen: { key: "projectDebt", values: ["Yes"] },
        },
        {
          key: "timeline",
          label: "When do you need the funds?",
          kind: "choice",
          options: TIMELINE,
        },
      ],
    },
    {
      title: "About the promoters",
      fields: [
        {
          key: "constitution",
          label: "How is the promoter entity set up?",
          kind: "choice",
          options: [
            "Proprietorship",
            "Partnership or LLP",
            "Private limited company",
            "Limited company",
            "Trust or society",
            "Other",
          ],
        },
        {
          key: "venture",
          label: "Is this a new venture or an existing business?",
          kind: "choice",
          options: ["An existing business", "A new venture"],
        },
        {
          key: "yearsInBusiness",
          label: "Years in business",
          kind: "choice",
          options: ["Less than 3 years", "3 to 5 years", "5 to 10 years", "More than 10 years"],
          showWhen: { key: "venture", values: ["An existing business"] },
        },
        {
          key: "projectsDone",
          label: "How many similar projects have the promoters completed?",
          kind: "choice",
          options: ["None, this is the first", "1 or 2", "3 to 5", "More than 5"],
        },
        {
          key: "experience",
          label: "The promoters' relevant experience",
          kind: "text",
          long: true,
          placeholder: "Years in the industry, roles held, projects handled",
          showWhen: { key: "projectsDone", values: ["None, this is the first"] },
        },
        {
          key: "turnover",
          label: "Latest annual turnover of the business",
          kind: "amount",
          placeholder: rupee,
          showWhen: { key: "venture", values: ["An existing business"] },
        },
        {
          key: "profit",
          label: "Net profit or cash accruals last year",
          kind: "amount",
          allowZero: true,
          placeholder: "e.g. 40,00,000",
          showWhen: { key: "venture", values: ["An existing business"] },
        },
      ],
    },
    creditStep("project funding"),
  ],
};

const NATURE_OF_BUSINESS = [
  "Manufacturing",
  "Trading or distribution",
  "Retail",
  "Services",
  "Export or import",
  "Construction",
  "Healthcare",
  "Other",
];

const natureField = (): QuestionField => ({
  key: "nature",
  label: "What does your business do?",
  kind: "choice",
  options: NATURE_OF_BUSINESS,
});

const PURPOSE_OTHER: QuestionField = {
  key: "purposeOther",
  label: "Please say what it is for",
  kind: "text",
  showWhen: { key: "purpose", values: ["Other"] },
};

/** Turnover, profit and the papers that show them. Where there is no ITR, the bank statements stand in. */
const moneyFields = (opts: {
  gst: boolean;
  months?: number;
  practice?: boolean;
}): QuestionField[] => [
  ...(opts.gst
    ? [
        {
          key: "gstRegistered",
          label: "Is your business registered under GST?",
          kind: "choice" as const,
          options: [
            "Yes, and returns are filed regularly",
            "Yes, but returns are irregular",
            "No, GST does not apply to me",
          ],
        },
      ]
    : []),
  {
    key: "itrYears",
    label: "ITR filed for how many years?",
    kind: "choice",
    options: ["None", "1 year", "2 years", "3 years or more"],
  },
  {
    key: "bankStatements",
    label: `Do you have ${opts.months ?? 12} months of ${opts.practice ? "practice" : "business"} bank statements?`,
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
  },
  {
    key: "annualProfit",
    label: opts.practice
      ? "Net income as shown in the ITR (last financial year)"
      : "Net profit as shown in the ITR (last financial year)",
    kind: "amount",
    allowZero: true,
    placeholder: "e.g. 12,00,000",
    showWhen: { key: "itrYears", values: ["1 year", "2 years", "3 years or more"] },
  },
  {
    key: "monthlyCredits",
    label: `Average amount that comes into your ${opts.practice ? "practice" : "business"} accounts every month`,
    kind: "amount",
    placeholder: "e.g. 5,00,000",
  },
];

const BUSINESS_LOAN: FollowUpForm = {
  ...COMMON,
  slugs: ["business-loan"],
  reason:
    "We ask these extra questions so our experts can read your business the way a lender does and shortlist the Banks & NBFCs that may suit it.",
  steps: [
    {
      title: "About your business",
      help: "An unsecured business loan is judged on the business itself: how long it has run, what it earns and how it banks.",
      fields: [
        {
          key: "constitution",
          label: "How is your business set up?",
          kind: "choice",
          required: true,
          options: [
            "Proprietorship",
            "Partnership",
            "LLP",
            "Private limited company",
            "Limited company",
            "Self-employed professional",
          ],
        },
        natureField(),
        {
          key: "vintage",
          label: "How long has the business been running?",
          kind: "choice",
          options: [
            "Less than 2 years",
            "2 to 3 years",
            "3 to 5 years",
            "5 to 10 years",
            "More than 10 years",
          ],
        },
      ],
    },
    {
      title: "Turnover and proof of income",
      fields: moneyFields({ gst: true }),
    },
    {
      title: "What you need the money for",
      fields: [
        {
          key: "purpose",
          label: "What is the loan for?",
          kind: "choice",
          options: [
            "Working capital",
            "Expanding the business",
            "Buying machinery or equipment",
            "Buying stock",
            "Repaying other loans",
            "Other",
          ],
        },
        PURPOSE_OTHER,
        {
          key: "repayAmount",
          label: "Amount of the loans you want to repay",
          kind: "amount",
          placeholder: rupee,
          showWhen: { key: "purpose", values: ["Repaying other loans"] },
        },
        {
          key: "tenure",
          label: "Preferred repayment period",
          kind: "choice",
          options: ["Up to 1 year", "1 to 2 years", "2 to 3 years", "3 to 5 years", "Not sure"],
        },
        { key: "timeline", label: "When do you need the loan?", kind: "choice", options: TIMELINE },
      ],
    },
    creditStep("business loan"),
  ],
};

const MICRO_BUSINESS_LOAN: FollowUpForm = {
  ...COMMON,
  slugs: ["micro-business-loan"],
  reason:
    "We ask these extra questions so our experts can match your business and your banking, with or without ITR and GST, to the Banks & NBFCs that may suit you.",
  steps: [
    {
      title: "About you and your business",
      help: "Lenders for smaller loans go by your banking, how long you have been in business and who stands with you on the loan.",
      fields: [
        {
          key: "constitution",
          label: "How is your business set up?",
          kind: "choice",
          required: true,
          options: [
            "Self-employed individual",
            "Sole proprietorship",
            "Partnership firm",
            "LLP",
            "Private limited company",
          ],
        },
        natureField(),
        {
          key: "vintage",
          label: "How long has the business been running?",
          kind: "choice",
          options: [
            "Less than 1 year",
            "1 to 2 years",
            "2 to 3 years",
            "3 to 5 years",
            "More than 5 years",
          ],
        },
        {
          key: "age",
          label: "Your age",
          kind: "choice",
          options: ["Below 25", "25 to 40", "41 to 55", "56 to 65", "Above 65"],
          help: "Lenders for this loan usually take applicants between 25 and 65.",
        },
        {
          key: "womanCoApplicant",
          label: "Can a woman from your family apply with you as co-applicant?",
          kind: "choice",
          options: ["Yes", "I am a woman applicant", "No"],
          help: "Many lenders ask for a woman co-applicant when the applicant is a man.",
        },
      ],
    },
    {
      title: "Your banking and income",
      fields: [
        {
          key: "accountAge",
          label: "Has your business account been in use for at least 6 months?",
          kind: "choice",
          options: YES_NO,
        },
        ...moneyFields({ gst: true, months: 6 }),
      ],
    },
    {
      title: "Property and repayment",
      fields: [
        {
          key: "propertyOwner",
          label: "Does anyone in your family own a house or shop that could be on the deal?",
          kind: "choice",
          options: ["Yes, I own one", "Yes, a family member owns one", "No"],
          help: "Loans above ₹2 Lakh usually need a property owner on the deal. No property is mortgaged.",
        },
        {
          key: "propertyKind",
          label: "What kind of property is it?",
          kind: "choice",
          options: ["Residential", "Commercial", "Other"],
          showWhen: {
            key: "propertyOwner",
            values: ["Yes, I own one", "Yes, a family member owns one"],
          },
        },
        {
          key: "purpose",
          label: "What is the loan for?",
          kind: "choice",
          options: [
            "Working capital",
            "Expanding the business",
            "Buying stock or equipment",
            "Repaying other loans",
            "Other",
          ],
        },
        PURPOSE_OTHER,
        {
          key: "tenure",
          label: "Preferred repayment period",
          kind: "choice",
          options: ["Up to 1 year", "1 to 2 years", "2 to 3 years", "3 to 4 years", "Not sure"],
        },
        { key: "timeline", label: "When do you need the loan?", kind: "choice", options: TIMELINE },
      ],
    },
    creditStep("micro business loan"),
  ],
};

const UNSECURED_DOD: FollowUpForm = {
  ...COMMON,
  slugs: ["unsecured-dod"],
  reason:
    "We ask these extra questions so our experts can read your business and your current account the way a lender does and shortlist the Banks & NBFCs that may suit you.",
  steps: [
    {
      title: "About your business",
      help: "An unsecured limit rests on a steady business and a healthy current account.",
      fields: [
        {
          key: "constitution",
          label: "How is your business or practice set up?",
          kind: "choice",
          required: true,
          options: [
            "Professional (doctor, CA, architect, etc.)",
            "Proprietorship",
            "Partnership or LLP",
            "Private limited company",
            "Limited company",
          ],
        },
        natureField(),
        {
          key: "vintage",
          label: "How long has it been running?",
          kind: "choice",
          options: ["Less than 3 years", "3 to 5 years", "5 to 10 years", "More than 10 years"],
        },
      ],
    },
    {
      title: "Your current account",
      help: "Lenders go by how your current account has run over the last year.",
      fields: [
        {
          key: "primaryBank",
          label: "Your main bank",
          kind: "text",
          placeholder: "Name of the bank",
        },
        {
          key: "avgBalance",
          label: "Average balance you keep in the current account",
          kind: "amount",
          placeholder: "e.g. 2,00,000",
        },
        {
          key: "chequeReturns",
          label: "Any cheque returns or missed instalments in the last 6 months?",
          kind: "choice",
          options: ["No", "Yes, once or twice", "Yes, more often"],
        },
        {
          key: "adverse",
          label: "Any overdue or adverse remark on your present credit facilities?",
          kind: "choice",
          options: YES_NO,
        },
        {
          key: "adverseNote",
          label: "Please give brief details",
          kind: "text",
          long: true,
          showWhen: { key: "adverse", values: ["Yes"] },
        },
      ],
    },
    {
      title: "Turnover and proof of income",
      fields: moneyFields({ gst: true }),
    },
    limitStep(),
    creditStep("unsecured drop-line overdraft"),
  ],
};

const PROFESSIONAL_LOAN: FollowUpForm = {
  ...COMMON,
  slugs: ["professional-loan"],
  reason:
    "We ask these extra questions so our experts can read your practice the way a lender does and shortlist the Banks & NBFCs that price professionals best.",
  steps: [
    {
      title: "About your practice",
      help: "Professional loans are priced on your qualification, your registration and how long you have practised.",
      fields: [
        {
          key: "profession",
          label: "What is your profession?",
          kind: "choice",
          required: true,
          options: [
            "Doctor or dentist",
            "Chartered Accountant",
            "Company Secretary",
            "Architect",
            "Engineer",
            "Lawyer",
            "Other",
          ],
        },
        {
          key: "registered",
          label: "Are you registered with your professional body or council?",
          kind: "choice",
          options: ["Yes", "Applied", "No"],
        },
        {
          key: "experience",
          label: "Years in practice",
          kind: "choice",
          options: ["Less than 2 years", "2 to 5 years", "5 to 10 years", "More than 10 years"],
        },
        {
          key: "practiceType",
          label: "How do you practise?",
          kind: "choice",
          options: ["My own practice", "Partner in a firm", "Consultant or visiting practitioner"],
        },
        {
          key: "premises",
          label: "Do you own the practice premises?",
          kind: "choice",
          options: ["Yes, I own them", "Rented", "Shared or provided by a hospital or firm"],
          showWhen: { key: "practiceType", values: ["My own practice", "Partner in a firm"] },
        },
      ],
    },
    {
      title: "Your income",
      fields: [
        {
          key: "receipts",
          label: "Gross receipts from your practice last financial year",
          kind: "amount",
          placeholder: "e.g. 40,00,000",
        },
        ...moneyFields({ gst: false, practice: true }).filter((f) => f.key !== "annualTurnover"),
      ],
    },
    {
      title: "What you need the money for",
      fields: [
        {
          key: "purpose",
          label: "What is the loan for?",
          kind: "choice",
          options: [
            "Setting up or moving a practice",
            "Buying equipment",
            "Working capital",
            "Personal need",
            "Other",
          ],
        },
        PURPOSE_OTHER,
        {
          key: "quotation",
          label: "Do you have a quotation for the equipment?",
          kind: "choice",
          options: YES_NO,
          showWhen: { key: "purpose", values: ["Buying equipment"] },
        },
        {
          key: "tenure",
          label: "Preferred repayment period",
          kind: "choice",
          options: ["Up to 2 years", "2 to 4 years", "4 to 6 years", "6 to 7 years", "Not sure"],
        },
        { key: "timeline", label: "When do you need the loan?", kind: "choice", options: TIMELINE },
      ],
    },
    creditStep("professional loan"),
  ],
};

/** Quick unsecured funding for larger businesses. It does not look at CIBIL, so that is not asked. */
const PRIVATE_FUNDING: FollowUpForm = {
  ...COMMON,
  slugs: ["private-funding"],
  reason:
    "We ask these extra questions so our experts can read your business the way a private lender does and bring you the options that fit, quickly.",
  steps: [
    {
      title: "About your business",
      help: "Private funding is only for self-employed businesses with a steady turnover.",
      fields: [
        {
          key: "constitution",
          label: "How is your business set up?",
          kind: "choice",
          required: true,
          options: [
            "Proprietorship",
            "Partnership",
            "LLP",
            "Private limited company",
            "Limited company",
            "Other",
          ],
        },
        natureField(),
        {
          key: "vintage",
          label: "How long has the business been running?",
          kind: "choice",
          options: ["Less than 3 years", "3 to 5 years", "5 to 10 years", "More than 10 years"],
        },
      ],
    },
    {
      title: "Turnover and accounts",
      fields: [
        {
          key: "annualTurnover",
          label: "Latest annual turnover",
          kind: "amount",
          placeholder: "e.g. 25,00,00,000",
          help: "Private funding usually suits a turnover of ₹20 Cr or more.",
        },
        {
          key: "annualProfit",
          label: "Net profit last financial year",
          kind: "amount",
          allowZero: true,
          placeholder: "e.g. 2,00,00,000",
        },
        {
          key: "itrCertified",
          label: "Are your ITRs with CA-certified financials ready for the last 3 years?",
          kind: "choice",
          options: ["Yes, all 3 years", "Some years", "No"],
        },
        {
          key: "gstFiled",
          label: "Are your GSTR-3B returns filed for the last 12 months?",
          kind: "choice",
          options: ["Yes", "Mostly", "No", "GST does not apply to me"],
        },
        {
          key: "bankStatements",
          label: "Do you have 12 months of business bank statements?",
          kind: "choice",
          options: YES_NO,
        },
      ],
    },
    {
      title: "The funding you need",
      fields: [
        {
          key: "purpose",
          label: "What is the funding for?",
          kind: "choice",
          options: [
            "Working capital",
            "Business expansion",
            "Short-term cash flow",
            "Buying stock",
            "A business opportunity",
            "An existing business obligation",
            "Other",
          ],
        },
        PURPOSE_OTHER,
        {
          key: "fundingTenure",
          label: "For how long do you need the money?",
          kind: "choice",
          options: ["Up to 4 months", "4 to 6 months", "6 to 8 months", "Longer than 8 months"],
        },
        {
          key: "urgency",
          label: "How soon do you need the funds?",
          kind: "choice",
          options: ["Within 48 hours", "Within a week", "Within a month"],
        },
        {
          key: "repaySource",
          label: "How will you repay it?",
          kind: "choice",
          options: [
            "From sales and money owed to me",
            "From selling stock",
            "From a project or order payment",
            "By refinancing with a bank",
            "Other",
          ],
        },
        {
          key: "pdc",
          label: "Are you comfortable giving post-dated cheques as the repayment security?",
          kind: "choice",
          options: ["Yes", "No", "I need to know more"],
        },
      ],
    },
    {
      title: "Your existing loans",
      help: "There is no CIBIL check, but lenders do look at what the business already repays.",
      fields: [
        {
          key: "hasLoans",
          label: "Does the business have any running loans or credit limits?",
          kind: "choice",
          options: YES_NO,
        },
        {
          key: "monthlyObligation",
          label: "Total repayments the business makes every month",
          kind: "amount",
          placeholder: "e.g. 8,00,000",
          showWhen: { key: "hasLoans", values: ["Yes"] },
        },
        {
          key: "loanOutstanding",
          label: "Total amount still to be repaid on them",
          kind: "amount",
          placeholder: rupee,
          showWhen: { key: "hasLoans", values: ["Yes"] },
        },
        {
          key: "latePayments",
          label: "Any cheque returns or missed repayments in the last 12 months?",
          kind: "choice",
          options: ["No", "Yes, once or twice", "Yes, more often"],
          showWhen: { key: "hasLoans", values: ["Yes"] },
        },
        {
          key: "pastRejection",
          label: "Has a funding request of yours been declined before?",
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
    },
  ],
};

export const FOLLOW_UP_FORMS: FollowUpForm[] = [
  HOME_LOAN,
  LOAN_AGAINST_PROPERTY,
  MICRO_LAP,
  LEASE_RENTAL,
  BALANCE_TRANSFER,
  DROP_LINE_OVERDRAFT,
  PROJECT_FUNDING,
  BUSINESS_LOAN,
  MICRO_BUSINESS_LOAN,
  UNSECURED_DOD,
  PROFESSIONAL_LOAN,
  PRIVATE_FUNDING,
];

export const followUpFor = (slug: string | undefined): FollowUpForm | undefined =>
  slug ? FOLLOW_UP_FORMS.find((f) => f.slugs.includes(slug)) : undefined;
