// The optional second form shown after a visitor submits the short enquiry form on a loan page.
// It asks the deeper questions a lender's policy turns on, so the team can shortlist suitable lenders.
// The visitor can skip it. Whatever the short form already collected (name, phone, email, city,
// applicant type, loan amount) is never asked again.

import type { QuestionStep } from "@/data/product-questionnaires";

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
          options: ["Flat / apartment", "Independent house / villa", "Row house", "Plot", "Other"],
        },
        {
          key: "propertyStatus",
          label: "Where are you with the property?",
          kind: "choice",
          options: ["Already finalised", "Shortlisted a few", "Still searching"],
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
          showWhen: {
            key: "purpose",
            values: only("Buying an under-construction property", "Buying a ready flat / house"),
          },
        },
        {
          key: "agreementValue",
          label: "Property price / agreement value",
          kind: "amount",
          placeholder: rupee,
          help: "A rough figure is fine if it is not final yet.",
        },
        {
          key: "ownContribution",
          label: "Your own contribution (down payment) available",
          kind: "amount",
          allowZero: true,
          placeholder: rupee,
          help: "Lenders fund only a part of the price, so the rest has to come from you.",
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
          key: "coApplicantIncome",
          label: "Co-applicant's monthly income",
          kind: "amount",
          allowZero: true,
          placeholder: "e.g. 60,000",
          showWhen: { key: "coApplicant", values: ["Yes"] },
        },
      ],
    },
    {
      title: "Your work and income (salaried)",
      help: "Salaried income is judged on your employer, your salary slips and how long you have been in the job.",
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
          showWhen: { key: "applicantCategory", values: ["Salaried"] },
        },
        {
          key: "yearsInJob",
          label: "Time with the current employer",
          kind: "choice",
          options: ["Less than 1 year", "1 to 3 years", "3 to 5 years", "More than 5 years"],
          showWhen: { key: "applicantCategory", values: ["Salaried"] },
        },
        {
          key: "netSalary",
          label: "Monthly take-home salary",
          kind: "amount",
          placeholder: "e.g. 1,00,000",
          showWhen: { key: "applicantCategory", values: ["Salaried"] },
        },
        {
          key: "salaryMode",
          label: "How is the salary paid?",
          kind: "choice",
          options: ["Credited to a bank account", "Partly cash", "Cash"],
          showWhen: { key: "applicantCategory", values: ["Salaried"] },
        },
        {
          key: "businessType",
          label: "Your business or profession",
          kind: "text",
          placeholder: "e.g. Trader, Doctor, CA, Contractor",
          showWhen: { key: "applicantCategory", values: ["Self-Employed"] },
        },
        {
          key: "yearsInBusiness",
          label: "Years in the business or profession",
          kind: "choice",
          options: ["Less than 2 years", "2 to 3 years", "3 to 5 years", "More than 5 years"],
          showWhen: { key: "applicantCategory", values: ["Self-Employed"] },
        },
        {
          key: "annualTurnover",
          label: "Annual turnover (last financial year)",
          kind: "amount",
          placeholder: "e.g. 75,00,000",
          showWhen: { key: "applicantCategory", values: ["Self-Employed"] },
        },
        {
          key: "annualProfit",
          label: "Net profit as shown in the ITR (last financial year)",
          kind: "amount",
          allowZero: true,
          placeholder: "e.g. 12,00,000",
          showWhen: { key: "applicantCategory", values: ["Self-Employed"] },
        },
        {
          key: "itrYears",
          label: "ITR filed for how many years?",
          kind: "choice",
          options: ["None", "1 year", "2 years", "3 years or more"],
          showWhen: { key: "applicantCategory", values: ["Self-Employed"] },
        },
        {
          key: "country",
          label: "Country you live and work in",
          kind: "text",
          placeholder: "e.g. UAE, UK, USA, Singapore",
          showWhen: { key: "applicantCategory", values: ["NRI"] },
        },
        {
          key: "yearsAbroad",
          label: "Years working abroad",
          kind: "choice",
          options: ["Less than 2 years", "2 to 5 years", "More than 5 years"],
          showWhen: { key: "applicantCategory", values: ["NRI"] },
        },
        {
          key: "nriIncome",
          label: "Monthly income, in rupees",
          kind: "amount",
          placeholder: "Roughly what it comes to in rupees",
          showWhen: { key: "applicantCategory", values: ["NRI"] },
        },
        {
          key: "nriAccount",
          label: "Do you have an NRE / NRO account in India?",
          kind: "choice",
          options: YES_NO,
          showWhen: { key: "applicantCategory", values: ["NRI"] },
        },
        {
          key: "otherIncome",
          label: "Other regular monthly income (rent, interest, etc.)",
          kind: "amount",
          allowZero: true,
          placeholder: "e.g. 15,000, or 0 if none",
        },
      ],
    },
    {
      title: "Your existing loans and credit",
      help: "Lenders subtract what you already repay from what you can afford, so this matters.",
      fields: [
        {
          key: "existingEmi",
          label: "Total EMIs you pay every month",
          kind: "amount",
          allowZero: true,
          placeholder: "e.g. 25,000, or 0 if none",
          help: "Include car, personal and education loans, and credit-card minimums.",
        },
        {
          key: "loanCount",
          label: "How many running loans or credit cards do you have?",
          kind: "choice",
          options: ["None", "1", "2", "3 or more"],
        },
        {
          key: "latePayments",
          label: "Any late or missed EMI or card payments in the last 12 months?",
          kind: "choice",
          options: ["No", "Yes, once or twice", "Yes, more often", "Not sure"],
        },
        {
          key: "cibilKnown",
          label: "Do you know your CIBIL score?",
          kind: "choice",
          options: ["750 or above", "700 to 749", "650 to 699", "Below 650", "I don't know"],
        },
        {
          key: "pastRejection",
          label: "Has a home loan application of yours been declined before?",
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

export const FOLLOW_UP_FORMS: FollowUpForm[] = [HOME_LOAN];

export const followUpFor = (slug: string | undefined): FollowUpForm | undefined =>
  slug ? FOLLOW_UP_FORMS.find((f) => f.slugs.includes(slug)) : undefined;
