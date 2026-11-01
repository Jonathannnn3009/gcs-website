// The wording on the Case Studies, Interest Rates, Calculators and Loan Expert pages that is not
// part of a repeated block or a table. Staff change it in the CRM (Settings -> the page's tab);
// wherever they have not, the text here is used. {phone} comes from Contact & CIBIL.

import type { HomeTextSection } from "@/data/home-text";

const toMap = (sections: HomeTextSection[]): Record<string, string> =>
  Object.fromEntries(sections.flatMap((s) => s.fields.map((f) => [f.id, f.text])));

export const CASES_TEXT_SECTIONS: HomeTextSection[] = [
  {
    id: "hero",
    label: "Top of the page",
    hint: "The opening heading, paragraph and the quote under the picture. The cases themselves are under Case studies.",
    fields: [
      { id: "hero.eyebrow", label: "Small line", text: "Real Scenarios" },
      { id: "hero.title", label: "Heading", text: "What stood in the way —" },
      { id: "hero.gold", label: "End of the heading (gold)", text: "and how we routed it." },
      {
        id: "hero.body",
        label: "Paragraph",
        text: "From a first rejection to a sanctioned loan — how we've structured real lending situations across our network of banks and NBFCs.",
        long: true,
      },
      { id: "hero.quote", label: "Quote under the picture", text: "\"Every file here started with a no from somewhere else.\"" },
      {
        id: "hero.quoteNote",
        label: "Line under the quote",
        text: "The scenarios below show how we routed each one to a yes.",
      },
    ],
  },
  {
    id: "list",
    label: "The list",
    hint: "The filter and the link on each case.",
    fields: [
      { id: "list.all", label: "First filter button", text: "All Cases" },
      { id: "list.read", label: "Link on each case", text: "Read the case" },
    ],
  },
  {
    id: "cta",
    label: "Closing banner",
    hint: "The call to action at the bottom.",
    fields: [
      { id: "cta.title", label: "Heading", text: "See what's" },
      { id: "cta.gold", label: "End of the heading (gold)", text: "possible for your profile." },
      {
        id: "cta.body",
        label: "Text",
        text: "Tell an expert your situation, and we'll tell you which lenders in our network fit it best.",
        long: true,
      },
      { id: "cta.primary", label: "Main button", text: "Check Your Eligibility" },
      { id: "cta.secondary", label: "WhatsApp button", text: "Chat on WhatsApp" },
    ],
  },
];
export const CASES_TEXT = toMap(CASES_TEXT_SECTIONS);

export const RATES_TEXT_SECTIONS: HomeTextSection[] = [
  {
    id: "hero",
    label: "Top of the page",
    hint: "The opening heading and paragraph. The rate rows are under Interest rates.",
    fields: [
      { id: "hero.eyebrow", label: "Small line", text: "Indicative Rates" },
      { id: "hero.title", label: "Heading", text: "Where loan rates start" },
      { id: "hero.gold", label: "End of the heading (gold)", text: "today." },
      { id: "hero.body1", label: "Paragraph: first sentence", text: "Starting rates by loan type, kept current by our team." },
      {
        id: "hero.body2",
        label: "Paragraph: last sentences (after the date)",
        text: "Your own rate depends on your profile — we shortlist the lender that offers you the best one.",
        long: true,
      },
    ],
  },
  {
    id: "body",
    label: "Under the table",
    hint: "The note and the three buttons.",
    fields: [
      {
        id: "note",
        label: "Expert note",
        text: "A rate table alone rarely tells the whole story. Some lenders favour salaried applicants, while others suit self-employed income or under-construction properties. Your expert studies your income, credit history and property before recommending the right lender.",
        long: true,
      },
      { id: "button.rate", label: "First button", text: "Get my rate" },
      { id: "button.emi", label: "Second button", text: "Work out my EMI" },
      { id: "button.call", label: "Call link", text: "or call {phone}" },
    ],
  },
  {
    id: "calc",
    label: "Calculators section",
    hint: "The heading above the calculators at the foot of the page.",
    fields: [
      { id: "calc.eyebrow", label: "Small line", text: "Put a rate to work" },
      { id: "calc.title", label: "Heading", text: "See what these rates mean for your EMI" },
      { id: "calc.body", label: "Text", text: "Pick a rate from the table above and try it here." },
    ],
  },
];
export const RATES_TEXT = toMap(RATES_TEXT_SECTIONS);

export const TOOLS_TEXT_SECTIONS: HomeTextSection[] = [
  {
    id: "hero",
    label: "Top of the page",
    hint: "The opening heading and paragraph. The calculator names are under Blocks.",
    fields: [
      { id: "hero.eyebrow", label: "Small line", text: "Calculators" },
      { id: "hero.title", label: "Heading", text: "Know Your Numbers." },
      { id: "hero.gold", label: "End of the heading (gold)", text: "Then Apply with Confidence." },
      {
        id: "hero.body",
        label: "Paragraph",
        text: "Ten free calculators covering every loan on our desk — from EMI and eligibility to CGTMSE fees. Pick a calculator from the menu. No signup required.",
        long: true,
      },
      { id: "menu.title", label: "Heading of the side menu", text: "Calculators" },
      {
        id: "note",
        label: "Note under a calculator",
        text: "Results are indicative and may vary according to lender policy. Final rates, charges and eligibility are decided by the lender.",
        long: true,
      },
    ],
  },
  {
    id: "cards",
    label: "Three info cards",
    hint: "The three cards at the foot of the page.",
    fields: [
      { id: "card1.title", label: "Card 1: heading", text: "How EMI is Calculated" },
      {
        id: "card1.body",
        label: "Card 1: text",
        text: "EMI = P × r × (1+r)^n / ((1+r)^n - 1), where P = principal, r = monthly rate, n = total months. A higher tenure reduces EMI but increases total interest.",
        long: true,
      },
      { id: "card2.title", label: "Card 2: heading", text: "What is FOIR?" },
      {
        id: "card2.body",
        label: "Card 2: text",
        text: "Fixed Obligation to Income Ratio (FOIR) is the percentage of your income going toward EMIs. Most banks use a 50-60% FOIR cap to determine your maximum loan eligibility.",
        long: true,
      },
      { id: "card3.title", label: "Card 3: heading", text: "Need Expert Advice?" },
      {
        id: "card3.body",
        label: "Card 3: text",
        text: "These calculators give estimates. Actual rates and eligibility depend on your profile, lender policies and property valuation. Talk to our experts for a precise assessment.",
        long: true,
      },
    ],
  },
];
export const TOOLS_TEXT = toMap(TOOLS_TEXT_SECTIONS);

export const ADVISOR_TEXT_SECTIONS: HomeTextSection[] = [
  {
    id: "hero",
    label: "Top of the page",
    hint: "The heading above the short questions. The questions themselves are not editable, because the answers depend on them.",
    fields: [
      { id: "hero.eyebrow", label: "Small line", text: "GCS Loan Expert" },
      { id: "hero.title", label: "Heading", text: "Tell us what you need." },
      { id: "hero.gold", label: "End of the heading (gold)", text: "We'll help you find the right direction." },
      {
        id: "hero.body",
        label: "Paragraph",
        text: "Answer a few short questions about your requirement. A GCS loan expert then checks which lender options may suit your profile and contacts you. This is an enquiry, not a loan approval.",
        long: true,
      },
    ],
  },
];
export const ADVISOR_TEXT = toMap(ADVISOR_TEXT_SECTIONS);
