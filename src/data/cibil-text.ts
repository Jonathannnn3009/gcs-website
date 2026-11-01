// The wording on the CIBIL page that is not part of the report request itself: the opening panel,
// the side notes and the heading above the calculators. Staff change it in the CRM (Settings ->
// CIBIL page); wherever they have not, the text here is used. {price} is the report price. The four
// steps are a list (page-lists.ts); the price and the UPI ID are under Contact & CIBIL.
// The request form's own questions and buttons are not editable here, because the flow depends on them.

import type { HomeTextSection } from "@/data/home-text";

export const CIBIL_TEXT_SECTIONS: HomeTextSection[] = [
  {
    id: "hero",
    label: "Opening panel",
    hint: "The dark panel at the top. The four steps under it are under Blocks.",
    fields: [
      { id: "hero.eyebrow", label: "Small line", text: "CIBIL & Credit Reports" },
      { id: "hero.title", label: "Heading", text: "Get Your Credit Report," },
      { id: "hero.gold", label: "End of the heading (gold)", text: "Without the Hassle." },
      {
        id: "hero.body",
        label: "Paragraph",
        text: "Pick your credit bureau, pay by UPI QR and share a few details. Our team pulls your TransUnion CIBIL, Experian, Equifax or CRIF High Mark report and sends it to you.",
        long: true,
      },
      { id: "hero.chip1", label: "First tag", text: "Soft enquiry, no score impact" },
      { id: "hero.chip2", label: "Second tag ({price} is the report price)", text: "Flat ₹{price}, paid by UPI" },
      { id: "hero.chip3", label: "Third tag", text: "4 credit bureaus" },
      {
        id: "hero.estimator",
        label: "Link to the estimator",
        text: "Not sure where you stand? Try our Credit Score Estimator",
      },
    ],
  },
  {
    id: "dial",
    label: "Score dial",
    hint: "The words under the dial in the opening panel.",
    fields: [
      { id: "dial.label", label: "Label", text: "Credit score range" },
      { id: "dial.note", label: "Line under it", text: "Know where you stand before you apply for a loan." },
    ],
  },
  {
    id: "notes",
    label: "Side notes",
    hint: "The two boxes beside the request form.",
    fields: [
      { id: "notes.title", label: "First box: heading", text: "Good to know" },
      {
        id: "notes.p1",
        label: "First box: first point",
        text: "Checking your own report is a soft enquiry. It doesn't lower your score.",
        long: true,
      },
      {
        id: "notes.p2",
        label: "First box: second point",
        text: "Growth Capital Services is independent of TransUnion CIBIL, Experian, Equifax and CRIF High Mark; their names only tell us which report you want.",
        long: true,
      },
      { id: "estimator.title", label: "Second box: heading", text: "Credit Score Estimator" },
      {
        id: "estimator.body",
        label: "Second box: text",
        text: "Not sure where you stand? Get an indicative score range in a minute, before you request your report.",
        long: true,
      },
      { id: "estimator.button", label: "Second box: button", text: "Try the estimator" },
    ],
  },
  {
    id: "calculators",
    label: "Calculators section",
    hint: "The heading above the calculators at the foot of the page.",
    fields: [
      { id: "calc.eyebrow", label: "Small line", text: "Before you request a report" },
      { id: "calc.title", label: "Heading", text: "Get a feel for your score and what it can borrow" },
      {
        id: "calc.body",
        label: "Text",
        text: "An indicative score range, and what that means for your EMI and eligibility. A quick estimate, not a bureau pull.",
        long: true,
      },
    ],
  },
];

/** Every field's built-in text, by id. */
export const CIBIL_TEXT: Record<string, string> = Object.fromEntries(
  CIBIL_TEXT_SECTIONS.flatMap((s) => s.fields.map((f) => [f.id, f.text])),
);
