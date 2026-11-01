// The wording on the CIBIL Advisory page that is not part of a card list or a picture. Staff change it
// in the CRM (Settings -> CIBIL Advisory page); wherever they have not, the text here is used.
// The service cards, benefit strips and example pictures are built into the page.

import type { HomeTextSection } from "@/data/home-text";

export const ADVISORY_TEXT_SECTIONS: HomeTextSection[] = [
  {
    id: "hero",
    label: "Opening panel",
    hint: "The dark panel at the top.",
    fields: [
      { id: "hero.eyebrow", label: "Small line", text: "CIBIL Advisory Services" },
      { id: "hero.title", label: "Heading", text: "Understand your credit." },
      { id: "hero.gold", label: "End of the heading (gold)", text: "Improve it, step by step." },
      {
        id: "hero.body",
        label: "Paragraph",
        text: "Your credit report decides how lenders see you. Our experts help individuals and business owners read their report, spot problems and make a clear plan before they apply for a loan.",
        long: true,
      },
      { id: "hero.primary", label: "Main button", text: "Request a Call Back" },
      { id: "hero.secondary", label: "WhatsApp button", text: "Talk to Our Loan Expert" },
    ],
  },
  {
    id: "basics",
    label: "Why credit matters",
    hint: "The first block, beside the phone picture. The tick points are built into the page.",
    fields: [
      { id: "basics.eyebrow", label: "Small line", text: "Credit Basics" },
      { id: "basics.title", label: "Heading", text: "Why credit" },
      { id: "basics.gold", label: "End of the heading (gold)", text: "matters." },
      { id: "basics.lead", label: "Bold line", text: "Your credit score is your financial passport." },
      {
        id: "basics.body",
        label: "Paragraph",
        text: "A credit score is a three-digit number (300 to 900) that shows how reliably you have handled credit in the past. It helps banks and financial institutions decide whether to give you a loan, a credit card or another financial product.",
        long: true,
      },
      { id: "basics.note", label: "Note under the picture", text: "An example to explain the idea, not a real score." },
    ],
  },
  {
    id: "individuals",
    label: "For individuals",
    hint: "The block for individuals. The service cards are built into the page.",
    fields: [
      { id: "individuals.eyebrow", label: "Small line", text: "Our Services · Individuals" },
      { id: "individuals.title", label: "Heading", text: "For individuals." },
      {
        id: "individuals.body",
        label: "Text",
        text: "Understand your credit and get ready for the loan you want.",
        long: true,
      },
    ],
  },
  {
    id: "business",
    label: "For businesses",
    hint: "The block for businesses. The service cards are built into the page.",
    fields: [
      { id: "business.eyebrow", label: "Small line", text: "Our Services · Business" },
      { id: "business.title", label: "Heading", text: "For businesses" },
      { id: "business.gold", label: "End of the heading", text: "(MSME & corporate)." },
      {
        id: "business.body",
        label: "Text",
        text: "Build your business credit and get ready for growth funding.",
        long: true,
      },
      { id: "visual.note", label: "Note under the example pictures", text: "Examples to explain the idea." },
    ],
  },
  {
    id: "audience",
    label: "Who it is for",
    hint: "The heading above the four kinds of customer.",
    fields: [
      { id: "audience.eyebrow", label: "Small line", text: "Who It Is For" },
      { id: "audience.title", label: "Heading", text: "Whether you are an individual or a business." },
    ],
  },
  {
    id: "how",
    label: "How it works",
    hint: "The heading above the five steps and the line under them.",
    fields: [
      { id: "how.eyebrow", label: "Small line", text: "How It Works" },
      { id: "how.title", label: "Heading", text: "Five simple steps." },
      { id: "how.body", label: "Text", text: "No jargon. A clear path, one step at a time." },
      { id: "how.closing", label: "Line beside the stairs", text: "A step-by-step journey towards" },
      { id: "how.closingGold", label: "End of that line (gold)", text: "a stronger credit future." },
    ],
  },
  {
    id: "talk",
    label: "Talk to us",
    hint: "The block beside the callback form.",
    fields: [
      { id: "talk.eyebrow", label: "Small line", text: "Talk to Us" },
      { id: "talk.title", label: "Heading", text: "Better credit health helps" },
      { id: "talk.gold", label: "End of the heading (gold)", text: "every loan you apply for." },
      {
        id: "talk.body",
        label: "Paragraph",
        text: "A clear credit report can make your cash flow easier to plan, give lenders more confidence in you, and help you avoid surprises when you apply. Share your details and a loan expert will call you back.",
        long: true,
      },
      { id: "talk.report", label: "First link", text: "Get your credit report" },
      { id: "talk.estimator", label: "Second link", text: "Try the score estimator" },
      { id: "talk.noteLabel", label: "Bold start of the important note", text: "Important note:" },
      {
        id: "talk.note",
        label: "Important note",
        text: "Growth Capital Services is a loan consultant. We are not a credit bureau or a lender. Only the credit bureau and the lender can correct or change what is in your report, after their own checks. We cannot promise a change in your score or the approval of a loan. Results depend on your credit history, your profile and each lender's policy. The scores, ranks and tick-lists shown on this page are examples to explain the idea, not real data.",
        long: true,
      },
    ],
  },
];

/** Every field's built-in text, by id. */
export const ADVISORY_TEXT: Record<string, string> = Object.fromEntries(
  ADVISORY_TEXT_SECTIONS.flatMap((s) => s.fields.map((f) => [f.id, f.text])),
);
